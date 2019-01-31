// Object modelling for order. This model will represent in the database and
// we will read the all the information according to this model.
// You can think that this is a representation of the database and we are using that
// for saving, reading, updating information from the database.

var mongoose    = require('mongoose');

var orderSchema  = mongoose.Schema({
    orderID: {
        type    : String,
        index   : true
    },
    username: {
        type    : String
    },
    address: {
        type    : String
    },
    orderDate: {
        type    : String
    },
    shipping: {
        type    : Boolean
    },
    total: {
        type    : Number
    }
});

var Order = module.exports = mongoose.model('Order', orderSchema);

// These are functions to get data from the database. You can even reach the information
// without calling this functions but I just want to show you how you can add some functions
// to your model file to get specific data.

module.exports.getAllOrders = function(callback){
    Order.find(callback)
}