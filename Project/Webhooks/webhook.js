
// Libreria necesaria para DialogFlow
const { WebhookClient } = require('dialogflow-fulfillment');

// Peticion Webhook POST que se nos pide desde DialogFlow 
// express.json() sirve para traducir a lenguaje json
exports.webhook = function (req, res, port) {
  
  // Inicializacion del agente (SE TRATA DE LA PETICION DE ENTRADA QUE ESCRIBE EL USUARIO,
  // LA FRASE DE ENTRENAMIENTO)
  const agent = new WebhookClient({ request: req, response: res });

  // Informacion extra para la consola (igual que hacia Google)
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
 
  // Default Welcome Intent
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  // Default Fallback Intent
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Custom Intent INT_Webhook
  function webhook(agent) {
    agent.add(`Te envio la respuesta desde el servidor ` + port);

    // Mostrar información recibida por pantalla
    console.log(`Te envio la respuesta desde el servidor ` + port);
    exports.info = "Te envio la respuesta desde el servidor " + port;
  }

  // En este array asociamos el nombre del Intent de DialogFlow con su funcion
  // (Se envia una peticion con el intent de fuera y lo asociamos con la funcion de aqui)
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('INT_Webhook', webhook);

  // Aqui se captan las intenciones
  agent.handleRequest(intentMap);
}
