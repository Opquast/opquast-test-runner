"use strict";
const {openTab, launchTests} = require("tools");
const {list} = require('sdk/io/file');
const {URL} = require("sdk/url"); //URL("fixtures/", module.uri);

let dirs = list('file:///Users/fabricebonny/Documents/Aptana Studio 3 Workspace/test-suite/tests/try/');

for (var idx in dirs) {
    let elements = list('file:///Users/fabricebonny/Documents/Aptana Studio 3 Workspace/test-suite/tests/try/' + dirs[idx] + '/true/');
    elements.filter(function(elem) {
        return elem.split('.').pop() == 'html';
    }).forEach(function(element, index, array) {
        exports["test " + dirs[idx]] = function(assert, done) {
            return openTab().then(function(result) {
                return result.open('file:///Users/fabricebonny/Documents/Aptana Studio 3 Workspace/test-suite/tests/try/' + dirs[idx] + '/true/' + element);
            }).then(function(result) {
                var har = {
                    'entries': [
                        {
                            '_id': '0',
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
                        }
                    ]
                }
                launchTests(result.browser.contentWindow, har);

                assert.ok(true);
            }).then(null, console.exception).then(done);
        }
    });
}

require("sdk/test").run(exports);