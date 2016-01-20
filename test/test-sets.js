"use strict";
const {openPage, getHarObject, launchTests2, getHTMLFixtures, startServer} = require("./tools");

const file = require("sdk/io/file");
const self = require("sdk/self");
const {pathFor} = require("sdk/system");

let fixtures = getHTMLFixtures('fixtures/sets/*'),
    server = startServer(9000);

Object.keys(fixtures).forEach(function(root) {
    fixtures[root].html.forEach(function(html_file) {
        let [rule, filename] = html_file.split("/").slice(-2),
            test_id = [rule, filename.split(".").slice(0, -1).join("")].join("_");

        exports['test ' + test_id] = function(assert, done) {
            server.setRoot(root);
            let html_uri = server.getURI(html_file.split("/").pop());
            openPage(html_uri).then(function(loadingInfo) {
                let bar={'c':0,'nc':0,'na':0,'i':0},
                    har = getHarObject(loadingInfo.windowInfo, html_file, fixtures[root].json);

                return launchTests2(loadingInfo.browser, har, rule).then(function(result){
                    result.tests.oaa_results.forEach(function(test) {
                        test.results_list.map(function(element){
                            bar[element]++;
                        });

                        if(test.id == rule) {
                            let x = Object.keys(loadingInfo.windowInfo.x_results).every(function(element){
                                return loadingInfo.windowInfo.x_results[element] == bar[element];
                            });
                            assert.ok(x == true, rule);
                        }
                    });
                })
            }).then(null, function(e) {
                console.exception(e);
            }).then(done);
        };
    });
});

require("sdk/preferences/service").set("plugins.click_to_play", true);
require("sdk/preferences/service").set("accessibility.blockautorefresh", true);
