const rideModel = require("../models/ride.model")
const{ subscribeToQueue, publishToQueue } = require('../service/rabbit')
module.exports.createRide = async(req,res,next) => {

    // Now for creating a ride as per credentials mentioned in the ride model we user, pickup, destination
    // Now User We Can get through our MiddleWare
    // Pickup And Destination we Can find Through the client side that means body 

    const {pickup, destination} = req.body;
    
    const newRide = new rideModel({
        user: req.user._id,
        pickup,
        destination
    })

    publishToQueue("new-ride",JSON.stringify(newRide))
    res.send(newRide);

    await newRide.save();

}