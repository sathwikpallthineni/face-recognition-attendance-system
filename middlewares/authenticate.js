const Student = require("../models/student");
let jwt = require('jsonwebtoken');



module.exports = async(req,res,next) => {
    let accesstoken = req.cookies.access_token;
    let refreshtoken =  req.cookies.refresh_token;

    if(!accesstoken && !refreshtoken) {
        return res.redirect("/login");
    }

    if(accesstoken) {
        try{
        let decoded = jwt.verify(accesstoken,process.env.SECRETKEY);
        // console.log(decoded);
        req.user = decoded;
        return next();
        }catch(err){
            if(err.name != "TokenExpiredError"){
                res.redirect("/login");
            }
        }

    }
    if(refreshtoken) {
        try{
            let decoded = jwt.verify(refreshtoken,process.env.REFRESHKEY);
            let db_verify = await Student.findById(decoded.id);
            if(db_verify.refresh_token != refreshtoken) {
                return res.redirect("/login");
            }
                let newaccesstoken = jwt.sign(
                    {id:decoded.id},
                    process.env.SECRETKEY,
                    {expiresIn:"15m"}
                );
                res.cookie("access_token",newaccesstoken,{
                    httpOnly: true,
                    maxAge:15*60*1000,
                });
                req.user = decoded;
                return next();
        }
        catch(err) {
            return res.redirect("/login");
        }
    }
}