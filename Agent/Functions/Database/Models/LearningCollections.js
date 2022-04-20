const { Schema, model } = require('mongoose');

// https://mongoosejs.com/docs/schematypes.html
const LearningCollectionSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            default: "null"
        },
        image: {
            type: String,
            default: "null"
        },
        user: {
            type: String,
            required: true,
            unique: true
        }
    },
    {timestamps: true}
);

module.exports = model('LearningCollections', LearningCollectionSchema);