Clear-Host

Read-Host -Prompt "authenticating private keys..."

# Abre el terminal SDK para la autenticacion de Cloud
# Aplica las credenciales (cuenta de servicio)
# Verifica el entorno de autenticacion en Google Cloud
Invoke-Expression 'cmd /c start powershell -Command { 
    & "C:\Users\JVPC\AppData\Local\Google\Cloud SDK\cloud_env.bat";
    cd "D:\Cosas Personales\Trabajo Final\Proyecto\chatbot-project\Agent";
    $env:GOOGLE_APPLICATION_CREDENTIALS="Functions\Authentication\odiseo-chatbot-5749349920e9.json"
    gcloud auth application-default print-access-token ; 
    Read-Host -Prompt "credentials gcloud verify..."
}'

Exit
