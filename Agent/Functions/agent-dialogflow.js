
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion, Image, Card} = require('dialogflow-fulfillment');

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
    agent.add(new Image(referencesURI.imageURI_Public));
    agent.add('¡Bienvenido! Soy Odiseo, tu agente personalizado. Estoy diseñado para aprender cualquier cuestión educativa. ¿Quieres que empecemos? Para conocer todos mis comandos, escribe "Otras funciones"');
    agent.add(new Suggestion('Otras funciones'));
    agent.add(new Suggestion('Hasta luego'));
  }

  // input.exit
  function ConversationBasic_Exit(agent) {
    agent.add(new Image(referencesURI.imageURI_Public));
    agent.add('Un placer trabajar contigo, ¡Nos vemos pronto!');
  }

  // input.unknown
  function ConversationBasic_Fallback(agent) {
    agent.add(new Image(referencesURI.imageURI_Error))
    agent.add('Lo siento, no te entiendo. ¿Te puedo ayudar en algo? Si quieres conocer mis comandos escribe "Otras funciones"');
    agent.add(new Suggestion('Otras funciones'));
    agent.add(new Suggestion('Hasta luego'));
  }

  // input.options
  function ConversationBasic_Options(agent) {
    agent.add('Aquí tienes una lista de referencias con todos mis comandos. ¿Qué quieres hacer?');
    agent.add('his is the body text of a card.  You can even use line\n  breaks and emoji!💁');
    agent.add(new Card({
      title: `Title: this is a card title`,
      text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    }));
    agent.add(new Card({
      title: `Title: this is a card title`,
      text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    }));
    /*agent.add(new Table({
      "title": "Comandos de referencias",
      "image": new Image({
        url: referencesURI.imageURI_Public,
        alt: 'Odiseo Chatbot'
      }),
      "columns": [{
        "header": "Sugerencia"
      }, {
        "header": "Detalles"
      }],
      "rows": [{
        "cells": [{
          "text": "Hola Odiseo"
        }, {
          "text": "El agente te da la bienvenida"
        }]
      }, {
        "cells": [{
          "text": "Hasta luego"
        }, {
          "text": "La conversación finaliza"
        }]
      }, {
        "cells": [{
          "text": "Otras funciones"
        }, {
          "text": "Muestra los comandos disponibles"
        }]
      }, {
        "cells": [{
          "text": "Quiero enseñarte"
        }, {
          "text": "Activa el aprendizaje guiado del agente"
        }]
      }, {
        "cells": [{
          "text": "Quiero limpiar consulta"
        }, {
          "text": "Elimina una pregunta almacenada"
        }]
      }, {
        "cells": [{
          "text": "Quiero actualizar respuesta"
        }, {
          "text": "Actualiza la respuesta de una pregunta almacenada"
        }]
      }, {
        "cells": [{
          "text": "Quiero añadir visual"
        }, {
          "text": "Actualiza la imagen de una pregunta almacenada"
        }]
      }, {
        "cells": [{
          "text": "Quiero ver mi lista"
        }, {
          "text": "Muestra todas las cuestiones creadas por el usuario"
        }]
      }, {
        "cells": [{
          "text": "Quiero aprender <pregunta>"
        }, {
          "text": "El agente busca una respuesta (en su base de conocimiento) para ayudar al usuario"
        }]
      }, {
        "cells": [{
          "text": "Dime alguna curiosidad"
        }, {
          "text": "El agente busca una pregunta al azar para responder al usuario"
        }]
      }]
    }));*/
    agent.add(new Suggestion('Quiero enseñar'));
    agent.add(new Suggestion('Limpiar consulta'));
    agent.add(new Suggestion('Actualizar respuesta'));
    agent.add(new Suggestion('Añadir visual'));
    agent.add(new Suggestion('Ver mi lista'));
    agent.add(new Suggestion('Dime curiosidad'));
  }

  // input.new.question
  function ConversationMain_TeachingAssistant(agent) {
  }

  // input.new.question.request.question
  function ConversationOperations_TeachingAssistant_InputQuestion(agent) {
  }

  // input.new.question.request.answer
  function ConversationOperations_TeachingAssistant_InputAnswer(agent) {
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
