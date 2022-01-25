// Mongoose is an Object Document Mapper (ODM). 
//This means that Mongoose allows you to define objects with a strongly-typed 
//schema that is mapped to a MongoDB document.
const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// MongoDB genera automaticamente los id's y timestamps
const LearningCollectionSchema = new Schema(
    {
        id: ObjectId,
        question: String,
        answer: String,
    },
    {timestamps:true}
);

module.exports = mongoose.model('LearningCollections', LearningCollectionSchema);