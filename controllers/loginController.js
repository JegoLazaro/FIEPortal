const db = require('../models/db.js');
const User = require('../models/modelUser.js');
const passport = require('passport');
const initializePassport = require('../passport-config.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {validationResult} = require('express-validator');

initializePassport(
    passport,
    (username) => User.find((user) => user.username === username),
    (id) => User.find((user) => user.id === id),
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        req.isLogged = true;
        return next();
    }

    req.isLogged = false;
    return next();
}

const loginController = {

    getLogInPage: function(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;
        } else {
            const userType = 'Master Admin';
            const fullName = {
                firstName: 'Master',
                lastName: 'Admin',
            };
            const phonenumber = '09123456789';
            const email = 'email@gmail.com';
            // const password = fullName.lastName+phonenumber.charAt(4);
            const password = '12345';
            const completeAddress = '123 Sesame St., Manila';
            const postalCode = '1006';
            const city = 'Manila';
            const username = 'Master1';

            const user = {
                userType: userType,
                fullName: fullName,
                password: bcrypt.hashSync(password, saltRounds),
                completeAddress: completeAddress,
                phoneNumber: phonenumber,
                postalCode: postalCode,
                city: city,
                email: email,
                username: username,
            };

            db.findOne(User, {userType: userType}, 'userType', function(result) {
                if (result === null) {
                    db.insertOne(User, user, function(flag, id) {
                        if (flag) {
                            res.render('SignIn');
                        } else {
                            res.redirect('/error');
                        }
                    });
                } else {
                    console.log('Super admin already exists!');
                    res.render('SignIn', {login_errors: req.session.messages || []});
                    req.session.messages = [];
                }
            });
        }
    },


    postLogIn: function(req, res, next) {
        const username = req.body.username;
        let userType = '';

        const date = new Date();
        User.findOne({username: username})
            .then((user) => {
                if (user) {
                    userType = user.userType;
                    newUser = user.newUser;
                    console.log(userType);

                    if (userType === 'Co-administrator') {
                        console.log('user exists!');

                        console.log(newUser);

                        if (!newUser) {
                            passport.authenticate('local', {
                                successRedirect: '/home',
                                failureRedirect: '/',
                                failureMessage: 'Invalid username or password',
                            })(req, res, next);
                        } else {
                            passport.authenticate('local', {
                                successRedirect: '/change_pw',
                                failureRedirect: '/',
                                failureMessage: 'Invalid username or password',
                            })(req, res, next);
                        }
                    }


                    if (userType === 'Franchisee') {
                        console.log('user exists!');
                        if (!newUser) {
                            passport.authenticate('local', {
                                successRedirect: '/product-page',
                                failureRedirect: '/',
                                failureMessage: 'Invalid username or password',
                            })(req, res, next);
                        } else {
                            passport.authenticate('local', {
                                successRedirect: '/change_pw',
                                failureRedirect: '/',
                                failureMessage: 'Invalid username or password',
                            })(req, res, next);
                        }
                    }

                    if (userType === 'Commissary') {
                        console.log('user exists!');
                        if (!newUser) {
                            passport.authenticate('local', {
                                successRedirect: '/inventory-page',
                                failureRedirect: '/',
                                failureMessage: 'Invalid username or password',
                            })(req, res, next);
                        } else {
                            passport.authenticate('local', {
                                successRedirect: '/change_pw',
                                failureRedirect: '/',
                                failureMessage: 'Invalid username or password',
                            })(req, res, next);
                        }
                    }

                    if (userType === 'Master Admin') {
                        console.log('user exists!');

                        passport.authenticate('local', {
                            successRedirect: '/home',
                            failureRedirect: '/',
                            failureMessage: 'Invalid username or password',
                        })(req, res, next);
                    }
                } else {
                    req.session.messages = 'Invalid username or password';
                    res.redirect('/');
                }
            });
    },

    getFirstTimeChangePW: function(req, res) {
        const _id = req.params._id;

        const details = {};

        details.confirmPopupText =
                'Are you sure you want to save your changes?';
        details.confirmleftButtonText ='Yes';
        details.confirmleftButtonhref='#';
        details.confirmrightButtonText ='No';
        details.confirmrightButtonhref='/user/' + _id;

        details.formConfirmSubmit = 'password-form-proper';

        details.cancelPopupText =
                'Are you sure you want to discard your changes?';
        details.cancelleftButtonText ='Yes';
        details.cancelleftButtonhref='/user/' + _id;

        details.cancelrightButtonText ='No';
        details.cancelrightButtonhref='#';

        details.self_username = req.user.username;

        res.render('change_password', details);
    },

    postFirstTimeChangePW: function(req, res) {
        const new_pw = req.body.new_pw;
        const confirm_new_pw = req.body.confirm_new_pw;
        const newUser = false;


        const user = {'password': bcrypt.hashSync(new_pw, saltRounds),
            'newUser': newUser};

        const query = {username: req.user.username};
        /* User.findById(_id, projection, function(error, result) {
            if (result != null) {
                userId = result._id,
            }
        });*/

        console.log('POST CHANGE');

        /* User.updateOne(query, user, function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect(`/edit_user/${req.params._id}`);
            }
        });*/

        if (new_pw === confirm_new_pw) {
            User.updateOne(query, user, function(err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect('/');
                }
            });
        } else {
            console.log('password not the same');
        }
    },

};

module.exports = loginController;
