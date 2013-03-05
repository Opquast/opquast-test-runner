"use strict";

const {Cc, Ci, Cr} = require("chrome");
const Q = require("sdk/core/promise");
const {stringify} = require("sdk/querystring");

const esl = Cc["@mozilla.org/eventlistenerservice;1"]
            .getService(Ci.nsIEventListenerService);
const dnsService = Cc["@mozilla.org/network/dns-service;1"]
            .createInstance(Ci.nsIDNSService);
const threadManager = Cc["@mozilla.org/thread-manager;1"]
            .getService(Ci.nsIThreadManager);
const xmlhttprequest = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"];


const extractEvents = function(win) {
    var tw = win.document.createTreeWalker(
        win.document,
        win.NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: function(node){
                return win.NodeFilter.FILTER_ACCEPT
            }
        },
        false
    );
    var events = [];

    do {
        var event_list = [];
        esl.getListenerInfoFor(tw.currentNode,{}).forEach(function(value, key, array) {
            if(value.toSource()){
                event_list.push(value);
            }
        });
        if (event_list.length > 0) {
            events.push({'node': tw.currentNode, 'events': event_list});
        }
    } while (tw.nextNode());

    return events;
};
exports.extractEvents = extractEvents;


const dnsLookup = function(domain, callback) {
    let deffered = Q.defer();
    var listener = {
        onLookupComplete: function(inRequest, inRecord, inStatus) {
            deffered.resolve(inRecord);
        },
        QueryInterface: function(aIID) {
            if (aIID.equals(Ci.nsIDNSListener) ||
                aIID.equals(Ci.nsISupports)) {
                return this;
            }
            throw Cr.NS_ERROR_NO_INTERFACE;
        }
    };

    let mainThread = threadManager.currentThread;
    dnsService.asyncResolve(domain, 0, listener, mainThread);

    let promise = deffered.promise.then(function(record) {
        return record.getNextAddrAsString();
    });

    if (typeof(callback) === "function") {
        promise = promise.then(callback);
    }

    return promise;
};
exports.dnsLookup = dnsLookup;


const xhr = {
    Request: function() {
        return xmlhttprequest.createInstance();
    },

    result: function(xr) {
        var result = {
            status: xr.status,
            statusText: xr.statusText,
            headers: [],
            contentType: null,
            contentCharset: null,
            data: xr.responseText
        };

        var headers = xr.getAllResponseHeaders().replace(/^\s+/g, "").replace(/\s+$/, "").split(/\r?\n/);
        result.headers = headers.map(function(line) {
            var header = line.split(/:\s+/, 2);
            return {
                name: header[0],
                value: header[1]
            };
        });

        result.getHeader = function(name) {
            var value = [];
            this.headers.forEach(function(v) {
                if (v.name.toLowerCase() === name.toLowerCase()) {
                    value.push(v.value);
                }
            });

            return (value.length === 0) ? null : value.join(",");
        };

        var ct = result.getHeader("content-type");
        if (ct) {
            result.contentType = ct.split(";")[0];
            var m = /charset=(.+?)(?:\s*;|$)/i.exec(ct);
            if (m) {
                result.contentCharset = m[1];
            }
        }

        return result;
    },

    query: function(url, method, data, headers, partial) {
        method = method || "GET";
        data = data || null;
        headers = headers || {};

        var _headers = {},
            xr = this.Request(),
            i;

        if (xr === null) {
            throw "No suitable XMLHTTPRequest object found.";
        }

        var result = Q.defer();
        xr.open(method, url, true);
        xr.onreadystatechange = function() {
            try {
                if (partial && xr.readyState === 2) {
                    xr.abort();
                    return;
                }
                if (xr.readyState === 4) {
                    result.resolve(this.result(xr));
                    return;
                }
            } catch(e) {
                result.reject(e);
            }
        }.bind(this);

        for (i in headers) {
            _headers[i.toLowerCase()] = headers[i];
        }
        headers = _headers;

        if (data && typeof(headers["content-type"]) === "undefined") {
            headers["content-type"] = "application/x-www-form-urlencoded";
        }

        for (i in headers) {
            xr.setRequestHeader(i, headers[i]);
        }

        xr.send(stringify(data));
        return result.promise;
    },

    get: function(url, headers) {
        return this.query(url, "GET", null, headers);
    },

    post: function(url, data, headers) {
        return this.query(url, "POST", data, headers);
    },

    partial: function(url, headers) {
        return this.query(url, "GET", null, headers, true);
    }
};
exports.xhr = xhr;
