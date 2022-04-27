
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
// Actualizar la interaccion donde espera un input
// Similar a los user.params del Asistente (datos de la sesion)
const WaitingInput = backendTools.WaitingInput();
// Auxiliar - Parametros del middleware para el login en cada peticion
// Similar a los user.params del Asistente (datos de la sesion)
const UsersParams = backendTools.UserParams();

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.agent = async function (req, res) {

  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });
  
  // Comprobar si estamos en la misma sesion u otra 
  // para actualizar los datos del usuario
  UsersParams.reload(req.body.session);

  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  console.log('DialogFlow Panel Detected')

  // Actuar de middleware para el login en cada peticion
  async function Middleware(agent){
    // Controlar entradas de los formularios
    let input = req.body.queryResult.queryText
    // No hay temporal activado (sigue peticion de email)
    if(!UsersParams.getTemporal()){
      // ¿formato válido?
      if (usersAuth.validatorEmail.validate(input)){
        // No hay email registrado 
        if(!await backendTools.getBackend_User(input)){
          // el email se crea mas adelante (con la contraseña)
          // email temporal de comprobacion
          if(!UsersParams.getTemporal()){ UsersParams.setTemporal(input) }
          const response = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Registro",
                        "subtitle": "Gracias. Para continuar con el registro necesito crear una contraseña personal. Recuerda que tus datos serán encriptados por seguridad. Introduce tu contraseña (PIN de 6 dígitos)",
                        "image": {
                            "src": {
                                "rawUrl": referencesURI.imageURI_Login
                            }
                        },
                    }
                ]
            ]
          }
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
        // Hay email registrado
        else{
          // email temporal de comprobacion
          if(!UsersParams.getTemporal()){ UsersParams.setTemporal(input) }
          const response = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Iniciar Sesión",
                        "subtitle": "Email verificado (" + UsersParams.getTemporal() + ") Introduce tu contraseña para acceder a tu cuenta (clave PIN de 6 dígitos)",
                        "image": {
                            "src": {
                                "rawUrl": referencesURI.imageURI_Login
                            }
                        },
                    }
                ]
            ]
          }
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
      }
      // formato incorrecto (entrada normal)
      else{
        const response = RichContentResponses.login;
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // Temporal activado
    else{
      // No hay contraseña registrada
      if (input && await backendTools.getBackend_UserPassword(UsersParams.getTemporal())==null){
        // ¿formato válido?
        if(usersAuth.schema.validate(input)){
          // se crea el email y la contraseña
          await backendTools.createBackend_User(UsersParams.getTemporal())
          await backendTools.updateBackend_UserPassword(await usersAuth.gethashPassword(input), UsersParams.getTemporal())
          const response = 
          {
            "richContent": 
            [
              [
                {
                  "type": "info",
                  "title": "Registro",
                  "subtitle": "Correcto. Para completar el registro de tu usuario necesito algunos datos adicionales. Recuerda que tus datos mantendrán su privacidad y no serán compartidos (Introduce tu nombre y apellidos)",
                  "image": 
                  {
                    "src": 
                    {
                      "rawUrl": referencesURI.imageURI_Login
                    }
                  }
                }
              ]
            ]
          }
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true})); 
          UsersParams.setPassword(true);
        }
        // formato incorrecto
        else{
          const response = {
            "richContent": 
            [
              [
                {
                  "type": "info",
                  "title": "Registro",
                  "subtitle": "No se puede completar el registro. Por favor, introduce tu contraseña con un formato válido (PIN de 6 dígitos)",
                  "image": 
                  {
                    "src": 
                    {
                      "rawUrl": referencesURI.imageURI_Error
                    }
                  }
                }
              ]
            ]
          }
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
      }
      // Hay contraseña registrada
      else{
        // No hay sesión de contraseña (¿Login?)
        if(!UsersParams.getPassword()){
          // ¿formato válido?
          if(usersAuth.schema.validate(input)){
            // login válido
            if(input && await usersAuth.comparehashPassword(input, await backendTools.getBackend_UserPassword(UsersParams.getTemporal()))){
              const response = {
                "richContent": 
                [
                  [
                    {
                      "type": "info",
                      "title": "Iniciar Sesión",
                      "subtitle": "Contraseña verificada. Identificado como: " + UsersParams.getTemporal() + ". Para acceder a tu cuenta, escribe 'Iniciar Sesión'",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    },
                    {
                      "type": "chips",
                      "options": [
                        {
                          "text": "Iniciar Sesión",
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
              UsersParams.setPassword(true);
            }
            // login error
            else{
              const response = {
                "richContent": 
                [
                  [
                    {
                      "type": "info",
                      "title": "Iniciar Sesión",
                      "subtitle": "La contraseña no es correcta. Introduce la contraseña asociada a este usuario: " + UsersParams.getTemporal() + " (PIN de 6 dígitos)",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Error
                        }
                      }
                    }
                  ]
                ]
              }
              agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
            }
          }
          // formato incorrecto (entrada normal)
          else{
            const response = {
              "richContent": [
                  [
                      {
                          "type": "info",
                          "title": "Iniciar Sesión",
                          "subtitle": "Email verificado (" + UsersParams.getTemporal() + ") Introduce tu contraseña para acceder a tu cuenta (clave PIN de 6 dígitos)",
                          "image": {
                              "src": {
                                  "rawUrl": referencesURI.imageURI_Login
                              }
                          },
                      }
                  ]
              ]
            }
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
        }
        // Hay sesión de contraseña
        else{
          // No hay nombre registrado
          if(input && await backendTools.getBackend_UserName(UsersParams.getTemporal())==null) {
            // ¿formato válido?
            if(usersAuth.validatorNames(input)){
              await backendTools.updateBackend_UserName(input, UsersParams.getTemporal())
              const response = 
              {
                "richContent": 
                [
                  [
                    {
                      "type": "info",
                      "title": "Registro",
                      "subtitle": "Perfecto. Recuerda que tus datos mantendrán su privacidad y no serán compartidos. Para el siguiente proceso (Introduce tu edad)",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                ]
              }
              agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
            }
            // formato incorrecto
            else{
              const response = 
              {
                "richContent": 
                [
                  [
                    {
                      "type": "info",
                      "title": "Registro",
                      "subtitle": "No se puede completar el registro. Por favor, introduce tu nombre y apellidos con un formato válido",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Error
                        }
                      }
                    }
                  ]
                ]
              }
              agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
            }
          }
          // Hay nombre registrado
          else{
            // No hay edad registrada
            if (input && await backendTools.getBackend_UserAge(UsersParams.getTemporal())==null){
              // ¿formato válido?
              if(usersAuth.validatorNumbers(input)){
                await backendTools.updateBackend_UserAge(input, UsersParams.getTemporal())
                const response = 
                {
                  "richContent": 
                  [
                    [
                      {
                        "type": "info",
                        "title": "Registro",
                        "subtitle": "¡Registro completado! Usuario: " + UsersParams.getTemporal() + ". Gracias por tu paciencia. La próxima vez que te identifiques podré reconocerte. Para completar el acceso a tu cuenta, escribe 'Iniciar Sesión'",
                        "image": 
                        {
                          "src": 
                          {
                            "rawUrl": referencesURI.imageURI_Login
                          }
                        }
                      },
                      {
                        "type": "chips",
                        "options": [
                          {
                            "text": "Iniciar Sesión",
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
              // formato incorrecto
              else{
                const response = 
                {
                  "richContent": 
                  [
                    [
                      {
                        "type": "info",
                        "title": "Registro",
                        "subtitle": "No se puede completar el registro. Por favor, introduce tu edad con un formato válido (numérico 2 cifras)",
                        "image": 
                        {
                          "src": 
                          {
                            "rawUrl": referencesURI.imageURI_Error
                          }
                        }
                      }
                    ]
                  ]
                }
                agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
              }
            }
            // Hay edad registrada
            else{
              // Hay contraseña registrada (todos los campos disponibles)
              UsersParams.setUser(UsersParams.getTemporal());
              UsersParams.setName(await backendTools.getBackend_UserName(UsersParams.getUser()));
              UsersParams.setAge(await backendTools.getBackend_UserAge(UsersParams.getUser()));
              const response = 
              {
                "richContent": 
                [
                  [
                    {
                      "type": "info",
                      "title": "Iniciar Sesión",
                      "subtitle": "Bienvenido de nuevo: " + UsersParams.getName() + ". Para iniciar el asistente escribe 'Hola Odiseo'",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    },
                    {
                      "type": "chips",
                      "options": [
                        {
                          "text": "Hola Odiseo",
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
        }
      }
    }
  }

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
      if(input && await backendTools.existsBackend_Question(input,UsersParams.getUser())){
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
      await backendTools.createBackend_Question(WaitingInput.current(), UsersParams.getUser())
      await backendTools.updateBackend_Answer(WaitingInput.current(), input, UsersParams.getUser())
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
  async function ConversationOperations_TeachingAssistant_List(agent) {
    const response = await RichContentResponses.show_details_list(UsersParams.getUser());
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.random.question
  function ConversationOperations_TeachingAssistant_RandomQuestion(agent) {
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  // Hay sesión de email
  if(UsersParams.getUser()){
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
  }
  // No hay sesión de email
  else{
    intentMap.set('ConversationBasic_Welcome', Middleware);
    intentMap.set('ConversationBasic_Exit', Middleware);
    intentMap.set('ConversationBasic_Fallback', Middleware);
    intentMap.set('ConversationBasic_Options', Middleware);
    intentMap.set('ConversationMain_TeachingAssistant', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_InputQuestion', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_InputAnswer', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_DeleteQuestion', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm', Middleware);
    intentMap.set('ConversationMain_TeachingAssistant_UpdateAnswer', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage_InputImage', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_List', Middleware);
    intentMap.set('ConversationOperations_TeachingAssistant_RandomQuestion', Middleware);
  }
  agent.handleRequest(intentMap);
}
