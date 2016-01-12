'use strict';

// for the moment, this is a simple module, but when it will be finished
// it will be a true frame-script running in a tab process

const {Ci, Cu, Cc, CC} = require("chrome");


const systemPrincipal = CC('@mozilla.org/systemprincipal;1', 'nsIPrincipal')();

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

const _remoteRunner = function(window) {

    let init = function() {
        this.sandbox = createSandbox(window);
    }

    return {
        // ---- methods for which the call should be replaced by a message
        init: init,
        
        // ---- properties that will be private
        sandbox: null,
        evaluate : function(source, file) {
            return evaluateSandbox(this.sandbox, source, file);
        }
    };
}
exports.createRemoteRunner = _remoteRunner;