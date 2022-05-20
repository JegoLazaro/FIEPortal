require('dotenv').config();
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const db = require('../models/db.js');
const User = require('../models/modelUser');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const assert = require('chai').assert;
const bcrypt = require('bcrypt');
const saltRounds = 10;


chai.use(chaiHttp);
let id;
before((done)=>{
    const user =({userType: 'Commissary',
        fullName: {firstName: 'fn', lastName: 'ln'},
        username: 'username1',
        password: bcrypt.hashSync('password', saltRounds)});
    db.insertOne(User, user, function(err, res) {
        // assert.equal(err, true);
        // console.log(res._id);
        id = res._id;
    } );
    it('gets the login page', (done) =>{
        chai.request(server).get('/').end(function(err, res) {
            // console.log(res.status);
            assert.equal(res.status, 200);
            done();
        });
    });
    done();
});
after((done)=>{
    console.log('after');
    mongoose.connection.collections.users.drop(()=>{
        done();
    });
});
describe('Login test', ()=>{
    it('posts logs in with Super Admin credentials', (done) =>{
        const agent = chai.request.agent(server);
        agent.post('/')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send({username: 'Master1', password: '12345'})
            .end(function(err, res) {
                // console.log(res.text);
                // assert.equal(res.status, 302);
                assert.include(res.text, 'Welcome, ');
                done();
            });
    });
    it('posts logs in with correct credentials', (done) =>{
        const agent = chai.request.agent(server);
        agent.post('/')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send({username: 'username1', password: 'password'})
            .end(function(err, res) {
                // console.log(res.text);
                // assert.equal(res.status, 302);
                assert.include(res.text, 'Total Orders');
                done();
            });
    });
    it('posts logs in with incorrect credentials', (done) =>{
        const agent = chai.request.agent(server);
        agent.post('/')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send({username: 'Master1', password: '123456'})
            .end(function(err, res) {
                // console.log(res.text);
                // assert.equal(res.status, 302);
                assert.include(res.text, 'Invalid');
                done();
            });
    });
    it('gets the logged in users profile', (done) =>{
        const agent = chai.request.agent(server);
        agent.get('/user/'+id)
            .end(function(err, res) {
                console.log(res.text);
                assert.include(res.text, 'First Name');
            });
        done();
    });
});
