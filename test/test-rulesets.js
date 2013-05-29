"use strict";
const {openPage, getHarObject, launchTests2, getHTMLFixtures, startServer} = require("./tools");

const file = require("file");
const self = require("self");
const {pathFor} = require("system");

let fixtures = getHTMLFixtures('fixtures/rulesets/*')

let server = startServer(9000);


Object.keys(fixtures).forEach(function(root) {
    fixtures[root].html.forEach(function(html_file) {
        let [rule, filename] = html_file.split("/").slice(-2);
        let test_id = [rule, filename.split(".").slice(0, -1).join("")].join("_");

        exports['test ' + test_id] = function(assert, done) {
            server.setRoot(root);
            let html_uri = server.getURI(html_file.split("/").pop());

            openPage(html_uri).then(function(result) {
                let foo = {}, bar={'c':0,'nc':0,'na':0,'i':0};
                let har = getHarObject(result.browser.contentWindow, html_file, fixtures[root].json);

                result.browser.contentWindow.document.querySelector("meta[http-equiv=X-results]").getAttribute('content').split(',').map(function(element){
                    let aElement = element.split(':')
                    foo[aElement[0].toLowerCase()] = parseInt(aElement[1], 10);
                });

                return launchTests2(result.browser.contentWindow, har, rule).then(function(result){
                    result.tests.oaa_results.forEach(function(test) {
                        test.results_list.map(function(element){
                            bar[element]++;
                        });

                        if(test.id == rule) {
                            let x = Object.keys(foo).every(function(element){
                                return foo[element] == bar[element];
                            });
                            assert.ok(x == true, rule);
                        }
                    });
                })
            })
            .then(null, function(e) {
                console.exception(e);
            })
            .then(done);
        };
    });
});

require("sdk/preferences/service").set("plugins.click_to_play", true);

require("sdk/test").run(exports);
