// var formidable = require('formidable');
// var Student=require("../models/Student");
// var crypto = require('crypto');
var Course=require("../models/Course");
// var _= require("underscore");
const nodemailer = require("nodemailer");
const fs = require('fs');

const mydict={
    "1":"Year One",
    "2":"Year Two",
    "3":"Year Three",
};
exports.showIndex=function(req,res){
    console.log("showIndex function...........")
    Course.find({},function(err,results){
        results = results.map(element =>({
            "_id" : element._id, 
            "allow" : element.allow.map(e =>  (e in mydict ) ? mydict[e]: "data err" ) , 
            "cid" : element.cid, 
            "name" : element.name, 
            "dayofweek" : element.dayofweek, 
            "number" : element.number, 
            "teacher" : element.teacher, 
            "briefintro" : element.briefintro, 
            "__v" : element.__v
        }) );
        res.json({"results":results});  
	})
}

exports.sendEmail=function(req,res){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'liuyangvip1127@gmail.com',
          pass: 'xxxxxxx'
        }
      });
      
      var mailOptions = {
        from: 'liuyangvip1127@gmail.com',
        to: 'yang_liu@u.nus.edu',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html: `<b>Hello world?</b>
               <p>haha</p>
               Embedded image: <img src="cid:qrcode"/>
               <p>next line..</p>
                `,
        attachments: [

        {
            filename: 'Logo.png',
            path:'public/images/download.png',
            cid: 'qrcode' 
       }]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


