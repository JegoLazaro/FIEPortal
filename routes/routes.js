// import modules
const express = require('express');
const app = express();
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');
const manageaccController = require('../controllers/manageaccController');

const registerController = require('../controllers/registerController');
const edituserController = require('../controllers/edituserController');
const accountController = require('../controllers/accountController.js');

const inventoryController = require('../controllers/inventoryController');
const productController = require('../controllers/productController');
const logoutController = require('../controllers/logoutController');
const franchiseeController = require('../controllers/franchiseeController');
const orderController = require('../controllers/orderController');
const trackingController = require('../controllers/trackingController');
const commOrderController = require('../controllers/commOrderController');
const accessController = require('../controllers/accessController.js');

app.get('/', loginController.getLogInPage);
app.post('/', loginController.postLogIn);

app.use(accessController.getClosedPage);

app.get('/change_pw', loginController.getFirstTimeChangePW);
app.post('/change_pw', loginController.postFirstTimeChangePW);

app.get('/logout', logoutController.getLogOut);

app.get('/home', homeController.getHomePage);
app.get('/inventory-page', inventoryController.getInventoryPage);
app.get('/product-page', franchiseeController.getHomePage);
app.get('/view-order', orderController.getOrderPage);

app.get('/order-product/:itemType', orderController.getOrderProductPage);

app.get('/manage-account-create', manageaccController.getManageAccCreatePage);
app.get('/manage-account-view', manageaccController.getManageAccViewPage);
app.get('/registration/:userType(Co-administrator|Franchisee|Commissary)',
    registerController.getRegister);
app.post('/registration', registerController.postRegister);
app.get('/checkUsername', registerController.getCheckUserName);

app.get('/viewUsers/:userType(Co-administrator|Franchisee|Commissary)',
    accountController.getAccounts);

// app.get('/register', registerController.getRegister);
app.get('/edit_user/:_id', edituserController.getEditUser);
app.post('/edit_user/:_id', edituserController.postEditUser);
app.get('/checkAccInfo', registerController.getCheckAcc);

app.get('/delete/:_id', edituserController.getDeleteUser);
app.get('/user/:userId', accountController.getAccount);

app.get('/edit_password/:_id', edituserController.getChangePassword);
app.post('/edit_password/:_id', edituserController.postChangePassword);

app.get('/inventory/:itemType', inventoryController.getInventoryItems);
app.post('/editInventoryItem', inventoryController.postEditItem);
app.post('/deleteItem', inventoryController.postDeleteItem);
app.post('/changeAvailability', inventoryController.postChangeAvailability);
app.get('/checkItemName', inventoryController.getCheckItemName);

// app.get('/add-to-cart/:id', orderController.getCart);
// app.post('/view-order', orderController.postCart);
app.post('/order-product', orderController.postCart);
app.get('/reduce-item/:id', orderController.getReduceItemCart);
app.get('/add-item/:id', orderController.getAddItemCart);
app.post('/remove-item-cart', orderController.getRemoveItemCart);
// app.get('/orders', orderController.getOrders);

app.get('/confirm-order', orderController.getConfirmOrder);
app.post('/confirm-order', orderController.postConfirmOrder);

app.get('/check-out', orderController.getCheckOut);

app.get('/track-order', trackingController.getTrackingPage);

app.get('/total-orders/:status', commOrderController.getOrders);
app.post('/postCommSaveOrder', commOrderController.postSaveOrder);

app.post('/cancel-track-order', trackingController.postCancelOrder);
app.post('/received-track-order', trackingController.postReceivedOrder);

app.get('/franch-change-pw/:_id', edituserController.getFranchChangePassword);
app.post('/franch-change-pw/:_id', edituserController.postFranchChangePassword);

app.get('/comm-change-pw/:_id', edituserController.getCommChangePassword);
app.post('/comm-change-pw/:_id', edituserController.postCommChangePassword);

module.exports = app;
