/*
    Unit Testing for db
*/

// import dependencies
require('dotenv').config();
const db = require('./models/db.js');
const User = require('./models/modelUser.js');
const Item = require('./models/modelItem.js');
const Order = require('./models/modelOrder.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// connects to the db
db.connect(process.env.MONGODB_URL);

// create a user and insert it to the collection
let i = 0;
while (i<5) {
    const item = {
        itemName: 'name'+i,
        itemType: 'Frozen Goods',
        itemPrice: 23.69+i,
        availability: false,
        beginningValue: 240,
        totalReleased: 100,
        pullout: 0,
        totalEnd: 140,
        physicalCount: 140,
        branch:
            ['Malingap Street', 'Visayas Avenue', 'Mandaluyong', 'E.Rodriguez'],
        quantity: [101, 102, 103, 104],
    };
    db.insertOne(Item, item, () =>{
        console.log('item');
    });
    i++;
}


// const users = {
//     userType: 'Commissary',
//     fullName: {
//         firstName: 'First',
//         lastName: 'Last',
//     },
//     branchName: 'Head',
//     password: '12',
//     completeAddress: '123 street 123',
//     phoneNumber: '091231231',
//     postalCode: '1234',
// };

// users.password = bcrypt.hashSync(users.password, saltRounds);
// db.insertOne(User, users, ()=>{
//     console.log('user');
// });

// // create an item and insert it to the collection
// const item = {
//     itemName: 'Cashew Nuts',
//     itemType: 'Frozen Goods',
//     quantityDate: {
//         beginningValue: 100,
//         delivery: 50,
//         totalStart: 20,
//         date: Date.now(),
//     },
// };
// db.insertOne(Item, item, () =>{
//     console.log('item');
// });

// // create an order and insert it to the collection
// const order = {
//     items: [
//         {
//             itemName: 'Nuts',
//             itemType: 'Condiments',
//         },
//         {
//             itemName: '123',
//             itemType: '456',
//         },
//     ],
//     deliverTo: 'There',
//     deliverFrom: 'Here',
//     status: 'In Progress',
// };
// db.insertOne(Order, order, ()=>{
//     console.log('order');
// });
