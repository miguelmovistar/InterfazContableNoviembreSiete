Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();

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
            url: '../' + VIRTUAL_DIRECTORY + 'RoamingDocumentoIngreso/LlenaPeriodo?lineaNegocio=' + 1,
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
                { name: 'Anio', mapping: 'Anio' },
                { name: 'FechaContable', mapping: 'FechaContable' },
                { name: 'FechaConsumo', mapping: 'FechaConsumo' },
                { name: 'Compania', mapping: 'Compania' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'IdOperador', mapping: 'IdOperador' },
                { name: 'NombreOperador', mapping: 'NombreOperador' },
                { name: 'Acreedor', mapping: 'Acreedor' },
                { name: 'Material', mapping: 'Material' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'Iva', mapping: 'Iva' },
                { name: 'PorcentajeIva', mapping: 'PorcentajeIva' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Minutos', mapping: 'Minutos' },
                { name: 'Tarifa', mapping: 'Tarifa' },
                { name: 'Monto', mapping: 'Monto' },
                { name: 'MontoFacturado', mapping: 'MontoFacturado' },
                { name: 'FechaFactura', mapping: 'FechaFactura' },
                { name: 'FolioDocumento', mapping: 'FolioDocumento' },
                { name: 'TipoCambio', mapping: 'TipoCambio' },
                { name: 'MontoMxn', mapping: 'MontoMxn' },
                { name: 'CuentaContable', mapping: 'CuentaContable' },
                { name: 'ClaseDocumento', mapping: 'ClaseDocumento' },
                { name: 'ClaseDocumentoSap', mapping: 'ClaseDocumentoSap' },
                { name: 'NumeroDocumentoSap', mapping: 'NumeroDocumentoSap' }
            ]
        });

    var _storebuscar = Ext.create('Ext.data.Store', {
        model: 'Modelo',
        storeId: 'Store',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'RoamingDocumentoIngreso/LlenaGrid?lineaNegocio=1',
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
                html: "<div style='font-size:25px';>Documentos Ingreso</div><br/>",
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
                            {   // Panel de Criterios
                                xtype: 'panel',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                width: '100%',
                                layout: 'column',
                                items: [
                                    {   // Filtro Periodo
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
                                        margin: '5 -100 0 0',
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
                                    selType: 'checkboxmodel',
                                    listeners:
                                    {

                                    }
                                },
                                columns: [
                                    { // Columna Anio
                                        xtype: "gridcolumn", sortable: true, id: "Anio", dataIndex: 'Anio', text: "Año", width: 55,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Anio');
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
                                                            property: 'Anio',
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
                                    { // Columna FechaContable
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
                                    { // Columna FechaConsumo
                                        xtype: "gridcolumn", sortable: true, id: "FechaConsumo", dataIndex: 'FechaConsumo', text: "Fecha Consumo", width: 120,
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
                                    { // Columna Compania
                                        xtype: "gridcolumn", sortable: true, id: "Compania", dataIndex: 'Compania', text: "Compañía", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Compania');
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
                                                            property: 'Compania',
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
                                    { // Columna Servicio
                                        xtype: "gridcolumn", sortable: true, id: "Servicio", dataIndex: 'Servicio', text: "Servicio", width: 75,
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
                                                    _storebuscar.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        _storebuscar.load({ params: { start: 0, limit: 100000 } });
                                                        _storebuscar.filter({
                                                            property: 'Servicio',
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
                                        xtype: "gridcolumn", sortable: true, id: "Grupo", dataIndex: 'Grupo', text: "Grupo", width: 75,
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
                                    { // Columna IdOperador
                                        xtype: "gridcolumn", sortable: true, id: "IdOperador", dataIndex: 'IdOperador', text: "Operador", width: 75,
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
                                    { // Columna NombreOperador
                                        xtype: "gridcolumn", sortable: true, id: "NombreOperador", dataIndex: 'NombreOperador', text: "Nombre", width: 240,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('NombreOperador');
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
                                                            property: 'NombreOperador',
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
                                        xtype: "gridcolumn", sortable: true, id: "Deudor", dataIndex: 'Deudor', text: "Deudor", width: 120,
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
                                    { // Columna Material
                                        xtype: "gridcolumn", sortable: true, id: "Material", dataIndex: 'Material', text: "Material", width: 75,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Material');
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
                                                            property: 'Material',
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
                                    { // Columna Trafico
                                        xtype: "gridcolumn", sortable: true, id: "Trafico", dataIndex: 'Trafico', text: "Tráfico", width: 75,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Trafico');
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
                                                            property: 'Trafico',
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
                                    { // Columna Iva
                                        xtype: "gridcolumn", sortable: true, id: "Iva", dataIndex: 'Iva', text: "IVA", width: 55,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Iva');
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
                                                            property: 'Iva',
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
                                    { // Columna PorcentajeIva
                                        xtype: "gridcolumn", sortable: true, id: "PorcentajeIva", dataIndex: 'PorcentajeIva', text: "% IVA", width: 55,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('PorcentajeIva');
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
                                                            property: 'PorcentajeIva',
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
                                        xtype: "gridcolumn", sortable: true, id: "Moneda", dataIndex: 'Moneda', text: "Moneda", width: 55,
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
                                    { // Columna Minutos
                                        xtype: "gridcolumn", sortable: true, id: "Minutos", dataIndex: 'Minutos', text: "Minutos", width: 55,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Minutos');
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
                                                            property: 'Minutos',
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
                                    { // Columna Tarifa
                                        xtype: "gridcolumn", sortable: true, id: "Tarifa", dataIndex: 'Tarifa', text: "Tarifa", width: 55,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Tarifa');
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
                                                            property: 'Tarifa',
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
                                    { // Columna Monto
                                        xtype: "gridcolumn", sortable: true, id: "Monto", dataIndex: 'Monto', text: "Monto", width: 75, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Monto');
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
                                                            property: 'Monto',
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
                                        xtype: "gridcolumn", sortable: true, id: "MontoFacturado", dataIndex: 'MontoFacturado', text: "Monto Facturado", width: 75, align: 'right',
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
                                    },
                                    { // Columna FechaFactura
                                        xtype: "gridcolumn", sortable: true, id: "FechaFactura", dataIndex: 'FechaFactura', text: "Fecha Factura", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('FechaFactura');
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
                                                            property: 'FechaFactura',
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
                                        xtype: "gridcolumn", sortable: true, id: "FolioDocumento", dataIndex: 'FolioDocumento', text: "Folio", width: 240,
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
                                    { // Columna TipoCambio
                                        xtype: "gridcolumn", sortable: true, id: "TipoCambio", dataIndex: 'TipoCambio', text: "Tipo Cambio", width: 75, align: 'right',
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
                                    { // Columna MontoMxn
                                        xtype: "gridcolumn", sortable: true, id: "MontoMxn", dataIndex: 'MontoMxn', text: "Monto MXN", width: 75, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('MontoMxn');
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
                                                            property: 'MontoMxn',
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
                                    { // Columna CuentaContable
                                        xtype: "gridcolumn", sortable: true, id: "CuentaContable", dataIndex: 'CuentaContable', text: "Cuenta Contable", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('CuentaContable');
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
                                                            property: 'CuentaContable',
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
                                    { // Columna ClaseDocumento
                                        xtype: "gridcolumn", sortable: true, id: "ClaseDocumento", dataIndex: 'ClaseDocumento', text: "Clase Docto", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('ClaseDocumento');
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
                                                            property: 'ClaseDocumento',
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
                                    { // Columna ClaseDocumentoSap
                                        xtype: "gridcolumn", sortable: true, id: "ClaseDocumentoSap", dataIndex: 'ClaseDocumentoSap', text: "Clase Docto SAP", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('ClaseDocumentoSap');
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
                                                            property: 'ClaseDocumentoSap',
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
                                        xtype: "gridcolumn", sortable: true, id: "NumeroDocumentoSap", dataIndex: 'NumeroDocumentoSap', text: "Numero Docto SAP", width: 120,
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


