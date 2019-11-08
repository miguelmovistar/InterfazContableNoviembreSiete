

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

    var extraParams = {};
    var campoTextoFiltrado = null;

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
                { name: 'Franchise', mapping: 'Franchise' },
                { name: 'Direccion', mapping: 'Direccion' },
                { name: 'Billed_Product', mapping: 'Billed_Product' },
                { name: 'Rating_Component', mapping: 'Rating_Component' },
                { name: 'Billing_Operator', mapping: 'Billing_Operator' },
                { name: 'Unit_Cost_User', mapping: 'Unit_Cost_User' },
                { name: 'Month', mapping: 'Month' },
                { name: 'Calls', mapping: 'Calls' },
                { name: 'Actual_Usage', mapping: 'Actual_Usage' },
                { name: 'Charge_Usage', mapping: 'Charge_Usage' },
                { name: 'Currency', mapping: 'Currency' },
                { name: 'Amount', mapping: 'Amount' },
                { name: 'Iva', mapping: 'Iva' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'Sobrecargo', mapping: 'Sobrecargo' }
            ]

        });

    var storeLlenaFecha = Ext.create('Ext.data.Store', {
        model: 'modeloFecha',
        storeId: 'idstore_LlenaFecha',

        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DatosLDI/llenaFecha?lineaNegocio=' + lineaNegocio,
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
        autoLoad: false,
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DatosLDI/consulta',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        },
        listeners: {
            load: function () {
                var panels = Ext.ComponentQuery.query('#pnl_datosLDI');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
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
        listeners: {
            beforechange: function () {
                this.getStore().getProxy().extraParams = extraParams;
            }
        },
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
        itemId: 'pnl_datosLDI',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<h3>Datos Tráfico LDI</h3>",
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
                            var grp = Ext.getCmp('Franchise');
                            grp.setWidth(65);
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
                                    url: '../' + VIRTUAL_DIRECTORY + 'DatosLDI/Exportar',
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
                        xtype: "gridcolumn", sortable: true, id: 'Franchise', dataIndex: 'Franchise', locked: false, text: "Franchise", width: 60,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Franchise');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txFranchise',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }

                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Direccion', locked: false, text: "Direction", width: 60,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Direccion');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txDireccion',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Billed_Product', locked: false, text: "Billed Product", width: 100,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Billed_Product');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txBilled_Product',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Rating_Component', locked: false, text: "Rating Component", width: 200,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txRating_Component',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Billing_Operator', locked: false, text: "Billing Operator", width: 100,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txBilling_Operator',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, format: '0.000000', dataIndex: 'Unit_Cost_User', locked: false, text: "Unit Cost User", width: 100,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txUnit_Cost_User',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Month', width: 180, locked: false, text: "Month",
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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", format: '0', align: 'rigth', sortable: true, dataIndex: 'Calls', width: 100, locked: false, text: "Calls",
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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", format: '0.00', align: 'right', sortable: true, dataIndex: 'Actual_Usage', width: 100, locked: false, text: "Actual Usage",

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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", format: '0.00', align: 'right', sortable: true, dataIndex: 'Charge_Usage', width: 100, locked: false, text: "Charge Usage",

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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Currency', width: 80, locked: false, text: "Currency",

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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, align: 'right', format: '0.00', dataIndex: 'Amount', with: 200, locked: false, text: "Amount",

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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, format: '0.00', align: 'right', dataIndex: 'Iva', width: 70, locked: false, text: "IVA",

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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Trafico', width: 70, locked: false, text: "Tráfico",
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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, format: '0.00', align: 'right', dataIndex: 'Sobrecargo', width: 70, locked: false, text: "Sobrecargo",

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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
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
        panel.setSize(w - 15, h - 255);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        panel.doComponentLayout();
    });

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    var lectura = ["grid", "cmbFecha", "btnConsulta"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('DatosLDI', lectura, nuevo, editar, eliminar, 'log');
});