var debug_validator = false;
var show_errors = false;
var timing_validator = false;
var config_saveAndRefresh_delay = 1000;
// 1500
var i, j, k;
var tests, criteria, results, checklists;
var timer = 0;
var urls_known = [], urls_to_add = [], urls_tested = [];
var tested_pages_counter = 0;
var unvalid_urls = {};
var page_evaluation_results = {};
var analyze, synthesize_results;
var logger;

(function($, window, undefined) {
    // ------------------------------------------
    // Logger
    /**
     * Javascript Logger
     *
     * @author Mickaël Hoareau
     * @version 1.0
     */
    logger = {
        log_firebug: true,
        log_alert: false,
        log_ajax: false,
        show_date: false,
        log: function(tag, message) {
            if (debug_validator) {
                // Init date
                var date = "";
                if (this.show_date) {
                    date = (new Date()).toUTCString();
                }

                var log_message = date + '[' + tag + '] ' + message;

                // Firebug logging, Firefox specific test
                if (this.log_firebug && console) {
                    console.log(log_message);
                }

                // Throw an alert window
                if (this.log_alert) {
                    alert(log_message);
                }

                // Ajax logging
                if (this.log_ajax) {
                    //$.post(api_url + "js_log", JSON.stringify(log_message));
                }
            }
        },
        logObject: function(tag, object) {
            if (debug_validator) {
                // Firebug logging
                if (this.log_firebug && console) {
                    console.log('[' + tag + '] ', object);
                }

                // Ajax logging
                if (this.log_ajax) {
                    //$.post(api_url + "js_log", JSON.stringify(object));
                }
            }
        },
        error: function(tag, error) {
            if (!show_errors) {
                return;
            }

            let msg = "-------------------- ERROR\n" + tag + "\n";

            if (typeof(error) === "string") {
                msg += error;
            }
            if (error.name) {
                msg += error.name;
            }
            if (error.message) {
                msg += "\nMessage:\n" + error.message;
            }
            if (error.stack) {
                msg += "\nStack:\n" + error.stack;
            }

            msg += "\n--------------------------\n";

            console.log(msg);
        }
    };
    // (fin Logger)
    // ------------------------------------------

    // ------------------------------------------
    // Client API
    /**
     * Client API
     *
     * @author Mickaël Hoareau
     * @version 1.0
     */
    var api_client = {
        __call: function(service, method, data, callback) {
            if (!callback) {
                callback = function() {
                };
            }

            var options = {
                async: false,
                dataType: 'json',
                data: data,
                type: method,
                url: api_url + service,
                complete: callback
            };

            return $.ajax(options);
        },
        create_token: function(service_name, parameters) {
            //
            try {
                // prepare params
                var params = {
                    'username': api_user_name,
                    'api_key': api_key,
                    'service_name': service_name,
                    'service_parameters': parameters
                };
                logger.log(Object("api_client.create_token", params));

                var json_data = JSON.stringify(params);

                var httrequest = this.__call('token_create', "POST", json_data);

                var server_response;

                if (httrequest.responseText) {
                    server_response = JSON.parse(httrequest.responseText);
                }

                //
                return server_response;
            }

            //
            catch (err) {
                logger.log("-.create_token", "Problème lors de la création du token");
                logger.error("api_client.create_token", err);
            }

            //
            return false;
        }
    };
    // (fin Logger)
    // ------------------------------------------

    // ------------------------------------------
    // Prototype page
    function Page(id, url, name) {
        this.id = id;
        this.url = url;
        this.name = name;
    }


    Page.prototype = {
        toString: function() {
            return "Page Object: " + this.id + ", " + this.url;
        },
        toJSON: function() {
            return {
                id: this.id,
                url: this.url,
                name: this.name
            };
        }
    };

    // (fin prototype page)
    // ------------------------------------------

    // Array Remove - By John Resig (MIT Licensed)
    Array.remove = function(array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    };
    /**
     * Custom:internal(hostname) selector to collect internal links
     *
     * @author Mickaël Hoareau
     * @version 1.0
     */
    $.expr[':'].internal = function(obj, index, meta, stack) {

        // Dealing with <a>
        if (obj.href) {
            return !obj.href.match(/^(javascript|mailto)\:/) && (obj.hostname == meta[3]);
        }

        // Dealing with <frame> and <iframe>
        else if (obj.src) {
            return !obj.src.match(/^(javascript|mailto)\:/) && (obj.hostname == meta[3]);
        }

        return false;
    };

    /**
     * Init on dom's load
     *
     * @author Fabrice Bonny, Mickaël Hoareau
     * @version 1.0
     */
    /*function initJson() {
        //
        try {
            //
            if (tests === null || criteria === null) {
                // load criteria and tests
                $.get(api_url + "checklists/" + json_checklist + "/criteria/", function(data) {
                    var _tmp = JSON.parse(data);

                    //
                    if (_tmp.test) {
                        tests = _tmp.test;
                    } else {
                        logger.log('Init Error', 'tests not found');
                    }

                    //
                    if (_tmp.criteria) {
                        criteria = _tmp.criteria;
                    } else {
                        logger.log('Init Error', 'criteria not found');
                    }
                });
            }

            //
            return true;
        }

        //
        catch (err) {
            logger.error("initJson", err);
        }

        //
        return false;
    }*/

    /**
     *
     * @param doc
     * @return
     */
    window._analyseStylesheets = function _analyseStylesheets(doc, media, callback) {
        var css, src,
            promises = [],
            extSheets = doc.styleSheets,
            intSheets = $("style");

        for (var i = 0; i < extSheets.length; i++) {
            css = extSheets.item(i);

            if (css.ownerNode.tagName.toUpperCase() === "STYLE") {
                continue;
            }

            src = css.href;
            promises.push(
                XHR.get(src).then(function(response) {
                    var parser = new CSSParser(),
                        sheet = parser.parse(response.data, false, false);
                    sheet._extra = {
                        "media": css.media,
                        "href": src
                    };
                    sheet.resolveVariables(media);

                    return {
                        "src": src,
                        "content": response.data,
                        "sheet": sheet,
                        "media": media
                    }
                }).then(null, function(err) {
                    logger.error("_analyseStylesheets", err);
                    return false;
                })
            );
        }

        intSheets.each(function() {
            if ($.trim($(this).text()) != "") {
                var parser = new CSSParser(),
                    sheet = parser.parse($(this).text(), false, false),
                    _media = $.trim($(this).attr("media")).split(" ");

                _media.pop("");
                sheet._extra = {
                    "media": _media,
                    "href": "interne"
                };
                sheet.resolveVariables(media);

                promises.push({
                    "src": "interne",
                    "content": $(this).text(),
                    "sheet": sheet,
                    "media": media
                });
            }
        });

        return Q.promised(Array).apply(null, promises).then(function(res) {
            var subPromises = [];
            res.filter(function(val) {
                return val !== false;
            }).forEach(function(val) {
                if ($.isArray(callback)) {
                    callback.push({
                        "media": val.media,
                        "href": val.src
                    });
                }
                subPromises.push(_analyseStylesheet(val.sheet, val.media, callback));
            });
            return Q.promised(Array).apply(null, subPromises);
        })
        .then(function(res) {
            var result = [];
            res.forEach(function(val) {
                $.deepMerge(result, val);
            });
            return result;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    function _analyseStylesheet(sheet, media, callback) {
        var promises = [];

        // no media
        if (sheet._extra["media"].length == 0) {
            var rules = sheet.cssRules;

            // rules walk
            for (var k = 0; k < rules.length; k++) {
                if ( _rule = rules[k]) {
                    promises.push(_analyseRule(_rule, media, callback));
                }
            }
        } else {
            // media walk
            for (var j = 0; j < sheet._extra["media"].length; j++) {
                var _media = sheet._extra["media"].item && sheet._extra["media"].item(j) || sheet._extra["media"][j];
                if ($.startsWith(_media, media) || $.startsWith(_media, "only " + media) || _media == "all") {
                    var rules = sheet.cssRules;

                    // rules walk
                    for (var k = 0; k < rules.length; k++) {
                        if ( _rule = rules[k]) {
                            promises.push(_analyseRule(_rule, media, callback));
                        }
                    }
                }
            }
        }

        return Q.promised(Array).apply(null, promises).then(function(res) {
            res = res.filter(function(val) {
                return val;
            });
            return Q.promised(Array).apply(null, res);
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    function _analyseRule(rule, media, callback) {
        // style rule
        if (rule.type == CSSRule.STYLE_RULE) {
            if (typeof(callback) === "function") {
                return callback(rule);
            }
        }

        // media rule
        else if (rule.type == CSSRule.MEDIA_RULE) {
            // media walk
            for (var l = 0; l < rule.media.length; l++) {
                //
                var _media = rule.media.item && rule.media.item(l) || rule.media[l];
                if ($.startsWith(_media, media) || $.startsWith(_media, "only " + media) || _media == "all") {
                    var rules = rule.cssRules;

                    // rules walk
                    for (var k = 0; k < rules.length; k++) {
                        var rule = rules[k];

                        return _analyseRule(rule, media, callback);
                    }
                }
            }
        }

        // import rule
        else if (rule.type == CSSRule.IMPORT_RULE) {
            var promises = [];
            // media walk
            for (var l = 0; l < rule.media.length; l++) {
                var _media = rule.media.item && rule.media.item(l) || rule.media[l];
                if ($.startsWith(_media, media) || $.startsWith(_media, "only " + media) || _media == "all") {
                    var re = new RegExp().compile("(url\\()?'?\"?([^'\"\\)]*)", "i");
                    re.test(rule.href);
                    var href = $.trim(RegExp.$2);

                    promises.push(
                        XHR.get(href).then(function(response) {
                            var parser = new CSSParser(),
                                sheet = parser.parse(response.data, false, false);
                            sheet._extra = {
                                "media": rule.media,
                                "href": href
                            };
                            sheet.resolveVariables(media);

                            return {
                                "src": "interne",
                                "content": response.data,
                                "sheet": sheet,
                                "media": media
                            };
                        })
                    );
                }
            }

            return Q.promised(Array).apply(null, promises).then(function(res) {
                var subPromises = [];
                res.filter(function(val) {
                    return val !== false;
                }).forEach(function(val) {
                    if ($.isArray(callback)) {
                        callback.push({
                            "media": val.media,
                            "href": val.src
                        });
                    }
                    subPromises.push(_analyseStylesheet(val.sheet, val.media, callback));
                });
                return Q.promised(Array).apply(null, subPromises);
            });
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    function _getXPath(node) {
        //
        var xpath = "";

        //
        for (; node && node.nodeType == Node.ELEMENT_NODE; node = node.parentNode) {
            //
            var idx = 1, xname = node.localName;

            //
            if (node.hasAttribute("id")) {
                idx = 'id="' + node.id + '"';

                //
                xpath = "//" + xname + "[" + idx + "]" + xpath;
                break;
            }

            //
            else {
                for (var sib = node.previousSibling; sib; sib = sib.previousSibling) {
                    if (sib.nodeType == Node.ELEMENT_NODE && sib.localName == xname) {
                        idx++;
                    }
                }
            }

            //
            if (idx != 1) {
                xname += "[" + idx + "]";
                xpath = "/" + xname + xpath;
            }

            //
            else {
                xpath = "/" + xname + xpath;
            }
        }

        //
        return xpath;
    }

    /**
     *
     * @param doc
     * @return
     */
    function _getSelector(node) {
        //
        var selector = "";

        //
        for (; node && node.nodeType == Node.ELEMENT_NODE; node = node.parentNode) {
            //
            var xname = node.localName;

            //
            if (node.hasAttribute("id")) {
                //
                var id = '#' + node.id;

                //
                if (selector != "") {
                    selector = xname + id + " > " + selector;
                } else {
                    selector = xname + id;
                }
                break;
            }

            //
            else {
                //
                var idx = 1;

                //
                for (var sib = node.previousSibling; sib; sib = sib.previousSibling) {
                    //
                    if (sib.nodeType == Node.ELEMENT_NODE && sib.localName == xname) {
                        idx++;
                    }
                }

                //
                if (selector != "") {
                    selector = xname + ":nth-of-type(" + idx + ") > " + selector;
                } else {
                    selector = xname + ":nth-of-type(" + idx + ")";
                }
            }
        }

        //
        return selector;
    }

    /**
     *
     * @param doc
     * @return
     */
    window._getDetails = function _getDetails(node) {
        //
        if (node == undefined) {
            return {};
        }

        //
        if (node == String(document)) {
            node = node.body;
        }

        //
        var tmp;

        // cached
        if ($(node).data("_details")) {
            tmp = $(node).data("_details");
        }

        // not cached
        else {
            //
            var _item = node,
                _attributes = _item.attributes;

            //
            tmp = {
                "tag": "",
                "namespace": "",
                "attributes": [],
                "xpath": ""
            };

            // item
            tmp.tag = _item.localName;

            //
            if (_item.namespaceURI) {
                tmp.namespace = _item.namespaceURI;
            }

            //
            for (var j = 0; j < _attributes.length; j++) {
                //
                var _attribute = _attributes[j];
                var _tmp = {
                    "name": _attribute.nodeName,
                    "namespace": "",
                    "value": _attribute.nodeValue
                };

                //
                if (_attribute.namespaceURI) {
                    _tmp.namespace = _attribute.namespaceURI;
                }

                //
                tmp.attributes.push(_tmp);
            }

            // parent
            try {
                // xpath
                tmp.xpath = _getXPath(_item);
            }

            //
            catch(e) {
                //
                tmp.xpath = "/" + _item.localName;
            }

            tmp.selector = _getSelector(_item);
            try {
                tmp.text = _item.outerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;").substr(0, 200);
            } catch(e) {
                try {
                    tmp.text = (new XMLSerializer()).serializeToString(_item).replace(/</g, "&lt;").replace(/>/g, "&gt;").substr(0, 200);
                } catch(e) {}
            }

            // caching
            $(node).data("_details", tmp);
        }

        //
        return tmp;
    }

    /**
     *
     * @param doc
     * @return
     */
    window._getCssDetails = function _getCssDetails(rule, i) {
        //
        return rule.parentStyleSheet._extra["href"] + " (ligne " + rule.currentLine + ") : " + rule.mSelectorText + " {" + rule.declarations[i]["parsedCssText"] + "}";
    }

    /**
     *
     * @param doc
     * @return
     */
    window._getInlineCssDetails = function _getInlineCssDetails(rule, i, item) {
        //
        return "style en ligne sur " + _getXPath(item) + " : " + rule.declarations[i]["parsedCssText"];
    }

    /**
     *
     * @param doc
     * @return
     */
    window._getHttpDetails = function _getHttpDetails(url, headers) {
        //
        var _headers = "";
        for each (header in Object.keys(headers)) {
            _headers += "\n" + header + ": " + headers[header];
        }

        //
        return "entête HTTP de " + url + " :" + _headers;
    }

    /**
     *
     * @param url
     * @return
     */
    window._absolutizeURL = function _absolutizeURL(url) {
        //
        var a = document.createElement('a');
        a.href = url;

        //
        return a.href;
    }

    /**
     *
     * @param node
     * @return
     */
    window._getAllText = function _getAllText(node) {
        //
        if (node == undefined) {
            return "";
        }

        //
        var tmp;

        /*// cached
        if($(node).data("_all_text")) {
        tmp = $(node).data("_all_text");
        }

        // not cached
        else {*/
        //
        var text = "";
        var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
            acceptNode: function(_node) {
                //
                if (_node.tagName == "IMG") {
                    text += " " + $(_node).attr("alt").trim();
                }

                //
                else if (_node.nodeType == Node.TEXT_NODE) {
                    text += " " + $.trim(_node.nodeValue);
                }

                //
                return NodeFilter.FILTER_ACCEPT;
            }
        }, false);

        //
        while (treeWalker.nextNode()) {
        }

        //
        tmp = $.trim(text.toLowerCase());
        /*// caching
        $(node).data("_all_text", tmp);
        }*/

        //
        return tmp;
    }

    /**
     *
     * @param node
     * @return
     */
    window._getAllTextWoAlt = function _getAllTextWoAlt(node) {
        //
        if (node == undefined) {
            return "";
        }

        //
        var tmp;

        /*// cached
        if($(node).data("_all_text")) {
        tmp = $(node).data("_all_text");
        }

        // not cached
        else {*/
        //
        var text = "";
        var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode: function(_node) {
                text += " " + $.trim(_node.nodeValue);

                //
                return NodeFilter.FILTER_ACCEPT;
            }
        }, false);

        //
        while (treeWalker.nextNode()) {
        }

        //
        tmp = $.trim(text.toLowerCase());
        /*// caching
        $(node).data("_all_text", tmp);
        }*/

        //
        return tmp;
    }

    /**
     * Get a page in the pages stack
     *
     * @author Mickaël Hoareau
     * @version 1.0
     */
    function get_page() {
        //
        try {
            // Logging
            logger.log("get_page", "-- get_page --");
            logger.log(Object("get_page", ["Pages: ", pages]));
            logger.log(Object("get_page", ["urls_to_add: ", urls_to_add]));
            logger.log(Object("get_page", ["urls_tested: ", urls_tested]));

            var returnedPage = false;

            // First, we try to get a page from the sample
            for (i in pages) {
                var _page = pages[i];
                var _url = _page.url;

                // The page from stack should not have already tested
                if ($.inArray(_url, urls_tested) == -1) {
                    // The selected page will be tested and his URL is marked as
                    // "known"
                    urls_known.push(_url);

                    // One a the first things to do is to check that the given URL
                    // has a correct URL syntax.
                    var validity_check = check_url_validity(_url);

                    // If the syntax of the URL is incorrect, we put the page in the
                    // "invalid" stack
                    if (!validity_check.is_valid) {
                        unvalid_urls[_url] = _page;
                        logger.log("get_page", "invalid url: " + _url);

                        continue;
                    }
                    returnedPage = _page;
                    break;
                }

            }

            // Then we try to get one in the explored URLs
            if (!returnedPage) {
                for (i in urls_to_add) {
                    var date = new Date();
                    var timestamp = date.getTime();
                    var page_id = "None_" + timestamp;

                    var page = {
                        id: page_id,
                        url: urls_to_add[i],
                        name: ""
                    };
                    var url = page.url;

                    // Check mimetype et http response code
                    var validity_check = check_url_validity(url);

                    if (!validity_check.is_valid) {
                        Array.remove(urls_to_add, i);
                        logger.log("get_page", "URL not valid (rejected): " + JSON.stringify(validity_check));
                        continue;
                    }

                    if ($.inArray(url, urls_tested) == -1 && $.inArray(url, urls_known) == -1) {
                        urls_known.push(url);
                        Array.remove(urls_to_add, i);
                        returnedPage = page;
                        break;
                    }
                }
            }

            // Logging
            logger.log(Object("get_page", ["Page: ", returnedPage]));

            //
            return returnedPage;

        } catch (err) {
            // Error Logging
            logger.error("get_page", err);
        }

        //
        return false;
    }

    /**
     * Save results en refresh
     *
     * @author Mickaël Hoareau
     * @version 1.0
     * @param {list
     *            <int>} criteria: List of criterion ids of the criteria to be
     *            tested
     * @param {int}
     *            token_id: token id (security parameter)
     * @param {string}
     *            mode: Validation mode
     * @param {string}
     *            progression_div_id The #id of the div which display the
     *            progression informations
     */
    function saveAndRefresh2(criteria, token_id, mode, progression_div_id) {
        //
        try {
            // Logging
            logger.log("SaveAndRefresh", "Mode: " + mode);
            logger.log("SaveAndRefresh", "Nombre d'iframe en queue: " + $("body").data("queue").length);

            if (!progression_div_id) {
                progression_div_id = 'js_validator_status';
            }

            if ($("body").data("queue").length !== 0) {
                setTimeout(function() {
                    saveAndRefresh(criteria, token_id, mode, progression_div_id);
                }, config_saveAndRefresh_delay);
                return -1;
            }

            if ($("#" + progression_div_id).size()) {
                $("#" + progression_div_id).text("Enregistrement des résultats");
            }

            // Logging
            logger.log("SaveAndRefresh", "results: " + JSON.stringify(results));

            var _synthesized_results = synthesize_results();

            // Logging
            logger.log("SaveAndRefresh", "results: " + JSON.stringify(_synthesized_results));

            var service_url = "";

            if (mode == 'page') {
                service_url = "projects/" + json_project + "/pages/" + page_id + "/evaluations/" + json_evaluation + "/update";
            } else {
                service_url = "projects/" + json_project + "/evaluations/" + json_evaluation + "/update";
            }

            logger.log('saveAndRefresh', api_url + service_url);

            $.ajax({
                type: 'POST',
                crossDomain: true,
                url: api_url + service_url,
                data: JSON.stringify(_synthesized_results),
                success: function(data, textStatus, XMLHttpRequest) {
                    for (var criterion_index in criteria) {
                        // Get the criterion ID
                        var criterion_id = criteria[criterion_index];

                        // Logging
                        logger.log("SaveAndRefresh", "update row for criterion: " + criterion_id);

                        // Get the concerned row
                        var result_row = $("tr#bp" + criterion_id)[0];
                        var result_row_model = page_evaluation_results[criterion_id];

                        // Logging
                        logger.log("SaveAndRefresh", "concerned row: " + $(result_row).attr('id'));

                        // Reload the validation form
                        if (!$("#jq_modal").is(':hidden')) {
                            $("#jq_modal").reload_evaluation_modal(result_row_model);
                        }

                        var jq_eval_panel = $("#jq_modal")[0];
                        var jq_panel_options = $(jq_eval_panel).data('panel_options');

                        // Update the row
                        logger.log("SaveAndRefresh", JSON.stringify(jq_eval_panel));
                        logger.log("SaveAndRefresh", JSON.stringify(jq_panel_options));
                        $(result_row).refreshResult({
                            'resultRow': result_row,
                            'jq_eval_panel': jq_eval_panel,
                            'jq_panel_options': jq_panel_options
                        });
                    }

                    // Remove the waiting window
                    $('#waitingDiv').remove();
                },
                error: function(data, textStatus, XMLHttpRequest) {
                    $('#waitingDiv').text('<strong>Une erreur est survenur lors de l\'enregistrement des résultats.</strong>');

                    //
                    logger.log("SaveAndRefresh", 'An error occured while saving.');
                }
            });

            //        $.ajax(api_url + service_url,
            //               JSON.stringify(_synthesized_results),
            //
            //        );

            //
            return true;
        }

        //
        catch (err) {
            // Error Logging
            logger.error("saveAndRefresh", err);
        }

        //
        return false;
    }

    /**
     *
     * @return
     */
    synthesize_results = function(arg_results) {
        try {
            //
            var _local_result = [];

            //
            logger.log("synthesize_results", arg_results.length);

            //
            for (var i = 0; i < arg_results.length; i++) {
                //
                var criterion_data = arg_results[i];
                var statuses = criterion_data.results;
                var status = 'nt';
                var _tmp = {
                    'id': criterion_data.id,
                    'result': status,
                    'results_list': statuses,
                    'comment': (criterion_data.comments || []).join(",\n"),
                    'details': criterion_data.details,
                    'time': criterion_data.time
                };

                logger.log("synthesize_results", JSON.stringify(criterion_data));

                statuses = $.uniq(statuses);
                if (statuses.length == 1) {
                    status = statuses[0];
                } else {
                    if ($.inArray('nc', statuses) != -1) {
                        status = 'nc';
                    } else if ($.inArray('i', statuses) != -1 || $.inArray('nt', statuses) != -1) {
                        status = 'i';
                    } else {
                        status = "c";
                    }
                }

                _tmp["result"] = status;

                _local_result.push(_tmp);
            }

            logger.log("synthesize_results", 'Sortie de boucle');
            logger.log("synthesize_results", _local_result.length);

            return _local_result;
        }

        //
        catch (err) {
            // Error Logging
            logger.error("synthesize_results", err);
        }

        //
        return false;
    }

    /**
     * Analyse the page
     *
     * @author Fabrice Bonny
     * @version 1.0
     * @param {iframe}
     *            iframe object
     * @param {list
     *            <integer>} criterion ids of the criteria to be tested
     */
    analyze = function(criteria) {
        return loop_over_criteria(criteria).then(null, function(err) {
            // Error Logging
            logger.error("analyze", err);
        });
    }

    /**
     * Test all the criteria
     *
     * @author Mickaël Hoareau
     * @version 1.0
     * @param {list
     *            <integer>} used_criteria Ids of the criteria to be tested
     * @param {DocumentElement}
     *            doc The page document to test (the content of the iframe)
     * @param {integer}
     *            page_id The page_id to test
     * @param {pageObject}
     *            page The page to test
     */
    function loop_over_criteria(used_criteria) {
        var promises = [],
            results = [];

        var todo = Object.keys(used_criteria);
        var p;

        function decrementTodo(testID) {
            todo = todo.filter(function(v) { return v != testID });
        }

        for (var index in used_criteria) {
            logger.log("loop_over_criteria", "criterion: " + index);

            try {
                p = loop_over_tests(index, used_criteria[index]);
            } catch(err) {
                p = Q.reject(err);
            }

            p.then(function(result) {
                results.push(result);
            })
            .then(decrementTodo.bind(null, index), decrementTodo.bind(null, index));

            promises.push(p);
        }

        /*
        It looks crazy and we should be using Q.promised(Array) but for some reason it not
        always works as excepted. We fall back to this crapy (but working) solution.
        */
        var deferred = Q.defer();

        var interval = setInterval(function() {
            if (todo.length === 0) {
                clearInterval(interval);
                deferred.resolve(results);
            }
        },5);

        return deferred.promise;
    }

    /**
     * Test all the unit tests of the criterion
     *
     * @author Mickaël Hoareau
     * @version 1.0
     * @param {DocumentElement}
     *            doc The page document to test (the content of the iframe)
     * @param {integer}
     *            criterion Id of the criterion to be tested
     * @param {list
     *            <object>} test_list The unit tests to apply
     */
    function loop_over_tests(criterion, tests_list) {
        var _test,
            _test_actions,
            p,
            promises = [],
            start = new Date();

        for (var test_id in tests_list) {
            _test = tests[test_id];
            _test_actions = tests_list[test_id];

            // Logging
            logger.log("loop_over_tests", "test_id: " + test_id);
            logger.log("loop_over_tests", "_test: " + _test);
            logger.log("loop_over_tests", "_test_actions: " + JSON.stringify(_test_actions));

            try {
                p = apply_test(document, _test, _test_actions);
                promises.push(p);
            } catch(err) {
                promises.push(Q.reject(err));
            }
        }

        return Q.promised(Array).apply(null, promises).then(function(results) {
            var res = {
                id: criterion,
                results: [],
                comments: [],
                details: [],
                time: new Date() - start
            };
            results.forEach(function(r) {
                $.merge(res.results, r.results);
                $.merge(res.comments, r.comments);
                $.merge(res.details, r.details);
            });
            res.comments = res.comments.filter(function(v) v !== null && v !== undefined);
            res.details = res.details.filter(function(v) v !== null && v !== undefined);
            return res;
        }).then(null, function(err) {
            // Error Logging
            logger.error("loop_over_tests", err);
        });
    }

    /**
     *
     * @author Fabrice Bonny
     * @version 1.0
     * @param {doc}
     *            document to parse
     * @param {test}
     *            unit test
     * @param {language}
     *            language for the test
     * @return {XPathResult} parsing result
     * @todo use doc.createExpression to compile XPath expressions (perfs)
     */
    function apply_xpath_test(doc, test, language) {
        //
        var _result = [];

        //
        try {
            //
            if (language == "html") {
                //
                logger.log(Object('apply_xpath_test', doc));
                logger.log(Object('apply_xpath_test', test));
                logger.log(Object('apply_xpath_test', XPathResult.ORDERED_NODE_SNAPSHOT_TYPE));

                //
                var _result = [], nodesSnapshot, nsResolver = null;

                //
                if (document.contentType == "application/xhtml+xml") {
                    //
                    function nsResolver(prefix) {
                        return 'http://www.w3.org/1999/xhtml';
                    }

                    // replace tags by xhtml:tags and reverse for functions (like count() or text())
                    test = test.replace(new RegExp("(/+)([^@])", "g"), "$1xhtml:$2").replace(new RegExp("(::)([^@])", "g"), "$1xhtml:$2").replace(new RegExp("xhtml:([-a-zA-Z]+\\()", "g"), "$1");

                    //
                    nodesSnapshot = doc.evaluate(test, doc, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                } else {
                    //
                    nodesSnapshot = doc.evaluate(test, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                }

                //
                logger.log(Object('apply_xpath_test', _result));

                //
                for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
                    //
                    _result.push(_getDetails(nodesSnapshot.snapshotItem(i)));
                }

                //
                return _result;
            }

            //
            else if (language == "css") {
                // Regexps
                var reg = new RegExp().compile("^(.+)\\[(.+)\\]$", "i");
                var reg_not = new RegExp().compile("^(.+)\\[not\\((.+)\\)\\]$", "i");

                //
                var starts_with = new RegExp().compile("^starts-with\\(@(.+), ?'(.+)'\\)$", "i");
                var ends_with = new RegExp().compile("^ends-with\\(@(.+), ?'(.+)'\\)$", "i");
                var contains = new RegExp().compile("^contains\\(@(.+), ?'(.+)'\\)$", "i");
                var equals = new RegExp().compile("^@(.+), ?'(.+)'$", "i");
                var presence = new RegExp().compile("^@(.+)$", "i");

                //
                var inversion = false;
                var _comparison = "";
                var _selector = "";
                var _test = "";
                var _property = "";
                var _value = "";
                var _result = [];
                var sheets = doc.styleSheets;

                // inversion
                if (reg_not.test(test)) {
                    //
                    inversion = true;
                    _selector = RegExp.$1;
                    _test = RegExp.$2;
                }

                //
                else if (reg.test(test)) {
                    //
                    _selector = RegExp.$1;
                    _test = RegExp.$2;
                }

                //
                else {
                    //
                    _result = false;
                }

                //
                if (_test !== "") {
                    //
                    if (starts_with.test(_test)) {
                        //
                        _property = RegExp.$1;
                        _value = RegExp.$2;
                        _comparison = new RegExp("^" + _value, "i");
                    }

                    //
                    else if (ends_with.test(_test)) {
                        //
                        _property = RegExp.$1;
                        _value = RegExp.$2;
                        _comparison = new RegExp(_value + "$", "i");
                    }

                    /* else if (re_ends_with.test(_test)) {
                    //
                    _property = RegExp.$1;
                    _value = RegExp.$2;
                    _comparison = new RegExp(_value + "$", "i");
                    }*/

                    //
                    else if (contains.test(_test)) {
                        //
                        _property = RegExp.$1;
                        _value = RegExp.$2;
                        _comparison = new RegExp(_value, "i");
                    }

                    //
                    else if (equals.test(_test)) {
                        //
                        _property = RegExp.$1;
                        _value = "^[\"']" + RegExp.$2 + "[\"']$";
                        _comparison = new RegExp(_value, "i");
                    }

                    //
                    else if (presence.test(_test)) {
                        //
                        _property = RegExp.$1;
                        _value = ".*";
                        _comparison = new RegExp(_value, "i");
                    }
                }

                //
                for ( i = 0; i < sheets.length; i++) {
                    var sheet = sheets[i];
                    var rules;

                    // DOM
                    if (sheet.cssRules) {
                        rules = sheet.cssRules;
                    }

                    //
                    for ( j = 0; j < rules.length; j++) {
                        // CssStyleRule
                        if (rules[j].style) {
                            // test for selector
                            if (_selector != "*") {
                                //
                                _selectorText = rules[j].selectorText;
                                items = _selectorText.split("");

                                //
                                _selectors = [];
                                _tmp = "";
                                _reseters = [" ", ">", "+"];

                                //
                                for ( i = 0; i < items.length; i++) {
                                    if (!($.inArray(items[i], _reseters))) {
                                        if (items[i] == ",") {
                                            _selectors.push(_tmp);
                                            _tmp = "";
                                            _reset = false;
                                        } else {
                                            if (_reset) {
                                                _tmp = "";
                                                _reset = false;
                                            }
                                            _tmp += items[i];
                                        }
                                    } else {
                                        _reset = true;
                                    }
                                }

                                //
                                if (_tmp !== "") {
                                    _selectors.push(_tmp);
                                }

                                //
                                if (!($.inArray(_selector, _selectors))) {
                                    break;
                                }
                            }

                            //
                            for ( k = 0; k < rules[j].style.length; k++) {
                                //
                                if (rules[j].style[k] == _property) {
                                    // DOM
                                    if (rules[j].style.getPropertyValue) {
                                        //
                                        var _test = _comparison.test(rules[j].style.getPropertyValue(rules[j].style[k]));

                                        //
                                        if (_test) {
                                            _result.push(RegExp.$1);
                                        }
                                    }
                                }
                            }
                        }
                        // CssImportRule
                        else if (rules[j].type == CSSRule.IMPORT_RULE) {
                            var _sheet = rules[j].styleSheet;
                            var _rules;

                            // DOM
                            if (_sheet.cssRules) {
                                _rules = _sheet.cssRules;
                            }

                            //
                            for ( k = 0; k < _rules[j].style.length; k++) {
                                //
                                if (_rules[j].style[k] == _property) {
                                    // DOM
                                    if (_rules[j].style.getPropertyValue) {
                                        //
                                        var _test = _comparison.test(_rules[j].style.getPropertyValue(_rules[j].style[k]));

                                        //
                                        if (_test) {
                                            _result.push(RegExp.$1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //
                if (inversion) {
                    //
                    if (_result.length) {
                        return [];
                    } else {
                        return [true];
                    }
                }

                //
                else {
                    return _result;
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("apply_xpath_test", err);

            //
            _result = false;
        }

        //
        return _result;
    }

    /**
     *
     * @author Fabrice Bonny
     * @version 1.0
     * @param {doc}
     *            document to parse
     * @param {test}
     *            unit test
     * @param {language}
     *            language for the test
     * @return {XPathResult} parsing result
     * @todo stock headers and not redo un HEAD each time
     */
    function apply_regexp_test(doc, test, language) {
        //
        var _result = [], reg = new RegExp().compile(test, "i"), scripts = doc.scripts;

        //
        try {
            //
            if (language == "html") {
                //
                if (reg.test(sidecar.plainText)) {
                    _result = [RegExp.$1];
                }
            }

            //
            else if (language == "http") {
                var _headers = "";
                var resources = sidecar.resources.filter(
                    function(item){return item["content_type"] == "text/html" || item["content_type"] == "application/xhtml+xml";}
                );

                //
                for (var i in resources[0]["headers"]) {
                    _headers += i + ": " + resources[0]["headers"][i] + "\n";
                }

                //
                logger.log("HTTP", _headers);

                //
                if (reg.test(_headers)) {
                    _result = [RegExp.$1];
                }
            }

            //
            else if (language == "css") {
                _analyseStylesheets(doc, "screen", []).then(function(parse) {
                    parse.forEach(function(element, index, array) {
                        if (reg.test(element.text)) {
                            _result.push(element.href);
                        }
                    });
                });
            }

            //
            else if (language == "js") {
                //
                $("script").each(function() {
                    //
                    var _src = $(this).attr("src");
                    var _data = $(this).text();

                    // external
                    if (_src && _src.length) {
                        //
                        if (!$.data(doc.body, _src)) {
                            //
                            $.ajax(_src, {
                                async: false,
                                success: function(data, textStatus, XMLHttpRequest) {
                                    //
                                    $.data(doc.body, _src, data);
                                },
                                dataType: "text"
                            });
                        }

                        //
                        if (reg.test($.data(doc.body, _src))) {
                            _result.push(_getDetails(this));
                        }
                    }

                    // internal
                    else if (_data.length) {
                        //
                        if (reg.test(_data)) {
                            _result.push(_getDetails(this));
                        }
                    }
                });
            }

            //
            else if (language == "robots") {
                //
                _location = doc.URL.substring(0, doc.URL.indexOf("/", doc.URL.indexOf("proxy") + 15));

                //
                $.ajax({
                    async: false,
                    url: _location + '/robots.txt',
                    type: "GET",
                    success: function(data, textStatus, XMLHttpRequest) {
                        //
                        if (reg.test(data)) {
                            _result = [RegExp.$1];
                        }
                    },
                    dataType: "text"
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("apply_regexp_test", err);
            _result = false;
        }

        //
        return _result;
    }

    /**
     *
     * @author Fabrice Bonny
     * @version 1.0
     * @param {doc}
     *            document to parse
     * @param {test}
     *            unit test
     * @param {language}
     *            language for the test
     * @return {XPathResult} parsing result
     */
    function apply_doctype_test(doc, test, language) {
        //
        var _result = [], dt = "", reg1 = new RegExp().compile('<!DOCTYPE[^>]*>', "i"), reg2 = new RegExp().compile('^\\s*<!DOCTYPE[^>]*>', "i");
        //@formatter:off
        var doctypes = [
            '<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN" "">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN" "">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd">',
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">',
            '<!DOCTYPE html PUBLIC>'
        ];
        //@formatter:on

        //
        try {
            if (language == "html") {
                //
                if (test == "present") {
                    // detected
                    if (doc.doctype) {
                        _dt = doc.doctype;
                        dt = '<!DOCTYPE ' + _dt.name.toLowerCase() + ' PUBLIC';

                        //
                        if (_dt.publicId != '') {
                            dt += ' "' + _dt.publicId + '"';
                        }
                        if (_dt.systemId != '') {
                            dt += ' "' + _dt.systemId + '"';
                        }
                        dt += '>';

                        //
                        _result.push(dt);
                    }

                    //
                    else {
                        if (reg1.test(sidecar.plainText)) {
                            _result.push(RegExp.$1);
                        }
                    }
                }

                //
                else if (test == "placed") {
                    // detected
                    if (doc.doctype) {
                        _dt = doc.doctype;
                        dt = '<!DOCTYPE ' + _dt.name.toLowerCase() + ' PUBLIC';

                        //
                        if (_dt.publicId != '') {
                            dt += ' "' + _dt.publicId + '"';
                        }
                        if (_dt.systemId != '') {
                            dt += ' "' + _dt.systemId + '"';
                        }
                        dt += '>';

                        //
                        _result.push(dt);
                    }

                    //
                    else {
                        if (reg2.test(sidecar.plainText)) {
                            _result.push(RegExp.$1);
                        }
                    }
                }

                //
                else if (test == "valid") {
                    // detected
                    if (doc.doctype) {
                        _dt = doc.doctype;
                        dt = '<!DOCTYPE ' + _dt.name.toLowerCase() + ' PUBLIC';

                        //
                        if (_dt.publicId != '') {
                            dt += ' "' + _dt.publicId + '"';
                        }
                        if (_dt.systemId != '') {
                            dt += ' "' + _dt.systemId + '"';
                        }
                        dt += '>';

                        // valid
                        if ($.inArray(dt, doctypes) != -1) {
                            //
                            _result.push(dt);
                        }
                    }

                    //
                    else {
                        for (var i in doctypes) {
                            //
                            var reg = new RegExp().compile(doctypes[i], "i");

                            //
                            if (reg.test(sidecar.plainText)) {
                                _result.push(RegExp.$1);
                            }
                        }
                    }
                }

                //
                return _result;
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("apply_doctype_test", err);
            _result = false;
        }

        //
        return _result;
    }

    /**
     *
     * @author Fabrice Bonny
     * @version 1.0
     * @param {doc}
     *            document to parse
     * @param {test}
     *            unit test
     * @param {language}
     *            language for the test
     * @return {RegexpResult} parsing result
     */
    function apply_dom_test(doc, test, language) {
        //
        var _result = [];

        //
        try {
            //
            if (language == "css") {
                // Regexps
                var reg = new RegExp().compile("^(.+?)\\[(.+)\\]$", "i");
                reg.test(test);

                //
                var _property = RegExp.$1;
                var _value = RegExp.$2;
                var sheets = doc.styleSheets;

                //
                for ( i = 0; i < sheets.length; i++) {
                    //
                    var sheet = sheets[i];
                    var rules = sheet.cssRules;

                    //
                    for ( j = 0; j < rules.length; j++) {
                        // CssStyleRule
                        if (rules[j].style) {
                            //
                            for ( k = 0; k < rules[j].style.length; k++) {
                                //
                                if (rules[j].style[k] == _property) {
                                    // DOM
                                    if (rules[j].style.getPropertyValue) {
                                        //
                                        var _test = new RegExp(_value, "i").test(rules[j].style.getPropertyValue(rules[j].style[k]));

                                        //
                                        if (_test) {
                                            _result.push(rules[j].style.getPropertyValue(rules[j].style[k]));
                                        }
                                    }
                                }
                            }
                        }
                        // CssImportRule
                        else if (rules[j].type == CSSRule.IMPORT_RULE) {
                            var _sheet = rules[j].styleSheet;
                            var _rules = _sheet.cssRules;

                            //
                            for ( k = 0; k < _rules[j].style.length; k++) {
                                //
                                if (_rules[j].style[k] == _property) {
                                    //
                                    var _test = new RegExp(_value, "i").test(_rules[j].style.getPropertyValue(_rules[j].style[k]));

                                    //
                                    if (_test) {
                                        _result.push(_rules[j].style.getPropertyValue(_rules[j].style[k]));
                                    }
                                }
                            }
                        }
                    }
                }

                //
                $("*[style]").each(function() {
                    //
                    if (new RegExp(_value, "i").test($(this).css(_property))) {
                        _result.push(_getDetails(this));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("apply_dom_test", err);
            _result = false;
        }

        //
        return _result;
    }

    /**
     * Apply a batch a rules for a give criterion
     *
     * @author Mickaël Hoareau
     * @version 1.0
     * @param {DocumentElement}
     *            doc The page document to test (the content of the iframe)
     * @param {string}
     *            test An XPath expression (Unit test)
     * @param {
     *            <object>} test_actions The rules to apply
     */
    function apply_test(doc, test, test_actions) {
        var result = [],
            reg = new RegExp("^([a-z]+)@([a-z]+):(.+)$", "i");

        reg.test(test);
        var _scheme = RegExp.$1, _language = RegExp.$2, _test = RegExp.$3;

        logger.log('apply_test', JSON.stringify([_scheme, _language, _test]));

        try {
            // Logging
            logger.log("apply_test", "test: " + _test + ",\n test_actions: " + JSON.stringify(test_actions));

            // cached
            if ($(doc).data(test)) {
                result = $(doc).data(test);

                // not cached
            } else {
                // Apply the unit test
                if (_scheme == "xpath") {
                    result = apply_xpath_test(doc, _test, _language);
                }
                else if (_scheme == "regexp") {
                    result = apply_regexp_test(doc, _test, _language);
                }
                else if (_scheme == "doctype") {
                    result = apply_doctype_test(doc, _test, _language);
                }
                else if (_scheme == "dom") {
                    result = apply_dom_test(doc, _test, _language);
                }
                else if (_scheme == "oqs") {
                    try {
                        result = window[_test](doc);
                    } catch(err) {
                        result = false;
                    }
                }
                else if (_scheme == "defer") {
                    result = "DEFERED";
                }

                // caching
                $(doc).data(test, result);
            }
        } catch (err) {
            // Error Logging
            logger.error("apply_test", err);
            return Q.reject(err);
        }

        logger.log('apply_test', result);
        return Q.resolve(result).then(function(result) {
            var _g_results = [];
            var _g_comments = [];
            var _g_details = [];

            // If the result is false, then, there has been an error
            if (result === false) {
                logger.error('apply_test', 'Test failed (' + test + ')');

                _g_results.push('i');
                _g_comments.push('Le test a échoué');

                return {
                    results: _g_results,
                    comments: _g_comments,
                    details: _g_details
                };
            }

            // If the result is "DEFERED", then, the test is defered
            else if (result === "DEFERED") {
                logger.log('apply_test', 'Le test est reporté');

                _g_results.push('i');
                _g_comments.push('Le test est reporté');

                return {
                    results: _g_results,
                    comments: _g_comments,
                    details: _g_details
                };
            }

            // If the test return something, then, the test is positive
            if (result.length > 0) {
                // subtests
                if (test_actions.ontrue.chain) {
                    for (var subtest_id in test_actions.ontrue.chain) {
                        var subtest_actions = test_actions.ontrue.chain[subtest_id];
                        var subtest = tests[subtest_id];
                        var _results = apply_test(doc, subtest, subtest_actions);

                        _g_results = $.extend(_g_results, _results.results);
                        _g_comments = $.extend(_g_comments, _results.comments);
                        _g_details = $.extend(_g_details, _results.details);
                    }

                    // no subtests
                } else {
                    _g_results.push(test_actions.ontrue.result);
                    _g_comments.push(test_actions.ontrue.comment);

                    if (test_actions.ontrue.result == "nc" || test_actions.ontrue.result == "i") {
                        _g_details = $.extend(_g_details, result);
                    }
                }
            }

            // Else, the test didn't find anything, so the test is negative
            else {
                // subtests
                if (test_actions.onfalse.chain) {
                    for (var subtest_id in test_actions.onfalse.chain) {
                        var subtest_actions = test_actions.onfalse.chain[subtest_id];
                        var subtest = tests[subtest_id];
                        var _results = apply_test(doc, subtest, subtest_actions);

                        _g_results = $.extend(_g_results, _results.results);
                        _g_comments = $.extend(_g_comments, _results.comments);
                        _g_details = $.extend(_g_details, _results.details);
                    }

                    // no subtests
                } else {
                    _g_results.push(test_actions.onfalse.result);
                    _g_comments.push(test_actions.onfalse.comment);

                    if (test_actions.onfalse.result == "nc" || test_actions.ontrue.result == "i") {
                        _g_details = $.extend(_g_details, result);
                    }
                }
            }

            return {
                results: _g_results,
                comments: _g_comments,
                details: _g_details
            };
        }).then(null, function(err) {
            // Error Logging
            logger.error("apply_test", err);
        });
    }

    /**
     *
     */
    $.fn.ns_filter = function(namespaceURI, localName) {
        //
        return $(this).filter(function() {
            //
            var domnode = $(this).get(0);

            //
            return (domnode.namespaceURI == namespaceURI && domnode.localName == localName);
        });
    };

})(jQuery, this);
