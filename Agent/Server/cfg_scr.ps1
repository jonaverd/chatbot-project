Clear-Host

Read-Host -Prompt "configuring local environment..."

# Configura el entorno de un servidor localhost)
$env:IS_LOCAL_DEV="true"

Read-Host -Prompt "configuring credentials..."

# Configura las credenciales de Google Cloud
$env:GOOGLE_APPLICATION_CREDENTIALS="Functions\Authentication\odiseo-chatbot-5749349920e9.json"

npm run start

Exit