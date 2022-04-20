require('./connection.js');

// using the model 
const LearningCollections = require('./Models/LearningCollections.js');
const UserCollections = require('./Models/UserCollections.js');

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

exports.getUserLastName = async function (inputemail){

    try {
   
        // query data
        const data =  await UserCollections.findOne({email: inputemail}).select('lastname');

        console.log(data);
        return data.lastname;

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

exports.updateUserLastName = async function (inputlastname, inputemail){

    try {
    
        // update fields
        const data =  await UserCollections.findOneAndUpdate({email: inputemail}, {
            lastname: inputlastname
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

exports.checkQuestionExists = async function (inputquestion, inputuser){

    try {
   
        // query function
        const [check] =  await LearningCollections.find({question: inputquestion, user: inputuser});
        
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
            user: inputuser
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

exports.updatePhoto = async function (userQuestion, userPhoto){

    try {
    
        // update fields
        const question =  await LearningCollections.findOneAndUpdate({question: userQuestion}, {
            image: userPhoto
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
        const list =  await LearningCollections.find().sort({question:1});

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