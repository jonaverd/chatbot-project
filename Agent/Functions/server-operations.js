
// Libreria necesaria para API Cloud
const apiTools = require('./api-google.js');

// Libreria necesaria para operar Database MongoDB
const databaseTools = require('./Database/queries.js');

// Nombre de la cuestión a guardar
exports.lastQuestion;

// Auxiliar - procesos de backend
exports.createBackend_User = async function (email){
  // ... en la base de datos  
  await databaseTools.createUser(email);
}

// Auxiliar - procesos de backend
exports.getBackend_User = async function(email){
  // ... solo la base de datos  
  const data =  await databaseTools.getUserData(email);
  return data;
}

// Auxiliar - procesos de backend
exports.getBackend_UserName = async function(email){
  // ... solo la base de datos  
  const data =  await databaseTools.getUserName(email);
  return data;
}

// Auxiliar - procesos de backend
exports.getBackend_UserLastName = async function(email){
  // ... solo la base de datos  
  const data =  await databaseTools.getUserLastName(email);
  return data;
}

// Auxiliar - procesos de backend
exports.getBackend_UserAge = async function(email){
  // ... solo la base de datos  
  const data =  await databaseTools.getUserAge(email);
  return data;
}

// Auxiliar - procesos de backend
exports.getBackend_UserPassword = async function(email){
  // ... solo la base de datos  
  const data =  await databaseTools.getUserPassword(email);
  return data;
}

// Auxiliar - procesos de backend
exports.updateBackend_UserName = async function(name, email){
  // ... en la base de datos  
  await databaseTools.updateUserName(name, email)
}

// Auxiliar - procesos de backend
exports.updateBackend_UserLastName = async function(lastname, email){
  // ... en la base de datos  
  await databaseTools.updateUserLastName(lastname, email)
}

// Auxiliar - procesos de backend
exports.updateBackend_UserAge = async function(age, email){
  // ... en la base de datos  
  await databaseTools.updateUserAge(age, email)
}

// Auxiliar - procesos de backend
exports.updateBackend_UserPassword = async function(password, email){
  // ... en la base de datos  
  await databaseTools.updateUserPassword(password, email)
}

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
exports.updateBackend_Answer = async function(input, data){
  const id = await apiTools.getIDIntent_Name(input);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el card actions, las siguientes: sugerencias y card dialogflow
  struct[0].messages[0]['basicCard']['subtitle'] = data;
  struct[0].messages[2]['card']['subtitle'] = data;
  // ... en los intents
  await apiTools.updateIntent(id, struct[0]);
  // ... en la base de datos  
  await databaseTools.updateAnswer(input, data);
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
exports.listBackend_Question = async function(user){
  // ... solo la base de datos  
  const list =  await databaseTools.getQuestionsList(user);
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