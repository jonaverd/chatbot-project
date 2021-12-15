
// Libreria necesaria para DialogFlow
const { WebhookClient } = require('dialogflow-fulfillment');
const prototypeUseful = require('./Utiles.js');

// Nombre de la pregunta para que no se pierda y asi luego sacarla por pantalla
exports.lastQuestion;

// Id de la pregunta para que no se pierda y asi luego añadir su respuesta
exports.idlastQuestion;

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.addQuestion = async function (req, res) {

  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });
 
  // Custom Intent PTE_RecibirCuestion
  async function receive_question(agent) {
    var questionUser = agent.parameters.any; 
    const check = await prototypeUseful.checkQuestion(questionUser);

    if(check==true){
      agent.add('¡La cuestión que deseas almacenar ya existe! (' + questionUser + ')');
      exports.lastQuestion = "";
      exports.idlastQuestion = "";
      
    }
    else{
      const id = await prototypeUseful.createQuestion(questionUser);   
      exports.idlastQuestion = id;
      agent.add('Por favor, dime la respuesta para (' + questionUser + ')');
      exports.lastQuestion = questionUser;
    }
  }

  // Custom Intent PTE_RecibirRespuesta
  async function receive_answer(agent) {
    var answerUser = agent.parameters.any;
    await prototypeUseful.setAnswer(answerUser, exports.idlastQuestion, exports.lastQuestion);
    agent.add('Gracias. Tu cuestión ha sido guardada (' +  exports.lastQuestion + ': ' + answerUser + ') ¡Hasta la próxima!');
    exports.lastQuestion = "";
    exports.idlastQuestion = "";
    
  }


  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('PTE_RecibirCuestion', receive_question);
  intentMap.set('PTE_RecibirRespuesta', receive_answer);

  agent.handleRequest(intentMap);
}
