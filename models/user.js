// Object modelling for user. This model will represent in the database and
// we will read the all the information according to this model.
// You can think that this is a representation of the database and we are using that
// for saving, reading, updating information from the database.

var mongoose    = require('mongoose');
var bcrypt      = require('bcryptjs');

var userSchema  = mongoose.Schema({
    username: {
        type    : String,
        index   : true
    },
    password: {
        type    : String
    },
    fullname: {
        type    : String
    },
    admin: {
        type    : String
    },
    cart: {
        type    : Object
    }
});

var User = module.exports = mongoose.model('User', userSchema);

// These are functions to get data from the database. You can even reach the information
// without calling this functions but I just want to show you how you can add some functions
// to your model file to get specific data.
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}
module.exports.comparePassword = function(givenPassword, hash, callback){
    bcrypt.compare(givenPassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getAllUsers = function(callback){
    User.find(callback)
}