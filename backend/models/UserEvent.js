var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    EventId: String,
    UserId: String,
    PreEventSurvey: Array,
    PostEventSurvey: Array,
    Attendance: Array,
});

var UserEvent = mongoose.model("UserEvent", userSchema, "User_Event_Info_Table");

module.exports = UserEvent;