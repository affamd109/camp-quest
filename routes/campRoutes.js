const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js');
const { campgroundSchema, reviewSchema } = require('../schemas.js');


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


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');

})

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    if(!campground){
        req.flash('error' , 'Campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

router.post('/', validateCampground,
    catchAsync(async (req, res, next) => {
        //We r typing req.body.campground cuz , we get the req.body with the object's name as "campground"
        //U can verify this by typing res.send(req.body)


        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success' , 'Successfully made a campground');
        res.redirect(`/campgrounds/${campground._id}`);
        // res.send(req.body)

    }))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error' , 'Campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}))

//Updating :
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        req.flash('success' , 'Campground updated successfully')
        res.redirect(`/campgrounds/${campground._id}`);

    }))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Campground deleted successfully')
    res.redirect('/campgrounds');

}))

module.exports = router;
