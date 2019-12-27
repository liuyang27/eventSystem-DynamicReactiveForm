var express=require("express");
var mongoose =require("mongoose");
var cors = require('cors')
// var session = require('express-session')
var bodyParser = require('body-parser')

// var adminCtrl = require("./controllers/adminCtrl.js");
// var adminStudentCtrl = require("./controllers/adminStudentCtrl.js");
// var adminCourseCtrl = require("./controllers/adminCourseCtrl.js");
var mainCtrl = require("./controllers/mainCtrl.js");

var app=express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// mongoose.connect('mongodb://localhost:27017/RegisterSystem');
// mongoose.connect("mongodb+srv://binny_01:binny01@cluster0-ziirr.gcp.mongodb.net/EventManagementSystem?retryWrites=true&w=majority");
mongoose.connect('mongodb://192.168.0.54/EventManagementSystem');

// app.use(session({
//     secret: 'liuyang',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60*1000*20 }
//   }));

// app.set("view engine","ejs");


// app.get("/admin",                   adminCtrl.showAdminDashboard);
// app.get("/admin/report",            adminCtrl.showAdminReport);

// app.get ("/admin/student",          adminStudentCtrl.showAdminStudent);
// app.get ("/admin/student/import",   adminStudentCtrl.showAdminStudentImport);
// app.post("/admin/student/import",   adminStudentCtrl.doAdminStudentImport);
// app.get ("/student",                adminStudentCtrl.getAllStudents);
// app.get ("/student/add",            adminStudentCtrl.showAddStudent);
// app.post ("/student/add",           adminStudentCtrl.doAddStudent);
// app.post ("/student/:sid",          adminStudentCtrl.updateStudent);
// app.get ("/student/:sid",           adminStudentCtrl.showEditStudent);
// app.put ("/student/:sid",           adminStudentCtrl.doCheckId);
// app.delete ("/student/:sid",        adminStudentCtrl.deleteStudent);


// app.get("/admin/course",            adminCourseCtrl.showAdminCourse);
// app.get ("/admin/course/import",    adminCourseCtrl.showAdminCourseImport);
// app.post("/admin/course/import",    adminCourseCtrl.doAdminCourseImport);
// app.get ("/course",                 adminCourseCtrl.getAllCourse);
// app.get ("/course/add",             adminCourseCtrl.showAddCourse);

// app.post ("/course/add",            adminCourseCtrl.doAddCourse);
// app.post ("/course/:sid",           adminCourseCtrl.updateCourse);
// app.get ("/course/:sid",            adminCourseCtrl.showEditCourse);
// app.put ("/course/:sid",            adminCourseCtrl.doCheckId);
// app.delete ("/course/:sid",         adminCourseCtrl.deleteCourse);

// app.get ("/login",                  mainCtrl.showLogin);
// app.post ("/login",                 mainCtrl.doLogin);
app.get ("/",                          mainCtrl.showIndex);
// app.get ("/logout",                 mainCtrl.doLogout);
// app.get ("/changepwd",              mainCtrl.showChangepwd);
// app.post ("/changepwd",             mainCtrl.doChangepwd);
// app.get ("/checkStatus",            mainCtrl.checkSubscribe);
// app.post("/register",               mainCtrl.register);
// app.post("/unregister",             mainCtrl.unregister);
app.get("/sendemail",                  mainCtrl.sendEmail)
app.post("/event",                     mainCtrl.doAddEvent)
app.put("/event/:eid",                 mainCtrl.doEditEvent)
app.delete("/event/:eid",              mainCtrl.doDeleteEvent)
app.get("/event/:eid",                 mainCtrl.getEventDetail)
app.post("/checkin",                   mainCtrl.checkin)


app.use(express.static("public"));

app.use(function(req,res){
    res.send("404 page not found..");
});

app.listen(3000);
console.log("server is running on port 3000..");