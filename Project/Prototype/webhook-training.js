
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// Libreria necesaria para API Cloud
const apiTools = require('./webhook-api-tools.js');

// Libreria necesaria para operar Database MongoDB
const databaseTools = require('./Database/Operations/operations.js');

// Nombre de la cuestión a guardar
exports.lastQuestion;

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.addLearning = async function (req, res) {
  
  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });

  // Custom Intent PTE_ActivarEnseñanza
  async function active_learning(agent) {
    agent.add("¡Tengo muchas ganas de aprender!");
    agent.add(new Suggestion("Quiero guardar una pregunta"));
    agent.add(new Suggestion("Quiero cambiar una respuesta "));
  }

   // Custom Intent PTE_ActivarGuardarPregunta
  async function active_receive_question(agent) {
    agent.add('Escríbeme lo que debo preguntar:');
  }

  // Custom Intent PTE_GuardarPregunta
  async function receive_question(agent) {

    // Comprobar si la cuestion esta ya guardada
    var questionUser = agent.parameters.any; 
    // ... en los intents
    const check1 = await apiTools.checkIntentExists(questionUser);
    // ... en la base de datos
    const check2 = await databaseTools.checkQuestionExists(questionUser);
    if(check1==true || check2==true){
      exports.lastQuestion = ""; 
      agent.add('¡Esta pregunta ya la tenía guardada! (' + questionUser + ')');
      agent.add(new Suggestion("Continuar"));
    }
    
    // Guardar la cuestion
    else{
      exports.lastQuestion = questionUser; 
      // ... en los intents
      const id = await apiTools.createIntent(questionUser);
      // ... en la base de datos  
      await databaseTools.createVoidQuestion(questionUser);
      agent.add('¡Acabo de añadir esta cuestión [' + questionUser + '] a mi aprendizaje!');
      agent.add("Escríbeme lo que debo responder:");
    }
  }

  // Custom Intent PTE_GuardarRespuesta
  async function receive_answer(agent) {

    // ¿Hay alguna pregunta pendiente?
    if(exports.lastQuestion != ""){

      // Modificar la cuestion y guardar la respuesta 
      var answerUser = agent.parameters.any;
      const id = await apiTools.getIDIntent_Name(exports.lastQuestion);
      const struct = await apiTools.getIntent(id);
      struct[0].messages = [
        {
          "text": {
            "text": [
              answerUser
            ]
          }
        }
      ]
      // ... en los intents
      await apiTools.updateIntent(id, struct[0]);
      // ... en la base de datos  
      await databaseTools.updateAnswer(exports.lastQuestion, answerUser);
      agent.add('Gracias por enseñarme [' +  exports.lastQuestion + '], la respuesta es: [' + answerUser + '] ¡Ahora me siento más inteligente!');
      exports.lastQuestion = "";
    }

    else{
      agent.add('¿Deseas enseñarme más lecciones?');
      agent.add(new Suggestion("Quiero guardar otra pregunta"));
      agent.add(new Suggestion("Quiero cambiar una respuesta"));
    }
  }

  // Custom Intent PTE_ActivarCambiarRespuesta
  async function show_list_questions(agent){
    // ... solo la base de datos  
    const list =  await databaseTools.getQuestionsList();
    console.log(list);
    agent.add('Aquí te muestro una lista de tus preguntas guardadas. ¿Qué lección quieres responder/cambiar su respuesta?');
    list.forEach(question => { 
      agent.add(new Suggestion(question.question))
    }); 
  }

  // Custom Intent PTE_SeleccionarPregunta
  async function select_question(agent) {

    // Comprobar si la cuestion existe
    var questionUser = agent.parameters.any; 
    // ... en los intents
    const check1 = await apiTools.checkIntentExists(questionUser);
    // ... en la base de datos
    const check2 = await databaseTools.checkQuestionExists(questionUser);
    if(check1==false || check2==false){
      exports.lastQuestion = ""; 
      agent.add('¡Esta pregunta no existe! (' + questionUser + ')');
      agent.add(new Suggestion("Continuar"));
    }
    
    // Seleccionar la cuestion
    else{
      exports.lastQuestion = questionUser; 
      agent.add("Escriba la nueva respuesta:");
    }
  }

  // Custom Intent PTE_CambiarRespuesta
  async function modify_answer(agent) {

    // ¿Hay alguna pregunta pendiente?
    if(exports.lastQuestion != ""){

      // Modificar la respuesta y guardar 
      var answerUser = agent.parameters.any;
      const id = await apiTools.getIDIntent_Name(exports.lastQuestion);
      const struct = await apiTools.getIntent(id);
      struct[0].messages = [
        {
          "text": {
            "text": [
              answerUser
            ]
          }
        }
      ]

      // ... en los intents
      await apiTools.updateIntent(id, struct[0]);
      // ... en la base de datos
      await databaseTools.updateAnswer(exports.lastQuestion, answerUser);
      agent.add('Gracias por corregirme la respuesta para [' + exports.lastQuestion + '] ahora es: [' + answerUser + '] ¡Es un placer trabajar contigo!');
      exports.lastQuestion = "";
    }

    else{
      agent.add('¿Deseas enseñarme más lecciones?');
      agent.add(new Suggestion("Quiero guardar otra pregunta"));
      agent.add(new Suggestion("Quiero cambiar una respuesta"));
    }
  }

  
  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('PTE_ActivarEnseñanza', active_learning);
  intentMap.set('PTE_ActivarGuardarPregunta', active_receive_question);
  intentMap.set('PTE_GuardarPregunta', receive_question);
  intentMap.set('PTE_GuardarRespuesta', receive_answer);
  intentMap.set('PTE_ActivarCambiarRespuesta', show_list_questions);
  intentMap.set('PTE_SeleccionarPregunta', select_question);
  intentMap.set('PTE_CambiarRespuesta', modify_answer);
  agent.handleRequest(intentMap);
}
