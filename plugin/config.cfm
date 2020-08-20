<cfscript>
    include 'settings.cfm';

    // Mura Scope
    if (!isDefined('m')) {
        siteid = session.keyExists('siteid') ? session.siteid : 'default';
        m = application.serviceFactory.getBean('m').init(siteid);
    }
    if (!isDefined('$'))
        $ = m;

    // Plugin Config
    if (!isDefined('pluginConfig'))
        pluginConfig = m.getPlugin(variables.settings.pluginName);

    // Check User Access ~ Redirect if Not Authorized
    if (!pluginConfig.currentUserAccess()) {
        location(url=m.globalConfig('context') &
            '/admin/index.cfm?muraAction=clogin.main',
            addtoken=false
        );
    }
</cfscript>
