
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion, Image, Card, Payload} = require('dialogflow-fulfillment');

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');
const RichContentResponses = require('./conversations.js');
const usersAuth = require('./Users/validators.js');
// Actualizar la interaccion donde espera un input
// Similar a los user.params del Asistente (datos de la sesion)
const WaitingInput = backendTools.WaitingInput();
// Auxiliar - Parametros del middleware para el login en cada peticion
// Similar a los user.params del Asistente (datos de la sesion)
const UsersParams = backendTools.UserParams();
  
// enables lib debugging statements
process.env.DEBUG = 'dialogflow:debug'; 

// Peticion Webhook POST que se nos pide desde DialogFlow 
exports.agent = async function (req, res) {

  // Inicializacion del agente 
  const agent = new WebhookClient({ request: req, response: res });
  
  // Comprobar si estamos en la misma sesion u otra 
  // para actualizar los datos del usuario
  UsersParams.reload(req.body.session);

  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  console.log('DialogFlow Panel Detected')

  // Comprobaciones del email temporal
  async function UserLogin_Temporal(agent, input){
    // ¿formato válido?
    if (usersAuth.validatorEmail.validate(input)){
      // No hay email registrado 
      if(!await backendTools.getBackend_User(input)){
        UsersParams.setTemporal(null)
        const response = RichContentResponses.error_users_login_emailnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Hay email registrado
      else{
        // email temporal activado
        UsersParams.setTemporal(input)
        const response = RichContentResponses.input_users_login_waitingpassword(UsersParams.getTemporal());
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // formato incorrecto (entrada normal)
    else{
      UsersParams.setTemporal(null)
      const response = RichContentResponses.error_users_login_emailnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Comprobaciones de la contraseña
  async function UserLogin_Password(agent, input){
    // ¿formato válido?
    if (usersAuth.schema.validate(input)){
      // No hay contraseña registrada 
      if(await backendTools.getBackend_UserPassword(UsersParams.getTemporal())==null){
        UsersParams.setPassword(null)
        const response = RichContentResponses.error_users_login_passwordnotexists(UsersParams.getLast());
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Hay contraseña registrada
      else{
        // login válido
        if(await usersAuth.comparehashPassword(input, await backendTools.getBackend_UserPassword(UsersParams.getTemporal()))){
          UsersParams.setPassword(true);
          const response = RichContentResponses.info_users_login_access(await backendTools.getBackend_UserName(UsersParams.getTemporal()));
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
        // login error
        else{
          UsersParams.setPassword(null)
          const response = RichContentResponses.error_users_login_access(UsersParams.getLast());
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
      }
    }
    // formato incorrecto (entrada normal)
    else{
      UsersParams.setPassword(null)
      const response = RichContentResponses.error_users_login_passwordnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Inicio de sesión
  async function UserLogin(agent, input){
    // No hay temporal activo
    if(!UsersParams.getTemporal()){
      await UserLogin_Temporal(agent, input)
    }
    // Temporal activado
    else{
      // No hay sesión de contraseña (¿Login?)
      if(!UsersParams.getPassword()){
        await UserLogin_Password(agent, input)
      }
      // Hay sesión de contraseña
      else{
        // No hay nombre registrado 
        if(!await backendTools.getBackend_UserName(UsersParams.getTemporal())){
          const response = RichContentResponses.error_users_login_namenotexists(UsersParams.getLast());
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
        // Hay nombre registrado
        else{
          // No hay edad registrada
          if(!await backendTools.getBackend_UserAge(UsersParams.getTemporal())){
            const response = RichContentResponses.error_users_login_agenotexists(UsersParams.getLast());
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
          // Hay edad registrada (todos los campos disponibles)
          else{
            UsersParams.setUser(UsersParams.getTemporal());
            UsersParams.setName(await backendTools.getBackend_UserName(UsersParams.getUser()));
            UsersParams.setAge(await backendTools.getBackend_UserAge(UsersParams.getUser()));
            const response = RichContentResponses.info_basic_welcome(UsersParams.getName());
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
        }
      }
    }
  }
  
  // Registro de email
  async function UserRegister_Email(agent, input){
    // ¿formato válido?
    if (usersAuth.validatorEmail.validate(input)){
      // el usuario se crea mas adelante (con todos los datos)
      UsersParams.setRegEmail(input)
      const response = RichContentResponses.input_users_register_waitingpassword;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      UsersParams.setRegEmail(null)
      const response = RichContentResponses.error_users_register_emailnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro de contraseña
  async function UserRegister_Password(agent, input){
    // ¿formato válido?
    if (usersAuth.schema.validate(input)){
      // el usuario se crea mas adelante (con todos los datos)
      UsersParams.setRegPassword(input)
      const response = RichContentResponses.input_users_register_waitingname;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      UsersParams.setRegPassword(null)
      const response = RichContentResponses.error_users_register_passwordnotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro de nombre y apellidos
  async function UserRegister_Name(agent, input){
    // ¿formato válido?
    if (usersAuth.validatorNames(input)){
      // el usuario se crea mas adelante (con todos los datos)
      UsersParams.setRegName(input)
      const response = RichContentResponses.input_users_register_waitingage;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      UsersParams.setRegName(null)
      const response = RichContentResponses.error_users_register_namenotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro de edad + guardar todos los datos
  async function UserRegister_Age(agent, input){
    // ¿formato válido?
    if (usersAuth.validatorNumbers(input)){
      // si hemos llegado aqui, ya tenemos todos los datos del usuario, registramos 
      UsersParams.setRegAge(input)
      await backendTools.createBackend_User(UsersParams.getRegEmail())
      await backendTools.updateBackend_UserPassword(await usersAuth.gethashPassword(UsersParams.getRegPassword()), UsersParams.getRegEmail())
      await backendTools.updateBackend_UserName(UsersParams.getRegName(), UsersParams.getRegEmail())
      await backendTools.updateBackend_UserAge(UsersParams.getRegAge(), UsersParams.getRegEmail())
      const response = RichContentResponses.info_users_register_completed(UsersParams.getRegName());
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // formato incorrecto (entrada normal)
    else{
      UsersParams.setRegAge(null)
      const response = RichContentResponses.error_users_register_agenotformat(input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // Registro
  async function UserRegister(agent, input){
    // No ha pasado por el registro del email
    if(!UsersParams.getRegEmail()){
      // No hay email registrado aún
      if(!await backendTools.getBackend_User(input)){
        await UserRegister_Email(agent, input);
      }
      // El email ya ha sido registrado
      else{
        UsersParams.setRegEmail(null)
        const response = RichContentResponses.error_users_register_emailexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    else{
      // No ha pasado por el registro de la contraseña
      if(!UsersParams.getRegPassword()){
        // No hay contraseña registrada aún
        if(await backendTools.getBackend_UserPassword(UsersParams.getTemporal())==null){
          await UserRegister_Password(agent, input);
        }
        // La contraseña ya ha sido registrada
        else{
          UsersParams.setRegPassword(null)
          const response = RichContentResponses.error_users_register_passwordexists(UsersParams.getRegEmail());
          agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
        }
      }
      else{
        // No ha pasado por el registro del nombre
        if(!UsersParams.getRegName()){
          // No hay nombre registrado aún
          if(await backendTools.getBackend_UserName(UsersParams.getTemporal())==null){
            await UserRegister_Name(agent, input);
          }
          // El nombre ya ha sido registrado
          else{
            UsersParams.setRegName(null)
            const response = RichContentResponses.error_users_register_nameexists(UsersParams.getRegEmail());
            agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
          }
        }
        else{
          // No ha pasado por el registro de la edad
          if(!UsersParams.getRegAge()){
            // No hay edad registrada aún
            if(await backendTools.getBackend_UserAge(UsersParams.getTemporal())==null){
              await UserRegister_Age(agent, input);
            }
            // La edad ya ha sido registrada
            else{
              UsersParams.setRegAge(null)
              const response = RichContentResponses.error_users_register_ageexists(UsersParams.getRegEmail());
              agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
            }
          }
          else{
            // El registro ya se completó con la edad, simplemente reseteamos valores y volvemos al menu principal
            UsersParams.setRegister(false)
            UsersParams.setRegEmail(null)
            UsersParams.setRegPassword(null);
            UsersParams.setRegName(null);
            UsersParams.setRegAge(null);
            const response = RichContentResponses.info_basic_login;
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
    if(input == "Iniciar Sesión" && !UsersParams.getLogin()){
      const response = RichContentResponses.input_users_login_waitingemail;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      UsersParams.setLogin(true)
    }
    // Opcion Registro
    else if(input == "Registro" && !UsersParams.getRegister()){
      const response = RichContentResponses.input_users_register_waitingemail;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      UsersParams.setRegister(true)
    }
    // El usuario introduce otro input
    else{
      // Aun seguimos en el menu de login
      if(input=="Cerrar Sesión" || (!UsersParams.getLogin() && !UsersParams.getRegister()) || (UsersParams.getLogin() && input=="Cancelar") || (UsersParams.getRegister() && input=="Cancelar")){
        UsersParams.setLogin(false)
        UsersParams.setRegister(false)
        UsersParams.setPassword(null)
        UsersParams.setTemporal(null)
        UsersParams.setRegEmail(null)
        UsersParams.setRegPassword(null)
        UsersParams.setRegName(null)
        UsersParams.setRegAge(null)
        if(input=="Cerrar Sesión") { UsersParams.setUser(null) }
        const response = RichContentResponses.info_basic_login;
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Hemos entrado en alguna opcion antes
      else{
        // Continuamos en Login
        if(UsersParams.getLogin()){
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
    if(await backendTools.getBackend_Intent(req.body.queryResult.intent.displayName)){
      const intent = await backendTools.getBackend_Intent(req.body.queryResult.intent.displayName)
      const response = RichContentResponses.info_learning_response_question(intent[0].messages[2]['basicCard'])
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    else{
      const response = RichContentResponses.error_basic_unknown;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.welcome 
  function ConversationBasic_Welcome(agent) {
    const response = RichContentResponses.info_basic_welcome(UsersParams.getName());
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.exit
  function ConversationBasic_Exit(agent) {
    const response = RichContentResponses.info_basic_exit(UsersParams.getName());
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.unknown
  function ConversationBasic_Fallback(agent) {
    const response = RichContentResponses.error_basic_unknown;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.options
  function ConversationBasic_Options(agent) {
    const response = RichContentResponses.info_basic_options;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.new.question
  function ConversationMain_TeachingAssistant(agent) {
    const response = RichContentResponses.input_learning_create_waitingquestion;
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.new.question.request.question
  async function ConversationOperations_TeachingAssistant_InputQuestion(agent) {
    const input = agent.parameters.any;
    // Se sigue con el proceso
    if(input != "Otras funciones"){
      // Ya existe
      if(input && await backendTools.existsBackend_Question(input)){
        WaitingInput.exit();
        const response = RichContentResponses.error_learning_create_questionexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede guardar
      else{
        // se guardará cuando tenga su respuesta 
        WaitingInput.required(input);
        const response = RichContentResponses.input_learning_create_waitinganswer(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
    }
    // Se cancela operacion
    else{
      WaitingInput.exit();
      const response = RichContentResponses.info_basic_cancel;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.new.question.request.answer
  async function ConversationOperations_TeachingAssistant_InputAnswer(agent) {
    const input = agent.parameters.any;
    // ¿Hay alguna pregunta pendiente?
    if(WaitingInput.progress()){
      // se crea pregunta + respuesta
      await backendTools.createBackend_Question(WaitingInput.current(), UsersParams.getUser())
      await backendTools.updateBackend_Answer(WaitingInput.current(), input, UsersParams.getUser())
      WaitingInput.exit();
      const response = RichContentResponses.info_learning_create_completed(WaitingInput.last(), input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    else{
      WaitingInput.exit();
      const response = RichContentResponses.info_basic_options;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.delete.question
  function ConversationOperations_TeachingAssistant_DeleteQuestion(agent) {
  }

  // input.delete.question.confirm
  function ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm(agent) {
  }

  // input.update.question.answer
  function ConversationMain_TeachingAssistant_UpdateAnswer(agent) {
  }

  // input.update.question.answer.select
  function ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion(agent) {
  }

  // input.update.question.answer.input
  function ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer(agent) {
  }

  // input.update.question.image
  function ConversationOperations_TeachingAssistant_UpdateImage(agent) {
  }

  // input.update.question.image.select
  function ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion(agent) {
  }

  // input.update.question.image.input 
  function ConversationOperations_TeachingAssistant_UpdateImage_InputImage(agent) {
  }

  // input.list.question
  async function ConversationOperations_TeachingAssistant_List(agent) {
    const response = await RichContentResponses.info_learning_detailslist(UsersParams.getUser(), UsersParams.getName());
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.random.question
  function ConversationOperations_TeachingAssistant_RandomQuestion(agent) {
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  // Flujo normal (true), intent-respuesta (true) o login (false)
  function setIntentsMap(middleware, list){
    let intentMap = new Map();
    list.forEach(intent => {
      // Lista de intenciones con middleware usuario
      if(middleware){
         intentMap.set(intent.displayName, Middleware);
      }
      else{
        // Lista de intenciones del sistema
        switch(intent.displayName){
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
          case "ConversationOperations_TeachingAssistant_RandomQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_RandomQuestion', ConversationOperations_TeachingAssistant_RandomQuestion);
            break;
          // Lista de intenciones-respuesta
          default:
            intentMap.set(intent.displayName, GenerateResponse);
        }
      }
    });  
    return intentMap;
  }
  // Hay flujo normal
  let middleware = false;
  // Se cierra la sesión actual / No hay sesión de login
  if(req.body.queryResult.queryText=="Cerrar Sesión" || !UsersParams.getUser()){
    middleware = true;
  }
  const list = await backendTools.getBackend_IntentList();
  agent.handleRequest(setIntentsMap(middleware, list));
}
