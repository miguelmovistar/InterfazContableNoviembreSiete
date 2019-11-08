
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
    var periodo;
    var texto = "Código Acreedor";

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
                { name: 'Periodo', mapping: 'Periodo' }
            ]
        });

    Ext.define('modeloConsulta',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'settlementDate', mapping: 'settlementDate' },
                { name: 'myPMN', mapping: 'myPMN' },
                { name: 'VRSFCMTSRH', mapping: 'VRSFCMTSRH' },
                { name: 'codigoAcreedor', mapping: 'codigoAcreedor' },
                { name: 'theirPMN', mapping: 'theirPMN' },
                { name: 'operatorName', mapping: 'operatorName' },
                { name: 'rapFileName', mapping: 'rapFileName' },
                { name: 'rapFileAvailableTimeStamp', mapping: 'rapFileAvailableTimeStamp' },
                { name: 'rapStatus', mapping: 'rapStatus' },
                { name: 'rapFileType', mapping: 'rapFileType' },
                { name: 'rapAdjustmentIndicator', mapping: 'rapAdjustmentIndicator' },
                { name: 'tapFileType', mapping: 'tapFileType' },
                { name: 'tapFileName', mapping: 'tapFileName' },
                { name: 'callType', mapping: 'callType' },
                { name: 'numberCalls', mapping: 'numberCalls' },
                { name: 'totalRealVolume', mapping: 'totalRealVolume' },
                { name: 'totalChargedVolume', mapping: 'totalChargedVolume' },
                { name: 'realDuration', mapping: 'realDuration' },
                { name: 'chargedDuration', mapping: 'chargedDuration' },
                { name: 'chargesTaxesSDR', mapping: 'chargesTaxesSDR' },
                { name: 'taxes', mapping: 'taxes' },
                { name: 'totalCharges', mapping: 'totalCharges' },
                { name: 'chargesTaxesLC', mapping: 'chargesTaxesLC' },
                { name: 'taxesLocalCurrency1', mapping: 'taxesLocalCurrency1' },
                { name: 'taxesLocalCurrency2', mapping: 'taxesLocalCurrency2' },
                { name: 'totalChargesLC', mapping: 'totalChargesLC' },
                { name: 'callDate', mapping: 'callDate' }
            ]
        });

    var storeLlenaFecha = Ext.create('Ext.data.Store', {
        model: 'modeloFecha',
        storeId: 'idstore_LlenaFecha',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DatosROM/LlenaFecha?lineaNegocio=' + lineaNegocio,
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
            url: '../' + VIRTUAL_DIRECTORY + 'DatosROM/Consulta',
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
        margin: '0 0 0 0',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:20px';>Datos Tráfico ROAMING</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: "50%",
                margin: '0 0 0 10'
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '100%',
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                items: [
                    {
                        xtype: 'combobox',
                        name: 'cmbFecha',
                        id: 'cmbFecha',
                        store: storeLlenaFecha,
                        queryMode: 'remote',
                        valueField: 'Periodo',
                        displayField: 'Periodo',
                        fieldLabel: "Fecha",
                        width: '25%',
                        margin: '5 0 0 55',
                        allowBlank: false,
                        editable: false,
                        blankText: "El campo Fecha es requerido",
                        msgTarget: 'under',
                        maxLength: 100,
                        enforceMaxLength: true,
                        labelWidth: 40
                    },
                    {
                        xtype: 'button',
                        id: 'btnConsulta',
                        margin: '0 0 0 50',
                        html: "<button class='btn btn-primary' style='outline:none'>Consulta Datos</button>",
                        border: false,
                        handler: function () {
                            periodo = Ext.getCmp('cmbFecha').value;
                            if (periodo == null || periodo == "")
                                return;

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
                            
                            var grp = Ext.getCmp('settlementDate');
                            grp.setWidth(100);  
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
                                    url: '../' + VIRTUAL_DIRECTORY + 'DatosROM/Exportar',
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
                columnLines: true,
                scrollable: true,
                bbar: paginador,
                columns: [
                    {
                        xtype: "gridcolumn", align: 'right', id: 'settlementDate', sortable: true, dataIndex: 'settlementDate', text: "Settlement Date", width: 95,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('settlementDate');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSettlementDate',
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
                                            property: 'settlementDate',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'myPMN', text: "My PMN (TADIG) Code", width: 125,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('myPMN');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txMyPMN',
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
                                            property: 'myPMN',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'VRSFCMTSRH', text: "VRSFC - MTSRH", width: 95,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('VRSFCMTSRH');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txVRSFCMTSRH',
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
                                            property: 'VRSFCMTSRH',
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
                        xtype: "gridcolumn", sortable: true, align: 'right', dataIndex: 'codigoAcreedor', text: "Código Deudor/Acreedor", width: 135,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txcodigoAcreedor',
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
                                            property: 'codigoAcreedor',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'theirPMN', text: "Their PMN (TADIG) Code", width: 135,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtheirPMN',
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
                                            property: 'theirPMN',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'operatorName', text: "Their Operator Name", width: 120,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txOperatorName',
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
                                            property: 'operatorName',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'rapFileName', width: 90, text: "RAP File Name",
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
                                            property: 'rapFileName',
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
                        xtype: "numbercolumn", format: '0', align: 'rigth', sortable: true, dataIndex: 'rapFileAvailableTimeStamp', width: 160, text: "RAP File Available Time Stamp",

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
                                            property: 'rapFileAvailableTimeStamp',
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
                        xtype: "numbercolumn", format: '0.00', align: 'right', sortable: true, dataIndex: 'rapStatus', width: 70, text: "RAP Status",

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
                                            property: 'rapStatus',
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
                        xtype: "numbercolumn", format: '0.00', align: 'right', sortable: true, dataIndex: 'rapFileType', width: 80, text: "RAP File Type",

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
                                            property: 'rapFileType',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'rapAdjustmentIndicator', width: 135, text: "RAP Adjustment Indicator",

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
                                            property: 'rapAdjustmentIndicator',
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
                        xtype: "gridcolumn", sortable: true, align: 'right', dataIndex: 'tapFileType', with: 70, text: "TAP File Type",
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
                                            property: 'tapFileType',
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
                        xtype: "gridcolumn", sortable: true, align: 'right', dataIndex: 'tapFileName', width: 120, text: "TAP File Name",

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
                                            property: 'tapFileName',
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
                        xtype: "gridcolumn", align: 'right', sortable: true, dataIndex: 'callType', width: 70, text: "Call Type",

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
                                            property: 'callType',
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
                        xtype: "numbercolumn", sortable: true, format: '0', align: 'right', dataIndex: 'numberCalls', width: 100, text: "Number of Calls",

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
                                            property: 'numberCalls',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'totalRealVolume', width: 125, text: "Total Real Volume (MB)",
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
                                            property: 'totalRealVolume',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'totalChargedVolume', width: 145, text: "Total Charged Volume (MB)",

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
                                            property: 'totalChargedVolume',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'realDuration', width: 125, text: "Real Duration (Minutes)",

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
                                            property: 'realDuration',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'chargedDuration', width: 150, text: "Charged Duration (Minutes)",

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
                                            property: 'chargedDuration',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'chargesTaxesSDR', width: 135, text: "Charges w/o Taxes (SDR)",

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
                                            property: 'chargesTaxesSDR',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'taxes', width: 85, text: "Taxes (SDR)",

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
                                            property: 'taxes',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'totalCharges', width: 120, text: "Total Charges (SDR)",

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
                                            property: 'totalCharges',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'chargesTaxesLC', width: 190, text: "Charges w/o Taxes (Local Currency)",

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
                                            property: 'chargesTaxesLC',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'taxesLocalCurrency1', width: 128, text: "Taxes (Local Currency)",

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
                                            property: 'taxesLocalCurrency1',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'taxesLocalCurrency2', width: 128, text: "Taxes (Local Currency)",

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
                                            property: 'taxesLocalCurrency2',
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
                        xtype: "gridcolumn", sortable: true, format: '0.000000', align: 'right', dataIndex: 'totalChargesLC', width: 165, text: "Total Charges (Local Currency)",

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
                                            property: 'totalChargesLC',
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
                        xtype: "numbercolumn", sortable: true, align: 'left', dataIndex: 'callDate', width: 95, text: "Call Date",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('callDate');
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
                                    storeConsulta.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        storeConsulta.load({ params: { start: 0, limit: 100000 } });
                                        storeConsulta.filter({
                                            property: 'callDate',
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
        renderTo: Body,
        bodyStyle: { "background-color": "#E6E6E6" }
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 255);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        panel.doComponentLayout();
    });

    var lectura = ["grid", "btnConsulta"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('DatosROM', lectura, nuevo, editar, eliminar, 'log');


});