
// Libreria necesaria para API Cloud
const apiTools = require('./webhook-api-tools.js');

// Libreria necesaria para operar Database MongoDB
const databaseTools = require('./Database/Operations/operations.js');

// Nombre de la cuestión a guardar
exports.lastQuestion;

// Auxiliar - actualizar la interaccion donde espera un input
exports.updateWaitingInput_Question = function(situation, input=""){
  // añadir la cuestion (input user) al aire - esperando la siguiente interaccion
  if(situation=="required"){ exports.lastQuestion = input; }
  // preguntar si existe alguna cuestion en el aire (de antes)
  else if(situation=="progress") { 
    if(exports.lastQuestion != ""){ return true } 
    else { return false }
  }
  // borrar las cuestiones en el aire previas, para seguir con la conversacion normal
  else { exports.lastQuestion = "";  } // Similar to situation = "exit", "free", ...
}

// Auxiliar - procesos de backend
exports.existsBackend_Question = async function (input){
  // ... en los intents
  const check1 = await apiTools.checkIntentExists(input);
  // ... en la base de datos
  const check2 = await databaseTools.checkQuestionExists(input);
  // ¿Existe en alguno de los dos?
  if(check1 == true || check2 == true){ return true; }
  else { return false; }
}

// Auxiliar - procesos de backend
exports.createBackend_Question = async function (input){
  // ... en los intents
  await apiTools.createIntent(input);
  // ... en la base de datos  
  await databaseTools.createVoidQuestion(input);
}

// Auxiliar - procesos de backend
exports.updateBackend_Answer = async function(input){
  const id = await apiTools.getIDIntent_Name(exports.lastQuestion);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el text, las siguientes: imagen y sugerencias
  struct[0].messages[0]['card']['subtitle'] = input;
  // ... en los intents
  await apiTools.updateIntent(id, struct[0]);
  // ... en la base de datos  
  await databaseTools.updateAnswer(exports.lastQuestion, input);
}

// Auxiliar - procesos de backend
exports.updateBackend_Photo = async function(input){
  const id = await apiTools.getIDIntent_Name(exports.lastQuestion);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el text, las siguientes: imagen y sugerencias
  struct[0].messages[0]['card']['imageUri'] = input;
  // ... en los intents
  await apiTools.updateIntent(id, struct[0]);
  // ... en la base de datos  
  await databaseTools.updatePhoto(exports.lastQuestion, input);
}

// Auxiliar - procesos de backend
exports.listBackend_Question = async function(){
  // ... solo la base de datos  
  const list =  await databaseTools.getQuestionsList();
  return list;
}

// Auxiliar - procesos de backend
exports.deleteBackend_Question = async function(input){
  const id = await apiTools.getIDIntent_Name(input);
  // ... en los intents
  await apiTools.deleteIntent(id)
  // ... en la base de datos  
  await databaseTools.deleteQuestion(input);
}