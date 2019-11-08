
Ext.onReady(function () {

    Ext.QuickTips.init();
    var Body = Ext.getBody();

    Ext.define('modelo_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    var storeReporte = Ext.create('Ext.data.Store', {
        fields: ['Id', 'Descripcion'],
        data: [
            { "Id": "1", "Descripcion": "Cierre" },
            { "Id": "2", "Descripcion": "PxQ" },
            { "Id": "3", "Descripcion": "Devengo" }
        ]
    });

    Ext.create('Ext.data.Store', {
        storeId: 'idstoresentido1',
        fields: ['Id', 'Sentido'],
        data: [
            { "Id": "1", "Sentido": "Ingresos" },
            { "Id": "2", "Sentido": "Costos" }
        ]
    });

    Ext.create('Ext.data.Store', {
        storeId: 'idstoresentido2',
        fields: ['Id', 'Sentido'],
        data: [
            { "Id": "3", "Sentido": "Ingresos/Costos/SMS" }
        ]
    });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'modelo_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesGestion/LlenaPeriodo',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
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
        width: "100%",
        height: '100%',
        bodyStyle: { "background-color": "#E6E6E6" },
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Generar reporte Excel </div><br/>",
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                width: '50%',
            },
            {
                xtype: 'panel',
                width: '100%',
                margin: '3 0 0 0',
                height: 1000,
                renderTo: document.body,
                frame: false,
                items: [
                    {
                        border: false,
                        items: [
                            {
                                xtype: 'panel',
                                border: false,
                                layout: 'vbox',
                                items: [
                                    {
                                        xtype: 'combobox',
                                        name: 'cmbReporte',
                                        id: 'cmbReporteid',
                                        store: storeReporte,
                                        queryMode: 'local',
                                        fieldLabel: "Tipo reporte",
                                        margin: '40 0 0 200',
                                        allowBlank: false,
                                        blankText: "El campo Tipo reporte es requerido",
                                        msgTarget: 'under',
                                        border: false,
                                        editable: false,
                                        labelWidth: 100,
                                        tpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '<div class="x-boundlist-item">{Descripcion}</div>',
                                            '</tpl>'
                                        ),
                                        displayTpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '{Descripcion}',
                                            '</tpl>'
                                        ),
                                        valueField: 'Id',
                                        listeners: {
                                            change: function (combo, nvalue) {
                                                Ext.getCmp('cmbsentidoid').reset();
                                                Ext.getCmp('cmbPeriodoid').reset();
                                                storeLlenaPeriodo.removeAll();
                                                if ( nvalue == 3) {
                                                    Ext.getCmp('cmbsentidoid').bindStore('idstoresentido1');
                                                } else {
                                                    Ext.getCmp('cmbsentidoid').bindStore('idstoresentido2');
                                                }

                                            }
                                        }	
                                    },
                                    {
                                        xtype: 'combobox',
                                        name: 'cmbSentido',
                                        id: 'cmbsentidoid',
                                        queryMode: 'local',
                                        fieldLabel: "Sentido",
                                        margin: '20 0 0 200',
                                        allowBlank: false,
                                        blankText: "El campo Sentido es requerido",
                                        msgTarget: 'under',
                                        border: false,
                                        editable: false,
                                        labelWidth: 100,
                                        tpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '<div class="x-boundlist-item">{Sentido}</div>',
                                            '</tpl>'
                                        ),
                                        displayTpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '{Sentido}',
                                            '</tpl>'
                                        ),
                                        valueField: 'Id',
                                        listeners: {
                                            change: function (combo, nvalue) {
                                                Ext.getCmp('cmbPeriodoid').reset();

                                                storeLlenaPeriodo.getProxy().extraParams.tipoReporte = Ext.getCmp('cmbReporteid').value;
                                                storeLlenaPeriodo.getProxy().extraParams.sentido = Ext.getCmp('cmbsentidoid').value;

                                                storeLlenaPeriodo.load();
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'combobox',
                                        name: 'cmbPeriodo',
                                        id: 'cmbPeriodoid',
                                        store: storeLlenaPeriodo,
                                        queryMode: 'remote',
                                        fieldLabel: "Periodo",
                                        margin: '20 0 0 200',
                                        allowBlank: false,
                                        blankText: "El campo Periodo es requerido",
                                        msgTarget: 'under',
                                        border: false,
                                        editable: false,
                                        labelWidth: 100,
                                        tpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '<div class="x-boundlist-item">{Fecha}</div>',
                                            '</tpl>'
                                        ),
                                        displayTpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '{Fecha}',
                                            '</tpl>'
                                        ),
                                        valueField: 'Periodo'
                                    },
                                    {
                                        xtype: 'fieldset',
                                        layout: { type: 'hbox' },
                                        margin: '20 0 0 270',
                                        border: false,
                                        items:
                                            [
                                                {
                                                    xtype: 'button',
                                                    id: 'btnExportar',
                                                    html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                                    border: 0,
                                                    handler: function () {
                                                        var periodo = Ext.getCmp('cmbPeriodoid').value;
                                                        var reporte = Ext.getCmp('cmbReporteid').value;
                                                        var sentido = Ext.getCmp('cmbsentidoid').value;

                                                        if (periodo == null) {
                                                            Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                            return;
                                                        }
                                                        Ext.Ajax.request({
                                                            timeout: 3600000,
                                                            url: '../' + VIRTUAL_DIRECTORY + 'ReportesGestion/ExportarReporte',
                                                            params: {
                                                                periodo: periodo,
                                                                tipoReporte: reporte,
                                                                sentido: sentido
                                                            },
                                                            success: function (response) {

                                                                var result = Ext.decode(response.responseText);
                                                                if (result.Success) {
                                                                    var bytes = new Uint8Array(result.bytes);
                                                                    var blob = new Blob([bytes], { type: 'application/xls' });
                                                                    var URL = window.URL || window.webkitURL;
                                                                    var downloadUrl = URL.createObjectURL(blob);
                                                                    var a = document.createElement("a");
                                                                    a.href = downloadUrl;
                                                                    a.download = result.responseText;
                                                                    document.body.appendChild(a);
                                                                    a.click();
                                                                    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                                                                }
                                                                else {
                                                                    Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                                                                }
                                                            },
                                                            failure: function (response, opts) {
                                                                mask.hide();
                                                                Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                                                            }
                                                        });
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    id: 'btnCancelar',
                                                    html: "<button class='btn btn-danger'  style='outline:none'>Cancelar</button>",
                                                    border: 0,
                                                    handler: function () {
                                                        Ext.getCmp('cmbReporteid').clearValue();
                                                        Ext.getCmp('cmbsentidoid').reset();
                                                        Ext.getCmp('cmbPeriodoid').reset();
                                                    }
                                                }
                                            ]
                                    },
                                ]
                            }
                        ]
                    }
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

    var lectura = ["cmbReporteid", "cmbsentidoid", "cmbPeriodoid", "btnCancelar", "btnExportar"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('ReportesGestion', lectura, nuevo, editar, eliminar, 'log');



});
