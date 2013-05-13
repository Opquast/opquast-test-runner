"use strict";
const {openTab, launchTests} = require("tools");
const {URL} = require("sdk/url");
const {readURI} = require("sdk/net/url");

readURI(URL('fixtures/', module.uri).toString(), {sync: true}).then(function(result) {
	console.log(result);
    return result.split('\n').filter(function(element, index, array) {
        return element.split(' ')[0] == '201:';
    }).map(function(element) {
        return element.split(' ')[1];
    });
}).then(function(dirs) {
    dirs.forEach(function(dir) {
        readURI(URL('fixtures/' + dir, module.uri).toString(), {sync: true}).then(function(result) {
            return result.split('\n').filter(function(element, index, array) {
                return element.split(' ')[0] == '201:';
            }).map(function(element) {
                return dir + element.split(' ')[1];
            });
        }).then(function(dirs){
            dirs.forEach(function(dir) {
                readURI(URL('fixtures/' + dir, module.uri).toString(), {sync: true}).then(function(result) {
                    return result.split('\n').filter(function(element, index, array) {
                        return element.split(' ')[0] == '201:' && element.split(' ')[1].split('.').pop() == 'html';
                    }).map(function(element) {
                        return dir + element.split(' ')[1];
                    });
                }).then(function(result){
                    let exports = {};

                    result.forEach(function(file) {
                        exports[file] = function(assert) {
                            return openTab().then(function(result) {
                                return result.open(file);
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
                                launchTests(result.browser.contentWindow, har);

                                assert.ok(true);
                            }).then(null, console.exception);
                        }

                        return exports
                    }).then(function(exports) {
                        console.log("**** " + JSON.stringify(exports));
                        //require("sdk/test").run(exports);
                    });
                }).then(null, console.exception);
            });
        }).then(null, console.exception);
    });
}).then(null, console.exception);