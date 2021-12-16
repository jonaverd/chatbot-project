
/** Primero iniciar en local con "npm start" y 
** luego en la carpeta de ngrok iniciar el publico 
** con "./ngrok http PUERTO" 
**/

// Archivos locales importados
const databaseFile = require('./Database/MongoDB/Connection/mongodb.js');

// Archivos locales importados
const databaseInsert = require('./Database/MongoDB/Operations/insert-data.js');

// Archivos locales importados
const databaseReceive = require('./Database/MongoDB/Operations/receive-data.js');

// Archivos locales importados
const webhookFile = require('./Examples/Fulfillment/webhook.js');

// Archivos locales importados
const webhookFileParam = require('./Examples/Fulfillment/webhook-params.js');

// Archivos locales importados
const webhookFileApiCreate = require('./Examples/GCloud-API/webhook-api-create.js');

// Archivos locales importados
const webhookFileApiList = require('./Examples/GCloud-API/webhook-api-list.js');

// Archivos locales importados
const webhookFileApiDelete = require('./Examples/GCloud-API/webhook-api-delete.js');

// Archivos locales importados
const apiTools = require('./Prototype/webhook-api-tools.js');

// Archivos locales importados
const prototypeAddQuestion = require('./Prototype/webhook-training.js');

// Libreria DialogFlow
const dialogflow = require('@google-cloud/dialogflow');

// Libreria para abrir un servidor local
const express = require('express');

// Inicializacion del servidor
const app = express();

// Puerto del servidor
const port = 8080;

// Peticion GET de bienvenida a la pagina
app.get('/server', function (req, res) {
  res.send('<h3>Bienvenido al servidor NodeJS del agente Odiseo</h3>'+
  '<h4><a href="/server/webhook">/server/webhook</a> para ver respuestas de los webhook por fillfullment desde la interfaz (incluido parametros)</h4>' + 
  '<i>nada: si se llama al intent solo para conectar</i> <br></br>' + 
  '<i>puerto y texto: si se conecta el intent con parametros</i>' + 
  '<h4><a href="/server/api/list">/server/api/list</a> para usar la api de cloud y ver la lista de intents actuales</h4>' + 
  '<h4><a href="/server/api/create">/server/api/create</a> para usar la api de cloud y crear un intent de prueba</h4>' + 
  '<i>error: si el intent ya existe</i>' + 
  '<h4><a href="/server/api/delete/">/server/api/delete/:id</a> para usar api de cloud y borrar intent (id) </h4>'+
  '<i>error: si el intent no existe</i>' +
  '<h4><a href="/server/db/test/">/server/db/test/</a> para usar mongodb y probar conexion </h4>'+
  '<i>error: si la cadena de conexion falla</i>'+
  '<h4><a href="/server/db/setdata/">/server/db/setdata/</a> para usar mongodb e insertar datos de ejemplo</h4>'+
  '<i>error: si la conexion falla</i><br></br>' +
  '<i>¡aviso! timeout buffer: reintentar de nuevo</i>' + 
  '<h4><a href="/server/db/getdata/">/server/db/getdata/</a> para usar mongodb y consultar datos de ejemplo</h4>' +
  '<i>error: si la conexion falla</i><br></br>' +
  '<i>¡aviso! timeout buffer: reintentar de nuevo</i>');})

//###################################################################################################
app.get('/prototype', function (req, res) {
  res.send('<h3>Bienvenido al prototipo NodeJS del agente de prueba Odiseo</h3>' +
  '<h4><a href="/prototype/check">Comprobar</a> si existe el intent "ThisIntent?"</h4>' + 
  '<i>error: si la conexion falla</i>');
})

app.get('/prototype/check', async function (req, res) {
  prototypeUseful.checkQuestion("ThisIntent?");
  res.send('<h3>Acciones Prototipo API Cloud</h3><h4>Comprobando si existe intent...</h4>' + 
  '<br></br><i><a href="/prototype">Volver</a> al menu principal</i>');      
})

app.post('/prototype', express.json(), function (req, res) { 
  prototypeAddQuestion.addQuestion(req, res);
})

app.get('/check', async function (req, res) {

 
})

//###################################################################################################

// Peticion GET de ultima respuesta del webhook
app.get('/server/webhook', function (req, res) {
  if(webhookFile.info==undefined){
    res.send('<h4>¡El webhook no ha recibido ningun parametro! </h4>' + 
    '<br></br><i><a href="/server">Volver</a> al menu principal</i>');
  }
  else{
    res.send('<h4>El ultimo parametro recibido es: </h4>' + webhookFileParam.info + 
    '<br></br><i><a href="/server">Volver</a> al menu principal</i>');
  }
})

// Peticion POST de enviar informacion al webhook normal/parametros
app.post('/server/webhook', express.json(), function (req, res) { 
  if(req.body.queryResult.queryText=="Conecta Odiseo"){
    webhookFile.webhook(req, res, port);
  }
  else{
    webhookFileParam.webhookparams(req, res, port);
  }
})

// Peticion GET de interacciones con la api de google cloud / Crear Intent
app.get('/server/api/create', function (req, res) { 
  webhookFileApiCreate.createIntent();
  res.send('<h3>Acciones API Cloud</h3><h4>Creando intent de prueba...</h4>' + 
  '<br></br><i><a href="/server">Volver</a> al menu principal</i>');       
})

// Peticion GET de interacciones con la api de google cloud / Listar Intent
app.get('/server/api/list', function (req, res) { 
  webhookFileApiList.listIntent();
  res.send('<h3>Acciones API Cloud</h3><h4>Listando intents de prueba...</h4>' +
  '<br></br><i><a href="/server">Volver</a> al menu principal</i>'); 
})

// Peticion GET de interacciones con la api de google cloud / Borrar Intent
app.get('/server/api/delete/:intentId', function (req, res) { 
  webhookFileApiDelete.deleteIntent(req.params.intentId);
  res.send('<h3>Acciones API Cloud</h3><h4>Borrando intent de prueba...</h4>' +
  '<br></br><i><a href="/server">Volver</a> al menu principal</i>');  
})

// Peticion GET de interacciones con la base de datos MongoDB/ Probar Conexion
app.get('/server/db/test', function (req, res) { 
  databaseFile.testConnection();
  res.send('<h3>Acciones Mongo Database</h3><h4>Probando conexion a la base de datos...</h4>' +
  '<h5>Puede tardar en cargar los datos por la consola...</h5>' +
  '<br></br><i><a href="/server">Volver</a> al menu principal</i>'); 
})

// Peticion GET de interacciones con la base de datos MongoDB/ Insertar Datos
app.get('/server/db/setdata', function (req, res) { 
  databaseInsert.insert();
  res.send('<h3>Acciones Mongo Database</h3><h4>Insertando datos de la base de datos...</h4>' +
  '<h5>Puede tardar en cargar los datos por la consola...</h5>' +
  '<br></br><i><a href="/server">Volver</a> al menu principal</i>'); 
})

// Peticion GET de interacciones con la base de datos MongoDB/ Recuperar Datos
app.get('/server/db/getdata', function (req, res) { 
  databaseReceive.receive();
  res.send('<h3>Acciones Mongo Database</h3><h4>Consultando datos de la base de datos...</h4>' +
  '<h5>Puede tardar en cargar los datos por la consola...</h5>' +
  '<br></br><i><a href="/server">Volver</a> al menu principal</i>'); 
})

// Puerto escuchando peticiones 
// Se desviará a nGrok para hacerlo público
app.listen(port, function() {
    console.log('Server on port ' + port + '...');
});

