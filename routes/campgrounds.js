var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, foundCampgrounds){
            if(err){
                console.log(err);
            } else {
                if(foundCampgrounds.length < 1){
                    noMatch = "No match found, please try again";
                }
                res.render("campgrounds/index", {campgrounds: foundCampgrounds, noMatch: noMatch});
            }
        });
        } else {
            Campground.find({}, function(err, allCampgrounds){
                if(err){
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
                }
            });
        }   
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){ 
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground was successfully added");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
   });
});

// EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});            
        }
        });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findOneAndUpdate({"_id": req.params.id}, req.body.campground, function(err, updatedCampground){
     if(err){
         req.flash("error", "Something went wrong");
         res.redirect("/campgrounds");
     }  else {
         req.flash("success", "Campground was successfully updated");
         res.redirect("/campgrounds/" + req.params.id);
     }
   });
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground deleted");
           res.redirect("/campgrounds");
       }
   }); 
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;