require('dotenv').config();
process.env.NODE_ENV = 'test';
// import module `mongoose`
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const db = require('../models/db.js');

db.connect();
beforeEach((done) =>{
    mongoose.connection.collections.users.drop(()=>{
        done();
    });
});

const assert = require('chai').assert;
const User = require('../models/modelUser');

describe('Insertion operations', ()=>{
    it('creates a user', (done) =>{
        const user =({userType: 'Commissary',
            fullName: {firstName: 'fn', lastName: 'ln'},
            username: 'username1',
            password: 'password'});
        db.insertOne(User, user, function(err, res) {
            assert.equal(err, true);
        } );
        done();
    });

    it('creates a user with no firstname', (done) =>{
        const user =({userType: 'Commissary',
            fullName: {lastName: 'ln'},
            username: 'username2',
            password: 'password'});
        db.insertOne(User, user, function(err, res) {
            assert(err==true);
        } );
        done();
    });

    it('creates a user with no name', (done) =>{
        const user =({userType: 'Commissary',
            username: 'username3',
            password: 'password'});
        db.insertOne(User, user, function(err, res) {
            assert(err==false);
        } );
        done();
    });


    it('creates a user with same username', (done) =>{
        const user =({userType: 'Commissary',
            username: 'username',
            password: 'password'});
        db.insertOne(User, user, function(err, res) {
            assert(err==false);
        } );
        done();
    });

    it('creates 3 users', (done) =>{
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
            assert(err==true);
        } );
        done();
    });
});
