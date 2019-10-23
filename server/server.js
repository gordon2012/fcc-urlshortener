import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dns from 'dns';
import 'babel-polyfill';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../common/App';

const app = express();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static('.build/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let Url;
try {
    console.log('Trying to load model.');
    Url = mongoose.model('url');
    console.log('Model loaded.');
} catch (error) {
    console.log('Model not found.');
    const urlSchema = new mongoose.Schema({
        original_url: String,
        short_url: Number,
    });
    Url = mongoose.model('url', urlSchema);
    console.log('Model created.');
}

app.get('/', function(req, res) {
    const script =
        app.get('env') === 'production'
            ? 'client.js'
            : 'http://localhost:3000/client.js';

    const title = 'URL Shortener Microservice';
    const application = renderToString(<App />);

    const html = `<!doctype html>
        <html class="no-js" lang="">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>${title} | freeCodeCamp</title>
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width,  initial-scale=1">
            </head>
            <body>
                <div id="root">${application}</div>
                <script src="${script}"></script>
            </body>
        </html>`;

    res.send(html);
});

app.get('/api/shorturl/list', async (req, res) => {
    console.log('!!GET /api/shorturl/list');
    if (!Url) {
        res.json({ loading: true });
        return;
    }

    try {
        const urls = await Url.find({});
        res.json(urls);
    } catch (err) {
        res.json({ error: 'error getting list' });
    }
});

app.get('/api/shorturl/:id', async (req, res) => {
    if (!Url) {
        res.json({ loading: true });
        return;
    }

    const { id } = req.params;
    const doc = await Url.findOne({ short_url: id });
    res.status(301).redirect(doc.original_url);
});

app.post('/api/shorturl/new', async function(req, res) {
    if (!Url) {
        res.json({ loading: true });
        return;
    }

    const { original_url: url } = req.body;

    // URL must exist and be a string
    if (typeof url !== 'string') {
        console.log(`Invalid URL: Missing or not a string`);
        res.json({ error: 'Invalid URL' });
        return;
    }

    // URL must pass regex check
    if (
        !url.match(
            /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g
        )
    ) {
        console.log(`Invalid URL: Fails regex check`);
        res.json({ error: 'Invalid URL' });
        return;
    }

    // URL must dns resolve
    try {
        await (url => {
            return new Promise((resolve, reject) => {
                dns.resolve4(url, (err, addr) => {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(addr);
                    }
                });
            });
        })(url.split(url.match(/^(?:http(s)?:\/\/)/g))[1]);
    } catch (err) {
        console.log(`Invalid URL: DNS lookup fail: ${JSON.stringify(err)}`);
        res.json({ error: 'Invalid URL' });
        return;
    }

    // URL must not be duplicate, return existing if it is
    let duplicate;
    await Url.findOne({ original_url: url }, '-_id -__v', (err, doc) => {
        if (doc) {
            res.json(doc);
            duplicate = true;
        }
    });
    if (duplicate) {
        return;
    }

    // All good, make a new one with highest short_url + 1
    Url.findOne({})
        .sort('-short_url')
        .exec((err, doc) => {
            const next = doc ? doc.short_url + 1 : 1;
            const newUrl = new Url({
                original_url: url,
                short_url: next,
            });
            newUrl
                .save()
                .then(doc => {
                    const { original_url, short_url } = doc;
                    res.json({ original_url, short_url });
                })
                .catch(err => {
                    res.status(400).json({ success: false });
                });
        });
});

app.delete('/api/shorturl/delete/:id', async function(req, res) {
    if (!Url) {
        res.json({ loading: true });
        return;
    }

    const { id } = req.params;

    Url.findOneAndDelete({ _id: id }, (err, doc) => {
        if (err) {
            console.log({ error: JSON.stringify(err) });
            res.json({ error: JSON.stringify(err) });
            return;
        }
        const { original_url, short_url } = doc;
        res.json({ deleted: { original_url, short_url } });
    });
});

export default app;
