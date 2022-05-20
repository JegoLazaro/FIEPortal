/* eslint-disable max-len */
const mongoose = require('mongoose');
const db = require('../models/db.js');
const Item = require('../models/modelItem.js');
const Order = require('../models/modelOrder.js');
const User = require('../models/modelUser.js');
const dateFormat = require('dateformat');

const commOrderController = {
    getOrders: function(req, res) {
        const details = {};
        const status = req.params.status;
        let query;
        if (status == 'all') {
            query = {};
        } else {
            query = {status: status};
        }

        db.findMany(Order, query, '', function(result) {
            if (result != null) {
                details.order = result;
                // console.log(details.order);
                // // console.log(result[0].cart);
                // e = details.order[x]
                details.order.forEach(function(e) {
                    e.itemCount =
                        Object.keys(e.cart.items).length;
                    // console.log(e.cart.items);
                    const itemNames = [];
                    const itemPrices = [];
                    const itemQty = [];
                    // eslint-disable-next-line guard-for-in
                    for ( const x in e.cart.items) {
                        itemNames.push(e.cart.items[x].item.itemName);
                        itemPrices.push(e.cart.items[x].item.itemPrice);
                        itemQty.push(e.cart.items[x].qty);
                    }
                    // console.log(itemNames);
                    // console.log(itemPrices);
                    // console.log(itemQty);
                    e.itemNames = itemNames;
                    e.itemPrices = itemPrices;
                    e.itemQty = itemQty;
                    e.orderId = e._id;
                    // e.cart.itemArr = JSON.parse(e.cart.items);
                    // console.log(e.cart.itemArr);
                });
                details.order.reverse();
                details.userId = req.user._id;
                res.render('comm_track_order', details);
            }
        } );
    },
    postSaveOrder: function(req, res) {
        const status = req.body.status;
        const _id = req.body._id;
        const d = req.body.date;
        const date = dateFormat(d, 'ddd mmm dd yyyy HH:MM:ss');
        const update = {status: status};
        if (status == 'Confirmed') {
            update.dateConfirmed = date;
            update.dateConfirmedType = date;
            console.log(update.dateConfirmed);
        }

        if (status != '') {
            if (status == 'Confirmed') {
                Order.findByIdAndUpdate(_id, update, function(err, order) {
                    console.log(order);

                    // eslint-disable-next-line guard-for-in
                    for (const item in order.cart.items) {
                        (function(x) {
                            Item.findById(order.cart.items[x].item._id, '', function(err, res) {
                                console.log(res);
                                const update = res;
                                const idx = update.branch.indexOf(order.deliverTo);
                                const orderItem = order.cart.items[x];
                                const ordered = orderItem.qty;
                                if (idx > -1) {
                                    update.quantity[idx] += ordered;
                                    update.totalReleased += ordered;
                                    update.totalEnd -= ordered;
                                    update.difference = update.totalEnd - update.physicalCount;
                                    update.match = (update.difference == 0);
                                    Item.findByIdAndUpdate(order.cart.items[x].item._id, update, function(err, result) {
                                        console.log(result);
                                    });
                                } else {
                                    update.quantity.push(ordered);
                                    update.branch.push(order.deliverTo);
                                    update.totalReleased =+ ordered;
                                    update.totalEnd -= ordered;
                                    update.difference = upadte.totalEnd - update.physicalCount;
                                    update.match = (update.differrence == 0);
                                    Item.findByIdAndUpdate(order.cart.items[x].item._id, update, function(err, result) {
                                        console.log(result);
                                    });
                                }
                            });
                        })(item);
                    }


                    const returnObj = {date: date};
                    if (err) {
                        console.log(err);
                        returnObj.flag = false;
                        res.send(returnObj);
                    } else {
                        returnObj.flag = true;
                        res.send(returnObj);
                    }
                });
            } else if (status =='Cancelled') {
                Order.findByIdAndUpdate(_id, update, function(err, order) {
                    console.log(order);

                    // eslint-disable-next-line guard-for-in
                    for (const item in order.cart.items) {
                        (function(x) {
                            Item.findById(order.cart.items[x].item._id, '', function(err, res) {
                                console.log(res);
                                const update = res;
                                const idx = update.branch.indexOf(order.deliverTo);
                                const orderItem = order.cart.items[x];
                                const ordered = orderItem.qty;
                                if (idx > -1) {
                                    update.quantity[idx] -= ordered;
                                    update.totalReleased -= ordered;
                                    update.totalEnd += ordered;
                                    update.difference = update.totalEnd - update.physicalCount;
                                    update.match = (update.difference == 0);
                                    Item.findByIdAndUpdate(order.cart.items[x].item._id, update, function(err, result) {
                                        console.log(result);
                                    });
                                }
                            });
                        })(item);
                    }


                    const returnObj = {date: date};
                    if (err) {
                        console.log(err);
                        returnObj.flag = false;
                        res.send(returnObj);
                    } else {
                        returnObj.flag = true;
                        res.send(returnObj);
                    }
                });
            }
        } else {
            console.log('nothing');
            const returnObj = {flag: false};
            res.send(returnObj);
        }
    },
};

module.exports = commOrderController;
