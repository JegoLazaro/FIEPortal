

const accessController = {
    getClosedPage: function(req, res, next) {
        const date = new Date();
        // console.log(req.user);
        if (req.user) {
            console.log('check time');
            if (req.user.userType == 'Franchisee') {
                // eslint-disable-next-line max-len
                if (!(date.getHours() >= 8 && date.getHours() < 17)) { // x < 8 am || x > 5 pm -> closed hours
                    console.log('wrong time');
                    res.render('closed');
                } else {
                    next();
                }
            } else {
                next();
            }
        } else {
            next();
        }
    },
};

module.exports = accessController;
