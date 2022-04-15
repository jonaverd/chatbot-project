
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion, Image} = require('dialogflow-fulfillment');

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.agent = async function (req, res) {
  
  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });

  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  console.log('DialogFlow Panel Detected')

  // input.welcome
  function ConversationBasic_Welcome(agent) {
    agent.add(new Image(referencesURI.imageURI_Welcome));
    agent.add('¡Bienvenido! Soy Odiseo, tu agente educativo. ¿Que quieres hacer? Aquí te dejo algunas sugerencias:');
    agent.add(new Suggestion('Dime alguna curiosidad'));
    agent.add(new Suggestion('Aprende algo nuevo'));
    agent.add(new Suggestion('Quiero cambiar una respuesta'));
    agent.add(new Suggestion('Muéstrame más opciones'));
    agent.add(new Suggestion('Hasta luego'));
  }

  // input.exit
  function ConversationBasic_Exit(agent) {
    agent.add('Un placer trabajar contigo, ¡Nos vemos pronto!');
  }

  // input.unknown
  function ConversationBasic_Fallback(agent) {
    agent.add('Lo siento, no te entiendo. ¿Te puedo ayudar en algo?');
    agent.add(new Suggestion('Quiero hacer otra cosa'));
    agent.add(new Suggestion('Salir'));
  }

  // input.options
  function ConversationBasic_Options(agent) {
    agent.add(new Image(referencesURI.imageURI_Navegation));
    agent.add('Aquí tienes una lista de referencias con todos mis comandos. ¿Qué quieres hacer?');
    agent.add(new Suggestion('Hola Odiseo'));
    agent.add(new Suggestion('Hasta luego'));
    agent.add(new Suggestion('Muéstrame más sugerencias'));
    agent.add(new Suggestion('Quiero enseñarte'));
  }

  // input.new.question
  function ConversationMain_TeachingAssistant(agent) {
    agent.add(new Image(referencesURI.imageURI_Teaching));
    agent.add('De acuerdo. Acabas de activar mi asistente guiado de aprendizaje. ¿Qué pregunta quieres guardar?');
    agent.add(new Suggestion('Quiero hacer otra cosa'));
    agent.add(new Suggestion('Adios'));
  }

  // input.new.question
  function ConversationMain_TeachingAssistant(agent) {
      agent.add(new Image(referencesURI.imageURI_Teaching));
      agent.add('De acuerdo. Acabas de activar mi asistente guiado de aprendizaje. ¿Qué pregunta quieres guardar?');
      agent.add(new Suggestion('Cancelar operación'));
  }

   // input.new.question.request.question
   function ConversationOperations_TeachingAssistant_InputQuestion(agent) {
     // Se cancela la operacion
    var input = agent.parameters.any; 
    if(input == "Cancelar operación"){
      agent.add('He cancelado el asistente de enseñanza. Si deseas realizar otra consulta, escribe (Continuar)');
      agent.add(new Suggestion('Continuar'));
    }
    // Comprobar si la cuestion esta ya guardada
    else {
      agent.add('¡Perfecto! Acabo de añadir esta cuestión (' + input + ') a mi base de aprendizaje.');
      agent.add('¿Cuál es su respuesta?');
    }
  }
  
  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('ConversationBasic_Welcome', ConversationBasic_Welcome);
  intentMap.set('ConversationBasic_Exit', ConversationBasic_Exit);
  intentMap.set('ConversationBasic_Fallback', ConversationBasic_Fallback);
  intentMap.set('ConversationBasic_Options', ConversationBasic_Options);
  intentMap.set('ConversationMain_TeachingAssistant', ConversationMain_TeachingAssistant);
  intentMap.set('ConversationOperations_TeachingAssistant_InputQuestion', ConversationOperations_TeachingAssistant_InputQuestion);
  agent.handleRequest(intentMap);
}
