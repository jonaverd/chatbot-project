// Respuestas de texto enriquecido utilizadas en dialogflow chat web
const { default: store } = require('store2');
const referencesURI = require('../Assets/references.js');
module.exports = Object.freeze({
    info_basic_welcome: function(user){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Hola " + user,
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
                  "text": "Menu Principal",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Public
                    }
                  }
                },
                {
                  "text": "Hasta Luego Odiseo",
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
    info_basic_exit: function(user){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Adiós, " + user,
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
      return response;
    },
    info_basic_options: function(user){
      const response = {
        "richContent": [
        [
          {
            "type": "info",
            "subtitle": "Sesión iniciada: " + user,
            "image": {
                "src": {
                    "rawUrl": referencesURI.imageURI_Help
                }
            },
            },
            {
            "type": "info",
            "title": "Menu Principal",
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
            "title": "<Pedir Cuestión>",
            "subtitle": "El usuario puede pedir en cualquier momento una pregunta al agente. Si el agente dispone de la respuesta (en su base de conocimiento) podrá ayudar al usuario",
            },
            {
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Quiero Enseñarte",
            "subtitle": "Activa el aprendizaje guiado del asistente",
            },
            {
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Quiero Actualizar Respuesta",
            "subtitle": "Modifica la respuesta de una pregunta que haya almacenado el usuario",
            },
            {
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Quiero Actualizar Imagen",
            "subtitle": "Modifica la imagen de una pregunta que haya almacenado el usuario",
            },
            {
            "type": "divider"
            },
            {
              "type": "divider"
              },
              {
              "type": "list",
              "title": "Quiero Eliminar Cuestión",
              "subtitle": "Borra una pregunta que haya almacenado el usuario",
              },
            {
            "type": "list",
            "title": "Muéstrame Base de Conocimiento",
            "subtitle": "Muestra todas las preguntas almacenadas por el agente. El usuario puede filtrar la lista para mostrar sólo las suyas",
            },
            {
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Dime Alguna Curiosidad",
            "subtitle": "El agente busca una pregunta al azar para responder al usuario",
            },
            {
              "type": "divider"
              },
              {
              "type": "list",
              "title": "Comprobar Cuestiones Pendientes",
              "subtitle": "El agente comprueba las preguntas que solicitan la aprobación del usuario",
              },
            {
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Hasta Luego Odiseo",
            "subtitle": "La conversación finaliza",
            },
            {
            "type": "divider"
            },
            {
            "type": "list",
            "title": "Cerrar Sesión",
            "subtitle": "Se cierra la sesión del usuario y lo devuelve al menú de login",
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
                },
                {
                "text": "Quiero Enseñarte",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                },
                {
                "text": "Quiero Actualizar Respuesta",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                },
                {
                "text": "Quiero Actualizar Imagen",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                },
                {
                "text": "Quiero Eliminar Cuestión",
                "image": {
                  "src": {
                  "rawUrl": referencesURI.imageURI_Public
                  }
                }
                },
                {
                "text": "Muéstrame Base de Conocimiento",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                },
                {
                "text": "Dime Alguna Curiosidad",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                },
                {
                  "text": "Comprobar Cuestiones Pendientes",
                  "image": {
                      "src": {
                      "rawUrl": referencesURI.imageURI_Public
                      }
                  }
                  },
                {
                  "text": "Hasta Luego Odiseo",
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
      }
      return response;
    },
    info_basic_login:
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
    info_basic_cancel: {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Cancelado",
            "subtitle": "He cancelado la operación. Para realizar otras operaciones escribe 'Continuar'",
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
    info_users_login_access: function(user){
      const response = {
        "richContent": 
        [
          [
            {
              "type": "info",
              "title": "Confirmar Acceso",
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
    info_users_register_completed: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Registro Completado",
                    "subtitle": "La próxima vez podré identificarte como " + user + ". Si quieres volver al inicio, escribe 'Finalizar'",
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
                      "text": "Finalizar",
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
    info_learning_create_completed: function(preview, input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cuestión Guardada",
              "subtitle": "¡Gracias por enseñarme! La respuesta para (" + preview + ") es (" + input + "). Si deseas realizar otra operación, escribe 'Menu Principal'.",
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
                  "text": "Menu Principal",
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
    info_learning_response_question: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "image",
              "rawUrl": input.visual,
              "accessibilityText": "Odiseo Chatbot"
            },
            {
              "type": "info",
              "subtitle": "Autor: " + input.user,
              "image": {
                  "src": {
                      "rawUrl": referencesURI.imageURI_Help
                  }
              },
            },
            {
              "type": "info",
              "title": "Cuestión: " + input.question,
              "subtitle": "Respuesta: " + input.answer,
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
                  "text": "Menu Principal",
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
    info_learning_list_choice: function(user)
    {
      const response = {  
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "¿Filtrar Cuestiones?",
                    "subtitle": "Para filtrar sólo tus cuestiones personales escribe 'Creadas por " + user + "'. Si quieres ver una lista completa con todas las cuestiones disponibles escribe 'Mostrar Todas'. Si deseas realizar otra operación, escribe 'Menu Principal'",
                    "image": {
                        "src": {
                            "rawUrl": referencesURI.imageURI_Public
                        }
                    },
                },
                {
                  "type": "chips",
                  "options": 
                  [
                    {
                      "text": "Mostrar Todas",
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Help
                        }
                      }
                    },
                    {
                      "text": "Creadas por " + user,
                      "image": 
                      {
                        "src": 
                        {
                          "rawUrl": referencesURI.imageURI_Help
                        }
                      }
                    },
                    {
                      "text": "Menu Principal",
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
    info_learning_detailslist: function(list, name){
      let response;
      // Avisar de que no hay existencias
      if(list.length===0){
        const elements = []
        const info =  {
          "type": "info",
          "title": "Almacén de " + name,
          "subtitle": "Mostrando lista personal. Para realizar alguna operación escribe 'Menu Principal'",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Public
              }
          },
        }
        elements.push(info);
        const main = {
          "type": "info",
          "title": "No hay cuestiones disponibles" ,
          "subtitle": "Mi base de conocimiento está vacía. No has guardado ninguna cuestión aún.",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Help
              }
          },
        }
        elements.push(main);
        const suggestions = {
          "type": "chips",
          "options": [
              {
              "text": "Menu Principal",
              "image": {
                  "src": {
                  "rawUrl": referencesURI.imageURI_Public
                  }
              }
              }
          ]
        }
        elements.push(suggestions);
        response = {
          "richContent": [
              elements
          ]
        }
      }
      // Rellenar lista de intents
      else{
        const elements = []
        const info =  {
            "type": "info",
            "title": "Almacén de " + name,
            "subtitle": "Mostrando lista personal. Para realizar alguna operación escribe 'Menu Principal'",
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
            const main = {
              "type": "info",
              "title": "Cuestión: " + element.question,
              "subtitle": "Autor: " + element.user,
              "image": {
                  "src": {
                  "rawUrl": element.visual
                  }
              },
            }
            const detail1 = {
                "type": "accordion",
                "subtitle": "Detalles del visual",
                "text": element.visual
            }
            const detail2 = {
              "type": "accordion",
              "subtitle": "Detalles de la respuesta",
              "text": element.answer
            }
            elements.push(divider);
            elements.push(main);
            elements.push(detail1);
            elements.push(detail2);
        })
        const suggestions = {
            "type": "chips",
            "options": [
                {
                "text": "Menu Principal",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                }
            ]
        }
        elements.push(suggestions);
        response = {
            "richContent": [
                elements
            ]
        }
      }
      return response;
    },
    info_learning_detailslist_all: function(list){
      let response;
      // Avisar de que no hay existencias
      if(list.length===0){
        const elements = []
        const info =  {
          "type": "info",
          "title": "Base de Conocimiento de Odiseo",
          "subtitle": "Mostrando lista de todas las cuestiones disponibles. Para realizar alguna operación escribe 'Menu Principal'",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Public
              }
          },
        }
        elements.push(info);
        const main = {
          "type": "info",
          "title": "No hay cuestiones disponibles" ,
          "subtitle": "Mi base de conocimiento está vacía. No se ha guardado ninguna cuestión aún.",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Help
              }
          },
        }
        elements.push(main);
        const suggestions = {
          "type": "chips",
          "options": [
              {
              "text": "Menu Principal",
              "image": {
                  "src": {
                  "rawUrl": referencesURI.imageURI_Public
                  }
              }
              }
          ]
        }
        elements.push(suggestions);
        response = {
          "richContent": [
              elements
          ]
        }
      }
      // Rellenar lista de intents
      else{
        const elements = []
        const info =  {
            "type": "info",
            "title": "Base de Conocimiento de Odiseo",
            "subtitle": "Mostrando lista de todas las cuestiones disponibles. Para realizar alguna operación escribe 'Menu Principal'",
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
            const main = {
              "type": "info",
              "title": "Cuestión: " + element.question,
              "subtitle": "Autor: " + element.user,
              "image": {
                  "src": {
                  "rawUrl": element.visual
                  }
              },
            }
            const detail1 = {
                "type": "accordion",
                "subtitle": "Detalles del visual",
                "text": element.visual
            }
            const detail2 = {
              "type": "accordion",
              "subtitle": "Detalles de la respuesta",
              "text": element.answer
            }
            elements.push(divider);
            elements.push(main);
            elements.push(detail1);
            elements.push(detail2);
        })
        const suggestions = {
            "type": "chips",
            "options": [
                {
                "text": "Menu Principal",
                "image": {
                    "src": {
                    "rawUrl": referencesURI.imageURI_Public
                    }
                }
                }
            ]
        }
        elements.push(suggestions);
        response = {
            "richContent": [
                elements
            ]
        }
      }
      return response;
    },
    info_learning_simplelist: function(list, name, action){
      let response;
      // Avisar de que no hay existencias
      if(list.length===0){
        const elements = []
        const info =  {
          "type": "info",
          "title": action,
          "subtitle": "Aquí te dejo una lista de cuestiones disponibles de " + name + ", escribe la que deseas operar. Para realizar otra operación escribe 'Menu Principal'",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Teaching
              }
          },
        }
        elements.push(info);
        const main = {
          "type": "info",
          "title": "No hay cuestiones disponibles" ,
          "subtitle": "Mi base de conocimiento está vacía. No has guardado ninguna cuestión aún.",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Help
              }
          },
        }
        elements.push(main);
        const suggestions = {
          "type": "chips",
          "options": [
              {
              "text": "Menu Principal",
              "image": {
                  "src": {
                  "rawUrl": referencesURI.imageURI_Public
                  }
              }
              }
          ]
        }
        elements.push(suggestions);
        response = {
          "richContent": [
              elements
          ]
        }
      }
      // Rellenar lista de intents
      else{
        const elements = []
        const questsuggests = []
        const info =  {
          "type": "info",
          "title": action,
          "subtitle": "Aquí te dejo una lista de cuestiones disponibles de " + name + ", escribe la que deseas operar. Para realizar otra operación escribe 'Menu Principal'",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Teaching
              }
          },
        }
        elements.push(info);
        const cancel = {
          "text": "Menu Principal",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Public
              }
          }
        }
        questsuggests.push(cancel);
        list.forEach(element => { 
            const divider = {
            "type": "divider"
            }
            const main = {
              "type": "list",
              "title": element.question,
              "subtitle": element.answer,
            }
            const questsuggest = {
              "text": element.question,
              "image": {
                  "src": {
                  "rawUrl": element.visual
                  }
              }
            }
            elements.push(divider);
            elements.push(main);
            questsuggests.push(questsuggest);
        }) 
        const suggestions = {
            "type": "chips",
            "options": questsuggests
        }
        elements.push(suggestions);
        response = {
            "richContent": [
                elements
            ]
        }
      }
      return response;
    },
    info_learning_pendinglist: function(list, name, action){
      let response;
      // Avisar de que no hay existencias
      if(list.length===0){
        const elements = []
        const info =  {
          "type": "info",
          "title": action,
          "subtitle": "Aquí te dejo una lista de cuestiones dirigidas a " + name + ", escribe la que deseas confirmar permanentemente o denegar su acceso. Para realizar otra operación escribe 'Menu Principal'",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Teaching
              }
          },
        }
        elements.push(info);
        const main = {
          "type": "info",
          "title": "No hay cuestiones por confirmar" ,
          "subtitle": "Mi registro de cuestiones pendientes está vacío. No han solicitado tu aprobación aún.",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Help
              }
          },
        }
        elements.push(main);
        const suggestions = {
          "type": "chips",
          "options": [
              {
              "text": "Menu Principal",
              "image": {
                  "src": {
                  "rawUrl": referencesURI.imageURI_Public
                  }
              }
              }
          ]
        }
        elements.push(suggestions);
        response = {
          "richContent": [
              elements
          ]
        }
      }
      // Rellenar lista de intents
      else{
        const elements = []
        const questsuggests = []
        const info =  {
          "type": "info",
          "title": action,
          "subtitle": "Aquí te dejo una lista de cuestiones dirigidas a " + name + ", escribe la que deseas confirmar permanentemente o denegar su acceso. Para realizar otra operación escribe 'Menu Principal'",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Teaching
              }
          },
        }
        elements.push(info);
        const cancel = {
          "text": "Menu Principal",
          "image": {
              "src": {
              "rawUrl": referencesURI.imageURI_Public
              }
          }
        }
        questsuggests.push(cancel);
        list.forEach(element => { 
            const divider = {
            "type": "divider"
            }
            const main = {
              "type": "description",
              "title": element.question,
              "text": [
                "Propuesto por: " + element.user,
                "Respuesta asociada: " + element.answer
              ]
            }
            const questsuggest = {
              "text": element.question,
              "image": {
                  "src": {
                  "rawUrl": referencesURI.imageURI_Help
                  }
              }
            }
            elements.push(divider);
            elements.push(main);
            questsuggests.push(questsuggest);
        }) 
        const suggestions = {
            "type": "chips",
            "options": questsuggests
        }
        elements.push(suggestions);
        response = {
            "richContent": [
                elements
            ]
        }
      }
      return response;
    },
    info_learning_delete_completed: function(preview){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cuestión Eliminada",
              "subtitle": "La pregunta (" + preview + ") ha sido eliminada. Si deseas realizar otra operación, escribe 'Menu Principal'.",
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
                  "text": "Menu Principal",
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
    info_learning_update_completed: function(preview, input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Respuesta Actualizada",
              "subtitle": "¡Gracias por corregirme! La respuesta para (" + preview + ") se ha actualizado como (" + input + "). Si deseas realizar otra operación, escribe 'Menu Principal'.",
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
                  "text": "Menu Principal",
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
    info_learning_updateimage_completed: function(preview){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Imagen Actualizada",
              "subtitle": "¡Ha quedado muy bien! La imagen para (" + preview + ") ha sido actualizada. Si deseas realizar otra operación, escribe 'Menu Principal'.",
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
                  "text": "Menu Principal",
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
    info_learning_pending_confirmed: function(preview){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cuestión Confirmada",
              "subtitle": "La pregunta (" + preview + ") ha sido publicada en mi base conocimiento. Si deseas realizar otra operación, escribe 'Menu Principal'.",
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
                  "text": "Menu Principal",
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
    info_learning_pending_denied: function(preview){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cuestión Denegada",
              "subtitle": "La pregunta (" + preview + ") ha sido rechazada de las candidatas para publicar. Si deseas realizar otra operación, escribe 'Menu Principal'.",
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
                  "text": "Menu Principal",
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
    info_learning_assistant_notsupported_only:
    {
        "richContent": [
          [
            {
              "type": "info",
              "title": "📴 Asistente: No Disponible",
              "subtitle": "Esta función no está disponible desde la versión web de Odiseo Chatbot.",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Assistant
                }
              },
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "Menu Principal",
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
    info_learning_assistant_notsupported:
    {
        "richContent": [
          [
            {
              "type": "info",
              "title": "📴 Asistente: No Disponible (1/2)",
              "subtitle": "Esta función no está disponible desde la versión web de Odiseo Chatbot.",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Assistant
                }
              },
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "Siguiente",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Assistant
                    }
                  }
                }
              ]
            }
          ]
        ]
    },
    info_learning_assistant_notsupported_continue:
    {
        "richContent": [
          [
            {
              "type": "info",
              "title": "📴 Asistente: Información (2/2)",
              "subtitle": "Para realizar consultas y solicitar la publicación de cuestiones de forma interactiva, por favor, utiliza la versión de voz de Odiseo en Google Assistant. Si deseas realizar otra operación, escribe 'Menu Principal'.",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Assistant
                }
              },
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "Menu Principal",
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
    input_users_login_waitingemail: 
    {
      "richContent": [
          [
              {
                  "type": "info",
                  "title": "Iniciar Sesión: Email",
                  "subtitle": "De acuerdo. Para acceder a la aplicación, introduce tu 'correo electrónico'. Si quieres volver al inicio, escribe 'Cancelar'",
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
    input_users_login_waitingpassword: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Iniciar Sesión: Contraseña",
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
    input_users_register_waitingemail: 
    {
      "richContent": [
          [
              {
                  "type": "info",
                  "subtitle": "Recuerda que la privacidad de tus datos siempre será respetada y nunca serán compartidos.",
                  "image": {
                      "src": {
                          "rawUrl": referencesURI.imageURI_Help
                      }
                  },
              },
              {
                  "type": "info",
                  "title": "Registro: Email",
                  "subtitle": "De acuerdo. Para registrarse en la aplicación, necesito que introduzcas tu 'correo electrónico'. Si quieres volver al inicio, escribe 'Cancelar'",
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
                    "title": "Registro: Contraseña",
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
                  "title": "Registro: Datos Adicionales (1/2)",
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
                  "title": "Registro: Datos Adicionales (2/2)",
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
    input_learning_create_waitingquestion:  
    {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Nueva Cuestión",
              "subtitle": "Dime la cuestión que deseas guardar en mi aprendizaje. Si quieres detener el asistente, escribe 'Menu Principal'",
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
                  "text": "Menu Principal",
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
    input_learning_create_waitinganswer: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Añadir Respuesta",
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
      return response;
    },
    input_learning_update_waitinganswer: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Nueva Respuesta",
              "subtitle": "Introduce la nueva respuesta para la cuestión (" + input + ").",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Teaching
                }
              },
            }
          ]
        ]
      }
      return response;
    },
    input_learning_update_waitingimage: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Nueva URL Imagen",
              "subtitle": "Introduce el nuevo enlace visual para la cuestión (" + input + ").",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Teaching
                }
              },
            }
          ]
        ]
      }
      return response;
    },
    input_learning_pending_confirm: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "⚠️ Decisión permanente",
              "subtitle": "Si consideras que la respuesta de la cuestión es correcta, puedes CONFIRMARLA en mi base conocimiento y hacerla pública para el resto de los usuarios. De lo contrario, puedes DENEGARLA para eliminarla de forma permanente.",
              "image": {
                "src": {
                  "rawUrl": referencesURI.imageURI_Help
                }
              },
            },
            {
              "type": "info",
              "title": "¿Publicar Cuestión?",
              "subtitle": "¿Deseas confirmar la cuestión? (" + input + ")",
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
                  "text": "Confirmar Cuestión",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Teaching
                    }
                  }
                },
                {
                  "text": "Denegar Acceso",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Teaching
                    }
                  }
                },
                {
                  "text": "Menu Principal",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Teaching
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
    error_basic_unknown: {
        "richContent": [
          [
            {
              "type": "info",
              "title": "¿Disculpa?",
              "subtitle": "No puedo encontrar ninguna referencia. Escribe 'Menu Principal' para ver mi lista de comandos",
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
                  "text": "Menu Principal",
                  "image": {
                    "src": {
                      "rawUrl": referencesURI.imageURI_Public
                    }
                  }
                },
                {
                  "text": "Hasta Luego Odiseo",
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
    error_users_login_passwordnotexists: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "El email " + user +" no tiene una contraseña registrada.",
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
    error_users_register_emailexists: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "¡El usuario con email " + input +" ya está registrado!",
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
    error_users_register_passwordexists: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "¡La contraseña para el email " + user +" ya está registrada!",
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
    },
    error_users_register_nameexists: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "¡El nombre para el email " + user +" ya está registrado!",
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
    error_users_register_agenotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "La entrada " + input +" no es una edad con formato válido",
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
    error_users_register_ageexists: function(user){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Error",
                    "subtitle": "¡La edad para el email " + user +" ya está registrada!",
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
    error_learning_create_questionexists: function(input){
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
      return response;
    },
    error_learning_operations_questionnotexists: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cancelado",
              "subtitle": "¡Esta pregunta no la tienes registrada en tu base de conocimiento! (" + input + ") Si deseas realizar otra consulta, escribe 'Continuar'",
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
      return response;
    },
    error_learning_operations_pendingnotexists: function(input){
      const response = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Cancelado",
              "subtitle": "¡Esta pregunta no se encuentra pendiente de confirmar! (" + input + ") Si deseas realizar otra consulta, escribe 'Continuar'",
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
      return response;
    },
    error_learning_random_voidlist: {
      "richContent": [
        [
          {
            "type": "info",
            "title": "Sin Información",
            "subtitle": "Mi base de conocimiento está vacía. Escribe 'Menu Principal' para ver mi lista de comandos",
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
                "text": "Menu Principal",
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
    error_learning_operations_imagenotformat: function(input){
      const response = {
        "richContent": [
            [
                {
                    "type": "info",
                    "title": "Cancelado",
                    "subtitle": "La entrada " + input +" no es un enlace o url con formato válido",
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
                      "text": "Continuar",
                      "image": 
                      {
                        "src": 
                        {
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
    }
});
