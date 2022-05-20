const db = require('../models/db.js');
const User = require('../models/modelUser.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const edituserController = {

    getEditUser: function(req, res) {
        const _id = req.params._id;
        const projection = '';

        User.findById(_id, projection, function(error, result) {
            if (result != null) {
                const details = {
                    'firstName': result.fullName.firstName,
                    'lastName': result.fullName.lastName,
                    'completeAddress': result.completeAddress,
                    'phoneNumber': result.phoneNumber,
                    'branchName': result.branchName,
                    'postalCode': result.postalCode,
                    'email': result.email,
                    'city': result.city,
                    'userType': result.userType,
                    'userId': _id,
                    'branchName': result.branchName,
                    'username': result.username,
                };

                if (details.userType === 'Franchisee') {
                    details.branchNameFranch = true;
                } else {
                    details.branchNameFranch = false;
                }

                details.confirmPopupText =
                'Are you sure you want to save your changes?';
                details.confirmleftButtonText ='Yes';
                details.confirmleftButtonhref='#';
                details.confirmrightButtonText ='No';
                details.confirmrightButtonhref='/user/' + details.userId;

                details.formConfirmSubmit = 'edit-form-proper';

                details.cancelPopupText =
                'Are you sure you want to discard your changes?';
                details.cancelleftButtonText ='Yes';
                details.cancelleftButtonhref='/user/' + details.userId;

                details.cancelrightButtonText ='No';
                details.cancelrightButtonhref='#';

                details.deletePopupText =
                'Are you sure you want to delete this user?';
                details.deleteleftButtonText ='Yes';
                details.deleteleftButtonhref='/viewUsers/' + details.userType;
                details.deleterightButtonText ='No';
                // details.deleterightButtonhref='/edituser/' + details.userId;
                details.self_username = req.user.username;
                res.render('edit_user', details);
            }
        });
    },

    postEditUser: function(req, res) {
        const fullName = {
            firstName: req.body.edit_fName,
            lastName: req.body.edit_lName,
        };

        let user = {};

        const userType = req.body.user_type;

        if (userType === 'Franchisee') {
            user = {
                'fullName': fullName,
                'completeAddress': req.body.edit_address,
                'phoneNumber': req.body.edit_number,
                'postalCode': req.body.edit_postal,
                'city': req.body.edit_city,
                'email': req.body.edit_email,
                'username': req.body.edit_username,
                'branchName': req.body.edit_branch,
            };
        } else {
            user = {
                'fullName': fullName,
                'completeAddress': req.body.edit_address,
                'phoneNumber': req.body.edit_number,
                'postalCode': req.body.edit_postal,
                'city': req.body.edit_city,
                'email': req.body.edit_email,
                'username': req.body.edit_username,
            };
        }

        const query = {_id: req.params._id};
        /* User.findById(_id, projection, function(error, result) {
            if (result != null) {
                userId = result._id,
            }
        });*/

        User.updateOne(query, user, function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect(`/user/${req.params._id}`);
            }
        });
    },

    getDeleteUser: function(req, res) {
        const query = {_id: req.params._id};

        const _id = req.params._id;
        const projection = '';
        let userType = '';

        User.findById(_id, projection, function(error, result) {
            if (result != null) {
                userType = result.userType;
            };
        });

        User.findByIdAndRemove(query, function(err, doc) {
            res.redirect('/viewUsers/' + userType);
        });
    },

    getChangePassword: function(req, res) {
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

        res.render('edit_password', details);
    },

    getFranchChangePassword: function(req, res) {
        const _id = req.params._id;

        const details = {};

        details.confirmPopupText =
                'Are you sure you want to save your changes?';
        details.confirmleftButtonText ='Yes';
        details.confirmleftButtonhref='#';
        details.confirmrightButtonText ='No';
        details.confirmrightButtonhref='/product-page';

        details.formConfirmSubmit = 'password-form-proper';

        details.cancelPopupText =
                'Are you sure you want to discard your changes?';
        details.cancelleftButtonText ='Yes';
        details.cancelleftButtonhref='/product-page';

        details.cancelrightButtonText ='No';
        details.cancelrightButtonhref='#';

        details.self_username = req.user.username;

        res.render('settings_track', details);
    },

    postFranchChangePassword: function(req, res) {
        const new_pw = req.body.new_pw;
        const confirm_new_pw = req.body.confirm_new_pw;

        user = {'password': bcrypt.hashSync(new_pw, saltRounds)};

        const query = {_id: req.params._id};
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
                    res.redirect('/product-page');
                }
            });
        } else {
            console.log('password not the same');
        }
    },




    postChangePassword: function(req, res) {
        const new_pw = req.body.new_pw;
        const confirm_new_pw = req.body.confirm_new_pw;

        user = {'password': bcrypt.hashSync(new_pw, saltRounds)};

        const query = {_id: req.params._id};
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
                    res.redirect(`/user/${req.params._id}`);
                }
            });
        } else {
            console.log('password not the same');
        }
    },

    
    getCommChangePassword: function(req, res) {
        const _id = req.params._id;

        const details = {};

        details.confirmPopupText =
                'Are you sure you want to save your changes?';
        details.confirmleftButtonText ='Yes';
        details.confirmleftButtonhref='/inventory-page';
        details.confirmrightButtonText ='No';
        details.confirmrightButtonhref='/inventory-page';

        details.formConfirmSubmit = 'password-form-proper';

        details.cancelPopupText =
                'Are you sure you want to discard your changes?';
        details.cancelleftButtonText ='Yes';
        details.cancelleftButtonhref='/inventory-page';

        details.cancelrightButtonText ='No';
        details.cancelrightButtonhref='#';

        details.self_username = req.user.username;

        res.render('settings_comm', details);
    },

    postCommChangePassword: function(req, res) {
        const new_pw = req.body.new_pw;
        const confirm_new_pw = req.body.confirm_new_pw;

        user = {'password': bcrypt.hashSync(new_pw, saltRounds)};

        const query = {_id: req.params._id};
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
                    res.redirect('/inventory-page');
                }
            });
        } else {
            console.log('password not the same');
        }
    },

};

module.exports = edituserController;
