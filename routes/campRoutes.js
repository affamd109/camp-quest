const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary/index')
const upload = multer({storage}); //This tells us to upload img in the storage we have made using cloudinary 


const Campground = require('../models/campground');

router.route('/') //YAHAN sirf '/' likha hai toh iska ye matlab nahi ki ye home route hai.. it actually means /campgrounds (i have set this up in app.js)
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,  upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))

    
router.get('/new', isLoggedIn, campgrounds.renderNewForm)//Similarly here also .. /new is actually /campgrounds/new

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// router.delete('/:id/images/:filename', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id, filename } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { images: { filename } } });
//     // Optionally delete from Cloudinary too:
//     // await cloudinary.uploader.destroy(filename);
//     // res.status(200).json({ success: true });
// }) );

module.exports = router;