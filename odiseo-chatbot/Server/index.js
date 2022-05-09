// Iniciar servidor local con ngrok.exe http 8080
'use strict';

// Credentials Google Cloud
require('dotenv').config()
console.log(`Credentials configured with: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

// Librerias importadas
const express = require('express');
const path = require('path');

// Librerias personales
const dialogFlowApp = require('../Functions/agent-dialogflow.js')
const actionsGoogleApp = require('../Functions/agent-actionsgoogle.js')

// Concurrencia
var cluster = require('cluster');
var numWorkers = process.env.WEB_CONCURRENCY || 1;

// Actualizar la interaccion donde espera un input
// Similar a los user.params del Asistente (datos de la sesion)
// Auxiliar - Parametros del middleware para el login en cada peticion
// Similar a los user.params del Asistente (datos de la sesion)
const localStorages = new Map();
const NodeCache = require("node-cache");

// Concurrencia
if(cluster.isMaster) {
  // Master process: fork our child processes
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  // Respawn any child processes that die
  cluster.on('exit', function() {
    cluster.fork();
  });

} else {
  // Child process, put app initialisation code here.
  // Add the router
  const router = express.Router();

  // Inicializacion del servidor
  const expressApp = express();

  // Parse URL-encoded bodies (as sent by HTML forms)
  expressApp.use(express.urlencoded({ extended: true }));

  // Parse JSON bodies (as sent by API clients)
  expressApp.use(express.json());

  // Router link
  expressApp.use('/', router);

  // Puerto del servidor
  const port = process.env.PORT || 3000;

  // HTML Dinamico
  expressApp.set("view engine", "pug");
  expressApp.set("views", path.join(__dirname, "/Views"));

  // middleware specific to this router
  router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  // Express App fulfillment route (POST). 
  router.post('/agent/dialogflow', async function (req, res){
    // Se inicia un local storage por sesion
    var store;
    if(localStorages.has(req.body.session)){ 
      store = localStorages.get(req.body.session) 
    }
    else { 
      store = new NodeCache();
      localStorages.set(req.body.session, store)
    }
    // await refreshCloudIntents() Se revisan las actualizaciones de Google Cloud Intents
    await dialogFlowApp.agent(req, res, store);
  })

  // Express App fulfillment Chat Web. 
  router.get('/', async function (req, res){
  res.sendFile('dialogflow.html', {
    root: path.join(__dirname, './Views')
  })
  })

  // Express App fulfillment route (POST). 
  // The entire actionsGoogleApp object (incl its handlers) is the callback handler for this route.
  router.post('/agent/actions', actionsGoogleApp)

  // Local ngrok server logic. 
  // Ensure that you set $env:IS_LOCAL_DEV="true" in terminal before to start
  expressApp.listen(port, () =>
      console.log(`Server is connected on port: ${port}`)
  );
}

    


