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
const MongoStore = require('connect-mongo');




const campRoutes = require('./routes/campRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const chatBotRoutes = require('./routes/chatBotRoutes.js');
// const { contentSecurityPolicy } = require('helmet');

// 'mongodb://127.0.0.1:27017/campquest'
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/campquest'

// const dbUrl = 'mongodb://127.0.0.1:27017/campquest'

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// console.log('Key:' , process.env.OPENAI_API_KEY);


app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname , 'public')));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith : '_'
}));

const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET || 'fallbacksecret',
    }
});

store.on("error" , function(e){
    console.log('session store error !' , e);
})

const sessionConfig = {
    store,
    name : 'session',
    secret: process.env.SECRET || 'fallbacksecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        secure: process.env.NODE_ENV === 'production', 
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
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser' , async (req , res) =>{
//     const user = new User({email : "aff@gmail.com" , username : "aff109"});
//     const newUser = await User.register(user , 'chicken');
//     res.send(newUser);
// })



app.use('/' , userRoutes);
app.use('/campgrounds' , campRoutes);
app.use('/campgrounds/:id/reviews' ,reviewRoutes );
app.use('/chatbot' , chatBotRoutes);


app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {  /*This is the inbuilt express error handler */
    const { statusCode = 500 } = err;

    if (!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });
})


app.listen(PORT, '0.0.0.0', () => {
    console.log("Serving on port 3000");
});