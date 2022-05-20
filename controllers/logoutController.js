const logoutController = {
    getLogOut: function(req, res){
        req.logout();
        //req.session.destroy();
        if (req.session) {
            req.session.destroy(function(err) {
                res.redirect('/');
            });
        }
        else {
            res.redirect('/');
        }
    }
}

module.exports = logoutController;
