// Respuestas de texto enriquecido utilizadas en dialogflow chat web
const referencesURI = require('./Assets/references.js');
const backendTools = require('./server-operations.js');
module.exports = Object.freeze({
    options: {
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
            "title": "Salir",
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
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Cerrar Sesión",
            "subtitle": "Devuelve al usuario al menú de Login, cerrando su sesión",
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
                },
                {
                  "text": "Cerrar Sesión",
                  "image": {
                      "src": {
                      "rawUrl": referencesURI.imageURI_Login
                      }
                  }
                  }
            ]
            }
        ]
        ]
    },
    unknown: {
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
                  "text": "Salir",
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
    },
    exit: {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Salir",
              "subtitle": "Un placer trabajar contigo, ¡Nos vemos pronto!",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Public
                }
              },
            }
          ]
        ]
    },
    info_basic_welcome: function(name){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Hola " + name,
              "subtitle": "¡Bienvenido/a de nuevo! Soy Odiseo, tu agente educativo. ¿Que quieres hacer?",
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
                  "text": "Salir",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Public
                    }
                  }
                },
                {
                  "text": "Cerrar Sesión",
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
      return response;
    },
    cancel: {
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
    },
    login:
    {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Identifícate",
                    "subtitle": "Bienvenido al asistente educativo Odiseo. Para continuar es necesario que 'Inicies Sesión' con tu cuenta o te 'Registres'.",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Login
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Iniciar Sesión",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    },
                    {
                      "text": "Registro",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
    },
    show_basic_list: async function(user){
        const list = await backendTools.listBackend_Question(user);
        // Rellenar lista de intents
        const elements = []
        const info =  {
            "type": "info",
            "title": "Almacén",
            "subtitle": "Mostrando lista personal. Para realizar alguna operación escribe 'Otras funciones'",
            "image": {
                "src": {
                "rawUrl": referencesURI.imageURI_Public
                }
            },
        }
        elements.push(info);
        list.forEach(element => { 
            const divider = {
            "type": "divider"
            }
            const item = {
                "type": "list",
                "title": element.question,
                "subtitle": element.answer,
            }
            elements.push(divider);
            elements.push(item);
        })
        const suggestions = {
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
        elements.push(suggestions);
        const response = {
            "richContent": [
                elements
            ]
        }
        return response;
    },
    show_details_list: async function(user){
        const list = await backendTools.listBackend_Question(user);
        // Rellenar lista de intents
        const elements = []
        const info =  {
            "type": "info",
            "title": "Almacén",
            "subtitle": "Mostrando lista personal. Para realizar alguna operación escribe 'Otras funciones'",
            "image": {
                "src": {
                "rawUrl": referencesURI.imageURI_Public
                }
            },
        }
        elements.push(info);
        list.forEach(element => { 
            const divider = {
            "type": "divider"
            }
            const url = {
                "rawUrl": element.visual
            }
            const image = {
                "src": url
            }
            const item = {
                "type": "accordion",
                "title": element.question,
                "subtitle": element.user,
                "image": image,
                "text": element.answer
            }
            elements.push(divider);
            elements.push(item);
        })
        const suggestions = {
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
        elements.push(suggestions);
        const response = {
            "richContent": [
                elements
            ]
        }
        return response;
    },
    error_users_login_emailnotexists: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "El email " + input +" no está registrado en mi base de datos",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    input_users_login_waitingpassword: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Iniciar Sesión",
                    "subtitle": "Email verificado (" + user + ") Introduce tu contraseña de 6 dígitos para acceder a tu cuenta.",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Login
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    error_users_login_emailnotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "La entrada " + input +" no es un email con formato válido",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    error_users_login_passwordnotexists: function(email){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "El email " + email +" no tiene una contraseña registrada.",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    info_users_login_access: function(user){
      const response = {
        "richContent": 
        [
          [
            {
              "type": "info",
              "title": "Iniciar Sesión",
              "subtitle": "Contraseña verificada. Identificado como: " + user + ". Para acceder a tu cuenta, escribe 'Acceder'",
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
                  "text": "Acceder",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Login
                    }
                  }
                },
                {
                  "text": "Cancelar",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Login
                    }
                  }
                }
              ]
            }
          ]
        ]
      }
      return response;
    },
    error_users_login_access: function(user){
      const response = {
        "richContent": 
        [
          [
            {
              "type": "info",
              "title": "Error",
              "subtitle": "La contraseña no es correcta. Introduce la contraseña de 6 dígitos asociada a este usuario: " + user,
              "image": 
              {
                "src": 
                {
                  "rawUrl": referencesURI.imageURI_Error
                }
              }
            },
            {
              "type": "chips",
              "options": 
              [
                {
                  "text": "Cancelar",
                  "image": 
                  {
                    "src": 
                    {
                      "rawUrl": referencesURI.imageURI_Login
                    }
                  }
                }
              ]
            }
          ]
        ]
      }
      return response;
    },
    error_users_login_passwordnotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "La entrada " + input +" no es una contraseña con formato válido",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    error_users_login_namenotexists(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "El email " + user +" no tiene un nombre registrado.",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    error_users_login_agenotexists(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "El email " + user +" no tiene una edad registrada.",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    input_users_register_waitingpassword: 
    {
        "richContent": [
            [
                {
                    "type": "info",
                    "subtitle": "Recuerda que la privacidad de tus datos siempre será respetada y nunca serán compartidos. Tu contraseña se guardará como una llave cifrada por razones de seguridad",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Help
                        }
                    },
                },
                {
                    "type": "info",
                    "title": "Registro",
                    "subtitle": "Gracias. Para continuar con el registro necesito crear una contraseña personal de 6 dígitos. Introduce tu 'contraseña'. Si quieres volver al inicio, escribe 'Cancelar'",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Login 
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
    },
    error_users_register_emailnotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "La entrada " + input +" no es un email con formato válido",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    input_users_register_waitingname: 
    {
      "richContent": [
          [
              {
                  "type": "info",
                  "subtitle": "Recuerda que la privacidad de tus datos siempre será respetada y nunca serán compartidos. Los datos adicionales se recojerán únicamente para tu identificación personal, o bien, para extraer estadísticas relacionadas con el uso de la aplicación.",
                  "image": {
                      "src": {
                          "rawUrl": referencesURI.imageURI_Help
                      }
                  },
              },
              {
                  "type": "info",
                  "title": "Registro",
                  "subtitle": "Perfecto. Si quieres completar el registro tendrás que facilitarme algunos datos adicionales. Introduce tu 'nombre y apellidos'. Si quieres volver al inicio, escribe 'Cancelar'",
                  "image": {
                      "src": {
                          "rawUrl": referencesURI.imageURI_Login 
                      }
                  },
              },
              {
                "type": "chips",
                "options": 
                [
                  {
                    "text": "Cancelar",
                    "image": 
                    {
                      "src": 
                      {
                        "rawUrl": referencesURI.imageURI_Login
                      }
                    }
                  }
                ]
              }
          ]
      ]
    },
    error_users_register_passwordnotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "La entrada " + input +" no es una contraseña con formato válido",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    },
    input_users_register_waitingage: {
      "richContent": [
          [
              {
                  "type": "info",
                  "subtitle": "Recuerda que la privacidad de tus datos siempre será respetada y nunca serán compartidos. Los datos adicionales se recojerán únicamente para tu identificación personal, o bien, para extraer estadísticas relacionadas con el uso de la aplicación.",
                  "image": {
                      "src": {
                          "rawUrl": referencesURI.imageURI_Help
                      }
                  },
              },
              {
                  "type": "info",
                  "title": "Registro",
                  "subtitle": "Correcto. Para finalizar el registro de tu cuenta introduce tu 'edad'. Si quieres volver al inicio, escribe 'Cancelar'",
                  "image": {
                      "src": {
                          "rawUrl": referencesURI.imageURI_Login 
                      }
                  },
              },
              {
                "type": "chips",
                "options": 
                [
                  {
                    "text": "Cancelar",
                    "image": 
                    {
                      "src": 
                      {
                        "rawUrl": referencesURI.imageURI_Login
                      }
                    }
                  }
                ]
              }
          ]
      ]
    },
    error_users_register_namenotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "La entrada " + input +" no es un nombre o apellidos con formato válido",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Error
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Cancelar",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Login
                        }
                      }
                    }
                  ]
                }
            ]
        ]
      }
      return response;
    }
});
