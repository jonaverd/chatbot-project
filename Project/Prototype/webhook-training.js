
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

// Libreria para Cloud Firebase
const firebase = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const firebaseAdmin = require("firebase-admin");

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'https://odiseo-chatbot-default-rtdb.europe-west1.firebasedatabase.app/'
});

// Libreria necesaria para API Cloud
const apiTools = require('./webhook-api-tools.js');

// Nombre de la pregunta para que no se pierda y asi luego sacarla por pantalla
exports.lastQuestion;

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
// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.addLearning = async function (req, res) {

  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });

  // Custom Intent PTE_RecibirCuestion
  async function receive_question(agent) {

    // Comprobar si la cuestion esta ya guardada
    var questionUser = agent.parameters.any; 
    const check = await apiTools.checkIntentExists(questionUser);

    if(check==true){
      agent.add('¡La cuestión que deseas almacenar ya existe! (' + questionUser + ')');
      exports.lastQuestion = "";
    }
    
    // Guardar la cuestion
    else{
      const id = await apiTools.createIntent(questionUser);   
      agent.add(new Suggestion("Quick Reply"));
      //agent.add('La cuestión (' + questionUser + ') ha sido almacenada.');
      exports.lastQuestion = questionUser;
    }
  }

  // Custom Intent PTE_RecibirRespuesta
  async function receive_answer(agent) {

    // Modificar la cuestion y guardar la respuesta 
    if(exports.lastQuestion != ""){
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
      await apiTools.updateIntent(id, struct);
      agent.add('Gracias. Tu cuestión ha sido guardada (' +  exports.lastQuestion + ': ' + answerUser + ') ¡Hasta la próxima!');
      exports.lastQuestion = "";
    }
    
    else{
      agent.add('Nada por aqui');
    }
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  let intentMap = new Map();
  intentMap.set('PTE_EnseñanzaGuardar', receive_question);
  intentMap.set('PTE_RecibirRespuesta', receive_answer);

  agent.handleRequest(intentMap);
}
