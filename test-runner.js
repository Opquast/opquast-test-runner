'use strict';

const {Ci, Cu, Cc} = require("chrome");
const {mix} = require('sdk/core/heritage');
const promise = require('sdk/core/promise');
const {readURISync} = require('sdk/net/url');
const {clearTimeout, setTimeout} = require('sdk/timers');

const {validateOptions} = require('sdk/deprecated/api-utils');

var globalMM = Cc["@mozilla.org/globalmessagemanager;1"]
              .getService(Ci.nsIMessageListenerManager);
let frameScriptLoaded = false;

// Javascript files location
const dataRoot = require('sdk/url').URL('../data', module.uri);
exports.dataRoot = dataRoot;

const baseURI = module.uri.replace('test-runner.js', '');

var JS_FILES = [];
var RULES = [];
var SETS = [];


const addFilesToList = function(name, listRef) {
    return function() {
        [].slice.call(arguments).forEach(function(f) {
            if (listRef.indexOf(f) === -1) {
                listRef.push(f);
                console.debug('Added ' + name + ': ' + f);
            }
        });
    };
};

const removeFilesFromList = function(name, listRef) {
    return function() {
        [].slice.call(arguments).forEach(function(f) {
            if (listRef.indexOf(f) !== -1) {
                listRef.splice(listRef.indexOf(f));
                console.debug('Removed ' + name + ': ' + f);
            }
        });
    };
};

const addJSFiles = addFilesToList('JS file', JS_FILES);
const removeJSFiles = removeFilesFromList('JS file', JS_FILES);
exports.addJSFiles = addJSFiles;
exports.removeJSFiles = removeJSFiles;


const addRules = addFilesToList('rules', RULES);
const removeRules = removeFilesFromList('rules', RULES);
exports.addRules = addRules;
exports.removeRules = removeRules;


const addRuleSets = addFilesToList('rulesets', SETS);
const removeRuleSets = removeFilesFromList('rulesets', SETS);
exports.addRuleSets = addRuleSets;
exports.removeRuleSets = removeRuleSets;


const getRules = function() {
    let result = {'rules': {}, 'rulesets': {}};

    RULES.forEach(function(uri) {
        result['rules'] = mix(result['rules'], JSON.parse(readURISync(uri)));
    });
    SETS.forEach(function(uri) {
        result['rulesets'] = mix(result['rulesets'], JSON.parse(readURISync(uri)));
    });

    return result;
};
exports.getRules = getRules;


const getJSFiles = function() {
    return JS_FILES;
};
exports.getJSFiles = getJSFiles;


// Default files
addJSFiles(
    dataRoot + '/lib/cssParser.js',
    dataRoot + '/lib/oqs-validator.js',
    dataRoot + '/lib/oqs-tests.js'
);

addRules(dataRoot + '/rules.json');
addRuleSets(dataRoot + '/rulesets.json');

/**
 * @return string the source code of the given js file
 */
function getJsFileSource (path) {
    let code = null;
    try {
        code = readURISync(path);
    } catch(e) {
        throw new Error('Unable to open "' + path + '".');
    }
    return code;
};

/**
 * @return string the source code of the given function
 */
function getJSSource (func) {
    let args = JSON.stringify(Array.prototype.slice.call(arguments).slice(1));
    let code = '(' + func.toSource() + ').apply(this, ' + args + ')';
    return code;
}

/**
 * use to create a method that will call an API via a message manager,
 * and return results via a Promise
 * @return function
 * @see createRemoteRunner
 */
function createMessagingFunc(browser, messageName) {

    let func = function (parameters) {
        let deferred = promise.defer();
        let mmg = browser.messageManager;
        let onInitEnd = {
            receiveMessage : function(message) {
                if (!(message.target instanceof Ci.nsIDOMXULElement)) {
                    // if message does not come from <browser>, let's ignore it.
                    // In theory, this case does not happened...
                    return
                }
                if (browser.outerWindowID !=  message.target.outerWindowID) {
                    // this message is not for our browser.
                    return;
                }
                globalMM.removeMessageListener(messageName+"_resp", onInitEnd);
                deferred.resolve(message.data);
            }
        }

        globalMM.addMessageListener(messageName+"_resp", onInitEnd);
        mmg.sendAsyncMessage(messageName, parameters);
        return deferred.promise;
    }
    return func;
}

/**
 * create an object that proxify message call to the frame script
 */
function createRemoteRunner(browser) {
    let proxy = {
        init : createMessagingFunc(browser, "opq:init"),
        run :  createMessagingFunc(browser, "opq:run"),
    };
    return proxy;
}

function loadFrameScript() {
    if (!frameScriptLoaded) {
        let frameScriptUri = module.uri.replace('test-runner', 'frame-script');
        globalMM.loadFrameScript(frameScriptUri, true);
        frameScriptLoaded = true;
    }
}

// Test Runner
const createTestRunner = function(browser, opts) {
    let domWindow = browser.contentWindow;
    // Global options
    // note: we cannot set domWindow into options, as we stringify options
    // later and domWindow is not "json" compatible
    let requirements = {
        plainText: {
            is: ['string']
        },
        har: {
            is: ['object'],
            ok: (val) => { return typeof(val.entries) !== 'undefined' && Array.isArray(val.entries)}
        },
        extractObjects: {
            map: (val) => { return typeof(val) === 'boolean' && val || false}
        },
        timeout: {
            map: (val) => { return parseInt(val) || -1 }
        },
        runOptions: {
            map: (val) => { return typeof(val) === 'object' && val || {}}
        },
        createResourceIfEmpty: {
            map: (val) => { return typeof(val) === 'boolean' && val || false}
        }
    };

    let options = validateOptions(opts, requirements);

    // Tests runner options
    let runRequirements = {
        debug_validator: {
            map: (val) => typeof(val) === 'boolean' ? val : false,
        },
        timing_validator: {
            map: (val) => typeof(val) === 'boolean' ? val : false,
        },
        show_errors: {
            map: (val) => typeof(val) === 'boolean' ? val : false,
        },
        config_saveAndRefresh_delay: {
            map: (val) => typeof(val) === 'number' ? parseInt(val) : 1000,
        }
    };
    options.runOptions = validateOptions(options.runOptions, runRequirements);

    loadFrameScript();
    let remoteRunner = createRemoteRunner(browser);
    let initDone = false;

    /**
     * @return Promise
     */
    let init = function() {
        if (initDone) {
            return promise.resolve();
        }
        initDone = true;

        let runnerOptions = {
            dataRoot: dataRoot,
            baseURI: baseURI,
            initialSource: getJsFileSource(dataRoot + '/lib/jquery-1.9.1.min.js'),
            oqs_utils: getJsFileSource(dataRoot + '/lib/oqs-utils.js'),
            har: options.har,
            extractObjects : options.extractObjects,
            createResourceIfEmpty: options.createResourceIfEmpty
        }

        // Inject jQuery & coexist with other versions
        runnerOptions.initialSource += getJSSource(function() {
            // Doing this removes our jQuery from the page but provides a global
            // jQuery version in sandbox
            this.jQuery = $.noConflict(true);
            this.$ = this.jQuery;
        });

        return remoteRunner.init(runnerOptions);
    };


    // Tests runner
    let runTests = function(testIDs) {
        testIDs = testIDs || [];

        // Load rules & rulesets
        let {rules, rulesets} = getRules();

        // Rulesets subset if needed
        if (testIDs.length > 0) {
            let _rulesets = {};
            for (var k in rulesets) {
                if (testIDs.indexOf(k) !== -1) {
                    _rulesets[k] = rulesets[k];
                }
            }
            rulesets = _rulesets;
        }

        let timeout = null;
        if (options.timeout > 0) {
            timeout = setTimeout(function() {
                deferred.reject(new Error('Test timeout (' + options.timeout + ')'));
            }, options.timeout);
        }

        return init()
        .then(function() {
            // Now we can run tests
            let parameters = {
                rules: rules,
                rulesets : rulesets,
                jsFiles : {},
                plainText : options.plainText,
                runOptions : options.runOptions
            }
            getJSFiles().forEach(function(uri) {
                parameters.jsFiles[uri] = getJsFileSource(uri);
            });
            return remoteRunner.run(parameters);
        })
        .then(function(results) {
            if (timeout) {
                clearTimeout(timeout);
            }
            return results;
        });
    };

    return {
        init: init,
        run: runTests
    };
};

exports.create = createTestRunner;
