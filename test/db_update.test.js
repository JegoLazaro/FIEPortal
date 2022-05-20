require('dotenv').config();
process.env.NODE_ENV = 'test';
// import module `mongoose`
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const db = require('../models/db.js');

console.log(process.env.NODE_ENV);
db.connect();

before((done) =>{
    console.log('b4');
    const users =[];
    let i = 0;
    while (i < 10) {
        users.push(
            {userType: 'Commissary',
                fullName: {firstName: 'fn'+i, lastName: 'ln'+i},
                username: 'username1'+i,
                password: 'password'+i},
        );
        i++;
    };
    db.insertMany(User, users, function(err, res) {
        done();
    } );
});

after(()=>{
    console.log('after');
    mongoose.connection.collections.users.drop(()=>{
    });
});
const assert = require('chai').assert;
const User = require('../models/modelUser');

describe('Update operations', ()=>{
    it('update a user', (done) =>{
        // eslint-disable-next-line max-len
        db.updateOne(User, {username: 'username11'}, {password: 'pass'}, function(flag) {
            assert.isTrue(flag);
        });
        done();
    });

    it('updates multiple users', (done) => {
        // eslint-disable-next-line max-len
        db.updateMany(User, {userType: 'Commissary'}, {password: 'zz'}, function(flag) {
            assert.isTrue(flag);
        });
        done();
    });
});
