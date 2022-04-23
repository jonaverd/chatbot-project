// Functions Files
const apiTools = require('../Functions/api-google.js')
const dialogFlowApp = require('../Functions/agent-dialogflow.js')
const actionsGoogleApp = require('../Functions/agent-actionsgoogle.js')
const path = require('path');

// Add the router
const express = require('express');
const router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
  
// Express App fulfillment route (POST). 
router.post('/agent/dialogflow', async function (req, res){
    await dialogFlowApp.agent(req, res);
})

// Express App fulfillment Chat Web. 
router.get('/agent/dialogflow', async function (req, res){
  res.sendFile('dialogflow.html', {
    root: path.join(__dirname, './Views')
  })
})

// Express App fulfillment route (POST). 
// The entire actionsGoogleApp object (incl its handlers) is the callback handler for this route.
router.post('/agent/actions', actionsGoogleApp)

// Peticion GET de interacciones - Canvas Home
router.get('/', async function (req, res) { 
  res.send("Hello");
})

// Peticion GET de interacciones - Lista detallada
router.get('/render/list', async function (req, res) { 
    const list = await apiTools.getIntentList();
    res.render("list", {intents: list, getidfunction: apiTools.getIDIntent_Path, exists: apiTools.checkNotUndefined});
})
  
// Peticion POST de interacciones - Crear intent
router.post('/render/create', async function (req, res) { 
  var nameValue = req.body.inputconfirm;
  await apiTools.createIntent(nameValue);
  res.redirect('/render/list');
})

// Peticion GET de interacciones - Detalles del intent
router.get('/render/details/:id', async function (req, res) { 
  const actualid = req.params['id'];
  const actualstruct = await apiTools.getIntent(actualid);
  res.render("details", {intent: actualstruct[0], id: actualid, exists: apiTools.checkNotUndefined});
})

// Peticion GET de interacciones - Eliminar intent
router.get('/render/delete/:id', async function (req, res) { 
  const actualid = req.params['id'];
  await apiTools.deleteIntent(actualid);
  res.redirect('/render/list');
})

// Peticion GET de interacciones - Modificar intent
router.post('/render/update/:id', async function (req, res) { 
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
  res.redirect('/render/details/' + actualid);
})

module.exports = router;