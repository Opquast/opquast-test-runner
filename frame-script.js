'use strict';

// for the moment, this is a simple module, but when it will be finished
// it will be a true frame-script running in a tab process

const {Ci, Cu, Cc, CC} = require("chrome");
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

// ---- to remove for real frame script

var _listeners = {};
var _resultListeners = {};
function addMessageListener(message, listener) {
    _listeners[message] = listener
}
function sendSyncMessage(message, parameters) {
    parameters = parameters || {};
    _resultListeners[message].receiveMessage({
        data : JSON.parse(JSON.stringify(parameters))
    });
}

// ----


var extras = false;
var harTools = false;

const createRunner = function(window) {


    let sandbox = createSandbox(window);
    let pageInfo = {};

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
    }

    return {
        // temp function
        sendMessage: function(message, parameters, resultListener) {
            _resultListeners[message+"_resp"] = resultListener;
            _listeners[message].receiveMessage({
                _frameScript : this,
                data: parameters
            });
        },

        // ---- methods which will be called by message listeners
        init: init,

        // ---- properties that will be private
        pageInfo: pageInfo,
        evaluate : function(source, file) {
            return evaluateSandbox(sandbox, source, file);
        }
    };
}
exports.createFrameScript = createRunner;
// var runner = createRunner(content);


addMessageListener('opq:init', {
    receiveMessage: function(message) {
        message._frameScript.init(message.data);
        //runner.init(message.data);
        sendSyncMessage("opq:init_resp");
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
