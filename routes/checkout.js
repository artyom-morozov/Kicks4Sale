var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Variant = require('../models/variant');
var Order = require('../models/order');
var Department = require('../models/department');
var Discount = require('../models/discount');


//Paypal configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWyi9EK_uRDCEEa5HMmknsC1vExSFZh0Ab3eqlUmTsoTlMFonR6sCRZ2h4J6OW3Syta6Dknippj7uVWW',
  'client_secret': 'EI9LeL_qrwtDV2mR73GuU2jdbvRFhGo2GUYobngcmJnNLE71NG2tN-bw6kVtM0LEzDDAfnQxp2aat1e9'
});




/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the checkout page
//
// This basically renders checkout page and set the discount price
// to 0 always.
//
/////////////////////////////////////////////////////////////////////
router.get('/', ensureAuthenticated, function(req, res, next) {
  let cart = new Cart(req.session.cart);
  req.session.cart.discountPrice = 0;


  res.render('checkout', {
    title: 'Checkout Page',
    items: cart.generateArray(),
    totalPrice: cart.totalPrice,
    bodyClass: 'registration',
    containerWrapper: 'container'
  });
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for adding discount
//
// This basically rediercts to checkout page. I need this because
// I in the post request for apply discount I am rendering another page
// so '/apply-discount' keeps in the address bar. Therefore I just
// created redirect middleware for that reason.
//
/////////////////////////////////////////////////////////////////////
router.get('/apply-discount', ensureAuthenticated, function(req, res, next) {
  res.redirect('/checkout')
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests for adding discount
//
// Checks for the discount codes and if it is applicable then returns
// discounted price.
//
/////////////////////////////////////////////////////////////////////
router.post('/apply-discount', ensureAuthenticated, function(req, res, next) {
  let discountCode = req.body.discountCode;
  Discount.getDiscountByCode(discountCode, function(e, discount) {
    if (e) {
      console.log("Failed on router.get('/checkout/apply-discount')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      let cart = new Cart(req.session.cart);
      if (discount) {
        let totalDiscount = (cart.totalPrice * discount.percentage) / 100
        totalDiscount = parseFloat(totalDiscount.toFixed(2))
        let totalPrice = cart.totalPrice - totalDiscount;
        totalPrice = parseFloat(totalPrice.toFixed(2))
        cart.discountPrice = totalPrice
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPriceAfterDiscount: totalPrice,
          totalDiscount: totalDiscount,
          actualPrice: cart.totalPrice,
          discountPercentage: discount.percentage,
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        cart.discountPrice = 0;
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: cart.totalPrice,
          discountCode: discountCode,
          bodyClass: 'registration',
          containerWrapper: 'container',
          msg: "This discount code is not applicable"
        });
      }
    }
  })
})

/////////////////////////////////////////////////////////////////////
//
// checkout-process - checkout-success - checkout-cancel
// MIDDLEWARE - Handles POST & GET requests
//
// They are just middleware for paypal API. Nothing special about them
// Derived from https://github.com/paypal/PayPal-node-SDK
//
/////////////////////////////////////////////////////////////////////
router.post('/checkout-process', function(req, res) {
  let cart = new Cart(req.session.cart);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;
  var didPaymentSucceed = Math.random()
  //Problem 2 code from
  let items = []
  let arr = cart.generateArray
  for (let i =0; i<arr.length;i++){
    items.push({
        "name": arr[i].item.title,
        "sku": "item",
        "price": arr[i].price,
        "currency": "CAD",
        "quantity": arr[i].qty
    })
  }
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": req.protocol + '://' + req.get('host') +'/checkout/checkout-success',
        "cancel_url": req.protocol + '://' + req.get('host') +'/checkout/checkout-cancel'
    },
    "transactions": [{
        "item_list": {
            "items":  items
        },
        "amount": {
            "currency": "CAD",
            "total": cart.totalPrice.toString()
        },
        "description": "This is the payment description."
    }]
};


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for (let i =0; i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            let palURL = payment.links[i].href;
            res.redirect(palURL)
          }
        }
      }
});

});

router.get('/checkout-success', ensureAuthenticated, function(req, res) {


  let cart = new Cart(req.session.cart);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;

  //Problem 2
  let payerID = req.query.PayerID;
  let paymentID = req.query.paymentId;
  if (paymentID){
    console.log("esss")
    //code taken from https://github.com/paypal/PayPal-node-SDK/blob/master/samples/payment/execute.js
    var execute_payment_json = {
      "payer_id": payerID,
      "transactions": [{
          "amount": {
              "currency": "CAD",
              "total": totalPrice.toString()
          }
      }]
    };

    paypal.payment.execute(paymentID, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment))
          // PROBLEM 3
          let userAdress = payment.payer.payer_info.shipping_address.line1+', '+payment.payer.payer_info.shipping_address.city+", "+payment.payer.payer_info.shipping_address.state+', '+payment.payer.payer_info.shipping_address.postal_code+", "+payment.payer.payer_info.shipping_address.country_code
          var newOrder = new Order({
             orderID             : payment.id,
             username            : req.user.username,
             address             : userAdress,
             orderDate           : payment.create_time,
             shipping            : true
           });
          newOrder.save();
          req.session.cart.items = {}
          req.session.cart.totalQty = 0
          req.session.cart.totalPrice = 0
          res.render('checkoutSuccess', {
            title: 'Successful',
            containerWrapper: 'container'
          });
      }
  });
}
});

router.get('/checkout-cancel', ensureAuthenticated, function(req, res) {
  res.render('checkoutCancel', {
    title: 'Successful',
    containerWrapper: 'container'
  });
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for the buy now page
//
// This middleware works for in couple steps;
//      if there is no product in the shopping bag then creates a bag
//      then add to item in the bag then go to checkout page.
//
//      if there is a product in the shopping bag then add to selected
//      item in the bag then go to checkout page.
//
/////////////////////////////////////////////////////////////////////
router.get('/buy-now/:id', ensureAuthenticated, function(req, res, next) {


  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log("before: "+cart.totalPrice)



  Product.findById(productId, function(e, product) {
    if (e) {
      console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      if (product) {
        cart.add(product, product.id);
        cart.userId = req.user._id;
        req.session.cart = cart;
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: cart.totalPrice,
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        Variant.findById(productId, function(e, variant) {
          if (e) {
            console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
            e.status = 406;
            next(e);
          } else {
            Product.findById(variant.productID, function(e, p) {
              let color = (variant.color) ? "- " + variant.color : "";
              variant.title = p.title + " " + color
              variant.price = p.price
              cart.add(variant, variant.id);
              req.session.cart = cart;
              res.render('checkout', {
                title: 'Checkout Page',
                items: cart.generateArray(),
                totalPrice: cart.totalPrice,
                bodyClass: 'registration',
                containerWrapper: 'container'
              });
            })
          }
        })
      }
    }
  })
});


/////////////////////////////////////////////////////////////////////
//
// Function decreaseInventory
//
// Decrease the inventory quantity whenever a customer buy an item.
//
/////////////////////////////////////////////////////////////////////
function decreaseInventory(cartItems, callback) {
  for (let item in cartItems) {
    let qty = cartItems[item].qty;
    console.log("QTY IS: ", qty)
    Product.getProductByID(item, function(e, p) {
      if (p) {
        Product.findOneAndUpdate({
          "_id": item
        }, {
          $set: {
            "quantity": p.quantity - qty,
          }
        }, {
          new: true
        }, function(e, result) {

        });
      } else {
        Variant.getVariantByID(item, function(e, v) {
          Variant.findOneAndUpdate({
            "_id": item
          }, {
            $set: {
              "quantity": v.quantity - qty,
            }
          }, {
            new: true
          }, function(e, result) {

          });
        });
      }
    });
  }

  return callback(true)
}

/////////////////////////////////////////////////////////////////////
//
// Function ensureAuthenticated()
//
// Check if the user authenticated or not. If not returns to login page
//
/////////////////////////////////////////////////////////////////////
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    Department.getAllDepartments(function(e, departments) {
      req.session.department = JSON.stringify(departments)
      return next();
    })
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/');
  }
};

module.exports = router;
