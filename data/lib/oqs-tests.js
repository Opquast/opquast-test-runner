/*global CSSParser*/
var langs = ['aa', 'aa-dj', 'aa-er', 'aa-er-saaho', 'aa-et', 'af', 'af-na', 'af-za', 'ak', 'ak-gh', 'am', 'am-et', 'ar', 'ar-ae', 'ar-bh', 'ar-dz', 'ar-eg', 'ar-iq', 'ar-jo', 'ar-kw', 'ar-lb', 'ar-ly', 'ar-ma', 'ar-om', 'ar-qa', 'ar-sa', 'ar-sd', 'ar-sy', 'ar-tn', 'ar-ye', 'as', 'as-in', 'az', 'az-az', 'az-cyrl', 'az-cyrl-az', 'az-latn', 'az-latn-az', 'be', 'be-by', 'bg', 'bg-bg', 'bn', 'bn-bd', 'bn-in', 'bs', 'bs-ba', 'byn', 'byn-er', 'ca', 'ca-es', 'cch', 'cch-ng', 'cop', 'cs', 'cs-cz', 'cy', 'cy-gb', 'da', 'da-dk', 'de', 'de-at', 'de-be', 'de-ch', 'de-de', 'de-li', 'de-lu', 'dv', 'dv-mv', 'dz', 'dz-bt', 'ee', 'ee-gh', 'ee-tg', 'el', 'el-cy', 'el-gr', 'el-polyton', 'en', 'en-as', 'en-au', 'en-be', 'en-bw', 'en-bz', 'en-ca', 'en-dsrt', 'en-dsrt-us', 'en-gb', 'en-gu', 'en-hk', 'en-ie', 'en-in', 'en-jm', 'en-mh', 'en-mp', 'en-mt', 'en-na', 'en-nz', 'en-ph', 'en-pk', 'en-sg', 'en-shaw', 'en-tt', 'en-um', 'en-us', 'en-us-posix', 'en-vi', 'en-za', 'en-zw', 'eo', 'es', 'es-ar', 'es-bo', 'es-cl', 'es-co', 'es-cr', 'es-do', 'es-ec', 'es-es', 'es-gt', 'es-hn', 'es-mx', 'es-ni', 'es-pa', 'es-pe', 'es-pr', 'es-py', 'es-sv', 'es-us', 'es-uy', 'es-ve', 'et', 'et-ee', 'eu', 'eu-es', 'fa', 'fa-af', 'fa-ir', 'fi', 'fi-fi', 'fil', 'fil-ph', 'fo', 'fo-fo', 'fr', 'fr-be', 'fr-ca', 'fr-ch', 'fr-fr', 'fr-lu', 'fr-mc', 'fr-sn', 'fur', 'fur-it', 'ga', 'ga-ie', 'gaa', 'gaa-gh', 'gez', 'gez-er', 'gez-et', 'gl', 'gl-es', 'gu', 'gu-in', 'gv', 'gv-gb', 'ha', 'ha-arab', 'ha-arab-ng', 'ha-arab-sd', 'ha-gh', 'ha-latn', 'ha-latn-gh', 'ha-latn-ne', 'ha-latn-ng', 'ha-ne', 'ha-ng', 'ha-sd', 'haw', 'haw-us', 'he', 'he-il', 'hi', 'hi-in', 'hr', 'hr-hr', 'hu', 'hu-hu', 'hy', 'hy-am', 'hy-am-revised', 'ia', 'id', 'id-id', 'ig', 'ig-ng', 'ii', 'ii-cn', 'in', 'is', 'is-is', 'it', 'it-ch', 'it-it', 'iu', 'iw', 'ja', 'ja-jp', 'ka', 'ka-ge', 'kaj', 'kaj-ng', 'kam', 'kam-ke', 'kcg', 'kcg-ng', 'kfo', 'kfo-ci', 'kk', 'kk-cyrl', 'kk-cyrl-kz', 'kk-kz', 'kl', 'kl-gl', 'km', 'km-kh', 'kn', 'kn-in', 'ko', 'ko-kr', 'kok', 'kok-in', 'kpe', 'kpe-gn', 'kpe-lr', 'ku', 'ku-arab', 'ku-latn', 'ku-latn-tr', 'ku-tr', 'kw', 'kw-gb', 'ky', 'ky-kg', 'ln', 'ln-cd', 'ln-cg', 'lo', 'lo-la', 'lt', 'lt-lt', 'lv', 'lv-lv', 'mk', 'mk-mk', 'ml', 'ml-in', 'mn', 'mn-cn', 'mn-cyrl', 'mn-cyrl-mn', 'mn-mn', 'mn-mong', 'mn-mong-cn', 'mo', 'mr', 'mr-in', 'ms', 'ms-bn', 'ms-my', 'mt', 'mt-mt', 'my', 'my-mm', 'nb', 'nb-no', 'ne', 'ne-in', 'ne-np', 'nl', 'nl-be', 'nl-nl', 'nn', 'nn-no', 'no', 'nr', 'nr-za', 'nso', 'nso-za', 'ny', 'ny-mw', 'om', 'om-et', 'om-ke', 'or', 'or-in', 'pa', 'pa-arab', 'pa-arab-pk', 'pa-guru', 'pa-guru-in', 'pa-in', 'pa-pk', 'pl', 'pl-pl', 'ps', 'ps-af', 'pt', 'pt-br', 'pt-pt', 'ro', 'ro-md', 'ro-ro', 'ru', 'ru-ru', 'ru-ua', 'rw', 'rw-rw', 'sa', 'sa-in', 'se', 'se-fi', 'se-no', 'sh', 'sh-ba', 'sh-cs', 'sh-yu', 'si', 'si-lk', 'sid', 'sid-et', 'sk', 'sk-sk', 'sl', 'sl-si', 'so', 'so-dj', 'so-et', 'so-ke', 'so-so', 'sq', 'sq-al', 'sr', 'sr-ba', 'sr-cs', 'sr-cyrl', 'sr-cyrl-ba', 'sr-cyrl-cs', 'sr-cyrl-me', 'sr-cyrl-rs', 'sr-cyrl-yu', 'sr-latn', 'sr-latn-ba', 'sr-latn-cs', 'sr-latn-me', 'sr-latn-rs', 'sr-latn-yu', 'sr-me', 'sr-rs', 'sr-yu', 'ss', 'ss-sz', 'ss-za', 'st', 'st-ls', 'st-za', 'sv', 'sv-fi', 'sv-se', 'sw', 'sw-ke', 'sw-tz', 'syr', 'syr-sy', 'ta', 'ta-in', 'te', 'te-in', 'tg', 'tg-cyrl', 'tg-cyrl-tj', 'tg-tj', 'th', 'th-th', 'ti', 'ti-er', 'ti-et', 'tig', 'tig-er', 'tl', 'tn', 'tn-za', 'to', 'to-to', 'tr', 'tr-tr', 'trv', 'ts', 'ts-za', 'tt', 'tt-ru', 'ug', 'ug-arab', 'ug-arab-cn', 'ug-cn', 'uk', 'uk-ua', 'ur', 'ur-in', 'ur-pk', 'uz', 'uz-af', 'uz-arab', 'uz-arab-af', 'uz-cyrl', 'uz-cyrl-uz', 'uz-latn', 'uz-latn-uz', 'uz-uz', 've', 've-za', 'vi', 'vi-vn', 'wal', 'wal-et', 'wo', 'wo-latn', 'wo-latn-sn', 'wo-sn', 'xh', 'xh-za', 'yo', 'yo-ng', 'zh', 'zh-cn', 'zh-hans', 'zh-hans-cn', 'zh-hans-hk', 'zh-hans-mo', 'zh-hans-sg', 'zh-hant', 'zh-hant-hk', 'zh-hant-mo', 'zh-hant-tw', 'zh-hk', 'zh-mo', 'zh-sg', 'zh-tw', 'zu', 'zu-za'],
    mimeHTML = ["text/html", "application/xhtml+xml"],
    mimeSyndication = ["application/rss+xml", "application/atom+xml", "application/xml", "text/xml"],
    mimeMultimedia = ["application/x-shockwave-flash", "application/octet-stream", "application/x-silverlight-app", "application/xaml+xml", "application/x-ms-xbap", "application/vnd.rn-realmedia", "application/ogg", "image/svg+xml"],
    jsTypes = ["text/javascript", "application/javascript", "application/x-javascript"],
    genericFontStyle = ["serif", "sans-serif", "cursive", "fantasy", "monospace", "inherit"],
    atomNs = "http://www.w3.org/2005/Atom",
    fonctionExclusions = ["if", "else", "while", "for", "switch", "case", "try", "catch"];

var regFunction = new RegExp().compile("([^\\s:{}&|]*)\\(", "i"),
    badLinks = ['cliquez ici', 'lire la suite', 'en savoir plus', "plus d'infos"],
    cdns = new RegExp().compile("^https?://[^/]+\\.(googleapis|aspnetcdn|yahooapis|amazonaws)\\.com/", "i"),
    analytics = new RegExp().compile("^https?://[^/]+\\.(google-analytics|xiti|cybermonitor|estat)\\.com/", "i"),
    jsFrameworks = new RegExp().compile("/(dojo|ext-core|jquery|jquery-ui|mootools(-(c|m)ore)?|piwik|prototype|modernizr|xtcore||xtclicks|yui)(\\.min)?\\.js(\\?[-\\.v0-9]+)?$", "i"),
    regAbsoluteFontSize = new RegExp().compile("[0-9.]+(p(t|c|x)|(c|m)m|in)", "i");

(function($, window, undefined) {
    "use strict";

    var content = $("body").text().trim(), aContent = $.unique(content.toLowerCase().split(" "));

    /**
     *
     * @param doc
     * @return
     */
    function _htmlFieldWithoutTitleAndLabel(type, implicit) {
        //
        var result = [], fields = {}, i = 0, j = 0;

        //
        try {
            //
            $("form").each(function() {
                //
                fields[i] = {}, fields[i][j] = {};

                //
                if ($("fieldset", $(this)).size() == 0) {
                    //
                    $("input:not([type='hidden']), select, textarea", $(this)).each(function() {
                        //
                        var id = $.trim($(this).attr("id"));
                        var title = $.trim($(this).attr("title")).toLowerCase();
                        var label = _getAllText($("label[for='" + id + "']").get(0));

                        //
                        if (implicit && label == "") {
                            label = _getAllText($(this).parents("label").get(0));
                        }

                        //
                        if (fields[i][j][title] == undefined) {
                            fields[i][j][title] = {};
                        }

                        //
                        if (fields[i][j][title][label] == undefined) {
                            fields[i][j][title][label] = [];
                        }

                        //
                        fields[i][j][title][label].push(_getDetails(this));
                    });
                    //
                    i++;
                }

                //
                else {
                    $("fieldset").each(function() {
                        //
                        $("input:not([type='hidden']), select, textarea", $(this)).each(function() {
                            //
                            var id = $.trim($(this).attr("id"));
                            var title = $.trim($(this).attr("title")).toLowerCase();
                            var label = _getAllText($("label[for='" + id + "']").get(0));

                            //
                            if (implicit && label == "") {
                                label = _getAllText($(this).parents("label").get(0));
                            }

                            //
                            if (fields[i][title] == undefined) {
                                fields[i][title] = {};
                            }

                            //
                            if (fields[i][title][label] == undefined) {
                                fields[i][title][label] = [];
                            }

                            //
                            fields[i][title][label].push(_getDetails(this));
                        });
                        //
                        i++;
                    });
                    //
                    j++;
                }
            });
            //
            for (var idx_form in fields) {
                //
                for (var idx_fieldset in fields[idx_form]) {
                    //
                    for (var idx1 in fields[idx_form][idx_fieldset]) {
                        //
                        for (var idx2 in fields[idx_form][idx_fieldset][idx1]) {
                            //
                            if (fields[idx_form][idx_fieldset][idx1][idx2].length > 1) {
                                //
                                for (var idx3 in fields[idx_form][idx_fieldset][idx1][idx2]) {
                                    //
                                    var _tmp = fields[idx_form][idx_fieldset][idx1][idx2][idx3];

                                    //
                                    if (_tmp["attributes"]) {
                                        //
                                        if (type != "select" && type != "textarea") {
                                            //
                                            var _type = "text";

                                            //
                                            for each (var attribute in _tmp["attributes"]) {
                                                if (attribute["name"] == "type") {
                                                    _type = attribute["value"];
                                                }
                                            }

                                            //
                                            if (_type == type) {
                                                result.push(_tmp);
                                            }
                                        }

                                        //
                                        else if ((type == "select" || type == "textarea") && _tmp["tag"] == type) {
                                            result.push(_tmp);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("_htmlFieldWithoutTitleAndLabel", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    function _htmlHeaderWithTermsInMetaKeywords(level) {
        //
        var result = [];

        //
        try {
            //
            var keywords = [];
            try {
                keywords = $("meta[name='keywords']").attr("content").trim().toLowerCase().split(" ");
            } catch (e) {}

            //
            if (keywords.length == 0) {
                return result;
            }

            //
            $("h" + level).each(function() {
                //
                var found = false;
                var terms = $(this).text().trim().split(" ");
                try {
                    terms = $.merge(terms, $.trim($("img", this).attr("alt")).toLowerCase().split(" "));
                } catch(e) {}

                //
                terms.some(function(value) {
                    //
                    if ($.inArray(value, keywords) != -1) {
                        found = true;
                        return true;
                    } else {
                        return false;
                    }
                });
                //
                if (!found) {
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlHeaderWithTermsInMetaKeywords", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    function _htmlHeaderWithTermsNotInContent(level) {
        //
        var result = [];

        //
        try {
            //
            var content = $("body :not(h1, h2, h3, h4, h5, h6)").text().trim().toLowerCase().split(" ");

            //
            $("h" + level).each(function() {
                //
                var found = false;
                var terms = $(this).text().trim().split(" ");
                try {
                    terms = $.merge(terms, $.trim($("img", this).attr("alt")).toLowerCase().split(" "));
                } catch(e) {}

                //
                terms.some(function(value) {
                    //
                    if ($.inArray(value, content) != -1) {
                        found = true;
                        return true;
                    } else {
                        return false;
                    }
                });
                //
                if (!found) {
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlHeaderWithTermsNotInContent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    function _htmlSameLabelsTitles(type) {
        //
        var result = [], labels = [], titles = [], nodes = [];

        //
        try {
            //
            $("form").each(function() {
                //
                if ($("fieldset", $(this)).size() == 0) {
                    //
                    $("input, select, textarea", $(this)).each(function() {
                        //
                        var id = $.trim($(this).attr("id"));
                        var oLabel = $("label[for=" + id + "]");
                        var label = oLabel ? $.trim(oLabel.text()).toLowerCase() : "";
                        var title = $.trim($(this).attr("title")).toLowerCase();

                        // label hidden
                        if (oLabel && (oLabel.css("display") == "none" || oLabel.css("visibility") == "hidden")) {
                            label = "";
                        }

                        // no label and no title or both
                        if ((label == "" && title == "") || (label != "" && title != "")) {
                            //
                            nodes.push(this);
                        }

                        //
                        else {
                            // duplicate label
                            if ($.inArray(label, labels) != -1) {
                                //
                                nodes.push(this);
                            } else if (label != "") {
                                //
                                labels.push(label);
                            }

                            // duplicate title
                            if ($.inArray(title, titles) != -1) {
                                //
                                nodes.push(this);
                            } else if (title != "") {
                                //
                                titles.push(title);
                            }
                        }
                    });
                }

                //
                else {
                    $("fieldset").each(function() {
                        //
                        labels = [];

                        //
                        $("input, select, textarea", $(this)).each(function() {
                            //
                            var id = $.trim($(this).attr("id"));
                            var oLabel = $("label[for=" + id + "]");
                            var label = oLabel ? $.trim(oLabel.text()).toLowerCase() : "";
                            var title = $.trim($(this).attr("title")).toLowerCase();

                            // label hidden
                            if (oLabel && (oLabel.css("display") == "none" || oLabel.css("visibility") == "hidden")) {
                                label = "";
                            }

                            // no label and no title or both
                            if ((label == "" && title == "") || (label != "" && title != "")) {
                                //
                                nodes.push(this);
                            }

                            //
                            else {
                                // duplicate label
                                if ($.inArray(label, labels) != -1) {
                                    //
                                    nodes.push(this);
                                } else if (label != "") {
                                    //
                                    labels.push(label);
                                }

                                // duplicate title
                                if ($.inArray(title, titles) != -1) {
                                    //
                                    nodes.push(this);
                                } else if (title != "") {
                                    //
                                    titles.push(title);
                                }
                            }
                        });
                    });
                }
            });

            //
            nodes = $.unique(nodes);

            //
            for (var node in nodes) {
                // text is default type
                var _tmp = _getDetails(nodes[node]), _type = "text";

                //
                if (_tmp["tag"] == "input") {
                    //
                    for (var key in Object.keys(_tmp["attributes"])) {
                        //
                        if (_tmp["attributes"][key].name == "type") {
                            //
                            _type = _tmp["attributes"][key].value;
                        }
                    }

                    //
                    if (_type == type) {
                        //
                        result.push(_tmp);
                    }
                }

                //
                else {
                    //
                    if (_tmp["tag"] == type) {
                        //
                        result.push(_tmp);
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("_sameLabelsTitles", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssAbsoluteFontSize = function cssAbsoluteFontSize(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "font-size" && regAbsoluteFontSize.test(rule.declarations[i]["valueText"])) {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssAbsoluteFontSize", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssAbsoluteFontSizeInForm = function cssAbsoluteFontSizeInForm(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "font-size" && regAbsoluteFontSize.test(rule.declarations[i]["valueText"])) {
                        $(rule.mSelectorText).each(function() {
                            if ($.inArray(this.tagName.toUpperCase(), ["BUTTON", "INPUT", "SELECT", "TEXTAREA"]) != -1) {
                                result.push(_getCssDetails(rule, i));

                                return false;
                            }
                        });
                    }
                }
            }

            return result;
        }

        var promises = [
            _analyseStylesheets(doc, "screen", callback),
            _analyseStylesheets(doc, "tv", callback),
            _analyseStylesheets(doc, "handheld", callback),
            _analyseStylesheets(doc, "projection", callback)
        ];

        return Q.promised(Array).apply(null, promises).then(function(result) {
            return $.uniq($.deepMerge([], result));
        }).then(null, function(err) {
            logger.error("cssAbsoluteFontSizeInForm", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssAbsoluteFontSizeOnScreen = function cssAbsoluteFontSizeOnScreen(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "font-size" && regAbsoluteFontSize.test(rule.declarations[i]["valueText"])) {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        var promises = [
            _analyseStylesheets(doc, "screen", callback),
            _analyseStylesheets(doc, "tv", callback),
            _analyseStylesheets(doc, "handheld", callback),
            _analyseStylesheets(doc, "projection", callback)
        ];

        return Q.promised(Array).apply(null, promises).then(function(result) {
            return $.uniq($.deepMerge([], result));
        }).then(null, function(err) {
            logger.error("cssAbsoluteFontSizeOnScreen", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssBackgroundColorWoColor = function cssBackgroundColorWoColor(doc) {
        //
        var result = [];

        //
        try {
            //
            $("body").find(":not(input[type='hidden'])").andSelf().filter(function() {
                //
                var _backgroundColor = $(this).css("background-color"),
                    _color = $(this).css("color");

                //
                if (_color == "rgb(0, 0, 0)") {
                    //
                    $(this).parents().each(function(index, Element) {
                        //
                        var _parentColor = $(this).css("color");

                        if (_parentColor != "rgb(0, 0, 0)") {
                            _color = _parentColor;
                            return false;
                        }
                    });
                }

                //
                if (_backgroundColor != "transparent" && _color == "rgb(0, 0, 0)" && $(this).clone().children().remove().end().text().trim() != '') {
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssBackgroundColorWoColor", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssBackgroundImage = function cssBackgroundImage(doc) {
        var reg = new RegExp().compile('^url\\(', "i");

        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "background-image" && reg.test(rule.declarations[i]["valueText"])) {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssBackgroundImage", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssBackgroundImageInSprite = function cssBackgroundImageInSprite(doc) {
        var reg = new RegExp().compile('^url\\(', "i");

        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "background-position" && rule.declarations[i]["valueText"] != "0 0") {
                        var node = $(rule.mSelectorText);

                        if(reg.test(node.css("background-image")) && node.css("background-repeat") == "no-repeat") {
                            result.push(_getCssDetails(rule, i));
                        }

                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssBackgroundImageInSprite", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssBackgroundImageWoBackgroundColor = function cssBackgroundImageWoBackgroundColor(doc) {
        //
        var result = [];

        //
        try {
            //
            $("body").find(":not(input[type='hidden'])").andSelf().filter(function() {
                //
                var _backgroundColor = $(this).css("background-color");
                var _backgroundImage = $(this).css("background-image");

                //
                if (_backgroundColor == "transparent") {
                    //
                    $(this).parents().each(function(index, Element) {
                        //
                        var _parentBackgroundColor = $(this).css("background-color");

                        if (_parentBackgroundColor != "transparent") {
                            _backgroundColor = _parentBackgroundColor;
                            return false;
                        }
                    });
                }

                //
                if (_backgroundColor == "transparent" && _backgroundImage != "none") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssBackgroundImageWoBackgroundColor", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssColorWoBackgroundColor = function cssColorWoBackgroundColor(doc) {
        //
        var result = [];

        //
        try {
            //
            $("body").find(":not(input[type='hidden'])").andSelf().filter(function() {
                //
                var _backgroundColor = $(this).css("background-color");
                var _color = $(this).css("color");

                //
                if (_backgroundColor == "transparent") {
                    //
                    $(this).parents().each(function(index, Element) {
                        //
                        var _parentBackgroundColor = $(this).css("background-color");

                        if (_parentBackgroundColor != "transparent") {
                            _backgroundColor = _parentBackgroundColor;
                            return false;
                        }
                    });
                }

                //
                if (_backgroundColor == "transparent" && _color != "rgb(0, 0, 0)" && $(this).clone().children().remove().end().text().trim() != '') {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssColorWoBackgroundColor", err);
            result = false;
        }

        //
        return result;
    }

    /**
     * @param doc
     * @return
     */
    window.cssContent = function cssContent(doc) {
        //
        var result = [], exclusions = ["", '', " ", ' ', '" "', "' '", '"."', "'.'", "none"];

        //
        try {
            //
            $("body").find("*").andSelf().each(function() {
                var _before = getComputedStyle(this, ':before').getPropertyCSSValue('content').cssText;
                var _after = getComputedStyle(this, ':after').getPropertyCSSValue('content').cssText;

                if ($.inArray(_before, exclusions) == -1 || $.inArray(_after, exclusions) == -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssContent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssDirection = function cssDirection(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "direction") {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssDirection", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssDisplayNone = function cssDisplayNone(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "display" && rule.declarations[i]["valueText"] == "none") {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssDisplayNone", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssGenericFont = function cssGenericFont(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "font-family") {
                        var font = rule.declarations[i]["valueText"].split(",").slice(-1)[0].replace(/['"]/g, "").trim();

                        if ($.inArray(font, genericFontStyle) == -1) {
                            result.push(_getCssDetails(rule, i));
                        }
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssGenericFont", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssHoverLinks = function cssHoverLinks(doc) {
        var reg = new RegExp().compile("(^| )(a((#|\\.)[^ ]+)?|(#|\\.)[^ ]+):hover$", "i"),
            reg2 = new RegExp().compile("^([-a-z]+-)?(height|width)$", "i"),
            reg3 = new RegExp().compile("^(bottom|display|float|left|letter-spacing|position|right|text-align|text-indent|top)$", "i"),
            reg4 = new RegExp().compile("^(font|border|margin|outline|padding)(-[-a-z]+)?$", "i");

        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    var selectors = rule.mSelectorText.split(",").map(function(element){
                        return $.trim(element);
                    });

                    for each (var selector in selectors) {
                        if (reg.test(selector)) {
                            var selectorOut = selector.replace(/:hover$/, ""), property = rule.declarations[i]["property"];

                            if ($(selectorOut).get(0) && $(selectorOut).get(0).tagName.toUpperCase() == "A" &&
                                (reg2.test(property) || reg3.test(property) || reg4.test(property)))
                            {
                                result.push(_getCssDetails(rule, i));
                            }
                        }
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssHoverLinks", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssImageSize = function cssImageSize(doc) {
        //
        var result = [], images = {};

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.image_info) {
                    //
                    images[element.uri] = {
                        "width": element.image_info["width"] + "px",
                        "height": element.image_info["height"] + "px"
                    };
                }
            });
            //
            $("img").each(function() {
                //
                var src = this.src;

                //
                if ($.inArray(src, Object.keys(images)) != -1) {
                    //
                    if (images[src]["width"] != $(this).css("width") || images[src]["height"] != $(this).css("height")) {
                        //
                        result.push(_getDetails(this));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssImageSize", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssInternalStyles = function cssInternalStyles(doc) {
        //
        var result = [];

        //
        try {
            //
            var sheets = doc.styleSheets;

            // sheets walk
            for (var i = 0; i < sheets.length; i++) {
                //
                var sheet = sheets.item(i);

                //
                if (sheet.ownerNode.tagName.toUpperCase() == "STYLE") {
                    //
                    var rules = sheet.cssRules;

                    // rules walk
                    for (var k = 0; k < rules.length; k++) {
                        //
                        var rule = rules[k];

                        //
                        if ($.inArray(rule.type, [CSSRule.MEDIA_RULE, CSSRule.IMPORT_RULE]) == -1) {
                            //
                            result.push(_getDetails(sheet.ownerNode));
                        }
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssInternalStyles", err);
            result = false;
        }

        //
        return result;
    }

    /**
     * @param doc
     * @return
     */
    window.cssMediaHandheld = function cssMediaHandheld(doc) {
        //
        var result = [];

        //
        try {
            //
            var sheets = doc.styleSheets;

            // sheets walk
            for (var i = 0; i < sheets.length; i++) {
                //
                var sheet = sheets.item(i);

                // no media
                if (sheet.media.length == 0 || (sheet.media.item && sheet.media.item(0) == "all")) {
                    //
                    var rules = sheet.cssRules;

                    // rules walk
                    for (var k = 0; k < rules.length; k++) {
                        //
                        var rule = rules[k];

                        //
                        if ($.inArray(rule.type, [CSSRule.MEDIA_RULE, CSSRule.IMPORT_RULE]) != -1) {
                            // media walk
                            for (var l = 0; l < rule.media.length; l++) {
                                //
                                var _media = rule.media.item && rule.media.item(l) || rule.media[l];
                                if ($.startsWith(_media, "handheld") || $.startsWith(_media, "only handheld")) {
                                    //
                                    result.push(rule.parentStyleSheet.href);
                                }
                            }
                        }
                    }
                }

                //
                else {
                    // media walk
                    for (var j = 0; j < sheet.media.length; j++) {
                        //
                        var _media = sheet.media.item && sheet.media.item(j) || sheet.media[j];
                        if ($.startsWith(_media, "handheld") || $.startsWith(_media, "only handheld")) {
                            //
                            result.push(sheet.href);
                        }
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssMediaHandheld", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssMediaPrint = function cssMediaPrint(doc) {
        //
        var result = [];

        //
        try {
            //
            var sheets = doc.styleSheets;

            // sheets walk
            for (var i = 0; i < sheets.length; i++) {
                //
                var sheet = sheets.item(i);

                // no media
                if (sheet.media.length == 0 || (sheet.media.item && sheet.media.item(0) == "all")) {
                    //
                    var rules = sheet.cssRules;

                    // rules walk
                    for (var k = 0; k < rules.length; k++) {
                        //
                        var rule = rules[k];

                        //
                        if ($.inArray(rule.type, [CSSRule.MEDIA_RULE, CSSRule.IMPORT_RULE]) != -1) {
                            // media walk
                            for (var l = 0; l < rule.media.length; l++) {
                                //
                                var _media = rule.media.item && rule.media.item(l) || rule.media[l];
                                if ($.startsWith(_media, "print") || $.startsWith(_media, "only print")) {
                                    //
                                    result.push(rule.parentStyleSheet.href);
                                }
                            }
                        }
                    }
                }

                //
                else {
                    // media walk
                    for (var j = 0; j < sheet.media.length; j++) {
                        //
                        var _media = sheet.media.item && sheet.media.item(j) || sheet.media[j];
                        if ($.startsWith(_media, "print") || $.startsWith(_media, "only print")) {
                            //
                            result.push(sheet.href);
                        }
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssMediaPrint", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssNumberOfFonts = function cssNumberOfFonts(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "font-family" && $.inArray(rule.declarations[i]["valueText"], genericFontStyle) == -1) {
                        result = result.concat(rule.declarations[i]["valueText"].split(","));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(function(result) {
            result = result.map(function(val) {
                return $.trim(val).toLowerCase().replace(/"/g, "").replace(/'/g, "");
            }).filter(function(val) {
                return $.inArray(val, genericFontStyle) == -1;
            });
            result = $.uniq(result);
            return result.length < 4 ? [] : result;
        }).then(null, function(err) {
            // Error Logging
            logger.error("cssNumberOfFonts", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssPixelFontSize = function cssPixelFontSize(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "font-size" && regAbsoluteFontSize.test(rule.declarations[i]["valueText"])) {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssPixelFontSize", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssTableFixedLayout = function cssTableFixedLayout(doc) {
        //
        var result = [];

        //
        try {
            //
            $("table").each(function(){
                //
                var tableLayout = $(this).css("table-layout");

                //
                if (tableLayout != "fixed") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssTableFixedLayout", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssTextAlignJustify = function cssTextAlignJustify(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "text-align" && rule.declarations[i]["valueText"] == "justify") {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssTextAlignJustify", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssTextIndentNegative = function cssTextIndentNegative(doc) {
        //
        var result = [];

        //
        try {
            //
            $("body").find("*").andSelf().each(function() {
                //
                var _backgroundImage = $(this).css("background-image");
                var _textIndent = $(this).css("text-indent");

                //
                if (_backgroundImage != "none" && parseFloat(_textIndent) < 0) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssTextIndentNegative", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssUnderline = function cssUnderline(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":not(a)").filter(function() {
                if ($(this).text().trim() != "" && $(this).css("text-decoration") == "underline" && $(this).parents("a").size() == 0) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssUnderline", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssUniversalSelector = function cssUniversalSelector(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if ($.endsWith(rule.mSelectorText, "\\*")) {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssUniversalSelector", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssUppercase = function cssUppercase(doc) {
        //
        var result = [],
            exclusions = ["ABBR", "ACRONYM", "ADDRESS", "BLOCKQUOTE", "CITE", "CODE", "KBD", "PRE", "Q", "RP", "RT", "RUBY", "SAMP", "SUB", "SUP", "TIME", "VAR", "IFRAME", "SCRIPT"],
            reg = new RegExp().compile("^[^a-z]*[A-Z][^a-z]*[A-Z][^a-z]*[A-Z][^a-z]*$", "g");

        //
        try {
            //
            var treeWalker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, {
                acceptNode: function(_node) {
                    //
                    var node = $(_node);

                    //
                    if ($.inArray(_node.tagName.toUpperCase(), exclusions) == -1 && reg.test(node.text()) && node.css("text-decoration") != "uppercase") {
                        return NodeFilter.FILTER_ACCEPT;
                    }

                    return NodeFilter.FILTER_REJECT;
                }
            }, false);

            //
            while (treeWalker.nextNode()) {
                //
                result.push(_getDetails(treeWalker.currentNode));
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("cssUppercase", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.cssVisibilityHidden = function cssVisibilityHidden(doc) {
        function callback(rule) {
            var result = [];

            if (rule && rule.parentStyleSheet && rule.declarations) {
                for (var i = 0; i < rule.declarations.length; i++) {
                    if (rule.declarations[i]["property"] == "visibility" && rule.declarations[i]["valueText"] == "hidden") {
                        result.push(_getCssDetails(rule, i));
                    }
                }
            }

            return result;
        }

        return _analyseStylesheets(doc, "screen", callback).then(null, function(err) {
            // Error Logging
            logger.error("cssVisibilityHidden", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.html404 = function html404(doc) {
        var regApache = new RegExp().compile("<h1>\\s*Not Found\\s*</h1>\\s*<p>\\s*The requested URL /\\w+ was not found on this server.\\s*</p>\\s*<hr>\\s*<address>\\s*Apache/.* \\(.*\\) Server at .* Port \\d+\\s*</address>", "i"),
            regIIS = new RegExp().compile("<h1>\\s*The page cannot be found\\s*</h1>[\\s|\\S]*<h2>\\s*HTTP Error 404 - File or directory not found.\\s*<br>\\s*Internet Information Services \\(IIS\\)\\s*</h2>\\s*<hr>\\s*<p>\\s*Technical Information \\(for support personnel\\)\\s*</p>", "i"),
            regNginx = new RegExp().compile("<center>\\s*<h1>\\s*404 Not Found\\s*</h1>\\s*</center>\\s*<hr>\\s*<center>\\s*nginx\\s*</center>", "i");

        return XHR.get("/azertyuiopqsdfghjklmwxcvbn")
        .then(function(response) {
            var result = [];

            if (response.data) {
                if (regApache.test(response.data)) {
                    result.push("Apache");
                } else if (regIIS.test(response.data)) {
                    result.push("IIS");
                } else if (regNginx.test(response.data)) {
                    result.push("Nginx");
                }
            }

            return result;
        })
        .then(null, function(err) {
            logger.error("html404", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAccessibilityLink = function htmlAccessibilityLink(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a").each(function() {
                //
                var text = $(this).text().trim().toLowerCase();
                var alt = $("img[alt]", this) && $.trim($("img[alt]", this).attr("alt")).toLowerCase();

                //
                if (text == "accessibilité" || alt == "accessibilité") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlAccessibilityLink", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAppletWithAlternativeNotInContent = function htmlAppletWithAlternativeNotInContent(doc) {
        //
        var result = [];

        //
        try {
            //
            $("applet[alt!='']").each(function() {
                //
                var terms = $.trim($(this).attr("alt")).toLowerCase().split(" ");
                var found = false;

                //
                terms.some(function(value) {
                    //
                    if ($.inArray(value, aContent) != -1) {
                        found = true;
                        return true;
                    } else {
                        return false;
                    }
                });
                //
                if (!found) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlAppletWithAlternativeNotInContent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAreaNotUnique = function htmlAreaNotUnique(doc) {
        //
        var result = [], links = {};

        //
        try {
            //
            $("area[alt]").each(function() {
                //
                var context = $.trim($(this).attr("alt")).toLowerCase() + "%|%" + $.trim($(this).attr("title")).toLowerCase(), href = $.trim($(this).attr("href"));

                //
                if ($.inArray(context, Object.keys(links)) != -1) {
                    //
                    if (links[context] != href) {
                        //
                        result.push(_getDetails(this));
                    }
                }

                //
                else {
                    links[context] = href;
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlAreaNotUnique", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAreaWithAlternativeNotInContent = function htmlAreaWithAlternativeNotInContent(doc) {
        //
        var result = [];

        //
        try {
            //
            $("area[alt!='']").each(function() {
                //
                var terms = $.trim($(this).attr("alt")).toLowerCase().split(" ");
                var found = false;

                //
                terms.some(function(value) {
                    //
                    if ($.inArray(value, aContent) != -1) {
                        found = true;
                        return true;
                    } else {
                        return false;
                    }
                });
                //
                if (!found) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlAreaWithAlternativeNotInContent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAreaWithInvalidAlt = function htmlAreaWithInvalidAlt(doc) {
        //
        var result = [];

        //
        try {
            //
            $("area[alt]").each(function() {
                if ($.inArray($.trim($(this).attr("alt")), badLinks) != -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlAreaWithInvalidAlt", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAreaWoAlt = function htmlAreaWoAlt(doc) {
        //
        var result = [], area = {};

        //
        try {
            //
            $("area").each(function() {
                //
                var href = $.trim($(this).attr("href"));
                var alt = $.trim($(this).attr("alt")).toLowerCase();

                //
                if ($.inArray(alt, Object.keys(area)) != -1 && area[alt] != href) {
                    //
                    result.push(_getDetails(this));
                } else {
                    area[alt] = href;
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlAreaWoAlt", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlAWithShortTitle = function htmlAWithShortTitle(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a[title]").each(function() {
                //
                var _text = $(this).text().trim();

                //
                $("img[alt]", this).each(function() {
                    _text += " " + $.trim($(this).attr("alt"));
                });

                //
                if ($.trim($(this).attr("title")).length < $.trim(_text).length) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlDirAttribute", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlDefaultTitle = function htmlDefaultTitle(doc) {
        //
        var result = [],
            reg = new RegExp().compile("^(untitled( document)?|welcome to adobe golive( \d+)?|default( title| document| page)?|document sans nom|page (sans titre|par défaut))$", "i");

        //
        try {
            //
            if ($("title")) {
                //
                var title = $("title").text().trim();

                //
                if (reg.test(title)) {
                    //
                    result.push(RegExp.$1);
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlDefaultTitle", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlDirAttribute = function htmlDirAttribute(doc) {
        //
        var result = [], exclusions = ["APPLET", "BASE", "BASEFONT", "BR", "FRAME", "FRAMESET", "IFRAME", "PARAM", "SCRIPT"], values = ["", "ltr", "rtl"];

        //
        try {
            //
            $("*[dir]").each(function() {
                //
                if ($.inArray(this.tagName.toUpperCase(), exclusions) == -1 && $.inArray($(this).attr("dir").toLowerCase(), values) == -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlDirAttribute", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlElementLanguage = function htmlElementLanguage(doc) {
        //
        var result = [];

        //
        try {
            //
            $("*[lang], *[xml\\:lang]").each(function() {
                //
                var _lang = $.trim($(this).attr("lang")).split("-")[0].toLowerCase(), _xml_lang = $.trim($(this).attr("xml:lang")).split("-")[0].toLowerCase();

                //
                if (($(this).attr("lang") != undefined && $.inArray(_lang, langs) == -1) || ($(this).attr("xml:lang") != undefined && $.inArray(_xml_lang, langs) == -1)) {
                    //
                    result.push(_getDetails($(this).get(0)));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlElementLanguage", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlFakeList = function htmlFakeList(doc) {
        //
        var result = [],
            reg1 = new RegExp().compile("^(\\s*(-|\\*|\\+|#|>|&gt;|•|&bullet;).+\\s*(<br ?\?>)+){2,}$", "im"),
            reg2 = new RegExp().compile("^(\\s*(-|\\*|\\+|#|>|&gt;|•|&bullet;).+\\s*){2,}$", "im");

        //
        try {
            //
            $("p, div").each(function() {
                if (reg1.test($(this).html())) {
                    //
                    result.push(_getDetails(this));
                }
            });

            //
            $("pre").each(function() {
                if (reg2.test($(this).html())) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlFakeList", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlFakeOrderedList = function htmlFakeOrderedList(doc) {
        //
        var result = [],
            reg1 = new RegExp().compile("^(\\s*(\\d|i|v|x)+\\s*(-|\\)|\\]).+\\s*(<br ?\?>)+){2,}$", "im"),
            reg2 = new RegExp().compile("^(\\s*(\\d|i|v|x)+\\s*(-|\\)|\\]).+\\s*){2,}$", "im");

        //
        try {
            //
            $("p, div").each(function() {
                if (reg1.test($(this).html())) {
                    //
                    result.push(_getDetails(this));
                }
            });

            //
            $("pre").each(function() {
                if (reg2.test($(this).html())) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlFakeOrderedList", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlFavicon = function htmlFavicon(doc) {
        var result = [], promises = [];

        try {
            sidecar.pageInfo.links.forEach(function(link) {
                if ($.inArray((link.rel || "").toLowerCase(), ["icon", "shortcut icon"]) === -1) {
                    return;
                }
                promises.push(
                    XHR.partial(link.uri).then(function(response) {
                        return _getDetails(
                            $(link.tag + "[href='" + link.href + "'][rel='" + link.rel + "']").get(0)
                        );
                    }).then(null, function(err) {
                        logger.error("htmlFavicon", err);
                        return false;
                    })
                );
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch(err) {
            logger.error("htmlFavicon", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlFormW3Fields = function htmlFormW3Fields(doc) {
        //
        var result = [];

        //
        try {
            //
            $("form").each(function() {
                //
                if ($("input:not([type]), input[type='text'], input[type='checkbox'], input[type='radio'], input[type='file'], input[type='password'], select, textarea", $(this)).size() > 2) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlFormW3Fields", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.frameWithSameTitles = function htmlFrameWithSameTitles(doc) {
        //
        var result = [];

        //
        try {
            //
            $("frame").each(function() {
                //
                var title = $.trim($(this).attr("title")).toLowerCase(), src = this.src.split("#")[0];

                //
                $("frame").each(function() {
                    //
                    var _title = $.trim($(this).attr("title")).toLowerCase(), _src = this.src.split("#")[0];

                    //
                    if ((_title == '' || _title == title) && _src != src) {
                        //
                        result.push(_getDetails(this));
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("frameWithSameTitles", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH1 = function htmlH1(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":header").each(function() {
                //
                if (this.tagName.toUpperCase() == "H1") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlH1", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH1WithTermsInMetaKeywords = function htmlH1WithTermsInMetaKeywords(doc) {
        //
        return _htmlHeaderWithTermsInMetaKeywords("1");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH1WithTermsNotInContent = function htmlH1WithTermsNotInContent(doc) {
        //
        return _htmlHeaderWithTermsNotInContent("1");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH2 = function htmlH2(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":header").each(function() {
                //
                if (this.tagName.toUpperCase() == "H2") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlH2", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH2WithTermsInMetaKeywords = function htmlH2WithTermsInMetaKeywords(doc) {
        //
        return _htmlHeaderWithTermsInMetaKeywords("2");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH2WithTermsNotInContent = function htmlH2WithTermsNotInContent(doc) {
        //
        return _htmlHeaderWithTermsNotInContent("2");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH3 = function htmlH3(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":header").each(function() {
                //
                if (this.tagName.toUpperCase() == "H3") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlH3", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH3WithTermsInMetaKeywords = function htmlH3WithTermsInMetaKeywords(doc) {
        //
        return _htmlHeaderWithTermsInMetaKeywords("3");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH3WithTermsNotInContent = function htmlH3WithTermsNotInContent(doc) {
        //
        return _htmlHeaderWithTermsNotInContent("3");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH4 = function htmlH4(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":header").each(function() {
                //
                if (this.tagName.toUpperCase() == "H4") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlH4", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH4WithTermsInMetaKeywords = function htmlH4WithTermsInMetaKeywords(doc) {
        //
        return _htmlHeaderWithTermsInMetaKeywords("4");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH4WithTermsNotInContent = function htmlH4WithTermsNotInContent(doc) {
        //
        return _htmlHeaderWithTermsNotInContent("4");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH5 = function htmlH5(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":header").each(function() {
                //
                if (this.tagName.toUpperCase() == "H5") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlH5", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH5WithTermsInMetaKeywords = function htmlH5WithTermsInMetaKeywords(doc) {
        //
        return _htmlHeaderWithTermsInMetaKeywords("5");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH5WithTermsNotInContent = function htmlH5WithTermsNotInContent(doc) {
        //
        return _htmlHeaderWithTermsNotInContent("5");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH6 = function htmlH6(doc) {
        //
        var result = [];

        //
        try {
            //
            $(":header").each(function() {
                //
                if (this.tagName.toUpperCase() == "H6") {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlH6", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH6WithTermsInMetaKeywords = function htmlH6WithTermsInMetaKeywords(doc) {
        //
        return _htmlHeaderWithTermsInMetaKeywords("6");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlH6WithTermsNotInContent = function htmlH6WithTermsNotInContent(doc) {
        //
        return _htmlHeaderWithTermsNotInContent("6");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.iframeWithSameTitles = function htmlIframeWithSameTitles(doc) {
        //
        var result = [], iframes = {};

        //
        try {
            //
            $("iframe[title]").each(function() {
                //
                var title = $.trim($(this).attr("title")).toLowerCase(), src = this.src.split("#")[0];

                //
                if (title == '' || ($.inArray(title, Object.keys(iframes)) != -1 && iframes[title] != src)) {
                    //
                    result.push(_getDetails(this));
                } else {
                    //
                    iframes[title] = src;
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("iframeWithSameTitles", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlImageAnimatedNotInButtonOrA = function htmlImageAnimatedNotInButtonOrA(doc) {
        //
        var result = [], animated = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.image_info) {
                    //
                    if (element.image_info.animated) {
                        //
                        animated.push(element.uri);
                    }
                }
            });

            //
            $("img").each(function() {
                //
                if ($.inArray(this.src, animated) != -1) {
                    //
                    if ($(this).parents("a:not([href^='#'])").size() == 0 && $(this).parents("button:not([href^='#'])").size() == 0) {
                        //
                        result.push(_getDetails(this));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlImageAnimatedNotInButtonOrA", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlImageNotIndexable = function htmlImageNotIndexable(doc) {
        //
        var result = [], formats = ["image/png", "image/gif", "image/jpeg", "image/jpg", "image/svg+xml"], images = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.image_info) {
                    //
                    var content_type = element.content_type == undefined && "undefined" || element.content_type;

                    //
                    if (content_type && $.inArray(content_type, formats) == -1) {
                        //
                        images.push(element.uri);
                    }
                }
            });
            //
            $("img").each(function() {
                //
                var src = this.src;

                //
                if ($.inArray(src, images) != -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlImageNotIndexable", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlImageSize = function htmlImageSize(doc) {
        //
        var result = [], images = {}, keys;

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.image_info) {
                    //
                    images[element.uri] = {
                        "width": element.image_info["width"],
                        "height": element.image_info["height"]
                    };
                }
            });

            //
            keys = Object.keys(images);

            //
            $("img[width][height]").each(function() {
                //
                var src = this.src;

                //
                if ($.inArray(src, keys) != -1 && (images[src]["width"] != $.trim($(this).attr("width")) || images[src]["height"] != $.trim($(this).attr("height")))) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlImageSize", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlImageWithAlternativeNotInContent = function htmlImageWithAlternativeNotInContent(doc) {
        //
        var result = [];

        //
        try {
            //
            $("img[alt!='']").each(function() {
                //
                var terms = $.trim($(this).attr("alt")).toLowerCase().split(" ");
                var found = false;

                //
                terms.some(function(value) {
                    //
                    if ($.inArray(value, aContent) != -1) {
                        found = true;
                        return true;
                    } else {
                        return false;
                    }
                });
                //
                if (!found) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlImageWithAlternativeNotInContent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.checkboxSameLabelsTitles = function htmlInputCheckboxSameLabelsTitles(doc) {
        //
        return _htmlSameLabelsTitles("checkbox");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlInputCheckboxWithoutTitleAndLabel = function htmlInputCheckboxWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("checkbox", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.fileSameLabelsTitles = function htmlInputFileSameLabelsTitles(doc) {
        //
        return _htmlSameLabelsTitles("file");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlInputFileWithoutTitleAndLabel = function htmlInputFileWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("file", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.passwordSameLabelsTitles = function htmlInputPasswordSameLabelsTitles(doc) {
        return _htmlSameLabelsTitles("password");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlInputPasswordWithoutTitleAndLabel = function htmlInputPasswordWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("password", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.radioSameLabelsTitles = function htmlInputRadioSameLabelsTitles(doc) {
        return _htmlSameLabelsTitles("radio");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlInputRadioWithoutTitleAndLabel = function htmlInputRadioWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("radio", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.textSameLabelsTitles = function htmlInputTextSameLabelsTitles(doc) {
        return _htmlSameLabelsTitles("text");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlInputTextWithoutTitleAndLabel = function htmlInputTextWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("text", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLabelForNotInFieldIds = function htmlLabelForNotInFieldIds(doc) {
        //
        var result = [];

        //
        try {
            //
            $("form").each(function() {
                //
                var fields = [];

                //
                $("input[id], select[id], textarea[id]", this).each(function() {
                    //
                    fields.push($.trim($(this).attr("id")));
                });
                //
                $("label[for]", this).each(function() {
                    //
                    if ($.inArray($.trim($(this).attr("for")), fields) == -1) {
                        //
                        result.push(_getDetails(this));
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLabelForNotInFieldIds", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLanguage = function htmlLanguage(doc) {
        //
        var result = [];

        //
        try {
            //
            var _lang = $.trim($("html").attr("lang")), _xml_lang = $.trim($("html").attr("xml:lang"));

            //
            if (_lang != '' || _xml_lang != '') {
                //
                result.push(_getDetails($("html").get(0)));
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLanguage", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksImageNotUnique = function htmlLinksImageNotUnique(doc) {
        //
        var result = [], links = {};

        //
        try {
            //
            $("a").has("img").filter(function() {
                return $.trim($(this).text()) == "";
            }).each(function() {
                //
                var context = $.trim($("img", this).attr("alt")).toLowerCase() + "%|%" + $.trim($(this).attr("title")).toLowerCase(), href = $.trim($(this).attr("href"));

                //
                if ($.inArray(context, Object.keys(links)) != -1) {
                    //
                    if (links[context] != href) {
                        //
                        result.push(_getDetails(this));
                    }
                }

                //
                else {
                    links[context] = href;
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksImageNotUnique", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksImageWithInvalidAlt = function htmlLinksImageWithInvalidAlt(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a").has("img[alt]").filter(function() {
                return $.trim($(this).text()) == "";
            }).each(function() {
                if ($.inArray($.trim($("img", this).attr("alt")), badLinks) != -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksImageWithInvalidAlt", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksImageWithInvalidTitle = function htmlLinksImageWithInvalidTitle(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a[title]").has("img").filter(function() {
                return $.trim($(this).text()) == "";
            }).each(function() {
                //
                var title = $.trim($(this).attr("title")).toLowerCase();

                //
                if (title == '' || $.inArray(title, badLinks) != -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksImageWithInvalidTitle", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksNotUnique = function htmlLinksNotUnique(doc) {
        //
        var result = [], links = {};

        //
        try {
            //
            $("a").has("img").filter(function() {
                return $.trim($(this).text()) != "";
            }).each(function() {
                //
                var context = $.trim($(this).text()).toLowerCase() + "%|%" + $.trim($("img", this).attr("alt")).toLowerCase() + "%|%" + $.trim($(this).attr("title")).toLowerCase();
                var href = $.trim($(this).attr("href"));

                //
                if ($.inArray(context, Object.keys(links)) != -1) {
                    //
                    if (links[context] != href) {
                        //
                        result.push(_getDetails(this));
                    }
                }

                //
                else {
                    links[context] = href;
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksNotUnique", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksTextInvalid = function htmlLinksTextInvalid(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a:not(:has(img))").each(function() {
                //
                var text = $.trim($(this).text()).toLowerCase(), title = $.trim($(this).attr("title")).toLowerCase();

                //
                if (text != '' && $.inArray(text, badLinks) != -1 && (title == '' || $.inArray(title, badLinks) != -1)) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksTextInvalid", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksTextNotUnique = function htmlLinksTextNotUnique(doc) {
        //
        var result = [], links = {};

        //
        try {
            //
            $("a:not(:has(img))").each(function() {
                //
                var text = $.trim($(this).text()).toLowerCase(),
                    title = $.trim($(this).attr("title")).toLowerCase(),
                    context = text + "%|%" + title,
                    href = $.URL($.trim($(this).attr("href")).toString()),
                    _this = this;

                //
                if ($.inArray(context, Object.keys(links)) == -1) {
                    //
                    links[context] = [];
                }

                //
                if (text != '') {
                    links[context].push({
                        "href": href,
                        "node": _this
                    });
                }
            });

            //
            for each (var context in Object.keys(links)) {
                //
                if (links[context].length > 1) {
                    //
                    var href = "", _tmp = [], diff = false;

                    //
                    for each (var obj in links[context]) {
                        //
                        _tmp.push(obj["node"]);

                        //
                        if (href != "" && href != obj["href"]) {
                            diff = true;
                        }

                        //
                        href = obj["href"];
                    }

                    //
                    if (diff) {
                        //
                        for each (var node in _tmp) {
                            //
                            result.push(_getDetails(node));
                        }
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksTextNotUnique", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksTextWithInvalidTitle = function htmlLinksTextWithInvalidTitle(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a[title]:not(:has(img))").each(function() {
                //
                var text = $.trim($(this).text()).toLowerCase(), title = $.trim($(this).attr("title")).toLowerCase();

                //
                if (text != '' && (title == '' || title == text || $.inArray(title, badLinks) != -1)) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksTextWithInvalidTitle", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlLinksWithInvalidText = function htmlLinksWithInvalidText(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a").has("img").filter(function() {
                return $.trim($(this).text()) != "";
            }).each(function() {
                if (($.inArray($.trim($(this).text()), badLinks) != -1 && ($.trim($("img", this).attr("alt")) == '' || $.trim($("img", this).attr("alt")), badLinks) != -1) || $.inArray($.trim($(this).text() + " " + $.trim($("img", this).attr("alt"))), badLinks) != -1 || $.inArray($.trim($("img", this).attr("alt")) + " " + $.trim($(this).text()), badLinks) != -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlLinksWithInvalidText", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.metaCharset = function htmlMetaCharset(doc) {
        //
        var result = [],
            charset = "",
            reg = new RegExp().compile("^.+charset=(.+)$", "i");

        //
        try {
            // html 4
            if ($("meta[http-equiv='content-type']")) {
                //
                var meta = $.trim($("meta[http-equiv='content-type']").attr("content"));

                //
                if (reg.test(meta)) {
                    //
                    charset = RegExp.$1;
                }
            }

            // html 5
            if (charset == '' && $("meta[charset]")) {
                //
                charset = $.trim($("meta[charset]").attr("charset"));
            }

            //
            if (charset && charset.toLowerCase() == doc.characterSet.toLowerCase()) {
                //
                result.push(charset);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("metaCharset", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @todo js -> xpath
     * @return
     */
    window.metaRefreshShort = function htmlMetaRefreshShort(doc) {
        //
        var result = [],value = 0;

        //
        try {
            //
            $("meta[http-equiv='refresh']").each(function() {
                //
                value = parseInt($(this).attr("content"), 10);

                //
                if (value < 72000 || isNaN(value)) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("metaRefreshShort", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.metaRefreshUrl = function htmlMetaRefreshUrl(doc) {
        //
        var result = [],
            reg = new RegExp().compile("^\\d+\\s*;\\s*url=(.+)$", "i");

        //
        try {
            //
            if ($("meta[http-equiv='refresh']")) {
                //
                var meta = $.trim($("meta[http-equiv='refresh']").attr("content"));

                //
                if (reg.test(meta)) {
                    //
                    var url = $.URL(RegExp.$1);

                    //
                    if (url && url != doc.location.href) {
                        //
                        result.push(_getDetails($("meta[http-equiv='refresh']").get(0)));
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("metaRefresh", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.moreExtThenIntLinks = function htmlMoreExtThenIntLinks(doc) {
        //
        var result = [], int = [], ext = [];

        //
        try {
            //
            var domain = doc.location.host.split(".").slice(-2).join(".");

            //
            $("a[href]:not([href='']):not([href^='#'])").each(function() {
                //
                var uri = $.URL($.trim($(this).attr("href")));

                //
                if (uri) {
                    //
                    var host = $.URL.getDomain(uri);

                    //
                    if (host) {
                        //
                        var link = host.split(".").slice(-2).join(".");

                        //
                        if (link == domain) {
                            int.push(this);
                        } else {
                            ext.push(this);
                        }
                    }
                }
            });

            //
            if (ext.length > int.length) {
                //
                result = ext.map(_getDetails);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("moreExtThenIntLinks", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlNewWindow = function htmlNewWindow(doc) {
        //
        var result = [];

        //
        try {
            //
            $("a[target='_blank'], area[target='_blank'], form[target='_blank']").each(function() {
                //
                result.push(_getDetails(this));
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlNewWindow", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlNonHttpAreaLinks = function htmlNonHttpAreaLinks(doc) {
        //
        var result = [], protocols = ["http:", "https:", "javascript:"];

        //
        try {
            //
            $("area[href^='ftp://'], area[href^='ftps://']").each(function() {
                //
                if ($.inArray(this.protocol, protocols) == -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlNonHttpAreaLinks", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlNonHttpLinks = function htmlNonHttpLinks(doc) {
        //
        var result = [], protocols = ["http:", "https:", "javascript:"];

        //
        try {
            //
            $("a[href]").each(function() {
                //
                if ($.inArray(this.protocol, protocols) == -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlNonHttpLinks", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlScript = function htmlScript(doc) {
        //
        var result = [];

        //
        try {
            //
            $("script").each(function() {
                //
                var src = $.trim($(this).attr("src"));

                //
                if ((src != '' && !cdns.test(src) && !analytics.test(src) && !jsFrameworks.test(src)) || $.trim($(this).text()) != '') {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlScript", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.selectSameLabelsTitles = function htmlSelectSameLabelsTitles(doc) {
        return _htmlSameLabelsTitles("select");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlSelectWithoutTitleAndLabel = function htmlSelectWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("select", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlSpaceBetweenLetters = function htmlSpaceBetweenLetters(doc) {
        //
        var result = [],
            reg = new RegExp().compile("(\s+[A-Za-z]){3,}", "i");

        //
        try {
            //
            $("pre").each(function() {
                //
                if (reg.test($(this).text())) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlSpaceBetweenLetters", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlTdHeadersNotInThIds = function htmlTdHeadersNotInThIds(doc) {
        //
        var result = [];

        //
        try {
            //
            $("table").each(function() {
                //
                var th = [];

                //
                $("th[id]", this).each(function() {
                    //
                    th.push($.trim($(this).attr("id")));
                });
                //
                $("td[headers]", this).each(function() {
                    //
                    var headers = $.trim($(this).attr("headers")).split(" ");

                    //
                    for (var i in headers) {
                        //
                        if ($.inArray(headers[i], th) == -1) {
                            //
                            result.push(_getDetails(this));
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlTdHeadersNotInThIds", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.textareaSameLabelsTitles = function htmlTextareaSameLabelsTitles(doc) {
        //
        return _htmlSameLabelsTitles("textarea");
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlTextareaWithoutTitleAndLabel = function htmlTextareaWithoutTitleAndLabel(doc) {
        //
        return _htmlFieldWithoutTitleAndLabel("textarea", false);
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlUrlWithTermsNotInTitle = function htmlUrlWithTermsNotInTitle(doc) {
        //
        var result = [],
            reg1 = new RegExp().compile("[\\-\\_\\.\\+\\!\\*\\'\\(\\)\\,\\&\\/\\:\\;\\=\\?\\@\\#\\%\\[\\]]", "ig"),
            reg2 = new RegExp().compile("[^a-zA-Z0-9àáâãäåæçèéêëìíîïñòóôõöùúûüýÿ]", "ig"),
            url = doc.location.href.toLowerCase().replace(/[àáâãäå]/ig, "a").replace(/æ/ig, "ae").replace(/ç/ig, "c").replace(/[èéêë]/ig, "e").replace(/[ìíîï]/ig, "i").replace(/ñ/ig, "n").replace(/[òóôõö]/ig, "o").replace(/œ/ig, "oe").replace(/[ùúûü]/ig, "u").replace(/[ýÿ]/ig, "y"),
            terms = url.split(reg1);

        //
        try {
            //
            var title = $("title").text().trim().toLowerCase().split(reg2);

            //
            terms = terms.filter(function(element) {
                return element.length >= 3;
            });

            //
            if (terms.some(function(element) {
                return $.inArray(element, title) != -1;
            })) {
                //
                result.push(true);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlUrlWithTermsNotInTitle", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlUrlWithUnsafeChars = function htmlUrlWithUnsafeChars(doc) {
        //
        var result = [],
            reg = new RegExp().compile("[^a-z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)\\,\\&\\/\\:\\;\\=\\?\\@\\#\\%\\[\\]]", "i");

        //
        try {
            //
            $("*[href]:not([href^='mailto:'])").each(function() {
                //
                if (reg.test($(this).attr("href"))) {
                    //
                    result.push(_getDetails(this));
                }
            });
            //
            $("*[src]").each(function() {
                //
                if (reg.test($(this).attr("src"))) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlUrlWithUnsafeChars", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.urlWithVariants = function htmlUrlWithVariants(doc) {
        //
        var result = [], urls = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var url = element.uri.split("?")[0];

                if($.inArray(url, urls) == -1) {
                    //
                    for each(var _url in urls) {
                        //
                        if(_url.toLowerCase() == url.toLowerCase()) {
                            //
                            result.push(url + " - " + _url);
                        } else {
                            //
                            urls.push(url);
                        }
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("urlWithVariants", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.htmlValidLanguage = function htmlValidLanguage(doc) {
        //
        var result = [];

        //
        try {
            //
            var _lang = $.trim($("html").attr("lang")).split("-")[0].toLowerCase(), _xml_lang = $.trim($("html").attr("xml:lang")).split("-")[0].toLowerCase();

            //
            if ($.inArray(_lang, langs) != -1 || $.inArray(_xml_lang, langs) != -1) {
                //
                result.push(_getDetails($("html").get(0)));
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("htmlValidLanguage", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.http404 = function http404(doc) {
        return XHR.partial("/azertyuiopqsdfghjklmwxcvbn")
        .then(function(response) {
            if (response.status == 404) {
                return [true];
            }

            return [];
        })
        .then(null, function(err) {
            logger.error("http404", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpCache = function httpCache(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (!(element.headers["cache-control"]) && !(element.headers["etag"]) && !(element.headers["expires"]) && !(element.headers["last-modified"])) {
                    //
                    result.push(_getHttpDetails(element.uri, element.headers));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpCache", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpCharset = function httpCharset(doc) {
        //
        var result = [];

        //
        try {
            var resources = sidecar.resources.filter(function(item) {
                return $.inArray(item["content_type"], mimeHTML) != -1 && item['status'] == 200;
            });

            //
            var charset = resources[0]["charset"] == undefined && "undefined" || resources[0]["charset"].toLowerCase();

            //
            if (charset == doc.characterSet.toLowerCase()) {
                //
                result.push(charset);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpCharset", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.countryDomain = function httpCountryDomain(doc) {
        //
        var result = [],
            extensions = ["ad", "ae", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "as", "at", "au", "aw", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cc", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dk", "dj", "dm", "do", "dz", "ec", "ee", "eg", "eh", "er", "es", "et", "fi", "fj", "fk", "fm", "fo", "fr", "fx", "ga", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "in", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mx", "mw", "my", "mz", "na", "nc", "nf", "ne", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "ph", "pk", "pl", "pm", "pn", "pq", "pr", "pt", "py", "pw", "qa", "re", "ro", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "st", "sv", "sy", "sz", "tc", "td", "tf", "th", "tj", "tm", "tn", "to", "tp", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "um", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "yt", "yu", "za", "zr", "zm", "zw"];

        //
        try {
            //
            var tld = doc.location.host.split(".").slice(-1)[0];

            //
            if ($.inArray(tld, extensions) != -1) {
                //
                result.push(true);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("countryDomain", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.countryServer = function httpCountryServer(doc) {
        var geoServerURL = "http://www.geoplugin.net/xml.gp";

        return dnsLookup(doc.location.host)
        .then(function(ip) {
            return XHR.get(geoServerURL + "?ip=" + ip);
        })
        .then(function(response) {
            if (response.status !== 200) {
                return [];
            }
            var tld = doc.location.host.split(".").slice(-1)[0].toLowerCase(),
                data = $(response.data);
            if ($("geoplugin_countryCode", data).text().toLowerCase() === tld) {
                return [tld];
            }
            return [];
        })
        .then(null, function(err) {
            logger.error("countryServer", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpDomainMoreThan30Caracters = function httpDomainMoreThan30Caracters(doc) {
        //
        var result = [];

        //
        try {
            //
            if (doc.location.host.length > 30) {
                //
                result.push(true);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpDomainMoreThan30Caracters", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpGzip = function httpGzip(doc) {
        //
        var result = [],
            encoding = ["gzip", "deflate"],
            reg = new RegExp().compile("^application/([a-z]+\\+)?xml$", "i");

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                // is text
                if (content_type
                        && (content_type.split("/")[0] == "text" || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1 || reg.test(content_type))
                        && element.headers["content-length"] > 300) {
                    //
                    var tmp = _getHttpDetails(element.uri, element.headers);

                    // has content-encoding
                    if (element.headers["content-encoding"]) {
                        // gzip or deflate
                        if ($.inArray(element.headers["content-encoding"].toLowerCase(), encoding) == -1) {
                            //
                            result.push(tmp);
                        }
                    } else {
                        //
                        result.push(tmp);
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpGzip", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpGzipJson = function httpGzipJson(doc) {
        //
        var result = [], encoding = ["gzip", "deflate"];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                // is text
                if (content_type
                        && (content_type == "application/json" || $.endsWith(element.uri, ".json")) && element.headers["content-length"] > 300) {
                    //
                    var tmp = _getHttpDetails(element.uri, element.headers);

                    // has content-encoding
                    if (element.headers["content-encoding"]) {
                        // gzip or deflate
                        if ($.inArray(element.headers["content-encoding"].toLowerCase(), encoding) == -1) {
                            //
                            result.push(tmp);
                        }
                    } else {
                        //
                        result.push(tmp);
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpGzipJson", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpGzipZippedResources = function httpGzipZippedResources(doc) {
        //
        var result = [],
            encoding = ["gzip", "deflate"],
            reg = new RegExp().compile("^application/([a-z]+\\+)?xml$", "i");

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                // is not text
                if (content_type
                        && content_type.split("/")[0] != "text"
                        && $.inArray(content_type, ["application/javascript", "application/x-javascript"]) == -1 && !reg.test(content_type)) {
                    //
                    var tmp = _getHttpDetails(element.uri, element.headers);

                    // has content-encoding
                    if (element.headers["content-encoding"]) {
                        // gzip or deflate
                        if ($.inArray(element.headers["content-encoding"].toLowerCase(), encoding) != -1) {
                            //
                            result.push(tmp);
                        }
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpGzipZippedResources", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.inlinks = function httpInlinks(doc) {
        return XHR.get("https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=link:" + doc.location.host)
        .then(function(response) {
            if (response.status !== 200) {
                return [];
            }
            var data = JSON.parse(response.data);
            if (data.responseData.cursor.estimatedResultCount >= 3) {
                return [data.responseData.cursor.estimatedResultCount + " liens entrants"];
            }
            return [];
        })
        .then(null, function(err) {
            logger.error("httpInlinks", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpJson = function httpJson(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                // is text
                if (content_type
                        && (content_type == "application/json" || $.endsWith(element.uri, ".json"))) {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpJson", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpLanguage = function httpLanguage(doc) {
        //
        var result = [];

        //
        try {
            var resources = sidecar.resources.filter(function(item) {
                return $.inArray(item["content_type"], mimeHTML) != -1 && item['status'] == 200;
            });

            //
            if (resources[0]["headers"]["content-language"]) {
                //
                var lang = resources[0]["headers"]["content-language"].toLowerCase();

                //
                if ($.inArray(lang, langs) != -1) {
                    //
                    result.push(_getHttpDetails(resources[0]["uri"], resources[0]["headers"]));
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpLanguage", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.pingLongdesc = function httpPingLongdesc(doc) {
        var promises = [];
        try {
            $("img[width!=1][height!=1][longdesc]").each(function() {
                var longdesc = $.trim($(this).attr("longdesc")),
                    _img = this;

                if (longdesc === "") {
                    promises.push(Q.resolve(_getDetails(_img)));
                } else {
                    promises.push(
                        XHR.partial(longdesc).then(function(response) {
                            if (response.status === 404) {
                                return _getDetails(_img);
                            }
                            return false;
                        }).then(null, function(err) {
                            logger.error("pingLongdesc", err);
                            return false;
                        })
                    );
                }
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch(err) {
            logger.error("pingLongdesc", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpRefresh = function httpRefresh(doc) {
        //
        var result = [],
            reg1 = new RegExp().compile("^(\\d+)$", "i"),
            reg2 = new RegExp().compile("^(\\d+)\\s*;\\s*url=(.+)$", "i");

        //
        try {
            var resources = sidecar.resources.filter(
                function(item){
                    return $.inArray(item["content_type"], mimeHTML) != -1 && item['status'] == 200;
                }
            );

            //
            if (resources[0]["headers"]["refresh"]) {
                //
                var refresh = resources[0]["headers"]["refresh"];

                //
                if (reg1.test(refresh)) {
                    //
                    var delay = parseInt(RegExp.$1, 10);

                    //
                    if (delay < 72000) {
                        //
                        result.push(resources[0]["headers"]);
                    }
                }

                //
                else if (reg2.test(refresh)) {
                    //
                    var delay = parseInt(RegExp.$1, 10),
                        url = $.URL(RegExp.$2);

                    //
                    if (delay < 72000 && url == doc.location.href) {
                        //
                        result.push(resources[0]["headers"]);
                    }
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpRefresh", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource403 = function httpResource403(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "403" && element.referrer == "") {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource403", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource403MoreThan3k = function httpResource403MoreThan3k(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "403" && element.referrer == "" && parseInt(element["headers"]["content-length"], 10) > 3000) {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource403MoreThan3k", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource404 = function httpResource404(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "404" && element.referrer == "") {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource404", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource404MoreThan3k = function httpResource404MoreThan3k(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "404" && element.referrer == "" && parseInt(element["headers"]["content-length"], 10) > 3000) {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource404MoreThan3k", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource403 = function httpResource403(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "403" && element.referrer == "") {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource403", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource403MoreThan3k = function httpResource403MoreThan3k(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "403" && element.referrer == "" && parseInt(element["headers"]["content-length"], 10) > 3000) {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource403MoreThan3k", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource404 = function httpResource404(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "404" && element.referrer == "") {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource404", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpResource404MoreThan3k = function httpResource404MoreThan3k(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.status == "404" && element.referrer == "" && parseInt(element["headers"]["content-length"], 10) > 3000) {
                    //
                    result.push(element.uri);
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResource404MoreThan3k", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.resAnimated = function httpResourceAnimated(doc) {
        //
        var result = [], images = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if (element.image_info) {
                    //
                    if (element.image_info["animated"]) {
                        //
                        images.push(element.uri);
                    }
                }
            });
            //
            $("img").each(function() {
                //
                var src = this.src;

                //
                if ($.inArray(src, images) != -1) {
                    //
                    result.push(_getDetails(this));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("resAnimated", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     * @todo manage attachments
     */
    window.resDownloadable = function httpResourceDownloadable(doc) {
        var dl_extensions = ["pdf", "doc", "odt", "xls", "ods", "zip"],
            dl_families = ["application"],
            dl_types = ["msword", "pdf", "zip", "octet-stream"],
            dl_reg = new RegExp().compile("^vnd\.(oasis\.opendocument\.|\.ms-|openxmlformats-officedocument\.)", "i"),
            promises = [];

        try {
            sidecar.pageInfo.links.forEach(function(link) {
                // Note (Olivier 2013-03-02)
                // This is crazy, we should not check every link on a page
                // Attempt to reduce to some extensions. Not perfect but fine enough
                var url = $.URL(link.uri);
                if ($.inArray(url.path.split(".").slice(-1)[0], dl_extensions) === -1) {
                    return;
                }

                promises.push(
                    XHR.partial(link.uri).then(function(response) {
                        if (response.status !== 200) {
                            return false;
                        }
                        var mime = response.contentType.split("/");
                        if ($.inArray(mime[0], dl_families) !== -1 &&
                            ($.inArray(mime[1], dl_types) !== -1 || dl_reg.test(mime[1]))
                        ) {
                            return link.uri;
                        }

                        return false;
                    }).then(null, function(err) {
                        logger.error("resDownloadable", err);
                        return false;
                    })
                );
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("resDownloadable", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.resPdf = function httpResourcePdf(doc) {
        var promises = [];
        try {
            sidecar.pageInfo.links.forEach(function(link) {
                // Note (Olivier 2013-03-02)
                // This is crazy, we should not check every link on a page
                // Attempt to reduce to pdf extension. Not perfect but fine enough
                var url = $.URL(link.uri);
                if (url.path.split(".").slice(-1)[0] !== "pdf") {
                    return;
                }

                promises.push(
                    XHR.partial(link.uri).then(function(response) {
                        if (response.status === 200 && response.contentType === "application/pdf") {
                            return link.uri;
                        }

                        return false;
                    }).then(null, function(err) {
                        logger.error("resPdf", err);
                        return false;
                    })
                );
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("resPdf", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.rightCharset = function httpRightCharset(doc) {
        //
        var regUnicode = new RegExp().compile("[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2}", "m"),
            result = [];

        //
        try {
            //
            var encoding = regUnicode.test($("body").text());

            //
            if (!encoding || (encoding && RegExp.$1 != '')) {
                //
                result.push(doc.characterSet);
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("rightCharset", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.resMultimedia = function httpResourceMultimedia(doc) {
        //
        var result = [], mm_families = ["audio", "video"], objects = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type, mimeMultimedia) != -1 || $.inArray(content_type.split("/")[0], mm_families) != -1)) {
                    //
                    objects.push(element.uri);
                }
            });
            //
            $("embed").each(function() {
                //
                var src = _absolutizeURL($(this).attr("src"));

                //
                if ($.inArray(src, objects) != -1) {
                    result.push(_getDetails(this));
                }
            });
            //
            $("object").each(function() {
                //
                var src = _absolutizeURL($(this).attr("data"));

                //
                if ($.inArray(src, objects) != -1) {
                    result.push(_getDetails(this));
                } else {
                    $("param[name]", this).each(function() {
                        //
                        var src = _absolutizeURL($(this).attr("value"));

                        //
                        if ($.inArray(src, objects) != -1) {
                            //
                            result.push(_getDetails(this));
                        }
                    });
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResourceMultimedia", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.resMultimediaWoAudio = function httpResourceMultimediaWoAudio(doc) {
        //
        var result = [], mm_families = ["video"], objects = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type, mimeMultimedia) != -1 || $.inArray(content_type.split("/")[0], mm_families) != -1)) {
                    //
                    objects.push(element.uri);
                }
            });
            //
            $("embed").each(function() {
                //
                var src = _absolutizeURL($(this).attr("src"));

                //
                if ($.inArray(src, objects) != -1) {
                    result.push(_getDetails(this));
                }
            });
            //
            $("object").each(function() {
                //
                var src = _absolutizeURL($(this).attr("data"));

                //
                if ($.inArray(src, objects) != -1) {
                    result.push(_getDetails(this));
                } else {
                    $("param[name]", this).each(function() {
                        //
                        var src = _absolutizeURL($(this).attr("value"));

                        //
                        if ($.inArray(src, objects) != -1) {
                            //
                            result.push(_getDetails(this));
                        }
                    });
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpResourceMultimediaWoAudio", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticOneMonthCache = function httpStaticOneMonthCache(doc) {
        //
        var result = [],
            reg = new RegExp().compile("max-age=([0-9]+)", "i");

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                // is static
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (element.headers["cache-control"] && reg.test(element.headers["cache-control"])) {
                        //
                        if(parseInt(RegExp.$1, 10) < 2592000) {
                            //
                            result.push(_getHttpDetails(element.uri, element.headers));
                        }
                    } else if (element.headers["expires"]) {
                        //
                        var expires = Date.parse(element.headers["expires"]);
                        var now = Date.parse(new Date().toString());

                        //
                        if(parseInt((expires - now) / 1000, 10) < 2592000) {
                            //
                            result.push(_getHttpDetails(element.uri, element.headers));
                        }
                    } else {
                        //
                        result.push(_getHttpDetails(element.uri, element.headers));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticOneMonthCache", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticOnMoreThan3Subdomains = function httpStaticOnMoreThan3Subdomains(doc) {
        //
        var result = [];

        //
        try {
            var domain = doc.location.host.split(".").slice(-2).join(".");
        
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    var subdomain = element.uri.split("/")[2];

                    if (subdomain != domain && $.endsWith(subdomain, domain)) {
                        //
                        result.push(subdomain);
                    }
                }
            });

            //
            var tmp = [];
            for each(var item in result) {
                if($.inArray(item, tmp) == -1) {
                    tmp.push(item);
                }
            }
            result = tmp;

            //
            if(result.length < 4) {
                result = [];
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticOnMoreThan3Subdomains", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticOnSameDomain = function httpStaticOnSameDomain(doc) {
        //
        var result = [];

        //
        try {
            var domain = doc.location.host.split(".").slice(-2).join(".");

            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    var _domain = element.uri.split("/")[2].split(".").slice(-2).join(".");

                    //
                    if (doc.location.href != element.uri && _domain == domain) {
                        //
                        result.push(element.uri);
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticOnSameDomain", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticVersionInName = function httpStaticVersionInName(doc) {
        //
        var result = [],
            reg = new RegExp().compile(".+[-\\.]v?[-\\.0-9]{3,}\\.[a-zA-Z]{2,}$", "i");

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (reg.test(element.uri)) {
                        //
                        result.push(_getHttpDetails(element.uri, element.headers));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticVersionInName", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticVersionInParams = function httpStaticVersionInParams(doc) {
        //
        var result = [],
            reg = new RegExp().compile("[^\\?]+\\?(v=?)?[\\.0-9a-z]{3,}$", "i");

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (reg.test(element.uri)) {
                        //
                        result.push(_getHttpDetails(element.uri, element.headers));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticVersionInParams", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticWithCookie = function httpStaticWithCookie(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (element.headers["set-cookie"]) {
                        //
                        result.push(_getHttpDetails(element.uri, element.headers));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticWithCookie", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticWithParams = function httpStaticWithParams(doc) {
        //
        var result = [],
            reg = new RegExp().compile("[^\\?]+\\?.+$", "i");;

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (reg.test(element.uri)) {
                        //
                        result.push(_getHttpDetails(element.uri, element.headers));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticWithParams", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.staticWithSeveralParams = function httpStaticWithSeveralParams(doc) {
        //
        var result = [],
            reg = new RegExp().compile("[^\\?]+\\?.+&.+$", "i");;

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (reg.test(element.uri)) {
                        //
                        result.push(_getHttpDetails(element.uri, element.headers));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpStaticWithSeveralParams", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpUseCdn = function httpUseCdn(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                var content_type = element.content_type == undefined && "undefined" || element.content_type;

                //
                if (content_type
                        && ($.inArray(content_type.split("/")[0], ["text", "image", "audio", "video"]) != -1
                        || $.inArray(content_type, ["application/javascript", "application/x-javascript"]) != -1)) {
                    //
                    if (cdns.test(element.uri)) {
                        //
                        result.push(element.uri);
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpUseCdn", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpWithAndWoWww = function httpWithAndWoWww(doc) {
        try {
            var aDomain = doc.location.host.split(".");

            // with www
            if (aDomain[0] == "www") {
                aDomain.shift();
            } else {
                aDomain.unshift("www");
            }

            return XHR.partial(doc.location.protocol + "//" + aDomain.join(".") + "/")
            .then(function(response) {
                if ($.inArray(response.status, [200, 301, 302, 304, 307]) !== -1) {
                    return [aDomain.join(".")];
                }
                return [];
            })
            .then(null, function(err) {
                logger.error("httpWithAndWoWww", err);
                return Q.resolve([]);
            });
        } catch (err) {
            // Error Logging
            logger.error("httpWithAndWoWww", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.httpWoRedirect = function httpWoRedirect(doc) {
        //
        var result = [], redirect = ["301", "302", "307"];

        //
        try {
            //
            sidecar.resources.forEach(function(element, index, array) {
                //
                if ($.inArray(element.status, redirect) != -1) {
                    //
                    result.push(_getHttpDetails(element.uri, element.headers));
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("httpWoRedirect", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.utf8 = function httpUtf8(doc) {
        //
        var result = [];

        //
        try {
            //
            if (doc.characterSet.toLowerCase() == "utf-8") {
                //
                result.push("utf-8");
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("utf8", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsBlurOnFocusEvent = function jsBlurOnFocusEvent(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if (element.type == "focus") {
                        //
                        result.push(_getDetails(sidecar.events[idx].node));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsBlurOnFocusEvent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsClickEvent = function jsClickEvent(doc) {
        //
        var result = [], types = ["button", "submit", "reset", "file", "image", "password", "radio", "checkbox"], tags = ["A", "AREA", "BUTTON", "INPUT"];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                var found = false, node = sidecar.events[idx].node;

                //
                if (node.tagName) {
                    //
                    var tag = node.tagName.toUpperCase();

                    //
                    if ($.inArray(tag, tags) == -1) {
                        found = true;
                    }

                    //
                    if (tag == "INPUT" && $.inArray(node.getAttribute("type"), types) == -1) {
                        found = true;
                    }

                    //
                    sidecar.events[idx].events.forEach(function(element, index, array) {
                        //
                        if (found && element.type == "click") {
                            //
                            result.push(_getDetails(node));
                        }
                    });
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsClickEvent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsDocumentWrite = function jsDocumentWrite(doc) {
        var reg = new RegExp().compile("(document\\.write\\([^\\)]*\\))", "i"),
            promises = [];

        try {
            $("script:not([src])").each(function() {
                if (reg.test($(this).text())) {
                    promises.push(Q.resolve(_getDetails(this)));
                }
            });

            sidecar.resources.forEach(function(item) {
                if ($.inArray(item.content_type || "", jsTypes) === -1) {
                    return;
                }

                if (!cdns.test(item.uri) && !analytics.test(item.uri) && !jsFrameworks.test(item.uri)) {
                    promises.push(
                        XHR.get(item.uri).then(function(response) {
                            var match = reg.exec(response.data);
                            if (match !== null) {
                                return item.uri + " (" + match[0] + ")";
                            }

                            return false;
                        }).then(null, function(err) {
                            logger.error("jsDocumentWrite", err);
                            return false;
                        })
                    );
                }
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("jsDocumentWrite", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsEvents = function jsEvents(doc) {
        //
        var result = [], nodes = [];

        //
        try {
            //
            $.merge(nodes, onclickEvents);
            $.merge(nodes, onchangeEvents);
            $.merge(nodes, onfocusEvents);
            $.merge(nodes, onblurEvents);
            $.merge(nodes, onmouseoverEvents);
            $.merge(nodes, onmouseoutEvents);

            result = nodes.map(_getDetails);
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsEvents", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsKeyboardOrMouseEvent = function jsKeyboardOrMouseEvent(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["mousedown", "mouseup", "mouseover", "mouseout", "focus", "blur", "keyup", "keydown"]) != -1) {
                        //
                        result.push(_getDetails(sidecar.events[idx].node));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsKeyboardOrMouseEvent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @todo à vérifier
     * @return
     */
    window.jsNewWindow = function jsNewWindow(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["click", "mouseover", "mouseout", "focus", "blur"]) != -1) {
                        //
                        result.push(_getDetails(sidecar.events[idx].node));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsNewWindow", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnblurSubmit = function jsOnblurSubmit(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.submit\\s?", "i");

        //
        try {
            //
            onblurEvents.each(function() {
                //
                var _onblur = $.trim($(this).attr("onblur")), functions = _onblur.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                result.push(_onblur);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnblurSubmit", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnblurWoOnmouseout = function jsOnblurWoOnmouseout(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                var events = [];

                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["blur", "mouseout"]) != -1) {
                        //
                        events.push(element.type);
                    }
                });
                if ($.inArray("blur", events) != -1 && events.length == 1) {
                    //
                    result.push(_getDetails(sidecar.events[idx].node));
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnblurWoOnmouseout", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnchangeLocation = function jsOnchangeLocation(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.location[\\.=\\s]", "i");

        //
        try {
            //
            onchangeEvents.each(function() {
                //
                var _onchange = $.trim($(this).attr("onchange")), functions = _onchange.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onchange);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnchangeLocation", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnchangeSubmit = function jsOnchangeSubmit(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.submit\\s?", "i");

        //
        try {
            //
            onchangeEvents.each(function() {
                //
                var _onchange = $.trim($(this).attr("onchange")), functions = _onchange.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onchange);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnchangeSubmit", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnclick = function jsOnclick(doc) {
        //
        var result = [], tags = ["A", "BUTTON", "SELECT", "TEXTAREA", "INPUT"];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                var found = false, node = sidecar.events[idx].node;

                //
                if (node.tagName) {
                    //
                    var tag = node.tagName.toUpperCase();

                    //
                    if ($.inArray(tag, tags) == -1) {
                        found = true;
                    }

                    //
                    sidecar.events[idx].events.forEach(function(element, index, array) {
                        //
                        if (found && element.type == "click") {
                            //
                            result.push(_getDetails(node));
                        }
                    });
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnclick", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOndoubleclick = function jsOndoubleclick(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    if (element.type == "dblclick") {
                        //
                        result.push(_getDetails(sidecar.events[idx].node));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOndoubleclick", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnfocusBlur = function jsOnfocusBlur(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.blur\\s?", "i");

        //
        try {
            //
            onfocusEvents.each(function() {
                //
                var _onfocus = $.trim($(this).attr("onfocus")), functions = _onfocus.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onfocus);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnfocusBlur", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnfocusSubmit = function jsOnfocusSubmit(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.submit\\s?", "i");

        //
        try {
            //
            onfocusEvents.each(function() {
                //
                var _onfocus = $.trim($(this).attr("onfocus")), functions = _onfocus.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onfocus);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnfocusSubmit", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnfocusWoOnmouseover = function jsOnfocusWoOnmouseover(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                var events = [];

                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["focus", "mouseover"]) != -1) {
                        //
                        events.push(element.type);
                    }
                });
                if ($.inArray("focus", events) != -1 && events.length == 1) {
                    //
                    result.push(_getDetails(sidecar.events[idx].node));
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnfocusWoOnmouseover", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnmouseoutSubmit = function jsOnmouseoutSubmit(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.submit\\s?", "i");

        //
        try {
            //
            onmouseoutEvents.each(function() {
                //
                var _onmouseout = $.trim($(this).attr("onmouseout")), functions = _onmouseout.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onmouseout);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnmouseoutSubmit", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnmouseoutWoOnblur = function jsOnmouseoutWoOnblur(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                var events = [];

                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["blur", "mouseout"]) != -1) {
                        //
                        events.push(element.type);
                    }
                });

                //
                if ($.inArray("mouseout", events) != -1 && events.length == 1) {
                    //
                    result.push(_getDetails(sidecar.events[idx].node));
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnmouseoutWoOnblur", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnmouseoverSubmit = function jsOnmouseoverSubmit(doc) {
        //
        var result = [],
            reg = new RegExp().compile("\\.submit\\s?", "i");

        //
        try {
            //
            onmouseoverEvents.each(function() {
                //
                var _onmouseover = $.trim($(this).attr("onmouseover")), functions = _onmouseover.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onmouseover);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnmouseoverSubmit", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnmouseoverWoOnfocus = function jsOnmouseoverWoOnfocus(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                var events = [];

                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["focus", "mouseover"]) != -1) {
                        //
                        events.push(element.type);
                    }
                });

                //
                if ($.inArray("mouseover", events) != -1 && events.length == 1) {
                    //
                    result.push(_getDetails(sidecar.events[idx].node));
                }
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnmouseoverWoOnfocus", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsOnscroll = function jsOnscroll(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if (element.type == "scroll") {
                        //
                        result.push(_getDetails(sidecar.events[idx].node));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsOnscroll", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsPopUp = function jsPopUp(doc) {
        //
        var result = [],
            reg = new RegExp().compile("(window|document)\\.open\\s?", "i");

        //
        try {
            //
            if ($("body").attr("onload")) {
                //
                var _onload = $("body").attr("onload"), functions = _onload.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onload);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsPopUp", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsRefresh = function jsRefresh(doc) {
        var reg1 = new RegExp().compile("(\\.location\\.reload\\()", "i"),
            reg2 = new RegExp().compile("(\\.location\\.replace\\()", "i"),
            reg3 = new RegExp().compile("(\\.location\(\\.href\)?\s*=)", "i"),
            promises = [];

        try {
            if(sidecar.resources.some(function(element) {
                return (doc.location.href === element.uri);
            }) === false) {
                return Q.resolve([]);
            }

            $("script:not([src])").each(function() {
                if (reg1.test($(this).text()) || reg2.test($(this).text()) || reg3.test($(this).text())) {
                    promises.push(Q.resolve(_getDetails(this)));
                }
            });

            sidecar.resources.forEach(function(item) {
                if ($.inArray(item.content_type || "", jsTypes) === -1) {
                    return;
                }

                if (!cdns.test(item.uri) && !analytics.test(item.uri) && !jsFrameworks.test(item.uri)) {
                    promises.push(
                        XHR.get(item.uri).then(function(response) {
                            var m1 = reg1.exec(response.data),
                                m2 = reg2.exec(response.data),
                                m3 = reg3.exec(response.data);

                            if (m1 !== null || m2 !== null || m3 !== null) {
                                var found = [m1, m2, m3].map(function(val) {
                                    return val && val[1] || null;
                                }).filter(function(val) {
                                    return val !== null;
                                }).join(", ");
                                return item.uri + " (" + found + ")";
                            }

                            return false;
                        }).then(null, function(err) {
                            logger.error("jsRefresh", err);
                            return false;
                        })
                    );
                }
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("jsRefresh", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsResize = function jsResize(doc) {
        //
        var result = [],
            reg = new RegExp().compile("window\\.resizeTo\\s?", "i");

        //
        try {
            //
            if ($("body").attr("onload")) {
                //
                var _onload = $("body").attr("onload"), functions = _onload.split(";");

                //
                functions.forEach(function(element, index, array) {
                    //
                    var aFunction = regFunction.test(element);

                    //
                    if (aFunction && aFunction.length > 0) {
                        //
                        var _function = $.trim(aFunction[1]);

                        //
                        if (_function != "") {
                            //
                            if (reg.test(_function)) {
                                //
                                result.push(_onload);
                            }

                            //
                            else if ($.inArray(_function, fonctionExclusions) == -1) {
                                try {
                                    var fn = window;

                                    for each (var i in _function.split(".")) {
                                        fn = fn[i];
                                    }

                                    if (reg.test(fn.toString())) {
                                        //
                                        result.push(_function);
                                    }
                                } catch(err) {
                                }
                            }
                        }
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsResize", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsSetInterval = function jsSetInterval(doc) {
        var reg = new RegExp().compile("setInterval\\(", "i"),
            promises = [];

        try {
            $("script:not([src])").each(function() {
                if (reg.test($(this).text())) {
                    promises.push(Q.resolve(_getDetails(this)));
                }
            });

            sidecar.resources.forEach(function(item) {
                if ($.inArray(item.content_type || "", jsTypes) === -1) {
                    return;
                }

                if (!cdns.test(item.uri) && !analytics.test(item.uri) && !jsFrameworks.test(item.uri)) {
                    promises.push(
                        XHR.get(item.uri).then(function(response) {
                            var match = reg.exec(response.data);
                            if (match !== null) {
                                return item.uri + " (" + match[0] + ")";
                            }

                            return false;
                        }).then(null, function(err) {
                            logger.error("jsSetInterval", err);
                            return false;
                        })
                    );
                }
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("jsSetInterval", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @todo terminate!
     * @return
     */
    window.jsSetTimeout = function jsSetTimeout(doc) {
        var reg = new RegExp().compile("setTimeout\\(", "i"),
            promises = [];

        try {
            $("script:not([src])").each(function() {
                if (reg.test($(this).text())) {
                    promises.push(Q.resolve(_getDetails(this)));
                }
            });

            sidecar.resources.forEach(function(item) {
                if ($.inArray(item.content_type || "", jsTypes) === -1) {
                    return;
                }

                if (!cdns.test(item.uri) && !analytics.test(item.uri) && !jsFrameworks.test(item.uri)) {
                    promises.push(
                        XHR.get(item.uri).then(function(response) {
                            var match = reg.exec(response.data);
                            if (match !== null) {
                                return item.uri + " (" + match[0] + ")";
                            }

                            return false;
                        }).then(null, function(err) {
                            logger.error("jsSetTimeout", err);
                            return false;
                        })
                    );
                }
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("jsSetTimeout", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsSpecificEvent = function jsSpecificEvent(doc) {
        //
        var result = [];

        //
        try {
            //
            for (var idx in sidecar.events) {
                //
                sidecar.events[idx].events.forEach(function(element, index, array) {
                    //
                    if ($.inArray(element.type, ["dblclick", "change", "scroll"]) != -1) {
                        //
                        result.push(_getDetails(sidecar.events[idx].node));
                    }
                });
            }
        }

        //
        catch (err) {
            // Error Logging
            logger.error("jsSpecificEvent", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.jsWindowOpen = function jsWindowOpen(doc) {
        //
        var reg = new RegExp().compile("(window|document)\\.open\\(", "i"),
            promises = [];

        try {
            $("script:not([src])").each(function() {
                if (reg.test($(this).text())) {
                    promises.push(Q.resolve(_getDetails(this)));
                }
            });

            sidecar.resources.forEach(function(item) {
                if ($.inArray(item.content_type || "", jsTypes) === -1) {
                    return;
                }

                if (!cdns.test(item.uri) && !analytics.test(item.uri) && !jsFrameworks.test(item.uri)) {
                    promises.push(
                        XHR.get(item.uri).then(function(response) {
                            var match = reg.exec(response.data);
                            if (match !== null) {
                                return item.uri + " (" + match[0] + ")";
                            }

                            return false;
                        }).then(null, function(err) {
                            logger.error("jsWindowOpen", err);
                            return false;
                        })
                    );
                }
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch (err) {
            // Error Logging
            logger.error("jsWindowOpen", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.robotsPresence = function robotsPresence(doc) {
        var reg = new RegExp().compile("^user-agent\s*:(.+)$", "im");

        return XHR.get("/robots.txt").then(function(response) {
            if (response.status !== 200) {
                return false;
            }
            var match = reg.exec(response.data);
            if (match !== null) {
                return [match[1]];
            }
            return false;
        }).then(null, function(err) {
            // Error Logging
            logger.error("robotsPresence", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.robotsSitemap = function robotsSitemap(doc) {
        var reg = new RegExp().compile("^sitemap\s*:(.+)$", "im");

        return XHR.get("/robots.txt").then(function(response) {
            if (response.status !== 200) {
                return false;
            }
            var match = reg.exec(response.data);
            if (match === null) {
                return false;
            }
            var sitemap = $.trim(match[1]);
            return XHR.partial(sitemap).then(function(resp) {
                if (resp.status === 200) {
                    return [sitemap];
                }
            });
        }).then(null, function(err) {
            // Error Logging
            logger.error("robotsSitemap", err);
            return false;
        });
    }

    /**
     *
     * @param doc
     * @return
     */
    window.syndicationAbsoluteLinks = function syndicationAbsoluteLinks(doc) {
        var promises = [];

        try {
            sidecar.pageInfo.links.forEach(function(link) {
                if (link.rel !== "alternate" || $.inArray(link.type, mimeSyndication) === -1) {
                    return;
                }

                promises.push(
                    XHR.get(link.uri).then(function(response) {
                        if (response.status !== 200 || $.inArray(response.contentType, mimeSyndication) === -1) {
                            return false;
                        }

                        var result = [], data;

                        try {
                            data = $.parseXML(response.data);
                        }catch(e) {
                            return false;
                        }

                        if (response.contentType == "application/rss+xml" || data.documentElement.tagName.toLowerCase() == "rss") {
                            $('link', data).each(function() {
                                if ($.trim($(this).text()).substr(0, 1) == ".") {
                                    result.push(_getDetails(this));
                                }
                            });
                        } else if (response.contentType == "application/atom+xml" || data.documentElement.namespaceURI == atomNs) {
                            $('link', data).each(function() {
                                if ($.trim($(this).attr("href")).substr(0, 1) == ".") {
                                    result.push(_getDetails(this));
                                }
                            });
                        }

                        return result.length > 0 ? result : false;
                    }).then(null, function(err) {
                        logger.error("syndicationAbsoluteLinks", err);
                        return false;
                    })
                );
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch(err) {
            // Error Logging
            logger.error("syndicationAbsoluteLinks", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.syndicationCache = function syndicationCache(doc) {
        var syNS = "http://purl.org/rss/1.0/modules/syndication/",
            promises = [];

        try {
            sidecar.pageInfo.links.forEach(function(link) {
                if (link.rel !== "alternate" || $.inArray(link.type, mimeSyndication) === -1) {
                    return;
                }

                promises.push(
                    XHR.get(link.uri).then(function(response) {
                        if (response.status !== 200 || $.inArray(response.contentType, mimeSyndication) === -1) {
                            return false;
                        }

                        var result = [], data;

                        try {
                            data = $.parseXML(response.data);
                        }catch(e) {
                            return false;
                        }

                        if (response.contentType == "application/rss+xml" || data.documentElement.tagName.toLowerCase() == "rss") {
                            if ($.trim($("rss", data).attr("version")) == "2.0") {
                                $("ttl", data).each(function() {
                                    result.push(_getDetails(this));
                                });
                            }
                        }

                        $.each(data.getElementsByTagNameNS(syNS, 'updatePeriod'), function() {
                            result.push(_getDetails(this));
                        });

                        $.each(data.getElementsByTagNameNS(syNS, 'updateFrequency'), function() {
                            result.push(_getDetails(this));
                        });

                        $.each(data.getElementsByTagNameNS(syNS, 'updateBase'), function() {
                            result.push(_getDetails(this));
                        });

                        return result.length > 0 ? result : false;
                    }).then(null, function(err) {
                        logger.error("syndicationCache", err);
                        return false;
                    })
                );
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch(err) {
            // Error Logging
            logger.error("syndicationCache", err);
            return false;
        }
    }

    /**
     *
     * @param doc
     * @return
     */
    window.syndicationPresence = function syndicationPresence(doc) {
        //
        var result = [];

        //
        try {
            //
            sidecar.pageInfo.links.forEach(function(element, index, array) {
                //
                if (element.rel == "alternate") {
                    //
                    if ($.inArray(element.type, ["application/rss+xml", "application/atom+xml"]) != -1) {
                        //
                        result.push(_getDetails($("link[rel='alternate'][href='" + element.href + "'][type='" + element.type + "']").get(0)));
                    }
                }
            });
        }

        //
        catch (err) {
            // Error Logging
            logger.error("syndicationPresence", err);
            result = false;
        }

        //
        return result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.syndicationSummary = function syndicationSummary(doc) {
        var promises = [];

        try {
            sidecar.pageInfo.links.forEach(function(link) {
                if (link.rel !== "alternate" || $.inArray(link.type, mimeSyndication) === -1) {
                    return;
                }

                promises.push(
                    XHR.get(link.uri).then(function(response) {
                        if (response.status !== 200 || $.inArray(response.contentType, mimeSyndication) === -1) {
                            return false;
                        }

                        var result = [], data;
                        
                        try {
                            data = $.parseXML(response.data);
                        }catch(e) {
                            return false;
                        }

                        if (response.contentType == "application/rss+xml" || data.documentElement.tagName.toLowerCase() == "rss") {
                            $("item", data).each(function() {
                                if ($("description", this).length == 0) {
                                    result.push(_getDetails(this));
                                }
                            });
                        } else if (response.contentType == "application/atom+xml" || data.documentElement.namespaceURI == atomNs) {
                            $("entry", data).each(function() {
                                if ($("summary", this).length == 0) {
                                    result.push(_getDetails(this));
                                }
                            });
                        }

                        return result.length > 0 ? result : false;
                    }).then(null, function(err) {
                        logger.error("syndicationSummary", err);
                        return false;
                    })
                );
            });

            return Q.promised(Array).apply(null, promises).then(function(res) {
                return res.some(function(v) v === false) ? false : res;
            });
        } catch(err) {
            // Error Logging
            logger.error("syndicationSummary", err);
            return false;
        }
    }

    /***************************************************************************/
    /******************************** CTIE *************************************/
    /***************************************************************************/

    /**
     *
     * @param doc
     * @return
     */
    window.noRelativeSize = function(doc) {
        //
        var _result = [];
        var sheets = doc.styleSheets;
        var styles = [];
        var reg = new RegExp().compile("^[0-9.]+(p(t|c|x)|(c|m)m|in)$", "g");

        //
        function parseRule(rule) {
            //
            if (rule.type==CSSRule.STYLE_RULE) {
                styles.push(rule.style);
            } else if(rule.type==CSSRule.IMPORT_RULE) {
                //
                var _rules = rule.styleSheet.cssRules;

                for (i = 0; i < _rules.length; i++) {
                    parseRule(_rules.item(i));
                }
            }
        }

        // sheets walk
        for (var i = 0; i < sheets.length; i++) {
            //
            var rules = sheets.item(i).cssRules;

            // rules walk
            for (var j = 0; j < rules.length; j++) {
                parseRule(rules.item(j));
            }
        }

        // styles walk
        for (var k = 0; k < styles.length; k++) {
            //
            if(styles[k].fontSize !== "") {
                //
                var _fontsize = styles[k].fontSize;

                //
                if (_fontsize.test(reg)) {
                    _result.push(RegExp.$1);
                }
            }
        }

        //
        return _result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.linksWithSameHref = function(doc) {
        //
        var _result = [],
            _done = [],
            _hrefs = {},
            _text = "",
            _reg= new RegExp().compile("\\s{2,}", "g");

        //
        $("a[href]", doc).each( function() {
            //
            var $clone = $(this).clone();
            $("img", $clone).replaceWith( function() {
                return " " + $(this).attr("alt") + " ";
            });

            //
            _text = $.trim($clone.text()).replace(_reg, " ");

            //
            if($.inArray(_text, _done) == -1) {
                _done.push(_text);
                _hrefs[_text] = $(this).attr("href");
            } else if (_hrefs[_text] != $(this).attr("href")) {
                //
                _result.push(_getDetails(this));

            }
        });

        //
        return _result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.linksESP = function(doc) {
        //
        var _result = [];

        //
        $("#contentBody a[href$='pdf'], #contentBody a[href$='doc']").each( function(){
            //
            if($("#relatedLinkBox a[href='" + $(this).attr("href") + "']").size() == 0) {
                //
                _result.push(_getDetails(this));
            }
        });

        //
        return _result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.linksSpecialChars = function(doc) {
        //
        var _result = [],
            _reg= new RegExp().compile("[_% ]", "g"),
            _reg_domain = new RegExp().compile("^https?\:\/\/([^\/]+)", "i");

        // current URL
        if (_reg.test(doc.location.href)) {
            //
            _result.push(doc.location.href);
        }

        // links
        $("a[href]").each( function() {
            //
            var _href = $.trim($(this).attr("href")), isInternal = true;

            //
            if (_reg_domain.test(_href)) {
                //
                if(RegExp.$1 != doc.location.hostname) {
                    isInternal = false;
                }
            }

            //
            if(isInternal) {
                //
                if (_href.toLowerCase() != _href || _reg.test($(this).attr("href"))) {
                    _result.push(_getDetails(this));
                }
            }
        });

        //
        return _result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.linksInternal = function(doc) {
        //
        var _result = [],
            _reg = new RegExp().compile("^https?\:\/\/([^\/]+)", "i"),
            _reg_doc = new RegExp().compile("\.(pdf|doc)$", "i");

        //
        $("a").each( function() {
            //
            var _href = $.trim($(this).attr("href")), isInternal = true, isDoc = false;

            //
            if(_reg_doc.test(_href)) {
                isDoc = true;
            }

            //
            if (!isDoc && _reg.test(_href)) {
                //
                if(RegExp.$1 != doc.location.hostname) {
                    isInternal = false;
                }
            }

            //
            if(!isDoc && isInternal) {
                //
                if ($(this).attr("target") == "_blank") {
                    _result.push(_getDetails(this));
                }
            }
        });

        //
        return _result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.linksNavigation = function(doc) {
        //
        var _result = [],
            _reg = new RegExp().compile("^https?\:\/\/([^\/]+)", "i");

        //
        $("#navTools a[href], #thematicNav a[href], #transversalNav a[href]," +
            "#setcategoriesBox a[href]").each( function() {
            //
            var _href = $.trim($(this).attr("href"));

            //
            if (_reg.test(_href)) {
                //
                if(RegExp.$1 != doc.location.hostname) {
                    _result.push(_getDetails(this));
                }
            }
        });

        //
        return _result;
    }

    /**
     *
     * @param doc
     * @return
     */
    window.minimumFontSize = function(doc) {
        //
        var _result = [];
        var fontSize = parseInt($("html").css("font-size"));

        //
        function walk(node) {
            //
            var _fontSize = parseInt(node.css("font-size"));

            //
            if(_fontSize / fontSize >= 0.75) {
                node.children().each(function(){
                    walk($(this));
                });
            } else {
                _result.push(_getDetails(node.get(0)));
            }

            //
            return;
        }

        //
        walk($("body"));

        //
        return _result;
    }

    var inlineStyles = $("*[style]");
    var onfocusEvents = $("*[onfocus]"), onblurEvents = $("*[onblur]"), onchangeEvents = $("*[onchange]"), onclickEvents = $("*[onclick]"), onmouseoverEvents = $("*[onmouseover]"), onmouseoutEvents = $("*[onmouseout]");

})(jQuery, this);
