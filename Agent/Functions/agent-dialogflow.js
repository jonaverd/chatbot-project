
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
    // Aqui compruebo que la entrada se corresponde con uno de los intents de google
    // Estoy cojiendo de la peticion, el intent (que segun el body) Google esta asociando segun su frase
    // de entrenamiento. De esta manera estoy obtiendo todas las posibles frases de entrenamiento de este intent
    if(await backendTools.getBackend_Intent(req.body.queryResult.intent.displayName)){
      const intent = await backendTools.getBackend_Intent(req.body.queryResult.intent.displayName)
      const response = RichContentResponses.info_learning_response_question(intent[0].messages[2]['basicCard'])
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    // En caso de no asociar con nada, devuelvo un fallback (aunque no se suele activar nunca)
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
  async function ConversationOperations_TeachingAssistant_DeleteQuestion(agent) {
    const list = await backendTools.listBackend_Question(UsersParams.getUser());
    const response = RichContentResponses.info_learning_simplelist(list, UsersParams.getName(), "Eliminar cuestión");
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.delete.question.confirm
  async function ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm(agent) {
    const input = agent.parameters.any;
    // Se sigue con el proceso
    if(input != "Otras funciones"){
      // No existe
      if(input && !await backendTools.existsBackend_Question(input)){
        WaitingInput.exit();
        const response = RichContentResponses.error_learning_operations_questionnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede eliminar
      else{
        WaitingInput.required(input);
        if(WaitingInput.progress()){
          await backendTools.deleteBackend_Question(WaitingInput.current(), UsersParams.getUser())
        }
        WaitingInput.exit();
        const response = RichContentResponses.info_learning_delete_completed(WaitingInput.last())
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }    
    }
    // Se cancela operacion
    else{
      WaitingInput.exit();
      const response = RichContentResponses.info_basic_options;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
  }

  // input.update.question.answer
  async function ConversationMain_TeachingAssistant_UpdateAnswer(agent) {
    const list = await backendTools.listBackend_Question(UsersParams.getUser());
    const response = RichContentResponses.info_learning_simplelist(list, UsersParams.getName(), "Modificar respuesta");
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.update.question.answer.select
  async function ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion(agent) {
    const input = agent.parameters.any;
    // Se sigue con el proceso
    if(input != "Otras funciones"){
      // No existe
      if(input && !await backendTools.existsBackend_Question(input)){
        WaitingInput.exit();
        const response = RichContentResponses.error_learning_operations_questionnotexists(input);
        agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
      }
      // Se puede modificar
      else{
        // se modificará cuando tenga su respuesta 
        WaitingInput.required(input);
        const response = RichContentResponses.input_learning_update_waitinganswer(input);
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

  // input.update.question.answer.input
  async function ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer(agent) {
    const input = agent.parameters.any;
    // ¿Hay algun input pendiente?
    if(WaitingInput.progress()){
      // se modifica la respuesta de la cuestión
      await backendTools.updateBackend_Answer(WaitingInput.current(), input, UsersParams.getUser())
      WaitingInput.exit();
      const response = RichContentResponses.info_learning_update_completed(WaitingInput.last(), input);
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
    else{
      WaitingInput.exit();
      const response = RichContentResponses.info_basic_options;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
    }
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
    const list = await backendTools.listBackend_Question(UsersParams.getUser());
    const response = RichContentResponses.info_learning_detailslist(list, UsersParams.getName());
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }

  // input.random.question
  async function ConversationOperations_TeachingAssistant_RandomQuestion(agent) {
     const list = await backendTools.listBackend_QuestionAll();
     // No hay base de conocimiento
     if(list.length===0){
      const response = RichContentResponses.error_learning_random_voidlist;
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
     }
     // Enlaza con un intent-cuestión random
     else{
      // Genero un numero al azar
      const index = Math.floor(Math.random() * (Math.floor(list.length) - Math.ceil(0) + 1)) + Math.ceil(0);;
      const name = list[index].question
      // Igual que cuando respondemos una cuestion del usuario, vamos a obtener los datos del intent en google
      // En este caso, no nos preocupan las frases de entrenamiento, ya que es una operación fija y el nombre del intent
      // es el mismo que en la base de datos
      const intent = await backendTools.getBackend_Intent(name)
      const response = RichContentResponses.info_learning_response_question(intent[0].messages[2]['basicCard'])
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
     }
  }

  // Asociamos el nombre del Intent de DialogFlow con su funcion
  // Flujo normal (true), intent-respuesta (true) o login (false)
  function setIntentsMap(middleware, list){
    let intentMap = new Map();
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
          case "ConversationOperations_TeachingAssistant_RandomQuestion": 
            intentMap.set('ConversationOperations_TeachingAssistant_RandomQuestion', ConversationOperations_TeachingAssistant_RandomQuestion);
            break;
          // Lista de intenciones-respuesta
          default:
            // Por descarte, los intents que quedan son los creados por los usuarios (cuestiones)
            // Cualquier entrada que no sea algun intent de los de antes, se asocia a esta funcion
            // Si Google tiene guardado un intent con el mismo nombre, lo asociará con su respuesta
            // Sino, simplemente no podra asociar nada, y posiblemente responda un fallback
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
  // Le paso la lista de todos los intents guardados en google
  const list = await backendTools.getBackend_IntentList();
  agent.handleRequest(setIntentsMap(middleware, list));
}
