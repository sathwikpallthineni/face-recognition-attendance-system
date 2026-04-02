let Student = require("../models/student");

module.exports.studentVerify =  async(req,res,next) => {
    console.log(req.user);
    let user = await Student.findById(req.user.id);
    if(user && user.role === "Student" && user.status === "Active") {
        return next();
    }
    else{
        return res.redirect("/login");
    }
}


module.exports.adminVerify = async(req,res,next) => {
    let user = await Student.findById(req.user.id);
    if(user && user.role === "Admin") {
        return next();
    }
    else{
        return res.redirect("/login");
    }
}