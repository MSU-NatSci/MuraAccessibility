'use strict';

let currentURL, nbDocs, nbViolations, stopRequested, startButton, stopButton;

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
    let url = urls[0];
    currentURL = url;
    let urlSpan = document.getElementById('testURL');
    urlSpan.innerHTML = url;
    iframe.src = url;
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
    let iframe = document.getElementById('testIframe');
    let iframeDoc = iframe.contentWindow.document;
    let muraBody = iframeDoc.querySelector('.mura-body');
    if (muraBody == null)
        muraBody = iframeDoc.querySelector('#mura-editable-attribute-body');
    if (muraBody == null) {
        let ul = document.getElementById('violationList');
        let docLi = document.createElement('li');
        docLi.innerHTML = "No result for <a href=\"" + currentURL + "\">" + currentURL +
            "</a> (no element with the mura-body class)";
        ul.appendChild(docLi);
        if (!stopRequested)
            nextURL();
        else
            endChecking();
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
            console.log(error);
            endChecking();
        }
    );
}

let nextURL = function() {
    let urlSpan = document.getElementById('testURL');
    let index = urls.indexOf(currentURL);
    if (index != -1 && index < urls.length - 1) {
        let iframe = document.getElementById('testIframe');
        currentURL = urls[index + 1];
        urlSpan.innerHTML = currentURL;
        iframe.src = currentURL;
    } else {
        endChecking();
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
