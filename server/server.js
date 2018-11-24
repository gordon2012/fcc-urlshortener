import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../common/App';

const app = express();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static('.build/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/fcc-urlshortener');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
let Url;
db.once('open', () => {
  console.log('Connected');

  const urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number
  });

  try {
    console.log('Trying to load model.');
    Url = mongoose.model('Url');
    console.log('Model loaded.');
  } catch (error) {
    console.log('Model not found.');
    Url = mongoose.model('Url', urlSchema);
    console.log('Model created.');
  }
});

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

app.get('/api/shorturl/list', (req, res) => {
  if (!Url) {
    res.json({ loading: true });
    return;
  }

  Url.find((err, urls) => {
    res.json(urls);
  });
});

app.post('/api/shorturl/new', function(req, res) {
  if (!Url) {
    res.json({ loading: true });
    return;
  }

  const data = { ...req.body, short_url: 1 };

  const newUrl = new Url(data);
  newUrl
    .save()
    .then(item => {
      console.log(item);
      res.json({ success: true });
    })
    .catch(err => {
      res.status(400).json({ success: false });
    });
});

export default app;
