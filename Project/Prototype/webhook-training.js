
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el iare"
const backendTools = require('./middleware-backend.js');

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.addLearning = async function (req, res) {
  
  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });

  // Custom Intent PTE_ActivarEnseñanza
  async function active_learning(agent) {
    agent.add("¡Tengo muchas ganas de aprender!");
    agent.add(new Suggestion("Quiero guardar una pregunta"));
    agent.add(new Suggestion("Quiero cambiar una respuesta"));
    agent.add(new Suggestion("Quiero borrar una pregunta"));
  }

   // Custom Intent PTE_ActivarGuardarPregunta
  async function active_receive_question(agent) {
    agent.add('Escríbeme lo que debo preguntar:');
    agent.add(new Suggestion("No quiero guardar nada"))
  }

  // Custom Intent PTE_GuardarPregunta
  async function receive_question(agent) {

    // Comprobar si la cuestion esta ya guardada
    var questionUser = agent.parameters.any; 
    if(questionUser != "No quiero guardar nada"){
      if(await backendTools.existsBackend_Question(questionUser)){
        backendTools.updateWaitingInput_Question("exit");
        agent.add('¡Esta pregunta ya la tenía guardada! (' + questionUser + ')');
        agent.add(new Suggestion("Continuar"));
      }
      
      // Guardar la cuestion
      else{
        backendTools.updateWaitingInput_Question("required", questionUser);
        await backendTools.createBackend_Question(questionUser);
        agent.add('¡Acabo de añadir esta cuestión [' + questionUser + '] a mi aprendizaje!');
        agent.add("Escríbeme lo que debo responder:");
      }
    }

    else {
      backendTools.updateWaitingInput_Question("exit");
      agent.add('He cancelado la operación');
      agent.add(new Suggestion("Continuar"));
    }
  }

  // Custom Intent PTE_GuardarRespuesta
  async function receive_answer(agent) {

    // ¿Hay alguna pregunta pendiente?
    if(backendTools.updateWaitingInput_Question("progress")){

      // Modificar la cuestion y guardar la respuesta 
      var answerUser = agent.parameters.any;
      await backendTools.updateBackend_Answer(answerUser);
      agent.add('Gracias por enseñarme [' +  backendTools.lastQuestion + '], la respuesta es: [' + answerUser + '] ¡Ahora me siento más inteligente!');
      agent.add(new Suggestion("Quiero hacer más cosas"));
      backendTools.updateWaitingInput_Question("exit");
    }

    else{
      agent.add('¿Deseas enseñarme más lecciones?');
      agent.add(new Suggestion("Quiero guardar otra pregunta"));
      agent.add(new Suggestion("Quiero cambiar una respuesta"));
      agent.add(new Suggestion("Quiero borrar una pregunta"));
    }
  }

  // Custom Intent PTE_ActivarCambiarRespuesta
  async function show_list_questions_update(agent){
    const list = await backendTools.listBackend_Question();
    agent.add('Aquí te muestro una lista de tus preguntas guardadas. ¿Qué lección quieres responder/cambiar su respuesta?');
    list.forEach(element => { 
      agent.add(new Suggestion(element.question))
    }); 
    agent.add(new Suggestion("No quiero modificar ninguna"))
  }

  // Custom Intent PTE_SeleccionarPregunta
  async function select_question(agent) {

    // Comprobar si la cuestion existe
    var questionUser = agent.parameters.any; 
    if(await backendTools.existsBackend_Question(questionUser) == false){

      if(questionUser == "No quiero modificar ninguna"){
        backendTools.updateWaitingInput_Question("exit");
        agent.add('He cancelado la operación');
        agent.add(new Suggestion("Continuar"));
      }
      else{
        backendTools.updateWaitingInput_Question("exit");
        agent.add('¡Esta pregunta no existe! (' + questionUser + ')');
        agent.add(new Suggestion("Continuar"));
      }
    }
    
    // Seleccionar la cuestion
    else{
      backendTools.updateWaitingInput_Question("required", questionUser);
      agent.add("Escriba la nueva respuesta:");
    }
  }

  // Custom Intent PTE_CambiarRespuesta
  async function modify_answer(agent) {

    // ¿Hay alguna pregunta pendiente?
    if(backendTools.updateWaitingInput_Question("progress")){

      // Modificar la respuesta y guardar 
      var answerUser = agent.parameters.any;
      await backendTools.updateBackend_Answer(answerUser);
      agent.add('Gracias por corregirme la respuesta para [' + backendTools.lastQuestion + '] ahora es: [' + answerUser + '] ¡Es un placer trabajar contigo!');
      agent.add(new Suggestion("Quiero hacer más cosas"));
      backendTools.updateWaitingInput_Question("exit");
    }

    else{
      agent.add('¿Deseas enseñarme más lecciones?');
      agent.add(new Suggestion("Quiero guardar otra pregunta"));
      agent.add(new Suggestion("Quiero cambiar una respuesta"));
      agent.add(new Suggestion("Quiero borrar una pregunta"));
    }
  }

  // Custom Intent PTE_ActivarBorrarPregunta
  async function show_list_questions_delete(agent){
    const list = await backendTools.listBackend_Question();
    agent.add('Aquí te muestro una lista de tus preguntas guardadas. ¿Qué lección quieres eliminar?');
    agent.add('¡Cuidado, no hay vuelta atrás!');
    list.forEach(element => { 
      agent.add(new Suggestion(element.question))
    }); 
    agent.add(new Suggestion("No quiero borrar ninguna"))
  }

  // Custom Intent PTE_SeleccionarPreguntaDL
  async function select_question_delete(agent) {

    // Comprobar si la cuestion existe
    var questionUser = agent.parameters.any; 
    if(await backendTools.existsBackend_Question(questionUser) == false){

      if(questionUser == "No quiero borrar ninguna"){
        backendTools.updateWaitingInput_Question("exit");
        agent.add('¿Deseas enseñarme más lecciones?');
        agent.add(new Suggestion("Quiero guardar otra pregunta"));
        agent.add(new Suggestion("Quiero cambiar una respuesta"));
        agent.add(new Suggestion("Quiero borrar una pregunta"));
      }
      else{
        backendTools.updateWaitingInput_Question("exit");
        agent.add('¡Esta pregunta no existe! (' + questionUser + ')');
        agent.add(new Suggestion("Quiero hacer más cosas"));
      }
    }
    
    // Seleccionar la cuestion
    else{
      backendTools.updateWaitingInput_Question("required", questionUser);
      await backendTools.deleteBackend_Question(questionUser);
      agent.add('Has eliminado la cuestión [' + backendTools.lastQuestion + '] ¡La sabía pero se me acaba de olvidar!');
      agent.add(new Suggestion("Quiero hacer más cosas"));
      backendTools.updateWaitingInput_Question("exit");
    }
  }

  
  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('PTE_ActivarEnseñanza', active_learning);
  intentMap.set('PTE_ActivarGuardarPregunta', active_receive_question);
  intentMap.set('PTE_GuardarPregunta', receive_question);
  intentMap.set('PTE_GuardarRespuesta', receive_answer);
  intentMap.set('PTE_ActivarCambiarRespuesta', show_list_questions_update);
  intentMap.set('PTE_SeleccionarPregunta', select_question);
  intentMap.set('PTE_CambiarRespuesta', modify_answer);
  intentMap.set('PTE_ActivarBorrarPregunta', show_list_questions_delete);
  intentMap.set('PTE_SeleccionarPreguntaDL', select_question_delete);
  agent.handleRequest(intentMap);
}
