// Object modelling for discount. This model will represent in the database and
// we will read the all the information according to this model.
// You can think that this is a representation of the database and we are using that
// for saving, reading, updating information from the database.

var mongoose    = require('mongoose');

var discountSchema  = mongoose.Schema({
    code: {
        type: String
    },
    description: {
        type: String
    },
    percentage: {
        type: Number
    }
});

var Discount = module.exports = mongoose.model('Discount', discountSchema);

// These are functions to get data from the database. You can even reach the information
// without calling this functions but I just want to show you how you can add some functions
// to your model file to get specific data.

module.exports.getAllDiscounts = function(callback){
    Discount.find(callback)
}

module.exports.getDiscountByCode = function(discountCode, callback){
    var query = {code: discountCode};
    Discount.findOne(query, callback);
}