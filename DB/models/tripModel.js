const mongoose = require('mongoose');


const tripSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    create_date: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Trip',tripSchema);