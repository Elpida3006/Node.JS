const mongoose = require('mongoose');


const articleSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    description: {
        type: String,
        required: true,
        unique: false,
        minlength: 20
    },

    creationData: {
        type: Date,
        required: true,


    },
    ownerCreatorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Article', articleSchema)