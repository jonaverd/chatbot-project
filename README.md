# Odiseo Chatbot
Trabajo final de grado para la Escuela Politécnica Superior de la Universidad de Alicante. 

Agente Odiseo es un asistente interactivo para alumnos y profesores. Su inteligencia artificial permite almacenar cuestiones con un reconocimiento de palabras para responderlas de manera automática.

Como profesor gestiona tus propias cuestiones y ayuda a Odiseo aprender con su base de conocimientos. Como alumno, pide ayuda a Odiseo para que te ayude a responder cualquier cuestión almacenada.

## Herramientas necesarias
Por primera vez al arrancar el proyecto es posible necesitar
|Nombre|Acceso|Referencia|Ejecutable|Descripción|
|------|------|----------|----------|-----------|
|NGrok Server|Local|[Descargar](https://ngrok.com/download "https://ngrok.com/download")|**Sí**|Tunneling de acceso público SSH|
|GitHub Desktop|Local|[Descargar](https://desktop.github.com/ "https://desktop.github.com/")|**Sí**|Control de versiones|
|GitHub Web|Online|[Acceder](https://github.com/jonaverd/chatbot-project "https://github.com/jonaverd/chatbot-project")|No|Control de versiones|
|Google Cloud SDK|Local|[Descargar](https://cloud.google.com/sdk/docs/quickstart "https://cloud.google.com/sdk/docs/quickstart")|**Sí**|Gestionar credenciales de Google Cloud|
|MongoDB Atlas|Online|[Acceder](https://cloud.mongodb.com/v2/61b772821206554caad366c7#clusters "https://cloud.mongodb.com/v2/61b772821206554caad366c7#clusters")|No|Administrador de bases de datos|
|DialogFlow Google|Online|[Acceder](https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents "https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents")|No|Interfaz del agente conversacional|
|Google Actions Assistant|Online|[Acceder](https://console.actions.google.com/project/odiseo-voicebot-75d44/simulator "https://console.actions.google.com/project/odiseo-voicebot-75d44/simulator")|No|Asistente de voz compatible con DialogFlow|
|Heroku Hosting|Online|[Acceder](https://dashboard.heroku.com/apps "https://dashboard.heroku.com/apps")|No|Servidor de hosting público para NodeJS|
|ImagBB Cloud|Online|[Acceder](https://jonathan-verdu.imgbb.com/ "https://jonathan-verdu.imgbb.com/")|No|Servidor de hosting para imágenes|

## Configurar dependencias
La primera vez, el proyecto necesitará instalar sus dependencias y crear la carpeta *node_modules*
````
npm cache clean --force
````
````
npm install
````

## Arrancar servidor local
Si se necesita un servidor local, utilizamos el servidor ngrok con el puerto 8080. Los archivos necesarios se encuentran en la carpeta "localhost"
````
./ngrok.exe http 8080
````
IP de acceso
````
https://<ip>.ngrok.io/
````
Enlace de acceso al chat
````
https://<ip>.ngrok.io/agent/dialogflow
````

## Iniciar proyecto
Se iniciará el comando node start
````
npm start
````

## Acceso a la red pública
Enlace del chat web Odiseo (panel administrativo para profesores)
````
https://odiseo-chatbot.herokuapp.com/
````
Comando para iniciar el Asistente de voz Odiseo en Google (panel de aprendizaje para alumnos)
````
"Hablar con Profesor Odiseo"
````
````
https://assistant.google.com/services/a/uid/000000ea15df3d39?hl=es
````


## Visualizar resultados
Para comprobar o visualizar los resultados
- A través del terminal PowerShell/CMD de Visual Code Studio
- A través de la interfaz de DialogFlow
[dialogflow.cloud.google.com](https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents "https://dialogflow.cloud.google.com/#/agent/odiseo-chatbot/intents")
- A través del test de Google Assistant
[console.actions.google.com](https://console.actions.google.com/project/odiseo-voicebot-75d44/simulator?pli=1 "https://console.actions.google.com/project/odiseo-voicebot-75d44/simulator?pli=1")
- A través del propio HTML creado en el servidor express (index.js) (routes.js)
