var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           req.flash("error", "Something went wrong");
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          req.flash("error", "Something went wrong");
          res.redirect("/campgrounds");
      } else {
          Comment.create(req.body.comment, function(err, comment){
             if(err){
                 req.flash("error", "Something went wrong");
                 res.redirect("/campgrounds");
             } else {
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 comment.save();
                 campground.comments.push(comment);
                 campground.save();
                 req.flash("success", "Review was successfully added");
                 res.redirect("/campgrounds/" + campground._id);
             }
          });
      }
   }); 
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("back");
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});           
       }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          req.flash("error", "Something went wrong");
          res.redirect("back");
      } else {
          req.flash("success", "Review was successfully updated");
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err) {
           req.flash("error", "Something went wrong");
           res.redirect("back");
       } else {
           req.flash("success", "Comment was successfully deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

module.exports = router;