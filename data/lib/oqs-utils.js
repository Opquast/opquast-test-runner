(function($, undefined) {
"use strict";

/*
URL type. Useful for joining or information extraction
*/
$.URL = function(url) {
    if (!(this instanceof $.URL)) {
        return new $.URL(url);
    }
    
    //var node = document.createElement("a");
    //node.href = url;
    var node = $('<a href="' + url + '"></a>"')[0];

    this.scheme = node.protocol.split(":")[0];      // => "http"
    this.hostname = node.hostname;                  // => "example.com"
    this.port = node.port > 0 ? node.port : null;   // => "3000"
    this.path = node.pathname;                      // => "/pathname/"
    this.query = node.search;                       // => "?search=test"
    this.hash = node.hash;                          // => "#hash"
};
$.URL.prototype = {
    toString: function() {
        return this.scheme + "://" + this.hostname + (this.port ? ":" + this.port : "") +
               this.path + this.query + this.hash;
    },
    join: function(path) {
        if (path.indexOf("/") === 0) {
            this.path = path;
            path = "";
        }

        var segments = this.path.split("/").slice(0,-1).concat(path.split("/"));
        var result = [];
        if (segments.slice(-1)[0] === ".") {
            segments.splice(-1,1,"");
        }
        $.each(segments, function(v) {
            if (v === "..") {
                result.pop();
            } else if (v === ".") {
                return;
            } else {
                result.push(v);
            }
        });

        if (result[0] !== "") {
            result = [""].concat(result);
        }
        if (result.length === 1) {
            result.push("");
        }

        this.path = result.join("/");
        return this;
    }
};

$.URL.join = function(url, path) {
    return $.URL(url).join(path).toString();
};
$.URL.getDomain = function(url) {
    return $.URL(url).hostname;
};

/*
Unique an array
*/
$.uniq = function(array) {
    var result = [];
    array.forEach(function(value) {
        if (result.filter(function(v) { return value === v; }).length === 0) {
            result.push(value);
        }
    });

    return result;
};

/*
Deep merge arrays, even array of arrays
*/
$.deepMerge = function(target, src) {
    $.each(src, function(i, e) {
        if ($.isArray(e)) {
            target.push.apply(target, $.deepMerge([], e));
        } else {
            target.push(e);
        }
    });
    return target;
};

/*
startsWith & endsWith
*/
$.startsWith = function(str, part) {
    return str.indexOf(part) === 0;
};
$.endsWith = function(str, part) {
    return str.substr(-part.length) == part;
};


/*
DOM information extractor
*/
$.extractPageInfo = function() {
    var links = [],
        images = [],
        body = document.body;

    function get_stats(root) {
        return {
            'tables' : $('table', root).length,
            'data_tables' : $('table:has(caption), table:has(thead), table:has(th), table[summary]', root).length,
            'forms' : $('form', root).length,
            'lists' : $('ul, ol, dl', root).length,
            'lists_ul' : $('ul', root).length,
            'lists_ol' : $('ol', root).length,
            'lists_dl' : $('dl', root).length,
            'applet' : $('applet', root).length,
            'embed' : $('embed', root).length,
            'object' : $('object', root).length,
            'styles' : {
                'font' : $('font', root).length,
                'tt' : $('tt', root).length,
                'i' : $('i', root).length,
                'b' : $('b', root).length,
                'big' : $('big', root).length,
                'small' : $('small', root).length,
                'strike' : $('strike', root).length,
                's' : $('s', root).length,
                'u' : $('u', root).length
            }
        };
    }

    links = $('head link[href][rel], body a[href]:not([href^="#"])').map(function() {
        var tag = this.tagName.toLowerCase();
        var label = tag == 'link' && this.getAttribute('title') || this.textContent;
        return {
            'tag' : tag,
            'uri' : this.href,
            'href' : this.getAttribute('href'),
            'label' : label,
            'rel' : this.getAttribute('rel'),
            'type' : this.getAttribute('type')
        };
    }).get();

    images = $('img[src]', body).map(function() {
        return {
            'uri' : this.src,
            'src' : this.getAttribute('src'),
            'alt' : this.getAttribute('alt'),
            'longdesc' : this.getAttribute('longdesc'),
            'width' : this.getAttribute('width'),
            'height' : this.getAttribute('height')
        };
    }).get();

    var stats = get_stats(body);
    stats['images'] = images.length;
    stats['links'] = links.length;

    return {
        'title' : document.title,
        'links' : links,
        'images' : images,
        'stats' : stats
    };
};

$.extractObjects = function() {
    var objects = $("object, embed").map(function() {
        var src = this.getAttribute("data");
        if (src === null) {
            src = this.getAttribute("src");
        }
        if (src === null) {
            $("param", this).each(function() {
                var n = this.getAttribute("name");
                if (n && ["src", "movie"].indexOf(n.toLowerCase()) !== -1) {
                    src = this.getAttribute("value");
                    return;
                }
            });
        }

        if (!src) {
            return;
        }

        return $.URL(src).toString();
    }).get();

    objects = $.uniq(objects).map(function(src) {
        var startTime = new Date();
        return XHR.partial(src).then(function(response) {
            response.url = src;
            response.startTime = startTime;
            response.endTime = new Date();
            return response;
        });
    });

    objects = objects.filter(function(obj) {
        return obj !== null;
    });

    if (objects.length === 0) {
        return Q.resolve([]);
    }

    return Q.promised(Array).apply(null, objects.map(function(p) {
        return p.then(function(response) {
            return xhr2harEntry(response);
        }, function(e) {
            return null;
        });
    }));
};

function xhr2harEntry(response) {
    let size = -1;
    let mimeType = "";
    response.headers.forEach(function(h) {
        if (h.name.toLowerCase() == "content-length") {
            size = parseInt(h.value) || -1;
        }
        if (h.name.toLowerCase() == "content-type") {
            mimeType = h.value;
        }
    });

    return {
        "_url": response.url,
        "pageref": window.location.href,
        "startedDateTime": response.startTime.toISOString(),
        "time": response.endTime - response.startTime,
        "request": {
            "method": "GET",
            "url": response.url,
            "httpVersion": "HTTP/1.1",
            "cookies": [],
            "headers": [],
            "queryString" : [],
            "postData" : {},
            "headersSize" : -1,
            "bodySize" : -1
        },
        "response": {
            "status": response.status,
            "statusText": response.statusText,
            "httpVersion": "HTTP/1.1",
            "cookies": [],
            "headers": response.headers,
            "content": {
                "size": size,
                "compression": 0,
                "mimeType": mimeType,
                "text": ""
            },
            "redirectURL": "",
            "headersSize" : -1,
            "bodySize" : size,
            "_contentType": mimeType.split(";")[0],
            "_contentCharset": "",
            "_referrer": window.location.href,
            "_imageInfo": null
        },
        "cache": {},
        "timings": {
            "send": 0,
            "wait": response.endTime - response.startTime,
            "receive": 0
        }
    };
};

})(jQuery);
