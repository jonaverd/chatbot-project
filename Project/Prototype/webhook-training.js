
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

// Libreria para Cloud Firebase
//const firebase = require('firebase-functions');
//const firebaseAdmin = require("firebase-admin");
/*firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'https://odiseo-chatbot-default-rtdb.europe-west1.firebasedatabase.app/'
});*/
/*exports.dialogflowFirebaseFulfillment = firebase.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function getFromFirebase(agent){
    return firebaseAdmin.database().ref('text').once("value").then((snapshot) =>{
      var text = snapshot.val();
      agent.add(`Hey! The text saved is: ${text}`);
    });
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('INT_FIREBASE', getFromFirebase);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
*/

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// Libreria necesaria para API Cloud
const apiTools = require('./webhook-api-tools.js');

// Libreria necesaria para Database MongoDB
const database = require('./Database/insert-data-learning.js');

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
    const check = await apiTools.checkIntentExists(questionUser);
    if(check==true){
      exports.lastQuestion = ""; 
      agent.add('¡Esta pregunta ya la tenía guardada! (' + questionUser + ')');
      agent.add(new Suggestion("Continuar"));
    }
    
    // Guardar la cuestion
    else{
      exports.lastQuestion = questionUser; 
      const id = await apiTools.createIntent(questionUser);  
      //database.insert(questionUser);
      agent.add('¡Acabo de añadir esta cuestión [' + questionUser + '] a mi aprendizaje!');
      agent.add("Escríbeme lo que debo responder:");
    }
  }

  // Custom Intent PTE_GuardarRespuesta
  async function receive_answer(agent) {

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
      await apiTools.updateIntent(id, struct[0]);
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
    const list = await apiTools.getIntentList();
    agent.add('Aquí te muestro una lista de tus preguntas guardadas. ¿Qué lección quieres responder/cambiar su respuesta?');
    list.forEach(question => { 
      agent.add(new Suggestion(question.displayName))
    }); 
  }

  // Custom Intent PTE_SeleccionarPregunta
  async function select_question(agent) {

    // Comprobar si la cuestion existe
    var questionUser = agent.parameters.any; 
    const check = await apiTools.checkIntentExists(questionUser);
    if(check==false){
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
      await apiTools.updateIntent(id, struct[0]);
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
