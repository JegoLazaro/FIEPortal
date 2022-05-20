const mongoose = require('mongoose');
const db = require('../models/db.js');
const Item = require('../models/modelItem.js');
const Order = require('../models/modelOrder');
const User = require('../models/modelUser');
var clone = require('clone');
const dateFormat = require('dateformat');

const trackingController = {
    getTrackingPage: async function(req, res) {
        //console.log(req.user._id);

        let ha = {}

        //ha.hatdog = await Order.findMany({user: req.user._id});  
        const branch = req.user.branchName;  

        //console.log(allOrders[0]);

        let allOrderDetails = []

        orderDetails = {}

        temp = {}

        let getOrder;

        const details = {};
        let query;

        let i = 0;
        
        query = {user: req.user._id};

        db.findMany(Order, query, '', async function(result) {
            if (result != null) {
                details.order = result;
                const allOrders = await Order.find({user: req.user._id});  

                details.order.forEach(function(e) {
                    e.itemCount =
                        Object.keys(e.cart.items).length;
                    // console.log(e.cart.items);
                    orderDetails.itemName = []
                    orderDetails.itemPrice = []
                    //orderDetails.itemQty = []
                    // eslint-disable-next-line guard-for-in
                    for ( const x in e.cart.items) {
                        orderDetails.itemName.push(e.cart.items[x].item.itemName);
                        orderDetails.itemPrice.push(e.cart.items[x].item.itemPrice);  
                    }
                    // console.log(itemNames);
                    // console.log(itemPrices);
                    // console.log(itemQty);
                    temp = clone(orderDetails);
                    //console.log(orderDetails);

                    allOrderDetails.push(temp);

                    //allOrders.totalItems = temp;

                    //allOrders[i].items = {totalItems: temp}
                  
                    console.log(temp);
                    allOrders[i].allItems = {totalItems: temp};
                    //console.log(allOrderDetails);

                    allOrders[i].branch = req.user.branchName;

                    i++
                    // e.cart.itemArr = JSON.parse(e.cart.items);
                    // console.log(e.cart.itemArr);
                });

                res.render('franch_track_order', {orders: allOrders, userId: req.user._id});       

            }


        })


       //console.log(Object.keys(order)[0]);

       
        //console.log(allOrders);

        
        //return res.render('track_order', {orders: allOrders, orderDetails: allOrderDetails});     
  
        //res.render('track_order');
    },

    postCancelOrder: function(req, res){
        
        let order_details = {};

        order_details = {
            'status': 'Cancelled',
        };

        const query = {_id: req.body.id};
        /* User.findById(_id, projection, function(error, result) {
            if (result != null) {
                userId = result._id,
            }
        });*/

        Order.updateOne(query, order_details, function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect('back');
            }
        });
    },

    postReceivedOrder: function(req, res){
        
        let order_details = {};

        var day = dateFormat(new Date(), "ddd mmm dd yyyy HH:MM:ss");

        order_details = {
            'status': 'Received',
            'dateReceived':  day,
            'dateReceivedType': day      
        };

        const query = {_id: req.body.id};
        /* User.findById(_id, projection, function(error, result) {
            if (result != null) {
                userId = result._id,
            }
        });*/

        Order.updateOne(query, order_details, function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect('back');
            }
        });
    }
};

module.exports = trackingController;
