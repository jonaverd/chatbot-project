exports.deleteIntent = async function(intentId){

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const projectId = 'odiseo-chatbot'; 

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);

  const request = {name: intentPath};

  // Send the request for deleting the intent.
  const result = await intentsClient.deleteIntent(request);
  console.log(`Intent ${intentPath} deleted`);

  return result;

};