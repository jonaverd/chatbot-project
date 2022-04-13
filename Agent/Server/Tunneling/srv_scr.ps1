Clear-Host

Read-Host -Prompt "tunneling server ngrok..."

# Conecta con el servidor publico nGrok (Tunneling de localhost)
# Invoke-Expression 'cmd /c start powershell -Command { 
#    & "Server\Tunneling\ngrok.exe" http 8080 ; 
#    Read-Host -Prompt "public host opened..." 
# }'

# Mismo terminal
Invoke-Expression '& "Server\Tunneling\ngrok.exe" http 8080'

Exit