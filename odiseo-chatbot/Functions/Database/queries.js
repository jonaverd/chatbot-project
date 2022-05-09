require('./connection.js');

// using the model 
const LearningCollections = require('./Models/LearningCollections.js');
const PendingCollections = require('./Models/PendingCollections.js');
const UserCollections = require('./Models/UserCollections.js');
const referencesURI = require('../Assets/references.js');
// Arreglos del formato
const usersAuth = require('../Users/validators.js');

exports.createUser = async function (inputemail){

    try {

        // creating a new document base on the model
        const userCollections = new UserCollections({
            email: inputemail,
        });

        // saving the created document
        const collectionSaved =  await userCollections.save();

        console.log(collectionSaved)
        return collectionSaved;

    } catch (err) {
        console.log(err);
    }
}

exports.getUserData = async function (inputemail){

    try {
   
        // query data
        const data =  await UserCollections.findOne({email: inputemail});

        console.log(data);
        return data;

    } catch (err) {
        console.log(err);
    }
}

exports.getUserName = async function (inputemail){

    try {
   
        // query data
        const data =  await UserCollections.findOne({email: inputemail}).select('name');

        console.log(data);
        return data.name;

    } catch (err) {
        console.log(err);
    }
}

exports.getUserAge = async function (inputemail){

    try {
   
        // query data
        const data =  await UserCollections.findOne({email: inputemail}).select('age');

        console.log(data);
        return data.age;

    } catch (err) {
        console.log(err);
    }
}

exports.getUserPassword = async function (inputemail){

    try {
   
        // query data
        const data =  await UserCollections.findOne({email: inputemail}).select('password');

        console.log(data);
        return data.password;

    } catch (err) {
        console.log(err);
    }
}

exports.updateUserName = async function (inputname, inputemail){

    try {
    
        // update fields
        const data =  await UserCollections.findOneAndUpdate({email: inputemail}, {
            name: inputname
        }, {new: true});

        console.log(data);
        return data;

    } catch (err) {
        console.log(err);
    }
}

exports.updateUserAge = async function (inputage, inputemail){

    try {
    
        // update fields
        const data =  await UserCollections.findOneAndUpdate({email: inputemail}, {
            age: inputage
        }, {new: true});

        console.log(data);
        return data;

    } catch (err) {
        console.log(err);
    }
}

exports.updateUserPassword = async function (inputpassword, inputemail){

    try {
    
        // update fields
        const data =  await UserCollections.findOneAndUpdate({email: inputemail}, {
            password: inputpassword
        }, {new: true});

        console.log(data);
        return data;

    } catch (err) {
        console.log(err);
    }
}

exports.checkQuestionExists = async function (inputquestion){

    try {
   
        // search all questions
        const list =  await LearningCollections.find().select('question');

        if(list.length===0){
            return false
        }
        else{
            // original
            const input = usersAuth.FormatHealer(inputquestion, {spaces: "all", char: "lower", symbols: "clean", diacritical: "normal"})
            var result = null;

            list.forEach(element => { 
                // encontrada
                const fixed = usersAuth.FormatHealer(element.question, {spaces: "all", char: "lower", symbols: "clean", diacritical: "normal"})
                // coinciden
                if(fixed === input){
                result = element;
                }
            });
            if(!result){ return false; }
            else{ return true; }
        }

    } catch (err) {
        console.log(err);
    }
}

exports.checkQuestionExistsUser = async function (inputquestion, inputuser){

    try {
   
        // query function
        const check =  await LearningCollections.find({question: inputquestion, user: inputuser});
        
        console.log(check);
        if(check.length === 0){ return false; }
        else{ return true; }

    } catch (err) {
        console.log(err);
    }
}

exports.createVoidQuestion = async function (inputquestion, inputuser){

    try {

        // creating a new document base on the model
        const learningCollections = new LearningCollections({
            question: inputquestion,
            user: inputuser,
            visual: referencesURI.imageURI_Public
        });

        // saving the created document
        const collectionSaved =  await learningCollections.save();

        console.log(collectionSaved)
        return collectionSaved;

    } catch (err) {
        console.log(err);
    }
}

exports.updateAnswer = async function (inputquestion, inputanswer, inputuser){

    try {
        
        // update fields
        const question =  await LearningCollections.findOneAndUpdate({question: inputquestion, user: inputuser}, {
            answer: inputanswer
        }, {new: true});
        console.log(question);
        return question;

    } catch (err) {
        console.log(err);
    }
}

exports.getQuestionsList = async function (inputuser){

    try {
        // search all questions
        const list =  await LearningCollections.find({user: inputuser}).select('question').select('answer').select('visual').select('user');

        console.log(list);
        return list;

    } catch (err) {
        console.log(err);
    }
}

exports.deleteQuestion = async function (inputquestion, inputuser){

    try {
   
        // query function
        const result =  await LearningCollections.findOneAndDelete({question: inputquestion, user: inputuser});
        
        console.log(result);
        return result;

    } catch (err) {
        console.log(err);
    }
}

exports.updateImage = async function (inputquestion, inputimage, inputuser){

    try {
        
        // update fields
        const question =  await LearningCollections.findOneAndUpdate({question: inputquestion, user: inputuser}, {
            visual: inputimage
        }, {new: true});
        console.log(question);
        return question;

    } catch (err) {
        console.log(err);
    }
}

exports.getQuestion = async function (inputquestion){

    try {
   
        // query data
        const data =  await LearningCollections.findOne({question: inputquestion}).select('question').select('answer').select('visual').select('user');

        console.log(data);
        return data;

    } catch (err) {
        console.log(err);
    }
}

exports.getQuestionsListAll = async function (){

    try {
        // search all questions
        const list =  await LearningCollections.find().select('question').select('answer').select('visual').select('user');

        console.log(list);
        return list;

    } catch (err) {
        console.log(err);
    }
}

exports.createPendingQuestion = async function (inputquestion, inputanswer, inputuser, inputteacher){

    try {

        // creating a new document base on the model
        const pendingCollections = new PendingCollections({
            question: inputquestion,
            answer: inputanswer,
            user: inputuser,
            teacher: inputteacher
        });

        // saving the created document
        const collectionSaved =  await pendingCollections.save();

        console.log(collectionSaved)
        return collectionSaved;

    } catch (err) {
        console.log(err);
    }
}

exports.getPendingList = async function (inputuser){

    try {
        // search all questions
        const list =  await PendingCollections.find({teacher: inputuser}).select('question').select('answer').select('user').select('teacher');

        console.log(list);
        return list;

    } catch (err) {
        console.log(err);
    }
}

exports.checkPendingExistsUser = async function (inputquestion, inputteacher){

    try {
   
        // query function
        const check =  await PendingCollections.find({question: inputquestion, teacher: inputteacher});
        
        console.log(check);
        if(check.length === 0){ return false; }
        else{ return true; }

    } catch (err) {
        console.log(err);
    }
}

exports.getPendingQuestion = async function (inputquestion, inputteacher){

    try {
   
        // query data
        const data =  await PendingCollections.findOne({question: inputquestion, teacher: inputteacher}).select('question').select('answer').select('user').select('teacher');

        console.log(data);
        return data;

    } catch (err) {
        console.log(err);
    }
}

exports.deletePending = async function (inputquestion, inputteacher){

    try {
   
        // query function
        const result =  await PendingCollections.findOneAndDelete({question: inputquestion, teacher: inputteacher});
        
        console.log(result);
        return result;

    } catch (err) {
        console.log(err);
    }
}

exports.getUsersListAll = async function (){

    try {
        // search all questions
        const list =  await UserCollections.find().select('email').select('name');

        console.log(list);
        return list;

    } catch (err) {
        console.log(err);
    }
}



