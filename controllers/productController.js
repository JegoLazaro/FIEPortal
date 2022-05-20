const mongoose = require('mongoose');
const db = require('../models/db.js');
const Item = require('../models/modelItem.js');
// const ITEMTYPE = require('../helper/itemType.js');

const itemController = {
    postAddItem: function(req, res) {
        const itemName = req.body.itemName;
        const itemType = req.body.itemType;
        const itemPrice = req.body.itemPrice;

        const item = {
            itemName: itemName,
            itemType: itemType,
            itemPrice: itemPrice,
        };


        db.insertOne(Item, item, function(flag) {
            if (flag) {
                res.status(200).send().redirect('/items');
            }
        });
    },
};

module.exports = itemController;
