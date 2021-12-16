# Odiseo Chatbot
TFG Project Google DialogFlow

## Herramientas necesarias
Por primera vez al arrancar el proyecto es posible necesitar
|Nombre|Acceso|Referencia|Ejecutable|Descripción|
|------|------|----------|----------|-----------|
|NGrok Server|Local|[Descargar](https://ngrok.com/download "https://ngrok.com/download")|**Sí**|Tunneling de acceso público SSH|
|GitHub Desktop|Local|[Descargar](https://desktop.github.com/ "https://desktop.github.com/")|**Sí**|Control de versiones|
|GitHub Web|Online|[Acceder](https://github.com/jonaverd/chatbot-project "https://github.com/jonaverd/chatbot-project")|No|Control de versiones|
|Google Cloud SDK|Local|[Descargar](https://cloud.google.com/sdk/docs/quickstart "https://cloud.google.com/sdk/docs/quickstart")|**Sí**|Gestionar credenciales de Google Cloud|
|MongoDB Atlas|Online|[Acceder](https://cloud.mongodb.com/v2/61b772821206554caad366c7#clusters "https://cloud.mongodb.com/v2/61b772821206554caad366c7#clusters")|No|Administrador de bases de datos|
|DialogFlow|Online|[Acceder](https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents "https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents")|No|Interfaz del agente conversacional|

## Primera vez
Si se necesita instalar las dependencias y crear la carpeta *node_modules*
````
npm cache clean --force
````
````
npm install
````

## Instalar credenciales
Siempre que se ejecute el proyecto
````
$env:GOOGLE_APPLICATION_CREDENTIALS="D:\Cosas Personales\Trabajo Final\Proyecto\chatbot-project\Project\Scripts\Credentials\odiseo-chatbot-5749349920e9.json"
````
## Pasar los Tests
¡IMPORTANTE! antes de iniciar el proyecto debemos comprobar que las funciones responden correctamente
````
npm test
````

## Iniciar proyecto
Se iniciará terminal de credenciales, nGrok y node start
````
npm start
````

## Visualizar resultados
Para comprobar o visualizar los resultados
- A través del terminal PowerShell/CMD de Visual Code Studio
- A través de la interfaz de DialogFlow
[dialogflow.cloud.google.com](https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents "https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents")
- A través del propio HTML creado en el servidor express (server.js)
````
localhost:8080
````
````
https://<ip>.ngrok.io/server
````
**Ejemplo que nos daría la consola de nGrok**
````
https://079e-84-123-67-85.ngrok.io/server
````
