
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion, Image, Card, Payload} = require('dialogflow-fulfillment');

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');
const RichContentResponses = require('./Dialogs/conversations.js');
const usersAuth = require('./Users/validators.js');

// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// caso especial: sincroniza variable last con temporal, en cada asignacion
// utilizada para las respuestas visuales, cuando temporal ya es (null)
function storageSetTemporal(input, store){ 
  store.set('temporal', input)
  if(input!=null) { store.set('last', input) }
 }

// caso especial: sincroniza variable lastinput con currentinput, en cada asignacion
// utilizada para las respuestas visuales, cuando currentinput ya es (null)
function storageSetInput(input, store){ 
  store.set('currentinput', input)
  if(store.get('currentinput') != null){ store.set('lastinput', store.get('currentinput')) }
 }

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.agent = async function (req, res, store) {

  // Inicializacion de local storage (solo la primera vez)
  if(!store.has('temporal')){ store.set('temporal', null) }  
  if(!store.has('last')){ store.set('last', null) }    
  if(!store.has('password')){ store.set('password', null) }    
  if(!store.has('user')){ store.set('user', null) }    
  if(!store.has('namedata')){ store.set('namesdata', null) }    
  if(!store.has('age')){ store.set('age', null) }   
  if(!store.has('login')){ store.set('login', null) }     
  if(!store.has('register')){ store.set('register', null) }     
  if(!store.has('reg_email')){ store.set('reg_email', null) }     
  if(!store.has('reg_password')){ store.set('reg_password', null) }     
  if(!store.has('reg_name')){ store.set('reg_name', null) }     
  if(!store.has('reg_age')){ store.set('reg_age', null) }   
  if(!store.has('exit')){ store.set('exit', null) }  
  if(!store.has('session')){ store.set('session', null) }
  if(!store.has('currentinput')){ store.set('currentinput', null) }    
  if(!store.has('lastinput')){ store.set('lastinput', null) }  
  store.set('session',  req.body.session) 
 
  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });
  
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  console.log('DialogFlow Panel Detected')

  // Comprobaciones del email temporal
  async function UserLogin_Temporal(agent, inputparam){
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "all", char: "lower"})
    // ¿formato válido?
    if (usersAuth.validatorEmail.validate(input)){
      // No hay email registrado 
      if(!await backendTools.getBackend_User(input)){
        storageSetTemporal(null, store)
        const response = RichContentResponses.error_users_login_emailnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Hay email registrado
      else{
        // email temporal activado
        storageSetTemporal(input, store)
        const response = RichContentResponses.input_users_login_waitingpassword(store.get('temporal'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // formato incorrecto (entrada normal)
    else{
      storageSetTemporal(null, store)
      const response = RichContentResponses.error_users_login_emailnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Comprobaciones de la contraseña
  async function UserLogin_Password(agent, inputparam){
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "all"})
    // ¿formato válido?
    if (usersAuth.schema.validate(input)){
      // No hay contraseña registrada 
      if(await backendTools.getBackend_UserPassword(store.get('temporal'))==null){
        store.set('password', null)
        const response = RichContentResponses.error_users_login_passwordnotexists(store.get('last'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Hay contraseña registrada
      else{
        // login válido
        if(await usersAuth.comparehashPassword(input, await backendTools.getBackend_UserPassword(store.get('temporal')))){
          store.set('password', true)
          const response = RichContentResponses.info_users_login_access(await backendTools.getBackend_UserName(store.get('temporal')));
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
        // login error
        else{
          store.set('password', null)
          const response = RichContentResponses.error_users_login_access(store.get('last'));
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
      }
    }
    // formato incorrecto (entrada normal)
    else{
      store.set('password', null)
      const response = RichContentResponses.error_users_login_passwordnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Inicio de sesión
  async function UserLogin(agent, input){
    // No hay temporal activo
    if(store.get('temporal')==null){
      await UserLogin_Temporal(agent, input)
    }
    // Temporal activado
    else{
      // No hay sesión de contraseña (¿Login?)
      if(store.get('password')==null){
        await UserLogin_Password(agent, input)
      }
      // Hay sesión de contraseña
      else{
        // No hay nombre registrado 
        if(!await backendTools.getBackend_UserName(store.get('temporal'))){
          const response = RichContentResponses.error_users_login_namenotexists(store.get('last'));
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
        // Hay nombre registrado
        else{
          // No hay edad registrada
          if(!await backendTools.getBackend_UserAge(store.get('temporal'))){
            const response = RichContentResponses.error_users_login_agenotexists(store.get('last'));
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
          // Hay edad registrada (todos los campos disponibles)
          else{
            store.set('user', store.get('temporal'));
            store.set('namedata', await backendTools.getBackend_UserName(store.get('user')));
            store.set('age', await backendTools.getBackend_UserAge(store.get('user')));
            const response = RichContentResponses.info_basic_welcome(store.get('namedata'));
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
        }
      }
    }
  }
  
  // Registro de email
  async function UserRegister_Email(agent, inputparam){
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "all", char: "lower"})
    // ¿formato válido?
    if (usersAuth.validatorEmail.validate(input)){
      // el usuario se crea mas adelante (con todos los datos)
      store.set('reg_email', input)
      const response = RichContentResponses.input_users_register_waitingpassword;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      store.set('reg_email', null)
      const response = RichContentResponses.error_users_register_emailnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro de contraseña
  async function UserRegister_Password(agent, inputparam){
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "all"})
    // ¿formato válido?
    if (usersAuth.schema.validate(input)){
      // el usuario se crea mas adelante (con todos los datos)
      store.set('reg_password', input)
      const response = RichContentResponses.input_users_register_waitingname;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      store.set('reg_password', null)
      const response = RichContentResponses.error_users_register_passwordnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro de nombre y apellidos
  async function UserRegister_Name(agent, inputparam){
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // ¿formato válido?
    if (usersAuth.validatorNames(input)){
      // el usuario se crea mas adelante (con todos los datos)
      store.set('reg_name', input)
      const response = RichContentResponses.input_users_register_waitingage;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      store.set('reg_name', null)
      const response = RichContentResponses.error_users_register_namenotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro de edad + guardar todos los datos
  async function UserRegister_Age(agent, inputparam){
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "all"})
    // ¿formato válido?
    if (usersAuth.validatorNumbers(input)){
      // si hemos llegado aqui, ya tenemos todos los datos del usuario, registramos 
      //¡UPDATE! Operamos cuando nos confirman que "Sí" con esos datos
      store.set('reg_age', input)
      const response = RichContentResponses.info_users_register_confirm(store.get('reg_name'), store.get('reg_email'), store.get('reg_age'), store.get('reg_password'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      store.set('reg_age', null)
      const response = RichContentResponses.error_users_register_agenotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro
  async function UserRegister(agent, input){
    // No ha pasado por el registro del email
    if(store.get('reg_email')==null){
      // No hay email registrado aún
      if(!await backendTools.getBackend_User(input)){
        await UserRegister_Email(agent, input);
      }
      // El email ya ha sido registrado
      else{
        store.set('reg_email', null)
        const response = RichContentResponses.error_users_register_emailexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    else{
      // No ha pasado por el registro de la contraseña
      if(store.get('reg_password')==null){
        // No hay contraseña registrada aún
        if(await backendTools.getBackend_UserPassword(store.get('temporal'))==null){
          await UserRegister_Password(agent, input);
        }
        // La contraseña ya ha sido registrada
        else{
          store.set('reg_password', null)
          const response = RichContentResponses.error_users_register_passwordexists(store.get('reg_email'));
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
      }
      else{
        // No ha pasado por el registro del nombre
        if(store.get('reg_name')==null){
          // No hay nombre registrado aún
          if(await backendTools.getBackend_UserName(store.get('temporal'))==null){
            await UserRegister_Name(agent, input);
          }
          // El nombre ya ha sido registrado
          else{
            store.set('reg_name', null)
            const response = RichContentResponses.error_users_register_nameexists(store.get('reg_email'));
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
        }
        else{
          // No ha pasado por el registro de la edad
          if(store.get('reg_age')==null){
            // No hay edad registrada aún
            if(await backendTools.getBackend_UserAge(store.get('temporal'))==null){
              await UserRegister_Age(agent, input);
            }
            // La edad ya ha sido registrada
            else{
              store.set('reg_age', null)
              const response = RichContentResponses.error_users_register_ageexists(store.get('reg_email'));
              agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
            }
          }
          else{
            // El registro ya se completó con la edad, simplemente reseteamos valores y volvemos al Menú Principal
            //¡UPDATE! Como nos dicen que "Sí" guardamos los valores y le iniciamos la sesión
            await backendTools.createBackend_User(store.get('reg_email'))
            await backendTools.updateBackend_UserPassword(await usersAuth.gethashPassword(store.get('reg_password')), store.get('reg_email'))
            await backendTools.updateBackend_UserName(store.get('reg_name'), store.get('reg_email'))
            await backendTools.updateBackend_UserAge(store.get('reg_age'), store.get('reg_email'))
            storageSetTemporal(store.get('reg_email'), store)
            store.set('reg_email', null)
            store.set('password', true)
            store.set('reg_password', null)
            store.set('user', store.get('temporal'));
            store.set('namedata', store.get('reg_name'));
            store.set('reg_name', null)
            store.set('age', store.get('reg_age'));
            store.set('reg_age', null)
            store.set('login', true)
            store.set('register', null)
            const response = RichContentResponses.info_basic_welcome_fromregister(store.get('namedata'), store.get('user'));
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
        }
      }
    }
  }

  // Actuar de middleware para el login en cada peticion
  async function Middleware(agent){
    // Controlar entradas de los formularios
    let input = req.body.queryResult.queryText
    // Opcion Login
    if(input == "Iniciar Sesión" && store.get('login')==null){
      const response = RichContentResponses.input_users_login_waitingemail;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      store.set('login', true)
    }
    // Opcion Registro
    else if(input == "Registro" && store.get('register')==null){
      const response = RichContentResponses.input_users_register_waitingemail;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      store.set('register', true)
    }
    // El usuario introduce otro input
    else{
      // Aun seguimos en el menu de login
      if(input=="Cerrar Sesión" || store.get('exit')==true || (store.get('login')==null && store.get('register')==null) || (store.get('login')==true && input=="Cancelar") || (store.get('register')==true && input=="Cancelar")){
        store.set('login', null)
        store.set('register', null)
        store.set('password', null)
        store.set('namedata', null)
        store.set('age', null)
        store.set('temporal', null)
        store.set('reg_email', null)
        store.set('reg_password', null)
        store.set('reg_name', null)
        store.set('reg_age', null)
        if(input=="Cerrar Sesión" || store.get('exit')==true) { store.set('user', null); store.set('exit', null) }
        const response = RichContentResponses.info_basic_login;
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Hemos entrado en alguna opcion antes
      else{
        // Continuamos en Login
        if(store.get('login')==true){
          await UserLogin(agent, input);
        }
        // Por descarte estamos en Registro
        else{
          await UserRegister(agent, input);
        }
      }
    }
  }

  // Generar una funcion para leer los intents creados como respuestas
  async function GenerateResponse (agent){
    // Aqui compruebo que la entrada se corresponde con uno de los intents de google
    // Estoy cojiendo de la peticion, el intent (que segun el body) Google esta asociando segun su frase
    // de entrenamiento. De esta manera estoy obtiendo todas las posibles frases de entrenamiento de este intent
    if(await backendTools.getBackend_Question(req.body.queryResult.intent.displayName)){
      const intent = await backendTools.getBackend_Question(req.body.queryResult.intent.displayName)
      const response = RichContentResponses.info_learning_response_question(intent)
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    //En caso de no asociar con nada, devuelvo un fallback (aunque no se suele activar nunca)
    else{
      const response = RichContentResponses.error_basic_unknown;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.welcome 
  function ConversationBasic_Welcome(agent) {
    const response = RichContentResponses.info_basic_welcome(store.get('namedata'));
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.exit
  function ConversationBasic_Exit(agent) {
    store.set('exit', true)
    const response = RichContentResponses.info_basic_exit(store.get('namedata'));
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.unknown
  function ConversationBasic_Fallback(agent) {
    const response = RichContentResponses.error_basic_unknown;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.options
  function ConversationBasic_Options(agent) {
    const response = RichContentResponses.info_basic_options(store.get('namedata'));
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.new.question
  function ConversationMain_TeachingAssistant(agent) {
    const response = RichContentResponses.input_learning_create_waitingquestion;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.new.question.request.question
  async function ConversationOperations_TeachingAssistant_InputQuestion(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Se sigue con el proceso
    if(input != "Menú Principal"){
      // Ya existe
      if(input && await backendTools.existsBackend_Question(input)){
       store.set('currentinput', null);
        const response = RichContentResponses.error_learning_create_questionexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede guardar
      else{
        // se guardará cuando tenga su respuesta 
        storageSetInput(input, store);
        const response = RichContentResponses.input_learning_create_waitinganswer(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // Se cancela operacion
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_cancel;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.new.question.request.answer
  async function ConversationOperations_TeachingAssistant_InputAnswer(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // ¿Hay alguna pregunta pendiente?
    if(store.get('currentinput') != null){
      // se crea pregunta + respuesta
      await backendTools.createBackend_Question(store.get('currentinput'), store.get('user'))
      await backendTools.updateBackend_Answer(store.get('currentinput'), input, store.get('user'))
     store.set('currentinput', null);
      const response = RichContentResponses.info_learning_create_completed(store.get('lastinput'), input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_options(store.get('namedata'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.delete.question
  async function ConversationOperations_TeachingAssistant_DeleteQuestion(agent) {
    const list = await backendTools.listBackend_Question(store.get('user'));
    const response = RichContentResponses.info_learning_simplelist(list, store.get('namedata'), "Eliminar Cuestión");
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.delete.question.confirm
  async function ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Se sigue con el proceso
    if(input != "Menú Principal"){
      // No existe
      if(input && !await backendTools.existsBackend_QuestionUser(input, store.get('user'))){
       store.set('currentinput', null);
        const response = RichContentResponses.error_learning_operations_questionnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede eliminar
      else{
        storageSetInput(input, store);
        if(store.get('currentinput') != null){
          await backendTools.deleteBackend_Question(store.get('currentinput'), store.get('user'))
        }
       store.set('currentinput', null);
        const response = RichContentResponses.info_learning_delete_completed(store.get('lastinput'))
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }    
    }
    // Se cancela operacion
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_options(store.get('namedata'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.update.question.answer
  async function ConversationMain_TeachingAssistant_UpdateAnswer(agent) {
    const list = await backendTools.listBackend_Question(store.get('user'));
    const response = RichContentResponses.info_learning_simplelist(list, store.get('namedata'), "Modificar Respuesta");
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.update.question.answer.select
  async function ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Se sigue con el proceso
    if(input != "Menú Principal"){
      // No existe
      if(input && !await backendTools.existsBackend_QuestionUser(input, store.get('user'))){
       store.set('currentinput', null);
        const response = RichContentResponses.error_learning_operations_questionnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede modificar
      else{
        // se modificará cuando tenga su respuesta 
        storageSetInput(input, store);
        const response = RichContentResponses.input_learning_update_waitinganswer(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }    
    }
    // Se cancela operacion
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_cancel;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.update.question.answer.input
  async function ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // ¿Hay algun input pendiente?
    if(store.get('currentinput') != null){
      // se modifica la respuesta de la cuestión
      await backendTools.updateBackend_Answer(store.get('currentinput'), input, store.get('user'))
     store.set('currentinput', null);
      const response = RichContentResponses.info_learning_update_completed(store.get('lastinput'), input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_options(store.get('namedata'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.update.question.image
  async function ConversationOperations_TeachingAssistant_UpdateImage(agent) {
    const list = await backendTools.listBackend_Question(store.get('user'));
    const response = RichContentResponses.info_learning_simplelist(list, store.get('namedata'), "Actualizar Imagen");
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.update.question.image.select
  async function ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Se sigue con el proceso
    if(input != "Menú Principal"){
      // No existe
      if(input && !await backendTools.existsBackend_QuestionUser(input, store.get('user'))){
       store.set('currentinput', null);
        const response = RichContentResponses.error_learning_operations_questionnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede modificar
      else{
        // se modificará cuando tenga su imagen 
        storageSetInput(input, store);
        const response = RichContentResponses.input_learning_update_waitingimage(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }    
    }
    // Se cancela operacion
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_cancel;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.update.question.image.input 
  async function ConversationOperations_TeachingAssistant_UpdateImage_InputImage(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "all"})
    // ¿Hay algun input pendiente?
    if(store.get('currentinput') != null){
      // formato correcto
      if (usersAuth.validUrl.isUri(input) && usersAuth.isImgLink(input)){
        // se modifica la imagen de la cuestión
        await backendTools.updateBackend_Image(store.get('currentinput'), input, store.get('user'))
        store.set('currentinput', null);
        const response = RichContentResponses.info_learning_updateimage_completed(store.get('lastinput'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      // formato incorrecto
      } else {
          store.set('currentinput', null);
          const response = RichContentResponses.error_learning_operations_imagenotformat(input);
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_options(store.get('namedata'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.list.question
  async function ConversationOperations_TeachingAssistant_List(agent) {
    const response = RichContentResponses.info_learning_list_choice(store.get('namedata'));
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.list.question.filter
  async function ConversationOperations_TeachingAssistant_List_Filter(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Mostrar listas
    if(input != "Menú Principal"){
      // Todas las cuestiones
      if(input == "Mostrar Todas"){
        store.set('currentinput', null);
        const list = await backendTools.listBackend_QuestionAll()
        const response = RichContentResponses.info_learning_detailslist_all(list);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Lista personal
      else if(input == "Creadas por " + store.get('namedata')){
        store.set('currentinput', null);
        const list = await backendTools.listBackend_Question(store.get('user'));
        const response = RichContentResponses.info_learning_detailslist(list, store.get('namedata'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Ninguna opcion
      else{
        store.set('currentinput', null);
        const response = RichContentResponses.info_basic_options(store.get('namedata'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // Se cancela operacion
    else{
      store.set('currentinput', null);
      const response = RichContentResponses.info_basic_options(store.get('namedata'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.random.question
  async function ConversationOperations_TeachingAssistant_RandomQuestion(agent) {
    const list = await backendTools.listBackend_QuestionAll();
    // No hay base de conocimiento
     if(list.length === 0){
      const response = RichContentResponses.error_learning_random_voidlist;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
     }
     // Enlaza con un intent-cuestión random
     else{
      // Genero un numero al azar
      const min = 0; const max = list.length;
      const index = Math.random() * (max - min) + min
      const name = list[Math.floor(index)].question
      // En este caso, no nos preocupan las frases de entrenamiento, ya que es una operación fija y el nombre del intent
      // es el mismo que en la base de datos
      if(await backendTools.getBackend_Question(name)){
        const intent = await backendTools.getBackend_Question(name)
        const response = RichContentResponses.info_learning_response_question(intent)
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      else{
        const response = RichContentResponses.error_basic_unknown;
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
  }

  // input.list.question.pending
  async function  ConversationOperations_TeachingAssistant_Pending(agent) {
    const list = await backendTools.listBackend_Pending(store.get('user'));
    const response = RichContentResponses.info_learning_pendinglist(list, store.get('namedata'), "Cuestiones Pendientes");
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.list.question.pending.select
  async function  ConversationOperations_TeachingAssistant_Pending_SelectQuestion(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Se sigue con el proceso
    if(input != "Menú Principal"){
      // No esta pendiente
      if(input && !await backendTools.existsBackend_Pending(input, store.get('user'))){
       store.set('currentinput', null);
        const response = RichContentResponses.error_learning_operations_pendingnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede confirmar
      else{
        storageSetInput(input, store);
        const response = RichContentResponses.input_learning_pending_confirm(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }    
    }
    // Se cancela operacion
    else{
      store.set('currentinput', null);
      const response = RichContentResponses.info_basic_cancel;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.list.question.pending.confirm
  async function ConversationOperations_TeachingAssistant_Pending_InputConfirm(agent) {
    const inputparam = agent.parameters.any;
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // ¿Hay alguna pregunta pendiente?
    if(store.get('currentinput') != null){
      // Confirmado
      if(input == "Confirmar Cuestión"){
        // Se recoje la pregunta
        const pending = await backendTools.getBackend_PendingQuestion(store.get('currentinput'), store.get('user'))
        // se crea pregunta definitiva
        await backendTools.createBackend_Question(store.get('currentinput'), pending.user)
        await backendTools.updateBackend_Answer(store.get('currentinput'), pending.answer, pending.user)
        // se borra de pendientes
        await backendTools.deleteBackend_PendingQuestion(store.get('currentinput'), store.get('user'))
        store.set('currentinput', null);
        const response = RichContentResponses.info_learning_pending_confirmed(store.get('lastinput'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Denegado
      else if(input == "Denegar Acceso"){
        // se borra de pendientes
        await backendTools.deleteBackend_PendingQuestion(store.get('currentinput'), store.get('user'))
        store.set('currentinput', null);
        const response = RichContentResponses.info_learning_pending_denied(store.get('lastinput'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Sin Opción
      else{
        store.set('currentinput', null);
        const response = RichContentResponses.info_basic_options(store.get('namedata'));
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // Sin pregunta seleccionada / Cancelado
    else{
     store.set('currentinput', null);
      const response = RichContentResponses.info_basic_options(store.get('namedata'));
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.assistant.list
  function AssistantOperations_LearningList(agent) {
    const response = RichContentResponses.info_learning_assistant_notsupported_only;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.assistant.request
  function AssistantOperations_LearningRequest(agent) {
    const response = RichContentResponses.info_learning_assistant_notsupported;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.assistant.request.teacher
  function AssistantOperations_LearningRequest_SelectTeacher(agent) {
    store.set('currentinput', null);
    const response = RichContentResponses.info_learning_assistant_notsupported_continue;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.assistant.request.question
  function AssistantOperations_LearningRequest_InputQuestion(agent) {
    store.set('currentinput', null);
    const response = RichContentResponses.info_basic_cancel;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.assistant.request.answer
  function AssistantOperations_LearningRequest_InputAnswer(agent) {
    store.set('currentinput', null);
    const response = RichContentResponses.info_basic_options(store.get('namedata'));
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }
 
  // Asociamos el nombre del Intent de DialogFlow con su funcion
  // Flujo normal (true), intent-respuesta (true) o login (false)
  function setIntentsMap(middleware, list, intentMap){
    list.forEach(intent => {
      // Lista de intenciones con middleware usuario
      if(middleware){
         // Con middleware activado, se fuerza a middleware
         intentMap.set(intent.displayName, Middleware);
      }
      else{
        // Lista de intenciones del sistema
        switch(intent.displayName){
          // Sin middleware, se asocia los que son del sistema
          case "ConversationBasic_Welcome": 
            intentMap.set('ConversationBasic_Welcome', ConversationBasic_Welcome);
            break;
          case "ConversationBasic_Exit": 
            intentMap.set('ConversationBasic_Exit', ConversationBasic_Exit);
            break;
          case "ConversationBasic_Fallback": 
            intentMap.set('ConversationBasic_Fallback', ConversationBasic_Fallback);
            break;
          case "ConversationBasic_Options": 
            intentMap.set('ConversationBasic_Options', ConversationBasic_Options);
            break;
          case "ConversationMain_TeachingAssistant": 
            intentMap.set('ConversationMain_TeachingAssistant', ConversationMain_TeachingAssistant);
            break;
          case "ConversationOperations_TeachingAssistant_InputQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_InputQuestion', ConversationOperations_TeachingAssistant_InputQuestion);
            break;
          case "ConversationOperations_TeachingAssistant_InputAnswer": 
            intentMap.set('ConversationOperations_TeachingAssistant_InputAnswer', ConversationOperations_TeachingAssistant_InputAnswer);
            break;
          case "ConversationOperations_TeachingAssistant_DeleteQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_DeleteQuestion', ConversationOperations_TeachingAssistant_DeleteQuestion);
            break;
          case "ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm": 
            intentMap.set('ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm', ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm);
            break;
          case "ConversationMain_TeachingAssistant_UpdateAnswer": 
            intentMap.set('ConversationMain_TeachingAssistant_UpdateAnswer', ConversationMain_TeachingAssistant_UpdateAnswer);
            break;
          case "ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion', ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion);
            break;
          case "ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer": 
            intentMap.set('ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer', ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer);
            break;
          case "ConversationOperations_TeachingAssistant_UpdateImage": 
            intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage', ConversationOperations_TeachingAssistant_UpdateImage);
            break;
          case "ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion', ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion);
            break;
          case "ConversationOperations_TeachingAssistant_UpdateImage_InputImage": 
            intentMap.set('ConversationOperations_TeachingAssistant_UpdateImage_InputImage', ConversationOperations_TeachingAssistant_UpdateImage_InputImage);
            break;
          case "ConversationOperations_TeachingAssistant_List": 
            intentMap.set('ConversationOperations_TeachingAssistant_List', ConversationOperations_TeachingAssistant_List);
            break;
          case "ConversationOperations_TeachingAssistant_List_Filter": 
            intentMap.set('ConversationOperations_TeachingAssistant_List_Filter', ConversationOperations_TeachingAssistant_List_Filter);
            break;
          case "ConversationOperations_TeachingAssistant_RandomQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_RandomQuestion', ConversationOperations_TeachingAssistant_RandomQuestion);
            break;
          case "ConversationOperations_TeachingAssistant_Pending": 
            intentMap.set('ConversationOperations_TeachingAssistant_Pending', ConversationOperations_TeachingAssistant_Pending);
            break;
          case "ConversationOperations_TeachingAssistant_Pending_SelectQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_Pending_SelectQuestion', ConversationOperations_TeachingAssistant_Pending_SelectQuestion);
            break;
          case "ConversationOperations_TeachingAssistant_Pending_InputConfirm": 
            intentMap.set('ConversationOperations_TeachingAssistant_Pending_InputConfirm', ConversationOperations_TeachingAssistant_Pending_InputConfirm);
            break;
          case "AssistantOperations_LearningList": 
            intentMap.set('AssistantOperations_LearningList', AssistantOperations_LearningList);
            break;
          case "AssistantOperations_LearningRequest": 
            intentMap.set('AssistantOperations_LearningRequest', AssistantOperations_LearningRequest);
            break;
          case "AssistantOperations_LearningRequest_SelectTeacher": 
            intentMap.set('AssistantOperations_LearningRequest_SelectTeacher', AssistantOperations_LearningRequest_SelectTeacher);
            break;
          case "AssistantOperations_LearningRequest_InputQuestion": 
            intentMap.set('AssistantOperations_LearningRequest_InputQuestion', AssistantOperations_LearningRequest_InputQuestion);
            break;
          case "AssistantOperations_LearningRequest_InputAnswer": 
            intentMap.set('AssistantOperations_LearningRequest_InputAnswer', AssistantOperations_LearningRequest_InputAnswer);
            break;
          // Lista de intenciones-respuesta
          default:
            // Por descarte, los intents que quedan son los creados por los usuarios (cuestiones)
            // Cualquier entrada que no sea algun intent de los de antes, se asocia a esta funcion
            // Si Google tiene guardado un intent con el mismo nombre, lo asociará con su respuesta
            // Sino, simplemente no podra asociar nada, y posiblemente responda un fallback
            intentMap.set(intent.displayName, GenerateResponse);
            break;
        }  
      }
    });  
    
    return intentMap;
  }
  // Hay flujo normal
  let middleware = false;
  // Se cierra la sesión actual / No hay sesión de login
  if(req.body.queryResult.queryText=="Cerrar Sesión" || store.get('exit')==true || store.get('user')==null){
    middleware = true;
  }
  // Le paso la lista de todos los intents guardados en google
  const list = await backendTools.getBackend_IntentList();
  const intentMap = new Map();
  setIntentsMap(middleware, list, intentMap)
  agent.handleRequest(intentMap);
}
