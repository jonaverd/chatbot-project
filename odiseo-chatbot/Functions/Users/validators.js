// validators of input users
exports.validatorEmail = require('email-validator');
const passwordValidator = require('password-validator');
exports.validUrl = require('valid-url');
//quita caracteres especiales
const XRegExp = require('xregexp');

exports.validatorNames = function(input){
    let alphaExp = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g;
    if(input.match(alphaExp)){ return true; } 
    else{ return false; }
}

exports.validatorNumbers = function(input) {
    const interExp = new RegExp('^[0-9][0-9]*$');
    if(input.match(interExp)){ return true; } 
    else{ return false; }
}

// Create a schema
exports.schema = new passwordValidator();

// Should not have spaces
exports.schema.has().not().spaces()  
// Minimum length 6

exports.schema.is().min(6)   
// Maximum length 6 

exports.schema.is().max(6)   

// Must have at least 6 digits  
exports.schema.has().digits(6);   

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

// Calidad de formato
exports.removeAllSpaces = function(input){
    return input.replace(/\s+/g, '')
}
exports.removeOnlyInnecesarySpaces = function(input){
    return input.replace(/\s+/g, ' ').trim()
}
exports.convertLowerLetters = function(input){
    return input.toLowerCase()
}
// Elimina los diacríticos (tildes o acentos) de un texto (ES6)
exports.eliminateDiacriticals = function(input) {
    return input.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}

exports.FormatHealer = function(input, {spaces = null, char = null, symbols = null, diacritical=null}){
    var custom = input;
    if(spaces == "all"){
       custom = exports.removeAllSpaces(custom) 
    }
    if(spaces == "only"){
      custom = exports.removeOnlyInnecesarySpaces(custom) 
    }
    if(char == "lower"){
       custom = exports.convertLowerLetters(custom) 
    }
    if(symbols == "clean"){
        var search = XRegExp('([^?<first>\\pL ]+)');
        custom = XRegExp.replace(custom, search, '',"all");
    }
    if(diacritical == "normal"){
        custom = exports.eliminateDiacriticals(custom)
    }
    return custom;
}

// Validar URL Imagenes
exports.isImgLink = function(url){
    if (typeof url !== 'string') {
      return false;
    }
    return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) !== null);
}