// Mongoose is an Object Document Mapper (ODM). 
//This means that Mongoose allows you to define objects with a strongly-typed 
//schema that is mapped to a MongoDB document.
const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/* Example Schema
const BlogPost = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date
});
*/

// MongoDB genera automaticamente los id's y timestamps
const ExampleCollectionSchema = new Schema(
    {
        firstText: String,
        secondText: String,
    },
    {timestamps:true}
);

//¡IMPORTANTE! El nombre del archivo debe ser igual al nombre de la coleccion en la web de MongoDB
//¡IMPORTANTE! al insertar datos, en la web aparece otra coleccion en minusculas
//¡IMPORTANTE! el modelo se puede escribir en singular
// Esta funcion vincula el modelo con la coleccion real
module.exports = mongoose.model('ExampleCollections', ExampleCollectionSchema);