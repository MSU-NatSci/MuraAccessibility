
<cfscript>
    urls = [];
    feedBean = $.getFeed('content')
        .where()
        .prop('type').isEQ('Page');
    feedBean.setIncludeHomePage(1);
    feedBean.setShowNavOnly(0);
    feedBean.setShowExcludeSearch(1);
    feedBean.setMaxItems(0); // get all records
    feedBean.setItemsPerPage(0);
    iterator = feedBean.getIterator();
    while (iterator.hasNext()) {
        item = iterator.next();
        itemURL = item.getUrl();
        if (urls.find(itemURL) == 0)
            urls.append(itemURL);
    }
</cfscript>

<cfsavecontent variable="head"><cfoutput>
    <link href="assets/css/accessibility.css" rel="stylesheet">
    <script>
        var urls = [
            <cfloop index="i" from="1" to="#urls.len()#">
                '#encodeForJavaScript(urls[i])#'<cfif i neq urls.len()>,</cfif>
            </cfloop>
        ];
    </script>
    <script src="assets/js/axe.min.js" defer></script>
    <script src="assets/js/accessibility_common.js" defer></script>
    <script src="assets/js/accessibility.js" defer></script>
</cfoutput></cfsavecontent>
<cfhtmlhead text='#head#'>

<cfsavecontent variable="body"><cfoutput>
    <div class="mura-header">
        <h1>#HTMLEditFormat(pluginConfig.getName())#</h1>
    </div>
    <div class="block block-bordered">
        <div class="block-content">
            <cfif $.siteConfig('domain') neq cgi.server_name>
                <p>Warning: this plugin only works when the selected site has the same domain as the one in this page URL.</p>
            </cfif>
            <p>
                <button id="startChecking">Start checking the site</button>
                <button id="stopChecking">Stop</button>
            </p>
            <p><strong>Number of documents checked:</strong> <span id="nbDocs">0 / #urls.len()#</span></p>
            <p><strong>Total number of violations:</strong> <span id="nbViolations">0</span></p>
            <p><strong>Testing URL:</strong> <span id="testURL"></span></p>
            <p><strong>Violations:</strong></p>
            <ul id="violationList"></ul>
        </div>
    </div>
</cfoutput></cfsavecontent>
<cfoutput>
    #$.getBean('pluginManager').renderAdminTemplate(body=body, pagetitle=pluginConfig.getName())#
</cfoutput>
