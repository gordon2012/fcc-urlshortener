import express from 'express';
import cors from 'cors';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../common/App';

const app = express();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static('.build/public'));

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

app.get('/api/:input?', function(req, res) {
  const { input } = req.params;

  res.json({ ...(input ? { input } : {}), end: 'back' });
});

export default app;
