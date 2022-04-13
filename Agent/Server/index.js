// Iniciar servidor local con ngrok.exe http 8080
'use strict';

// Librerias importadas
const express = require('express');
const path = require('path');
const router = require('./routes.js');

// Inicializacion del servidor
const expressApp = express();

// Parse URL-encoded bodies (as sent by HTML forms)
expressApp.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
expressApp.use(express.json());

// Router link
expressApp.use('/', router);

// Puerto del servidor
const port = process.env.PORT || 8080;

// HTML Dinamico
expressApp.set("view engine", "pug");
expressApp.set("views", path.join(__dirname, "/Views"));

// Local ngrok server logic. 
// Ensure that you set $env:IS_LOCAL_DEV="true" in terminal before to start
if (process.env.IS_LOCAL_DEV) {
    expressApp.listen(port, () =>
        console.log(`-- server running locally on port ${port} --`)
    );
} else {
console.log("-- not locally served - or - local env var not set --");
}
