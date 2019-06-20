var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true });
 
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: { 
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
        }
});
 
module.exports = mongoose.model("Comment", commentSchema);