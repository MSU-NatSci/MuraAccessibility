
component extends='mura.plugin.pluginGenericEventHandler' output=false {

    include '../../plugin/settings.cfm';

    public any function onApplicationLoad(required struct m) {
        // Register all event handlers/listeners of this .cfc with Mura CMS
        variables.pluginConfig.addEventHandler(this);
    }

	public any function onRenderStart(required struct m) {
        if (m.currentUser().isLoggedIn()) {
            var pluginConfig = m.getPlugin(settings.pluginName);
            var assetsPath = '/plugins/' & pluginConfig.getDirectory() & '/assets';
            var head = '
    <script src="#assetsPath#/js/axe.min.js" defer></script>
    <script src="#assetsPath#/js/accessibility_common.js" defer></script>
    <script src="#assetsPath#/js/accessibility_in_page.js" defer></script>
    <link rel="stylesheet" href="#assetsPath#/css/accessibility_in_page.css"></link>
            ';
            cfhtmlhead(text=head);
        }
	}

}
