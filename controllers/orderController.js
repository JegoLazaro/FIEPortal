const User = require('../models/modelUser.js');
const Item = require('../models/modelItem.js');
const Cart = require('../models/modelCart');
const Order = require('../models/modelOrder');
const { validationResult } = require('express-validator');
const alert = require('alert'); 
const dateFormat = require('dateformat');


const orderController = {

    getOrderPage: async function(req, res) {
        /*details={};
        details.self_username = req.user.username;

        User.findOne({username: details.self_username})
            .then((user) => {
                if (user) {
                    details.userType = user.userType;
                    details.userId = user._id;
                    console.log(details.userType);
                    res.render('landing_page', details);
                }
            });*/
            details = {};

            details.itemType = req.params.itemType;
            details.username = req.user.username;
            details.userId = req.user._id;

            const href = "/view-order";

            if(req.user.username !== null)
            {
                const allProducts = await Item.find();    

                if(!req.session.cart)
                {
                    return res.render('view_order', {user: req.user, details: req.params.itemType, products: allProducts, items: null, href: href});
                }

                const cart = new Cart(req.session.cart);
                return res.render('view_order', {user: req.user, details: req.params.itemType, products: allProducts, items: cart.generateArray(), totalPrice: cart.totalPrice, qty: cart.items.qty, totalQuantity: cart.totalQty, href: href});
            }
            else
            {
                res.render('SignIn');
            }



    },

    getOrderProductPage: async function(req, res){
        
        /*details = {};
        if(req.user.username !== null)
        {
            details.itemType = req.params.itemType;
            details.username = req.user.username;
            res.render('order_product', details);
        }
        else
        {
            res.render('SignIn');
        }*/

        details = {};

        details.itemType = req.params.itemType;
        details.username = req.user.username;
        details.userId = req.user._id;

        const href = "/order-product/" + details.itemType;


        if(details.itemType === "View All")
        {
            const allProducts = await Item.find();    

            if(!req.session.cart)
            {
                return res.render('order_product', {user: req.user, details: req.params.itemType, products: allProducts, items: null, href: href});
            }

            const cart = new Cart(req.session.cart);
            return res.render('order_product', {user: req.user, details: req.params.itemType, products: allProducts, items: cart.generateArray(), totalPrice: cart.totalPrice, qty: cart.items.qty, totalQuantity: cart.totalQty, href:href});
        }
        else
        {
            const allProducts = await Item.find({itemType: details.itemType});    
            if(!req.session.cart)
            {
                return res.render('order_product', {user: req.user, details: req.params.itemType, products: allProducts, items: null});
            }

            const cart = new Cart(req.session.cart);
            return res.render('order_product', {user: req.user, details: req.params.itemType, products: allProducts, items: cart.generateArray(), totalPrice: cart.totalPrice, qty: cart.items.qty, totalQuantity: cart.totalQty});       
        }

        

    },

    /*getCart: function(req, res){
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {items : {}});

        Item.findById(productId, function(err, product){
            if(err){
                return res.redirect('/product-page');
            }

            cart.add(product, product._id, req.body.qty);
            req.session.cart = cart;
            console.log(req.session.cart);
            //res.redirect('/order-product/' + product.itemType);
            res.redirect('back');

        })
    },*/


    postCart: function(req, res){
        let productId = req.body.id;
        let productQty = req.body.qty;
        let cart = new Cart(req.session.cart ? req.session.cart : {items : {}});

        Item.findById(productId, function(err, product){
            if(err){
                return res.redirect('/product-page');
            }

            if(product.totalEnd >= productQty)
            {
                cart.add(product, product._id, productQty);
                req.session.cart = cart;
                res.redirect('back');
            }
            else
            {
                res.send(500,'showAlert') 
            }

            
            //res.redirect('/order-product/' + product.itemType);

        })
    },


    getReduceItemCart: function(req, res){
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceItem(productId);
        req.session.cart = cart;
        res.redirect('back');
    },

    getAddItemCart: function(req, res){
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.addItem(productId);
        req.session.cart = cart;
        res.redirect('back');
    },



    getRemoveItemCart: function(req, res){
        let productId = req.body.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('back');
    },

    getCheckOut: function(req, res){

        let cart = new Cart(req.session.cart);

        const order = new Order({
            user: req.user,
            cart: cart,
            deliverTo: req.user.branchName,
        });

        order.save(function(err, result){
            req.session.cart = null;
            res.redirect('back');
        })
    },

    getConfirmOrder: function(req, res){
        if(!req.session.cart)
        {
            return res.redirect('/product-page');
        }

        const cart = new Cart(req.session.cart);
        return res.render('confirm_order', {user: req.user, items: cart.generateArray(), totalPrice: cart.totalPrice, qty: cart.items.qty, totalQuantity: cart.totalQty});   
    },

    postConfirmOrder: function(req, res){
        let cart = new Cart(req.session.cart);

        

        const fullName = {
            firstName: req.body.fname,
            lastName: req.body.lname,
        };
        const phonenumber = req.body.phonenumber;
        const branchName = req.user.branchName;
        const email = req.body.email;
        const bldg = req.body.apartment;
        const completeAddress = req.body.houseadd;
        const postalCode = req.body.zip;
        const city = req.body.city;

        const userDetails = {
            fullName: fullName,
            branchName: branchName,
            completeAddress: completeAddress,
            phoneNumber: phonenumber,
            postalCode: postalCode,
            city: city,
            email: email,
            bldg: bldg,
        };
        var day = dateFormat(new Date(), "ddd mmm dd yyyy HH:MM:ss");

        const order = new Order({
            user: req.user,
            userDetails: userDetails,
            cart: cart,
            deliverTo: branchName,
            dateOrdered: day,
            dateOrderedType: day,
            status: "Pending"
        });


        console.log(day)
        order.save(function(err, result){
            req.session.cart = null;
            res.redirect('/track-order');
        })
    },

    


};

module.exports = orderController;
