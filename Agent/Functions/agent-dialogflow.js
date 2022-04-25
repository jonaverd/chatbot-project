
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion, Image, Card, Payload} = require('dialogflow-fulfillment');

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');
const usersAuth = require('./Users/validators.js');

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
    const response = {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Hola",
            "subtitle": "¡Bienvenido! Soy Odiseo, tu agente educativo. ¿Que quieres hacer?",
            "image": {
              "src": {
                "rawUrl": referencesURI.imageURI_Public
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
              },
              {
                "text": "Hasta luego",
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

  // input.exit
  function ConversationBasic_Exit(agent) {
    const response = {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Hasta luego",
            "subtitle": "Un placer trabajar contigo, ¡Nos vemos pronto!",
            "image": {
              "src": {
                "rawUrl": referencesURI.imageURI_Public
              }
            },
          }
        ]
      ]
    }
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.unknown
  function ConversationBasic_Fallback(agent) {
    const response = {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Error",
            "subtitle": "No puedo encontrar ninguna referencia. Escribe 'Otras funciones' para ver mi lista de comandos",
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
                "text": "Otras funciones",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Public
                  }
                }
              },
              {
                "text": "Hasta luego",
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

  // input.options
  function ConversationBasic_Options(agent) {
    const response = {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Menú principal",
            "subtitle": "Aquí tienes una lista de referencias con todos mis comandos. ¿Qué quieres hacer?",
            "image": {
              "src": {
                "rawUrl": referencesURI.imageURI_Public
              }
            },
          },
          {
            "type": "list",
            "title": "Hola Odiseo",
            "subtitle": "El agente te da la bienvenida",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Hasta luego",
            "subtitle": "La conversación finaliza",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Otras funciones",
            "subtitle": "Muestra los comandos disponibles",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Quiero enseñarte",
            "subtitle": "Activa el aprendizaje guiado del agente",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Quiero limpiar consulta",
            "subtitle": "Elimina una pregunta almacenada",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Quiero actualizar respuesta",
            "subtitle": "Actualiza la respuesta de una pregunta almacenada",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Quiero añadir visual",
            "subtitle": "Actualiza la imagen de una pregunta almacenada",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Quiero ver mi lista",
            "subtitle": "Muestra todas las cuestiones creadas por el usuario",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Quiero aprender <pregunta>",
            "subtitle": "El agente busca una respuesta (en su base de conocimiento) para ayudar al usuario",
          },
          {
            "type": "divider"
          },
          {
            "type": "list",
            "title": "Dime alguna curiosidad",
            "subtitle": "El agente busca una pregunta al azar para responder al usuario",
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
                "text": "Limpiar consulta",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Public
                  }
                }
              },
              {
                "text": "Actualizar respuesta",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Public
                  }
                }
              },
              {
                "text": "Añadir visual",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Public
                  }
                }
              },
              {
                "text": "Ver mi lista",
                "image": {
                  "src": {
                    "rawUrl": referencesURI.imageURI_Public
                  }
                }
              },
              {
                "text": "Dime curiosidad",
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
      if(input && await backendTools.existsBackend_Question(input,"fredy")){
        backendTools.updateWaitingInput_Question("exit");
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
        backendTools.updateWaitingInput_Question("required", input);
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
      backendTools.updateWaitingInput_Question("exit");
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cancelado",
              "subtitle": "He cancelado la operación",
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
  }

  // input.new.question.request.answer
  function ConversationOperations_TeachingAssistant_InputAnswer(agent) {
    const input = agent.parameters.any;
    // ¿Hay alguna pregunta pendiente?
    if(backendTools.updateWaitingInput_Question("progress")){
      // se crea pregunta + respuesta
      await backendTools.createBackend_Question(backendTools.lastinput, "fredy")
      await backendTools.updateBackend_Answer(backendTools.lastinput, input, "fredy")
      // flag para guardar ultima pregunta (solo para mostrar)
      this.conv.user.params.last = this.conv.user.params.input;
      backendTools.updateWaitingInput_Question("exit");
    }
    else{

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
