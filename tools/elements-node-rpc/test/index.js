var assert = require('assert');
var clone = require('clone');
var config = require('./config');
var elements = require('../');

var account = {
    name: "hifi"
};

function createClient() {
    return new elements.Client(config);
}

function isNotEmpty(data) {
    if (data === 0)
        return;

    assert.ok(data);
}

describe('getInfo', function () {
    it("should be able to get the Elements info", function (done) {
        var client = createClient();
        client.getInfo(function (err, info) {
            assert.ifError(err);
            assert.ok(info);
            done();
        });
    });
});