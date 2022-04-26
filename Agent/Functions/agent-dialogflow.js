
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion, Image, Card, Payload} = require('dialogflow-fulfillment');

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');
const RichContentResponses = require('./conversations.js');
const usersAuth = require('./Users/validators.js');
// Auxiliar - actualizar la interaccion donde espera un input
const WaitingInput = backendTools.WaitingInput();

// User temporal
const user = "fredy";

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
    const response = RichContentResponses.welcome;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.exit
  function ConversationBasic_Exit(agent) {
    const response = RichContentResponses.exit;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.unknown
  function ConversationBasic_Fallback(agent) {
    const response = RichContentResponses.unknown;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.options
  function ConversationBasic_Options(agent) {
    const response = RichContentResponses.options;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.new.question
  function ConversationMain_TeachingAssistant(agent) {
    const response = {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Nueva cuestión 1/3",
            "subtitle": "Dime la cuestión que deseas guardar en mi aprendizaje. Si quieres detener el asistente, escribe 'Otras funciones'",
            "image": {
              "src": {
                "rawUrl": referencesURI.imageURI_Teaching
              }
            },
          },
          {
            "type": "chips",
            "options": [
              {
                "text": "Otras funciones",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Public
                  }
                }
              }
            ]
          }
        ]
      ]
    }
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.new.question.request.question
  async function ConversationOperations_TeachingAssistant_InputQuestion(agent) {
    const input = agent.parameters.any;
    // Se sigue con el proceso
    if(input != "Otras funciones"){
      // Ya existe
      if(input && await backendTools.existsBackend_Question(input,user)){
        WaitingInput.exit();
        const response = {
          "richContent": [
            [
              {
                "type": "info",
                "title": "Error",
                "subtitle": "¡Esta pregunta ya la tenía guardada! (" + input + ") Si deseas realizar otra consulta, escribe 'Continuar'",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Error
                  }
                },
              },
              {
                "type": "chips",
                "options": [
                  {
                    "text": "Continuar",
                    "image": {
                      "src": {
                        "rawUrl": referencesURI.imageURI_Public
                      }
                    }
                  }
                ]
              }
            ]
          ]
        }
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede guardar
      else{
        // se guardará cuando tenga su respuesta 
        WaitingInput.required(input);
        const response = {
          "richContent": [
            [
              {
                "type": "info",
                "title": "Nueva cuestión 2/3",
                "subtitle": "¡Correcto! La cuestión se guardará como (" + input + "). ¿Cuál es su respuesta?",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Teaching
                  }
                },
              }
            ]
          ]
        }
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // Se cancela operacion
    else{
      WaitingInput.exit();
      const response = RichContentResponses.cancel;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.new.question.request.answer
  async function ConversationOperations_TeachingAssistant_InputAnswer(agent) {
    const input = agent.parameters.any;
    // ¿Hay alguna pregunta pendiente?
    if(WaitingInput.progress()){
      // se crea pregunta + respuesta
      await backendTools.createBackend_Question(WaitingInput.current(), user)
      await backendTools.updateBackend_Answer(WaitingInput.current(), input, user)
      WaitingInput.exit();
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Nueva cuestión 3/3",
              "subtitle": "¡Gracias por enseñarme! La respuesta para (" + WaitingInput.last() + ") es (" + input + "). Si deseas realizar otra operación, escribe 'Otras funciones'.",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Teaching
                }
              },
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "Quiero enseñarte",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Public
                    }
                  }
                },
                {
                  "text": "Otras funciones",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Public
                    }
                  }
                }
              ]
            }
          ]
        ]
      }
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    else{
      WaitingInput.exit();
      const response = RichContentResponses.options;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.delete.question
  function ConversationOperations_TeachingAssistant_DeleteQuestion(agent) {
  }

  // input.delete.question.confirm
  function ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm(agent) {
  }

  // input.update.question.answer
  function ConversationMain_TeachingAssistant_UpdateAnswer(agent) {
  }

  // input.update.question.answer.select
  function ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion(agent) {
  }

  // input.update.question.answer.input
  function ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer(agent) {
  }

  // input.update.question.image
  function ConversationOperations_TeachingAssistant_UpdateImage(agent) {
  }

  // input.update.question.image.select
  function ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion(agent) {
  }

  // input.update.question.image.input 
  function ConversationOperations_TeachingAssistant_UpdateImage_InputImage(agent) {
  }

  // input.list.question
  function ConversationOperations_TeachingAssistant_List(agent) {
  }

  // input.random.question
  function ConversationOperations_TeachingAssistant_RandomQuestion(agent) {
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('ConversationBasic_Welcome', ConversationBasic_Welcome);
  intentMap.set('ConversationBasic_Exit', ConversationBasic_Exit);
  intentMap.set('ConversationBasic_Fallback', ConversationBasic_Fallback);
  intentMap.set('ConversationBasic_Options', ConversationBasic_Options);
  intentMap.set('ConversationMain_TeachingAssistant', ConversationMain_TeachingAssistant);
  intentMap.set('ConversationOperations_TeachingAssistant_InputQuestion', ConversationOperations_TeachingAssistant_InputQuestion);
  intentMap.set('ConversationOperations_TeachingAssistant_InputAnswer', ConversationOperations_TeachingAssistant_InputAnswer);
  intentMap.set('ConversationOperations_TeachingAssistant_DeleteQuestion', ConversationOperations_TeachingAssistant_DeleteQuestion);
  intentMap.set('ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm', ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm);
  intentMap.set('ConversationMain_TeachingAssistant_UpdateAnswer', ConversationMain_TeachingAssistant_UpdateAnswer);
  intentMap.set('ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion', ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion);
  intentMap.set('ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer', ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer);
  intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage', ConversationOperations_TeachingAssistant_UpdateImage);
  intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion', ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion);
  intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage_InputImage', ConversationOperations_TeachingAssistant_UpdateImage_InputImage);
  intentMap.set('ConversationOperations_TeachingAssistant_List', ConversationOperations_TeachingAssistant_List);
  intentMap.set('ConversationOperations_TeachingAssistant_RandomQuestion', ConversationOperations_TeachingAssistant_RandomQuestion);
  agent.handleRequest(intentMap);
}
