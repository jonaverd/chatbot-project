// Libreria Mongoose
const mongoose = require("mongoose")

// Modelos DB importados
const LearningCollection = require('./LearningCollections.js');

exports.insert = function(data){

    // Conectamos mediante Mongoose (es lo mismo que con MongoDB)
    mongoose.connect("mongodb+srv://jonaverd:q78h7zo4zkHYpQp@dialogflowcluster.oujgv.mongodb.net/OdiseoDB?retryWrites=true&w=majority");

    // Creamos una nueva instancia del modelo, para introducir datos a la bd
    function saveData(){
        let learningCollection = new LearningCollection({
            question: data,
            answer: "respuesta"
        });

        // Funcion que guarda datos en el modelo (se guardara tambien en la bd fisica porque el modelo ya estaba vinculado)
        learningCollection.save((err, res) => {
            if(err) return console.log("Error: No se ha podido realizar la operacion Insert... " + err);
            console.log("Se han insertado datos en la BD: ", res);
        });
    }

    saveData(data);
};