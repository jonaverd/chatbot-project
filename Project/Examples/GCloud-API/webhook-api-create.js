exports.createIntent = async function(){
 
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
     const projectId = 'odiseo-chatbot';
     const displayName = 'INT_API_CREATE';
     const trainingPhrasesParts = ['Automatic input text'];
     const messageTexts = ['Automatic output text'];

    // Imports the Dialogflow library
    const dialogflow = require('@google-cloud/dialogflow');

    // Instantiates the Intent Client
    const intentsClient = new dialogflow.IntentsClient();

    async function createIntent() {
      // Construct request

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
      
    }

    createIntent();

};