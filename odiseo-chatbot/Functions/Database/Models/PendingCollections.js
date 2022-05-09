const { Schema, model } = require('mongoose');

// https://mongoosejs.com/docs/schematypes.html
const PendingCollectionSchema = new Schema(
    {
        question: {
            type: String,
            default: null
        },
        answer: {
            type: String,
            default: null
        },
        user: {
            type: String,
            default: null
        },
        teacher: {
            type: String,
            default: null
        },
    },
    {timestamps: true}
);

module.exports = model('PendingCollections', PendingCollectionSchema);