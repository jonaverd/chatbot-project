require('../Connection/connection.js');

// using the model 
const LearningCollections = require('../Models/LearningCollections.js');

exports.createVoidQuestion = async function (userQuestion){

    try {
        
        // creating a new document base on the model
        const learningCollections = new LearningCollections({
            question: userQuestion,
        });

        // saving the created document
        const collectionSaved =  await learningCollections.save();

        console.log(collectionSaved)
        return collectionSaved;

    } catch (err) {
        console.log(err);
    }
}

exports.updateAnswer = async function (userQuestion, userAnswer){

    try {
    
        // update fields
        const question =  await LearningCollections.findOneAndUpdate({question: userQuestion}, {
            answer: userAnswer
        }, {new: true});

        console.log(question);
        return question;

    } catch (err) {
        console.log(err);
    }
}


exports.getQuestionsList = async function (){

    try {
        // search all questions
        const list =  await LearningCollections.find();

        console.log(list);
        return list;

    } catch (err) {
        console.log(err);
    }
}


exports.getQuestionData = async function (userQuestion){

    try {
   
        // query data
        const question =  await LearningCollections.findOne({question: userQuestion});

        console.log(question);
        return question;

    } catch (err) {
        console.log(err);
    }
}


exports.checkQuestionExists = async function (userQuestion){

    try {
   
        // query function
        const check =  await LearningCollections.exists({question: userQuestion});
        
        console.log(check);
        return check;

    } catch (err) {
        console.log(err);
    }
}


exports.deleteQuestion = async function (userQuestion){

    try {
   
        // query function
        const result =  await LearningCollections.findOneAndDelete({question: userQuestion});
        
        console.log(result);
        return result;

    } catch (err) {
        console.log(err);
    }
}