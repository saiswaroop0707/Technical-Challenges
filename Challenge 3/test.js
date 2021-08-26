var assert = require('assert');
var getInput = require('../index.js');

console.log(getInput);

var object = {
    firstName: "Steve",
    lastName: "Job",
    address: {
        home: {
            addressLines: {
                1: "Block 73/2, Crossroad",
                2: "Johannesburg, South Africa"
            }
        }
    },
    customerType : {
        retail: {
            channel: "Rank100",
            spending: "Elite10",
        }
    }
};
describe('Index', function() {
  describe('#getInput', function() {
    it('Should throw error for invalid JSON', function() {
      assert.throws(function () { getInput("", ["key"]) }, Error, "Invalid JSON");
    });
    it('Should throw error for invalid Keys', function() {
      assert.throws(function () { getInput(object, []) }, Error, "Invalid Keys");
    });
    it('Should give the firstname ', function () {
          assert.equal(getInput(object,['firstName']), object.firstName);
    });  
    it('Should give the  object.address.home.addressLines', function () {
          assert.equal(getInput(object,[ "address", "home", "addressLines"]), object.address.home.addressLines);
    });
    it('Should give the  object.address.home.addressLines[2]', function () {
          assert.equal(getInput(object,[ "address", "home", "addressLines","2"]), object.address.home.addressLines[2]);
    });
    it('Should give the null', function () {
          assert.equal(getInput(object,["hello", "none", "dove", "hello"]), null);
    }); 
  });
});