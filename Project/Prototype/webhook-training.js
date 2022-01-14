
// Libreria necesaria para DialogFlow
const { WebhookClient } = require('dialogflow-fulfillment');
const apiTools = require('./webhook-api-tools.js');

// Nombre de la pregunta para que no se pierda y asi luego sacarla por pantalla
exports.lastQuestion;

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.addQuestion = async function (req, res) {

  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });

  // Custom Intent PTE_RecibirCuestion
  async function receive_question(agent) {

    //Restablecer el endConversation
    //await apiTools.setEndConversationIntent("PTE_RecibirCuestion", false);

    // Comprobar si la cuestion esta ya guardada
    var questionUser = agent.parameters.any; 
    const check = await apiTools.checkIntentExistsfromName(questionUser);

    if(check==true){
      //await apiTools.setEndConversationIntent("PTE_RecibirCuestion", true);
      agent.add('¡La cuestión que deseas almacenar ya existe! (' + questionUser + ')');
      exports.lastQuestion = "";
    }
    
    // Guardar la cuestion
    else{
      const id = await apiTools.createIntentfromName(questionUser);   
      agent.add('Por favor, dime la respuesta para (' + questionUser + ')');
      exports.lastQuestion = questionUser;
    }
  }

  // Custom Intent PTE_RecibirRespuesta
  async function receive_answer(agent) {

    // Modificar la cuestion y guardar la respuesta 
    if(exports.lastQuestion != ""){
      var answerUser = agent.parameters.any;
      const struct = await apiTools.getIntentStructure(exports.lastQuestion);
      struct[0].messages = [
        {
          "text": {
            "text": [
              answerUser
            ]
          }
        }
      ]
      await apiTools.updateIntentfromInfo(struct, exports.lastQuestion);
      agent.add('Gracias. Tu cuestión ha sido guardada (' +  exports.lastQuestion + ': ' + answerUser + ') ¡Hasta la próxima!');
      exports.lastQuestion = "";
    }
    
    else{
      agent.add('Nada por aqui');
    }
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('PTE_RecibirCuestion', receive_question);
  intentMap.set('PTE_RecibirRespuesta', receive_answer);

  agent.handleRequest(intentMap);
}
