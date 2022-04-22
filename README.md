# Odiseo Chatbot
Trabajo final de grado para la Escuela Politécnica Superior de la Universidad de Alicante. 

Odiseo Chatbot es agente inteligente que puede gestionar cuestiones educativas. Dispone de un interfaz sencillo que acompaña sus interacciones. Además, los usuarios pueden autoconfigurarlo de manera personal, gracias a su tecnología de autoaprendizaje.

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
|Google Actions Assistant|Online|[Acceder](https://console.actions.google.com/project/odiseo-voice-80c95/simulator "https://console.actions.google.com/project/odiseo-voice-80c95/simulator")|No|Asistente de voz compatible con DialogFlow|

## Configurar dependencias
La primera vez, el proyecto necesitará instalar sus dependencias y crear la carpeta *node_modules*
````
npm cache clean --force
````
````
npm install
````

## Instalar credenciales
- Para ejecutar correctamente las funciones de Google Cloud API
````
$env:GOOGLE_APPLICATION_CREDENTIALS="Functions\Authentication\odiseo-chatbot-5749349920e9.json"
````
- Alternativa
````
powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./Functions/Authentication/ath_scr.ps1
````
- Comando de atajo 
````
npm run credentials
````

## Arrancar servidor local
- Para configurar entorno
````
$env:IS_LOCAL_DEV="true"
````
- Para iniciar el puerto de escucha
````
nodemon ./Server/index.js
````
- Comando de atajo
````
npm run start
````

## Red de acceso público
- Para conseguir una IP Pública
````
Server\Tunneling\ngrok.exe http 8080'
````
- Alternativa
````
powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./Server/Tunneling/srv_scr.ps1
````
- Comando de atajo
````
npm run tunneling
````

## Iniciar proyecto
Se iniciarán las credenciales, tunneling de ngrok (nuevo terminal) y node start
````
npm run server
````
````
npm run tunneling
````

## Visualizar resultados
Para comprobar o visualizar los resultados
- A través del terminal PowerShell/CMD de Visual Code Studio
- A través de la interfaz de DialogFlow
[dialogflow.cloud.google.com](https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents "https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents")
- A través del propio HTML creado en el servidor express (index.js) (routes.js)

## IP del servidor
````
https://<ip>.ngrok.io/server
````
**Ejemplo que nos daría la consola de ngrok**
````
https://e26f-84-123-67-85.ngrok.io
````

## Rutas del HTML
- Gestión de intents (y sus operaciones)
````
https://<ip>.ngrok.io/render/list
````
- Peticiones POST de DialogFlow
````
https://<ip>.ngrok.io/agent/dialogflow
````
- Peticiones POST de Google Actions Assitant
````
https://<ip>.ngrok.io/agent/actions
````

