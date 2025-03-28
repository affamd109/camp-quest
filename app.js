const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');

const campRoutes = require('./routes/campRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');

mongoose.connect('mongodb://127.0.0.1:27017/campquest');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campgrounds' , campRoutes);
app.use('/campgrounds/:id/reviews' ,reviewRoutes );

app.post('/campgrounds/:id/reviews', validateReview , catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


app.delete('/campgrounds/:id/reviews/:reviewId' , catchAsync( async (req , res) =>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {  /*This is the inbuilt express error handler */
    const { statusCode = 500 } = err;

    if (!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log("Listening on port 3000");
})