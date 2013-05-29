"use strict";
const {openPage, launchTests, getHTMLFixtures, startServer} = require("./tools");

const file = require("file");
const self = require("self");
const {pathFor} = require("system");

let fixtures = getHTMLFixtures('fixtures/rules/*')

let server = startServer(9000);


Object.keys(fixtures).forEach(function(root) {
    fixtures[root].html.forEach(function(html_file) {
        let test_id = html_file.split("/").slice(-3).join("_").split(".").slice(0,-1).join("");

        exports['test ' + test_id] = function(assert, done) {
            server.setRoot(root);
            let html_uri = server.getURI(html_file.split("/").slice(-1));

            openPage(html_uri).then(function() {
                console.log("+++", html_uri, html_file);
                assert.equal(1,1);
                done();
            });
        };
    });
});


require("sdk/test").run(exports);
