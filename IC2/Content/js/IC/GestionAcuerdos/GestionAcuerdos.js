
Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var periodoBusqueda;
    //Modelos
    Ext.define('modelo_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    Ext.define('modelo_LlenaGestionAcuerdos',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'MinutosPolizas', mapping: 'MinutosPolizas' },
                { name: 'TarifaPolizas', mapping: 'TarifaPolizas' },
                { name: 'USDPolizas', mapping: 'USDPolizas' },
                { name: 'MinutosAcuerdos', mapping: 'MinutosAcuerdos' },
                { name: 'TarifaAcuerdos', mapping: 'TarifaAcuerdos' },
                { name: 'USDAcuerdos', mapping: 'USDAcuerdos' },
                { name: 'VariacionMinutos', mapping: 'VariacionMinutos' },
                { name: 'VariacionMonto', mapping: 'VariacionMonto' }
            ]
        });
    //Stores
    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'modelo_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'GestionAcuerdos/LlenaPeriodo',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var store_BuscarGestionAcuerdos = Ext.create('Ext.data.Store', {
        model: 'modelo_LlenaGestionAcuerdos',
        storeId: 'idstore_buscarGestionAcuerdos',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'GestionAcuerdos/llenaGrid',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total',
                existeCambio: 'cambio'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                if (request.proxy.reader.jsonData.results.length == 0) {
                    Ext.getCmp('btnExportar').setDisabled(true);
                    Ext.getCmp('btnEnvioPF').setDisabled(true);
                } else {
                    Ext.getCmp('btnExportar').setDisabled(false);
                    Ext.getCmp('btnEnvioPF').setDisabled(false);
                }

                if (request.proxy.reader.jsonData.cambio) {
                    Ext.getCmp('btnRecalcular').setDisabled(false);
                } else {
                    Ext.getCmp('btnRecalcular').setDisabled(true);
                }
            }
        }
    });

    var store_RecalcularGestionAcuerdos = Ext.create('Ext.data.Store', {
        storeId: 'idstore_recalcularGestionAcuerdos',
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'GestionAcuerdos/Recalcular',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total',
                existeCambio: 'cambio'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request) {

                if (request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Aviso",
                        msg: "Operación exitosa",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_BuscarGestionAcuerdos.getProxy().extraParams.periodo = periodoBusqueda;
                    store_BuscarGestionAcuerdos.load();
                } else {
                    Ext.MessageBox.show({
                        title: "Aviso",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }

            }
        }
    });

    var store_EnviarDocPF = Ext.create('Ext.data.Store', {
        storeId: 'idstore_enviarDocPF',
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'GestionAcuerdos/EnvioPF',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total',
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request) {

                if (request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Gestión de Acuerdos",
                        msg: "Reporte enviado a Pedido Factura",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "Aviso",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
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

    //Pagging toolbar
    var ptb_GestionAcuerdosLDI = new Ext.PagingToolbar({
        id: 'ptb_GestionAcuerdosLDI',
        store: store_BuscarGestionAcuerdos,
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
                        store_BuscarGestionAcuerdos.pageSize = cuenta;
                        store_BuscarGestionAcuerdos.load();
                    }
                }
            }
        ]
    });
    //Panel
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
                html: "<div style='font-size:25px';>Gestión de Acuerdos</div><br/>",
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
                        title: 'Búsqueda',
                        border: false,
                        items: [
                            {
                                xtype: 'panel',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                width: '100%',
                                layout: 'hbox',
                                items: [
                                    //Combo Periodo
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
                                                name: 'cmbPeriodo',
                                                id: 'cmbPeriodo',
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
                                        margin: '10 0 0 10',
                                        border: false,
                                        handler: function () {
                                            periodoBusqueda = Ext.getCmp('cmbPeriodo').value;

                                            if (periodoBusqueda == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }
                                            store_BuscarGestionAcuerdos.getProxy().extraParams.periodo = periodoBusqueda;
                                            store_BuscarGestionAcuerdos.load();
                                        }
                                    },
                                    //Exportar
                                    {
                                        xtype: 'button',
                                        id: 'btnExportar',
                                        margin: '10 0 0 20',
                                        html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                        border: false,
                                        disabled: true,
                                        handler: function () {
                                            if (periodoBusqueda == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }
                                            Ext.Ajax.request({
                                                timeout: 3600000,
                                                url: '../' + VIRTUAL_DIRECTORY + 'GestionAcuerdos/ExportarReporte',
                                                params: {
                                                    periodo: periodoBusqueda
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
                                    //Recalcular
                                    {

                                        xtype: 'button',
                                        id: 'btnRecalcular',
                                        margin: '10 0 0 0',
                                        html: "<button class='btn btn-primary'  style='outline:none'>Recalcular</button>",
                                        disabled: true,
                                        border: false,
                                        handler: function ()
                                        {
                                            store_RecalcularGestionAcuerdos.getProxy().extraParams.periodo = periodoBusqueda;
                                            store_RecalcularGestionAcuerdos.load();
                                        }
                                    },
                                    //Enviar Reporte
                                    {
                                        xtype: 'button',
                                        id: 'btnEnvioPF',
                                        html: "<button class='btn btn-primary'  style='outline:none'>Enviar Reporte a pedido factura</button>",
                                        border: false,
                                        disabled: true,
                                        margin: '10 0 0 0',
                                        handler: function () {
                                            store_EnviarDocPF.getProxy().extraParams.periodo = periodoBusqueda;
                                            store_EnviarDocPF.load();
                                        }
                                    }
                                ]
                            },
                            {
                                html: '<br>',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grp_GestionAcuerdos',
                                flex: 1,
                                store: store_BuscarGestionAcuerdos,
                                width: '100%',
                                height: 255,
                                columnLines: true,
                                scrollable: true,
                                bbar: ptb_GestionAcuerdosLDI,
                                renderTo: Ext.getBody(),
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                columns: [
                                    //
                                    {
                                        text: '',
                                        width: "25%",
                                        columns: [
                                            //Sentido
                                            {
                                                xtype: "gridcolumn", sortable: true, id: "Sentidoid", dataIndex: 'Sentido', text: "Sentido",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'Sentido',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //Operador
                                            {
                                                xtype: "gridcolumn", sortable: true, id: "Operadorid", dataIndex: 'Operador', text: "Operador",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'Operador',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //Trafico
                                            {
                                                xtype: "gridcolumn", sortable: true, id: "Traficoid", dataIndex: 'Trafico', text: "Tráfico",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'Trafico',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    //Polizas
                                    {
                                        text: 'Pólizas',
                                        width: "25%",
                                        columns: [
                                            //MinutosPolizas
                                            {
                                                xtype: "numbercolumn", format: '0,000.00', sortable: true, id: "MinutosPolizasid", dataIndex: 'MinutosPolizas', text: "Minutos", align: "right",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'MinutosPolizas',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //TarifaPolizas
                                            {
                                                xtype: "numbercolumn", format: '0,000.0000', sortable: true, id: "TarifaPolizasid", dataIndex: 'TarifaPolizas', text: "Tarifa", width: "8%", align: "right",
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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'TarifaPolizas',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //USDPolizas
                                            {
                                                xtype: "numbercolumn", format: '0,000.00', sortable: true, id: "USDPolizasid", dataIndex: 'USDPolizas', text: "USD", width: "8%", align: "right",
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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'USDPolizas',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    },
                                    //Acuerdos
                                    {
                                        text: 'Acuerdos',
                                        width: "25%",
                                        columns: [
                                            //MinutosAcuerdos
                                            {
                                                xtype: "numbercolumn", format: '0,000.00', sortable: true, id: "MinutosAcuerdosid", dataIndex: 'MinutosAcuerdos', text: "Minutos", align: "right",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'MinutosAcuerdos',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //TarifaAcuerdos
                                            {
                                                xtype: "numbercolumn", format: '0,000.0000', sortable: true, id: "TarifaAcuerdosid", dataIndex: 'TarifaAcuerdos', text: "Tarifa", width: "8%", align: "right",
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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'TarifaAcuerdos',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //USDAcuerdos
                                            {
                                                xtype: "numbercolumn", format: '0,000.00', sortable: true, id: "USDAcuerdosid", dataIndex: 'USDAcuerdos', text: "USD", width: "8%", align: "right",
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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'USDAcuerdos',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    //
                                    {
                                        text: '',
                                        //width: "25%",
                                        columns: [
                                            //VariacionMinutos
                                            {
                                                xtype: "numbercolumn", format: '0,000.00', sortable: true, id: "VariacionMinutosid", dataIndex: 'VariacionMinutos', text: "Variación de minutos", width: "20%", align: "right",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'VariacionMinutos',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            //VariacionMonto
                                            {
                                                xtype: "numbercolumn", format: '0,000.00', sortable: true, id: "VariacionMontoid", dataIndex: 'VariacionMonto', text: "Variación del monto", width: "20%", align: "right",

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
                                                            store_BuscarGestionAcuerdos.clearFilter();
                                                            var cadena = this.value;
                                                            if (this.value && cadena.length > 1) {
                                                                store_BuscarGestionAcuerdos.load({ params: { start: 0, limit: 100000 } });
                                                                store_BuscarGestionAcuerdos.filter({
                                                                    property: 'VariacionMonto',
                                                                    value: this.value,
                                                                    anyMatch: true,
                                                                    caseSensitive: false
                                                                });
                                                            } else {
                                                                store_BuscarGestionAcuerdos.clearFilter();
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
                ]
            }
        ],
        bodyStyle: { "background-color": "#E6E6E6" },
        renderTo: Body
    });
    //Resize
    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 250);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

    var lectura = ["grp_GestionAcuerdos", "cmbPeriodo", "btnBuscar", "btnExportar"];
    var nuevo = null;
    var editar = ["btnRecalcular", "btnEnvioPF"];
    var eliminar = null;

    permisosVariosElementos('GestionAcuerdos', lectura, nuevo, editar, eliminar, 'log');


})
