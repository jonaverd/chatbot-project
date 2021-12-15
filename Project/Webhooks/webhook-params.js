
// Libreria necesaria para DialogFlow
const { WebhookClient } = require('dialogflow-fulfillment');

// Informacion recibida
exports.info = "Nothing";

// Peticion Webhook POST que se nos pide desde DialogFlow 
// express.json() sirve para traducir a lenguaje json
exports.webhookparams = function (req, res, port) {
  
  // Inicializacion del agente (SE TRATA DE LA PETICION DE ENTRADA QUE ESCRIBE EL USUARIO,
  // LA FRASE DE ENTRENAMIENTO)
  const agent = new WebhookClient({ request: req, response: res });

  // Informacion extra para la consola (igual que hacia Google)
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
 
  // Custom Intent INT_WebhookParametros
  // "Con la funcion agent.parameters.body podemos coger los parametros de entrada"
  function webhook_params(agent) {
    agent.add(`Te envio la respuesta desde el servidor ` + port + ' y has dicho "' + agent.parameters.any + '"');

    // Mostrar información recibida por pantalla
    console.log(`Te envio la respuesta desde el servidor ` + port + ' y has dicho "' + agent.parameters.any + '"');
    exports.info = "Te envio la respuesta desde el servidor " + port + " y has dicho " + agent.parameters.any;
  }

  // En este array asociamos el nombre del Intent de DialogFlow con su funcion
  // (Se envia una peticion con el intent de fuera y lo asociamos con la funcion de aqui)
  let intentMap = new Map();
  intentMap.set('INT_WebhookParametros', webhook_params);

  // Aqui se captan las intenciones
  agent.handleRequest(intentMap);
}
