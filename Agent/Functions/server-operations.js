
// Libreria necesaria para API Cloud
const apiTools = require('./api-google.js');

// Libreria necesaria para operar Database MongoDB
const databaseTools = require('./Database/queries.js');

// Auxiliar - actualizar la interaccion donde espera un input
// Similar a los user.params del Asistente (datos de la sesion)
exports.WaitingInput = function (){
  // Nombre de la cuestión a guardar
  var currentinput = "";
  // Nombre de la ultima cuestión guardada
  var lastinput = "";
  // siempre se guarda una copia de la ultima cuestion guardada
  function update(){
    if(currentinput != ""){ 
      lastinput = currentinput 
    }
  }
  // preparar la cuestion en el aire (esperando la siguiente interaccion)
  function required(input){
    currentinput = input;
    update();
  }
  // preguntar si existe alguna cuestion en el aire (de antes)
  function progress(){
    update();
    if(currentinput != ""){
      return true;
    }
    else{
      return false;
    }
  }
  // recuperar la cuestion en el aire (de antes)
  function current(){
    update();
    return currentinput;
  }
  // recuperar la ultima cuestion (fijada)
  function last(){
    update();
    return lastinput;
  }
  // borrar las cuestiones en el aire (continuando la conversacion normal)
  function exit(){
    currentinput = "";
    update();
  }
  return {
    update: update,
    required: required,
    progress: progress,
    current: current,
    last: last,
    exit: exit
  };
}

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
exports.updateBackend_UserAge = async function(age, email){
  // ... en la base de datos  
  await databaseTools.updateUserAge(age, email)
}

// Auxiliar - procesos de backend
exports.updateBackend_UserPassword = async function(password, email){
  // ... en la base de datos  
  await databaseTools.updateUserPassword(password, email)
}

// Auxiliar - procesos de backend
exports.existsBackend_Question = async function (question, user){
   // ... en los intents
   const check1 = await apiTools.checkIntentExists(user+'_'+question);
   // ... en la base de datos
   const check2 = await databaseTools.checkQuestionExists(question, user);
   // ¿Existe en alguno de los dos?
   if(check1 == true || check2 == true){ return true; }
   else { return false; }
}

// Auxiliar - procesos de backend
exports.createBackend_Question = async function (question, user){
  // ... en los intents
  await apiTools.createIntent(question, user);
  // ... en la base de datos  
  await databaseTools.createVoidQuestion(question, user);
}

// Auxiliar - procesos de backend
exports.updateBackend_Answer = async function(input, data, user){
  const id = await apiTools.getIDIntent_Name(user+'_'+input);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el card actions, las siguientes: sugerencias y card dialogflow
  struct[0].messages[0]['basicCard']['subtitle'] = data;
  struct[0].messages[2]['card']['subtitle'] = data;
  // ... en los intents
  await apiTools.updateIntent(id, struct[0]);
  // ... en la base de datos  
  await databaseTools.updateAnswer(input, data, user);
}

// Auxiliar - procesos de backend
exports.listBackend_Question = async function(user){
  // ... solo la base de datos  
  const list =  await databaseTools.getQuestionsList(user);
  return list;
}

// Auxiliar - procesos de backend
exports.deleteBackend_Question = async function(input, user){
  const id = await apiTools.getIDIntent_Name(user+'_'+input);
  // ... en los intents
  await apiTools.deleteIntent(id)
  // ... en la base de datos  
  await databaseTools.deleteQuestion(input, user);
}

// Auxiliar - procesos de backend
exports.updateBackend_Image = async function(input, data, user){
  const id = await apiTools.getIDIntent_Name(user+'_'+input);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el card actions, las siguientes: sugerencias y card dialogflow
  struct[0].messages[0]['basicCard']['image']['imageUri'] = data;
  struct[0].messages[2]['card']['imageUri'] = data;
  // ... en los intents
  await apiTools.updateIntent(id, struct[0]);
  // ... en la base de datos  
  await databaseTools.updateImage(input, data, user);
}

// Auxiliar - procesos de backend
exports.getBackend_Question = async function(input){
  // ... solo la base de datos  
  const data =  await databaseTools.getQuestion(input)
  return data;
}

// Auxiliar - procesos de backend
exports.listBackend_QuestionAll = async function(){
  // ... solo la base de datos  
  const list =  await databaseTools.getQuestionsListAll();
  return list;
}

