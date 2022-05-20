const User = require('../models/modelUser.js');

const homeController = {

    /* getFavicon: function (req, res) {
        res.status(204);
    },*/

    getHomePage: function(req, res) {
        details={};
        details.self_username = req.user.username;

        User.findOne({username: details.self_username})
            .then((user) => {
                if (user) {
                    details.userType = user.userType;
                    details.userId = user._id;
                    console.log(details.userType);
                    res.render('landing_page', details);
                }
            });
        // res.render('landing_page', details);
    },
};

/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = homeController;
