// Active "Interactive Canvas Option" in Testing Voice Assistant for work this code!!
// Import the appropriate service and chosen wrappers
const {
  conversation,
  Image,
  Suggestion,
  Simple,
  Table,
  Card
} = require('@assistant/conversation')

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');
const usersAuth = require('./Users/validators.js');

// Create an app instance
const app = conversation({debug:true})
console.log('Google Assistant Detected')

// middleware for errors
app.catch((conv, error) => {
  console.error(error);
  this.conv.add(new Image({
    url: referencesURI.imageURI_Error,
    alt: 'Odiseo Chatbot',
  }))
  conv.add(new Simple({
    speech: 'Lo siento. Se ha producido un error en el servidor.',
    text: 'Se ha producido un error interno.'
  }));
});

// Actions if user is logged
class Assistant {
  constructor(conv) {
    this.conv = conv;
  }
  input_welcome() {
    this.conv.add(new Image({
      url: referencesURI.imageURI_Public,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: '¡Bienvenido! Soy Odiseo, tu agente personalizado. Estoy diseñado para aprender cualquier cuestión educativa. ¿Quieres que empecemos? ¡Aquí te dejo algunas sugerencias!',
      text: '¡Bienvenido! Soy Odiseo, tu agente educativo. ¿Que quieres hacer?'
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
    this.conv.add(new Suggestion({ title: 'Hasta luego' }));
  }
  input_exit() {
    this.conv.add(new Image({
      url: referencesURI.imageURI_Public,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: 'Un placer trabajar contigo, ¡Nos vemos pronto!',
      text: '¡Hasta la próxima!'
    }));
  }
  input_unknown(){
    this.conv.add(new Image({
      url: referencesURI.imageURI_Error,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: 'Lo siento, no te entiendo. ¿Te puedo ayudar en algo? Si quieres conocer mis comandos prueba a decir: Otras funciones',
      text: 'No puedo encontrar ninguna referencia. Escribe "Otras funciones" para ver mi lista de comandos'
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
    this.conv.add(new Suggestion({ title: 'Hasta luego' }));
  }
  input_options(){
    this.conv.add(new Simple({
      speech: 'Aquí tienes una lista de referencias con todos mis comandos.',
      text: 'Aquí tienes una lista de referencias con todos mis comandos. ¿Qué quieres hacer?'
    }));
    this.conv.add(new Table({
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
    }));
    this.conv.add(new Suggestion({ title: 'Quiero enseñar' }));
    this.conv.add(new Suggestion({ title: 'Limpiar consulta' }));
    this.conv.add(new Suggestion({ title: 'Actualizar respuesta' }));
    this.conv.add(new Suggestion({ title: 'Añadir visual' }));
    this.conv.add(new Suggestion({ title: 'Ver mi lista' }));
    this.conv.add(new Suggestion({ title: 'Dime curiosidad' }));
  }
  input_new_question(){
    this.conv.add(new Image({
      url: referencesURI.imageURI_Teaching,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: 'De acuerdo. Acabas de activar mi asistente guiado de aprendizaje. Pronuncia de forma clara la cuestión que deseas enseñarme. Si necesitas salir del asistente: Di "Otras funciones"',
      text: 'Dime la cuestión que deseas guardar en mi aprendizaje. Si quieres detener el asistente, escribe "Otras funciones"'
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_new_question_request_question(){
    const input = this.conv.intent.query;
    // Error ya existe
    if(input && await backendTools.existsBackend_Question(input, this.conv.user.params.email)){
      this.conv.add(new Image({
        url: referencesURI.imageURI_Error,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Lo siento, no he podido aprender la cuestión (' + input + ') porque ya existe en mi base de conocimiento. Si deseas realizar otra consulta, di "Continuar"',
        text: '¡Esta pregunta ya la tenía guardada! (' + input + ') Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{
      // se guardará cuando tenga su respuesta 
      //await backendTools.createBackend_Question(input, this.conv.user.params.email)
      // save question temporal data
      this.conv.user.params.input = input;
      this.conv.add(new Image({
        url: referencesURI.imageURI_Teaching,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: '¡Perfecto! Añadiré esta cuestión (' + input + ') a mi base de aprendizaje. A continuación, pronuncia de forma clara la respuesta que deseas vincular a esta cuestión',
        text: '¡Correcto! La cuestión se guardará como (' + input + '). ¿Cuál es su respuesta?'
      }));
    }
  }
  async input_new_question_request_answer(){
    const input = this.conv.intent.query;
    // Solo actualiza una vez, evitar otros inputs
    if(this.conv.user.params.input != null){
      // se crea pregunta + respuesta
      await backendTools.createBackend_Question(this.conv.user.params.input, this.conv.user.params.email)
      await backendTools.updateBackend_Answer(this.conv.user.params.input, input, this.conv.user.params.email)
      // flag para guardar ultima pregunta (solo para mostrar)
      this.conv.user.params.last = this.conv.user.params.input;
      this.conv.user.params.input = null;
    }
    this.conv.add(new Image({
      url: referencesURI.imageURI_Teaching,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: '¡Gracias por enseñarme! La respuesta para (' + this.conv.user.params.last + ') es (' + input + '). Si deseas realizar otra operación, di "Otras funciones".',
      text: '¡Completado! La respuesta para (' + this.conv.user.params.last + ') es (' + input + '). Si deseas realizar otra operación, escribe "Otras funciones".'
    }));
    this.conv.add(new Suggestion({ title: 'Quiero enseñarte' }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_delete_question(){
    const list = await backendTools.listBackend_Question(this.conv.user.params.email);
    // Rellenar lista de intents
    const elements = []
    list.forEach(element => { 
      const item = { 
        cells: [
          {
            text: element.question
          }
        ]
      }
      elements.push(item)
    })
    // flag para activar modo borrado (siguiente intent)
    this.conv.user.params.delete = true;
    this.conv.add(new Simple({
      speech: 'De acuerdo. Acabas de activar el modo "eliminar pregunta". Aquí te dejo una lista de cuestiones disponibles. Pronuncia de forma clara la cuestión que deseas modificar. Si necesitas salir del asistente: Di "Otras funciones"',
      text: 'Selecciona la cuestión para eliminar. Si quieres detener el asistente, escribe "Otras funciones"'
    }));
    this.conv.add(new Table({
      "title": "Eliminar",
      "subtitle": "Usuario: " + this.conv.user.params.name,
      "image": new Image({
        url: referencesURI.imageURI_Public,
        alt: 'Odiseo Chatbot'
      }),
      "columns": [{
        "header": "Pregunta"
      }],
      "rows": [elements], 
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_delete_question_confirm(){
    const input = this.conv.intent.query;
    // Error no existe 
    if(input && !await backendTools.existsBackend_Question(input, this.conv.user.params.email)){
      this.conv.add(new Image({
        url: referencesURI.imageURI_Error,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Lo siento, se ha producido un error al eliminar la cuestion (' + input + '). No existe o no está disponible. Si deseas realizar otra consulta, di "Continuar"',
        text: 'No se encuentra la cuestión (' + input + ') o no está disponible. Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{ 
      // Solo actualiza una vez, evitar otros inputs
      if(input && this.conv.user.params.delete){
        await backendTools.deleteBackend_Question(input, this.conv.user.params.email)
        this.conv.user.params.delete = false;
      }
      this.conv.add(new Image({
        url: referencesURI.imageURI_Teaching,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: '¡Vaya! Acabo de olvidar la cuestión (' + input + '). Gracias por corregirme. Para finalizar la operación di "Continuar"',
        text: '¡Cuestión eliminada! (' + input + '). Para finalizar la operación escribe "Continuar"'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
  }
  async input_update_question_answer(){
    const list = await backendTools.listBackend_Question(this.conv.user.params.email);
    // Rellenar lista de intents
    const elements = []
    list.forEach(element => { 
      const item = { 
        cells: [
          {
            text: element.question
          }
        ]
      }
      elements.push(item)
    })
    this.conv.add(new Simple({
      speech: 'De acuerdo. Acabas de activar el modo "modificar pregunta". Aquí te dejo una lista de cuestiones disponibles. Pronuncia de forma clara la cuestión que deseas modificar. Si necesitas salir del asistente: Di "Otras funciones"',
      text: 'Selecciona la cuestión para modificar. Si quieres detener el asistente, escribe "Otras funciones"'
    }));
    this.conv.add(new Table({
      "title": "Actualizar",
      "subtitle": "Usuario: " + this.conv.user.params.name,
      "image": new Image({
        url: referencesURI.imageURI_Public,
        alt: 'Odiseo Chatbot'
      }),
      "columns": [{
        "header": "Pregunta"
      }],
      "rows": [elements], 
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_update_question_answer_select(){
    const input = this.conv.intent.query;
    // Error no existe
    if(input && !await backendTools.existsBackend_Question(input, this.conv.user.params.email)){
      this.conv.add(new Image({
        url: referencesURI.imageURI_Error,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Lo siento, no he podido modificar la cuestión (' + input + ') porque no existe en mi base de conocimiento. Si deseas realizar otra consulta, di "Continuar"',
        text: '¡Esta pregunta no existe! (' + input + ') Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{
      // se actualizara cuando tenga su respuesta 
      // save question temporal data
      this.conv.user.params.input = input;
      this.conv.add(new Image({
        url: referencesURI.imageURI_Teaching,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Cuestión seleccionada (' + input + '). A continuación, pronuncia de forma clara la respuesta que deseas vincular a esta cuestión',
        text: 'Modificar la cuestión (' + input + '). Introduce la nueva respuesta:'
      }));
    }
  }
  async input_update_question_answer_input(){
    const input = this.conv.intent.query;
    // Solo actualiza una vez, evitar otros inputs
    if(this.conv.user.params.input != null){
      // se modifica respuesta
      await backendTools.updateBackend_Answer(this.conv.user.params.input, input, this.conv.user.params.email)
      // flag para guardar ultima pregunta (solo para mostrar)
      this.conv.user.params.last = this.conv.user.params.input;
      this.conv.user.params.input = null;
    }
    this.conv.add(new Image({
      url: referencesURI.imageURI_Teaching,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: '¡Gracias por corregirme! La respuesta para (' + this.conv.user.params.last + ') ahora es (' + input + '). Si deseas realizar otra operación, di "Otras funciones".',
      text: '¡Corregido! La respuesta para (' + this.conv.user.params.last + ') ahora es (' + input + '). Si deseas realizar otra operación, escribe "Otras funciones".'
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_update_question_image(){
    const list = await backendTools.listBackend_Question(this.conv.user.params.email);
    // Rellenar lista de intents
    const elements = []
    list.forEach(element => { 
      const item = { 
        cells: [
          {
            text: element.question
          }
        ]
      }
      elements.push(item)
    })
    this.conv.add(new Simple({
      speech: 'De acuerdo. Acabas de activar el modo "modificar foto". Aquí te dejo una lista de cuestiones disponibles. Pronuncia de forma clara la cuestión que deseas modificar. Si necesitas salir del asistente: Di "Otras funciones"',
      text: 'Selecciona la cuestión para modificar. Si quieres detener el asistente, escribe "Otras funciones"'
    }));
    this.conv.add(new Table({
      "title": "Modificar Visual",
      "subtitle": "Usuario: " + this.conv.user.params.name,
      "image": new Image({
        url: referencesURI.imageURI_Public,
        alt: 'Odiseo Chatbot'
      }),
      "columns": [{
        "header": "Pregunta"
      }],
      "rows": [elements], 
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_update_question_image_select(){
    const input = this.conv.intent.query;
    // Error no existe
    if(input && !await backendTools.existsBackend_Question(input, this.conv.user.params.email)){
      this.conv.add(new Image({
        url: referencesURI.imageURI_Error,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Lo siento, no he podido modificar la imagen de la cuestión (' + input + ') porque no existe en mi base de conocimiento. Si deseas realizar otra consulta, di "Continuar"',
        text: '¡Esta pregunta no existe! (' + input + ') Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{
      // se actualizara cuando tenga su respuesta 
      // save question temporal data
      this.conv.user.params.input = input;
      this.conv.add(new Image({
        url: referencesURI.imageURI_Teaching,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Cuestión seleccionada (' + input + '). A continuación, pronuncia de forma clara la referencia que deseas vincular a esta cuestión',
        text: 'Modificar imagen de la cuestión (' + input + '). Introduce el nuevo enlace:'
      }));
    }
  }
  async input_update_question_image_input(){
    const input = this.conv.intent.query;
    // Solo actualiza una vez, evitar otros inputs
    if(this.conv.user.params.input != null){
      // se modifica respuesta
      await backendTools.updateBackend_Image(this.conv.user.params.input, input, this.conv.user.params.email)
      // flag para guardar ultima pregunta (solo para mostrar)
      this.conv.user.params.last = this.conv.user.params.input;
      this.conv.user.params.input = null;
    }
    this.conv.add(new Image({
      url: referencesURI.imageURI_Teaching,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: '¡Ha quedado muy bien! La imagen para (' + this.conv.user.params.last + ') ha sido actualizada. Si deseas realizar otra operación, di "Otras funciones".',
      text: '¡Que elegancia! La imagen para (' + this.conv.user.params.last + ') ha sido actualizada. Si deseas realizar otra operación, escribe "Otras funciones".'
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_list_question(){
    const list = await backendTools.listBackend_Question(this.conv.user.params.email);
    // Rellenar lista de intents
    const elements = []
    var visual = "";
    list.forEach(element => { 
      if(element.visual == referencesURI.imageURI_Public){ visual = "Default" }
      else{ visual = "Custom" }
      const item = { 
        cells: [
          {
            text: element.question
          }, 
          {
            text: element.answer
          },
          {
            text: visual
          }
        ]
      }
      elements.push(item)
    })
    this.conv.add(new Simple({
      speech: 'Aquí te dejo tu lista personal de cuestiones. Si necesitas realizar alguna operación: Di "Otras funciones"',
      text: 'Mostrando lista personal. Para realizar alguna operación escribe "Otras funciones"'
    }));
    this.conv.add(new Table({
      "title": "Almacén",
      "subtitle": "Usuario: " + this.conv.user.params.name,
      "image": new Image({
        url: referencesURI.imageURI_Public,
        alt: 'Odiseo Chatbot'
      }),
      "columns": [{
        "header": "Pregunta"
      }, {
        "header": "Detalles"
      }, {
        "header": "Visual"
      }],
      "rows": [elements], 
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
  }
  async input_random_question(){
    // Enlaza con un intent-cuestión random
    const list = await backendTools.listBackend_QuestionAll();
    // La lista está vacía
    if(list.length===0){
      this.conv.add(new Image({
        url: referencesURI.imageURI_Error,
        alt: 'Odiseo Chatbot',
      }))
      this.conv.add(new Simple({
        speech: 'Lo siento, no existen cuestiones en mi base de conocimiento aún. Si quieres enseñarme alguna di "Quiero enseñarte". Si quieres ver mis otros comandos di "Continuar"',
        text: 'Mi base de conocimiento está vacía. Si quieres añadir alguna cuestión escribe "Quiero enseñarte" o "Continuar" para ver mi lista de comandos'
      }));
      this.conv.add(new Suggestion({ title: 'Quiero enseñarte' }));
    }
    // La lista no está vacía
    else{
      const index = Math.floor(Math.random() * (Math.floor(list.length) - Math.ceil(0) + 1)) + Math.ceil(0);;
      const question = list[index].question
      const data = await backendTools.getBackend_Question(question);
      this.conv.add(new Simple({
        speech: '¿Sabías qué? La respuesta para ' + data.question + ' es ' + data.answer,
        text: '¿Sabías qué?...'
      }));
      this.conv.add(new Card({
        "title": data.question,
        "subtitle": 'Profesor: ' + data.user,
        "text": data.answer,
        "image": new Image({
          url: data.visual,
          alt: data.question
        })
      }));
    }
    this.conv.add(new Suggestion({ title: 'Continuar' }));
  }
}
// middleware for users login 
app.middleware(async (conv) => {
  // Controlar entradas de los formularios
  let input = conv.intent.query
  // No hay sesión de email
  if(!conv.user.params.email){
    // No hay temporal activado (sigue peticion de email)
    if(!conv.user.params.temporal){
      // ¿formato válido?
      if (usersAuth.validatorEmail.validate(input)){
        // No hay email registrado 
        if(!await backendTools.getBackend_User(input)){
          // el email se crea mas adelante (con la contraseña)
          //await backendTools.createBackend_User(input)
          // email temporal de comprobacion
          if(!conv.user.params.temporal){ conv.user.params.temporal = input; }
          conv.add(new Image({
            url: referencesURI.imageURI_Login,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'Gracias. Para continuar con el registro necesito crear una contraseña personal. Recuerda que tus datos serán encriptados por seguridad: ¿Puedes introducir tu contraseña? (PIN de 6 dígitos)',
            text: 'Recuerda que tus datos serán encriptados por seguridad. Para continuar (introduce tu contraseña) (PIN de 6 dígitos):'
          }));
        }
        // Hay email registrado
        else{
          // email temporal de comprobacion
          if(!conv.user.params.temporal){ conv.user.params.temporal = input; }
          conv.add(new Image({
            url: referencesURI.imageURI_Login,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'Email verificado: ' + conv.user.params.temporal + '. Introduce la contraseña para recuperar tus datos de usuario (PIN de 6 dígitos)',
            text: 'Email verificado (' + conv.user.params.temporal + ') Introduce tu contraseña para acceder a tu cuenta (PIN de 6 dígitos):'
          }));
        }
      }
      // formato incorrecto (entrada normal)
      else{
        conv.add(new Image({
          url: referencesURI.imageURI_Login,
          alt: 'Odiseo Chatbot',
        }))
        conv.add(new Simple({
          speech: 'Hola. Bienvenido al asistente de voz de Odiseo. Para continuar necesito tu identificación. ¿Puedes introducir tu correo electrónico?',
          text: 'Bienvenido al asistente educativo Odiseo. Para continuar necesitas identificarte (introduce tu email)'
        }));
      }
    }
    // Temporal activado
    else{
      // No hay contraseña registrada
      if (input && await backendTools.getBackend_UserPassword(conv.user.params.temporal)==null){
        // ¿formato válido?
        if(usersAuth.schema.validate(input)){
          // se crea el email y la contraseña
          await backendTools.createBackend_User(conv.user.params.temporal)
          await backendTools.updateBackend_UserPassword(await usersAuth.gethashPassword(input), conv.user.params.temporal)
          conv.add(new Image({
            url: referencesURI.imageURI_Login,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'Correcto. Para completar el registro de tu usuario necesito algunos datos adicionales. Recuerda que tus datos mantendrán su privacidad y no serán compartidos. ¿Puedes introducir tu nombre y apellidos?',
            text: 'Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para continuar el registro (introduce tu nombre y apellidos)'
          }));  
          conv.user.params.password = true;
        }
        // formato incorrecto
        else{
          conv.add(new Image({
            url: referencesURI.imageURI_Error,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'No se puede completar el registro. Por favor, introduce tu contraseña con un formato válido (PIN de 6 dígitos)',
            text: 'Error en el registro. Introduce una contraseña válida (PIN de 6 dígitos):'
          }));
        }   
      }
      // Hay contraseña registrada
      else{
        // No hay sesión de contraseña (¿Login?)
        if(!conv.user.params.password){
          // ¿formato válido?
          if(usersAuth.schema.validate(input)){
            // login válido
            if(input && await usersAuth.comparehashPassword(input, await backendTools.getBackend_UserPassword(conv.user.params.temporal))){
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'Contraseña verificada. Identificado como: ' + conv.user.params.temporal + '. Para completar el acceso a tu cuenta, di "Iniciar Sesión',
                text: 'Contraseña verificada. Identificado como: ' + conv.user.params.temporal + '. Para acceder a tu cuenta, escribe "Iniciar Sesión"'
              }));
              conv.add(new Suggestion({ title: 'Iniciar Sesión' })); 
              conv.user.params.password = true;
            }
            // login error
            else{
              conv.add(new Image({
                url: referencesURI.imageURI_Error,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'La contraseña introducida no es correcta. Por favor, ingresa tu contraseña para iniciar sesión con este usuario (' + conv.user.params.temporal + ') (PIN de 6 dígitos):',
                text: 'La contraseña no es correcta. Introduce la contraseña asociada a este usuario (' + conv.user.params.temporal + ') (PIN de 6 dígitos):'
              }));
            }
          }
          // formato incorrecto (entrada normal)
          else{
            conv.add(new Image({
              url: referencesURI.imageURI_Login,
              alt: 'Odiseo Chatbot',
            }))
            conv.add(new Simple({
              speech: 'Email verificado: ' + conv.user.params.temporal + '. Introduce la contraseña para recuperar tus datos de usuario (PIN de 6 dígitos)',
              text: 'Email verificado (' + conv.user.params.temporal + ') Introduce tu contraseña para iniciar sesión (PIN de 6 dígitos):'
            }));
          }
        }
        // Hay sesión de contraseña
        else{
          // No hay nombre registrado
          if(input && await backendTools.getBackend_UserName(conv.user.params.temporal)==null) {
            // ¿formato válido?
            if(usersAuth.validatorNames(input)){
              await backendTools.updateBackend_UserName(input, conv.user.params.temporal)
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'Perfecto. Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para el siguiente proceso: ¿Puedes introducir tu edad?',
                text: 'Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para continuar (introduce tu edad):'
              }));
            }
            // formato incorrecto
            else{
              conv.add(new Image({
                url: referencesURI.imageURI_Error,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'No se puede completar el registro. Por favor, introduce tu nombre y apellidos con un formato válido',
                text: 'Error en el registro. Introduce un nombre y apellidos válidos:'
              }));
            }
          }
          // Hay nombre registrado
          else{
            // No hay edad registrada
            if (input && await backendTools.getBackend_UserAge(conv.user.params.temporal)==null){
              // ¿formato válido?
              if(usersAuth.validatorNumbers(input)){
                await backendTools.updateBackend_UserAge(input, conv.user.params.temporal)
                conv.add(new Image({
                  url: referencesURI.imageURI_Login,
                  alt: 'Odiseo Chatbot',
                }))
                conv.add(new Simple({
                  speech: '¡Registro completado! Usuario: ' + conv.user.params.temporal + '. Gracias por tu paciencia. La próxima vez que te identifiques podré reconocerte. Para completar el acceso a tu cuenta, di "Iniciar Sesión"',
                  text: '¡Completado! Usuario: ' + conv.user.params.temporal + '. Para acceder a tu cuenta, escribe "Iniciar Sesión"'
                }));
                conv.add(new Suggestion({ title: 'Iniciar Sesión' }));
              }
              // formato incorrecto
              else{
                conv.add(new Image({
                  url: referencesURI.imageURI_Error,
                  alt: 'Odiseo Chatbot',
                }))
                conv.add(new Simple({
                  speech: 'No se puede completar el registro. Por favor, introduce tu edad con un formato válido (numérico)',
                  text: 'Error en el registro. Introduce una edad válida (numérico):'
                }));
              }   
            }
            // Hay edad registrada
            else{
              // Hay contraseña registrada (todos los campos disponibles)
              conv.user.params.email = conv.user.params.temporal;
              conv.user.params.name = await backendTools.getBackend_UserName(conv.user.params.email)
              conv.user.params.age = await backendTools.getBackend_UserAge(conv.user.params.email)
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'Bienvenido de nuevo: ' + conv.user.params.name + '. Me alegra verte de nuevo. Si quieres comenzar prueba a decir "Hola Odiseo"',
                text: 'Bienvenido de nuevo: ' + conv.user.params.name + '. Para iniciar el asistente di "Hola Odiseo"'
              }));
              conv.add(new Suggestion({ title: 'Hola Odiseo' }));
            }
          }
        }
      }
    }
  }
  // Hay sesión de email
  else{
    // Contiene la orden "Responde"
    if(input.includes("Responde")){
      var substring = input.split("Responde ")
      var question = substring[1].toString();
      // Enlaza con un intent-cuestión: se responde
      if(await backendTools.existsBackend_Question(question, conv.user.params.email)){
        const data = await backendTools.getBackend_Question(question);
        conv.add(new Simple({
          speech: data.answer,
          text: '¡Aquí tienes tu respuesta!'
        }));
        conv.add(new Card({
          "title": data.question,
          "subtitle": 'Profesor: ' + data.user,
          "text": data.answer,
          "image": new Image({
            url: data.visual,
            alt: data.question
          })
        }));
        conv.add(new Suggestion({ title: 'Continuar' }));
      }
      // No enlaza con ningun intent-cuestión
      else{
        // Existe usuario en la sesión
        conv.assistant = new Assistant(conv);
      }
    }
    // Intents del sistema: se actúa
    else{
      // Existe usuario en la sesión
      conv.assistant = new Assistant(conv);
    }
  }
});

// Register handlers for Actions SDK
// input.welcome
app.handle('ConversationBasic_Welcome', conv => {
  conv.assistant?.input_welcome() 
})

// input.exit
app.handle('ConversationBasic_Exit', conv => {
  conv.assistant?.input_exit()
})

// input.unknown
app.handle('ConversationBasic_Fallback', conv => {
  conv.assistant?.input_unknown()
})

// input.options
app.handle('ConversationBasic_Options', conv => {
  conv.assistant?.input_options()
})

// input.new.question
app.handle('ConversationMain_TeachingAssistant', conv => {
  conv.assistant?.input_new_question()
})

 // input.new.question.request.question
app.handle('ConversationOperations_TeachingAssistant_InputQuestion', async conv => {
  await conv.assistant?.input_new_question_request_question()
})

// input.new.question.request.answer
app.handle('ConversationOperations_TeachingAssistant_InputAnswer', async conv => {
  await conv.assistant?.input_new_question_request_answer()
})

// input.delete.question
app.handle('ConversationOperations_TeachingAssistant_DeleteQuestion', async conv => {
  await conv.assistant?.input_delete_question()
})

// input.delete.question.confirm
app.handle('ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm', async conv => {
  await conv.assistant?.input_delete_question_confirm()
})

// input.update.question.answer
app.handle('ConversationMain_TeachingAssistant_UpdateAnswer', async conv => {
  await conv.assistant?.input_update_question_answer()
})

 // input.update.question.answer.select
app.handle('ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion', async conv => {
  await conv.assistant?.input_update_question_answer_select()
})

// input.update.question.answer.input 
app.handle('ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer', async conv => {
  await conv.assistant?.input_update_question_answer_input()
})

// input.update.question.image
app.handle('ConversationOperations_TeachingAssistant_UpdateImage', async conv => {
  await conv.assistant?.input_update_question_image()
})

 // input.update.question.image.select
app.handle('ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion', async conv => {
  await conv.assistant?.input_update_question_image_select()
})

// input.update.question.image.input 
app.handle('ConversationOperations_TeachingAssistant_UpdateImage_InputImage', async conv => {
  await conv.assistant?.input_update_question_image_input()
})

// input.list.question
app.handle('ConversationOperations_TeachingAssistant_List', async conv => {
  await conv.assistant?.input_list_question()
})

// input.random.question
app.handle('ConversationOperations_TeachingAssistant_RandomQuestion', async conv => {
  await conv.assistant?.input_random_question()
})

module.exports = app;