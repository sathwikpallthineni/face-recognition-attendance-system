const mongoose  = require("mongoose");


let attendenceschema = new mongoose.Schema({
    studentid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    name:{
        type:String
    },
    status:{
        type:String
    },
    date:{
        type:String
    },
    time:{
        type:String
    }

})

module.exports = mongoose.model("Attendence",attendenceschema);