
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
    var procesados;
    var total;
    var erroneos;
    var listaErroneos = new Array();
    var strErroneos = "";


    Ext.define('modeloSubmenu',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Nombre', mapping: 'Nombre' }

            ]
        });

    Ext.define('modeloErrores',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'texto', mapping: 'texto' }

            ]
        });

    Ext.define('modeloDocumento',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'NombreArchivo', mapping: 'NombreArchivo' },
                { name: 'Ruta', mapping: 'Ruta' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'FechaCarga', mapping: 'FechaCarga' },
                { name: 'EstatusCarga', mapping: 'EstatusCarga' }
            ]
        });

    Ext.define('modeloFecha',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                //{ name: 'Id_Documento', mapping: 'Id_Documento' },
                { name: 'Periodo', mapping: 'Periodo' }
            ]
        });

    Ext.define('modeloArchivo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'archivoCSV', mapping: 'archivoCSV' }
            ]
        });


    var storeLlenaSubmenu = Ext.create('Ext.data.Store', {
        model: 'modeloSubmenu',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CargaTarifaRoaming/llenaCarga',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
                // totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var storeLlenaErrores = Ext.create('Ext.data.Store', {
        model: 'modeloErrores',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CargaTarifaRoaming/llenaCarga',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
                // totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var storeCargar = Ext.create('Ext.data.Store',
        {
            model: 'modeloArchivo',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: '../' + VIRTUAL_DIRECTORY + 'CargaTarifaRoaming/cargarCSV',
                reader: {
                    type: 'json',
                    root: 'results',
                    successProperty: 'success'
                },
                actionMethods: {
                    create: 'POST', read: 'GET', update: 'POST', destroy: 'destroy'
                }
            }
        });

   
    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'hbox' },
        flex: 1,
        items: [
            {
                xtype: 'fieldset',
                margin: '0 0 0 6',
                layout: { type: 'vbox' },
                height: '100%',
                width: '50%',
                border: false,
                items:[
            {
                html: "<h2>Cargar Archivo CSV</h2>",
                border: false,
                width: '100%'

            },
            {
                xtype: 'panel',
                layout: { type: 'vbox' },
                width: '100%',
                border: false,
                items: [
                    {
                        xtype: 'combobox',
                        name: 'cmbTipoCarga',
                        id: 'cmbTipoCarga',
                        store: storeLlenaSubmenu,
                        queryMode: 'remote',
                        valueField: 'Id',
                        displayField: 'Nombre',
                        fieldLabel: "Tipo carga",
                        width: '60%',
                        margin: '5 0 0 55',
                        allowBlank: false,
                        msgTarget: 'under',
                        maxLength: 100,
                        enforceMaxLength: true,
                        labelWidth: 100

                    },
                    {
                        xtype: 'filefield',
                        name: 'archivoCSV',
                        id: 'archivoCSV',
                        fieldLabel: 'Archivo Excel',
                        labelWidth: 50,
                        msgTarget: 'side',

                        buttonText: 'Browse...',
                        margin: '5 0 0 55',
                        width: '60%',
                        labelWidth: 100,
                        maskRe: '/[a-z\d\-_\.]+\.xlsx/.xls'
                    },
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        margin: '5 0 0 0',
                        flex: 1,
                        width: '50%',
                        border: false,
                        items:
                            [
                                {
                                    xtype: 'button',
                                    id: 'btnCargar',
                                    margin: '0 0 0 145',
                                    html: "<button class='btn btn-primary'  style='outline:none'>Ok</button>",
                                    border: 0,
                                    handler: function () {
                                        var archivo = Ext.getCmp('archivoCSV').value;
                                        var form = this.up('form').getForm();
                                        if (form.wasValid) {
                                            form.submit({
                                                url: '../' + VIRTUAL_DIRECTORY + 'CargaTarifaRoaming/cargarCSV',
                                                waitMsg: "Cargando...",
                                                success: function (form, action) {

                                                    Ext.Msg.show({
                                                        title: "Notificación",
                                                        msg: "Datos cargados con éxito",
                                                        buttons: Ext.Msg.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    data = Ext.JSON.decode(action.response.responseText);
                                                    procesados = data.procesados;

                                                    total = data.total;
                                                    erroneos = data.erroneos;

                                                    listaErroneos = data.results;

                                                    for (var i = 0; i < listaErroneos.length; ++i)
                                                        strErroneos += listaErroneos[i] + "\n";

                                                    Ext.getCmp('pnlResultados').setVisible(true);
                                                }

                                            });

                                        }


                                    }
                                },
                                {
                                    xtype: 'button',
                                    id: 'btnCancelar',
                                    margin: '0 -10 0 0',
                                    html: "<button class='btn btn-danger'  style='outline:none'>Cancelar</button>",
                                    border: 0
                                }

                            ]
                    }
                    //{
                    //    xtype: 'button',
                    //    text: 'Resultados...',
                    //    id: 'btnResultados',
                    //    disabled: true,
                    //    margin: '5 0 0 160',
                    //    handler: function () {
                    //        var ventana = Resultados(procesados, total, erroneos, strErroneos);
                    //        ventana.show();

                    //    }
                    //}

                ]
            },
                    {
                        html: "<br/>"
                    }
        ]
            },
            {
                xtype: 'panel',
                title: 'Resultados de la carga',
                id: 'pnlResultados',
                hidden:true,
                header: {
                    titlePosition: 2,
                    titleAlign: 'center'
                },
                width: 670,
                height: 400,
                listeners:
                        {
                            show: function (eOpts) {

                                Ext.getCmp('procesados').setValue("<div>" + procesados + "</div >");
                                Ext.getCmp('total').setValue("<div>" + total + "</div >");
                                Ext.getCmp('erroneos').setValue("<div>" + erroneos + "</div >");
                                //Ext.getCmp('txtErroneos').setText(strErroneos);
                            }
                        },
                fieldDefaults: {
                           labelStyle: 'font-weight:bold',
                           bodyStyle: "background-color: #E6E6E6"
                       },
                items: [
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        width: '80%',
                        border: false,
                        items: [
                            {

                                width: "50%",
                                xtype: 'displayfield',
                                border: false,
                                value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros cargados con éxito</b></div>",
                                margin: '3 0 0 0'

                            },
                            {
                                xtype: 'displayfield',
                                id: 'procesados',
                                border: false,
                                margin: '3 0 0 50',
                                value: "<h6 style='font: bold'>" + procesados + "</h6>"

                            }

                        ]
                    },
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        width: '80%',
                        border: false,
                        items: [
                            {
                                width: "50%",
                                xtype: 'displayfield',
                                border: false,
                                value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros procesados</b></div>",
                                margin: '3 0 0 0'
                            },
                            {
                                xtype: 'displayfield',
                                id: 'total',
                                border: false,
                                margin: '3 0 0 50',
                                value: "<h6 style='font: bold'>" + total + "</h6>"

                            }

                        ]
                    },
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        width: '80%',
                        border: false,
                        items: [
                            {
                                width: "50%",
                                xtype: 'displayfield',
                                border: false,
                                value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros erróneos</b></div>",
                                margin: '3 0 0 0'

                            },
                            {
                                xtype: 'displayfield',
                                id: 'erroneos',
                                border: false,
                                margin: '3 0 0 50',
                                value: "<h6 style='font: bold'>" + erroneos + "</h6>"

                            }

                        ]
                    },
                    {

                        xtype: 'panel',
                        id: 'txtErroneos',
                        autoScroll: true,
                        overflowX: 'auto',
                        overflowY: 'auto',
                        width: 500,
                        margin: '0 5 2 5',
                        text: strErroneos,
                        height: 300

                    }
                    //{

                    //    xtype: 'text',
                    //    id: 'txtErroneos',
                    //    autoScroll: true,
                    //    overflowX: 'auto',
                    //    overflowY: 'auto',
                    //    width: 500,
                    //    margin: '0 5 2 5',
                    //    text: strErroneos,
                    //    height: 300

                    //}
                  
                ]
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

    //function Resultados(procesados, total, erroneos, strErroneos) {

    //    var ventana = Ext.create('Ext.window.Window',
    //        {
    //            title: 'Resultados de la carga',
    //            header: {
    //                titlePosition: 2,
    //                titleAlign: 'center'
    //            },
    //            listeners:
    //            {
    //                close: function (eOpts) {
    //                    //procesados = "";
    //                    //erroneos = "";
    //                    //total = "";
    //                    //strErroneos = "";
    //                    //listaErroneos = null;
    //                    //Ext.getCmp('btnResultados').setDisabled(true);
    //                }
    //            },
    //            closable: true,
    //            closeAction: 'hide',
    //            width: 600,
    //            height: 350,
    //            items: [

    //                {
    //                    region: 'panel',
    //                    width: '100%',
    //                    flex: 1,
    //                    layout: { type: 'vbox' },
    //                    items: [

    //                        {
    //                            xtype: 'fieldset',
    //                            layout: { type: 'hbox' },
    //                            width: '80%',
    //                            border: false,
    //                            items: [
    //                                {

    //                                    width: "50%",
    //                                    xtype: 'displayfield',
    //                                    border: false,
    //                                    value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros cargados con éxito</b></div>",
    //                                    margin: '3 0 0 0'

    //                                },
    //                                {
    //                                    xtype: 'displayfield',
    //                                    id: 'procesados',
    //                                    border: false,
    //                                    margin: '3 0 0 50',
    //                                    value: "<h6 style='font: bold'>" + procesados + "</h6>"

    //                                }

    //                            ]
    //                        },
    //                        {
    //                            xtype: 'fieldset',
    //                            layout: { type: 'hbox' },
    //                            width: '80%',
    //                            border: false,
    //                            items: [
    //                                {
    //                                    width: "50%",
    //                                    xtype: 'displayfield',
    //                                    border: false,
    //                                    value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros procesados</b></div>",
    //                                    margin: '3 0 0 0'
    //                                },
    //                                {
    //                                    xtype: 'displayfield',
    //                                    id: 'total',
    //                                    border: false,
    //                                    margin: '3 0 0 50',
    //                                    value: "<h6 style='font: bold'>" + total + "</h6>"

    //                                }

    //                            ]
    //                        },
    //                        {
    //                            xtype: 'fieldset',
    //                            layout: { type: 'hbox' },
    //                            width: '80%',
    //                            border: false,
    //                            items: [
    //                                {
    //                                    width: "50%",
    //                                    xtype: 'displayfield',
    //                                    border: false,
    //                                    value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros erróneos</b></div>",
    //                                    margin: '3 0 0 0'

    //                                },
    //                                {
    //                                    xtype: 'displayfield',
    //                                    id: 'erroneos',
    //                                    border: false,
    //                                    margin: '3 0 0 50',
    //                                    value: "<h6 style='font: bold'>" + erroneos + "</h6>"

    //                                }

    //                            ]
    //                        },
    //                        {

    //                            xtype: 'text',
    //                            id: 'txtErroneos',
    //                            autoScroll: true,
    //                            overflowX: 'auto',
    //                            overflowY: 'auto',
    //                            width: '100%',
    //                            margin: '0 5 2 5',
    //                            text: strErroneos,
    //                            height: 180

    //                        }
    //                    ]
    //                }]
    //        });

    //    return ventana;
    //}

});