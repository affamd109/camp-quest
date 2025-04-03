const { campgroundSchema, reviewSchema } = require('../schemas.js');


module.exports.isLoggedIn = (req , res , next) =>{
    console.log('Req.User : ' , req.user);
    if(!req.isAuthenticated()){
         req.session.returnTo = req.originalUrl;
        req.flash('error' , 'You must be signed in! ');
        return res.redirect('/login');
    }
    next();

}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req , res , next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error' , 'Permission required!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}