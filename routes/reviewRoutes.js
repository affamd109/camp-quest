const express = require('express');
const router = express.Router({mergeParams : true});
const Campground = require('../models/campground.js');
const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js');
const {validateReview , isLoggedIn} = require('../middleware');


router.post('/',isLoggedIn,  validateReview , catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success' , 'Review submitted');
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:reviewId' , catchAsync( async (req , res) =>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;