const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    price: {
        type : Number,
        required : true
    },
    num_hours: {
        type : Number,
        required : true
    },
    description:{
        type: String,
    }

});

module.exports = mongoose.model('course', courseSchema);