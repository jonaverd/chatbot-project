Clear-Host

Read-Host -Prompt "tunneling server ngrok..."

# Conecta con el servidor publico nGrok (Tunneling de localhost)
Invoke-Expression 'cmd /c start powershell -Command { 
    & "D:\Cosas Personales\Trabajo Final\Proyecto\chatbot-project\Project\Scripts\Executables\ngrok.exe" http 8080 ; 
    Read-Host -Prompt "public host opened..." 
}'

Exit