jest.setTimeout(10000);

// Archivo importado
const apitools = require('../Prototype/webhook-api-tools.js');

// Intent de pruebas
const id = "2874fb33-e4c7-4ed9-acdb-cdcaf7d17ad7";
const path = "projects/odiseo-chatbot/agent/intents/2874fb33-e4c7-4ed9-acdb-cdcaf7d17ad7";
const display = "TEST_TEST";
const anotherdisplay = "TEST_ANOTHER";
const createdisplay = "TEST_CREATE";
const deletedisplay = "TEST_DELETE";
const updatedisplay = "TEST_UPDATE";
const updatechangedisplay = "TEST_CHANGEUPDATE";
const structureResult = [
  {
    inputContextNames: [],
    events: [],
    trainingPhrases: [],
    outputContexts: [],
    parameters: [
      {
        "defaultValue": "",
        "displayName": "age",
        "entityTypeDisplayName": "@sys.age",
        "isList": false,
        "mandatory": true,
        "name": "808340e3-a4d7-4c8e-a3f2-79ccc0441151",
        "prompts":[
          "example",
        ],
        "value": "$age",
      },
    ],
    messages: [
      {
        "message": "text",
        "platform": "PLATFORM_UNSPECIFIED",
        "text": {
          "text": [
            "response1",
            "response2",
            "response3",
          ],
        },
      },
    ],
    defaultResponsePlatforms: [],
    followupIntentInfo: [],
    name: 'projects/odiseo-chatbot/agent/intents/2874fb33-e4c7-4ed9-acdb-cdcaf7d17ad7',
    displayName: 'TEST_TEST',
    priority: 500000,
    isFallback: false,
    webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
    action: '',
    resetContexts: false,
    rootFollowupIntentName: '',
    parentFollowupIntentName: '',
    mlDisabled: false,
    liveAgentHandoff: false,
    endInteraction: false
  },
  null,
  null
];

// Tests de prueba
test('[ApiTools] Devolver la ID de un Intent recibiendo su ProjectPath',async  () => {
    expect(await apitools.getIdIntentfromPath(path)).toEqual(id);
});
test('[ApiTools] Devolver la ID de un Intent recibiendo su DisplayName', async () => {
    expect(await apitools.getIdIntentfromName(display)).toEqual(id);
});
test('[ApiTools] Comprobar si existe un intent duplicado recibiendo su DisplayName', async () => {
    expect(await apitools.checkIntentExistsfromName(display)).toBeTruthy();
    expect(await apitools.checkIntentExistsfromName(anotherdisplay)).toBeFalsy();
});
test('[ApiTools] Crear un intent recibiendo su DisplayName', async () => {
    expect(await apitools.checkIntentExistsfromName(createdisplay)).toBeFalsy();
    await apitools.createIntentfromName(createdisplay);
    expect(await apitools.checkIntentExistsfromName(createdisplay)).toBeTruthy();
});
test('[ApiTools] Borrar un intent recibiendo su DisplayName', async () => {
    expect(await apitools.checkIntentExistsfromName(deletedisplay)).toBeTruthy();
    await apitools.deleteIntentfromName(deletedisplay);
    expect(await apitools.checkIntentExistsfromName(deletedisplay)).toBeFalsy();
});
test('[ApiTools] Devolver la estructura completa de un intent recibiendo su DisplayName', async () => {
  expect(await apitools.getIntentStructure(display)).toEqual(structureResult);
});
test('[ApiTools] Modificar un intent recibiendo sus Additionals y su DisplayName', async () => {
    expect(await apitools.checkIntentExistsfromName(updatedisplay)).toBeTruthy();
    expect(await apitools.checkIntentExistsfromName(updatechangedisplay)).toBeFalsy();
    var additionals = await apitools.getIntentStructure(updatedisplay);
    additionals[0].displayName = updatechangedisplay;
    await apitools.updateIntentfromInfo(additionals, updatedisplay);
    expect(await apitools.checkIntentExistsfromName(updatedisplay)).toBeFalsy();
    expect(await apitools.checkIntentExistsfromName(updatechangedisplay)).toBeTruthy();
});
test('[ApiTools] Modificar el valor de EndConversation de un intent recibiendo su DisplayName', async () => {
  const firstvalue = await apitools.getIntentStructure(display);
  expect(firstvalue[0].endInteraction).toBeFalsy();
  await apitools.setEndConversationIntent(display, true);
  const secondvalue = await apitools.getIntentStructure(display);
  expect(secondvalue[0].endInteraction).toBeTruthy();
});

// Post-Preparacion de Intents de Prueba
afterAll( async () => {
    await apitools.deleteIntentfromName(createdisplay);
    await apitools.createIntentfromName(deletedisplay);
    var additionals = await apitools.getIntentStructure(updatechangedisplay);
    additionals[0].displayName = updatedisplay;
    await apitools.updateIntentfromInfo(additionals, updatechangedisplay);
    await apitools.setEndConversationIntent(display, false);
});
