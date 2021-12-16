exports.listIntent = async function(){
 
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const projectId = 'odiseo-chatbot';

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  async function listIntents() {
    // Construct request

    // The path to identify the agent that owns the intents.
    const projectAgentPath = intentsClient.projectAgentPath(projectId);

    console.log(projectAgentPath);

    const request = {
      parent: projectAgentPath,
    };

    // Send the request for listing intents.
    const [response] = await intentsClient.listIntents(request);
    response.forEach(intent => {
      console.log('====================');
      console.log(`Intent name: ${intent.name}`);
      console.log(`Intent display name: ${intent.displayName}`);
      console.log(`Action: ${intent.action}`);
      console.log(`Root folowup intent: ${intent.rootFollowupIntentName}`);
      console.log(`Parent followup intent: ${intent.parentFollowupIntentName}`);

      console.log('Input contexts:');
      intent.inputContextNames.forEach(inputContextName => {
        console.log(`\tName: ${inputContextName}`);
      });

      console.log('Output contexts:');
      intent.outputContexts.forEach(outputContext => {
        console.log(`\tName: ${outputContext.name}`);
      });
    });

  }

  listIntents(); 

};