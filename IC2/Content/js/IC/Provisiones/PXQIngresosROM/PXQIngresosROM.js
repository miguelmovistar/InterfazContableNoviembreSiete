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
                })
            }
        }
    }
});

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

    Ext.define('model_BuscarPXQIngresosROM',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'fecha', mapping: 'fecha' },
                { name: 'PLMN_PROV_TAR', mapping: 'PLMN_PROV_TAR' },
                { name: 'PLMN_V', mapping: 'PLMN_V' },
                { name: 'PLMN_GPO', mapping: 'PLMN_GPO' },
                { name: 'pais', mapping: 'pais' },
                { name: 'deudor', mapping: 'deudor' },
                { name: 'MIN_MOC_REDONDEADO', mapping: 'MIN_MOC_REDONDEADO' },
                { name: 'MIN_MOC_REAL', mapping: 'MIN_MOC_REAL' },
                { name: 'SDR_MOC', mapping: 'SDR_MOC' },
                { name: 'MIN_MTC_REDONDEADO', mapping: 'MIN_MTC_REDONDEADO' },
                { name: 'MIN_MTC_REAL', mapping: 'MIN_MTC_REAL' },
                { name: 'SDR_MTC', mapping: 'SDR_MTC' },
                { name: 'SMS_MO', mapping: 'SMS_MO' },
                { name: 'SDR_SMS', mapping: 'SDR_SMS' },
                { name: 'GPRS', mapping: 'GPRS' },
                { name: 'SDR_GPRS', mapping: 'SDR_GPRS' },
                { name: 'USD_MOC', mapping: 'USD_MOC' },
                { name: 'USD_MTC', mapping: 'USD_MTC' },
                { name: 'USD_SMS_MO', mapping: 'USD_SMS_MO' },
                { name: 'USD_GPRS', mapping: 'USD_GPRS' },
                { name: 'ingresoTraficoUSD', mapping: 'ingresoTraficoUSD' },
                { name: 'tarifa_MOC', mapping: 'tarifa_MOC' },
                { name: 'tarifa_MTC', mapping: 'tarifa_MTC' },
                { name: 'tarifa_SMS_MO', mapping: 'tarifa_SMS_MO' },
                { name: 'tarifa_GPRS', mapping: 'tarifa_GPRS' },
                { name: 'IOT_TAR_MOC', mapping: 'IOT_TAR_MOC' },
                { name: 'IOT_TAR_MTC', mapping: 'IOT_TAR_MTC' },
                { name: 'IOT_TAR_SMS_MO', mapping: 'IOT_TAR_SMS_MO' },
                { name: 'IOT_TAR_GPRS', mapping: 'IOT_TAR_GPRS' },
                { name: 'USD_MOC_IOTFacturado', mapping: 'USD_MOC_IOTFacturado' },
                { name: 'USD_MTC_IOTFacturado', mapping: 'USD_MTC_IOTFacturado' },
                { name: 'USD_SMS_MO_IOTFacturado', mapping: 'USD_SMS_MO_IOTFacturado' },
                { name: 'USD_GPRS_IOTFacturado', mapping: 'USD_GPRS_IOTFacturado' },
                { name: 'USD_MOC_IOT_REAL', mapping: 'USD_MOC_IOT_REAL' },
                { name: 'USD_MTC_IOT_REAL', mapping: 'USD_MTC_IOT_REAL' },
                { name: 'USD_MOC_IOT_DESC', mapping: 'USD_MOC_IOT_DESC' },
                { name: 'USD_MTC_IOT_DESC', mapping: 'USD_MTC_IOT_DESC' },
                { name: 'USD_SMS_MO_IOT_DESC', mapping: 'USD_SMS_MO_IOT_DESC' },
                { name: 'USD_GPRS_IOT_DESC', mapping: 'USD_GPRS_IOT_DESC' },
                { name: 'USD_SUMA_PROV_TARIFA', mapping: 'USD_SUMA_PROV_TARIFA' },
                { name: 'PROV_NC_M2M_USD', mapping: 'PROV_NC_M2M_USD' },
                { name: 'PROVRealTarifaMesAnteriorUSD', mapping: 'PROVRealTarifaMesAnteriorUSD' },
                { name: 'ajustePROV_M2M_USD_MesAnterior', mapping: 'ajustePROV_M2M_USD_MesAnterior' },
                { name: 'PROV_TAR_MesAnteriorUSD', mapping: 'PROV_TAR_MesAnteriorUSD' },
                { name: 'ajusteRal_VS_DevengoTarifaMesAnterior', mapping: 'ajusteRal_VS_DevengoTarifaMesAnterior' },
                { name: 'total_USD_PROV_Tarifa', mapping: 'total_USD_PROV_Tarifa' },
                { name: 'facturacion_REALTraficoMesAnterior', mapping: 'facturacion_REALTraficoMesAnterior' },
                { name: 'PROVTraficoMesAnteriorUSD', mapping: 'PROVTraficoMesAnteriorUSD' },
                { name: 'ajusteReal_VS_DevengoTraficoMesAnteriorUSD', mapping: 'ajusteReal_VS_DevengoTraficoMesAnteriorUSD' },
                { name: 'ajusteTraficoMesAnterior', mapping: 'ajusteTraficoMesAnterior' },
                { name: 'ajusteTarifaMesAnterior', mapping: 'ajusteTarifaMesAnterior' },
                { name: 'complementoTarifaMesAnterior', mapping: 'complementoTarifaMesAnterior' },
                { name: 'ajusteMesesAnterioresUSD', mapping: 'ajusteMesesAnterioresUSD' },
                { name: 'totalUSDTrafico', mapping: 'totalUSDTrafico' },
                { name: 'totalNetoUSD', mapping: 'totalNetoUSD' },
                { name: 'total_MIN_MOC_REDONDEADO', mapping: 'total_MIN_MOC_REDONDEADO' }
            ]
        });



    Ext.define('model_Total_BuscarPXQIngresosROM',
        {
            extend: 'Ext.data.Model',
            fields: [               
                { name: 'total_MIN_MOC_REDONDEADO', mapping: 'total_MIN_MOC_REDONDEADO' }
            ]
        });


    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQIngresosROM/LlenaPeriodo?lineaNegocio=' + lineaNegocio,
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

    var store_BuscarPXQIngresosROM = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPXQIngresosROM',
        storeId: 'idstore_buscarPXQIngresosROM',
       // groupField: 'fecha',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQIngresosROM/LlenaGrid',
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


    var store_Totales_BuscarPXQIngresosROM = Ext.create('Ext.data.Store', {
        model: 'model_Total_BuscarPXQIngresosROM',
        storeId: 'idstore_totales_buscarPXQIngresosROM',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQIngresosROM/LlenaGrid',
            reader: {
                type: 'json',
                root: 'listaTotales',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var store_seleccionarPXQIngresosROM = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPXQIngresosROM',
        storeId: 'idstore_seleccionarPXQIngresosROM',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQIngresosROM/BuscarPXQIngresosROM',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var storeExportar = Ext.create('Ext.data.Store', {
        model: 'modelo_ExpTo',
        storeId: 'idstore_Exportar',
        autoLoad: false,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQIngresosROM/ExpTo',
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

    var ptb_PXQIngresosROM = new Ext.PagingToolbar({
        id: 'ptb_PXQIngresosROM',
        store: store_BuscarPXQIngresosROM,
        displayInfo: true,
        displayMsg: 'Registros {0} - {1} de {2}',
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
                        store_BuscarPXQIngresosROM.pageSize = cuenta;
                        store_BuscarPXQIngresosROM.load();
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
                html: "<div style='font-size:25px';>PXQ Ingresos</div><br/>",
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
                                        handler: function () {
                                            var periodo = Ext.getCmp('cmbPeriodoC').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }
                                            var store = Ext.StoreManager.lookup('idstore_buscarPXQIngresosROM');
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
                                                url: '../' + VIRTUAL_DIRECTORY + 'PXQIngresosROM/ExportarReporte',
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
                                id: 'grp_PXQIngresosROM',
                                flex: 1,
                                store: store_BuscarPXQIngresosROM,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: ptb_PXQIngresosROM,
                                renderTo: Ext.getBody(),
                                //features: [{
                                //    ftype: 'groupingsummary',
                                //    groupHeaderTpl: 'fecha: {name}',
                                //    startCollapsed: true
                                //}],
                                selectable: {
                                    columns: false, // Can select cells and rows, but not columns
                                    extensible: true // Uses the draggable selection extender
                                },
                                columns: [
                                    {
                                        xtype: "gridcolumn", align: 'right', sortable: true, id: "fechaId", dataIndex: 'fecha', text: "Fecha", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fecha');
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
                                                    var store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'fecha',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'PLMN_PROV_TAR', text: "PLMN_PROV_TAR", width: "10%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('PLMN_PROV_TAR');
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

                                                    var store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PLMN_PROV_TAR',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'PLMN_V', text: "PLMN_V", width: "14%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('PLMN_V');
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PLMN_V',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'PLMN_GPO', text: "PLMN_GPO", width: "14%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('PLMN_GPO');
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PLMN_GPO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'pais', text: "País", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'pais',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'deudor', text: "Deudor", width: "14%",
                                        //summaryRenderer: function (value) {
                                        //    return '<span style="font-weight:bold;">SubTotal</span>';
                                        //},
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'deudor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'MIN_MOC_REDONDEADO', text: "MIN_MOC_REDONDEADO", width: "14%",
                                        //summaryType: 'max', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        //summaryRenderer: function (value) {
                                        //    var pct = Ext.util.Format.number(value, "0,000.000000");
                                        //    return '<span style="font-weight:bold;">$ ' + pct +  "</span>";                                           
                                        //},                                       
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'MIN_MOC_REDONDEADO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'MIN_MOC_REAL', text: "MIN_MOC_REAL", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'MIN_MOC_REAL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'SDR_MOC', text: "SDR_MOC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'SDR_MOC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'MIN_MTC_REDONDEADO', text: "MIN_MTC_REDONDEADO", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'MIN_MTC_REDONDEADO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'MIN_MTC_REAL', text: "MIN_MTC_REAL", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'MIN_MTC_REAL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'SDR_MTC', text: "SDR_MTC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'SDR_MTC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right',format: '0,000.0000', sortable: true, dataIndex: 'SMS_MO', text: "SMS_MO", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'SDR_MOC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'SDR_SMS', text: "SDR_SMS", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'SDR_SMS',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'GPRS', text: "GPRS", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'GPRS',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'SDR_GPRS', text: "SDR_GPRS", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'SDR_GPRS',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MOC', text: "USD_MOC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MOC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MTC', text: "USD_MTC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MTC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_SMS_MO', text: "USD_SMS_MO", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_SMS_MO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_GPRS', text: "USD_GPRS", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_GPRS',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'ingresoTraficoUSD', text: "Ingreso Tráfico USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ingresoTraficoUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'tarifa_MOC', text: "Tarifa_MOC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'tarifa_MOC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'tarifa_MTC', text: "Tarifa_MTC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'tarifa_MTC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'tarifa_SMS_MO', text: "Tarifa_SMS_MO", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'tarifa_SMS_MO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'tarifa_GPRS', text: "Tarifa_GPRS", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'tarifa_GPRS',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'IOT_TAR_MOC', text: "IOT_TAR_MOC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'IOT_TAR_MOC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'IOT_TAR_MTC', text: "IOT_TAR_MTC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'IOT_TAR_MTC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'IOT_TAR_SMS_MO', text: "IOT_TAR_SMS_MO", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'IOT_TAR_SMS_MO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.000000', sortable: true, dataIndex: 'IOT_TAR_GPRS', text: "IOT_TAR_GPRS", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'IOT_TAR_GPRS',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MOC_IOTFacturado', text: "USD_MOC_IOT Facturado", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MOC_IOTFacturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MTC_IOTFacturado', text: "USD_MTC_IOT Facturado", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MTC_IOTFacturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_SMS_MO_IOTFacturado', text: "USD_SMS_MO_IOT Facturado", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_SMS_MO_IOTFacturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_GPRS_IOTFacturado', text: "USD_GPRS_IOT Facturado", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_GPRS_IOTFacturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MOC_IOT_REAL', text: "USD_MOC_IOT_REAL", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MOC_IOT_REAL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MTC_IOT_REAL', text: "USD_MTC_IOT_REAL", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MTC_IOT_REAL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MOC_IOT_DESC', text: "USD_MOC_IOT_DESC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MOC_IOT_DESC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_MTC_IOT_DESC', text: "USD_MTC_IOT_DESC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_MTC_IOT_DESC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_SMS_MO_IOT_DESC', text: "USD_SMS_MO_IOT_DESC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_SMS_MO_IOT_DESC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.0000', sortable: true, dataIndex: 'USD_GPRS_IOT_DESC', text: "USD_GPRS_IOT_DESC", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_GPRS_IOT_DESC',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'USD_SUMA_PROV_TARIFA', text: "USD_SUMA_PROV_TARIFA", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'USD_SUMA_PROV_TARIFA',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'PROV_NC_M2M_USD', text: "PROV_NC_M2M_USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PROV_NC_M2M_USD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'PROVRealTarifaMesAnteriorUSD', text: "PROV Real Tarifa Mes Anterior USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PROVRealTarifaMesAnteriorUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'ajustePROV_M2M_USD_MesAnterior', text: "Ajuste PROV M2M USD Mes Anterior", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ajustePROV_M2M_USD_MesAnterior',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'PROV_TAR_MesAnteriorUSD', text: "PROV TAR Mes Anterior USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PROV_TAR_MesAnteriorUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'ajusteRal_VS_DevengoTarifaMesAnterior', text: "Ajuste Real VS Devengo Tarifa Mes Anterior", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ajusteRal_VS_DevengoTarifaMesAnterior',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'total_USD_PROV_Tarifa', text: "Total USD PROV Tarifa", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'total_USD_PROV_Tarifa',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'facturacion_REALTraficoMesAnterior', text: "Facturación Real Tráfico Mes Anterior", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'facturacion_REALTraficoMesAnterior',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'PROVTraficoMesAnteriorUSD', text: "PROV Tráfico Mes Anterior USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'PROVTraficoMesAnteriorUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'ajusteReal_VS_DevengoTraficoMesAnteriorUSD', text: "Ajuste Real VS Devengo Tráfico Mes Anterior USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ajusteReal_VS_DevengoTraficoMesAnteriorUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'ajusteTraficoMesAnterior', text: "Ajuste Tráfico Meses Anteriores", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ajusteTraficoMesAnterior',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'ajusteTarifaMesAnterior', text: "Ajuste Tarifa Meses Anteriores", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ajusteTarifaMesAnterior',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'complementoTarifaMesAnterior', text: "Complemento Tarifa Meses Anteriores", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'complementoTarifaMesAnterior',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'ajusteMesesAnterioresUSD', text: "Ajuste Meses Anteriores USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'ajusteMesesAnterioresUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'totalUSDTrafico', text: "Total USD Tráfico", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'totalUSDTrafico',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    ,
                                    {
                                        xtype: "numbercolumn", align: 'right', format: '0,000.00', sortable: true, dataIndex: 'totalNetoUSD', text: "Total Neto USD", width: "14%",
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
                                                    store = this.up('tablepanel').store;
                                                    store.clearFilter();
                                                    var cadena = this.value;
                                                    if (cadena.length >= 1) {
                                                        store.filter({
                                                            property: 'totalNetoUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
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

    var lectura = ["grp_PXQIngresosROM", "btnBuscar", "btnExportar", "cmbPeriodoC"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('PXQIngresosROM', lectura, nuevo, editar, eliminar, 'log');


}) //Termina funcion inicial
