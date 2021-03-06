
// Libreria necesaria para API Cloud
const apiTools = require('./api-google.js');

// Libreria necesaria para operar Database MongoDB
const databaseTools = require('./Database/queries.js');

// Arreglos del formato
const usersAuth = require('./Users/validators.js');

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
  // ... solo la base de datos  
  await databaseTools.updateUserName(name, email)
}

// Auxiliar - procesos de backend
exports.updateBackend_UserAge = async function(age, email){
  // ... solo la base de datos  
  await databaseTools.updateUserAge(age, email)
}

// Auxiliar - procesos de backend
exports.updateBackend_UserPassword = async function(password, email){
  // ... solo la base de datos  
  await databaseTools.updateUserPassword(password, email)
}

// Auxiliar - procesos de backend
exports.existsBackend_Question = async function (question){
  // ... solo la base de datos
  const check = await databaseTools.checkQuestionExists(question);
  return check; 
}

// Auxiliar - procesos de backend
exports.existsBackend_QuestionUser = async function (question, user){
  // ... solo la base de datos
  const check = await databaseTools.checkQuestionExistsUser(question, user);
  return check; 
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
  const id = await apiTools.getIDIntent_Name(input);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el card actions, las siguientes: sugerencias y card dialogflow
  struct[0].messages[0]['basicCard']['formattedText'] = data;
  struct[0].messages[2]['basicCard']['formattedText'] = data;
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
  const id = await apiTools.getIDIntent_Name(input);
  // ... en los intents
  await apiTools.deleteIntent(id)
  // ... en la base de datos  
  await databaseTools.deleteQuestion(input, user);
}

// Auxiliar - procesos de backend
exports.updateBackend_Image = async function(input, data, user){
  const id = await apiTools.getIDIntent_Name(input);
  const struct = await apiTools.getIntent(id);
  // La posicion 0 de mensajes indica el card actions, las siguientes: sugerencias y card dialogflow
  struct[0].messages[0]['basicCard']['image']['imageUri'] = data;
  struct[0].messages[2]['basicCard']['image']['imageUri'] = data;
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

// Auxiliar - procesos de backend
exports.getBackend_Intent = async function(input){
  // ... solo en intents
  const id = await apiTools.getIDIntent_Name(input);
  const result = await apiTools.getIntent(id);
  return result;
}

// Auxiliar - procesos de backend
exports.getBackend_IntentList = async function(){
   // ... solo en los intents  
   const list =  await apiTools.getIntentList();
   return list; 
}

// Auxiliar - procesos de backend
exports.createBackend_Pending = async function (question, answer, user, teacher){
  // ... en la base de datos  
  await databaseTools.createPendingQuestion(question, answer, user, teacher)
}

// Auxiliar - procesos de backend
exports.listBackend_Pending = async function(user){
  // ... solo la base de datos  
  const list =  await databaseTools.getPendingList(user);
  return list;
}

// Auxiliar - procesos de backend
exports.existsBackend_Pending = async function (question, user){
  // ... solo la base de datos
  const check = await databaseTools.checkPendingExistsUser(question, user);
  return check; 
}

// Auxiliar - procesos de backend
exports.getBackend_PendingQuestion = async function(input, user){
  // ... solo la base de datos  
  const data =  await databaseTools.getPendingQuestion(input, user)
  return data;
}

// Auxiliar - procesos de backend
exports.deleteBackend_PendingQuestion = async function(input, user){
  // ... en la base de datos  
  await databaseTools.deletePending(input, user)
}

// Auxiliar - procesos de backend
exports.compareBackend_Question = async function(inputparam){
  // ... en la base de datos  
  const list = await databaseTools.getQuestionsListAll()
  // original
  const input = usersAuth.FormatHealer(inputparam, {spaces: "all", char: "lower", symbols: "clean"})
  var result = null;
  list.forEach(element => { 
    // encontrada
    const fixed = usersAuth.FormatHealer(element.question, {spaces: "all", char: "lower", symbols: "clean"})
    // coinciden
    if(fixed === input || fixed.includes(input)){
      result = element;
    }
  });
  return result;
}

// Auxiliar - procesos de backend
exports.listBackend_UsersAll = async function(){
  // ... solo la base de datos  
  const list =  await databaseTools.getUsersListAll();
  return list;
}