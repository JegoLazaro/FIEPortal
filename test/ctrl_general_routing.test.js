require('dotenv').config();
process.env.NODE_ENV = 'test';


const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const assert = require('chai').assert;


chai.use(chaiHttp);
let id;
describe('general routing test', (done)=>{
    it('users inputs wrong url (404)', (done) =>{
        chai.request(server).get('/asdasdasda').end(function(err, res) {
            assert.include(res.text, '404');
            done();
        });
    });
    // it('user entered the website at the wrong time', (done) =>{
    //     const date = new Date(2021, 9, 12, 14, 24, 20);
    //     chai.request(server).get('/').end(function(err, res) {
    //         assert.include(res.text, 'closed');
    //         done();
    //     });
    // });
});
