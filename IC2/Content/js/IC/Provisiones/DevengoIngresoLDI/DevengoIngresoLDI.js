/* Nombre: DevengoIngresoLDI.js  
* Creado por: Pedro Santiago
* Fecha de Creación: 12/junio/2019
* Descripcion: JS de Reportes Devengo Ingreso LDI
* Modificado por: Esther Sandoval
* Ultima Fecha de modificación: 21-06-2019
*/

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
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

    Ext.define('model_BuscarDevengoIngresoLDI',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'CuentaPiv', mapping: 'CuentaPiv' },
                { name: 'Cuenta', mapping: 'Cuenta' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'SoGL', mapping: 'SoGL' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'NombreCorto', mapping: 'NombreCorto' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'FechaConsumo', mapping: 'FechaConsumo' },
                { name: 'FechaSolicitud', mapping: 'FechaSolicitud' },
                { name: 'TipoCambio', mapping: 'TipoCambio' },
                { name: 'TipoCambioFactura', mapping: 'TipoCambioFactura' },
                { name: 'CancelProvision', mapping: 'CancelProvision' },
                { name: 'CancelProvNCR', mapping: 'CancelProvNCR' },
                { name: 'Facturacion', mapping: 'Facturacion' },
                { name: 'NCREmitidas', mapping: 'NCREmitidas' },
                { name: 'Provision', mapping: 'Provision' },
                { name: 'ProvisionNCR', mapping: 'ProvisionNCR' },
                { name: 'Exceso', mapping: 'Exceso' },
                { name: 'TotalDevengo', mapping: 'TotalDevengo' },
                { name: 'Fluctuacion', mapping: 'Fluctuacion' },
                { name: 'TotalDevengoFluctuacion', mapping: 'TotalDevengoFluctuacion' }
            ]
        });

    Ext.define('model_BuscarFluctuacionCambiariaLDI',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'cuentaContable', mapping: 'cuentaContable' },
                { name: 'nombreGrupo', mapping: 'nombreGrupo' },
                { name: 'nombreDeudorSAP', mapping: 'nombreDeudorSAP' },
                { name: 'codigoDeudor', mapping: 'codigoDeudor' },
                { name: 'sociedadGL', mapping: 'sociedadGL' },
                { name: 'fecha_contable', mapping: 'fecha_contable' },
                { name: 'claseDocumento', mapping: 'claseDocumento' },
                { name: 'sentido', mapping: 'sentido' },
                { name: 'factura', mapping: 'factura' },
                { name: 'num_Documento_PF', mapping: 'num_Documento_PF' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'TC_Provision', mapping: 'TC_Provision' },
                { name: 'TC_Cierre', mapping: 'TC_Cierre' },
                { name: 'TC_Facturado', mapping: 'TC_Facturado' },
                { name: 'importe_Provision', mapping: 'importe_Provision' },
                { name: 'importe_Provision_MXN', mapping: 'importe_Provision_MXN' },
                { name: 'importe_Revaluado', mapping: 'importe_Revaluado' },
                { name: 'importe_Facturado', mapping: 'importe_Facturado' },
                { name: 'imp_Fac_Sop_Provision', mapping: 'imp_Fac_Sop_Provision' },
                { name: 'facturado_MXN', mapping: 'facturado_MXN' },
                { name: 'variacion_MXN', mapping: 'variacion_MXN' },
                { name: 'efecto_Operativo', mapping: 'efecto_Operativo' },
                { name: 'fluctuacion_Cambiaria', mapping: 'fluctuacion_Cambiaria' },
                { name: 'estatus', mapping: 'estatus' },
                { name: 'cuenta_Fluctuacion', mapping: 'cuenta_Fluctuacion' },
            ]
        });

    Ext.define('model_TotalesFluctuacion',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'totalImporteProvision', mapping: 'totalImporteProvision' },
                { name: 'totalImporteProvisionMXN', mapping: 'totalImporteProvisionMXN' },
                { name: 'totalImporteRevaluado', mapping: 'totalImporteRevaluado' },
                { name: 'totalImporteFacturado', mapping: 'totalImporteFacturado' },
                { name: 'totalImpFacSopProvision', mapping: 'totalImpFacSopProvision' },
                { name: 'totalFacturadoMXN', mapping: 'totalFacturadoMXN' },
                { name: 'totalVariacionMXN', mapping: 'totalVariacionMXN' },
                { name: 'totalEfectoOperativo', mapping: 'totalEfectoOperativo' },
                { name: 'totalFluctuacionCambiaria', mapping: 'totalFluctuacionCambiaria' }
            ]
        });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresoLDI/LlenaPeriodo?lineaNegocio=' + 2,
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

    var store_BuscarDevengoIngresoLDIDocumento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDevengoIngresoLDI',
        storeId: 'idstore_buscarDevengoIngresoLDIDocumento',
        groupField: 'CuentaPiv',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresoLDI/LlenaGridDocumento',
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

    var store_BuscarDevengoIngresoLDILocal = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDevengoIngresoLDI',
        storeId: 'idstore_buscarDevengoIngresoLDI',
        groupField: 'CuentaPiv',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresoLDI/LlenaGridLocal',
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

    var store_BuscarFluctuacionCambiariaLDI = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacionCambiariaLDI',
        storeId: 'idstore_buscarFluctuacionCambiariaLDI',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresoLDI/LlenarGridFluctuacion',
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

    var store_BuscarTotalesFluctuacion = Ext.create('Ext.data.Store', {
        model: 'model_TotalesFluctuacion',
        storeId: 'idstore_model_TotalesFluctuacion',
        pageSize: 1,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresoLDI/LlenarGridFluctuacion',
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

    var paginadorDocumento = new Ext.PagingToolbar({
        id: 'paginadorDoc',
        store: store_BuscarDevengoIngresoLDIDocumento,
        displayInfo: true,
        displayMsg: 'Devengo {0} - {1} of {2}',
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
                        store_BuscarDevengoIngresoLDIDocumento.pageSize = cuenta;
                        store_BuscarDevengoIngresoLDIDocumento.load();
                    }

                }
            }
        ]
    });

    var paginadorLocal = new Ext.PagingToolbar({
        id: 'paginadorLoc',
        store: store_BuscarDevengoIngresoLDILocal,
        displayInfo: true,
        displayMsg: 'Devengo {0} - {1} of {2}',
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
                        store_BuscarDevengoIngresoLDILocal.pageSize = cuenta;
                        store_BuscarDevengoIngresoLDILocal.load();
                    }

                }
            }
        ]
    });

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarFluctuacionCambiariaLDI,
        displayInfo: true,
        displayMsg: 'Fluctuación {0} - {1} of {2}',
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
                        store_BuscarFluctuacionCambiariaLDI.pageSize = cuenta;
                        store_BuscarFluctuacionCambiariaLDI.load();
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
        bodyStyle: { "background-color": "#E6E6E6" },
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Devengo Ingreso</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            {
                columnWidth: 0.15,
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
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
                                name: 'cmbPeriodoMDocumento',
                                id: 'cmbPeriodoMDocumento',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                queryMode: 'local',
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
                    {
                        xtype: 'button',
                        html: "<button class='btn btn-primary'>Buscar</button>",
                        border: false,
                        id: 'btnBuscar',
                        margin: '10 0 0 0',
                        handler: function () {
                            var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                            if (periodo == null) {
                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                return;
                            }
                            //Moneda Documento
                            var storeD = Ext.StoreManager.lookup('idstore_buscarDevengoIngresoLDIDocumento');
                            storeD.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodoMDocumento').value;
                            storeD.load({
                                callback: function (records) {
                                    if (records.length == 0) {
                                        Ext.getCmp('btnExportar').setDisabled(true);
                                    } else {
                                        Ext.getCmp('btnExportar').setDisabled(false);
                                    }
                                }
                            });
                            //Moneda local
                            var storeL = Ext.StoreManager.lookup('idstore_buscarDevengoIngresoLDI');
                            storeL.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodoMDocumento').value;
                            storeL.load();
                            //Fluctuaciones
                            store_BuscarFluctuacionCambiariaLDI.getProxy().extraParams.Periodo = periodo;
                            store_BuscarFluctuacionCambiariaLDI.load();

                            store_BuscarTotalesFluctuacion.getProxy().extraParams.Periodo = periodo;
                            store_BuscarTotalesFluctuacion.load();
                        },
                    },
                    {
                        xtype: 'button',
                        html: "<button class='btn btn-primary' style='outline:none'>Exportar</button>",
                        border: false,
                        id: 'btnExportar',
                        disabled: true,
                        margin: '10 0 0 0',
                        handler: function () {
                            var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                            if (periodo == null) {
                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                return;
                            }
                            Ext.Ajax.request({
                                timeout: 3600000,
                                url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresoLDI/ExportarReporte',
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
                        },
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
                        title: 'Devengo Documento',
                        border: false,
                        closable: true,
                        items: [
                            {
                                html: '<br>',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grp_DevengoIngresoLDIDocumento',
                                flex: 1,
                                store: store_BuscarDevengoIngresoLDIDocumento,
                                width: '100%',
                                height: 250,
                                columnLines: true,
                                bbar: paginadorDocumento,
                                scrollable: true,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: 'Cuenta: {name}',
                                    startCollapsed: true
                                }],
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Cuenta', text: "Cuenta de Resultados", width: "10%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Cuenta');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Cuenta',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Servicio', text: "Servicio", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Servicio');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Servicio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Deudor', text: "Deudor", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Deudor');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Deudor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'SoGL', text: "So.GL", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('SoGL');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'SoGL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Grupo', text: "Grupo", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Grupo');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Grupo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'NombreCorto', text: "Nombre Corto", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('NombreCorto');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'NombreCorto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Moneda', text: "Moneda", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Moneda');
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaConsumo', text: "Fecha Consumo", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            var DatFecha = "";

                                            if (rec.get('FechaConsumo') != null) {
                                                var setDate = rec.get('FechaConsumo');
                                                var subdate = setDate.substr(6);
                                                var newDate = new Date(parseInt(subdate));
                                                var Dia = newDate.getDate().toString();
                                                var Mes = (newDate.getMonth() + 1).toString();
                                                var Anio = newDate.getFullYear().toString();
                                                DatFecha = (Dia.length < 2 ? "0" + Dia : Dia) + "-" + (Mes.length < 2 ? "0" + Mes : Mes) + "-" + Anio;
                                            }

                                            return (DatFecha)
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'FechaConsumo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaSolicitud', text: "Fecha Solicitud", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            var DatFecha = "";

                                            if (rec.get('FechaSolicitud') != null) {
                                                var setDate = rec.get('FechaSolicitud');
                                                var subdate = setDate.substr(6);
                                                var newDate = new Date(parseInt(subdate));
                                                var Dia = newDate.getDate().toString();
                                                var Mes = (newDate.getMonth() + 1).toString();
                                                var Anio = newDate.getFullYear().toString();
                                                DatFecha = (Dia.length < 2 ? "0" + Dia : Dia) + "-" + (Mes.length < 2 ? "0" + Mes : Mes) + "-" + Anio;
                                            }

                                            return (DatFecha)
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'FechaSolicitud',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', sortable: true, dataIndex: 'TipoCambio', text: "Tipo de Cambio", width: "8%", align: 'right',
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'TipoCambio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', sortable: true, dataIndex: 'TipoCambioFactura', text: "Tipo de Cambio Factura", width: "8%", align: 'right',
                                        summaryRenderer: function (value) {
                                            return '<span style="font-weight:bold;">SubTotal</span>';
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'TipoCambioFactura',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'CancelProvision', text: "Cancelación de provisión", width: "8%", align: 'right',
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'CancelProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'CancelProvNCR', text: "Cancelación provisión NCR", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'CancelProvNCR',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Facturacion', text: "Facturación", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Facturacion',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'NCREmitidas', text: "NCR Emitidas", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'NCREmitidas',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Provision', text: "Provisión", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ProvisionNCR', text: "Provisión NCR", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'ProvisionNCR',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Exceso', text: "Exceso Mes ant.", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'Exceso',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'TotalDevengo', text: "Total Devengo", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDIDocumento.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDIDocumento.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDIDocumento.filter({
                                                            property: 'TotalDevengo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDIDocumento.clearFilter();
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
                        title: 'Devengo Local',
                        border: false,
                        closable: true,
                        items: [
                            {
                                html: '<br>',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grp_DevengoIngresoLDILocal',
                                flex: 1,
                                store: store_BuscarDevengoIngresoLDILocal,
                                bbar: paginadorLocal,
                                width: '100%',
                                height: 250,
                                columnLines: true,
                                scrollable: true,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: 'Cuenta: {name}',
                                    startCollapsed: true
                                }],
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Cuenta', text: "Cuenta de Resultados", width: "10%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Cuenta');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Cuenta',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Servicio', text: "Servicio", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Servicio');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Servicio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Deudor', text: "Deudor", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Deudor');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Deudor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'SoGL', text: "So.GL", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('SoGL');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'SoGL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Grupo', text: "Grupo", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Grupo');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Grupo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'NombreCorto', text: "Nombre Corto", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('NombreCorto');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'NombreCorto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Moneda', text: "Moneda", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Moneda');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaConsumo', text: "Fecha Consumo", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            var DatFecha = "";

                                            if (rec.get('FechaSolicitud') != null) {
                                                var setDate = rec.get('FechaSolicitud');
                                                var subdate = setDate.substr(6);
                                                var newDate = new Date(parseInt(subdate));
                                                var Dia = newDate.getDate().toString();
                                                var Mes = (newDate.getMonth() + 1).toString();
                                                var Anio = newDate.getFullYear().toString();
                                                DatFecha = (Dia.length < 2 ? "0" + Dia : Dia) + "-" + (Mes.length < 2 ? "0" + Mes : Mes) + "-" + Anio;
                                            }

                                            return (DatFecha)
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'FechaConsumo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaSolicitud', text: "Fecha Solicitud", width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            var DatFecha = "";

                                            if (rec.get('FechaSolicitud') != null) {
                                                var setDate = rec.get('FechaSolicitud');
                                                var subdate = setDate.substr(6);
                                                var newDate = new Date(parseInt(subdate));
                                                var Dia = newDate.getDate().toString();
                                                var Mes = (newDate.getMonth() + 1).toString();
                                                var Anio = newDate.getFullYear().toString();
                                                DatFecha = (Dia.length < 2 ? "0" + Dia : Dia) + "-" + (Mes.length < 2 ? "0" + Mes : Mes) + "-" + Anio;
                                            }

                                            return (DatFecha)
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'FechaSolicitud',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', sortable: true, dataIndex: 'TipoCambio', text: "Tipo de Cambio", width: "8%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('TipoCambio');
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'TipoCambio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', sortable: true, dataIndex: 'TipoCambioFactura', text: "Tipo de Cambio Factura", width: "8%", align: 'right',
                                        summaryRenderer: function (value) {
                                            return '<span style="font-weight:bold;">SubTotal</span>';
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'TipoCambioFactura',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'CancelProvision', text: "Cancelación de provisión", width: "8%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        function(v, cellValues, rec) {
                                            return rec.get('CancelProvision');
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'CancelProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'CancelProvNCR', text: "Cancelación provisión NCR", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'CancelProvNCR',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Facturacion', text: "Facturación", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Facturacion',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'NCREmitidas', text: "NCR Emitidas", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'NCREmitidas',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Provision', text: "Provisión", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ProvisionNCR', text: "Provisión NCR", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'ProvisionNCR',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Exceso', text: "Exceso Mes ant.", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Exceso',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'TotalDevengo', text: "Total Devengo", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'TotalDevengo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'Fluctuacion', text: "Efecto Fluctuación", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'Fluctuacion',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'TotalDevengoFluctuacion', text: "Total Devengo + Fluctuación", width: "9%", align: 'right',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        editor: {
                                            xtype: 'textfield'
                                        },
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
                                                    store_BuscarDevengoIngresoLDILocal.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoLDILocal.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoLDILocal.filter({
                                                            property: 'TotalDevengoFluctuacion',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoLDILocal.clearFilter();
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
                        title: 'Fluctuación',
                        border: false,
                        closable: true,
                        items: [
                            {
                                html: '<br>',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grdFluctuacionCambiariaLDI',
                                flex: 1,
                                width: '100%',
                                height: 200,
                                columnLines: true,
                                store: store_BuscarFluctuacionCambiariaLDI,
                                pagesize: 1,
                                scrollable: true,
                                bbar: paginador,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                columns: [
                                    //cuenta contable
                                    {
                                        xtype: 'gridcolumn', text: "Cuenta Contable", dataIndex: 'cuentaContable', sortable: true, locked: false, align: 'center', width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('cuentaContable');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtcuentaContable",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'cuentaContable',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    //nombreGrupo
                                    {
                                        xtype: 'gridcolumn', text: "Grupo", dataIndex: 'nombreGrupo', sortable: true, locked: false, align: 'center', resizable: true,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('nombreGrupo');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtnombreGrupo",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'nombreGrupo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //nombreDeudorSAP
                                    {
                                        xtype: 'gridcolumn', text: "Nombre Deudor", dataIndex: 'nombreDeudorSAP', sortable: true, locked: false, align: 'center', resizable: true,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('nombreDeudorSAP');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtnombreDeudorSAP",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'nombreDeudorSAP',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //codigoDeudor
                                    {
                                        xtype: 'gridcolumn', text: "Deudor", dataIndex: 'codigoDeudor', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('codigoDeudor');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'codigoDeudor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //sociedadGL
                                    {
                                        xtype: 'gridcolumn', text: "Sociedad GL", dataIndex: 'sociedadGL', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('sociedadGL');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'sociedadGL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //fecha_contable
                                    {
                                        xtype: 'gridcolumn', text: "Periodo", dataIndex: 'fecha_contable', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fecha_contable');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'fecha_contable',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //claseDocumento
                                    {
                                        xtype: 'gridcolumn', text: "Clase Documento", dataIndex: 'claseDocumento', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('claseDocumento');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'claseDocumento',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //factura
                                    {
                                        xtype: 'gridcolumn', text: "Factura", dataIndex: 'factura', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('factura');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'factura',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //num_Documento_PF
                                    {
                                        xtype: 'gridcolumn', text: "Número Documento PF", dataIndex: 'num_Documento_PF', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('num_Documento_PF');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'num_Documento_PF',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //moneda
                                    {
                                        xtype: 'gridcolumn', text: "moneda", dataIndex: 'moneda', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('moneda');
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //TC_Provision
                                    {
                                        xtype: 'gridcolumn', text: "TC Provisión", dataIndex: 'TC_Provision', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('TC_Provision'), "0.0000");
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'TC_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //TC_Cierre
                                    {
                                        xtype: 'gridcolumn', text: "TC Cierre", dataIndex: 'TC_Cierre', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('TC_Cierre'), "0.0000");
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'TC_Cierre',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //TC_Facturado
                                    {
                                        xtype: 'gridcolumn', text: "TC Facturado", dataIndex: 'TC_Facturado', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('TC_Facturado'), "0.0000");
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'TC_Facturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //importe_Provision
                                    {
                                        xtype: 'gridcolumn', text: "Importe Provisión", dataIndex: 'importe_Provision', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('importe_Provision'), "0,000.00");
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'importe_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //importe_Provision_MXN
                                    {
                                        xtype: 'gridcolumn', text: "Importe Provisión MXN", dataIndex: 'importe_Provision_MXN', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('importe_Provision_MXN'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'importe_Provision_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //importe_Revaluado
                                    {
                                        xtype: 'gridcolumn', text: "Importe Revaluado", dataIndex: 'importe_Revaluado', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('importe_Revaluado'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'importe_Revaluado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //importe_Facturado
                                    {
                                        xtype: 'gridcolumn', text: "Importe Facturado", dataIndex: 'importe_Facturado', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('importe_Facturado'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'importe_Facturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //imp_Fac_Sop_Provision
                                    {
                                        xtype: 'gridcolumn', text: "Importe Facturado Soportado por Provisión", dataIndex: 'imp_Fac_Sop_Provision', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('imp_Fac_Sop_Provision'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'imp_Fac_Sop_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //facturado_MXN
                                    {
                                        xtype: 'gridcolumn', text: "Facturado MXN", dataIndex: 'facturado_MXN', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('facturado_MXN'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'facturado_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //variacion_MXN
                                    {
                                        xtype: 'gridcolumn', text: "Variación MXN", dataIndex: 'variacion_MXN', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('variacion_MXN'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'variacion_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //efecto_Operativo
                                    {
                                        xtype: 'gridcolumn', text: "Efecto Operativo", dataIndex: 'efecto_Operativo', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('efecto_Operativo'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'efecto_Operativo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //fluctuacion_Cambiaria
                                    {
                                        xtype: 'gridcolumn', text: "Fluctuación Cambiaria", dataIndex: 'fluctuacion_Cambiaria', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('fluctuacion_Cambiaria'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'fluctuacion_Cambiaria',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //estatus
                                    {
                                        xtype: 'gridcolumn', text: "Estatus", dataIndex: 'estatus', sortable: true, locked: false, align: 'center', resizable: true, width: 150,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('estatus');
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
                                                    storeLlenaGrid.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        storeLlenaGrid.load({ params: { start: 0, limit: 100000 } });
                                                        storeLlenaGrid.filter({
                                                            property: 'estatus',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        storeLlenaGrid.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //cuenta_Fluctuacion
                                    {
                                        xtype: 'gridcolumn', text: "Cuenta Fluctuación", dataIndex: 'cuenta_Fluctuacion', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('cuenta_Fluctuacion');
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
                                                    storeLlenaGrid.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        storeLlenaGrid.load({ params: { start: 0, limit: 100000 } });
                                                        storeLlenaGrid.filter({
                                                            property: 'cuenta_Fluctuacion',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        storeLlenaGrid.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grdTotalesFluctuacionCambiariaLDI',
                                height: 70,
                                margin: '0,0,0,8',
                                store: store_BuscarTotalesFluctuacion,
                                columnLines: true,
                                scrollable: true,
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalImporteProvision', dataIndex: 'totalImporteProvision', text: "Total Importe Provisión", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalImporteProvision'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalImporteProvisionMXN', dataIndex: 'totalImporteProvisionMXN', text: "Total Importe Provisión en Pesos", width: "14%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalImporteProvisionMXN'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalImporteRevaluado', dataIndex: 'totalImporteRevaluado', text: "Total Importe Revaluado", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalImporteRevaluado'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalImporteFacturado', dataIndex: 'totalImporteFacturado', text: "Total Importe Facturado", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalImporteFacturado'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalImpFacSopProvision', dataIndex: 'totalImpFacSopProvision', text: "Total Importe Facturado Soportado Por Provision", width: "14%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalImpFacSopProvision'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalFacturadoMXN', dataIndex: 'totalFacturadoMXN', text: "Total Facturado MXN", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalFacturadoMXN'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalVariacionMXN', dataIndex: 'totalVariacionMXN', text: "Total Variacion en MXN", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalVariacionMXN'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalEfectoOperativo', dataIndex: 'totalEfectoOperativo', text: "Total Efecto Operativo", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalEfectoOperativo'), "0,000.00")
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, id: 'totalFluctuacionCambiaria', dataIndex: 'totalFluctuacionCambiaria', text: "Total Fluctuación Cambiaria", width: "10%", align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('totalFluctuacionCambiaria'), "0,000.00")
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


    var lectura = ["grdTotalesFluctuacionCambiariaLDI", "grp_DevengoIngresoLDIDocumento", "btnExportar"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('DevengoIngresoLDI', lectura, nuevo, editar, eliminar, 'log');


})
