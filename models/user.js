var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true });
var passportLocalMongoose = require("passport-local-mongoose");
 
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});
 
UserSchema.plugin(passportLocalMongoose);
 
module.exports = mongoose.model("User", UserSchema);