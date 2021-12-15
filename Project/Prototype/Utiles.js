const Enum = require('enum');

// Metodo para extraer la ID de un Intent, recibiendo una ruta del proyecto
exports.getIdPath = function(projectAgentPath){
  var substring = projectAgentPath.split("projects/odiseo-chatbot/agent/intents/")
  return substring[1].toString();
};

// Metodo para extraer la ID de un Intent ya creado, recibiendo su nombre
exports.getIdIntent = async function(name){

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
    if(name == intent.displayName){
      id = this.getIdPath(intent.name);
    }
  });

  if(id !== ""){
    return id;
  }
};

// Metodo para comprobar si existe un intent creado con ese nombre
exports.checkQuestion = async function(question){
  
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
      if(question == intent.displayName){
          let intentId = this.getIdPath(intent.name)
          list.push({ name: intent.displayName, id: intentId });
      }
    });

    if(list.length === 0){
      console.log(`The question ${question} can be saved...`);
      return false;
    }
    else{
      console.log(`The question ${list[0].name} with ID: ${list[0].id} already exists!`);
      return true;
    }
};

// Metodo para crear el intent de la cuestion
exports.createQuestion = async function(name){
 
  const projectId = 'odiseo-chatbot';
  const displayName = 'Cuestión: ' + name;
  const trainingPhrasesParts = [name];
  const messageTexts = [];

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates the Intent Client
  const intentsClient = new dialogflow.IntentsClient();

  async function createQuestionIntent() {
  
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
    console.log(`Question ${response.name} created`);

    // Id del intent que se acaba de crear
    return await exports.getIdIntent(response.displayName)
    
  }

  return createQuestionIntent();

};

// Metodo para modificar el intent de la cuestion y añadir una respuesta
exports.setAnswer = async function(answer, id, displayName){

  const intentId = id;
  const projectId = 'odiseo-chatbot'; 

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);

  const request = {
    intent: {
      "name": intentPath,
      "displayName": 'Cuestión: ' + displayName,
      "trainingPhrases": [ 
        {
          "parts": [
            {
              "text": displayName,
            }
          ],
        }
      ],
      "messages": [
        {
          "text": {
            "text": [
              answer
            ]
          }
        }
      ],
    },
  };

  // Send the request for deleting the intent.
  const result = await intentsClient.updateIntent(request);
  console.log(`Intent ${intentPath} updated`);

  return result;
};