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
exports.updateIntentfromInfo = async function(additionals, intentId){

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');
  const projectId = 'odiseo-chatbot'; 
 
  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();
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

  const request = { intent };

  // Send the request for update the intent.
  const result = await intentsClient.updateIntent(request);
  console.log(`Intent ${intentPath} updated`);

  return result;
};

// Metodo para conseguir toda la estructura de un intent 
exports.getIntentStructure = async function(intentId){

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');
  const projectId = 'odiseo-chatbot'; 
  
  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();
  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);
  const request = {
    name: intentPath,
    intentView: "INTENT_VIEW_FULL",
  };

  return await intentsClient.getIntent(request);
};


// Metodo para comprobar si un elemento contiene algun valor nulo o indefinido
exports.checkNotUndefined = function(element){

  // Metodo para comporbar si un array esta vacio
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

  if(element === null){
    return false;
  }
  else if(element === undefined){
    return false;
  }
  else if(arrayIsEmpty(element)){
    return false;
  }
  else if (element === ""){
    return false;
  }
  else{
    return true;
  };
};

// Metodo para mostrar la lista de todos los intents
exports.getIntentList = async function(){

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');
  const projectId = 'odiseo-chatbot';
  
  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  // The path to identify the agent that owns the intents.
  const projectAgentPath = intentsClient.projectAgentPath(projectId);
  console.log(projectAgentPath);

  // Send the request for listing intents.
  const request = { 
    parent: projectAgentPath,
    intentView: "INTENT_VIEW_FULL",
  };
  
  // Intent_View_Full able to show training phrases, by default nos is activated!!
  const [response] = await intentsClient.listIntents(request);

  // Print the results
  response.forEach(intent => {

    const name = intent.name;
    const displayName = intent.displayName;
    const webhookState = intent.webhookState;
    const priority = intent.priority;
    const isFallback = intent.isFallback;
    const mlDisabled = intent.mlDisabled;
    const liveAgentHandoff = intent.liveAgentHandoff;
    const endInteraction = intent.endInteraction;
    const inputContextNames = intent.inputContextNames;
    const events = intent.events;
    const trainingPhrases = intent.trainingPhrases;
    const actions = intent.actions;
    const outputContexts = intent.outputContexts;
    const resetContexts = intent.resetContexts;
    const parameters = intent.parameters;
    const messages = intent.messages;
    const defaultResponsePlatforms = intent.defaultResponsePlatforms;
    const rootFollowupIntentName = intent.rootFollowupIntentName;
    const parentFollowupIntentName = intent.parentFollowupIntentName;
    const followupIntentInfo = intent.followupIntentInfo;

    console.log('=======================================================================================');
    if(this.checkNotUndefined(name)){  
      console.log(`Intent name: ${name}`); 
    };
    if(this.checkNotUndefined(displayName)){ 
      console.log(`Intent display name: ${displayName}`); 
    };
    if(this.checkNotUndefined(webhookState)){ 
      console.log(`WebhookState: ${webhookState}`);
    };
    if(this.checkNotUndefined(priority)){ 
      console.log(`Priority: ${priority}`);
    };
    if(this.checkNotUndefined(isFallback)){ 
      console.log(`IsFallback: ${isFallback}`);
    };
    if(this.checkNotUndefined(mlDisabled)){ 
      console.log(`MLDisabled: ${mlDisabled}`);
    };
    if(this.checkNotUndefined(liveAgentHandoff)){ 
      console.log(`LiveAgentHandoff: ${liveAgentHandoff}`);
    };
    if(this.checkNotUndefined(endInteraction)){ 
      console.log(`EndInteraction: ${endInteraction}`);
    };
    if(this.checkNotUndefined(inputContextNames)){ 
      console.log('Input contexts:');
      inputContextNames.forEach(inputContextName => {
        if(this.checkNotUndefined(inputContextName)){ 
          console.log(`\tName: ${inputContextName}`);
        };
      });
    };
    if(this.checkNotUndefined(events)){ 
      console.log(`Events:`);
      events.forEach(event => {
        if(this.checkNotUndefined(event)){ 
          console.log(`\tName: ${event}`);
        };
      });
    };
    if(this.checkNotUndefined(trainingPhrases)){ 
      console.log('Training phrases:');
      trainingPhrases.forEach(trainingPhrase => {
        if(this.checkNotUndefined(trainingPhrase.name)){ 
          console.log(`\tName: ${trainingPhrase.name}`);
        };
        if(this.checkNotUndefined(trainingPhrase.type)){ 
          console.log(`\tType: ${trainingPhrase.type}`);
        };
        if(this.checkNotUndefined(trainingPhrase.parts)){ 
        console.log('\tParts:');
          trainingPhrase.parts.forEach(part => {
            if(this.checkNotUndefined(part.text)){ 
              console.log(`\t\tText: ${part.text}`);
            };
            if(this.checkNotUndefined(part.entityType)){ 
              console.log(`\t\tEntityType: ${part.entityType}`);
            };
            if(this.checkNotUndefined(part.alias)){ 
              console.log(`\t\tAlias: ${part.alias}`);
            };
            if(this.checkNotUndefined(part.userDefined)){ 
              console.log(`\t\tUserDefined: ${part.userDefined}`);
            };
          });
        };
        if(this.checkNotUndefined(trainingPhrase.timesAddedCount)){ 
          console.log(`\tTimesAddedCount: ${trainingPhrase.timesAddedCount}`);
        };
      });
    };
    if(this.checkNotUndefined(actions)){
      console.log(`Action: ${actions}`);
    };
    if(this.checkNotUndefined(outputContexts)){
      console.log('Output contexts:');
      outputContexts.forEach(outputContext => {
        if(this.checkNotUndefined(outputContext.name)){
          console.log(`\tName: ${outputContext.name}`);
        };
        if(this.checkNotUndefined(outputContext.lifespanCount)){
          console.log(`\tLifespanCount: ${outputContext.lifespanCount}`);
        };
        /*if(this.checkNotUndefined(outputContext.parameters)){
          console.log('Parameters:');
          outputContext.parameters.forEach(parameter=> {
            if(this.checkNotUndefined(parameter.key)){
              console.log(`\t\tKey: ${parameter.key}`);
            }
            if(this.checkNotUndefined(parameter.value)){
              console.log(`\t\tValue: ${parameter.value}`);
            }
          });
        };*/
      });
    };
    if(this.checkNotUndefined(resetContexts)){
      console.log(`ResetContexts: ${resetContexts}`);
    };
    if(this.checkNotUndefined(parameters)){
      console.log('Parameters:');
      parameters.forEach(parameter => {
        if(this.checkNotUndefined(parameter.name)){
          console.log(`\tName: ${parameter.name}`);
        };
        if(this.checkNotUndefined(parameter.displayName)){
          console.log(`\tDisplayName: ${parameter.displayName}`);
        };
        if(this.checkNotUndefined(parameter.value)){
          console.log(`\tValue: ${parameter.value}`);
        };
        if(this.checkNotUndefined(parameter.defaultValue)){
          console.log(`\tDefaultValue: ${parameter.defaultValue}`);
        };
        if(this.checkNotUndefined(parameter.entityTypeDisplayName)){
          console.log(`\tEntityTypeDisplayName: ${parameter.entityTypeDisplayName}`);
        };
        if(this.checkNotUndefined(parameter.mandatory)){
          console.log(`\tMandatory: ${parameter.mandatory}`);
        };
        if(this.checkNotUndefined(parameter.prompts)){
          console.log(`\tPrompts:`);
          parameter.prompts.forEach(prompt => {
            if(this.checkNotUndefined(prompt)){
              console.log(`\t\tText: ${prompt}`);
            };
          });
        };
        if(this.checkNotUndefined(parameter.isList)){
          console.log(`\tIsList: ${parameter.isList}`);
        };
      });
    };
    // FALTA POR ACABAR
    if(this.checkNotUndefined(messages)){
      console.log('Messages:');
      messages.forEach(message => {
        if(this.checkNotUndefined(message.platform)){
          console.log(`\tPlatform: ${message.platform}`);
        };
        if(this.checkNotUndefined(message.text)){
          if(this.checkNotUndefined(message.text.text)){
            console.log('\tType:');
            message.text.text.forEach(textElement => {
              if(this.checkNotUndefined(textElement)){
                console.log(`\t\tText: ${textElement}`);
              };
            });
          };
        };
      });
    };
    if(this.checkNotUndefined(defaultResponsePlatforms)){
      console.log(`DefaultResponsePlatforms:`);
      defaultResponsePlatforms.forEach(defaultResponsePlatform => {
        if(this.checkNotUndefined(defaultResponsePlatform)){
          console.log(`\tIntegration: ${defaultResponsePlatform}`);
        };
      });
    };
    if(this.checkNotUndefined(rootFollowupIntentName)){
       console.log(`Root followup intent : ${rootFollowupIntentName}`);
    };
    if(this.checkNotUndefined(parentFollowupIntentName)){
      console.log(`Parent followup intent: ${parentFollowupIntentName}`);
    };
    if(this.checkNotUndefined(followupIntentInfo)){
      console.log('Info followup intent:');
      followupIntentInfo.forEach(followupIntentInfoElement => {
        if(this.checkNotUndefined(followupIntentInfoElement.followupIntentName)){
          console.log(`\tFollowupIntentName : ${followupIntentInfoElement.followupIntentName}`);
        };
        if(this.checkNotUndefined(followupIntentInfoElement.parentFollowupIntentName)){
          console.log(`\tParentFollowupIntentName : ${followupIntentInfoElement.parentFollowupIntentName}`);
        };
      });
    };
  });

  return response;
};

// Metodo para modificar el atributo displayName de un intent (modificacion permanente)
exports.setIntentDisplayName = async function(intent, value){
  // Recuperamos la estructura actual 
  var actualStruct = await exports.getIntentStructure(intent);
 
  // Conseguimos su id
  const id = this.getIdIntentfromPath(actualStruct[0].name);

  // Cambiamos el valor
  actualStruct[0].displayName = value;

  // Actualizamos en la API
  const result = await exports.updateIntentfromInfo(actualStruct, intent);

  // Devolvemos el intent
  console.log(`Intent ${id} set 'displayName' ${value}`);
  return result;
};
// Metodo para modificar el atributo webhookState de un intent (modificacion permanente)
exports.setIntentWebhookState = function(intent, value){
};
// Metodo para modificar el atributo priority de un intent (modificacion permanente)
exports.setIntentPriority = function(intent, value){
};
// Metodo para modificar el atributo isFallback de un intent (modificacion permanente)
exports.setIsFallback = function(intent, value){
};
// Metodo para modificar el atributo mlDisabled de un intent (modificacion permanente)
exports.setMlDisabled = function(intent, value){
};
// Metodo para modificar el atributo liveAgentHandoff de un intent (modificacion permanente)
exports.setLiveAgentHandoff = function(intent, value){
};
// Metodo para modificar el atributo endInteraction de un intent (modificacion permanente)
exports.setEndInteraction = function(intent, value){
};
// Metodo para modificar el atributo inputContextNames de un intent (modificacion permanente)
exports.setInputContextNames = function(intent, value){
};
// Metodo para modificar el atributo events de un intent (modificacion permanente)
exports.setEvents = function(intent, value){
};
// Metodo para modificar el atributo trainingPhrases de un intent (modificacion permanente)
exports.setTrainingPhrases = function(intent, value){
};
// Metodo para modificar el atributo action de un intent (modificacion permanente)
exports.setAction = function(intent, value){
};
// Metodo para modificar el atributo outputContexts de un intent (modificacion permanente)
exports.setOutputContexts = function(intent, value){
};
// Metodo para modificar el atributo resetContexts de un intent (modificacion permanente)
exports.setResetContexts = function(intent, value){
};
// Metodo para modificar el atributo parameters de un intent (modificacion permanente)
exports.setParameters = function(intent, value){
};
// Metodo para modificar el atributo messages de un intent (modificacion permanente)
exports.setMessages = function(intent, value){
};
// Metodo para modificar el atributo defaultResponsePlatforms de un intent (modificacion permanente)
exports.setDefaultResponsePlatforms = function(intent, value){
};
// Metodo para modificar el atributo rootFollowupIntentName de un intent (modificacion permanente)
exports.setRootFollowupIntentName = function(intent, value){
};
// Metodo para modificar el atributo parentFollowupIntentName de un intent (modificacion permanente)
exports.setParentFollowupIntentName = function(intent, value){
};
// Metodo para modificar el atributo followupIntentInfo de un intent (modificacion permanente)
exports.setFollowupIntentInfo = function(intent, value){
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