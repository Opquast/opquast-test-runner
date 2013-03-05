"use strict";

exports.har2res = function(har, destination) {
    // Convert har entries to legacy resources format
    let startTime = null;
    let seenURLs = [];

    har.entries.forEach(function(entry) {
        if (startTime === null) {
            startTime = new Date(Date.parse(entry.startedDateTime));
        }

        // Remove first redirections
        if(seenURLs.length === 0 && parseInt(entry.response.status / 100) === 3) {
            return;
        }

        // Remove duplicates
        if (seenURLs.indexOf(entry._url) !== -1) {
            return;
        }
        seenURLs.push(entry._url)

        let rStart = new Date(Date.parse(entry.startedDateTime)) - startTime;
        let rTrans = entry.timings.wait + entry.timings.receive;
        let rStop = rStart + rTrans;

        let headers = {};
        entry.response.headers.forEach(function(h) {
            let name = h.name.toLowerCase();
            if (name in headers) {
                headers[name] += "," + h.value;
            } else {
                headers[name] = h.value;
            }
        });

        let res = {
            uri: entry._url,
            referrer: entry.response._referrer,
            method: entry.request.method,
            status: entry.response.status,
            status_text: entry.response.statusText,
            date: getDate(headers, "date"),
            modified: getDate(headers, "last-modified"),
            expires: getDate(headers, "expires"),
            content_type: entry.response._contentType,
            charset: entry.response._contentCharset,
            size: entry.response.content.size,
            headers: headers,
            start_time: rStart,
            stop_time: rStop,
            transfer_time: rTrans
        };

        if (entry.response._imageInfo !== null) {
            res.image_info = entry.response._imageInfo;
        }

        destination.push(res);
    });
};


let getDate = function(headers, name) {
    if (typeof(headers[name]) !== 'undefined') {
        if (isNaN(Date.parse(headers[name]))) {
            return null;
        }
        return headers[name];
    }
    return null;
};
