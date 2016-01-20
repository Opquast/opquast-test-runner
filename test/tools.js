/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Some useful functions for testing purpose

'use strict';

const {Cc, Ci} = require('chrome');

const {mix} = require('sdk/core/heritage');
const Q = require('sdk/core/promise');
const file = require("sdk/io/file");
const {readURI} = require('sdk/net/url');
const self = require("sdk/self");
const {pathFor} = require("sdk/system");
const {getBrowserForTab, getOwnerWindow} = require('sdk/tabs/utils');
const {startServerAsync} = require('./httpd');
const {setTimeout, clearTimeout} = require('sdk/timers');
const {URL} = require('sdk/url');
const unload = require('sdk/system/unload');

const testRunner = require("opquast-tests/test-runner");
const {addRuleSets} = require("opquast-tests/test-runner");

const wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

// ---- frame script management

var globalMM = Cc["@mozilla.org/globalmessagemanager;1"]
              .getService(Ci.nsIMessageListenerManager)
let frameScriptUri = module.uri.replace('tools', 'frame-script');
globalMM.loadFrameScript(frameScriptUri, true);
let frameScriptLoaded = true;

const removeFrameScript = function () {
    if (frameScriptLoaded) {
        let frameScriptUri = module.uri.replace('tools', 'frame-script');
        globalMM.removeDelayedFrameScript(frameScriptUri);
        frameScriptLoaded = false;
    }
}

unload.when(removeFrameScript);

// ------

const statuses = {
    200: "200 OK",
    404: "404 Not found"
};

const openPage = function(url) {
    let win = wm.getMostRecentWindow('navigator:browser');
    let tab = win.gBrowser.tabContainer.getItemAtIndex(0);
    let browser = getBrowserForTab(tab);
    let bmmg = browser.messageManager;
    let D = Q.defer();
    let timeout;

    let onMessage = {
        receiveMessage : function(message) {
            if (!(message.target instanceof Ci.nsIDOMXULElement)) {
                // if message does not come from <browser>, let's ignore it.
                // In theory, this case does not happened...
                return
            }
            if (browser.outerWindowID !=  message.target.outerWindowID) {
                // this message is not for our browser.
                return;
            }
            clearTimeout(timeout);
            globalMM.removeMessageListener("tests:document-loaded", onMessage);
            setTimeout(function() {
                D.resolve({
                    url: url,
                    tab: tab,
                    browser: browser,
                    loadFailed:false,
                    windowInfo: message.data
                });
            }, 200);
        }
    }

    // in case on no load event (error during a request for ex),
    // we should be able to continue tests
    timeout = setTimeout(function() {
        globalMM.removeMessageListener("tests:document-loaded", onMessage);
        D.resolve({
            url: url,
            tab: tab,
            browser: browser,
            loadFailed:true,
            windowInfo: {
                url : browser.documentURI.spec,
                mimeType : browser.documentContentType,
                charset : browser.characterSet,
                referer : "",
                x_results : {}
            }
        });
    }, 5000);

    globalMM.addMessageListener("tests:document-loaded", onMessage);
    browser.loadURI(url.toString());
    return D.promise;
};
exports.openPage = openPage;

let fakeHarEntry = function(windowInfo, url) {
    let mimeType = "",
        charset = "";

    if (typeof(url) === "undefined") {
        url = windowInfo.url;
        mimeType = windowInfo.contentType;
        charset = windowInfo.characterSet;
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
            '_referrer': windowInfo.referrer,
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


const getHarObject = function(windowInfo, htmlFile, jsonFiles) {
    let entries = [fakeHarEntry(windowInfo)];

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
        try {
            jsonOne = readBinaryURI(jsonFileOne);
            jsonOne = JSON.parse(readBinaryURI(jsonFileOne));
        }
        catch(e) {
            dump("error reading "+jsonFileOne+": "+e+"\n")
            dump("jsonOne: "+jsonOne+"\n");
            jsonOne = '';
        }
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

            let entry = fakeHarEntry(windowInfo, URL(k, entries[0]._url).toString());
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
    let startTime = new Date();

    // Prepare checklists
    let checklists = {};
    readURI(URL(path, module.uri).toString(), {'sync': true}).then(function(result){
        checklists = JSON.parse(result);
    });

    // Launch tests
    let runner = testRunner.create(browser, {
        har: har,
        plainText: har.entries[0].response.content.text,
        extractObjects: false
    });

    // Add rulesets
    addRuleSets(URL(path, module.uri).toString());

    return runner.run([test])
    .then(function(runnerData) {
        let {pageInfo, resources, results } = runnerData;
        // Format result set
        return {
            "tests": {
                "title": pageInfo.title || "",
                "links": pageInfo.links || [],
                "images": pageInfo.images || [],
                "stats": pageInfo.stats,
                "resources": resources || [],
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
    if (basePath.charAt(0) == '/') {
        basePath = basePath.slice(1);
    }
    let basePathLength = basePath.split("/").length;

    let path = file.join(pathFor("ProfD"), "extensions", self.id + ".xpi");
    fp.initWithPath(path);
    xpi.open(fp);

    let entries = xpi.findEntries(basePath + glob);
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
            "url": URL(v, baseURI).toString(),
            "entry": v.split("/").slice(basePathLength).join("/")
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
