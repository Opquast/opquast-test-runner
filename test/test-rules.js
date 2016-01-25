"use strict";
const {openPage, getHarObject, launchTests, getHTMLFixtures, startServer} = require("./tools");

const file = require("sdk/io/file");
const self = require("sdk/self");
const {pathFor} = require("sdk/system");

let fixtures = getHTMLFixtures('fixtures/rules/*'),
    server = startServer(9010);

Object.keys(fixtures).forEach(function(root) {
    fixtures[root].html.forEach(function(html_file) {
        let [rule, expected, filename] = html_file.split("/").slice(-3),
            test_id = [rule, expected, filename.split(".").slice(0, -1).join("")].join("_");

        exports['test ' + test_id] = function(assert, done) {
            server.setRoot(root);
            let html_uri = server.getURI(html_file.split("/").slice(-1));

            openPage(html_uri).then(function(result) {
                let har = getHarObject(result.windowInfo, html_file, fixtures[root].json);

                return launchTests(result.browser, har, rule).then(function(res){
                    res.tests.oaa_results.forEach(function(test) {
                        if(test.id == rule) {
                            assert.ok((expected == "true" && test.result == "c") || (expected == "false" && test.result == "nc"), rule + " " + expected);
                        }
                    });
                });
            }).then(null, function(e) {
                console.exception(e);
            }).then(done);
        };
    });
});

require("sdk/preferences/service").set("plugins.click_to_play", true);
require("sdk/preferences/service").set("accessibility.blockautorefresh", true);
