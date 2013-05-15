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

    let entries = xpi.findEntries('resources/opquast-tests/tests/fixtures/*');
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
        return URL('fixtures/' + v.split('/').slice(4).join('/'), module.uri).toString();
    });

    let har = fileList.filter(function(v) {
        return v.split('.').pop() == 'har';
    }).map(function(v) {
        return URL('fixtures/' + v.split('/').slice(4).join('/'), module.uri).toString();
    });

    return [html, har];
}

let [html, har] = listFixtures();

html.forEach(function(v) {
    exports["test " + v] = function(assert, done) {
        let [rule, expected] = v.split('/').slice(6, 8);

        openTab().then(function(result) {
            return result.open(v);
        }).then(function(result) {
            let har = {'entries': []};

            try {
                let aPath = v.split('.');
                aPath.pop();
                let path = aPath.join('.') + '.har';

                readURI(path, {'sync': true}).then(function(result){
                    har = JSON.parse(result);
                });
            } catch(e) {}

            launchTests(result.browser.contentWindow, har).then(function(result){
                result.tests.oaa_results.forEach(function(result) {
                    if(result.id == rule) {
                        if(expected == "true") {
                            assert.ok(result.result == "c", rule + " true");
                        } else if(expected == "false") {
                            assert.ok(result.result == "nc", rule + " false");
                        }
                    }
                });
            }).then(function(){
                done();
            }).then(null, console.exception);
        }).then(null, console.exception);
    };
});

require("sdk/test").run(exports);