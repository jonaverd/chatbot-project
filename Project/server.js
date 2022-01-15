
/** Iniciar en local con "npm start" **/

// Archivos locales importados
const databaseFile = require('./Database/MongoDB/Connection/mongodb.js');
const databaseInsert = require('./Database/MongoDB/Operations/insert-data.js');
const databaseReceive = require('./Database/MongoDB/Operations/receive-data.js');
const webhookFile = require('./Examples/Fulfillment/webhook.js');
const webhookFileParam = require('./Examples/Fulfillment/webhook-params.js');
const webhookFileApiCreate = require('./Examples/GCloud-API/webhook-api-create.js');
const webhookFileApiList = require('./Examples/GCloud-API/webhook-api-list.js');
const webhookFileApiDelete = require('./Examples/GCloud-API/webhook-api-delete.js');
const apiTools = require('./Prototype/webhook-api-tools.js');
const prototypeTraining = require('./Prototype/webhook-training.js');

// Librerias importadas
const dialogflow = require('@google-cloud/dialogflow');
const express = require('express');
const path = require('path');

// Inicializacion del servidor
const app = express();
const router = express.Router();

// Puerto del servidor
const port = 8080;

// Add the router
app.use('/', router);

// HTML Dinamico
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/Prototype/Views"));

// Puerto escuchando peticiones 
// Se desviará a nGrok para hacerlo público
app.listen(port, function() {
  console.log('Server on port ' + port + '...');
});

// Peticion POST de enviar informacion al servidor desde la interfaz
router.post('/server', express.json(), function (req, res) { 

  // Identificamos que tipo frase de entrenamiento recibimos por el chat
  function contains(order) { 
    const input = req.body.queryResult.queryText;
    return input.includes(order);
  }

  // Actuamos y servimos una respuesta al usuario
  switch(true){
    case contains("Conecta Odiseo"): 
      webhookFile.webhook(req, res, port);
      break;
    case contains("Conecta y Repite Odiseo"): 
      webhookFileParam.webhookparams(req, res, port);
      break;
    default:
      prototypeTraining.addQuestion(req, res);
  }
})

// Peticion GET por defecto
router.get('/', function (req, res) {
  res.redirect('/server');
})

// Peticion GET de bienvenida a la pagina
router.get('/server', function (req, res) {
  res.send(''
  + '<h3><i>Servidor Pruebas Chatbot Odiseo</i></h3>'
  + '<h4>Fullfillment Webhook (Interfaz DialogFlow)</h4>' 
  + '<ul>'  
  + '<li><a href="/server/webhook">Respuesta desde NodeJS</a></li>' 
  + '</ul>' 
  + '<h4>Google Cloud API (Uso de credenciales)</h4>' 
  + '<ul>' 
  + '<li><a href="/server/api/list">Listar intents actuales</a></li>' 
  + '<li><a href="/server/api/create">Crear intent de prueba "int_api_create"</a></li>' 
  + '<li><a href="/server/api/delete/">Borrar intent de prueba "int_api_create"</a></li>' 
  + '</ul>'
  + '<h4>Database MongoCloud (Uso de conexion)</h4>' 
  + '<ul>'
  + '<li><a href="/server/db/test/">Comprobar cadena de conexion</a></li>'
  + '<li><a href="/server/db/setdata/">Insertar datos</a></li>'
  + '<li><a href="/server/db/getdata/">Consultar datos</a></li>' 
  + '</ul>'
  + '<h4>Prototype Questions/Answers</h4>'
  + '<ul>'
  + '<li><a href="/server/prototype/apitools/reset"> Restablecer intent "tools_check"</a></li>'
  + '<li><a href="/server/prototype/apitools/list"> Mostrar lista detallada de intents</a></li>'
  + '<li><a href="/server/prototype/apitools/setdisplayname"> Modificar displayname del intent "tools_check"</a></li>'
  + '</ul>'
  );
})

// Peticion GET de ultima respuesta del webhook
router.get('/server/webhook', function (req, res) {
  if(webhookFileParam.info=="Nothing"){
    res.send('<h3>Acciones FullFillment Webhook</h3><h4>Mostrando respuesta sin parametros...</h4>' +
    '<a href="/server">Volver al menu principal</a>');
  }
  else{
    res.send('<h3>Acciones FullFillment Webhook</h3><h4>Mostrando respuesta con parametros...</h4>' + 
    '<ul><li>' + webhookFileParam.info + '</li></ul>' +
    '<a href="/server">Volver al menu principal</a>');
  }
})

// Peticion GET de interacciones con la api de google cloud / Listar Intent
router.get('/server/api/list', function (req, res) { 
  webhookFileApiList.listIntent();
  res.send('<h3>Acciones API Cloud</h3><h4>Listando intents de prueba...</h4>' +
  '<a href="/server">Volver al menu principal</a>'); 
})

// Peticion GET de interacciones con la api de google cloud / Crear Intent
router.get('/server/api/create', function (req, res) { 
  webhookFileApiCreate.createIntent();
  res.send('<h3>Acciones API Cloud</h3>' + '<h4>Creando intent de prueba...</h4>' + 
  '<a href="/server">Volver al menu principal</a>');       
})

// Peticion GET de interacciones con la api de google cloud / Borrar Intent
router.get('/server/api/delete', async function (req, res) { 
  const id = await apiTools.getIdIntentfromName("INT_API_CREATE");
  webhookFileApiDelete.deleteIntent(id);
  res.send('<h3>Acciones API Cloud</h3><h4>Borrando intent de prueba...</h4>' +
  '<a href="/server">Volver al menu principal</a>');  
})

// Peticion GET de interacciones con la base de datos MongoDB/ Probar Conexion
router.get('/server/db/test', function (req, res) { 
  databaseFile.testConnection();
  res.send('<h3>Acciones Mongo Database</h3><h4>Probando conexion a la base de datos...</h4>' +
  '<a href="/server">Volver al menu principal</a>'); 
})

// Peticion GET de interacciones con la base de datos MongoDB/ Insertar Datos
router.get('/server/db/setdata', function (req, res) { 
  databaseInsert.insert();
  res.send('<h3>Acciones Mongo Database</h3><h4>Insertando datos de la base de datos...</h4>' +
  '<a href="/server">Volver al menu principal</a>'); 
})

// Peticion GET de interacciones con la base de datos MongoDB/ Recuperar Datos
router.get('/server/db/getdata', function (req, res) { 
  databaseReceive.receive();
  res.send('<h3>Acciones Mongo Database</h3><h4>Consultando datos de la base de datos...</h4>' +
  '<a href="/server">Volver al menu principal</a>'); 
})

// Peticion GET de interacciones con el prototipo/ ApiTools - Reset
router.get('/server/prototype/apitools/reset', async function (req, res) { 
  const intentsClient = new dialogflow.IntentsClient();
  const request = { name: "projects/odiseo-chatbot/agent/intents/de5af645-97f1-4440-8e1d-00e239057372" };
  const intentStruct = await intentsClient.getIntent(request);
  await apiTools.setIntentDisplayName(intentStruct[0].displayName,"TOOLS_CHECK");
  res.send('<h3>Acciones Prototipo</h3><h4>Reiniciando la informacion del intent...</h4>' +
  '<a href="/server">Volver al menu principal</a>'); 
})

// Peticion GET de interacciones con el prototipo/ ApiTools - Lista detallada
router.get('/server/prototype/apitools/list', async function (req, res) { 
  const list = await apiTools.getIntentList();
  res.render("index", {intents: list, getidfunction: apiTools.getIdIntentfromPath});
  
})

// Peticion GET de interacciones con el prototipo/ ApiTools - SetDisplayName 
router.get('/server/prototype/apitools/setdisplayname', async function (req, res) { 
  await apiTools.setIntentDisplayName("TOOLS_CHECK","HOLA");
  res.send('<h3>Acciones Prototipo</h3><h4>Modificando nombre del intent...</h4>' +
  '<a href="/server">Volver al menu principal</a>'); 
})



