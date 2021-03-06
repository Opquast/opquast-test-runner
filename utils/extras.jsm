"use strict";

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;

this.EXPORTED_SYMBOLS = [ 'extractEvents', 'dnsLookup', 'xhr' ];

const Q = Cu.import('resource://gre/modules/Promise.jsm', {}).Promise;

const esl = Cc["@mozilla.org/eventlistenerservice;1"]
            .getService(Ci.nsIEventListenerService);
const dnsService = Cc["@mozilla.org/network/dns-service;1"]
            .createInstance(Ci.nsIDNSService);
const threadManager = Cc["@mozilla.org/thread-manager;1"]
            .getService(Ci.nsIThreadManager);
const xmlhttprequest = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"];


this.extractEvents = function(win) {
    let tw = win.document.createTreeWalker(
        win.document,
        win.NodeFilter.SHOW_ELEMENT,
        null,
        false
    );
    let events = [], eventList = [];

    do {
        eventList = [];
        esl.getListenerInfoFor(tw.currentNode,{}).forEach(function(value, key, array) {
            if (typeof(value.toSource) === "function" && tw.currentNode['on' + value.type] !== null) {
                eventList.push(value);
            }
        });
        if (eventList.length > 0) {
            events.push({'node': tw.currentNode, 'events': eventList});
        }
    } while(tw.nextNode());

    return events;
};

this.dnsLookup = function(domain, callback) {
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

this.xhr = {
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

        if (data && typeof(data) == 'string') {
            xr.send(data);
        }
        else if (data) {
            let formData = Cc['@mozilla.org/files/formdata;1'].
                            createInstance(Ci.nsIDOMFormData);
            Object.keys(data).forEach(function(name) { formData.append(name, data[name]); });
            xr.send(formData);
        }
        else {
            xr.send(null);
        }
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

