const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/campquest');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs' , ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));


app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));

const validateCampground = (req , res , next) =>{

    const {error} = campgroundSchema.validate(req.body);
    
    if(error){
const msg = error.details.map(el => el.message).join(',');
throw new ExpressError(msg , 400);
    }
    else{
        next();
    }
}

app.get('/' , (req , res) =>{
    res.render('home');
})

app.get('/campgrounds' , catchAsync(async (req , res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' ,{campgrounds });
}))

app.get('/campgrounds/new' , (req , res)=>{
    res.render('campgrounds/new');

})

app.get('/campgrounds/:id' ,catchAsync( async (req , res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show' , {campground} );
}))

app.post('/campgrounds', validateCampground ,
    catchAsync(async (req , res ,next) =>{
//We r typing req.body.campground cuz , we get the req.body with the object's name as "campground"
//U can verify this by typing res.send(req.body)
    

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send(req.body)

}))

app.get('/campgrounds/:id/edit' , catchAsync(async (req , res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit' , {campground});

}))

//Updating :
app.put('/campgrounds/:id' ,validateCampground, 
    catchAsync(async (req ,res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);

}))

app.delete('/campgrounds/:id' , catchAsync(async (req , res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}))

app.post('/campgrounds/:id/reviews' , catchAsync(async(req , res) => {
    res.send('HEYYEYEYE');
}))

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found' , 404));
})

app.use((err , req , res , next) =>{  /*This is the inbuilt express error handler */
    const {statusCode = 500} = err;

    if(!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error' , {err});
})


app.listen(3000 , () =>{
    console.log("Listening on port 3000");
})