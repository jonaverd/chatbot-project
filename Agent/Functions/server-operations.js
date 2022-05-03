
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

// Auxiliar - Parametros del middleware para el login en cada peticion
// Similar a los user.params del Asistente (datos de la sesion)
exports.UserParams = function (){
  var temporal;
  var last;
  var password;
  var session;
  var user; // or email
  var name;
  var age;
  var login; // check user option in login menu
  var register; // check user option in login menu
  var authorizate; // check user option in login menu
  var reg_email; // user variables register
  var reg_password; // user variables register
  var reg_name; // user variables register
  var reg_age; // user variables register
  function setTemporal(input){ 
    temporal = input
    if(input!=null) { last = input }
   }
  function getTemporal(){ return temporal }
  function setPassword(boolean){ password = boolean }
  function getPassword(){ return password }
  function setUser(input){ user = input }
  function getUser(){ return user }
  function setName(input){ name = input }
  function getName(){ return name }
  function setAge(input){ age = input }
  function getAge(){ return age }
  function setRegEmail(input){ reg_email = input }
  function getRegEmail(){ return reg_email }
  function setRegPassword(input){ reg_password = input }
  function getRegPassword(){ return reg_password }
  function setRegName(input){ reg_name = input }
  function getRegName(){ return reg_name }
  function setRegAge(input){ reg_age = input }
  function getRegAge(){ return reg_age }
  function setLogin(input){ login = input }
  function getLogin(){ return login }
  function setRegister(input){ register = input }
  function getRegister(){ return register }
  function setAuthorizate(input){ authorizate = input }
  function getAuthorizate(){ return authorizate }
  function getLast(){ return last }
  function reload(request){
    if(session != request){
      temporal = null;
      password = null;
      user = null // or email
      name = null;
      age = null;
      login = null;
      register = null;
      authorizate = null;
      reg_email = null;
      reg_name = null;
      reg_age = null;
      reg_password = null;
      session = request;
    }
  }
  return { 
    setTemporal: setTemporal,
    getTemporal: getTemporal,
    setPassword: setPassword,
    getPassword: getPassword,
    setUser: setUser,
    getUser: getUser,
    setName: setName,
    getName: getName,
    setAge: setAge,
    getAge: getAge,
    reload: reload,
    setLogin: setLogin,
    getLogin: getLogin,
    setRegister: setRegister,
    getRegister: getRegister,
    setAuthorizate: setAuthorizate,
    getAuthorizate: getAuthorizate,
    getLast: getLast,
    getRegEmail: getRegEmail,
    setRegEmail:  setRegEmail,
    getRegName: getRegName,
    setRegName: setRegName,
    getRegAge: getRegAge,
    setRegAge: setRegAge,
    getRegPassword: getRegPassword,
    setRegPassword: setRegPassword
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

// Auxiliar - procesos de backend
exports.getBackend_Intent = async function(input){
  // ... solo en intents
  const id = await apiTools.getIDIntent_Name(input);
  const result = await apiTools.getIntent(id);
  return result;
}

