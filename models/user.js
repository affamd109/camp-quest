const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//yes i only need to write meail cuz of the below plugin
//The below plugin is used to give fiels like username and passport by  default!
//Passport-local
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);