// Agent parameters
const dialogflow = require('@google-cloud/dialogflow');
const projectId = 'odiseo-chatbot';

// Instantiate clients
const intentsClient = new dialogflow.IntentsClient();
const projectAgentPath = intentsClient.projectAgentPath(projectId);

const referencesURI = require('./Assets/references.js');

// Metodo para comprobar si un elemento contiene algun valor nulo o indefinido
exports.checkNotUndefined = function(element){
  function arrayIsEmpty(array) {
    //If it's not an array, return FALSE.
    if (!Array.isArray(array)) {
        return false;
    }
    //If it is an array, check its length property
    if (array.length == 0) {
        //Return TRUE if the array is empty
        return true;
    }
    //Otherwise, return FALSE.
    return false;
  }
  if(element === null){ return false; }
  else if(element === undefined){ return false; }
  else if(arrayIsEmpty(element)){ return false; }
  else if (element === ""){ return false; }
  else{ return true; };
};

// Metodo para extraer la ID de un Intent, recibiendo una ruta del proyecto
exports.getIDIntent_Path = function(projectAgentPath){
  var substring = projectAgentPath.split("projects/odiseo-chatbot/agent/intents/")
  return substring[1].toString();
};

// Metodo para extraer la ID de un Intent, recibiendo un nombre
exports.getIDIntent_Name = async function(displayName){
  var id = "";

  // Arguments information
  const request = { 
    parent: projectAgentPath,
    intentView: "INTENT_VIEW_FULL", 
  };

  // Send the request for listing intents.
  const [response] = await intentsClient.listIntents(request);
  response.forEach(intent => {
    if(displayName == intent.displayName){
      id = this.getIDIntent_Path(intent.name);
    }
  });
  
  if(id !== ""){ return id; }
};

// Metodo para comprobar si existe un intent creado con ese nombre
exports.checkIntentExists = async function(displayName){
  var list = [];

  // Arguments information
  const request = { 
    parent: projectAgentPath,
    intentView: "INTENT_VIEW_FULL", 
  };

  // Send the request for listing intents.
  const [response] = await intentsClient.listIntents(request);
  response.forEach(intent => {
    if(displayName == intent.displayName){
        let intentId = this.getIDIntent_Path(intent.name)
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
exports.createIntent = async function(displayNameParam, user){

  // Arguments information
  const displayName = displayNameParam;
  const trainingPhrasesParts = [displayNameParam];
  const quickRepliesParts = ['Menu Principal'];
  const suggestions = ['Menu Principal'];
  const messageTexts = 'null';
  const image = referencesURI.imageURI_Public;

  // frase de entrenamiento por defecto
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

  // respuesta por defecto
  const element = {
    title: displayNameParam,
    subtitle: user,
    formattedText: messageTexts,
      image: {
        imageUri: image,
        accessibilityText: "Odiseo Chatbot"
      }
  };
  const message = {
    platform: "PLATFORM_UNSPECIFIED",
    basicCard: element,
  };

  // respuesta google actions
  const actions_card = {
    platform: "ACTIONS_ON_GOOGLE",
    basicCard: {
      title: displayNameParam,
      subtitle: user,
      formattedText: messageTexts,
      image: {
        imageUri: image,
        accessibilityText: "Odiseo Chatbot"
      }
    }
  }

  // sugerencias google actions por defecto
  const suggestions_first = [];
  suggestions.forEach(suggestion => {
    const sug = {
      title: suggestion
    }
    suggestions_first.push(sug);
  });

  const suggestions_final = {
    suggestions: suggestions_first
  }

  const actions_suggestions = {
    platform: "ACTIONS_ON_GOOGLE",
    suggestions: suggestions_final
  }

  // Here we create a new suggestion phrase for each provided part.
  const quickReplies_begin = [];
  quickRepliesParts.forEach(quickRepliesPart => {
    const quickReply = quickRepliesPart;
    quickReplies_begin.push(quickReply);
  });

  const quickReplies_middle = {
    quickReplies: quickReplies_begin,
  }
  const quickReplies_final = {
    quickReplies: quickReplies_middle
  };

  // creamos el intent con sus partes
  const intent = { 
    displayName: displayName,
    webhookState: "WEBHOOK_STATE_ENABLED",
    trainingPhrases: trainingPhrases,
    action: "input.user.query",
    messages: [actions_card, actions_suggestions, message, quickReplies_final], 
    defaultResponsePlatforms: ['PLATFORM_UNSPECIFIED', 'ACTIONS_ON_GOOGLE'],
  };
  const createIntentRequest = {
    parent: projectAgentPath,
    intent: intent,
    intentView: "INTENT_VIEW_FULL", 
  };

  // Create the intent
  const [response] = await intentsClient.createIntent(createIntentRequest);
  console.log(`Intent ${response.name} created`);

  // Id del intent que se acaba de crear
  return await exports.getIDIntent_Name(response.displayName)  
};

// Metodo para conseguir toda la estructura de un intent 
exports.getIntent = async function(intentId){

  // Arguments information
  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);
  const request = {
    name: intentPath,
    intentView: "INTENT_VIEW_FULL",
  };
  console.log(`Getting ${intentId} structure...`);
  return await intentsClient.getIntent(request);
};

// Metodo para mostrar la lista de intents
exports.getIntentList = async function(){

  // Send the request for listing intents.
  const request = { 
    parent: projectAgentPath,
    intentView: "INTENT_VIEW_FULL",
  };
  
  // Intent_View_Full able to show training phrases, by default NOT is activated!!
  const [response] = await intentsClient.listIntents(request);
  console.log(`Getting intents list...`);
  return response;
};

// Metodo para modificar un intent
exports.updateIntent = async function(intentId, additionals){

  // Arguments information
  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);

  // Informacion Intent
  const intent = {
    "name": intentPath,
    "displayName": additionals.displayName,
    "webhookState": additionals.webhookState,
    "priority": additionals.priority,
    "isFallback": additionals.isFallback,
    "mlDisabled": additionals.mlDisabled,
    "liveAgentHandoff": additionals.liveAgentHandoff,
    "endInteraction": additionals.endInteraction,
    "inputContextNames": additionals.inputContextNames,
    "events": additionals.events,
    "trainingPhrases": additionals.trainingPhrases,
    "action": additionals.action,
    "outputContexts": additionals.outputContexts,
    "resetContexts": additionals.resetContexts,
    "parameters": additionals.parameters,
    "messages": additionals.messages,
    "defaultResponsePlatforms": additionals.defaultResponsePlatforms,
    "rootFollowupIntentName": additionals.rootFollowupIntentName,
    "parentFollowupIntentName": additionals.parentFollowupIntentName,
    "followupIntentInfo": additionals.followupIntentInfo,
  };

  const request = { 
    intent,
    intentView: "INTENT_VIEW_FULL", 
  };

  // Send the request for update the intent.
  const result = await intentsClient.updateIntent(request);
  console.log(`Intent ${intentPath} updated`);
  return result;
};

// Metodo para borrar un intent
exports.deleteIntent = async function(intentId){

  // Arguments information
  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);
  const request = {name: intentPath};

  // Send the request for deleting the intent.
  const result = await intentsClient.deleteIntent(request);
  console.log(`Intent ${intentPath} deleted`);
  return result;
};
