const mongoose  = require("mongoose");

let calenderschema = new mongoose.Schema({
    dayType:{
        type:String,
    },
    date:{
        type:String
    },
})

module.exports = mongoose.model("Calender",calenderschema);

