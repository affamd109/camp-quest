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
const flash = require('connect-flash');
const session = require('express-session');



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
app.use(express.static(path.join(__dirname , 'public')));
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    secret : 'thisisasecret',
    resave : false,
    saveUninitialised : true,
    cookie : {
        httpOnly : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}


app.use(session(sessionConfig));
app.use(flash());

app.use((req , res , next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds' , campRoutes);
app.use('/campgrounds/:id/reviews' ,reviewRoutes );



app.get('/', (req, res) => {
    res.render('home');
})

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