Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();

    var BanderaConcepto, NumeroProvision, IdOperador, Concepto, Grupo, Deudor, MontoProvision;
    var Moneda, Periodo, Tipo, NumeroDocumentoSap, FolioDocumento, TipoCambioProvision, ImporteMxn;
    var ImporteFactura, DiferenciaProvisionFactura, TipoCambioFactura, ExcesoProvisionMxn, InsuficienciaProvisionMxn;
    var FechaConsumo, TipoCambio, MontoFacturado;

    Ext.define('ModeloPeriodo', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Id', mapping: 'Id' },
            { name: 'Periodo', mapping: 'Periodo' },
            { name: 'Fecha', mapping: 'Fecha' }
        ]
    });

    var _storeperiodo = Ext.create('Ext.data.Store', {
        model: 'ModeloPeriodo',
        storeId: 'StorePeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY +  'RoamingCancelacionIngreso/LlenaPeriodo?lineaNegocio=' + 1,
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

    Ext.define('Modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'BanderaConcepto', mapping: 'BanderaConcepto' },
                { name: 'NumeroProvision', mapping: 'NumeroProvision' },
                { name: 'FechaContable', mapping: 'FechaContable' },
                { name: 'IdOperador', mapping: 'IdOperador' },
                { name: 'Concepto', mapping: 'Concepto' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'MontoProvision', mapping: 'MontoProvision' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Tipo', mapping: 'Tipo' },
                { name: 'NumeroDocumentoSap', mapping: 'NumeroDocumentoSap' },
                { name: 'FolioDocumento', mapping: 'FolioDocumento' },
                { name: 'TipoCambioProvision', mapping: 'TipoCambioProvision' },
                { name: 'ImporteMxn', mapping: 'ImporteMxn' },
                { name: 'ImporteFactura', mapping: 'ImporteFactura' },
                { name: 'DiferenciaProvisionFactura', mapping: 'DiferenciaProvisionFactura' },
                { name: 'TipoCambioFactura', mapping: 'TipoCambioFactura' },
                { name: 'ExcesoProvisionMxn', mapping: 'ExcesoProvisionMxn' },
                { name: 'InsuficienciaProvisionMxn', mapping: 'InsuficienciaProvisionMxn' },
                { name: 'FechaConsumo', mapping: 'FechaConsumo' },
                { name: 'TipoCambio', mapping: 'TipoCambio' },
                { name: 'MontoFacturado', mapping: 'MontoFacturado' }
            ]
        });

    var _storebuscar = Ext.create('Ext.data.Store', {
        model: 'Modelo',
        storeId: 'Store',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'RoamingCancelacionIngreso/LlenaGrid?lineaNegocio=1',
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

    var _pagingtoolbar = new Ext.PagingToolbar({
        id: '_pagingtoolbar',
        store: _storebuscar,
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
                store: _pagesize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        _storebuscar.pageSize = cuenta;
                        _storebuscar.load();
                    }
                }
            }
        ]
    });

    var _pagesize = Ext.create('Ext.data.Store', {
        fields: ['id', 'size'],
        data: [
            { "id": "1", "size": "5" },
            { "id": "2", "size": "10" },
            { "id": "3", "size": "20" },
            { "id": "4", "size": "30" },
            { "id": "5", "size": "40" }
        ]
    });


    // Panel.Botones
    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {   // Encabezado
                html: "<div style='font-size:25px';>Cancelación Ingreso</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },

            { // Panel de Busqueda
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 500,
                renderTo: document.body,
                frame: false,
                items: [
                    {   // Nombre Pestaña
                        title: 'Criterios de búsqueda',
                        border: false,
                        items: [
                            {   // Columna Desde
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
                                                store: _storeperiodo,
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
                                    {   // Columna Boton Buscar
                                        xtype: 'button',
                                        html: "<button class='btn btn-primary' style='font-size:13px;'>Buscar</button>",
                                        id: 'btnResultados',
                                        margin: '5 0 0 0',
                                        handler: function () {
                                            var periodo = Ext.getCmp('cmbPeriodoC').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }

                                            var store = Ext.StoreManager.lookup('Store');
                                            store.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodoC').value;
                                            store.load();
                                        },
                                    }
                                ]
                            },
                            {   // Filas del Grid
                                xtype: 'gridpanel',
                                id: '_grid',
                                flex: 1,
                                store: _storebuscar,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: _pagingtoolbar,
                                selModel:
                                {
                                    selType: 'checkboxmodel', // Agrega los check para seleccionar
                                    listeners:
                                    {
                                        selectionchange: function (selected, eOpts) {
                                            if (eOpts.length == 1) {
                                                id = eOpts[0].data.Id;
                                                ano = eOpts[0].data.ano;
                                                fechaContable = eOpts[0].data.fechaContable;
                                                fechaContableR = eOpts[0].data.fechaContableR;
                                                fechaConsumo = eOpts[0].data.fechaConsumo;
                                                fechaConsumoR = eOpts[0].data.fechaConsumoR;
                                                compania = eOpts[0].data.compania;
                                                idServicio = eOpts[0].data.idServicio;
                                                servicio = eOpts[0].data.servicio;
                                            }
                                            habilitarDeshabilitar();
                                        }
                                    }
                                },
                                columns: [
                                    // BanderaConcepto
                                    {
                                        xtype: "gridcolumn", sortable: true, id: "BanderaConcepto", dataIndex: 'BanderaConcepto', text: "Bandera", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('BanderaConcepto');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'BanderaConcepto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna NumeroProvision
                                        xtype: "gridcolumn", sortable: true, id: "NumeroProvision", dataIndex: 'NumeroProvision', text: "No. Provisión", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('NumeroProvision');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'NumeroProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna Fecha Contable
                                        xtype: "gridcolumn", sortable: true, id: "FechaContable", dataIndex: 'FechaContable', text: "Fecha Contable", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('FechaContable');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'FechaContable',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna IdOperador
                                        xtype: "gridcolumn", sortable: true, id: "IdOperador", dataIndex: 'IdOperador', text: "IdOperador", width: 55,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('IdOperador');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'IdOperador',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    // Concepto
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Concepto', text: "Concepto", width: 240,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Concepto');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Concepto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna Grupo
                                        xtype: "gridcolumn", sortable: true, id: "Grupo", dataIndex: 'Grupo', text: "Grupo", width: 120,
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Grupo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna Deudor
                                        xtype: "gridcolumn", sortable: true, id: "Deudor", dataIndex: 'Deudor', text: "Deudor", width: 120, align: 'right',
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Deudor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna MontoProvision
                                        xtype: "gridcolumn", sortable: true, id: "MontoProvision", dataIndex: 'MontoProvision', text: "Monto Provisión", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('MontoProvision');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'MontoProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna Moneda
                                        xtype: "gridcolumn", sortable: true, id: "Moneda", dataIndex: 'Moneda', text: "Moneda", width: 55, align: 'left',
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    // Periodo
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Periodo', text: "Periodo", width: 90, width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Periodo');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Periodo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna Tipo
                                        xtype: "gridcolumn", sortable: true, id: "Tipo", dataIndex: 'Tipo', text: "Tipo", width: 240,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Tipo');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Tipo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna NumeroDocumentoSap
                                        xtype: "gridcolumn", sortable: true, id: "NumeroDocumentoSap", dataIndex: 'NumeroDocumentoSap', text: "No. Documento SAP", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('NumeroDocumentoSap');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'NumeroDocumentoSap',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna FolioDocumento
                                        xtype: "gridcolumn", sortable: true, id: "FolioDocumento", dataIndex: 'FolioDocumento', text: "Folio Documento", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('FolioDocumento');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'FolioDocumento',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna TipoCambioProvision
                                        xtype: "gridcolumn", sortable: true, id: "TipoCambioProvision", dataIndex: 'TipoCambioProvision', text: "Tipo Cambio Provisión", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('TipoCambioProvision');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'TipoCambioProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna ImporteMxn
                                        xtype: "gridcolumn", sortable: true, id: "ImporteMxn", dataIndex: 'ImporteMxn', text: "Importe MXN", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('ImporteMxn');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'ImporteMxn',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna ImporteFactura
                                        xtype: "gridcolumn", sortable: true, id: "ImporteFactura", dataIndex: 'ImporteFactura', text: "Importe Factura", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('ImporteFactura');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'ImporteFactura',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna TipoCambio
                                        xtype: "gridcolumn", sortable: true, id: "TipoCambio", dataIndex: 'TipoCambio', text: "Tipo Cambio Factura", width: 120, align: 'right',
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'TipoCambio',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna DiferenciaProvisionFactura
                                        xtype: "gridcolumn", sortable: true, id: "DiferenciaProvisionFactura", dataIndex: 'DiferenciaProvisionFactura', text: "Difer. Provisión Fact.", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('DiferenciaProvisionFactura');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'DiferenciaProvisionFactura',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna TipoCambioFactura
                                        xtype: "gridcolumn", sortable: true, id: "TipoCambioFactura", dataIndex: 'TipoCambioFactura', text: "TipoCambioFactura", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('TipoCambioFactura');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'TipoCambioFactura',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna ExcesoProvisionMxn
                                        xtype: "gridcolumn", sortable: true, id: "ExcesoProvisionMxn", dataIndex: 'ExcesoProvisionMxn', text: "Exceso Provisión MXN", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('ExcesoProvisionMxn');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'ExcesoProvisionMxn',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna InsuficienciaProvisionMxn
                                        xtype: "gridcolumn", sortable: true, id: "InsuficienciaProvisionMxn", dataIndex: 'InsuficienciaProvisionMxn', text: "Insuf. Provisión MXN", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('InsuficienciaProvisionMxn');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'InsuficienciaProvisionMxn',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    { // Columna FechaConsumo
                                        xtype: "gridcolumn", sortable: true, id: "FechaConsumo", dataIndex: 'FechaConsumo', text: "Fecha Consumo Tarifa", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('FechaConsumo');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'FechaConsumo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    
                                    { // Columna MontoFacturado
                                        xtype: "gridcolumn", sortable: true, id: "MontoFacturado", dataIndex: 'MontoFacturado', text: "Monto Facturado Tarifa", width: 120, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('MontoFacturado');
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'MontoFacturado',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        _storebuscar.clearFilter();
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
        panel.setSize(w - 15, h - 230);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 230);
        panel.doComponentLayout();
    });

})


