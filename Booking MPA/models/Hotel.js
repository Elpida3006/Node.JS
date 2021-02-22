const mongoose = require('mongoose');


const hotelSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        unique: false
    },
    imageUrl: {
        type: String,
        required: true,
        unique: false
    },
    freeRooms: {
        type: Number,
        required: true,
        unique: false,
        minlength: 1,
        maxlength: 100

    },
    userBookedHotels: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    ownerCreatorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Hotel', hotelSchema)