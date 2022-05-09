// Active "Interactive Canvas Option" in Testing Voice Assistant for work this code!!
// Import the appropriate service and chosen wrappers
const {
  conversation,
  Image,
  Suggestion,
  Simple,
  Table,
  Card
} = require('@assistant/conversation')

// archivo con las funciones para trabajar con el backend
// y los inputs del usuario que se quedan pendientes "en el aire"
const backendTools = require('./server-operations.js');
const referencesURI = require('./Assets/references.js');
const usersAuth = require('./Users/validators.js');
const RichContentResponses = require('./Dialogs/voice-responses.js');

// Create an app instance
const app = conversation({debug:true})
console.log('Google Assistant Detected')

// middleware for errors
app.catch((conv, error) => {
  console.error(error);
  conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
  conv.add(new Simple(RichContentResponses.error_basic_internal));
});

// Actions if user is logged
class Assistant {
  constructor(conv) {
    this.conv = conv;
  }
  input_welcome() {
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))
    this.conv.add(new Simple(RichContentResponses.info_basic_welcome(this.conv.user.params.name)));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  input_exit() {
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))
    if(!this.conv.user.params.name){
      this.conv.add(new Simple(RichContentResponses.info_basic_exit(" ")));
    }
    else{
      this.conv.add(new Simple(RichContentResponses.info_basic_exit(this.conv.user.params.name)));
    }
  }
  input_unknown(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  input_options(){
    this.conv.add(new Simple(RichContentResponses.info_basic_options));
    this.conv.add(new Table(RichContentResponses.info_basic_list_options(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hola Odiseo")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Dime Alguna Curiosidad")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Quiero Aprender")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Quiero Enviar Pregunta")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  async input_random_question(){
    const list = await backendTools.listBackend_QuestionAll()
    // vacia
    if(list.length === 0){
      this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
      this.conv.add(new Simple(RichContentResponses.error_operations_listvoid));
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
    }
    // con preguntas
    else{
      // Genero un numero al azar
      const min = 0; const max = list.length;
      const index = Math.random() * (max - min) + min
      const name = list[Math.floor(index)].question
      // Enlaza con un intent-cuestión: se responde
      if(await backendTools.getBackend_Question(name)){
        const intent = await backendTools.getBackend_Question(name);
        this.conv.add(new Simple(RichContentResponses.info_basic_response_header(intent.answer)));
        this.conv.add(new Card(RichContentResponses.info_basic_response_card(intent, RichContentResponses.info_basic_image(intent.visual))));
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Continuar")))
      }
      // No enlaza con un intent-cuestión
      else{
        this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
        this.conv.add(new Simple(RichContentResponses.error_basic_internal));
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
      }
    }
  }
  async input_assistant_list(){
    const list = await backendTools.listBackend_QuestionAll()
    // vacia
    if(list.length === 0){
      this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
      this.conv.add(new Simple(RichContentResponses.error_operations_listvoid));
    }
    // con preguntas
    else{
      this.conv.add(new Simple(RichContentResponses.info_operations_list_header));
      this.conv.add(new Table(RichContentResponses.info_operations_list(list, new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_TeachingJunior)))));
    }
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  async input_assistant_request(){
    const list = await backendTools.listBackend_UsersAll()
    // vacia
    if(list.length === 0){
      this.conv.user.params.waiting = false;
      this.conv.user.params.input_teacher = null;
      this.conv.user.params.input_question = null;
      this.conv.user.params.input_answer = null;
      this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
      this.conv.add(new Simple(RichContentResponses.error_operations_listvoidteachers));
    }
    // con profesores
    else{
      this.conv.user.params.waiting = true;
      this.conv.add(new Simple(RichContentResponses.info_operations_listteachers_header));
      this.conv.add(new Table(RichContentResponses.info_operations_listteachers(list, new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_TeachingJunior)), this.conv.user.params.name)));
      list.forEach((element, index) => { 
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion(index.toString())))
      });
    }
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
  }
  async input_assistant_request_teacher(){
    // Se sigue con el proceso
    if(this.conv.intent.query != "Comandos" && this.conv.user.params.waiting){
      // Controlar entradas de los formularios
      const inputparam = this.conv.intent.query
      // arreglamos el formato (espacios, etc)
      const input = usersAuth.FormatHealer(inputparam, {spaces: "all"})
      // es numero
      if(usersAuth.validatorNumbers(input)){
        const list = await backendTools.listBackend_UsersAll()
        // existe profesor
        if(list.length!==0 && input<list.length && input>=0 && list[input].email){
          this.conv.user.params.waiting = true;
          // se guardará cuando tenga sus datos
          this.conv.user.params.input_teacher = list[input].email;
          this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_TeachingJunior)))
          this.conv.add(new Simple(RichContentResponses.input_operations_question(await backendTools.getBackend_UserName(this.conv.user.params.input_teacher))));
        }
        // no existe
        else{
          this.conv.user.params.waiting = false;
          this.conv.user.params.input_teacher = null;
          this.conv.user.params.input_question = null;
          this.conv.user.params.input_answer = null;
          this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
          this.conv.add(new Simple(RichContentResponses.error_operations_notteacher));
          this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Detener Operación")))
        }
      }
      // entrada normal
      else{
        this.conv.user.params.waiting = false;
        this.conv.user.params.input_teacher = null;
        this.conv.user.params.input_question = null;
        this.conv.user.params.input_answer = null;
        this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
        this.conv.add(new Simple(RichContentResponses.error_operations_notteacher));
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Detener Operación")))
      }
    }
    // Ha habido un error o se cancela
    else{
      this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
      this.conv.add(new Simple(RichContentResponses.info_basic_cancel_first));
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Detener Operación")))
    }
  }
  async input_assistant_request_question(){
    // Se sigue con el proceso
    if(this.conv.intent.query != "Detener Operación" && this.conv.user.params.waiting){
      // Controlar entradas de los formularios
      const inputparam = this.conv.intent.query
      // arreglamos el formato (espacios, etc)
      const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
      // Error ya existe
      if(input && await backendTools.existsBackend_Question(input)){
        this.conv.user.params.waiting = false;
        this.conv.user.params.input_teacher = null;
        this.conv.user.params.input_question = null;
        this.conv.user.params.input_answer = null;
        this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
        this.conv.add(new Simple(RichContentResponses.error_operations_existsquestion(input)));
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
      }
      // Continuar
      else{
        this.conv.user.params.waiting = true;
        // se guardará cuando tenga sus datos
        this.conv.user.params.input_question = input;
        this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_TeachingJunior)))
        this.conv.add(new Simple(RichContentResponses.input_operations_answer(this.conv.user.params.input_question)));
      }
    }
    // Ha habido un error o se cancela
    else{
      this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))
      this.conv.add(new Simple(RichContentResponses.info_basic_cancel));
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    }
  }
  async input_assistant_request_answer(){
    // Se sigue con el proceso
    if(this.conv.intent.query != "Comandos" && this.conv.user.params.waiting){
      // Controlar entradas de los formularios
      const inputparam = this.conv.intent.query
      // arreglamos el formato (espacios, etc)
      const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
      // se guardará cuando tenga sus datos
      this.conv.user.params.input_answer = input;
      // Solo actualiza una vez, evitar otros inputs
      if(this.conv.user.params.input_teacher && this.conv.user.params.input_question && this.conv.user.params.input_answer){
        // se envia pregunta + respuesta
        await backendTools.createBackend_Pending(this.conv.user.params.input_question, this.conv.user.params.input_answer, this.conv.user.params.name, this.conv.user.params.input_teacher)
        this.conv.user.params.waiting = false;
        this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_TeachingJunior)))
        this.conv.add(new Simple(RichContentResponses.info_operations_upload_completed(this.conv.user.params.input_question, await backendTools.getBackend_UserName(this.conv.user.params.input_teacher))));
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
        this.conv.user.params.input_teacher = null;
        this.conv.user.params.input_question = null;
        this.conv.user.params.input_answer = null;
      }
      // Faltan datos
      else{
        this.conv.user.params.waiting = false;
        this.conv.user.params.input_teacher = null;
        this.conv.user.params.input_question = null;
        this.conv.user.params.input_answer = null;
        this.conv.add(new Simple(RichContentResponses.info_basic_options));
        this.conv.add(new Table(RichContentResponses.info_basic_list_options(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))));
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hola Odiseo")))
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Dime Alguna Curiosidad")))
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Quiero Aprender")))
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Quiero Enviar Pregunta")))
        this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
      }
    }
    // Ha habido un error o se cancela
    else{
      this.conv.add(new Simple(RichContentResponses.info_basic_options));
      this.conv.add(new Table(RichContentResponses.info_basic_list_options(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))));
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hola Odiseo")))
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Dime Alguna Curiosidad")))
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Quiero Aprender")))
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Quiero Enviar Pregunta")))
      this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
    }
  }
  // No disponible en version Voz
  input_new_question(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
    this.conv.add(new Simple(RichContentResponses.error_basic_notsupported));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  } 
  // No disponible en version Voz
  input_new_question_request_question(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_new_question_request_answer(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_delete_question(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
    this.conv.add(new Simple(RichContentResponses.error_basic_notsupported));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_delete_question_confirm(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_update_question_answer(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
    this.conv.add(new Simple(RichContentResponses.error_basic_notsupported));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_update_question_answer_select(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_update_question_answer_input(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_update_question_image(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
    this.conv.add(new Simple(RichContentResponses.error_basic_notsupported));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_update_question_image_select(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_update_question_image_input(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_list_question(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
    this.conv.add(new Simple(RichContentResponses.error_basic_notsupported));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_list_question_filter(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_list_question_pending(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorNotSupported)))
    this.conv.add(new Simple(RichContentResponses.error_basic_notsupported));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_list_question_pending_select(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
  // No disponible en version Voz
  input_list_question_pending_confirm(){
    this.conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_ErrorJunior)))
    this.conv.add(new Simple(RichContentResponses.error_basic_unknown));
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
    this.conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
  }
}

// middleware for users login / response-intents
app.middleware(async (conv) => {
  // No hay sesión de usuario
  if(!conv.user.params.name){
    // Controlar entradas de los formularios
    const inputparam = conv.intent.query
    // arreglamos el formato (espacios, etc)
    const input = usersAuth.FormatHealer(inputparam, {spaces: "only"})
    // Despedida
    if(input == "Hasta Luego Odiseo" || conv.handler.name == "ConversationBasic_Exit"){
      conv.user.params.name = null;
      conv.assistant = new Assistant(conv);
    }
    // Quiere logearse
    else{
       // Formato valido
      if(input && usersAuth.validatorNames(input) && !input.includes("Odiseo")){
        conv.user.params.name = input;
        conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_PublicJunior)))
        conv.add(new Simple(RichContentResponses.info_basic_welcome(conv.user.params.name)));
        conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Comandos")))
        conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Hasta Luego Odiseo")))
      }
      // Menu login
      else{
        conv.user.params.name = null;
        conv.add(new Image(RichContentResponses.info_basic_image(referencesURI.imageURI_LoginJunior)))
        conv.add(new Simple(RichContentResponses.info_basic_login));
      }
    }
  }
  // Hay sesión de usuario
  else{
    // Controlar entradas de los formularios
    const inputparam = conv.intent.query
    // Enlaza con un intent-cuestión: se responde
    if(!conv.user.params.waiting && await backendTools.compareBackend_Question(inputparam)){
      // Simulacion de reconocimiento de palabras
      const intent = await backendTools.compareBackend_Question(inputparam);
      conv.add(new Simple(RichContentResponses.info_basic_response_header(intent.answer)));
      conv.add(new Card(RichContentResponses.info_basic_response_card(intent, RichContentResponses.info_basic_image(intent.visual))));
      conv.add(new Suggestion(RichContentResponses.info_basic_suggestion("Continuar")))
    }
    // No enlaza con ningun intent-cuestión
    else{
      conv.assistant = new Assistant(conv);
    }
  }
});

// Register handlers for Actions SDK
// input.welcome
app.handle('ConversationBasic_Welcome', conv => {
  conv.assistant?.input_welcome() 
})

// input.exit
app.handle('ConversationBasic_Exit', conv => {
  conv.assistant?.input_exit()
})

// input.unknown
app.handle('ConversationBasic_Fallback', conv => {
  conv.assistant?.input_unknown()
})

// input.options
app.handle('ConversationBasic_Options', conv => {
  conv.assistant?.input_options()
})

// input.new.question
// No disponible en version Voz
app.handle('ConversationMain_TeachingAssistant', conv => {
  conv.assistant?.input_new_question()
})

// input.new.question.request.question
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_InputQuestion', conv => {
  conv.assistant?.input_new_question_request_question()
})

// input.new.question.request.answer
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_InputAnswer', conv => {
  conv.assistant?.input_new_question_request_answer()
})

// input.delete.question
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_DeleteQuestion', conv => {
   conv.assistant?.input_delete_question()
})

// input.delete.question.confirm
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_DeleteQuestion_Confirm', conv => {
  conv.assistant?.input_delete_question_confirm()
})

// input.update.question.answer
// No disponible en version Voz
app.handle('ConversationMain_TeachingAssistant_UpdateAnswer', conv => {
  conv.assistant?.input_update_question_answer()
})

// input.update.question.answer.select
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_UpdateAnswer_SelectQuestion', conv => {
  conv.assistant?.input_update_question_answer_select()
})

// input.update.question.answer.input 
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_UpdateAnswer_InputAnswer', conv => {
  conv.assistant?.input_update_question_answer_input()
})

// input.update.question.image
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_UpdateImage', conv => {
  conv.assistant?.input_update_question_image()
})

 // input.update.question.image.select
 // No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_UpdateImage_SelectQuestion', conv => {
  conv.assistant?.input_update_question_image_select()
})

// input.update.question.image.input 
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_UpdateImage_InputImage', conv => {
 conv.assistant?.input_update_question_image_input()
})

// input.list.question
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_List', conv => {
 conv.assistant?.input_list_question()
})

// input.list.question.filter
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_List_Filter', conv => {
 conv.assistant?.input_list_question_filter()
})

// input.random.question
app.handle('ConversationOperations_TeachingAssistant_RandomQuestion', async conv => {
  await conv.assistant?.input_random_question()
})

// input.list.question.pending
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_Pending', conv => {
  conv.assistant?.input_list_question_pending()
})

// input.list.question.pending.select
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_Pending_SelectQuestion', conv => {
  conv.assistant?.input_list_question_pending_select()
})

// input.list.question.pending.confirm
// No disponible en version Voz
app.handle('ConversationOperations_TeachingAssistant_Pending_InputConfirm', conv => {
  conv.assistant?.input_list_question_pending_confirm()
})

// input.assistant.list
app.handle('AssistantOperations_LearningList', async conv => {
  await conv.assistant?.input_assistant_list()
})

// input.assistant.request
app.handle('AssistantOperations_LearningRequest', async conv => {
  await conv.assistant?.input_assistant_request()
})

// input.assistant.request.teacher
app.handle('AssistantOperations_LearningRequest_SelectTeacher', async conv => {
  await conv.assistant?.input_assistant_request_teacher()
})

// input.assistant.request.question
app.handle('AssistantOperations_LearningRequest_InputQuestion', async conv => {
  await conv.assistant?.input_assistant_request_question()
})

// input.assistant.request.answer
app.handle('AssistantOperations_LearningRequest_InputAnswer', async conv => {
  await conv.assistant?.input_assistant_request_answer()
})

module.exports = app;