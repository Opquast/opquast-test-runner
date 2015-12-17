/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Some useful functions for testing purpose

'use strict';

const {Cc, Ci} = require('chrome');

const {mix} = require('sdk/core/heritage');
const Q = require('sdk/core/promise');
const file = require("sdk/io/file");
const SandBox = require("sdk/loader/sandbox");
const {readURI} = require('sdk/net/url');
const self = require("sdk/self");
const {pathFor} = require("sdk/system");
const {getBrowserForTab, getOwnerWindow} = require('sdk/tabs/utils');
const {startServerAsync} = require('./httpd');
const {setTimeout, clearTimeout} = require('sdk/timers');
const {URL} = require('sdk/url');

const testRunner = require("opquast-tests/test-runner");
const {addRuleSets} = require("opquast-tests/test-runner");

const wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);


const statuses = {
    200: "200 OK",
    404: "404 Not found"
};

const openPage = function(url) {
    let win = wm.getMostRecentWindow('navigator:browser');
    let tab = win.gBrowser.tabContainer.getItemAtIndex(0);
    let browser = getBrowserForTab(tab);

    let D = Q.defer();
    let timeout;

    function _load() {
        clearTimeout(timeout);
        browser.removeEventListener('load', _load, true);
        setTimeout(function() {
            D.resolve({
                url: url,
                tab: tab,
                browser: browser,
                loadFailed:false
            });
        }, 500);
    }

    // in case on no load event (error during a request for ex),
    // we should be able to continue tests
    timeout = setTimeout(function() {
        browser.removeEventListener('load', _load, true);
        D.resolve({
            url: url,
            tab: tab,
            browser: browser,
            loadFailed:true
        });
    }, 5000);

    browser.addEventListener('load', _load, true);

    browser.loadURI(url);

    return D.promise;
};
exports.openPage = openPage;


const openTab = function() {
    let win = wm.getMostRecentWindow('navigator:browser');
    let container = win.gBrowser.tabContainer;

    let d1 = Q.defer();
    container.addEventListener('TabOpen', function _open(evt) {
        container.removeEventListener('TabOpen', _open, true);
        d1.resolve({
            tab: evt.target,
            browser: getBrowserForTab(evt.target)
        });
    }, true);

    let tab = win.gBrowser.addTab();

    return d1.promise.then(function(result) {
        let {browser, tab} = result;

        let close = function() {
            let D = Q.defer();
            container.addEventListener('TabClose', function _close() {
                container.removeEventListener('TabClose', _close, true);
                D.resolve();
            }, true);
            getOwnerWindow(tab).gBrowser.removeTab(tab);

            return D;
        };

        let open = function(url) {
            let D = Q.defer();
            let timeout;

            function _load() {
                clearTimeout(timeout);
                browser.removeEventListener('load', _load, true);
                setTimeout(function() {
                    D.resolve({
                        url: url,
                        tab: tab,
                        browser: browser,
                        open: open,
                        close: close,
                        loadFailed:false
                    });
                }, 500);
            }

            // in case on no load event (error during a request for ex),
            // we should be able to continue tests
            timeout = setTimeout(function() {
                browser.removeEventListener('load', _load, true);
                D.resolve({
                    url: url,
                    tab: tab,
                    browser: browser,
                    open: open,
                    close: close,
                    loadFailed:true
                });
            }, 5000);

            browser.addEventListener('load', _load, true);

            browser.loadURI(url);

            return D.promise;
        };

        return {
            tab: tab,
            browser: browser,
            open: open,
            close: close
        };
    });
};
exports.openTab = openTab;


let fakeHarEntry = function(window, url) {
    let mimeType = "",
        charset = "";

    if (typeof(url) === "undefined") {
        url = window.location.href;
        mimeType = window.document.contentType;
        charset = window.document.characterSet;
    }

    return {
        '_url': url,
        '_path': URL(url).path,
        'pageref': url,
        'startedDateTime': new Date().toISOString(),
        'time': 0,
        'request': {
            'method': 'GET',
            'url': url,
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
                'mimeType': mimeType,
                'text': ''
            },
            'redirectURL': '',
            'headersSize': -1,
            'bodySize': 0,
            '_contentType': mimeType,
            '_contentCharset': charset,
            '_referrer': window.document.referrer,
            '_imageInfo': undefined
        },
        'cache': {},
        'timings': {
            'send': 0,
            'wait': 0,
            'receive': 0
        }
    };
};


const getHarObject = function(window, htmlFile, jsonFiles) {
    let entries = [fakeHarEntry(window)];

    // Read page source
    entries[0].response.content.text = readBinaryURI(htmlFile);
    entries[0].response.content.size = entries[0].response.content.text.length;
    entries[0].response.bodySize = entries[0].response.content.text.length;

    // Read JSON overrides
    let jsonFileAll = htmlFile.split("/").slice(0, -1).join("/") + "/_all.json",
        jsonFileOne = htmlFile.split(".").slice(0, -1).join(".") + ".json",
        jsonAll,
        jsonOne;

    if (jsonFiles.indexOf(jsonFileAll) !== -1) {
        jsonAll = JSON.parse(readBinaryURI(jsonFileAll));
    }
    if (jsonFiles.indexOf(jsonFileOne) !== -1) {
        jsonOne = JSON.parse(readBinaryURI(jsonFileOne));
    }

    if (jsonAll && jsonAll["*"]) {
        jsonAll[entries[0]._path] = jsonAll["*"];
        delete(jsonAll["*"]);
    }

    if (jsonAll) {
        if (jsonOne) {
            jsonOne = mix(jsonAll, jsonOne);
        }
        else {
            jsonOne = jsonAll;
        }
    }

    if (typeof(jsonOne) === "object") {
        Object.keys(jsonOne).forEach(function(k) {
            if (k == entries[0]._path) {
                entries[0].response = mix(entries[0].response, jsonOne[k]);
                return;
            }

            let entry = fakeHarEntry(window, URL(k, entries[0]._url).toString());
            entry.response = mix(entry.response, jsonOne[k]);
            entries.push(entry);
        });
    }

    entries = entries.map(function(v, i) {
        v._id = i;
        return v;
    });

    return {"entries": entries};
};
exports.getHarObject = getHarObject;


let _launchTests = function(browser, har, test, path) {
    let domWindow = browser.contentWindow;
    let startTime = new Date();

    // Prepare checklists
    let checklists = {};
    readURI(URL(path, module.uri).toString(), {'sync': true}).then(function(result){
        checklists = JSON.parse(result);
    });

    // New sandbox for testRunner
    let sandbox = SandBox.sandbox(null, {
        sandboxPrototype: domWindow,
        wantXrays: false,
        wantComponents: false
    });

    // Launch tests
    let runner = testRunner.create({
        sandbox: sandbox,
        har: har,
        plainText: har.entries[0].response.content.text,
        extractObjects: false
    });

    // Add rulesets
    addRuleSets(URL(path, module.uri).toString());

    return runner.run([test])
    .then(function(results) {
        // Format result set
        return {
            "tests": {
                "title": runner.pageInfo.title || "",
                "links": runner.pageInfo.links || [],
                "images": runner.pageInfo.images || [],
                "stats": runner.pageInfo.stats,
                "resources": runner.resources || [],
                "oaa_results": results.filter(function(v) {
                    return v.id in checklists;
                }).map(function(v) {
                    v["criterion"] = checklists[v.id];
                    v["details"] = v.details.map(function(d) {
                        if (typeof(d.selector) !== "undefined") {
                            return {
                                "selector": d.selector,
                                "text": d.text
                            };
                        }
                        return d;
                    });
                    return v;
                }),
                "datetime": (new Date()).toISOString(),
                "timer": Math.round((new Date() - startTime) / 10) / 100
            },
            "checklists": checklists
        };
    });
};

let launchTests = function(browser, har, test) {
    return _launchTests(browser, har, test, 'rulesets.json');
};

exports.launchTests = launchTests;


let launchTests2 = function(browser, har, test) {
    return _launchTests(browser, har, test, '../data/rulesets.json');
};

exports.launchTests2 = launchTests2;


const getXPIContent = function(glob) {
    let fp = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
    let xpi = Cc["@mozilla.org/libjar/zip-reader;1"].createInstance(Ci.nsIZipReader);

    let baseURI = URL("/", module.uri);
    let basePath = file.dirname(URL(module.uri).path);

    let path = file.join(pathFor("ProfD"), "extensions", self.id + ".xpi");
    fp.initWithPath(path);
    xpi.open(fp);

    let entries = xpi.findEntries("resources" + basePath + "/" + glob);
    let entry;
    let fileList = [];
    while (entries.hasMore()) {
        entry = entries.getNext();
        if (!xpi.getEntry(entry).isDirectory) {
            fileList.push(entry);
        }
    }

    fileList.sort();
    return fileList.map(function(v) {
        return {
            "url": URL(v.split("/").slice(1).join("/"), baseURI).toString(),
            "entry": v.split("/").slice(basePath.split("/").length).join("/")
        };
    });
};
exports.getXPIContent = getXPIContent;


const getHTMLFixtures = function(glob) {
    let result = {};

    getXPIContent(glob).forEach(function(v) {
        let {url, entry} = v;
        let base = url.split("/").slice(0, -1).join("/") + "/";
        let ext = entry.split(".").slice(-1).join("");

        if (result[base] === undefined) {
            result[base] = {
                //"files": [],
                "html": [],
                "json": []
            };
        }

        if (ext === "html") {
            result[base]["html"].push(url);
        }
        else if (ext === "json") {
            result[base]["json"].push(url);
        }

        //result[base]["files"].push(url);
    });

    return result;
};
exports.getHTMLFixtures = getHTMLFixtures;


const startServer = function(port) {
    let server = startServerAsync(port);
    let root = URL("http://" + server._host + ":" + server._port + "/")

    let getURI = function(path) {
        return URL(path, root);
    };

    let setRoot = function(rootURI) {
        server.registerPrefixHandler("/", function(request, response) {
            try {
                let resURI = URL(request._path.substr(1), rootURI);
                let ext = resURI.split(".").slice(-1).join("");
                let mime = "text/plain; charset=UTF-8";
                let contents;

                if (MIME_TYPES[ext] !== undefined) {
                    mime = MIME_TYPES[ext];
                }

                if (rootURI == resURI) {
                    return httpError(request, response);
                }

                try {
                    contents = readBinaryURI(resURI);
                }
                catch(e) {
                    return httpError(request, response);
                }

                response.setStatusLine(request.httpVersion, 200, "OK");
                response.setHeader("Content-Type", mime);

                // Add more headers using a file named "<path>.headers" (JSON format)
                try {
                    let headers = JSON.parse(readBinaryURI(resURI + '.headers'));
                    for (let k in headers) {
                        response.setHeader(k, headers[k]);
                    }
                }
                catch(e) {}

                response.processAsync();
                response.write(contents)
                response.finish();
            }
            catch(e) {
                console.exception(e);
                throw(e);
            }
        });
    };

    let httpError = function(request, response) {
        response.setStatusLine(request.httpVersion, 404, 'NOT FOUND');
        response.setHeader("Content-Type", "text/plain; charset=UTF-8");
        response.processAsync();
        response.write("NOT FOUND");
        response.finish();
    };

    return {
        getURI: getURI,
        setRoot: setRoot,
        port: server.port
    }
};
exports.startServer = startServer;


const MIME_TYPES = {
    'css': 'text/css; charset=utf-8',
    'html': 'text/html; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'rss': 'application/rss+xml',
    'atom': 'application/atom+xml'
};


const readBinaryURI = function(uri) {
    let ioservice = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
    let channel = ioservice.newChannel(uri, 'UTF-8', null);
    let stream = Cc['@mozilla.org/binaryinputstream;1'].
                  createInstance(Ci.nsIBinaryInputStream);
    stream.setInputStream(channel.open());

    let data = '';
    while (true) {
        let available = stream.available();
        if (available <= 0)
            break;
        data += stream.readBytes(available);
    }
    stream.close();

    return data;
};
