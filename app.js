if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');



const campRoutes = require('./routes/campRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const chatBotRoutes = require('./routes/chatBotRoutes.js');

mongoose.connect('mongodb://127.0.0.1:27017/campquest');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// console.log('Key:' , process.env.OPENAI_API_KEY);


app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , 'public')));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith : '_'
}));

const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    name : 'session',
    secret : 'thisisasecret',
    resave : false,
    saveUninitialised : true,
    cookie : {
        httpOnly : true,
        // secure : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next) =>{
    // if(!['/login' , '/' , '/register'].includes(req.originalUrl)){
    //     req.session.returnTo = req.originalUrl;
    // }
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser' , async (req , res) =>{
    const user = new User({email : "aff@gmail.com" , username : "aff109"});
    const newUser = await User.register(user , 'chicken');
    res.send(newUser);
})


app.use('/' , userRoutes);
app.use('/campgrounds' , campRoutes);
app.use('/campgrounds/:id/reviews' ,reviewRoutes );
app.use('/chatbot' , chatBotRoutes);



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


app.listen(PORT, () => {
    console.log("Listening on port 3000");
})