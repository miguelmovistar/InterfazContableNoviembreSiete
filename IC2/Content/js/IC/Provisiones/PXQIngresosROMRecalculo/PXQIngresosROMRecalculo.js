/* Nombre: CierreCostosROM.js  
* Creado por: Margarito Mancilla Torres
* Fecha de Creación: 20/Agosto/2019
*/
"use strict";

Ext.define('CMS.view.FileDownload', {
    extend: 'Ext.Component',
    alias: 'widget.FileDownloader',
    autoEl: {
        tag: 'iframe',
        cls: 'x-hidden',
        src: Ext.SSL_SECURE_URL
    },
    stateful: false,
    load: function (config) {
        var e = this.getEl();
        e.dom.src = config.url +
            (config.params ? '?' + Ext.urlEncode(config.params) : '');
        e.dom.onload = function () {
            if (e.dom.contentDocument.body.childNodes[0].wholeText == '404') {
                Ext.Msg.show({
                    title: 'NO FUE POSIBLE GENERAR EL DOCUMENTO...',
                    msg: 'Por favor contacte al area de soporte para identificar el origen del problema.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        };
    }
});

function getTabsConfig() {

    const tabsConfig = [];

     tabsConfig.push({
        title: 'Ajustes', config: Utils.defineModelStore({
            name: 'Ajustes',
            paginadorText: "Ajustes",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'PXQIngresosROMRecalculo/ConsultaGeneral?esRecalculo=true&elementType=Ajustes',
            modelFields: [
                { name: "IdOperador", mapping: "IdOperador" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "Trafico", mapping: "Trafico" },
                { name: "Enero", mapping: "Enero" },
                { name: "Febrero", mapping: "Febrero" },
                { name: "Marzo", mapping: "Marzo" },
                { name: "Abril", mapping: "Abril" },
                { name: "Mayo", mapping: "Mayo" },
                { name: "Junio", mapping: "Junio" },
                { name: "Julio", mapping: "Julio" },
                { name: "Agosto", mapping: "Agosto" },
                { name: "Septiembre", mapping: "Septiembre" },
                { name: "Octubre", mapping: "Octubre" },
                { name: "Noviembre", mapping: "Noviembre" },
                { name: "Diciembre", mapping: "Diciembre" },

            ],
            gridColumns: [
                { id: "IdOperador", dataIndex: "IdOperador", text: "IdOperador", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "Trafico", dataIndex: "Trafico", text: "Trafico", width: "8%" },
                { id: "Enero", dataIndex: "Enero", text: "Enero", width: "8%" },
                { id: "Febrero", dataIndex: "Febrero", text: "Febrero", width: "8%" },
                { id: "Marzo", dataIndex: "Marzo", text: "Marzo", width: "8%" },
                { id: "Abril", dataIndex: "Abril", text: "Abril", width: "8%" },
                { id: "Mayo", dataIndex: "Mayo", text: "Mayo", width: "8%" },
                { id: "Junio", dataIndex: "Junio", text: "Junio", width: "8%" },
                { id: "Julio", dataIndex: "Julio", text: "Julio", width: "8%" },
                { id: "Agosto", dataIndex: "Agosto", text: "Agosto", width: "8%" },
                { id: "Septiembre", dataIndex: "Septiembre", text: "Septiembre", width: "8%" },
                { id: "Octubre", dataIndex: "Octubre", text: "Octubre", width: "8%" },
                { id: "Noviembre", dataIndex: "Noviembre", text: "Noviembre", width: "8%" },
                { id: "Diciembre", dataIndex: "Diciembre", text: "Diciembre", width: "8%" },

            ]
        })
    });

    return tabsConfig;
}

Ext.onReady(function () {
    Ext.QuickTips.init();

    var tabsConfig = getTabsConfig();

    var panelDef = Utils.panelPrincipal({
        title: 'Recalculo Ingresos Roaming',
        controller: 'PXQIngresosROMRecalculo',
        conCalculo: false,
        tabsConfig: tabsConfig
    });

    var panel = Ext.create('Ext.form.Panel', panelDef);


    tabsConfig[0].config[0].store.source.load();

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

    var lectura = ["Ajustes"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('PXQIngresosROMRecalculo', lectura, nuevo, editar, eliminar, 'log');



}); 