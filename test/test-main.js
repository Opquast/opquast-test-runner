"use strict";
const {openTab, launchTests} = require("tools");
const {URL} = require("sdk/url");
const {readURI} = require("sdk/net/url");

const {Cc, Ci} = require("chrome");
const {pathFor} = require("system");
const file = require("file");
const self = require("self");

const listFixtures = function() {
    let xpiPath = file.join(pathFor("ProfD"), 'extensions', self.id + '.xpi');

    let fp = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
    let xpi = Cc["@mozilla.org/libjar/zip-reader;1"].createInstance(Ci.nsIZipReader);

    fp.initWithPath(xpiPath);
    xpi.open(fp);

    let entries = xpi.findEntries('resources/opquast-tests/tests/_fixtures/*');
    let entry;
    let fileList = [];
    while (entries.hasMore()) {
        entry = entries.getNext();
        if (!xpi.getEntry(entry).isDirectory) {
            fileList.push(entry);
        }
    }

    fileList.sort();
    let html = fileList.filter(function(v) {
        return v.split('.').pop() == 'html';
    }).map(function(v) {
        return URL('_fixtures/' + v.split('/').slice(4).join('/'), module.uri).toString();
    });

    return html;
}

listFixtures().forEach(function(v) {
    let aSlash = v.split('/'), aDot = v.split('.'), [rule, expected] = aSlash.slice(6, 8);

    exports["test " + rule + "-" + expected + (expected == 'true' ? aSlash.slice(-1).toString().split('.')[0] : "")] = function(assert, done) {
        let close;

        openTab().then(function(result) {
            close = result.close;
            return result.open(v);
        }).then(function(result) {
            let headers, headersPath = aDot.slice(0, -1).join('.') + '.json', status;

            readURI(headersPath, {'sync': true}).then(function(v){
                let json = JSON.parse(v);
                headers = json.headers;
                status = json.status;
            }).then(null, function(error) {
                headers = {};
                status = 200;
            });

            return launchTests(result.browser.contentWindow, {'entries': []}, headers, rule, status).then(function(result){
                result.tests.oaa_results.forEach(function(test) {
                    if(test.id == rule) {
                        if(expected == "true") {
                            assert.ok(test.result == "c", rule + " true");
                        } else if(expected == "false") {
                            assert.ok(test.result == "nc", rule + " false");
                        }
                    }
                });

            }).then(function(){
                return close();
            }).then(null, console.exception).then(done);
        }).then(null, console.exception);
    };
});

require("sdk/preferences/service").set("plugins.click_to_play", true);

require("sdk/test").run(exports);