const Trip = require('../../DB/models/tripModel');
const mongoose = require('mongoose');



exports.post_createTrip = (req,res,next) => {
    const trip = Trip({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    });

    trip.save().then(() => {
        res.status(200).json({
            status: "Success",


        })
    })
}