
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
    var idServicio;
    var documento;


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
                { name: 'fecha', mapping: 'fecha' },
                { name: 'Periodo', mapping: 'Periodo' }
            ]
        });

    Ext.define('modeloConsulta',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Collection', mapping: 'Collection' },
                { name: 'HOperator', mapping: 'HOperator' },
                { name: 'Operator', mapping: 'Operator' },
                { name: 'ReferenceCode', mapping: 'ReferenceCode' },
                { name: 'TransDate', mapping: 'TransDate' },
                { name: 'Eventos', mapping: 'Eventos' },
                { name: 'IdColleccionServicioRegion', mapping: 'IdColleccionServicioRegion' },
                { name: 'Service', mapping: 'Service' },
                { name: 'Real', mapping: 'Real' },
                { name: 'Duration', mapping: 'Duration' },
                { name: 'Monto', mapping: 'Monto' },
                { name: 'PrecioUnitario', mapping: 'PrecioUnitario' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Module', mapping: 'Module' }
            ]

        });


    var storeLlenaFecha = Ext.create('Ext.data.Store', {
        model: 'modeloFecha',
        storeId: 'idstore_LlenaFecha',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DatosMVNO/llenaFecha?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var storeConsulta = Ext.create('Ext.data.Store', {
        model: 'modeloConsulta',
        storeId: 'idstore_Consulta',
        pageSize: 25,
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DatosMVNO/consulta' ,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var pagSize = Ext.create('Ext.data.Store', {
        fields: ['id', 'size'],
        data: [
            { "id": "1", "size": "5" },
            { "id": "2", "size": "10" },
            { "id": "3", "size": "20" },
            { "id": "4", "size": "30" },
            { "id": "5", "size": "40" }
        ]
    });

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: storeConsulta,
        displayInfo: true,
        displayMsg: 'Datos {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: 80,
                editable: false,
                margin: '25 5 5 5',
                labelWidth: 30,
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        storeConsulta.pageSize = cuenta;
                        storeConsulta.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        //flex: 1,
        items: [
            {
                html: "<h3>Datos Tráfico MVNO</h3>",
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
                        id: 'cmbFecha',
                        store: storeLlenaFecha,
                        queryMode: 'remote',
                        valueField: 'fecha',
                        displayField: 'Periodo',
                        fieldLabel: "Fecha",
                        width: '25%',
                        margin: '5 0 0 55',
                        allowBlank: false,
                        editable: false,
                        msgTarget: 'under',
                        maxLength: 100,
                        enforceMaxLength: true,
                        labelWidth: 40
                    },
                    {
                        xtype: 'button',
                        id: 'btnConsulta',
                        margin: '0 0 0 50',
                        html: "<button class='btn btn-primary'  style='outline:none'>Consulta Datos</button>",
                        border: false,
                        handler: function () {

                            storeConsulta.getProxy().extraParams.Periodo = Ext.getCmp('cmbFecha').value;
                            storeConsulta.load({
                                callback: function (records) {
                                    if (records.length == 0) {
                                        Ext.getCmp('btnExportar').setDisabled(true);
                                    } else {
                                        Ext.getCmp('btnExportar').setDisabled(false);
                                    }
                                }
                            });
                            var grp = Ext.getCmp('Collection');
                            grp.setWidth(71);
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnExportar',
                        border: false,
                        disabled: true,
                        margin: '0 0 0 0',
                        html: "<button class='btn btn-primary'  style='float: left;outline:none'>Exportar</button>",
                        handler: function () {
                            var dtFecha = Ext.getCmp('cmbFecha').value;

                            if (Ext.isEmpty(dtFecha)) {
                                Ext.Msg.alert('Exportar', 'Favor de seleccionar Fecha', Ext.emptyFn);
                            }
                            else {
                                Ext.getBody().mask('Exportando...');
                                Ext.Ajax.request({
                                    timeout: 3600000,
                                    url: '../' + VIRTUAL_DIRECTORY + 'DatosMVNO/Exportar',
                                    params: {
                                        Periodo: dtFecha
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
                                            Ext.getBody().unmask();
                                            a.click();
                                            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                                        }
                                        else {
                                            Ext.Msg.alert('Exportar', 'Error Internal Server', Ext.emptyFn);
                                        }
                                    },
                                    failure: function (response, opts) {
                                        Ext.Msg.alert('Exportar', 'Error Internal Server', Ext.emptyFn);
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                html: "<br/>",
                border: false
            },
            {
                xtype: 'gridpanel',
                id: 'grid',
                flex: 1,
                store: storeConsulta,
                width: '100%',
                height: '100%',
                scrollable: true,
                columnLines: true,
                bbar: paginador,
                columns: [
                    {
                        xtype: "gridcolumn", sortable: true, id: 'Collection', dataIndex: 'Collection', locked: false, text: "Collection",width:70,/* flex:1,*/
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Collection');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCollection',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Collection',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'HOperator', locked: false, text: "H Operator",width:70,/*flex:1,*/
                        renderer: function (v, cellValues, rec) {
                            return rec.get('HOperator');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txOperador',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'HOperator',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Operator', locked: false, text: "Operator", width:70,/*flex:1,*/
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Operator');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txOperator',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Operator',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'ReferenceCode', locked: false, text: "Reference code",width:72,/*flex:1,*/
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txReferenceCode',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'ReferenceCode',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'TransDate', locked: false, text: "Trans Date",width:70,/*flex:1,*/
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTransDate',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'TransDate',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Eventos', locked: false, text: "Eventos",width:70,flex:1,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txEventos',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Eventos',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'IdColleccionServicioRegion', width: 163, locked: false, text: "ID Colleccion-Servicio-Region",/*flex:1,*/
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'IdColleccionServicioRegion',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Service', width: 300, locked: false, text: "Service",  autoScroll: true,

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Service',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Real', width: 70, locked: false, text: "Real",/*flex:1,*/

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Real',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", format: '0.000000', align: 'right', sortable: true, dataIndex: 'Duration', width: 100, locked: false, text: "Duration",/*flex:1,*/

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Duration',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, align: 'right', format: '0.000000', dataIndex: 'Monto', width: 100, locked: false, text: "Monto",/*flex:1,*/

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Monto',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, align: 'right', format: '0.000000', dataIndex: 'PrecioUnitario', with: 90, locked: false, text: "Precio Unitario",/*flex:1,*/

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'PrecioUnitario',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Moneda', width: 55, locked: false, text: "Moneda",/*flex:1,*/

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Moneda',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Module', width: 60, locked: false, text: "Module",/*flex:1,*/

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'Module',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        storeConsulta.clearFilter();
                                    }
                                }
                            }
                        }
                    }

                ]
            }

        ],
        renderTo: Body
    });
    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w-15, h-255);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width-15, Ext.getBody().getViewSize().height-255);
        panel.doComponentLayout();
    });
});