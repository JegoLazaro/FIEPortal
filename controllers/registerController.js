// import modules
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../models/db.js');
const User = require('../models/modelUser.js');

const registerController = {

    // getting the signup page
    getRegister: function(req, res) {
        // add details if role per page
        // res.render('register', details);
        const details ={};

        // Capitalize the first letter of the word
        details.userType = req.params.userType.charAt(0).toUpperCase() +
                            req.params.userType.slice(1);

        details.popupText =
                'User successfully added to the <span style= "color:red;"> '+
                details.userType + ' </span> database!';

        details.leftButtonText ='View';
        details.leftButtonhref='/home';

        details.rightButtonText ='Home';
        details.rightButtonhref='/home';

        details.cancelPopupText = 'Are you sure you want to cancel?';

        details.cancelleftButtonText ='Yes';
        details.cancelleftButtonhref ='/manage-account-create';

        details.cancelrightButtonText ='No';
        details.cancelrightButtonhref ='#';

        // add branch flag
        if (details.userType === 'Franchisee') details.branchNameFlag = true;
        else details.branchNameFlag = false;

        details.self_username = req.user.username;
        res.render('registration', details);
    },

    // processing the signup page
    postRegister: function(req, res) {
        const errors = validationResult(req);

        // have errors
        if (!errors.isEmpty()) {
            errors = errors.errors;
            // details.error = '';
            // for (i = 0; i < errors.length; i++) {
            //     details.error += errors[i].msg;
            // }

            // res.render('register', details);
        } else {
            // retrieve value from POST method
            // console.log(req.body);
            const userType = req.body.userType;
            const fullName = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            };
            const phonenumber = req.body.phonenumber;
            const branchName = req.body.branchName;
            const email = req.body.email;
            const password = fullName.lastName+phonenumber.charAt(4);
            const completeAddress = req.body.completeAddress;
            const postalCode = req.body.postalCode;
            const city = req.body.city;
            const username = req.body.username;
            const newUser = true;
            console.log(password);
            // userId =
            // await (User.findOne().sort('-userId').exec().userId + 1);

            // console.log(userType);
            const user = {
                userType: userType,
                fullName: fullName,
                branchName: branchName,
                password: bcrypt.hashSync(password, saltRounds),
                completeAddress: completeAddress,
                phoneNumber: phonenumber,
                postalCode: postalCode,
                city: city,
                email: email,
                username: username,
                newUser: newUser
            };
            // console.log(user);
            // user id for redirection
            db.insertOne(User, user, function(flag, id) {
                if (flag) {
                    // adding the user is a success
                    // console.log(id);
                    res.status(200).send({flag: true, _id: id});
                } else {
                    res.redirect('/error');
                }
            });
        }
    },

    getCheckUserName: function(req, res) {
        const username = req.query.username;
        console.log('here');
        db.findOne(User, {username: username}, 'username', function(result) {
            res.send(result);
        });
    },

    getCheckAcc: function(req, res) {
        const username = req.query.username;
        db.findOne(User, {username: username}, '_id username', function(result) {
            res.send(result);
        });
    },

};

module.exports = registerController;
