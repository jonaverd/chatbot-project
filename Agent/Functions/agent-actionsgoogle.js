// Active "Interactive Canvas Option" in Testing Voice Assistant for work this code!!
// Import the appropriate service and chosen wrappers
const {
  conversation,
  Image,
  Suggestion,
  Simple,
  Table
} = require('@assistant/conversation')

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');

// Create an app instance
const app = conversation({debug:true})
console.log('Google Assistant Detected')

// Register handlers for Actions SDK
// input.welcome
app.handle('ConversationBasic_Welcome', conv => {
  conv.add(new Image({
    url: referencesURI.imageURI_Welcome,
    alt: 'Odiseo Chatbot',
  }))
  conv.add(new Simple({
    speech: '¡Bienvenido! Soy Odiseo, tu agente educativo. Estoy diseñado para aprender cualquier cosa. ¿Quieres que empecemos? ¡Aquí te dejo algunas sugerencias! Por ejemplo, puedes decirme que aprenda algo nuevo, que te muestre tus enseñanzas guardadas, que responda algo aleatorio o que te muestre mas opciones',
    text: '¡Bienvenido! Soy Odiseo, tu agente educativo. ¿Que quieres hacer?'
  }));
  conv.add(new Suggestion({ title: 'Dime alguna curiosidad' }));
  conv.add(new Suggestion({ title: 'Aprende algo nuevo' }));
  conv.add(new Suggestion({ title: 'Cambiar una respuesta' }));
  conv.add(new Suggestion({ title: 'Muéstrame más opciones' }));
  conv.add(new Suggestion({ title: 'Hasta luego' }));
})

// input.exit
app.handle('ConversationBasic_Exit', conv => {
  conv.add(new Simple({
    speech: 'Un placer trabajar contigo, ¡Nos vemos pronto!',
    text: '¡Hasta la próxima!'
  }));
})

// input.unknown
app.handle('ConversationBasic_Fallback', conv => {
  conv.add(new Simple({
    speech: 'Lo siento, no te entiendo. ¿Te puedo ayudar en algo? Si quieres conocer mis comandos prueba a decir: Otras funciones',
    text: 'No puedo encontrar ninguna referencia.'
  }));
  conv.add(new Suggestion({ title: 'Otras funciones' }));
  conv.add(new Suggestion({ title: 'Salir' }));
})

// input.options
app.handle('ConversationBasic_Options', conv => {
  conv.add(new Simple({
    speech: 'Aquí tienes una lista de referencias con todos mis comandos. Para ir a la página de bienvenida di "Hola Odiseo". Para terminar la conversación di "Hasta luego". Para conocer todas las referencias di "Opciones". Para activar el asistente guiado de aprendizaje di "Quiero enseñarte".',
    text: 'Aquí tienes una lista de referencias con todos mis comandos. ¿Qué quieres hacer?'
  }));
  conv.add(new Table({
    "title": "Comandos de referencias",
    "image": new Image({
      url: referencesURI.imageURI_Navegation,
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
        "text": "Opciones"
      }, {
        "text": "Muestra los comandos disponibles"
      }]
    }, {
      "cells": [{
        "text": "Quiero enseñarte"
      }, {
        "text": "Activa el aprendizaje guiado del agente"
      }]
    }]
  }));
  conv.add(new Suggestion({ title: 'Hola Odiseo' }));
  conv.add(new Suggestion({ title: 'Hasta luego' }));
  conv.add(new Suggestion({ title: 'Muéstrame más sugerencias' }));
  conv.add(new Suggestion({ title: 'Quiero enseñarte' }));
})

// input.new.question
app.handle('ConversationMain_TeachingAssistant', conv => {
  conv.add(new Image({
    url: referencesURI.imageURI_Teaching,
    alt: 'Odiseo Chatbot',
  }))
  conv.add(new Simple({
    speech: 'De acuerdo. Acabas de activar mi asistente guiado de aprendizaje. Pronuncia de forma clara la cuestión que deseas enseñarme. Si necesitas salir del asistente: Di "Cancelar operación"',
    text: 'Dime la cuestión que deseas guardar en mi aprendizaje.'
  }));
  conv.add(new Suggestion({ title: 'Cancelar operación' }));
})

 // input.new.question.request.question
app.handle('ConversationOperations_TeachingAssistant_InputQuestion', async conv => {
  // Se cancela la operacion
  const input = conv.intent.query;
  if(input == "Cancelar operación"){
    conv.add(new Simple({
      speech: 'He cancelado el asistente de enseñanza. Si deseas realizar otra consulta, di "Continuar"',
      text: 'He cancelado el asistente de enseñanza. Escribe "Continuar"'
    }));
    conv.add(new Suggestion({ title: 'Continuar' }));
  }
  // Error ya existe
  else{
    if(await backendTools.existsBackend_Question(input)){
      conv.add(new Simple({
        speech: 'Lo siento, no he podido aprender la cuestión (' + input + ') porque ya existe en mi base de conocimiento. Si deseas realizar otra consulta, di "Continuar"',
        text: '¡Esta pregunta ya la tenía guardada! (' + input + ') Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{ 
      await backendTools.createBackend_Question(input);
      // save question temporal data
      conv.user.params.input = input;
      conv.add(new Simple({
        speech: '¡Perfecto! Acabo de añadir esta cuestión (' + input + ') a mi base de aprendizaje. A continuación, pronuncia de forma clara la respuesta que deseas vincular a esta cuestión',
        text: '¡Correcto! La cuestión (' + input + ') ha sido guardada. ¿Cuál es su respuesta?'
      }));
    }
  }
})

// input.new.question.request.answer
app.handle('ConversationOperations_TeachingAssistant_InputAnswer', async conv => {
  // get previous question temporal data
  const previous = conv.user.params.input;
  const data = conv.intent.query;
  // Error no existe 
  if(!await backendTools.existsBackend_Question(previous)){
    conv.add(new Simple({
      speech: 'Lo siento, se ha producido un error al modificar la respuesta para la cuestion (' + previous + '). No existe o no está disponible. Si deseas realizar otra consulta, di "Continuar"',
      text: 'No se encuentra la cuestión (' + previous + ') o no está disponible. Si deseas realizar otra consulta, escribe (Continuar)'
    }));
    conv.add(new Suggestion({ title: 'Continuar' }));
   
  }
  // Continuar
  else{ 
    await backendTools.updateBackend_Answer(previous, data)
    conv.add(new Simple({
      speech: '¡Gracias por enseñarme! La respuesta para (' + previous + ') es (' + data + '). Me siento más inteligente. Si deseas continuar con el proceso de aprendizaje, puedes vincular el enlace de una imagen relacionada con la cuestión ',
      text: '¡Completado! La respuesta para (' + previous + ') es (' + data + '). '
    }));
    conv.add(new Suggestion({ title: 'Continuar' }));
  }
})


module.exports = app;