// Active "Interactive Canvas Option" in Testing Voice Assistant for work this code!!!!
const {
    conversation,
    Image,
    Suggestion
  } = require('@assistant/conversation');
  
  const app = conversation({debug:true});
  
  app.handle('Default_Welcome_Intent', conv => {
    conv.add('Hi, how is it going?')
  })
  
  app.handle('Default_Fallback_Intent', conv => {
    conv.add('I didnt understand. Can you tell me something else?')
  })

module.exports = app;