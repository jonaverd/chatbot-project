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
const usersAuth = require('./Users/validators.js');

// Create an app instance
const app = conversation()//{debug:true}
console.log('Google Assistant Detected')

// middleware for errors
app.catch((conv, error) => {
  console.error(error);
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
      url: referencesURI.imageURI_Welcome,
      alt: 'Odiseo Chatbot',
    }))
    this.conv.add(new Simple({
      speech: '¡Bienvenido! Soy Odiseo, tu agente personalizado. Estoy diseñado para aprender cualquier cuestión educativa. ¿Quieres que empecemos? ¡Aquí te dejo algunas sugerencias! Por ejemplo, puedes decirme que aprenda algo nuevo, que te muestre tus enseñanzas guardadas, que responda algo aleatorio o que te muestre mas opciones',
      text: '¡Bienvenido! Soy Odiseo, tu agente educativo. ¿Que quieres hacer?'
    }));
    this.conv.add(new Suggestion({ title: 'Dime alguna curiosidad' }));
    this.conv.add(new Suggestion({ title: 'Aprende algo nuevo' }));
    this.conv.add(new Suggestion({ title: 'Cambiar una respuesta' }));
    this.conv.add(new Suggestion({ title: 'Muéstrame más opciones' }));
    this.conv.add(new Suggestion({ title: 'Hasta luego' }));
  }
  input_exit() {
    this.conv.add(new Simple({
      speech: 'Un placer trabajar contigo, ¡Nos vemos pronto!',
      text: '¡Hasta la próxima!'
    }));
  }
  input_unknown(){
    this.conv.add(new Simple({
      speech: 'Lo siento, no te entiendo. ¿Te puedo ayudar en algo? Si quieres conocer mis comandos prueba a decir: Otras funciones',
      text: 'No puedo encontrar ninguna referencia. Escribe "Otras funciones" para ver mi lista de comandos'
    }));
    this.conv.add(new Suggestion({ title: 'Otras funciones' }));
    this.conv.add(new Suggestion({ title: 'Salir' }));
  }
  input_options(){
    this.conv.add(new Simple({
      speech: 'Aquí tienes una lista de referencias con todos mis comandos. Para ir a la página de bienvenida di "Hola Odiseo". Para terminar la conversación di "Hasta luego". Para conocer todas las referencias di "Opciones". Para activar el asistente guiado de aprendizaje di "Quiero enseñarte".',
      text: 'Aquí tienes una lista de referencias con todos mis comandos. ¿Qué quieres hacer?'
    }));
    this.conv.add(new Table({
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
    this.conv.add(new Suggestion({ title: 'Hola Odiseo' }));
    this.conv.add(new Suggestion({ title: 'Hasta luego' }));
    this.conv.add(new Suggestion({ title: 'Opciones' }));
    this.conv.add(new Suggestion({ title: 'Quiero enseñarte' }));
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
    // Error ya existe
    if(await backendTools.existsBackend_Question(this.conv.intent.query, this.conv.user.params.email)){
      this.conv.add(new Simple({
        speech: 'Lo siento, no he podido aprender la cuestión (' + this.conv.intent.query + ') porque ya existe en mi base de conocimiento. Si deseas realizar otra consulta, di "Continuar"',
        text: '¡Esta pregunta ya la tenía guardada! (' + this.conv.intent.query + ') Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{ 
      await backendTools.createBackend_Question(this.conv.intent.query, this.conv.user.params.email)
      // save question temporal data
      this.conv.user.params.input = this.conv.intent.query;
      this.conv.add(new Simple({
        speech: '¡Perfecto! Acabo de añadir esta cuestión (' + this.conv.intent.query + ') a mi base de aprendizaje. A continuación, pronuncia de forma clara la respuesta que deseas vincular a esta cuestión',
        text: '¡Correcto! La cuestión (' + this.conv.intent.query + ') ha sido guardada. ¿Cuál es su respuesta?'
      }));
    }
  }
  async input_new_question_request_answer(){
    // Error no existe 
    if(!await backendTools.existsBackend_Question(this.conv.user.params.input, this.conv.user.params.email)){
      this.conv.add(new Simple({
        speech: 'Lo siento, se ha producido un error al modificar la respuesta para la cuestion (' + this.conv.user.params.input + '). No existe o no está disponible. Si deseas realizar otra consulta, di "Continuar"',
        text: 'No se encuentra la cuestión (' + this.conv.user.params.input + ') o no está disponible. Si deseas realizar otra consulta, escribe (Continuar)'
      }));
      this.conv.add(new Suggestion({ title: 'Continuar' }));
    }
    // Continuar
    else{ 
      await backendTools.updateBackend_Answer(this.conv.user.params.input, this.conv.intent.query, this.conv.user.params.email)
      this.conv.add(new Simple({
        speech: '¡Gracias por enseñarme! La respuesta para (' + this.conv.user.params.input + ') es (' + this.conv.intent.query + '). Me siento más inteligente. Si deseas completar tu cuestión con información adicional di "Añadir Imagen" o "Añadir Mapa". De lo contarrio, di "Otras Funciones" ',
        text: '¡Completado! La respuesta para (' + this.conv.user.params.input + ') es (' + this.conv.intent.query + '). Si deseas completar con más información escribe "Añadir Imagen" o "Añadir Mapa" Si deseas realizar otra operación, escribe "Otras funciones". '
      }));
      this.conv.add(new Suggestion({ title: 'Añadir Imagen' }));
      this.conv.add(new Suggestion({ title: 'Añadir Mapa' }));
      this.conv.add(new Suggestion({ title: 'Otras funciones' }));
      this.conv.add(new Suggestion({ title: 'Guardar otra pregunta' }));
    }
  }
  async input_update_question_image(){
    if(this.conv.intent.query=="Añadir Imagen"){
      this.conv.add(new Simple({
        speech: 'Te tengo: '+ this.conv.user.params.input,
        text: 'Te tengo: '+ this.conv.user.params.input
      }));
    }
    else{
      this.conv.add(new Simple({
        speech: 'Lista',
        text: 'Lista'
      }));
    }
  }
}
// middleware for users login 
app.middleware(async (conv) => {
  // Controlar entradas de los formularios
  let input;
  if(conv.user.params.request){ input = conv.intent.query }
  else{ input = null }
  // No hay sesión de email
  if(!conv.user.params.email){
    // No hay temporal activado (sigue peticion de email)
    if(!conv.user.params.temporal){
      // ¿formato válido?
      if (input && usersAuth.validatorEmail.validate(input)){
        // No hay email registrado 
        if(!await backendTools.getBackend_User(input)){
          await backendTools.createBackend_User(input)
          // email temporal de comprobacion
          if(!conv.user.params.temporal){ conv.user.params.temporal = input; }
          conv.add(new Image({
            url: referencesURI.imageURI_Login,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'Gracias. Para continuar con el registro necesito crear una contraseña personal. Recuerda que tus datos serán encriptados por seguridad: ¿Puedes introducir tu contraseña?',
            text: 'Recuerda que tus datos serán encriptados por seguridad. Para continuar (introduce tu contraseña):'
          }));
          conv.user.params.request = true;
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
            speech: 'Email verificado: ' + conv.user.params.temporal + '. Introduce la contraseña para recuperar tus datos de usuario',
            text: 'Email verificado (' + conv.user.params.temporal + ') Introduce tu contraseña para acceder a tu cuenta:'
          }));
          conv.user.params.request = true;
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
        conv.user.params.request = true;
      }
    }
    // Temporal activado
    else{
      // No hay contraseña registrada
      if (!await backendTools.getBackend_UserPassword(conv.user.params.temporal)){
        // ¿formato válido?
        if(input && usersAuth.schema.validate(input)){
          await backendTools.updateBackend_UserPassword(await usersAuth.gethashPassword(input), conv.user.params.temporal)
          conv.add(new Image({
            url: referencesURI.imageURI_Login,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'Correcto. Para completar el registro de tu usuario necesito algunos datos adicionales. Recuerda que tus datos mantendrán su privacidad y no serán compartidos. ¿Puedes introducir tu nombre',
            text: 'Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para continuar el registro (introduce tu nombre)'
          }));
          conv.user.params.request = true;  
          conv.user.params.password = await backendTools.getBackend_UserPassword(conv.user.params.temporal);
        }
        // formato incorrecto
        else{
          conv.add(new Image({
            url: referencesURI.imageURI_Login,
            alt: 'Odiseo Chatbot',
          }))
          conv.add(new Simple({
            speech: 'No se puede completar el registro. Por favor, introduce tu contraseña con un formato válido',
            text: 'Error en el registro. Introduce una contraseña válida:'
          }));
          conv.user.params.request = true;
        }   
      }
      // Hay contraseña registrada
      else{
        // No hay sesión de contraseña (¿Login?)
        if(!conv.user.params.password){
          // ¿formato válido?
          if(input && usersAuth.schema.validate(input)){
            // login válido
            if(await usersAuth.comparehashPassword(input, await backendTools.getBackend_UserPassword(conv.user.params.temporal))){
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'Contraseña verificada. Identificado como: ' + conv.user.params.temporal + '. Para completar el acceso a tu cuenta, di "Iniciar Sesión',
                text: 'Contraseña verificada. Identificado como: ' + conv.user.params.temporal + '. Para acceder a tu cuenta, escribe "Iniciar Sesión"'
              }));
              conv.add(new Suggestion({ title: 'Iniciar Sesión' }));
              conv.user.params.request = false;  
              conv.user.params.password = await backendTools.getBackend_UserPassword(conv.user.params.temporal);
            }
            // login error
            else{
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'La contraseña introducida no es correcta. Por favor, ingresa tu contraseña para iniciar sesión con este usuario (' + conv.user.params.temporal + '):',
                text: 'La contraseña no es correcta. Introduce la contraseña asociada a este usuario (' + conv.user.params.temporal + '):'
              }));
              conv.user.params.request = true;
            }
          }
          // formato incorrecto (entrada normal)
          else{
            conv.add(new Image({
              url: referencesURI.imageURI_Login,
              alt: 'Odiseo Chatbot',
            }))
            conv.add(new Simple({
              speech: 'Email verificado: ' + conv.user.params.temporal + '. Introduce la contraseña para recuperar tus datos de usuario',
              text: 'Email verificado (' + conv.user.params.temporal + ') Introduce tu contraseña para iniciar sesión:'
            }));
            conv.user.params.request = true;
          }
        }
        // Hay sesión de contraseña
        else{
          // No hay nombre registrado
          if(!await backendTools.getBackend_UserName(conv.user.params.temporal)) {
            // ¿formato válido?
            if(input && usersAuth.validatorNames(input)){
              await backendTools.updateBackend_UserName(input, conv.user.params.temporal)
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'Perfecto. Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para el siguiente proceso: ¿Puedes introducir tus apellidos?',
                text: 'Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para continuar (introduce tus apellidos):'
              }));
              conv.user.params.request = true;
            }
            // formato incorrecto
            else{
              conv.add(new Image({
                url: referencesURI.imageURI_Login,
                alt: 'Odiseo Chatbot',
              }))
              conv.add(new Simple({
                speech: 'No se puede completar el registro. Por favor, introduce tu nombre con un formato válido',
                text: 'Error en el registro. Introduce un nombre válido:'
              }));
              conv.user.params.request = true;
            }
          }
          // Hay nombre registrado
          else{
            // No hay apellidos registrados
            if (!await backendTools.getBackend_UserLastName(conv.user.params.temporal)){
              // ¿formato válido?
              if(input && usersAuth.validatorNames(input)){
                await backendTools.updateBackend_UserLastName(input, conv.user.params.temporal)
                conv.add(new Image({
                  url: referencesURI.imageURI_Login,
                  alt: 'Odiseo Chatbot',
                }))
                conv.add(new Simple({
                  speech: 'Correcto. Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para el último dato: ¿Puedes introducir tu edad?',
                  text: 'Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para continuar (introduce tu edad):'
                }));
                conv.user.params.request = true;
              }
              // formato incorrecto
              else{
                conv.add(new Image({
                  url: referencesURI.imageURI_Login,
                  alt: 'Odiseo Chatbot',
                }))
                conv.add(new Simple({
                  speech: 'No se puede completar el registro. Por favor, introduce tus apellidos con un formato válido',
                  text: 'Error en el registro. Introduce unos apellidos válidos:'
                }));
                conv.user.params.request = true;
              }  
            }
            // Hay apellidos registrados
            else{
              // No hay edad registrada
              if (!await backendTools.getBackend_UserAge(conv.user.params.temporal)){
                // ¿formato válido?
                if(input && usersAuth.validatorNumbers(input)){
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
                  conv.user.params.request = true;
                }
                // formato incorrecto
                else{
                  conv.add(new Image({
                    url: referencesURI.imageURI_Login,
                    alt: 'Odiseo Chatbot',
                  }))
                  conv.add(new Simple({
                    speech: 'No se puede completar el registro. Por favor, introduce tu edad con un formato válido',
                    text: 'Error en el registro. Introduce una edad válida:'
                  }));
                  conv.user.params.request = true;
                }   
              }
              // Hay edad registrada
              else{
                // Hay contraseña registrada (todos los campos disponibles)
                conv.user.params.email = conv.user.params.temporal;
                conv.user.params.name = await backendTools.getBackend_UserName(conv.user.params.email)
                conv.user.params.lastname = await backendTools.getBackend_UserLastName(conv.user.params.email)
                conv.user.params.age = await backendTools.getBackend_UserAge(conv.user.params.email)
                conv.user.params.password = await backendTools.getBackend_UserPassword(conv.user.params.email)
                conv.add(new Image({
                  url: referencesURI.imageURI_Login,
                  alt: 'Odiseo Chatbot',
                }))
                conv.add(new Simple({
                  speech: 'Bienvenido de nuevo: ' + conv.user.params.name + ' ' + conv.user.params.lastname + '. Me alegra verte de nuevo. Si quieres comenzar prueba a decir "Hola Odiseo"',
                  text: 'Bienvenido de nuevo: ' + conv.user.params.name + ' ' + conv.user.params.lastname + '. Para iniciar el asistente di "Hola Odiseo"'
                }));
                conv.add(new Suggestion({ title: 'Hola Odiseo' }));
                conv.user.params.request = false;
              }
            }
          }
        }
      }
    }
  }
  // Hay sesión de email
  else{
    // Existe usuario en la sesión
    conv.assistant = new Assistant(conv);
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

// input.update.question.image
app.handle('ConversationOperations_TeachingAssistant_UpdateImage', async conv => {
  await conv.assistant?.input_update_question_image()
})

module.exports = app;