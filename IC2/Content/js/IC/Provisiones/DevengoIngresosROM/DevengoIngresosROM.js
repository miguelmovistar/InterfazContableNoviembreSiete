/* Nombre: DevengoIngresosROM.js  
* Creado por: Pedro Santiago
* Fecha de Creación: 15/Agosto/2019
* Descripcion: JS de Reportes Devengo Ingreso ROM
*/

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;
    var store;

    Ext.define('model_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    Ext.define('model_BuscarDevengoIngreso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Fecha', mapping: 'Fecha' },
                { name: 'PPTO', mapping: 'PPTO' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'DevengoTrafico', mapping: 'DevengoTrafico' },
                { name: 'CostosRecurrentes', mapping: 'CostosRecurrentes' },
                { name: 'DevengoTotal', mapping: 'DevengoTotal' },
                { name: 'ProvisionTarifa', mapping: 'ProvisionTarifa' },
                { name: 'AjusteRealDevengoFac', mapping: 'AjusteRealDevengoFac' },
                { name: 'AjusteRealDevengoTarifa', mapping: 'AjusteRealDevengoTarifa' },
                { name: 'AjustesExtraordinarios', mapping: 'AjustesExtraordinarios' },
                { name: 'ImporteNeto', mapping: 'ImporteNeto' },
                { name: 'DevengoPPTO', mapping: 'DevengoPPTO' }
            ]
        });

    Ext.define('model_BuscarAjustes',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'SentidoTipo', mapping: 'SentidoTipo' },
                { name: 'ImporteDevengoCierreMD', mapping: 'ImporteDevengoCierreMD' },
                { name: 'TCCierre', mapping: 'TCCierre' },
                { name: 'ImporteDevengoCierreMXN', mapping: 'ImporteDevengoCierreMXN' },
                { name: 'RealFactUSD', mapping: 'RealFactUSD' },
                { name: 'TCSAP', mapping: 'TCSAP' },
                { name: 'RealFactMXN', mapping: 'RealFactMXN' },
                { name: 'AjusteUSD', mapping: 'AjusteUSD' },
                { name: 'AjusteMXN', mapping: 'AjusteMXN' }
            ]
        });

    Ext.define('model_BuscarFluctuacion',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Cuenta_Contable', mapping: 'Cuenta_Contable' },
                { name: 'Deudor_SAP', mapping: 'Deudor_SAP' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Tipo_Registro', mapping: 'Tipo_Registro' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'TC_Provision', mapping: 'TC_Provision' },
                { name: 'Provision', mapping: 'Provision' },
                { name: 'Importe_MXN', mapping: 'Importe_MXN' },
                { name: 'TC_Facturado', mapping: 'TC_Facturado' },
                { name: 'Importe_Facturado', mapping: 'Importe_Facturado' },
                { name: 'Importe_Facturado_MXN', mapping: 'Importe_Facturado_MXN' },
                { name: 'Variacion_Real_Provicion', mapping: 'Variacion_Real_Provicion' },
                { name: 'Variacion_MXN', mapping: 'Variacion_MXN' },
                { name: 'Efecto_Negocio', mapping: 'Efecto_Negocio' },
                { name: 'Provicion_Soportada', mapping: 'Provicion_Soportada' },
                { name: 'Efecto_Opertivo_Finanzas', mapping: 'Efecto_Opertivo_Finanzas' },
                { name: 'Fluctuacion_Cambiaria', mapping: 'Fluctuacion_Cambiaria' },
                { name: 'Efecto_Negocio_Neto', mapping: 'Efecto_Negocio_Neto' }
            ]
        });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenaPeriodo?lineaNegocio=' + 1,
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
    var store_BuscarDevengoIngresoUSD = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDevengoIngreso',
        storeId: 'idstore_buscarDevengoIngreso',
        groupField: 'Moneda',
        
        pageSize: 20,

        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenaGridDevengoIngreso',
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
    var store_Ajustes = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAjustes',
        storeId: 'idstore_buscarAjustes',
        groupField: 'SentidoTipo',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenarGridAjustes',
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
    var store_BuscarFluctuacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacion',
        storeId: 'idstore_buscarFluctuacion',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenarGridFluctuacion',
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
    var paginadorDevengoIngreso = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarDevengoIngresoUSD,
        displayInfo: true,
        displayMsg: "Devengo Ingresos ROM",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 20 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarDevengoIngresoUSD.pageSize = cuenta;
                        store_BuscarDevengoIngresoUSD.load();
                    }

                }
            },
            {
                xtype: 'textareafield',
                name: 'totales',
                fieldLabel: 'Totales'
            }
        ]
    });
    var paginadorAjustes = new Ext.PagingToolbar({
        id: 'paginadorAjustes',
        store: store_Ajustes,
        displayInfo: true,
        displayMsg: "Devengo Ajustes ROM",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 20 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarDevengoIngresoUSD.pageSize = cuenta;
                        store_BuscarDevengoIngresoUSD.load();
                    }

                }
            },
            {
                xtype: 'textareafield',
                name: 'totales',
                fieldLabel: 'Totales'
            }
        ]
    });
    var paginadorFluctuacion = new Ext.PagingToolbar({
        id: 'paginadorFluctuacion',
        store: store_BuscarFluctuacion,
        displayInfo: true,
        displayMsg: "Devengo Fluctuacion ROM",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 20 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarFluctuacion.pageSize = cuenta;
                        store_BuscarFluctuacion.load();
                    }

                }
            },
            {
                xtype: 'textareafield',
                name: 'totales',
                fieldLabel: 'Totales'
            }
        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        id: 'PanelPrin',
        margin: '0 0 0 0',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox', align: 'stretch' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Resumen Devengo</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '100%',
            },
            {
                bodyStyle: { "background-color": "#E6E6E6" },
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
                                xtype: 'combobox',
                                name: 'cmbPeriodo',
                                id: 'cmbPeriodo',
                                fieldLabel: 'Mes Devengo',
                                margin: '5 5 5 5',
                                queryMode: 'local',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                editable: false,
                                msgTarget: 'under',
                                store: storeLlenaPeriodo,
                                listeners: {
                                    select: function () {
                                        var periodo = Ext.getCmp('cmbPeriodo').value;

                                        Ext.Ajax.request({
                                            timeout: 3600000,
                                            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/TipoCambio',
                                            params: {
                                                Periodo: periodo
                                            },
                                            success: function (response) {

                                                var result = Ext.decode(response.responseText);
                                                if (result.Success) {
                                                    var disposition = response.getResponseHeader('Content-Disposition');
                                                    var a = Ext.getCmp('txtTC');
                                                    a.setValue(result.results);
                                                }
                                                else {
                                                    Ext.Msg.alert('Tipo de Cambio', 'Error Internal Server', Ext.emptyFn);
                                                }
                                            },
                                            failure: function (response, opts) {
                                                mask.hide();
                                                var result = Ext.decode(response.responseText);
                                                Ext.Msg.alert('Tipo de Cambio', 'Error Internal Server', Ext.emptyFn);
                                            }
                                        });
                                    }
                                },
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
                                xtype: 'textfield',
                                name: 'txtTC',
                                id: 'txtTC',
                                margin: '5 5 5 5',
                                fieldLabel: 'TC Devengo',
                                disabled: true
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        width: "100%",
                        height: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'txtPPTOIUSD',
                                id: 'txtPPTOIUSD',
                                margin: '5 5 5 5',
                                fieldLabel: 'PPTO Ingreso USD',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtPPTOCUSD',
                                id: 'txtPPTOCUSD',
                                margin: '5 5 5 5',
                                fieldLabel: 'PPTO Costo USD',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        width: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'button',
                                html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                                id: 'btnResultados',
                                margin: '10 0 0 0',
                                handler: function () {
                                    var periodo = Ext.getCmp('cmbPeriodo').value;

                                    if (periodo == null) {
                                        Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                        return;
                                    }
                                    var form = Ext.getCmp('PanelPrin');
                                    var pptoIusd = Ext.getCmp("txtPPTOIUSD").value;
                                    var pptoCusd = Ext.getCmp('txtPPTOCUSD').value;
                                    var tipCambio = Ext.getCmp('txtTC').value;
                                    var strpptoIusd = Ext.util.Format.number(pptoIusd);
                                    var strpptoCusd = Ext.util.Format.number(pptoCusd);
                                    if (form.getForm().isValid()) {
                                        if (strpptoCusd > strpptoIusd) {
                                            Ext.getCmp("txtPPTOIUSD").setValue('');
                                            Ext.getCmp("txtPPTOCUSD").setValue('');
                                            Ext.Msg.alert('Validaciones del Sistema', 'El PPPTO USD Ingreso debe ser mayor al PPTO USD Costo', Ext.emptyFn);
                                            return;
                                        }
                                        var store = Ext.StoreManager.lookup('idstore_buscarDevengoIngreso');
                                        store.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodo').value;
                                        store.getProxy().extraParams.PPTOI = strpptoIusd;
                                        store.getProxy().extraParams.PPTOC = strpptoCusd;
                                        store.getProxy().extraParams.tipoCambio = tipCambio;
                                        store.load();
                                        store.sort('Moneda', 'DESC');
                                        store.sort('Sentido', 'DESC');

                                        var storeFluctuacion = Ext.StoreManager.lookup('idstore_buscarFluctuacion');
                                        storeFluctuacion.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodo').value;
                                        storeFluctuacion.load();

                                        var storeAjustes = Ext.StoreManager.lookup('idstore_buscarAjustes');
                                        storeAjustes.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodo').value;
                                        storeAjustes.load();
                                        storeAjustes.sort('SentidoTipo', 'DESC');
                                    }
                                },
                            },
                            {
                                xtype: 'button',
                                html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                id: 'btnExportar',
                                margin: '10 0 0 0',
                                handler: function () {
                                    var periodo = Ext.getCmp('cmbPeriodo').value;
                                    var form = Ext.getCmp('PanelPrin');
                                    var pptoIusd = Ext.getCmp("txtPPTOIUSD").value;
                                    var pptoCusd = Ext.getCmp('txtPPTOCUSD').value;
                                    var tipCambio = Ext.getCmp('txtTC').value;
                                    var strpptoIusd = Ext.util.Format.number(pptoIusd);
                                    var strpptoCusd = Ext.util.Format.number(pptoCusd);

                                    if (periodo == null) {
                                        Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                        return;
                                    }
                                    Ext.Ajax.request({
                                        timeout: 3600000,
                                        url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/ExportExcel',
                                        params: {
                                            periodo: periodo,
                                            PPTOI : strpptoIusd,
                                            PPTOC : strpptoCusd,
                                            tipoCambio : tipCambio
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
                                                Ext.Msg.alert('Exportar Excel', 'Se ha exportado correctamente el reporte', Ext.emptyMsg);
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
                                },
                            },
                            {
                                html: '<div id="container"></div>'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 500,
                renderTo: Ext.getBody(),
                items: [
                    {
                        title: 'Devengo',
                        border: false,
                        closable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                id: 'grp_DevengoIngresoUSD',
                                flex: 1,
                                store: store_BuscarDevengoIngresoUSD,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginadorDevengoIngreso,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: '{name}',
                                    startCollapsed: true,
                                }],
                                columns: [
                                    {
                                        xtype: "gridcolumn", dataIndex: 'Sentido', text: "Sentido", width: "14%",
                                        summaryRenderer: function () {
                                            return '<span style="font-weight:bold;">OIBDA </span>';
                                        },
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'Sentido',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'PPTO', text: "PPTO", width: "14%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'Sentido',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'DevengoTrafico', text: "Devengo Trafico", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'DevengoTrafico',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'CostosRecurrentes', text: "Costos Recurrentes", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'CostosRecurrentes',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'DevengoTotal', text: "Devengo Total", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'DevengoTotal',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ProvisionTarifa', text: "Provision Tarifa", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'ProvisionTarifa',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteRealDevengoFac', text: "Ajuste Real Vs Devengo Factura", width: "15%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'AjusteRealDevengoFac',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteRealDevengoTarifa', text: "Ajuste Real Vs Devengo Tarifa", width: "15%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'AjusteRealDevengoTarifa',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjustesExtraordinarios', text: "Ajustes Extraordinarios", width: "15%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'AjustesExtraordinarios',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ImporteNeto', text: "Importe Neto", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'ImporteNeto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'DevengoPPTO', text: "Devengo PPTO", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'DevengoPPTO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Ajustes',
                        border: false,
                        closable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                id: 'grp_Ajustes',
                                flex: 1,
                                store: store_Ajustes,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginadorAjustes,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: 'Ajuste: {name}',
                                    startCollapsed: true,

                                }],
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', text: "Sentido", width: "14%",
                                        summaryRenderer: function (value) {
                                            return '<span style="font-weight:bold;">Ajuste Mes Anterior</span>';
                                        },
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'Sentido',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ImporteDevengoCierreMD', text: "Importe devengo cierre mes anterior MD)", width: "15%", align: 'center',
                                        
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'ImporteDevengoCierreMD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'TCCierre', text: "T.C (cierre)", width: "14%",

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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'TCCierre',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'ImporteDevengoCierreMXN', text: "Importe devengo cierre MXN", width: "14%",

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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'ImporteDevengoCierreMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'RealFactUSD', text: "Real Fact (USD)", width: "14%",

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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'RealFactUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'TCSAP', text: "T.C (SAP)", width: "14%",

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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'TCSAP',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'RealFactMXN', text: "Real Fact (MXN)", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'RealFactMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteUSD', text: "Ajuste (USD)", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'AjusteUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteMXN', text: "Ajuste (MXN)", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
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
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'AjusteMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Fluctuacion',
                        border: false,
                        closable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                id: 'grp_Fluctuacion',
                                flex: 1,
                                store: store_BuscarFluctuacion,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginadorFluctuacion,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                //features: [{
                                //    ftype: 'groupingsummary',
                                //    groupHeaderTpl: 'Devengo Ingreso({name})',
                                //    startCollapsed: true
                                //}],
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Cuenta_Contable', width: "14%", text: "Cuenta Contable",
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Cuenta_Contable',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Deudor_SAP', width: "14%", text: "Deudor SAP",
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Deudor_SAP',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'PLMN', width: "14%", text: "PLMN",
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'PLMN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Tipo_Registro', width: "14%", text: "Tipo Registro",
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Tipo_Registro',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Moneda', width: "14%", text: "Moneda",
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'TC_Provision', width: "14%", text: "TC Provision",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'TC_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Provision', width: "14%", text: "Provision",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Importe_MXN', width: "14%", text: "Importe MXN",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Importe_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'TC_Facturado', width: "14%", text: "TC Facturado",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'TC_Facturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Importe_Facturado', width: "14%", text: "Importe Facturado",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Importe_Facturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Importe_Facturado_MXN', width: "18%", text: "Importe Facturado MXN Facturado",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Importe_Facturado_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Variacion_Real_Provicion', width: "18%", text: "Variacion Real Provicion",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Importe_Facturado_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Variacion_MXN', width: "18%", text: "Variacion MXN",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Variacion_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Efecto_Negocio', width: "18%", text: "Efecto Negocio",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Efecto_Negocio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Provicion_Soportada', width: "18%", text: "Provicion Soportada",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Provicion_Soportada',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Efecto_Opertivo_Finanzas', width: "18%", text: "Efecto Opertivo Finanzas",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Efecto_Opertivo_Finanzas',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Fluctuacion_Cambiaria', width: "18%", text: "Fluctuacion Cambiaria",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Fluctuacion_Cambiaria',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Efecto_Negocio_Neto', width: "18%", text: "Efecto Negocio Neto",
                                        renderer: Ext.util.Format.usMoney,
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
                                                specialkey: function (field, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        store_BuscarFluctuacion.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacion.filter({
                                                            property: 'Efecto_Negocio_Neto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                },
                                                keyup: function () {
                                                    if (this.value.length == 0) {
                                                        store_BuscarFluctuacion.clearFilter();
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


    var lectura = ["grp_Fluctuacion", "grp_Ajustes","grp_DevengoIngresoUSD", "btnExportar"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('DevengoIngresosROM', lectura, nuevo, editar, eliminar, 'log');


}) //Termina funcion inicial
