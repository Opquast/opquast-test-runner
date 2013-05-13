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
    return fileList.filter(function(v) {
        return v.split('.').pop() == 'html';
    }).map(function(v) {
        return URL('fixtures/' + v.split('/').slice(4).join('/'), module.uri).toString();
    });
}

exports["test"] = function(assert, done) {
    listFixtures().forEach(function(v) {
        let [rule, expected] = v.split('/').slice(6, 8);

        openTab().then(function(result) {
            return result.open(v);
        }).then(function(result) {
            let har = {
                'entries': [{
                    '_id': 0,
                    '_url': result.url,
                    'pageref': result.url,
                    'startedDateTime': null,
                    'time': 0,
                    'request': {
                        'method': 'GET',
                        'url': result.url,
                        'httpVersion': 'HTTP/1.1',
                        'cookied': [],
                        'headers': [],
                        'queryString': [],
                        'postData': {},
                        'headerSize': -1,
                        'bodySize': -1
                    },
                    'response': {
                        'status': 200,
                        'statusText': 'OK',
                        'httpVersion': 'HTTP/1.1',
                        'cookies': [],
                        'headers': [],
                        'content': {
                            'size': 0,
                            'compression': undefined,
                            'mimeType': 'text/html',
                            'text': ''
                        },
                        'redirectURL': '',
                        'headersSize': -1,
                        'bodySize': 0,
                        '_contentType': 'text/html',
                        '_contentCharset': 'UTF-8',
                        '_referrer': '',
                        '_imageInfo': undefined
                    },
                    'cache': {},
                    'timings': {
                        'send': 0,
                        'wait': 0,
                        'receive': 0
                    }
                }]
            }
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
            }).then(null, console.exception);
        }).then(function(){
            done();
        }).then(null, console.exception);
    });
};

require("sdk/test").run(exports);