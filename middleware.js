module.exports.isLoggedIn = (req , res , next) =>{
    console.log('Req.User : ' , req.user);1
    if(!req.isAuthenticated()){
        req.flash('error' , 'You must be signed in! ');
        return res.redirect('/login');
    }
    next();

}