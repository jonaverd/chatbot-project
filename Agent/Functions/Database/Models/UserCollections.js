const { Schema, model } = require('mongoose');

// https://mongoosejs.com/docs/schematypes.html
const UserCollectionSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            default: null
        },
        lastname: {
            type: String,
            default: null
        },
        age: {
            type: Number,
            default: null
        },
        password: {
            type: String, 
            default: null
        }
    },
    {timestamps: true}
);

module.exports = model('UserCollections', UserCollectionSchema);