const Enum = require('enum');

// Metodo para extraer la ID de un Intent, recibiendo una ruta del proyecto
exports.getIdIntentfromPath = function(projectAgentPath){
  var substring = projectAgentPath.split("projects/odiseo-chatbot/agent/intents/")
  return substring[1].toString();
};

// Metodo para extraer la ID de un Intent ya creado, recibiendo su nombre
exports.getIdIntentfromName = async function(displayName){

  var id = "";
  const projectId = 'odiseo-chatbot';
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();
  const projectAgentPath = intentsClient.projectAgentPath(projectId);
  const request = { parent: projectAgentPath, };

  // Send the request for listing intents.
  const [response] = await intentsClient.listIntents(request);
  response.forEach(intent => {
    if(displayName == intent.displayName){
      id = this.getIdIntentfromPath(intent.name);
    }
  });

  if(id !== ""){
    return id;
  }
};

// Metodo para comprobar si existe un intent creado con ese nombre
exports.checkIntentExistsfromName = async function(displayName){
  
    var list = [];
    const projectId = 'odiseo-chatbot';
    const dialogflow = require('@google-cloud/dialogflow');
  
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient();
    const projectAgentPath = intentsClient.projectAgentPath(projectId);
    const request = { parent: projectAgentPath, };

    // Send the request for listing intents.
    const [response] = await intentsClient.listIntents(request);
    response.forEach(intent => {
      if(displayName == intent.displayName){
          let intentId = this.getIdIntentfromPath(intent.name)
          list.push({ displayName: intent.displayName, id: intentId });
      }
    });

    if(list.length === 0){
      console.log(`The intent ${displayName} can be saved...`);
      return false;
    }
    else{
      console.log(`The intent ${list[0].displayName} with ID: ${list[0].id} already exists!`);
      return true;
    }
};

// Metodo para crear un intent con ese nombre
exports.createIntentfromName = async function(displayNameParam){
 
  const projectId = 'odiseo-chatbot';
  const displayName = displayNameParam;
  const trainingPhrasesParts = [displayNameParam];
  const messageTexts = [];

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates the Intent Client
  const intentsClient = new dialogflow.IntentsClient();

  async function createIntent() {
  
    // The path to identify the agent that owns the created intent.
    const agentPath = intentsClient.projectAgentPath(projectId);

    const trainingPhrases = [];

    trainingPhrasesParts.forEach(trainingPhrasesPart => {
      const part = {
        text: trainingPhrasesPart,
      };

      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: 'example',
        parts: [part],
      };

      trainingPhrases.push(trainingPhrase);
    });

    const messageText = {
      text: messageTexts,
    };

    const message = {
      text: messageText,
    };

    const intent = {
      displayName: displayName,
      trainingPhrases: trainingPhrases,
      messages: [message],
    };

    const createIntentRequest = {
      parent: agentPath,
      intent: intent,
    };

    // Create the intent
    const [response] = await intentsClient.createIntent(createIntentRequest);
    console.log(`Intent ${response.name} created`);

    // Id del intent que se acaba de crear
    return await exports.getIdIntentfromName(response.displayName)
    
  }

  return createIntent();

};

// Metodo para borrar un intent con ese nombre
exports.deleteIntentfromName = async function(displayName){

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');
  const projectId = 'odiseo-chatbot'; 
  const intentId = await exports.getIdIntentfromName(displayName)

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);

  const request = {name: intentPath};

  // Send the request for deleting the intent.
  const result = await intentsClient.deleteIntent(request);
  console.log(`Intent ${intentPath} deleted`);

  return result;
};

// Metodo para modificar un intent con cierta informacion
exports.updateIntentfromInfo = async function(additionals, displayName){

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');
  const projectId = 'odiseo-chatbot'; 
  const intentId = await exports.getIdIntentfromName(displayName);
  
  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);

  // Informacion Intent
  const intent = {
    "name": intentPath,
    "displayName": additionals[0].displayName,
    "webhookState": additionals[0].webhookState,
    "priority": additionals[0].priority,
    "isFallback": additionals[0].isFallback,
    "mlDisabled": additionals[0].mlDisabled,
    "liveAgentHandoff": additionals[0].liveAgentHandoff,
    "endInteraction": additionals[0].endInteraction,
    "inputContextNames": additionals[0].inputContextNames,
    "events": additionals[0].events,
    "trainingPhrases": additionals[0].trainingPhrases,
    "action": additionals[0].action,
    "outputContexts": additionals[0].outputContexts,
    "resetContexts": additionals[0].resetContexts,
    "parameters": additionals[0].parameters,
    "messages": additionals[0].messages,
    "defaultResponsePlatforms": additionals[0].defaultResponsePlatforms,
    "rootFollowupIntentName": additionals[0].rootFollowupIntentName,
    "parentFollowupIntentName": additionals[0].parentFollowupIntentName,
    "followupIntentInfo": additionals[0].followupIntentInfo,
  };

  const request = { intent };

  // Send the request for update the intent.
  const result = await intentsClient.updateIntent(request);
  console.log(`Intent ${intentPath} updated`);

  return result;
};

// Metodo para conseguir toda la estructura de un intent 
exports.getIntentStructure = async function(displayName){

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');
  const projectId = 'odiseo-chatbot'; 
  const intentId = await exports.getIdIntentfromName(displayName);
  
  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();
  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);
  const request = {
    name: intentPath
  };

  const intentStruct = await intentsClient.getIntent(request);
  return intentStruct;
};

// Metodo para modificar el valor de EndConversation de un Intent
exports.setEndConversationIntent = async function(displayName, boolean){

  // Recuperamos la estructura actual y cambiamos el valor
  var actualStruct = await exports.getIntentStructure (displayName);
  actualStruct[0].endInteraction = boolean;

  // Actualizamos en la API
  const result = await exports.updateIntentfromInfo(actualStruct, displayName);
  console.log(`Intent ${displayName} set 'end interaction' ${boolean}`);

  return result;
  
};