// validators of input users
exports.validatorEmail = require('email-validator');
const passwordValidator = require('password-validator');

exports.validatorNames = function(input){
    var alphaExp = '^(?!.*  )[a-zA-Z ]*$';
    if(input.match(alphaExp)){ return true; } 
    else{ return false; }
}
exports.validatorNumbers = function(input) {
    const intExp = new RegExp('^[0-9][0-9]*$');
    if(intExp.test(input)){ return true; } 
    else{ return false; }
}

// Create a schema
exports.schema = new passwordValidator();
// Should not have spaces
exports.schema.has().not().spaces()  
  
// cifrado
const bcrypt = require('bcrypt')
exports.gethashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    console.log(hash)
    if(hash!=null) { return hash };
}
exports.comparehashPassword = async function(password, saved) { 
    const isSame = await bcrypt.compare(password, saved) // updated
    console.log(isSame, password, saved) // updated
    if(isSame!=null) { return isSame };
}

