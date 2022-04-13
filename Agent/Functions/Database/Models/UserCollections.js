const { Schema, model } = require('mongoose');

// https://mongoosejs.com/docs/schematypes.html
const UserCollectionSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        }
    },
    {timestamps: true}
);

module.exports = model('UserCollections', UserCollectionSchema);