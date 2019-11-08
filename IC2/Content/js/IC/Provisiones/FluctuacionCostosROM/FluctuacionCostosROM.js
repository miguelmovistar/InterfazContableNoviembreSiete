/* Nombre: FluctuacionCostosROM.js
*Creado por: Ana Ilse Aguila Rojas
*Fecha: 04/sept/2019
*Descripcion: Front de Fluctuacion Cambiaria Costos ROM
*Ultima Fecha de modificación: -
*/

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();

    Ext.define('model_BuscarFluctuacionCambiariaROM',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'no_Provision', mapping: 'no_Provision' },
                { name: 'cuenta_Contable', mapping: 'cuenta_Contable' },
                { name: 'pmln', mapping: 'pmln' },
                { name: 'nombre', mapping: 'nombre' },
                { name: 'acreedor', mapping: 'acreedor' },
                { name: 'sociedad_GL', mapping: 'sociedad_GL' },
                { name: 'periodo', mapping: 'periodo' },
                { name: 'tipo', mapping: 'tipo' },
                { name: 'tipo_Registro', mapping: 'tipo_Registro' },
                { name: 'documento', mapping: 'documento' },
                { name: 'no_DocumentoSap', mapping: 'no_DocumentoSap' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'tC_Provision', mapping: 'tC_Provision' },
                { name: 'tC_Cierre', mapping: 'tC_Cierre' },
                { name: 'tC_Facturado', mapping: 'tC_Facturado' },
                { name: 'importe_Provision', mapping: 'importe_Provision' },
                { name: 'importe_ProvisionMXN', mapping: 'importe_ProvisionMXN' },
                { name: 'importe_Revaluado', mapping: 'importe_Revaluado' },
                { name: 'importe_Facturado', mapping: 'importe_Facturado' },
                { name: 'importe_Facturado_Provision', mapping: 'importe_Facturado_Provision' },
                { name: 'facturado_MXN', mapping: 'facturado_MXN' },
                { name: 'variacion_MXN', mapping: 'variacion_MXN' },
                { name: 'efecto_Operativo', mapping: 'efecto_Operativo' },
                { name: 'fluctuacion_Cambiaria', mapping: 'fluctuacion_Cambiaria' },
                { name: 'estatus', mapping: 'estatus' },
                { name: 'cuenta_Fluctuacion', mapping: 'cuenta_Fluctuacion' }
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

    Ext.define('model_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    var store_BuscarFluctuacionCambiariaROM = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacionCambiariaROM',
        storeId: 'idstore_buscarFluctuacionCambiariaROM',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosROM/LlenarGridFluctuacion',
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
            url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosROM/LlenarGridFluctuacion',
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

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosROM/LlenaPeriodo',
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
        store: store_BuscarFluctuacionCambiariaROM,
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
                        store_BuscarFluctuacionCambiariaROM.pageSize = cuenta;
                        store_BuscarFluctuacionCambiariaROM.load();
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
                html: "<div style='font-size:25px';>Fluctuación Cambiaria Costos</div><br/>",
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                width: '50%',
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 1000,
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
                                                name: 'cmbPeriodo',
                                                id: 'cmbPeriodo',
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
                                            var periodo = Ext.getCmp('cmbPeriodo').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }

                                            //Fluctuaciones
                                            store_BuscarFluctuacionCambiariaROM.getProxy().extraParams.Periodo = periodo;
                                            store_BuscarFluctuacionCambiariaROM.load({
                                                callback: function (records) {
                                                    if (records.length == 0) {
                                                        Ext.getCmp('btnExportar').setDisabled(true);
                                                    } else {
                                                        Ext.getCmp('btnExportar').setDisabled(false);
                                                    }
                                                }
                                            });

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
                                            var periodo = Ext.getCmp('cmbPeriodo').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }
                                            Ext.Ajax.request({
                                                timeout: 3600000,
                                                url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosROM/ExportarReporte',
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
                                html: '<br>',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                height: 5
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grdFluctuacionCambiariaROM',
                                flex: 1,
                                width: '100%',
                                height: 210,
                                columnLines: true,
                                store: store_BuscarFluctuacionCambiariaROM,
                                pagesize: 1,
                                scrollable: true,
                                bbar: paginador,
                                renderTo: Ext.getBody(),
                                selectable: {
                                    columns: false, // Can select cells and rows, but not columns
                                    extensible: true // Uses the draggable selection extender
                                },
                                columns: [
                                    //No. Provisión
                                    {
                                        xtype: 'gridcolumn', text: "No. Provisión", dataIndex: 'no_Provision', sortable: true, locked: false, align: 'center', width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('no_Provision');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtnoProvision",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'no_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    //cuenta contable
                                    {
                                        xtype: 'gridcolumn', text: "Cuenta Contable", dataIndex: 'cuenta_Contable', sortable: true, locked: false, align: 'center', width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('cuenta_Contable');
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'cuenta_Contable',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    //nombreGrupo
                                    {
                                        xtype: 'gridcolumn', text: "pmln", dataIndex: 'pmln', sortable: true, locked: false, align: 'center', resizable: true,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('pmln');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtnombrePMLN",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'pmln',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //nombre
                                    {
                                        xtype: 'gridcolumn', text: "Nombre", dataIndex: 'nombre', sortable: true, locked: false, align: 'center', resizable: true,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('nombre');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtnombre",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'nombre',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //acreedor
                                    {
                                        xtype: 'gridcolumn', text: "Acreedor", dataIndex: 'acreedor', sortable: true, locked: false, align: 'center', resizable: true,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('acreedor');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtacreedor",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'acreedor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //sociedad_GL
                                    {
                                        xtype: 'gridcolumn', text: "Sociedad GL", dataIndex: 'sociedad_GL', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('sociedad_GL');
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'sociedad_GL',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //periodo
                                    {
                                        xtype: 'gridcolumn', text: "Periodo", dataIndex: 'periodo', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('periodo');
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'periodo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //Tipo
                                    {
                                        xtype: 'gridcolumn', text: "Tipo", dataIndex: 'tipo', sortable: true, locked: false, align: 'center', resizable: true,                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('tipo');
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'tipo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //Tipo de Registro
                                    {
                                        xtype: 'gridcolumn', text: "Tipo de Registro", dataIndex: 'tipo_Registro', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('tipo_Registro');
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'tipo_Registro',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //Documento
                                    {
                                        xtype: 'gridcolumn', text: "Documento", dataIndex: 'documento', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('documento');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: 'txtdocumento',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'documento',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    // NO DOCUMENTO SAP
                                    {
                                        xtype: 'gridcolumn', text: "No Documento SAP", dataIndex: 'no_DocumentoSap', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('no_DocumentoSap');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: 'txtnoDocumentoSAP',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'no_DocumentoSap',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //tC_Provision
                                    {
                                        xtype: 'gridcolumn', text: "TC Provisión", dataIndex: 'tC_Provision', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('tC_Provision'), "0.0000");
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'tC_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //tC_Cierre
                                    {
                                        xtype: 'gridcolumn', text: "TC Cierre", dataIndex: 'tC_Cierre', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('tC_Cierre'), "0.0000");
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'tC_Cierre',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //tC_Facturado
                                    {
                                        xtype: 'gridcolumn', text: "TC Facturado", dataIndex: 'tC_Facturado', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('tC_Facturado'), "0.0000");
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'tC_Facturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'importe_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //importe_ProvisionMXN
                                    {
                                        xtype: 'gridcolumn', text: "Importe Provisión MXN", dataIndex: 'importe_ProvisionMXN', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('importe_ProvisionMXN'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'importe_ProvisionMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'importe_Revaluado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'importe_Facturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //importe_Facturado_Provision
                                    {
                                        xtype: 'gridcolumn', text: "Importe Facturado Soportado por Provisión", dataIndex: 'importe_Facturado_Provision', sortable: true, locked: false, align: 'right', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('importe_Facturado_Provision'), "0,000.00")
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'importe_Facturado_Provision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'facturado_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'variacion_MXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'efecto_Operativo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'fluctuacion_Cambiaria',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'estatus',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
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
                                                    store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaROM.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaROM.filter({
                                                            property: 'cuenta_Fluctuacion',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarFluctuacionCambiariaROM.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grdTotalesFluctuacionCambiariaROM',
                                height: 50,
                                margin: '0,0,0,8',
                                store: store_BuscarTotalesFluctuacion,
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

    var lectura = ["grdTotalesFluctuacionCambiariaROM", "grdFluctuacionCambiariaROM", "cmbPeriodo", "btnBuscar", "btnExportar"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('FluctuacionCostosROM', lectura, nuevo, editar, eliminar, 'log');


})