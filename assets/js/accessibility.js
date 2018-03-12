'use strict';

let currentURL, nbDocs, nbViolations, stopRequested, startButton, stopButton, timeout;

let init = function() {
    startButton = document.getElementById('startChecking');
    startButton.addEventListener('click', (e) => startChecking(), false);

    stopButton = document.getElementById('stopChecking');
    stopButton.disabled = true;
    stopButton.addEventListener('click', (e) => stopChecking(), false);
}

let startChecking = function() {
    startButton.disabled = true;
    stopRequested = false;
    stopButton.disabled = false;
    let iframe = document.getElementById('testIframe');
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = 'testIframe';
        iframe.width = 800;
        iframe.height = 600;
        iframe.setAttribute('sandbox', 'allow-same-origin');
        document.body.appendChild(iframe);
    }
    iframe.removeEventListener('load', iframeLoaded, false);
    iframe.addEventListener('load', iframeLoaded, false);
    let violationList = document.getElementById('violationList');
    violationList.innerHTML = '';
    configureAxe();
    nbDocs = 0;
    let nbDocsSpan = document.getElementById('nbDocs');
    nbDocsSpan.innerHTML = '' + nbDocs + ' / ' + urls.length;
    nbViolations = 0;
    let nbViolationsSpan = document.getElementById('nbViolations');
    nbViolationsSpan.innerHTML = '' + nbViolations;
    firstURL();
}

let stopChecking = function() {
    stopRequested = true;
    stopButton.disabled = true;
}

let endChecking = function() {
    startButton.disabled = false;
    stopButton.disabled = true;
    let urlSpan = document.getElementById('testURL');
    urlSpan.innerHTML = '';
}

let iframeLoaded = function() {
    if (timeout != null)
        clearTimeout(timeout);
    let iframe = document.getElementById('testIframe');
    let iframeDoc = null;
    let errorMessage = null;
    try {
        iframeDoc = iframe.contentWindow.document;
    } catch (error) {
        errorMessage = "Warning: can't access the document for <a href=\"" + currentURL +
            "\">" + currentURL + "</a>";
    }
    let muraBody = null;
    if (iframeDoc != null) {
        muraBody = iframeDoc.querySelector('.mura-body');
        if (muraBody == null)
            muraBody = iframeDoc.querySelector('#mura-editable-attribute-body');
        if (muraBody == null)
            errorMessage = "Warning: no result for <a href=\"" + currentURL + "\">" +
                currentURL + "</a> (no element with the mura-body class)";
    }
    if (errorMessage != null) {
        outputErrorMessageAndContinue(errorMessage);
        return;
    }
    let context = jQuery(muraBody); // jQuery is needed in Chrome
    axe.run(context).then(
        (results) => {
            let violations = results.violations;
            let top = window.scrollY;
            addViolations(violations, iframe.src);
            window.scrollTo(window.scrollX, top);
            if (!stopRequested)
                nextURL();
            else
                endChecking();
        },
        (error) => {
            outputErrorMessageAndContinue(error);
        }
    );
}

let outputErrorMessageAndContinue = function(message) {
    let ul = document.getElementById('violationList');
    let docLi = document.createElement('li');
    docLi.innerHTML = message;
    ul.appendChild(docLi);
    if (!stopRequested)
        nextURL();
    else
        endChecking();
}

let timeoutFunction = function() {
    if (window.stop)
        window.stop();
    else
        document.execCommand('Stop'); // MSIE
    outputErrorMessageAndContinue("Warning: reached timeout when loading  <a href=\"" +
        currentURL +"\">" + currentURL + "</a>");
}

let startURL = function(url) {
    currentURL = url;
    let urlSpan = document.getElementById('testURL');
    urlSpan.innerHTML = url;
    let iframe = document.getElementById('testIframe');
    timeout = setTimeout(timeoutFunction, 10000);
    iframe.src = url;
}

let firstURL = function() {
    startURL(urls[0]);
}

let nextURL = function() {
    let index = urls.indexOf(currentURL);
    if (index != -1 && index < urls.length - 1) {
        startURL(urls[index + 1]);
    } else {
        endChecking();
        let urlSpan = document.getElementById('testURL');
        urlSpan.innerHTML = "Done";
    }
}

let addViolations = function(violations, url) {
    nbDocs++;
    let nbDocsSpan = document.getElementById('nbDocs');
    nbDocsSpan.innerHTML = '' + nbDocs + ' / ' + urls.length;
    if (violations.length > 0) {
        nbViolations += violations.length;
        let nbViolationsSpan = document.getElementById('nbViolations');
        nbViolationsSpan.innerHTML = '' + nbViolations;
        let ul = document.getElementById('violationList');
        let docLi = document.createElement('li');
        let urlLink = document.createElement('a');
        urlLink.href = url;
        urlLink.target = '_blank';
        urlLink.appendChild(document.createTextNode(url));
        docLi.appendChild(urlLink);
        let vList = document.createElement('ul');
        for (let violation of violations) {
            fixViolationStrings(violation);
            let vLi = document.createElement('li');
            let descLink = document.createElement('a');
            descLink.href = violation.helpUrl;
            descLink.target = '_blank';
            descLink.appendChild(document.createTextNode(violation.description));
            vLi.appendChild(descLink);
            addNodes(vLi, violation.nodes);
            vList.appendChild(vLi);
        }
        docLi.appendChild(vList);
        ul.appendChild(docLi);
    }
}

let addNodes = function(vLi, nodes) {
    let nodeList = document.createElement('ul');
    for (let node of nodes) {
        let nodeLi = document.createElement('li');
        let target = node.target[0];
        let usualTargetStart = 'html > body > .secondaryPageWrapper > .container.secondaryPageContainer > .row > [role="main"] > ';
        if (target.indexOf(usualTargetStart) == 0)
            target = target.substring(usualTargetStart.length);
        let anotherTarget = 'html > body > .secondaryPageWrapper > div > .contentRow.contentRow-articlePage > [role="main"] > ';
        if (target.indexOf(anotherTarget) == 0)
            target = target.substring(anotherTarget.length);
        let targetSpan = document.createElement('span');
        targetSpan.title = node.html;
        targetSpan.appendChild(document.createTextNode(target));
        nodeLi.appendChild(targetSpan);
        nodeList.appendChild(nodeLi);
    }
    vLi.appendChild(nodeList);
}

init();
