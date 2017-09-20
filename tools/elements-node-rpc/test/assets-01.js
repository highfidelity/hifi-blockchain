var assert = require('assert');
var clone = require('clone');
var http = require('http');
var config = require('./config');
var elements = require('../');

var account = {
    name: "hifi"
};

function initialize() {
    const el = new elements.Client(config);

    el.printHelp("getblockhash");
    
    el.getBlockHash(0).then((result) => {
        console.dir(result);
    }).catch((err) => console.error(err));
}

initialize();