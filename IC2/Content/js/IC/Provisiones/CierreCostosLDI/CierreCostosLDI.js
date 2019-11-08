
Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    
    Ext.define('model_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    Ext.define('model_BuscarCierreIngresosLDI',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'periodo', mapping: 'periodo' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'operador', mapping: 'operador' },
                { name: 'trafico', mapping: 'trafico' },
                { name: 'minuto', mapping: 'minuto' },
                { name: 'tarifa', mapping: 'tarifa' },
                { name: 'USD', mapping: 'USD' },
                { name: 'MXN', mapping: 'MXN' },
                { name: 'tipoCambio', mapping: 'tipoCambio' }
            ]
        });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostosLDI/LlenaPeriodo?lineaNegocio=' + 2,
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

    var store_BuscarCierreIngresosLDI = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCierreIngresosLDI',
        storeId: 'idstore_buscarCierreIngresosLDI',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostosLDI/LlenaGrid',
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

    var ptb_CierreIngresosLDI = new Ext.PagingToolbar({
        id: 'ptb_CierreIngresosLDI',
        store: store_BuscarCierreIngresosLDI,
        displayInfo: true,
        displayMsg: 'Facturas {0} - {1} of {2}',
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
                        store_BuscarCierreIngresosLDI.pageSize = cuenta;
                        store_BuscarCierreIngresosLDI.load();
                    }
                }
            }
        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Cierre Costos</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 500,
                renderTo: document.body,
                frame: false,
                items: [
                    {
                        title: 'Criterios de búsqueda',
                        border: false,
                        items: [
                            {
                                xtype: 'panel',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                width: '100%',
                                layout: 'column',
                                items: [
                                    {
                                        columnWidth: 0.15,
                                        bodyStyle: { "background-color": "#E6E6E6" },
                                        border: false,
                                        items: [
                                            {
                                                html: 'Periodo',
                                                margin: '0 0 0 5',
                                                bodyStyle: { "background-color": "#E6E6E6" },
                                                border: false
                                            },
                                            {
                                                xtype: 'combobox',
                                                name: 'cmbPeriodoC',
                                                id: 'cmbPeriodoC',
                                                anchor: '100%',
                                                margin: '5 5 5 5',
                                                queryMode: 'local',
                                                bodyStyle: { "background-color": "#E6E6E6" },
                                                border: false,
                                                editable: false,
                                                msgTarget: 'under',
                                                store: storeLlenaPeriodo,
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
                                            }
                                        ]
                                    },
                                    //Buscar
                                    {
                                        xtype: 'button',
                                        id: 'btnBuscar',
                                        html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                                        margin: '10 0 0 0',
                                        border:false,
                                        handler: function () {
                                            var periodo = Ext.getCmp('cmbPeriodoC').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }

                                            var store = Ext.StoreManager.lookup('idstore_buscarCierreIngresosLDI');
                                            store.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodoC').value;

                                            store.load({
                                                callback: function (records) {
                                                    if (records.length == 0) {
                                                        Ext.getCmp('btnExportar').setDisabled(true);
                                                    } else {
                                                        Ext.getCmp('btnExportar').setDisabled(false);
                                                    }
                                                }
                                            });
                                        },
                                    },
                                    //Exportar
                                    {
                                        xtype: 'button',
                                        id: 'btnExportar',
                                        html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                        border: false,
                                        disabled: true,
                                        margin: '10 0 0 0',
                                        handler: function () {
                                            var periodo = Ext.getCmp('cmbPeriodoC').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }
                                            Ext.Ajax.request({
                                                timeout: 3600000,
                                                url: '../' + VIRTUAL_DIRECTORY + 'CierreCostosLDI/ExportarReporte',
                                                params: {
                                                    Periodo: periodo
                                                },
                                                success: function (response) {

                                                    var result = Ext.decode(response.responseText);
                                                    if (result.Success) {
                                                        var disposition = response.getResponseHeader('Content-Disposition');
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
                                                    var result = Ext.decode(response.responseText);
                                                    Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                                                }
                                            });
                                        }
                                    },
                                    {
                                        html: '<div id="container"></div>'
                                    }
                                ]
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grp_CierreIngresosLDI',
                                flex: 1,
                                store: store_BuscarCierreIngresosLDI,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: ptb_CierreIngresosLDI,
                                renderTo: Ext.getBody(),
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, id: "periodoId", dataIndex: 'periodo', text: "Periodo", width: "8%",
                                        
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'periodo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'moneda', text: "Moneda", width: "10%",
                                        
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'operador', text: "Operador", width: "14%",
                                        
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'operador',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'trafico', text: "Tráfico", width: "14%",
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'trafico',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'minuto', text: "Minuto", width: "14%", align: "right",
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'minuto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', sortable: true, dataIndex: 'tarifa', text: "Tarifa", width: "14%", align: "right",
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'tarifa',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'USD', text: "USD", width: "14%", align: "right",
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'USD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'MXN', text: "MXN", width: "14%", align: "right",
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', sortable: true, dataIndex: 'tipoCambio', text: "Tipo Cambio", width: "14%", align: "right",
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
                                                    store_BuscarCierreIngresosLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 0) {
                                                        store_BuscarCierreIngresosLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCierreIngresosLDI.filter({
                                                            property: 'tipoCambio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCierreIngresosLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        bodyStyle: { "background-color": "#E6E6E6" },
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

    var lectura = ["grp_CierreIngresosLDI", "cmbPeriodoC", "btnBuscar", "btnExportar"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('CierreCostosLDI', lectura, nuevo, editar, eliminar, 'log');



})
