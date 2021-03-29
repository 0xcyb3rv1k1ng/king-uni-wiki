var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET register */
router.get('/', function(req, res, next) {
    console.log('Register Page');
    res.render('register', { title: 'Register Page' });
});

/* POST */
router.post('/', function(req, res) {
    console.log('register post');

    // user and validation
    let newUser = new User({ username: req.body.username, password: req.body.password});
    let validationErrors = newUser.validateSync();

    // if/else for validation errors
    if (validationErrors === undefined && req.body.password === req.body.repeatPassword) {
        // register the user
        User.register(new User({ username: req.body.username}), req.body.password, function(err, user) {
            // if/else for user register
            if (err) {
                console.log('Getting an error on user register', err);
                res.send('Error:\n', err);
            } else {
                // session authentication for user
                passport.authenticate('local')(req, res, function () {
                    req.session.save(function(err) {
                        if (err) {
                            return next(err); 
                        }
                        res.redirect('/');
                    });
                });
            }
        });
    // part of the if/else for validation errors
    } else {
        // checks for errors and displays them
        let displayErrors = [];

        if (validationErrors != undefined) {
            let values = Object.values(validationErrors.errors);
            console.log('Validation Errors:');
            values.forEach(err => {
                console.log(err.properties.path);
                console.log(err.properties.message);
                console.log('');
            });
            // validation errors added
            displayErrors = values.map((err) => err.properties.path.charAt(0).toUpperCase() + err.properties.path.slice(1) + " " + err.properties.message);
        }
        if (req.body.password === req.body.repeatPassword) {
            console.log('passwords match');
        } else {
            displayErrors.push('Passwords do not match');
        }
        // render the errors
        res.render('register', { errors: displayErrors});
    }
});


module.exports = router;