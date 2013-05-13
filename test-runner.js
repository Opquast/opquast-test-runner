"use strict";

const promise = require("sdk/core/promise");
const SandBox = require("sdk/loader/sandbox");
const {readURISync} = require('sdk/net/url');
const {clearTimeout, setTimeout} = require('sdk/timers');
const {descriptor} = require("toolkit/loader");

const {validateOptions} = require("sdk/deprecated/api-utils");

const {dnsLookup, extractEvents, xhr} = require("./utils/extras");
const {har2res} = require("./utils/har-tools");

// Javascript files location
const dataRoot = require("sdk/url").URL("../data", module.uri);
exports.dataRoot = dataRoot;

var JS_FILES = [];
var RULES = [];
var RULESETS = [];


const addFilesToList = function(listRef) {
    return function() {
        [].slice.call(arguments).forEach(function(f) {
            if (listRef.indexOf(f) === -1) {
                listRef.push(f);
            }
        });
    };
};


const addJSFiles = addFilesToList(JS_FILES);
exports.addJSFiles = addJSFiles;


const addRules = addFilesToList(RULES);
exports.addRules = addRules;


const addRuleSets = addFilesToList(RULESETS);
exports.addRuleSets = addRuleSets;


const getRules = function() {
    let result = {'rules': {}, 'rulesets': {}};

    RULES.forEach(function(uri) {
        result['rules'] = mix(result['rules'], JSON.parse(readURISync(uri)));
    });
    RULESETS.forEach(function(uri) {
        result['rulesets'] = mix(result['rulesets'], JSON.parse(readURISync(uri)));
    });

    return result;
};
exports.getRules = getRules;


const getJSFiles = function() {
    return JS_FILES;
};
exports.getJSFiles = getJSFiles;


// Default files
addJSFiles(
    dataRoot + '/lib/cssParser.js',
    dataRoot + '/lib/oqs-validator.js',
    dataRoot + '/lib/oqs-tests.js'
);

addRules(dataRoot + '/rules.json');
addRuleSets(dataRoot + '/rulesets.json');


// Test Runner
const createTestRunner = function(opts) {
    // Global options
    let requirements = {
        sandbox: {
            is: ["object"]
        },
        plainText: {
            is: ["string"]
        },
        har: {
            is: ["object"],
            ok: function(val) typeof(val.entries) !== "undefined" && Array.isArray(val.entries)
        },
        extractObjects: {
            map: function(val) typeof(val) === "boolean" && val || false
        },
        timeout: {
            map: function(val) parseInt(val) || -1
        },
        runOptions: {
            map: function(val) typeof(val) === "object" && val || {}
        }
    };

    let options = validateOptions(opts, requirements);

    // Tests runner options
    let runRequirements = {
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
    options.runOptions = validateOptions(options.runOptions, runRequirements);


    let resources = [];
    let pageInfo = {};


    let injectJS = function(path) {
        let code = null;
        try {
            code = loadFile(path);
        } catch(e) {
            throw new Error("Unable to open \"" + path + "\".");
        }

        SandBox.evaluate(options.sandbox, code);
    };

    let evaluate = function(func) {
        let args = JSON.stringify(Array.prototype.slice.call(arguments).slice(1));
        let code = "(" + func.toSource() + ").apply(this, " + args + ")";
        return SandBox.evaluate(options.sandbox, code);
    };


    let init = function() {
        // Set pageInfo and resources
        if (resources.length > 0) {
            return promise.resolve();
        }

        // Inject jQuery & coexist with other versions
        injectJS(dataRoot + '/lib/jquery-1.9.1.min.js');
        evaluate(function() {
            // Doing this removes our jQuery from the page but provides a global
            // jQuery version in sandbox
            this.jQuery = $.noConflict(true);
            this.$ = this.jQuery;
        });

        // Add some needed globals
        let _xhr = xhrWrapper(evaluate, options.har);
        Object.defineProperties(options.sandbox, descriptor({
            dnsLookup: dnsLookup,
            extractEvents: extractEvents,
            Q: promise,
            _XHR: _xhr.cls
        }));

        // Wrap XHR (provides global XHR in sandbox)
        _xhr.wrap('_XHR', 'XHR');

        // Extract page information
        injectJS(dataRoot + '/lib/oqs-utils.js');
        Object.defineProperties(pageInfo, descriptor(evaluate(function() {
            return $.extractPageInfo();
        })));

        // Extract flash objects if asked for
        if (!options.extractObjects) {
            return promise.resolve().then(function() {
                har2res(options.har, resources);
            });
        }

        return evaluate(function() {
            return $.extractObjects();
        })
        .then(function(swfObjects) {
            swfObjects.forEach(function(entry) {
                if (entry !== null) {
                    options.har.entries.push(entry);
                }
            });

            // Convert resources
            har2res(options.har, resources);
        });
    };


    // Tests runner
    let runTests = function(testIDs) {
        testIDs = testIDs || [];

        // Load rules & rulesets
        let {rules, rulesets} = getRules();

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

        let deferred = promise.defer();

        let timeout = null;
        if (options.timeout > 0) {
            timeout = setTimeout(function() {
                deferred.reject(new Error('Test timeout (' + options.timeout + ')'));
            }, options.timeout);
        };

        init()
        .then(function() {
            // Now we can run tests
            getJSFiles().forEach(function(uri) {
                injectJS(uri);
            });

            return evaluate(function(options, pageInfo, resources, rules, rulesets) {
                let events = extractEvents(window);
                this.sidecar = {
                    resources: resources,
                    events: events,
                    pageInfo: pageInfo,
                    plainText: options.plainText
                };

                // Set options
                for (var k in options.runOptions) {
                    this[k] = options.runOptions[k];
                }

                // Run tests
                this.tests = rules;
                this.criteria = rulesets;
                return analyze(this.criteria).then(function(results) {
                    return synthesize_results(results);
                });
            }, options, pageInfo, resources, rules, rulesets);
        })
        .then(function(result) {
            if (timeout) {
                clearTimeout(timeout);
            }
            deferred.resolve(result);
        });

        return deferred.promise;
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
