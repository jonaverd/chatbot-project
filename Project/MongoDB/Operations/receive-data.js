// Libreria Mongoose
const mongoose = require("mongoose")

// Modelos DB importados
const ExampleCollection = require('../Models/ExampleCollections.js');

exports.receive = function(){

    // Conectamos mediante Mongoose (es lo mismo que con MongoDB)
    mongoose.connect("mongodb+srv://jonaverd:q78h7zo4zkHYpQp@dialogflowcluster.oujgv.mongodb.net/OdiseoDB?retryWrites=true&w=majority");

    // Creamos una nueva instancia del modelo, para introducir datos a la bd
    async function getData(){

        // Funcion que consulta datos en el modelo (tambien en la bd fisica porque el modelo ya estaba vinculado)
        let res = await ExampleCollection.findOne({firstText:"me buscabas"});
        console.log("Se han consultado datos en la BD: ", res);
    }

    getData();
};