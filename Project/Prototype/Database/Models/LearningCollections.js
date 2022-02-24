const { Schema, model } = require('mongoose');

// https://mongoosejs.com/docs/schematypes.html
const LearningCollectionSchema = new Schema(
    {
        question: {
            type: String,
            default: "nothing"
        },
        answer: {
            type: String,
            default: "nothing"
        },
        user: {
            type: String,
            default: "system"
        }
    },
    {timestamps: true}
);

module.exports = model('LearningCollections', LearningCollectionSchema);