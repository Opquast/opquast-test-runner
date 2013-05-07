/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Some useful functions for testing purpose

'use strict';

const {Cc, Ci} = require('chrome');

const Q = require('sdk/core/promise');
const {getBrowserForTab, getOwnerWindow} = require('sdk/tabs/utils');
const {setTimeout, clearTimeout} = require('sdk/timers');
const {URL} = require('sdk/url');
const SandBox = require("sdk/loader/sandbox");

const wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
const testRunner = require("opquast-tests/test-runner");

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
                clearTimeout(timeout)
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
        }

        return {
            tab: tab,
            browser: browser,
            open: open,
            close: close
        }
    });
};
exports.openTab = openTab;

let launchTests = function(domWindow, har) {
    let startTime = new Date();

    // Prepare checklists
    /*let checklists = {};
    getChecklistFiles().forEach(function(filename) {
        let cl = JSON.parse(self.data.load(filename));
        for (let k in cl) {
            checklists[k] = cl[k];
        }
    });*/

    // New sandbox for testRunner
    let sandbox = SandBox.sandbox(domWindow, {
        sandboxPrototype: domWindow,
        wantXrays: false,
        wantComponents: false
    });

    // Get page code
    let plainText = "";
    har.entries.forEach(function(entry) {
        if (plainText !== "") return;
        if (entry._url === domWindow.location.href) {
            plainText = entry.response.content.text || "";
        }
    });

    // Launch tests
    let runner = testRunner.create({
        sandbox: sandbox,
        har: har,
        plainText: plainText,
        extractObjects: false
    });

    return runner.init()
    .then(function() {
        // Create a fake first request if void
        /*if (runner.resources.length == 0) {
            runner.resources.push({
                date: domWindow.document.lastModified,
                modified: domWindow.document.lastModified,
                expires: null,
                content_type: domWindow.document.contentType,
                charset: domWindow.document.characterSet,
                size: domWindow.XMLSerializer().serializeToString(domWindow.document).length,
                headers: {},
                uri: domWindow.location.href,
                referrer: "",
                method: "GET",
                status: 200,
                status_text: "200 OK"
            });
        }*/

        startTime = new Date();
        return runner.run(['10058']);
    })
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

exports.launchTests = launchTests;