// import db and user models
const db = require('../models/db.js');
const User = require('../models/modelUser.js');
// const USER_TYPE = require('../helper/userType');
const accountController = {

    // gets the list of all user of a certain type
    getAccounts: function(req, res) {
        const type = req.params.userType;
        const query = {userType: type};
        const projection = 'fullName _id username';
        const details = {};
        // console.log(req.user);
        db.findMany(User, query, projection, function(result) {
            // console.log(result);
            if (result != null) {
                details.user = result.map((arr)=> ({
                    'userName': arr['fullName'].firstName + ' ' +
                                arr['fullName'].lastName,
                    'userId': arr['_id'],
                    'username': arr['username'],
                }));
                details.userType = type;
                details.self_username = req.user.username;
                // console.log(details.user);
                // TODO: check handlebars names
                // Franchisees show branch name
                // Admin and commi show user's name
                res.render('view_users', details);
            }
        });
    },

    // get a specific account
    getAccount: function(req, res) {
        const _id = req.params.userId;
        const projection = '';
        User.findById(_id, projection, function(error, result) {
            if (result != null) {
                const details = {
                    'firstName': result.fullName.firstName,
                    'lastName': result.fullName.lastName,
                    'email': result.email,
                    'completeAddress': result.completeAddress,
                    'city': result.city,
                    'phoneNumber': result.phoneNumber,
                    'postalCode': result.postalCode,
                    'userType': result.userType,
                    'userId': result._id,
                    'branchName': result.branchName,
                    'username_details': result.username,
                };

                if (details.userType === 'Franchisee') {
                    details.branchNameFranch = true;
                } else {
                    details.branchNameFranch = false;
                }
                details.self_username = req.user.username;
                res.render('user_info', details);
            }
        });
    },
};

module.exports = accountController;
