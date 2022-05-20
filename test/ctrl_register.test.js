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


chai.use(chaiHttp);

const agent = chai.request.agent(server);
before((done)=>{
    chai.request(server).get('/').end(function(err, res) {
        done();
    });
});
beforeEach((done)=>{
    agent.post('/')
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send({username: 'Master1', password: '12345'})
        .end(function(err, res) {
            // console.log(res.text);
            done();
        });
});
after((done)=>{
    console.log('after');
    mongoose.connection.collections.users.drop(()=>{
        done();
    });
});

describe('Register test', (done)=>{
    it('gets the general register page', (done) =>{
        // eslint-disable-next-line max-len
        agent.get('/manage-account-create').end(function(err, res) {
            // console.log(res.status);
            assert.include(res.text, 'Co-Administrator' );
            done();
        });
    });
    it('gets the register Co-Administrator page', (done) =>{
        // eslint-disable-next-line max-len
        agent.get('/registration/Co-administrator').end(function(err, res) {
            // console.log(res.status);
            assert.include(res.text, 'Co-administrator' );
            done();
        });
    });
    it('gets the register Franchisee page', (done) =>{
        // eslint-disable-next-line max-len
        agent.get('/registration/Franchisee').end(function(err, res) {
            // console.log(res.status);
            assert.include(res.text, 'Franchisee' );
            done();
        });
    });
    it('gets the register Commissary page', (done) =>{
        // eslint-disable-next-line max-len
        agent.get('/registration/Commissary').end(function(err, res) {
            // console.log(res.status);
            assert.include(res.text, 'Commissary' );
            done();
        });
    });
    it('gets the unique username check', (done)=>{
        // eslint-disable-next-line max-len
        agent.get('/checkUsername').query({username: 'asd'}).end(function(err, res) {
            assert.isEmpty(res.body);
            done();
        });
    });
    it('gets the non-unique username check', (done)=>{
        // eslint-disable-next-line max-len
        agent.get('/checkUsername').query({username: 'Master1'}).end(function(err, res) {
            assert.equal(res.body.username, 'Master1');
            done();
        });
    });
});
