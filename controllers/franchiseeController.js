const User = require('../models/modelUser.js');

const franchiseeController = {

    getHomePage: function(req, res) {
        details={};
        details.self_username = req.user.username;

        User.findOne({username: details.self_username})
            .then((user) => {
                if (user) {
                    details.userType = user.userType;
                    details.userId = user._id;
                    console.log(details.userType);
                    res.render('franch_landing_page', details);
                }
            });

        //res.render('franch_landing_page');
    },
};

module.exports = franchiseeController;
