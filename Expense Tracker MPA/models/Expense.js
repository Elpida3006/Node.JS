const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    merchant: {
        type: String,
        required: true,
        minlength: [4, 'must be least 4'],

    },
    total: {
        type: Number,
        required: true,
        validate: [/^[0-9]+$/, 'The total should be positive number'],

    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: [3, 'must be least 3'],
        maxlength: [30, 'must be max 30'],
    },
    // //do tuk sa ot formata
    report: {
        type: Boolean,
        default: false
    },

    ownerCreatorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },


});


module.exports = mongoose.model('Expense', expenseSchema)