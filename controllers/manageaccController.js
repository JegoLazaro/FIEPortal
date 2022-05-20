const manageaccController = {

    getManageAccCreatePage: function(req, res) {
        const roles = {};

        roles.hrefcoadmin = '/registration/Co-administrator';
        roles.hreffranch = '/registration/Franchisee';
        roles.hrefcomm = '/registration/Commissary';

        roles.self_username = req.user.username;
        // console.log(req.user);
        res.render('manage_account', roles);
    },

    getManageAccViewPage: function(req, res) {
        const roles = {};

        roles.hrefcoadmin = '/viewUsers/Co-administrator';
        roles.hreffranch = '/viewUsers/Franchisee';
        roles.hrefcomm = '/viewUsers/Commissary';

        roles.self_username = req.user.username;
        res.render('manage_account', roles);
    },
};

/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = manageaccController;
