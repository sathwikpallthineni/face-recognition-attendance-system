const mongoose  = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const { type } = require("os");
let Attendence = require("./attendence");


let studentschema  = new mongoose.Schema({
    username:{
        type:String
    },
    status:{
        type:String,
    },
    email:{
        type:String
    },
    role:{
        type:String
    },
    branch:{
        type:String
    },
    section:{
        type:String
    },
    attendence:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Attendence"
    },
    ],
    face_encoding:[Number],
    refresh_token:{
        type:String
    },
    
})

studentschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student",studentschema);