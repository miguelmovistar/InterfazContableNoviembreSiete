/*Nombre:Data Ingreso JS
*Creado por:
*Fecha:
*Descripcion: Data Ingreso JS
*Ultima Fecha de modificación: 7/14/2019
* Ivan Adrian Rios Sandoval
*/
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

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Month', mapping: 'Month' },
                { name: 'Currency', mapping: 'Currency' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'grupo', mapping: 'grupo' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'Segundos', mapping: 'Segundos' },
                { name: 'Llamadas', mapping: 'Llamadas' },
                { name: 'Importe_Ingreso', mapping: 'Importe_Ingreso' },
                { name: 'TarifaEXT', mapping: 'TarifaEXT' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'MinFact', mapping: 'MinFact' },
                { name: 'cantidad', mapping: 'cantidad' },
                { name: 'Movimiento', mapping: 'Movimiento' },
                { name: 'fecha_proceso', mapping: 'fecha_proceso' },
                { name: 'fecha_contable', mapping: 'fecha_contable' },
                { name: 'no_factura_referencia', mapping: 'no_factura_referencia' },
                { name: 'monto_facturado', mapping: 'monto_facturado' },
                { name: 'iva', mapping: 'iva' },
                { name: 'sobrecargo', mapping: 'sobrecargo' }
            ]
        });

    Ext.define('modeloTrafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_trafico', mapping: 'id_trafico' },
                { name: 'trafico', mapping: 'trafico' }

            ]
        });

    Ext.define('modeloDeudor',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'clave', mapping: 'clave' },
                { name: 'nombre', mapping: 'nombre' }

            ]
        });

    Ext.define('modeloPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'periodo', mapping: 'periodo' },
                { name: 'valor', mapping: 'valor' }

            ]
        });

    var storeLlenaGrid = Ext.create('Ext.data.Store', {
        model: 'modelo',
        autoLoad: false,
        totalProperty: 'totalCount',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DataIngreso/llenaGrid',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'

            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        },
        listeners: {
            load: function () {
                var panels = Ext.ComponentQuery.query('#pnl_dataIngreso');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var pagSize = Ext.create('Ext.data.Store', {
        fields: ['id', 'size'],
        data: [
            { "id": "1", "size": "5" },
            { "id": "1", "size": "10" },
            { "id": "2", "size": "20" },
            { "id": "3", "size": "30" },
            { "id": "4", "size": "40" }
        ]
    });

    var storePeriodo = Ext.create('Ext.data.Store', {
        model: 'modeloPeriodo',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DataIngreso/llenaPeriodo',
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

    var storeLlenaTrafico = Ext.create('Ext.data.Store', {
        model: 'modeloTrafico',
        storeId: 'idstore_llenaTrafico',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DataIngreso/llenaTrafico?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaDeudor = Ext.create('Ext.data.Store', {
        model: 'modeloDeudor',
        storeId: 'idstore_llenaDeudorAcreedor',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DataIngreso/llenaDeudor?lineaNegocio=' + lineaNegocio,
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

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: storeLlenaGrid,
        displayInfo: true,
        displayMsg: 'Ingresos {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
        listeners: {
            beforechange: function () {
                this.getStore().getProxy().extraParams.trafico = Ext.getCmp('cmbTrafico1').value;
                this.getStore().getProxy().extraParams.deudor = Ext.getCmp('cmbDeudor').value;
                this.getStore().getProxy().extraParams = extraParams;
            }
        },
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
                        storeLlenaGrid.pageSize = cuenta;
                        storeLlenaGrid.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_dataIngreso',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Data Ingresos</div><br/>",
                border: false,
                margin: '0 0 0 10',
                width: '100%',
                height: 35
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '50%',
                border: false,
                margin: '0 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none'  class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            window.location.reload();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        html: "<button class='btn btn-primary' style='outline:none'>Limpiar</button>",
                        border: false,
                        handler: function () {

                            Ext.getCmp('cmbPeriodo').clearValue();
                            Ext.getCmp('cmbTrafico1').clearValue();
                            Ext.getCmp('cmbDeudor').clearValue();

                        }
                    },

                ]

            },

            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                renderTo: document.body,
                height: 400,
                frame: false,
                items: [
                    {
                        title: 'Criterios de búsqueda',
                        items: [
                            {
                                xtype: 'fieldset',
                                layout: { type: 'hbox' },
                                border: false,
                                height: 45,
                                items:
                                    [
                                        {
                                            xtype: 'fieldset',
                                            layout: { type: 'vbox' },
                                            border: false,
                                            items: [
                                                {
                                                    html: "<div style='font-size:15px';>Periodo contable</div><br/>",
                                                    margin: '5 0 0 40',
                                                    border: 0,
                                                    height: 18
                                                },
                                                {
                                                    xtype: 'combo',
                                                    margin: '0 0 0 40',
                                                    store: storePeriodo,
                                                    displayField: 'periodo',
                                                    valueField: 'valor',
                                                    id: 'cmbPeriodo',
                                                    editable: false

                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            layout: { type: 'vbox' },
                                            border: false,
                                            items: [
                                                {
                                                    html: "<div style='font-size:15px';>Tráfico</div><br/>",
                                                    margin: '5 0 0 40',
                                                    border: 0,
                                                    height: 18
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    name: 'cmbTrafico1',
                                                    id: 'cmbTrafico1',
                                                    anchor: '100%',
                                                    margin: '0 0 0 40',
                                                    store: storeLlenaTrafico,
                                                    tpl: Ext.create('Ext.XTemplate',
                                                        '<tpl for=".">',
                                                        '<div class="x-boundlist-item">{id_trafico}</div>',
                                                        '</tpl>'
                                                    ),
                                                    displayTpl: Ext.create('Ext.XTemplate',
                                                        '<tpl for=".">',
                                                        '{id_trafico}',
                                                        '</tpl>'
                                                    ),
                                                    valueField: 'id_trafico',
                                                    renderTo: Ext.getBody(),
                                                    blankText: "El campo Tráfico es requerido",
                                                    msgTarget: 'under',
                                                    editable: false
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            layout: { type: 'vbox' },
                                            border: false,
                                            items: [
                                                {
                                                    html: "<div style='font-size:15px';>Deudor</div><br/>",
                                                    margin: '5 0 0 40',
                                                    border: 0,
                                                    height: 18
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    name: 'cmbDeudor',
                                                    id: 'cmbDeudor',
                                                    anchor: '100%',
                                                    margin: '0 0 0 40',
                                                    store: storeLlenaDeudor,
                                                    tpl: Ext.create('Ext.XTemplate',
                                                        '<tpl for=".">',
                                                        '<div class="x-boundlist-item">{clave} - {nombre}</div>',
                                                        '</tpl>'
                                                    ),
                                                    displayTpl: Ext.create('Ext.XTemplate',
                                                        '<tpl for=".">',
                                                        '{clave} - {nombre}',
                                                        '</tpl>'
                                                    ),
                                                    valueField: 'clave',
                                                    renderTo: Ext.getBody(),
                                                    msgTarget: 'under',
                                                    editable: false,
                                                    blankText: "El campo Deudor es requerido"
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            layout: { type: 'vbox' },
                                            border: false,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    id: 'btnBuscar',
                                                    border: false,
                                                    margin: '10 0 0 20',
                                                    html: "<div class=btn-group>" +
                                                        "<button class='btn btn-primary' style='outline:none'>Buscar</button></div>",
                                                    handler: function () {
                                                        storeLlenaGrid.getProxy().extraParams.DeudorCol = storeLlenaGrid.getProxy().extraParams.Deudor;
                                                        storeLlenaGrid.getProxy().extraParams.TraficoCol = storeLlenaGrid.getProxy().extraParams.Trafico;

                                                        storeLlenaGrid.getProxy().extraParams.periodo = Ext.getCmp('cmbPeriodo').value;
                                                        storeLlenaGrid.getProxy().extraParams.trafico = Ext.getCmp('cmbTrafico1').value;
                                                        storeLlenaGrid.getProxy().extraParams.deudor = Ext.getCmp('cmbDeudor').value;

                                                        storeLlenaGrid.load();
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                            },
                            {
                                xtype: 'grid',
                                store: storeLlenaGrid,
                                margin: '3 0 0 0',
                                id: 'grid',
                                height: 250,
                                autoScroll: true,
                                bbar: paginador,
                                selModel:
                                {
                                    selType: 'checkboxmodel',
                                    listeners:
                                    {
                                        selectionchange: function (selected, eOpts) {
                                        }
                                    }
                                },
                                columns: [

                                    //Fecha contable
                                    {
                                        xtype: 'gridcolumn', text: "Fecha Proceso", dataIndex: 'fecha_contable', sortable: true, locked: false, align: 'center', width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fecha_contable');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txSociedad",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }

                                            }
                                        }
                                    },
                                    //Fecha proceso
                                    {
                                        xtype: 'gridcolumn', text: "Fecha Contable", dataIndex: 'fecha_proceso', sortable: true, locked: false, align: 'center', width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fecha_proceso');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txSentido",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Month
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Month', locked: false, text: "Mes Consumo", align: 'center', width: "8%",
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Movimiento
                                    {
                                        xtype: 'gridcolumn', text: "Movimiento", dataIndex: 'Movimiento', sortable: true, locked: false, align: 'center', width: "8%",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Movimiento');
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
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Moneda
                                    {
                                        xtype: 'gridcolumn', text: "Moneda", dataIndex: 'Currency', sortable: true, locked: false, align: 'center', resizable: true, width: 80,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Currency');
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
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Servicio
                                    {
                                        xtype: 'gridcolumn', text: "Servicio", dataIndex: 'Servicio', width: "8%", sortable: true, locked: false, align: 'center',
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
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Grupo
                                    {
                                        xtype: 'gridcolumn', text: "Grupo Operador", dataIndex: 'grupo', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('grupo');
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
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Operador
                                    {
                                        xtype: 'gridcolumn', text: "Operador", dataIndex: 'Operador', width: "8%", sortable: true, locked: false, align: 'center', align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Operador');
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
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Deudor
                                    {
                                        xtype: 'gridcolumn', text: "Deudor", dataIndex: 'Deudor', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Deudor');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txDeudor",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() {
                                                        c.up('gridpanel').getStore().getProxy().extraParams.DeudorCol = c.value;
                                                        campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams);
                                                    }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Tráfico
                                    {
                                        xtype: 'gridcolumn', text: "Tráfico", dataIndex: 'Trafico', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Trafico');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txTrafico",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() {
                                                        c.up('gridpanel').getStore().getProxy().extraParams.TraficoCol = c.value;
                                                        campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams);
                                                    }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Segundos
                                    {
                                        xtype: 'gridcolumn', text: "Segundos", dataIndex: 'Segundos', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Segundos');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txSegundos",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Min fact
                                    {
                                        xtype: 'gridcolumn', text: "Min. Fact.", dataIndex: 'MinFact', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('MinFact');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txMinutos",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Tarifa Ext.
                                    {
                                        xtype: 'gridcolumn', text: "Tarifa. Ext.", dataIndex: 'TarifaEXT', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('TarifaEXT');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txTarifa",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Llamadas
                                    {
                                        xtype: 'gridcolumn', text: "Llamadas", dataIndex: 'Llamadas', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('Llamadas');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txLlamadas",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Cantidad
                                    {
                                        xtype: 'gridcolumn', text: "Cantidad", dataIndex: 'cantidad', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('cantidad');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txCantidad",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Importe ingreso
                                    {
                                        xtype: 'gridcolumn', text: "Importe", dataIndex: 'Importe_Ingreso', width: "8%", sortable: true, locked: false, align: 'center',
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('Importe_Ingreso'), "0.00");
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txImporte",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    ////
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'no_factura_referencia', width: "10%", locked: false, align: 'center', text: "No. Factura / Referencia",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('no_factura_referencia');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: 'txno_factura_referencia',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'monto_facturado', width: "8%", locked: false, align: 'center', text: "Monto Facturado",
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('monto_facturado'), "0.00");
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: 'txmonto_facturado',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'sobrecargo', width: "8%", locked: false, align: 'center', text: "Sobrecargo",
                                        renderer: function (v, cellValues, rec) {
                                            return Ext.util.Format.number(rec.get('sobrecargo'), "0.00");
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: 'txsobrecargo',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);

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
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 255);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        panel.doComponentLayout();
    });

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;


    var lectura = ["grid", "cmbPeriodo", "cmbTrafico1", "cmbDeudor", "btnBuscar"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('DataIngreso', lectura, nuevo, editar, eliminar, 'log');




});
