
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
    agent.add("¿Quieres guardar una pregunta en mi base de datos?");
    agent.add(new Suggestion("Aceptar"));
    agent.add(new Suggestion("Rechazar"));
  }

  // Custom Intent PTE_EnseñanzaRechazar
  async function rejects_learning(agent) {
    agent.add("¿Quieres responder a una pregunta ya guardada?");
    agent.add(new Suggestion("Aceptar"));
    agent.add(new Suggestion("Rechazar"));
  }

  // Custom Intent PTE_EnseñanzaAceptar
  async function accept_learning(agent) {
    agent.add("Escríbame la cuestión que desea guardar:");
  }

  // Custom Intent PTE_EnseñanzaGuardar
  async function receive_question(agent) {

    // Comprobar si la cuestion esta ya guardada
    var questionUser = agent.parameters.any; 
    const check = await apiTools.checkIntentExists(questionUser);
    if(check==true){
      agent.add('¡La cuestión que deseas almacenar ya existe! (' + questionUser + ')');
    }
    
    // Guardar la cuestion
    else{
      const id = await apiTools.createIntent(questionUser);   
      database.insert(questionUser);
      agent.add('La cuestión (' + questionUser + ') ha sido almacenada.');
    }
  }

  // Custom Intent PTE_EnseñanzaSalir
  async function exit_learning(agent) {
    agent.add("Enseñanza finalizada. Que tenga un buen día!");
  }

  // Custom Intent PTE_EnseñanzaResponder
  async function response_learning(agent) {
    const list = await apiTools.getIntentList();
    list.forEach(question => { 
      agent.add(new Suggestion(question.displayName))
    }); 
  }

  // Custom Intent PTE_EnseñanzaActivarModificar
  async function receive_select_question(agent) {

    // Modificar la cuestion y guardar la respuesta 
    var selected = agent.parameters.any;
    exports.lastQuestion = selected;
    agent.add('Escriba una respuesta para la cuestión (' +  selected + ')');
  }

  // Custom Intent PTE_EnseñanzaModificar
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
      agent.add('Gracias. Tu cuestión ha sido guardada (' +  exports.lastQuestion + ': ' + answerUser + ') ¡Hasta la próxima!');
      exports.lastQuestion = "";
    }
    else{
      agent.add('No se ha podido encontrar la cuestión ha modificar.');
    }
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('PTE_ActivarEnseñanza', active_learning);
  intentMap.set('PTE_EnseñanzaRechazar', rejects_learning);
  intentMap.set('PTE_EnseñanzaAceptar', accept_learning);
  intentMap.set('PTE_EnseñanzaGuardar', receive_question);
  intentMap.set('PTE_EnseñanzaResponder', response_learning);
  intentMap.set('PTE_EnseñanzaSalir', exit_learning);
  intentMap.set('PTE_EnseñanzaActivarModificar', receive_select_question);
  intentMap.set('PTE_EnseñanzaModificar', receive_answer);
  agent.handleRequest(intentMap);
}
