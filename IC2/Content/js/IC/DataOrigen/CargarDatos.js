
Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', '../ux');

var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.grid.Panel',
    'Ext.selection.CheckboxModel',
    'Ext.layout.container.Column',
    'Ext.form.field.ComboBox',
    'Ext.window.MessageBox',
    'Ext.form.FieldSet',
    'Ext.tip.QuickTipManager',
    'Ext.toolbar.Paging',
    'Ext.ux.*'
]);


Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;

    Ext.define('modeloFecha',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' }
            ]
        });

    
    var storeLlenaFecha = Ext.create('Ext.data.Store', {
        model: 'modeloFecha',
        storeId: 'idstore_LlenaFecha',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CargarDatos/llenaFecha?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty:'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<h3>Cargar Datos Tráfico</h3>",
                border: false
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '100%',
                border: false,
                items: [
                    {
                        xtype: 'combobox',
                        name: 'cmbFecha',
                        id: 'idcmbFecha',
                        store: storeLlenaFecha,
                        queryMode: 'remote',
                        valueField: 'Periodo',
                        displayField: 'Periodo',
                        fieldLabel: "Fecha",
                        width: '25%',
                        margin: '5 0 0 55',
                        editable: false,
                        msgTarget: 'under',
                        maxLength: 100,
                        enforceMaxLength: true,
                        labelWidth: 40
                    },
                    {
                        xtype: 'button',
                        id: 'btnCargar',
                        margin: '0 0 0 50',
                        html: "<button class='btn btn-primary'  style='outline:none'>Cargar Datos</button>",
                        border: false,
                        handler: function ()
                        {
                            var form = this.up('form').getForm();
                            if (form.wasValid) {
                                form.submit({
                                    url: '../' + VIRTUAL_DIRECTORY + 'CargarDatos/CargarDatos',
                                    waitMsg: "Cargando...",
                                    params:
                                    {
                                        Periodo: Ext.getCmp('idcmbFecha').value,
                                        lineaNegocio: lineaNegocio
                                    },
                                    timeout: 1800,
                                    success: function (form, action) {
                                        var data = Ext.JSON.decode(action.response.responseText);
                                        Ext.Msg.show({
                                            title: "Confirmación",
                                            msg: "Datos cargados con éxito",
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        Ext.getCmp('idcmbFecha').value= "";
                                        Ext.getCmp('idcmbFecha').clearValue;
                                        storeLlenaFecha.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                        storeLlenaFecha.load();
                                    },
                                    failure: function (forms, action) {
                                        var data = Ext.JSON.decode(action.response.responseText);
                                        Ext.Msg.show({
                                            title: "Notificación",
                                            msg: data.results,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                html: "<br/>"
            }
           
        ],
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 255);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        panel.doComponentLayout();
    }); 
});