require('dotenv').config() 
const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const engine =  require("ejs-mate");
const passportLocalMongoose = require('passport-local-mongoose');
let jwt = require('jsonwebtoken');
const Student = require("./models/student");
let Attendence = require("./models/attendence");
const sessions = require("express-session");
const flash = require("connect-flash");
const cookieParser = require('cookie-parser')
const Authenticate = require("./middlewares/authenticate");
const Calender = require("./models/calander");
const {studentVerify,adminVerify} = require("./middlewares/roleauth");
const { text } = require('stream/consumers');


mongoose.connect(process.env.MONGO_URL)
// mongoose.connect("mongodb://127.0.0.1:27017/SMART_ATTENDENCE_SYSTEM")
.then(() => {
    console.log("database connected successfully");
})
.catch(() => {
    console.log("failed to connect to dataabse");
})


app.listen(3000,(req,res) => {
    console.log("app started listening");
});


app.engine('ejs', engine);
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(sessions({ secret: 'secretcode', resave: false, saveUninitialized: false }));
app.use(flash());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
});

async function generateToken(req,res,next,user) {
    if(!user.id) {
        return res.send("user id not found");
    }
    let accesstoken = jwt.sign(
        {id:user.id},
        process.env.SECRETKEY,
        {expiresIn:"15m"}
    );
    let refreshtoken = jwt.sign(
        {id:user.id},
        process.env.REFRESHKEY,
        {expiresIn:"7d"}
    );
    
    let a = await Student.findById(user.id);
    console.log(a);
    if(!user) {
        return res.send("user not found");
    }
    a.refresh_token = refreshtoken;
    await a.save();
    // console.log(a);

    res.cookie("access_token",accesstoken,{
               httpOnly: true,
               maxAge:15*60*1000,
    });
    res.cookie("refresh_token",refreshtoken,{
               httpOnly: true,
               maxAge:7*24*60*60*1000,
    });
    req.flash("success",`welcome ${user.username}`);

    if(user.role === "Admin"){
        return res.redirect("/admin");
    }
    if(user.role === "Student") {
        return res.redirect("/");
    }
    
}



app.get("/login",(req,res,next) => {
    res.render("login.ejs");
});


app.post("/login",async(req,res,next) => {
    let {username,password} = req.body || {};
    if(!username){
        return res.send("user not found");
    }
    let user = await Student.findOne({username:username});
    if(!user){
        req.flash("failure","username not exist")
        return res.redirect("/login");
    }
    let pass_verify = await user.authenticate(password);
    if(!pass_verify.user){
        req.flash("failure","incorrect password");
        return res.redirect("/login");
    }
    if(user.status === "Blocked"){
        req.flash("failure","You are currently Blocked by the Admin.");
        return res.redirect("/login");
    }
    generateToken(req,res,next,user)
});

app.post("/logout",Authenticate,async(req,res,next) => {
    let user = await Student.findById(req.user.id);
    user.refresh_token = null;
    await user.save();
    console.log(user);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    req.flash("success","Logged out Successfully");
    res.redirect("/login");
})

app.get("/",Authenticate,studentVerify,async(req,res,next) => {
    let student = await Student.findById(req.user.id);
    let attendence = await Attendence.find();
    let calendar = await Calender.find();
     const now = new Date();

  const currentHour = parseInt(
    new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    }).format(now)
  );
    let today = new Date().toISOString().split("T")[0];
    let student_records = attendence.filter((el) => {
       return el.studentid.toString() === student.id.toString()
    });
     let days = calendar.filter((el) => {
        return el.date <= today
    })
    let total_workingdays = calendar.filter((el) => {
        return el.dayType === "working"
    });
    let today_daytype = calendar.find((el) => {
        return el.date === today
    })
    let dayof_workingday = total_workingdays.findIndex((el) => {
       return el.date === today
    })
    let workingdays = days.filter((el) => {
        return el.dayType === "working"
    })
    let days_present = student_records.filter((el) => {
       return el.status === "Present"
    })
    let days_absent = student_records.filter((el) => {
       return el.status === "Absent"
    })
    let present_today = student_records.find((el) => {
        return el.date === today && el.status === "Present"
    })
    let attendence_rate = (days_present.length/workingdays.length) *100;

    res.render("user.ejs",{student,currentHour,student_records,today_daytype,total_workingdays,workingdays,attendence_rate,days_present,days_absent,present_today,dayof_workingday});
})


app.get("/calendar",async (req,res,next) => {
    let days = await Calender.find();
    res.render("calender.ejs",{days});
})
