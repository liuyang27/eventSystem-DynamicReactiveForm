var formidable = require('formidable');
// var Student=require("../models/Student");
// var crypto = require('crypto');
var Course = require("../models/Course");
// var _= require("underscore");
const nodemailer = require("nodemailer");
// const fs = require('fs');
var Event = require("../models/Event");
var UserEvent = require("../models/UserEvent");
var User = require("../models/User");

// const mydict={
//     "1":"Year One",
//     "2":"Year Two",
//     "3":"Year Three",
// };
// exports.showIndex=function(req,res){
//     console.log("showIndex function...........")
//     Course.find({},function(err,results){
//         results = results.map(element =>({
//             "_id" : element._id, 
//             "allow" : element.allow.map(e =>  (e in mydict ) ? mydict[e]: "data err" ) , 
//             "cid" : element.cid, 
//             "name" : element.name, 
//             "dayofweek" : element.dayofweek, 
//             "number" : element.number, 
//             "teacher" : element.teacher, 
//             "briefintro" : element.briefintro, 
//             "__v" : element.__v
//         }) );
//         res.json({"results":results});  
// 	})
// }


exports.showIndex = function (req, res) {
  console.log("showIndex events...........")
  Event.find({}, function (err, results) {
    results = results.map(element => ({
      "_id": element._id,
      "name": element.name,
      "venue": element.venue,
      "capacity": element.capacity,
      "entryFee": element.entryFee,
      "dateFrom": element.dateFrom,
      "dateTo": element.dateTo,
      "timingFrom": element.timingFrom,
      "timingTo": element.timingTo,
      "introduction": element.introduction,
      "category": element.category,
      "organizer": element.organizer,
      "eventformat": element.eventformat,
      "remarks": element.remarks,
      "registrationEnable": element.registrationEnable,
      "preEventSurvey": element.preEventSurvey,
      "__v": element.__v
    }));
    res.json({ "results": results });
  })
}

exports.doDeleteEvent = function (req, res) {
  var eid = req.params.eid;
  Event.find({ "_id": eid }, function (err, results) {
    if (err || results.length == 0) {
      res.json({ "results": -1 });
      return;
    }
    results[0].remove(function (err) {
      if (err) {
        res.json({ "results": -1 });
        return;
      }
      res.json({ "results": 1 });
    })
  })

}

exports.getEventDetail = function (req, res) {
  console.log("getEventDetail...........")
  var eid = req.params.eid;
  Event.find({ "_id": eid }, function (err, results) {
    if (err || results.length == 0) {
      res.json({ "results": -1 });
      return;
    }
    res.json({ "results": results[0] });

  })
}





exports.sendEmail = function (req, res) {

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
        path: 'public/images/download.png',
        cid: 'qrcode'
      }]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


exports.doAddEvent = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log("------------------------ADD EVENT-----------------------------")
    console.log(fields);
    var e = new Event(fields);
    e.save(function (err) {
      if (err) {
        console.log(err);
        res.json({ "results": "-1" });
        return;
      }
      res.json({ "results": "1" });
    });

    // var s = new Student(fields);
    // s.save();
    // Student.addStudent(fields,function(results){
    // 	res.json({"results":results});
    // });	
  })
}


exports.doEditEvent = function (req, res) {
  console.log("------------------------Edit EVENT-----------------------------")
  var eid = req.params.eid;
  var body=req.body
  Event.findOneAndUpdate({"_id": eid }, body,{new:true}, function (err, results) {

    if (err) {
      res.json({ "results": -1 });
      return;
    }
    res.json({ "results": 1 });
    
  })

}


exports.checkin = function (req, res) {
  console.log("==============user check in=================")

  eid = req.body.eid;
  qrcode = req.body.qrcode;

  UserEvent.validationCheck(eid, qrcode, function (results) {

    if (results.code < 0) {
      console.log(results.code);
      res.json({ "results": results.code, "username": null });

    } else {
      var d = new Date();
      UserEvent.findByIdAndUpdate(qrcode, { $push: { Attendance: d } }, function (err, response) {
        if (err) {
          console.log(results.code);
          res.json({ "results": -3, "username": null });     //update mongoDB fail 
          return;
        }

        User.findById(results.user[0].UserId, function (error, data) {
          if (error) {
            console.log(results.code);
            res.json({ "results": -3, "username": null });     //update mongoDB fail 
            return;
          }
          console.log(results.code);
          res.json({ "results": results.code, "username": data.Name });   //check-in ok
        })
      })
    }


  })

}


