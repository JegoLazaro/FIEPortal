const mongoose = require('mongoose');
const db = require('../models/db.js');
const Item = require('../models/modelItem.js');
const User = require('../models/modelUser.js');

const inventoryController = {
    getInventoryPage: function(req, res) {
        details={};
        details.self_username = req.user.username;
        details.userId = req.user._id;
        // console.log(details.self_username);
        res.render('inventory', details);
    },
    getInventoryItems: function(req, res) {
        const details ={};
        const itemType = req.params.itemType;
        if (itemType =='View all') {
            query = {};
            details.notViewAll = false;
        } else {
            query = {itemType: itemType};
            details.notViewAll = true;
        }

        details.userId = req.user._id;

        // Item.distinct('branch', function(err, branches)

        User.distinct('branchName', {'branchName': {$ne: ''}}
            , function(err, branches) {
                // console.log(branches);
                details.branch = branches;
                db.findMany(Item, query, '', function(result) {
                    if (result != null) {
                        details.item = result.map((arr)=> ({
                            'itemName': arr['itemName'],
                            'itemType': arr['itemType'],
                            'itemPrice': Number(arr['itemPrice']).toFixed(2),
                            'beginningValue': arr['beginningValue'],
                            'delivery': arr['delivery'],
                            'totalStart': arr['totalStart'],
                            'totalReleased': arr['totalReleased'],
                            'pullout': arr['pullout'],
                            'end': arr['totalEnd'],
                            'physicalCount': arr['physicalCount'],
                            'difference': arr['difference'],
                            'match': arr['match'],
                            '_id': arr['_id'],
                            'branch': arr['branch'],
                            'quantities': {quantity: arr['quantity'],
                                branch: arr['branch']},
                            'available': arr['availability'],
                            'notes': arr['notes'],
                        }));
                        details.itemType = itemType;
                        details.self_username = req.user.username;

                        details.item.forEach((item) => {
                            // console.log(item.itemType);
                            const diff = branches.filter(
                                (x) => !item.branch.includes(x));

                            diff.forEach(function(difference, index) {
                                // add the branches that
                                // are not in the original list
                                item.branch.push(difference);
                                // copy the changes
                                item.quantities.branch = item.branch;
                                // add 0 quantity for each new branch
                                item.quantities.quantity.push(0);
                            });

                            // make object array of the two arrays
                            const list = [];
                            for (let i = 0; i < item.branch.length; i++) {
                                list.push({'branch': item.quantities.branch[i],
                                    'quantity': item.quantities.quantity[i]});
                            };

                            // sort according to branch name
                            list.sort(function(a, b) {
                                // eslint-disable-next-line max-len
                                return ((a.branch < b.branch) ? -1 : ((a.branch == b.branch) ? 0 : 1));
                            });

                            // return the object into their original form
                            for (let j = 0; j < list.length; j++) {
                                item.quantities.branch[j] = list[j].branch;
                                item.quantities.quantity[j] = list[j].quantity;
                            }
                            item.branch = item.quantities.branch;
                        });
                        if (itemType == 'View all') {
                            details.item.sort(function(a, b) {
                                // console.log(details.item);
                                if (a.itemType < b.itemType) return -1;
                                else if (a.itemType == b.itemType) {
                                    if (a.itemName < b.itemName) return -1;
                                    else return 1;
                                }
                            });
                            // console.log('---');
                            // details.item.forEach(function(arr) {
                            //     console.log(arr.itemName +' '+arr.itemType);
                            // });
                        }
                        // console.log(details.item[6].branch);
                        // const a = Item.distinct('itemName').sort();
                        // const a = Item.find();
                        res.render('inventory_item', details);
                    }
                });
            });
    },
    postEditItem: function(req, res) {
        const itemName = req.body.itemName;
        const itemType = req.body.itemType;
        const itemPrice = req.body.itemPrice;
        // const availability = req.body.availability;
        const beginningValue= req.body.beginningValue;
        const delivery= req.body.delivery;
        const totalStart = req.body.totalStart;
        const totalReleased= req.body.totalReleased;
        const pullout= req.body.pullout;
        const totalEnd= req.body.totalEnd;
        const physicalCount= req.body.physicalCount;
        const difference = req.body.difference;
        const match = req.body.match;
        const notes = req.body.notes;
        const branch = req.body.branches;
        const quantity = req.body.orderquantity;
        const _id = req.body._id;

        // eslint-disable-next-line new-cap
        // const query = {_id: mongoose.Types.ObjectId(_id)};
        console.log(req.body);
        const item = {
            itemName: itemName,
            itemType: itemType,
            itemPrice: Number(itemPrice).toFixed(2),
            beginningValue: beginningValue,
            delivery: delivery,
            totalStart: totalStart,
            totalReleased: totalReleased,
            pullout: pullout,
            totalEnd: totalEnd,
            physicalCount: physicalCount,
            difference: difference,
            match: match,
            notes: notes,
            branch: branch,
            quantity: quantity,
        };
        // console.log(req.body);
        // console.log(item.branch);
        // console.log(item.quantity);
        console.log('id: ' + _id);
        if (_id == null || _id == '') {
            query = {itemName: itemName};
            console.log('id null');
        } else query = {_id: mongoose.Types.ObjectId(_id)};
        db.findOne(Item, query, '', function(result) {
            console.log(result);
            if (result == null) {
                db.insertOne(Item, item, function(flag, id) {
                    if (flag) {
                        // adding the item is a success
                        // console.log(id);
                        console.log('added');
                        // console.log(id);
                        res.status(200).send({flag: true, _id: id});
                    } else {
                        res.redirect('/error');
                    }
                });
            } else {
                const query = {_id: result._id};
                // console.log(query);
                db.updateOne(Item, query, item, function(flag) {
                    if (flag) {
                        // console.log(true);
                        res.status(200).send({flag: true});
                    } else {
                        // console.log(flag);
                        res.send({flag: false});
                    }
                });

                /* Item.updateOne(query, item, function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });*/
            }
        });

        /* console.log(query);
        db.updateOne(Item, query, item, function(flag) {
            if (flag) {
                // console.log(true);
                res.status(200).send(true);
            } else {
                console.log(flag);
                res.send(false);
            }
        });*/
    },
    postDeleteItem: function(req, res) {
        const _id = req.body._id;
        // eslint-disable-next-line new-cap
        db.deleteOne(Item, {_id: mongoose.Types.ObjectId(_id)}, function(flag) {
            res.send(flag);
        });
    },
    postChangeAvailability: function(req, res) {
        const _id = req.body._id;
        const availability = req.body.availability;

        const item = {
            availability: availability,
        };


        db.updateOne(Item, // eslint-disable-next-line new-cap
            {_id: mongoose.Types.ObjectId(_id)}, item, function(flag, result) {
                if (flag) {
                    res.status(200).send(flag);
                }
            });
    },
    getCheckItemName: function(req, res) {
        const itemName = req.query.itemName;
        // eslint-disable-next-line max-len
        db.findOne(Item, {itemName: itemName}, 'itemName _id', function(result) {
            res.send(result);
        });
    },
};

/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = inventoryController;
