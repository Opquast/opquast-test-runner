
addEventListener('load', function(event){
    let infos = {
        url : content.location.href,
        mimeType : content.document.contentType,
        charset : content.document.characterSet,
        referer : content.document.referrer,
        x_results : {}
    };

    let meta = content.document.querySelector("meta[http-equiv=X-results]")
    if (meta) {
        meta.getAttribute('content').split(',').map(function(element){
            let aElement = element.split(':');
            infos.x_results[aElement[0].toLowerCase()] = parseInt(aElement[1], 10);
        });
    }
    sendSyncMessage("tests:document-loaded", infos);
}, true);
