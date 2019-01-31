const express             = require('express');
const router              = express.Router();
const User                = require('../models/user');
const passport            = require('passport');
const LocalStrategy       = require('passport-local').Strategy;
const nodemailer          = require('nodemailer');
var Cart                  = require('../models/cart');

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the login page
//
// Renders login page
//
/////////////////////////////////////////////////////////////////////
router.get('/login', function(req, res){
    res.render('login', { title: 'Login', bodyClass: 'registration'});
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the signin page
//
// Renders signin page
//
/////////////////////////////////////////////////////////////////////
router.get('/signin', function(req, res){
    res.render('signin', { title: 'Signin', bodyClass: 'registration'});
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests to the signin page
//
// Checks the all the fields in the signin form and if it is successful
// then creates a user and send a user email regarding it.
// The email will be in the junk because we are in the localhost.
//
/////////////////////////////////////////////////////////////////////
router.post('/signin', function(req, res, next){
    var username        = req.body.username ;
    var fullName        = req.body.fullNameField;
    var password        = req.body.password;
    var verifyPassword  = req.body.verifyPasswordField;
    
    req.checkBody('fullNameField',          'Full name is required').notEmpty();
    req.checkBody('username',             'Email is required').notEmpty();
    req.checkBody('username',             'Email is not valid').isEmail();
    req.checkBody('password',          'Password is required').notEmpty();
    req.checkBody('password',          'Passwords have to match').equals(req.body.verifyPasswordField);
   
    var errors = req.validationErrors();
    // If any error show it
    if (errors){
        res.render('signin', {
            errors:errors,
            title: 'Signin', 
            bodyClass: 'registration'
        });
    } else{
        var newUser = new User({
            username    : username,
            password    : password,
            fullname    : fullName
        });
        User.createUser(newUser, function(err, user){
            if(err) throw err;
        });

        var smtpTransport = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: 'cuneytc',
              pass: 'Carleton2018'
            }
          });
          var mailOptions = {
            to: username,
            from: 'no-reply@yardgarage.com',
            subject: 'Welcome to Yard & Garage',
            text: 'Hello, ' + fullName + '\n\n' +
                        'Thank you for creating an account\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('info', 'An e-mail has been sent to ' + username + ' with further instructions.');
            done(err, 'done');
          });

        req.flash('success_msg', 'You are registered and you can login');
        
        res.redirect('/users/login');
    }
});


/////////////////////////////////////////////////////////////////////
//
// PASSPORTS
//
// Nothing special about it. I just used their module.
// Here is the documentation: http://www.passportjs.org/docs/
//
/////////////////////////////////////////////////////////////////////
passport.use(new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } 
            else{
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));
    
// Serialize user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
    
// Deserialize user
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests for the login
//
// if successful renders root page, if not then redirect to login page
// again. I also inject the user's bag to session here.
//
/////////////////////////////////////////////////////////////////////
router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: true}), function(req, res, next) {
        let uid = req.session.passport.user;
        User.findOne({ "_id": uid }, function(e, user){
            if (e)
            {
                console.log("Failed on router.get('/login')\nError:".error, e.message.error + "\n")
                e.status = 406; next(e);
            }
            else 
            {
                let cart = new Cart(user.cart ? user.cart : {});
                req.session.cart = cart;
                req.session.user = {}
                res.redirect('/');
            }
        })
    }
);

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for the logout
//
// Logouts the user, add the user bag the database and deletes the bag
// from session.
//
/////////////////////////////////////////////////////////////////////
router.get('/logout', function(req, res, next){
    let uid = req.session.passport.user
    let cart = req.session.cart
    if (cart && cart.userId == uid)
    {
        User.findOneAndUpdate({"_id": uid}, 
        { $set: {
            "cart": req.session.cart
            }
        },
        { new: true }, function(e, result){
            if (e)
            {
                console.log("Failed on router.post('/logout')\nError:".error, e.message.error + "\n")
                e.status = 406; next(e);
            }
            else {
                req.logout();
                req.flash('success_msg', 'You are logged out');
                res.redirect('/');
            }
        });
        
    }
    else
    {
        req.session.cart = null;
        req.logout();
        req.flash('success_msg', 'You are logged out');

        res.redirect('/');
    }
    
})

module.exports = router;