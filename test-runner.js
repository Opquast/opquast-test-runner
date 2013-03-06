"use strict";

const {extend} = require("sdk/core/heritage");
const promise = require("sdk/core/promise");
const sbLib = require("sdk/loader/sandbox");
const {readURISync} = require('sdk/net/url');
const {descriptor} = require("toolkit/loader");

const {validateOptions} = require("sdk/deprecated/api-utils");

const {dnsLookup, extractEvents, xhr} = require("./utils/extras");
const {har2res} = require("./utils/har-tools");

// Javascript files location
const dataRoot = require("sdk/url").URL("../data", module.uri);

const loadFile = function(path) {
    return readURISync(dataRoot + "/" + path);
};

const createTestRunner = function(sandbox, plainText, har) {
    let injectJS = function(path) {
        let code = null;
        try {
            code = loadFile(path);
        } catch(e) {
            throw new Error("Unable to open \"" + path + "\".");
        }

        sbLib.evaluate(sandbox, code);
    };

    let evaluate = function(func) {
        let args = JSON.stringify(Array.prototype.slice.call(arguments).slice(1));
        let code = "(" + func.toSource() + ").apply(this, " + args + ")";
        return sbLib.evaluate(sandbox, code);
    };

    let resources = [];
    let pageInfo = {};

    // Tests runner options
    let requirements = {
        debug_validator: {
            map: function(val) typeof(val) === "boolean" ? val : false,
        },
        timing_validator: {
            map: function(val) typeof(val) === "boolean" ? val : false,
        },
        show_errors: {
            map: function(val) typeof(val) === "boolean" ? val : false,
        },
        config_saveAndRefresh_delay: {
            map: function(val) typeof(val) === "number" ? parseInt(val) : 1000,
        }
    };

    let init = function() {
        // Set pageInfo and resources
        if (resources.length > 0) {
            return promise.resolve();
        }

        // Inject jQuery & coexist with other versions
        injectJS("lib/jquery-1.9.1.min.js");
        evaluate(function() {
            // Doing this removes our jQuery from the page but provides a global
            // jQuery version in sandbox
            this.jQuery = $.noConflict(true);
            this.$ = this.jQuery;
        });

        // Add some needed globals
        let _xhr = xhrWrapper(evaluate, har);
        Object.defineProperties(sandbox, descriptor({
            dnsLookup: dnsLookup,
            extractEvents: extractEvents,
            Q: promise,
            _XHR: _xhr.cls
        }));

        // Wrap XHR (provides global XHR in sandbox)
        _xhr.wrap('_XHR', 'XHR');

        // Extract page information
        injectJS("lib/oqs-utils.js");
        Object.defineProperties(pageInfo, descriptor(evaluate(function() {
            return $.extractPageInfo();
        })));

        // Extract flash objects
        return evaluate(function() {
            return $.extractObjects();
        })
        .then(function(swfObjects) {
            swfObjects.forEach(function(entry) {
                if (entry !== null) {
                    har.entries.push(entry);
                }
            });

            // Convert resources
            har2res(har, resources);
        });
    };

    // Tests runner
    let runTests = function(options, testIDs) {
        if (Array.isArray(options)) {
            // options is not mandatory
            testIDs = options;
            options = {};
        }
        options = validateOptions(options || {}, requirements);
        testIDs = testIDs || [];

        // Load rules & rulesets
        let rules = JSON.parse(loadFile("rules.json"));
        let rulesets = JSON.parse(loadFile("rulesets.json"));

        // Rulesets subset if needed
        if (testIDs.length > 0) {
            let _rulesets = {};
            for (var k in rulesets) {
                if (testIDs.indexOf(k) !== -1) {
                    _rulesets[k] = rulesets[k];
                }
            }
            rulesets = _rulesets;
        }

        return init()
        .then(function() {
            // Now we can run tests
            injectJS("lib/cssParser.js");
            injectJS("lib/oqs-validator.js");
            injectJS("lib/oqs-tests.js");

            return evaluate(function(plainText, pageInfo, resources, rules, rulesets, options) {
                let events = extractEvents(window);
                this.sidecar = {
                    resources: resources,
                    events: events,
                    pageInfo: pageInfo,
                    plainText: plainText
                };

                // Set options
                for (var k in options) {
                    this[k] = options[k];
                }

                // Run tests
                this.tests = rules;
                this.criteria = rulesets;
                return analyze(this.criteria).then(function(results) {
                    // Crazy unicode conversion
                    return synthesize_results(results);
                });
            }, plainText, pageInfo, resources, rules, rulesets, options);
        });
    };

    return {
        pageInfo: pageInfo,
        resources: resources,
        init: init,
        run: runTests
    };
};

exports.create = createTestRunner;


const xhrWrapper = function(evaluate, har) {
    let entryToResponse = function(entry, partial) {
        let result = {
            status: entry.response.status,
            statusText: entry.response.statusText,
            headers: entry.response.headers,
            content_type: null,
            data: partial ? "" : entry.response.content.text,
            xml: null
        };

        result.getHeader = function(name) {
            var value = [];
            this.headers.forEach(function(v) {
                if (v.name.toLowerCase() === name.toLowerCase()) {
                    value.push(v.value);
                }
            });

            return (value.length === 0) ? null : value.join(",");
        };

        return result;
    };

    let _xhr = Object.create(xhr);
    _xhr.query = function(url, method, data, headers, partial) {
        if (method === "GET" && har.entries !== undefined) {
            let entry = null;
            har.entries.forEach(function(v) {
                if (v._url == url) {
                    entry = v;
                }
            });

            if (entry && (entry.response.content.text || partial)) {
                return promise.resolve(entryToResponse(entry, partial));
            }
        }

        return xhr.query.call(this, url, method, data, headers, partial);
    };

    return {
        cls: _xhr,
        wrap: function(src, dest) {
            evaluate(function(src, dest) {
                let global = this;
                global[dest] = Object.create(global[src]);
                global[dest].query = function(url, method, data, headers, partial) {
                    // URL should be absolute
                    url = $.URL(url);

                    // Always return a promise
                    return global[src].query.call(this, url, method, data, headers, partial);
                }
            }, src, dest);
        }
    };
};
