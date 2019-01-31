// Object modelling for variants. This model will represent in the database and
// we will read the all the information according to this model.
// You can think that this is a representation of the database and we are using that
// for saving, reading, updating information from the database.

var mongoose    = require('mongoose');

var variantSchema  = mongoose.Schema({
    productID: {
        type: String
    },
    imagePath: {
        type: String
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    quantity: {
        type: Number
    },
    title: {
        type: String
    },
    price: {
        type: Number
    }
});

var Variant = module.exports = mongoose.model('Variant', variantSchema);

// These are functions to get data from the database. You can even reach the information
// without calling this functions but I just want to show you how you can add some functions
// to your model file to get specific data.

module.exports.getVariantByID = function(id, callback){
    Variant.findById(id, callback);
}

module.exports.getVariantProductByID = function(id, callback){
    var query = {productID: id};
    Variant.find(query, callback);
}