
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
const express = require('express');
const path = require('path');

// Inicializacion del servidor
const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

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
    const input = req.body.queryResult.intent.displayName;
    return input.includes(order);
  }

  // Actuamos y servimos una respuesta al usuario
  switch(true){
    case contains("INT_Webhook"): 
      webhookFile.webhook(req, res, port);
      break;
    case contains("INT_WebhookParametros"): 
      webhookFileParam.webhookparams(req, res, port);
      break;
    case contains("PTE_ActivarEnseñanza"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_ActivarGuardarPregunta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_GuardarPregunta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_GuardarRespuesta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_ActivarCambiarRespuesta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_SeleccionarPregunta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_CambiarRespuesta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_ActivarBorrarPregunta"): 
      prototypeTraining.addLearning(req, res);
      break;
    case contains("PTE_SeleccionarPreguntaDL"): 
      prototypeTraining.addLearning(req, res);
      break;
    default:
      res.send();
  }
})

// Peticion GET por defecto
router.get('/', function (req, res) {
  res.redirect('/server');
})

// Peticion GET de bienvenida a la pagina
router.get('/server', function (req, res) {
  res.sendFile(path.join(__dirname, "/Prototype/Views/index.html"));
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
  const id = await apiTools.getIDIntent_Name("INT_API_CREATE");
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

// Peticion POST de interacciones con el prototipo/ ApiTools - Crear intent
router.post('/server/prototype/apitools/intents/create', async function (req, res) { 
  var nameValue = req.body.inputconfirm;
  await apiTools.createIntent(nameValue);
  res.redirect('/server/prototype/apitools/intents/list');
})

// Peticion GET de interacciones con el prototipo/ ApiTools - Lista detallada
router.get('/server/prototype/apitools/intents/list', async function (req, res) { 
  const list = await apiTools.getIntentList();
  res.render("list", {intents: list, getidfunction: apiTools.getIDIntent_Path, exists: apiTools.checkNotUndefined});
})

// Peticion GET de interacciones con el prototipo/ ApiTools - Detalles del intent
router.get('/server/prototype/apitools/intents/:id/details', async function (req, res) { 
  const actualid = req.params['id'];
  const actualstruct = await apiTools.getIntent(actualid);
  res.render("details", {intent: actualstruct[0], id: actualid, exists: apiTools.checkNotUndefined});
})

// Peticion GET de interacciones con el prototipo/ ApiTools - Detalles del intent
router.get('/server/prototype/apitools/intents/:id/delete', async function (req, res) { 
  const actualid = req.params['id'];
  await apiTools.deleteIntent(actualid);
  res.redirect('/server/prototype/apitools/intents/list');
})

// Peticion GET de interacciones con el prototipo/ ApiTools - Detalles del intent
router.post('/server/prototype/apitools/intents/:id/update', async function (req, res) { 
  const actualid = req.params['id'];
  const data = req.body.inputupdatenew;
  const type = req.body.typeupdate;
  const newstruct = await apiTools.getIntent(actualid);
  switch (type) {
    case "displayName":
      newstruct[0].displayName = data;
      break;
    default:
  }
  await apiTools.updateIntent(actualid, newstruct[0]);
  res.redirect('/server/prototype/apitools/intents/' + actualid +'/details');
})







