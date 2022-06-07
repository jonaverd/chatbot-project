// Respuestas de formato enriquecido utilizadas en el asistente de voz de Google
const referencesURI = require('../Assets/references.js');
module.exports = Object.freeze({
    info_basic_image: function(url){
        const response = {
            url: url,
            alt: 'Odiseo Chatbot',
        }
        return response;
    },
    info_basic_suggestion: function(text){
        const response = { 
            title: text 
        }
        return response;
    },
    info_basic_welcome: function(name){
        const response = {
            speech: 'Te doy la bienvenida ' + name + ' ¡Un placer verte de nuevo! ¿En que te puedo ayudar? ¡Pregúntame algo o di la palabra "Comandos" para conocer todas mis opciones!' ,
            text: 'Te doy la bienvenida ' + name + ' ¡Un placer verte de nuevo! ¿En que te puedo ayudar? ¡Pregúntame algo o di la palabra "Comandos" para conocer todas mis opciones!'
        }
        return response;
    },
    info_basic_login: {
        speech: '¡Hola! Soy Odiseo, tu asistente educativo. ¿Quieres que aprendamos juntos? Por favor, dime tu nombre y apellidos para que pueda conocerte.',
        text: '¡Hola! Soy Odiseo, tu asistente educativo. ¿Quieres que aprendamos juntos? Por favor, dime tu nombre y apellidos para que pueda conocerte.'
    },
    info_basic_exit: function(name){
        const response = {
            speech: 'Adiós ' + name + ' ¡Un placer aprender contigo!' ,
            text: 'Adiós ' + name + ' ¡Un placer aprender contigo!'
        }
        return response;
    },
    info_basic_options: {
        speech: 'Gracias por tu interés. Aquí te dejo una lista con todas mis órdenes. ¿Que piensas hacer conmigo?',
        text: 'Gracias por tu interés. Aquí te dejo una lista con todas mis órdenes. ¿Que piensas hacer conmigo?'
    },
    info_basic_list_options: function(image){
        const response = {
            "title": "Instrucciones",
            "image": image,
            "columns": [{
              "header": "Comando"
            }, {
              "header": "¿Qué Hace?"
            }],
            "rows": [{
              "cells": [{
                "text": "Hola Odiseo"
              }, {
                "text": "Odiseo se alegra de darte la bienvenida"
              }]
            }, {
                "cells": [{
                  "text": "<Pregunta algo>"
                }, {
                  "text": "Odiseo buscará una respuesta para tu pregunta"
                }]
              }, {
                "cells": [{
                  "text": "Dime Alguna Curiosidad"
                }, {
                  "text": "Odiseo buscará algo interesante para responderte"
                }]
              }, {
                "cells": [{
                  "text": "Quiero Aprender"
                }, {
                  "text": "Odiseo te enseñará todas las preguntas que sabe"
                }]
              }, {
              "cells": [{
                "text": "Quiero Enviar Pregunta"
              }, {
                "text": "Odiseo te enseñará una lista con tus profesores, para que les puedas enviar una pregunta. ¡Si es correcta, se la podrás enseñar a Odiseo!"
              }]
            },  {
                "cells": [{
                    "text": "Hasta Luego Odiseo"
                }, {
                    "text": "Odiseo se despide de ti"
                }]
            },]
        }
        return response;
    },
    info_basic_response_header: function(answer){
        const response = {
            speech: 'La respuesta es: ' + answer + '.',
            text: '¡Si quieres hacer otra cosa, di la palabra "Continuar"!',
        }
        return response;
    },
    info_basic_response_card: function(intent, image){
        const response = {
            "title": intent.question,
            "subtitle": 'Autor/a: ' + intent.user,
            "text": intent.answer,
            "image": image
        }
        return response;
    },
    info_operations_list_header: {
        speech: 'Aquí tienes una lista de todas las preguntas que me han enseñado. ¡Cada día aprendo más!',
        text: 'Aquí tienes una lista de todas las preguntas que me han enseñado. ¡Cada día aprendo más!'
    },
    info_operations_list: function(list, image){
        // Rellenar lista de intents
        const elements = []
        list.forEach(element => { 
        const item = { 
            cells: [
            {
                text: element.question
            },
            {
                text: element.user
            }
            ]
        }
        elements.push(item)
        })
        const response = {
            "title": "Conocimientos de Odiseo",
            "image": image,
            "columns": [{
              "header": "Preguntas"
            }, {
                "header": "Autor/a"
              }
            ],
            "rows": [elements], 
        }
        return response;
    },
    info_operations_listteachers_header: {
        speech: 'Entonces, ¿Quieres proponer una pregunta nueva? ¡Bien! Primero selecciona a qué profesor quieres enviarle la pregunta. Para seleccionarlo, di su número en la lista',
        text: 'Entonces, ¿Quieres proponer una pregunta nueva? ¡Bien! Primero selecciona a qué profesor quieres enviarle la pregunta. Para seleccionarlo, di su número en la lista'
    },
    info_basic_cancel: {
      speech: 'Operación cancelada. ¡Si quieres hacer otra cosa, di la palabra "Comandos"!',
      text: 'Operación cancelada. ¡Si quieres hacer otra cosa, di la palabra "Comandos"!'
    },
    info_basic_cancel_first: {
      speech: 'Para interactuar conmigo, primero debes cancelar la operación en curso. ¡Si quieres hacerlo, di "Detener Operación"!',
      text: 'Para interactuar conmigo, primero debes cancelar la operación en curso. ¡Si quieres hacerlo, di "Detener Operación"!'
    },
    info_operations_listteachers: function(list, image, pupil){
        // Rellenar lista de intents
        const elements = []
        list.forEach((element, index) => { 
        const item = { 
            cells: [
            {
                text: index.toString()
            },
            {
                text: element.email
            },
            {
                text: element.name
            }
            ]
        }
        elements.push(item)
        })
        const response = {
            "title": "Profesores de " + pupil,
            "image": image,
            "columns": [
              {
                "header": "Número"
             },
              {
                "header": "Email"
             }, {
                "header": "Nombre"
              }
            ],
            "rows": [elements], 
        }
        return response;
    },
    info_operations_upload_completed: function(question, teacher){
      const response = {
        speech: '¡Enhorabuena! Acabas de enviarle a tu profesor (' + teacher + '), la pregunta (' + question + '). Si tu respuesta es correcta, tu pregunta podrán verla otras personas. ¡Gracias por enseñarme! ¡Si quieres hacer otra cosa, di la palabra "Comandos"!',
        text: '¡Enhorabuena! Acabas de enviarle a tu profesor (' + teacher + '), la pregunta (' + question + '). Si tu respuesta es correcta, tu pregunta podrán verla otras personas. ¡Gracias por enseñarme! ¡Si quieres hacer otra cosa, di la palabra "Comandos"!'
      }
      return response;
    },
    input_operations_question: function(user){
      const response = {
        speech: '¡De acuerdo! A continuación, pronuncia de forma clara la pregunta que quieres enviarle a tu profesor (' + user + ')',
        text: '¡De acuerdo! A continuación, pronuncia de forma clara la pregunta que quieres enviarle a tu profesor (' + user + ')'
      }
      return response;
    },
    input_operations_answer: function(input){
      const response = {
        speech: '¡Perfecto! Por último, pronuncia de forma clara la respuesta a la pregunta (' + input + ') para poder enviársela a tu profesor',
        text: '¡Perfecto! Por último, pronuncia de forma clara la respuesta a la pregunta (' + input + ') para poder enviársela a tu profesor'
      }
      return response;
    },
    error_basic_internal: {
        speech: 'El servidor no responde en este momento. Vuelve a intentarlo más tarde.',
        text: 'El servidor no responde en este momento. Vuelve a intentarlo más tarde.'
    },
    error_basic_unknown: {
        speech: 'Lo siento, no te entiendo. ¿Te puedo ayudar en algo? ¡Si quieres conocer todas mis opciones, di la palabra "Comandos"!',
        text: 'Lo siento, no te entiendo. ¿Te puedo ayudar en algo? ¡Si quieres conocer todas mis opciones, di la palabra "Comandos"!'
    },
    error_basic_notsupported: {
        speech: 'Lo siento, esta función no está disponible desde el Asistente de Voz de Odiseo.',
        text: 'Lo siento, esta función no está disponible desde el Asistente de Voz de Odiseo.'
    },
    error_operations_listvoid: {
        speech: '¡Vaya! Parece que no he podido aprender nada todavía.',
        text: '¡Vaya! Parece que no he podido aprender nada todavía. ¡Si quieres hacer otra cosa, di la palabra "Comandos"!'
    },
    error_operations_listvoidteachers: {
        speech: '¡Vaya! Parece que no hay profesores registrados aún. ¡Si quieres hacer otra cosa, di la palabra "Odiseo Cancela Operación"!',
        text: '¡Vaya! Parece que no hay profesores registrados aún. ¡Si quieres hacer otra cosa, di la palabra "Odiseo Cancela Operación"!'
    },
    error_operations_notteacher: {
      speech: 'Lo siento. El profesor seleccionado no existe o no está disponible. Si quieres hacer otra cosa, primero debes cancelar la operación en curso. ¡Si quieres hacerlo, di "Detener Operación"!',
      text: 'Lo siento. El profesor seleccionado no existe o no está disponible. Si quieres hacer otra cosa, primero debes cancelar la operación en curso. ¡Si quieres hacerlo, di "Detener Operación"!'
    },
    error_operations_existsquestion: function(input){
      const response = {
        speech: 'Lo siento, no he podido enviar la pregunta (' + input + ') porque ya la aprendí de otra persona. ¡Si quieres hacer otra cosa, di la palabra "Comandos"!',
        text: 'Lo siento, no he podido enviar la pregunta (' + input + ') porque ya la aprendí de otra persona. ¡Si quieres hacer otra cosa, di la palabra "Comandos"!'
      }
      return response;
    },
});
