'use strict';

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const CC = Components.Constructor;

const systemPrincipal = CC('@mozilla.org/systemprincipal;1', 'nsIPrincipal')();
const Promise = Cu.import('resource://gre/modules/commonjs/sdk/core/promise.js', {}).Promise;

const getOwnIdentifiers = x => [...Object.getOwnPropertyNames(x),
                                ...Object.getOwnPropertySymbols(x)];

const descriptor = function descriptor(object) {
  let value = {};
  getOwnIdentifiers(object).forEach(function(name) {
    value[name] = Object.getOwnPropertyDescriptor(object, name)
  });
  return value;
};

function createSandbox(window) {
    let options = {
        sandboxPrototype: window,
        wantXrays: false,
        wantComponents: false
    };
    return Cu.Sandbox(systemPrincipal, options);
}

function evaluateSandbox(sandbox, source, file) {
    return Cu.evalInSandbox(source,
                     sandbox,
                     "1.8",
                     file,
                     1);
}

var extras = false;
var harTools = false;

const createRunner = function(window) {


    let sandbox = createSandbox(window);
    let pageInfo = {};
    let resources = [];

    let evaluateFunc = function(func) {
        let args = JSON.stringify(Array.prototype.slice.call(arguments).slice(1));
        let code = '(' + func.toSource() + ').apply(this, ' + args + ')';
        return evaluateSandbox(sandbox, code, '');
    };

    let init = function(options) {

        if (!extras) {
            extras = {};
            Cu.import(options.baseURI+'utils/extras.jsm', extras);
            harTools = {}
            Cu.import(options.baseURI+'utils/har-tools.jsm', harTools);
        }

        evaluateSandbox(sandbox, options.initialSource, 'jquery')

        // Add some needed globals
        let _xhr = xhrWrapper(evaluateFunc, options.har, extras.xhr);
        Object.defineProperties(sandbox, descriptor({
            dnsLookup: extras.dnsLookup,
            extractEvents: extras.extractEvents,
            Q: Promise,
            _XHR: _xhr.cls
        }));

        // Wrap XHR (provides global XHR in sandbox)
        _xhr.wrap('_XHR', 'XHR');

        evaluateSandbox(sandbox, options.oqs_utils, options.dataRoot + '/lib/oqs-utils.js');
        // Extract page information
        Object.defineProperties(pageInfo, descriptor(evaluateFunc(function() {
            return $.extractPageInfo();
        })));

        let p;
        // Extract flash objects if asked for
        if (!options.extractObjects) {
            p = Promise.resolve().then(function() {
                harTools.har2res(options.har, resources);
            });
        }
        else {
            p =  Promise.resolve().then(function(){
                return evaluateFunc(function() {
                    return $.extractObjects();
                });
            })
            .then(function(swfObjects) {
                swfObjects.forEach(function(entry) {
                    if (entry !== null) {
                        options.har.entries.push(entry);
                    }
                });
                // Convert resources
                harTools.har2res(options.har, resources);
            });
        }
        return p.then(function() {
            if (options.createResourceIfEmpty && resources.length === 0) {
                let doc = window.document;
                let serializer = new window.XMLSerializer();
                resources.push({
                    date: doc.lastModified,
                    modified: doc.lastModified,
                    expires: null,
                    content_type: doc.contentType,
                    charset: doc.characterSet,
                    size: serializer.serializeToString(doc).length,
                    headers: {},
                    uri: window.location.href,
                    referrer: "",
                    method: "GET",
                    status: 200,
                    status_text: "200 OK"
                });
            }
        });
    };

    let run = function(parameters) {
        for (let uri in parameters.jsFiles) {
            evaluateSandbox(sandbox, parameters.jsFiles[uri], uri);
        }
        let deferred = Promise.defer();
        let p = evaluateFunc(function(plainText, runOptions, pageInfo, resources, rules, rulesets) {
                let events = extractEvents(window);
                this.sidecar = {
                    resources: resources,
                    events: events,
                    pageInfo: pageInfo,
                    plainText: plainText
                };

                // Set options
                for (var k in runOptions) {
                    this[k] = runOptions[k];
                }

                // Run tests
                this.tests = rules;
                this.criteria = rulesets;
                return analyze(this.criteria).then(function(results) {
                    return synthesize_results(results);
                });
            },
            parameters.plainText,
            parameters.runOptions,
            pageInfo,
            resources,
            parameters.rules,
            parameters.rulesets);
        p.then(function(result) {
            deferred.resolve({
                results: result,
                pageInfo : pageInfo,
                resources : resources
            });
        });
        return deferred.promise;
    };

    let reset = function() {
        sandbox = null;
        pageInfo = {};
        resources = [];
    }

    return {
        // ---- methods which will be called by message listeners
        init: init,
        run: run,
        reset: reset
    };
}

var runner = null;

addMessageListener('opq:init', {
    receiveMessage: function(message) {
        runner = createRunner(content);
        let p = runner.init(message.data)
        .then(function(){
            sendSyncMessage("opq:init_resp");
        })
    }
});

addMessageListener('opq:run', {
    receiveMessage: function(message) {
        let p = runner.run(message.data)
        .then(function(results){
            sendSyncMessage("opq:run_resp", results);
        })
    }
});

addMessageListener('opq:deactivate', {
    receiveMessage: function(message) {
        if (runner) {
            runner.reset();
        }
    }
});

/**
 * wrapper for the xhr object (see extras.jsm)
 *
 * it overrides the query() method. This new query()
 * methods looks in a har collection, the requested url
 * before doing the true request.
 *
 * @return object
 *     - cls: the wrapped xhr
 *     - wrap: a function that wrap XHR inside a sandox
 */
const xhrWrapper = function(evaluate, har, xhr) {
    let entryToResponse = function(entry, partial) {
        let result = {
            status: entry.response.status,
            statusText: entry.response.statusText,
            headers: entry.response.headers,
            content_type: null,
            data: partial ? '' : entry.response.content.text,
            xml: null
        };

        result.getHeader = function(name) {
            var value = [];
            this.headers.forEach(function(v) {
                if (v.name.toLowerCase() === name.toLowerCase()) {
                    value.push(v.value);
                }
            });

            return (value.length === 0) ? null : value.join(',');
        };

        return result;
    };

    let _xhr = Object.create(xhr);
    _xhr.query = function(url, method, data, headers, partial) {
        if (method === 'GET' && har.entries !== undefined) {
            let entry = null;
            har.entries.forEach(function(v) {
                if (v._url == url) {
                    entry = v;
                }
            });

            if (entry && (entry.response.content.text || partial)) {
                return Promise.resolve(entryToResponse(entry, partial));
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
                global[dest].cache = {}; // GET request cache
                global[dest].query = function(url, method, data, headers, partial) {
                    // URL should be absolute
                    url = $.URL(url);

                    if (this.cache[url] !== undefined) {
                        return this.cache[url];
                    }

                    // Always return a promise
                    let p = global[src].query.call(this, url, method, data, headers, partial);
                    if (method === 'GET') {
                        this.cache[url] = p;
                    }
                    return p
                }
            }, src, dest);
        }
    };
};
