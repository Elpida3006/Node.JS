const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: false,
        maxlength: 50
    },
    imageUrl: {
        type: String,
        required: true,
        unique: false
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    //do tuk sa ot formata
    createdAt: {
        type: String,
        required: true,
    },

    creatorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    //tezi slagame pri create
    userBookedEnrolled: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    //tova go push-vame v modela 
    //s updateOne - s otdelna funkciq enroll
});


module.exports = mongoose.model('Course', courseSchema)