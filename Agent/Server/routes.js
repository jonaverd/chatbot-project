// Functions Files
const apiTools = require('../Functions/api-google.js')
const dialogFlowApp = require('../Functions/agent-dialogflow.js')
const actionsGoogleApp = require('../Functions/agent-actionsgoogle.js')

// Add the router
const express = require('express');
const router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });
  

// Express App fulfillment route (POST). 
// The entire dialogFlowApp object (incl its handlers) is the callback handler for this route.
router.post('/', function (req, res){

  // Identificamos el tipo de agente/dispositivo
  function contains(order) { 
    const input = req.headers['user-agent'];
    return input.includes(order);
  }

  // Servimos un tipo de webhook
  switch(true){
    case contains("ActionsOnGoogle"): 
      actionsGoogleApp(req, res);
      console.log("Voice Google Assitant Detected")
      break;
    case contains("Dialogflow"):
      dialogFlowApp.agent(req, res);
      console.log("DialogFlow Panel Detected")
      break;
    default:
      res.send();
  }

})

// Peticion GET de interacciones - Lista detallada
router.get('/', async function (req, res) { 
    const list = await apiTools.getIntentList();
    res.render("list", {intents: list, getidfunction: apiTools.getIDIntent_Path, exists: apiTools.checkNotUndefined});
})
  
// Peticion POST de interacciones - Crear intent
router.post('/create', async function (req, res) { 
  var nameValue = req.body.inputconfirm;
  await apiTools.createIntent(nameValue);
  res.redirect('/');
})

// Peticion GET de interacciones - Detalles del intent
router.get('/details/:id', async function (req, res) { 
  const actualid = req.params['id'];
  const actualstruct = await apiTools.getIntent(actualid);
  res.render("details", {intent: actualstruct[0], id: actualid, exists: apiTools.checkNotUndefined});
})

// Peticion GET de interacciones - Eliminar intent
router.get('/delete/:id', async function (req, res) { 
  const actualid = req.params['id'];
  await apiTools.deleteIntent(actualid);
  res.redirect('/');
})

// Peticion GET de interacciones - Modificar intent
router.post('/update/:id', async function (req, res) { 
  const actualid = req.params['id'];
  const data = req.body.inputupdatenew;
  const type = req.body.typeupdate;
  const newstruct = await apiTools.getIntent(actualid);
  switch (type) {
    case "displayName":
      newstruct[0].displayName = data;
      break;
    default:
  }
  await apiTools.updateIntent(actualid, newstruct[0]);
  res.redirect('/details/' + actualid);
})

module.exports = router;