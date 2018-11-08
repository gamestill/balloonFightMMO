var chai = require('chai');
var expect = require('chai').expect;
var word = require('./index');


describe('Suite of unit tests', function() {

    var sockets = [];
    var index = 0;
    beforeEach(function(done) {
        // Setup
        var mysocket = io('http://localhost:3000', {

            'force new connection': true
        });
        sockets.push(mysocket);
        sockets[sockets.length - 1].on('connect', function() {
            console.log('worked...' + (sockets.length));

            done();

        });
        sockets[sockets.length - 1].on('disconnect', function() {
            console.log('disconnected...');
        });


    });

    // afterEach(function(done) {
    //     // Cleanup
    //     // if(socket[index++].connected) {
    //     //     console.log('connected...');
    //     //        done();
    //     //   //  socket.disconnect();
    //     // } else {
    //     //     // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
    //     //     console.log('no connection to break...');
    //     // }

    // });

    describe('First (hopefully useful) test' + Math.random(), function() {

        it('Doing some things with indexOf()', function(done) {
            expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
            done();
        });
    });



});



// describe('Sanitize',function(){
// it('returns a lowercase string',function(){


// var inputword = 'HELLO WORLD';
// var outputWord = word.sanitize(inputword);
// expect(outputWord).to.equal('hello world');
// expect(outputWord).to.not.equal('heDllo world');
// expect(outputWord).to.be.a('string');

// });


// });