
Ext.Loader.setConfig({ enabled: true });

Ext.Loader.setPath('Ext.ux', VIRTUAL_DIRECTORY + 'Content/js/exi/ux');

Ext.require([
     /*Copiar las librerias de Ext generadas por el architect de sencha*/

]);

Ext.onReady(function () {

    Ext.QuickTips.init();

    var bd = Ext.getBody();
   
        var PanelPrincipal = Ext.create('Ext.form.Panel', {
             items: [
               /* Copiar los items generados por el architect */
            ],
            renderTo: bd
        }); 

        /* Fin de contenedor principal*/

   renderTo: bd
});
