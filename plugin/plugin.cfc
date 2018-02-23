
component accessors=true extends='mura.plugin.plugincfc' output=false {

    include 'settings.cfm';

    public any function getPluginConfig() {
        return StructKeyExists(variables, 'pluginConfig') ? variables.pluginConfig : {};
    }

}
