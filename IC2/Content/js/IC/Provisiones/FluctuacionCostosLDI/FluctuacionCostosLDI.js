/* Nombre: FluctuacionCostosLDI.js
*Creado por: María Esthér Sandoval García
*Fecha: 06/jun/2019
*Descripcion: Front de Fluctuacion Cambiaria Costos LDI
*Ultima Fecha de modificación: -
*/

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();

    Ext.define('model_BuscarFluctuacionCambiariaLDI',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'cuentaContable', mapping: 'cuentaContable' },
                { name: 'nombreGrupo', mapping: 'nombreGrupo' },
                { name: 'nombreAcreedorSAP', mapping: 'nombreAcreedorSAP' },
                { name: 'codigoAcreedor', mapping: 'codigoAcreedor' },
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

    var store_BuscarFluctuacionCambiariaLDI = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacionCambiariaLDI',
        storeId: 'idstore_buscarFluctuacionCambiariaLDI',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosLDI/LlenarGridFluctuacion',
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
            url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosLDI/LlenarGridFluctuacion',
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
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosLDI/LlenaPeriodo',
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
                                            store_BuscarFluctuacionCambiariaLDI.getProxy().extraParams.Periodo = periodo;
                                            store_BuscarFluctuacionCambiariaLDI.load({
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
                                                url: '../' + VIRTUAL_DIRECTORY + 'FluctuacionCostosLDI/ExportarReporte',
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
                                id: 'grdFluctuacionCambiariaLDI',
                                flex: 1,
                                width: '100%',
                                height: 210,
                                columnLines: true,
                                store: store_BuscarFluctuacionCambiariaLDI,
                                pagesize: 1,
                                scrollable: true,
                                bbar: paginador,
                                renderTo: Ext.getBody(),
                                selectable: {
                                    columns: false, // Can select cells and rows, but not columns
                                    extensible: true // Uses the draggable selection extender
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
                                    //nombreAcreedorSAP
                                    {
                                        xtype: 'gridcolumn', text: "Nombre Acreedor", dataIndex: 'nombreAcreedorSAP', sortable: true, locked: false, align: 'center', resizable: true,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('nombreAcreedorSAP');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txtnombreAcreedorSAP",
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
                                                            property: 'nombreAcreedorSAP',
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
                                    //codigoAcreedor
                                    {
                                        xtype: 'gridcolumn', text: "Acreedor", dataIndex: 'codigoAcreedor', sortable: true, locked: false, align: 'center', resizable: true, width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('codigoAcreedor');
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
                                                            property: 'codigoAcreedor',
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'estatus',
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
                                                    store_BuscarFluctuacionCambiariaLDI.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarFluctuacionCambiariaLDI.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarFluctuacionCambiariaLDI.filter({
                                                            property: 'cuenta_Fluctuacion',
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
                                ]
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grdTotalesFluctuacionCambiariaLDI',
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

    var lectura = ["cmbPeriodo", "btnBuscar", "btnExportar", "grdTotalesFluctuacionCambiariaLDI", "grdFluctuacionCambiariaLDI"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('FluctuacionCostosLDI', lectura, nuevo, editar, eliminar, 'log');


})