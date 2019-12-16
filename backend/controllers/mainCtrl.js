var formidable = require('formidable');
// var Student=require("../models/Student");
// var crypto = require('crypto');
var Course=require("../models/Course");
// var _= require("underscore");
const nodemailer = require("nodemailer");
// const fs = require('fs');
var Event = require("../models/Event");
var UserEvent = require("../models/UserEvent");

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


exports.showIndex=function(req,res){
  console.log("showIndex events...........")
  Event.find({},function(err,results){
      results = results.map(element =>({
          "_id" : element._id, 
          "name" : element.name, 
          "venue" : element.venue, 
          "capacity" : element.capacity, 
          "entryFee" : element.entryFee, 
          "dateFrom" : element.dateFrom, 
          "dateTo" : element.dateTo, 
          "timingFrom" : element.timingFrom, 
          "timingTo" : element.timingTo, 
          "introduction" : element.introduction, 
          "category" : element.category, 
          "organizer" : element.organizer, 
          "eventformat" : element.eventformat, 
          "remarks" : element.remarks, 
          "registrationEnable" : element.registrationEnable, 
          "preEventSurvey" : element.preEventSurvey, 
          "__v" : element.__v
      }) );
      res.json({"results":results});  
  })
}

exports.doDeleteEvent=function(req,res){
  var eid=req.params.eid;
	Event.find({"_id":eid},function(err,results){
		if(err || results.length==0){
			res.json({"results":-1});
			return;
		}
		results[0].remove(function(err){
			if(err){
				res.json({"results":-1});
				return;
			}
			res.json({"results":1});
		})
  })
  
}

exports.getEventDetail=function(req,res){
  var eid=req.params.eid;
  Event.find({"_id":eid},function(err,results){
		if(err || results.length==0){
			res.json({"results":-1});
			return;
		}
		res.json({"results":results[0]});
	
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


exports.doAddEvent=function(req,res){
  var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
    console.log("------------------------ADD EVENT-----------------------------")
    console.log(fields);
    var e= new Event(fields);
    e.save(function(err){
      if(err){
          console.log(err);
          res.json({"results":"-1"});
          return;
      }
      res.json({"results":"1"});
  });
    
		// var s = new Student(fields);
		// s.save();
		// Student.addStudent(fields,function(results){
		// 	res.json({"results":results});
		// });	
	})
}


exports.checkin=function(req,res){
  console.log("==============check in=================")
  // console.log(req.query);
  console.log("body:"+req.body);
  eid=req.body.eid;
  qrcode=req.body.qrcode;

  UserEvent.find({"_id":qrcode,"EventId":eid},function(err,results){
    console.log("err:"+err)
    console.log("results:"+results)
    if(err){
      res.json({"results":"-1"}); //qrcode invalid
      return;
    }
    if(results.length==0){
      res.json({"results":"-2"}); //eventId invalid
      return;
    }

    results = results.map(element =>({
        "_id" : element._id, 
        "PreEventSurvey" : element.PreEventSurvey, 
        "PostEventSurvey"  : element.PostEventSurvey,
        "EventId"  : element.EventId, 
        "UserId"  : element.UserId, 
        "Attendance" : element.Attendance, 
        "__v" : element.__v
    }) );

    console.log(results)
    if(results[0].Attendance.length>0){
      res.json({"results":"2"});  
    }
    else{
      res.json({"results":"1"});  //first time checkin
    }
    // res.json({"results":results});  
  })
}


