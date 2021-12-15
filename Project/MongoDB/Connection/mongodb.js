exports.testConnection = function () {

    // Requiere libreria de MongoDB
    const { MongoClient } = require('mongodb');

    // Cadena de conexion para autentificarse
    const uri = "mongodb+srv://jonaverd:q78h7zo4zkHYpQp@dialogflowcluster.oujgv.mongodb.net/OdiseoDB?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Metodo para conectar
     client.connect(err => {
        if(err) {
            return console.log("Error al conectar con MongoDB... " + err)
        }
        else{
            console.log("Base de datos conectada... ")

            const collection = client.db("OdiseoDB").collection("ExampleCollection");
            // perform actions on the collection object
            client.close();
        }
    });
}