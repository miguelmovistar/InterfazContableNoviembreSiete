
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
    var id;
    var idOperador;
    var entinferior;
    var entsuperior;
    var tarifaent;
    var ingreso;
    var salinferior;
    var salsuperior;
    var tarifasal;
    var costo;
    var ratio;
    var fechainicio;
    var fechafin;
    var idtraficoentrada;
    var idtraficosalida;
    var store;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'EntInferior', mapping: 'EntInferior' },
                { name: 'EntSuperior', mapping: 'EntSuperior' },
                { name: 'TarifaEnt', mapping: 'TarifaEnt' },
                { name: 'Ingreso', mapping: 'Ingreso' },
                { name: 'SalInferior', mapping: 'SalInferior' },
                { name: 'SalSuperior', mapping: 'SalSuperior' },
                { name: 'TarifaSal', mapping: 'TarifaSal' },
                { name: 'Costo', mapping: 'Costo' },
                { name: 'Ratio', mapping: 'Ratio' },
                { name: 'FechaInicio', mapping: 'FechaInicio' },
                { name: 'FechaFin', mapping: 'FechaFin' },
                { name: 'Id_TraficoEntrada', mapping: 'Id_TraficoEntrada' },
                { name: 'Id_TraficoSalida', mapping: 'Id_TraficoSalida' },
                { name: 'DescripcionEntrada', mapping: 'DescripcionEntrada' },
                { name: 'DescripcionSalida', mapping: 'DescripcionSalida' },
                { name: 'Nombre', mapping: 'Nombre' }
            ]
        });

    Ext.define('modeloTrafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Descripcion', mapping: 'Descripcion' }]
        });

    Ext.define('modeloOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Nombre', mapping: 'Nombre' }]
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

    var store_Buscar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_buscar',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#panel_acuerdo_tarifa');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/borrar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

                if (request.proxy.reader.jsonData.success == true) {
                    var grp = Ext.getCmp('grid');
                    var elements = grp.getSelectionModel().getSelection();

                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_Buscar.load();
                }
                else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {

                if (request.proxy.reader.jsonData.result.length != 4) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: request.proxy.reader.jsonData.result,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
                else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                }
                else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_Modificar = Ext.create('Ext.data.Store', {
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/Modificar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

                if (request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se modificó exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    Ext.getCmp('idWin').destroy();
                    store_Buscar.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {

                Ext.MessageBox.show({
                    title: "Notificación",
                    msg: "Ocurrió un error",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/validaModif',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                //var grp = Ext.getCmp('grid');
                //var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == false) {
                    var strMensaje = request.proxy.reader.jsonData.results;
                    if (strMensaje != "") {
                        Ext.Msg.confirm("Confirmación", strMensaje, function (btnVal) {
                            if (btnVal === "yes") {
                                Modificar();
                            }
                        }, this);
                    }
                    else {
                        Modificar();
                    }
                }
                else {
                    Modificar();
                }
            },
            readCallback: function (request) {
                if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                }
                else if (request.proxy.reader.jsonData.results == "not") {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }

            }
        }
    });

    var storeLlenaOperador = Ext.create('Ext.data.Store', {
        model: 'modeloOperador',
        storeId: 'idstore_llenaOperador',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/llenaOperador?lineaNegocio=' + lineaNegocio,
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
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/llenaTrafico?lineaNegocio=' + lineaNegocio,
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
        id: 'ptb_empresa',
        store: store_Buscar,
        displayInfo: true,
        displayMsg: 'Acuerdos {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
        listeners: {
            beforechange: function() {
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
                        store_Buscar.pageSize = cuenta;
                        store_Buscar.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'panel_acuerdo_tarifa',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<h3>Acuerdos</h3>",
                border: false
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '50%',
                border: false,
                items: [
                    {
                        xtype: 'button',
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none'   class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var storeBuscar = Ext.StoreManager.lookup('idstore_buscar');
                            storeBuscar.load();
                            //limpiarFiltros();
                            iBusca = 0;
                            storeBuscar.clearFilter();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnGuardar',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary'  style='outline:none'>Nuevo</button>",
                        handler: function () {
                            Agregar();
                            var store = Ext.StoreManager.lookup('idstore_buscar');
                            store.load();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary'  style='outline:none'>Editar</button>",
                        border: false,
                        margin: '0 0 0 -5',
                        disabled: true,
                        handler: function () {
                            ValidaModificar();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEliminar',
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary'  style='outline:none'>Eliminar</button>",
                        border: false,
                        disabled: true,
                        handler: function () {
                            var strID = "";
                            var grp = Ext.getCmp('grid');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++)
                                strID = strID + rec[i].data.Id + ",";
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s) ? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_Borrar');
                                    store.getProxy().extraParams.strID = strID;
                                    store.load();
                                }
                            });
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
                store: store_Buscar,
                width: '100%',
                height: '100%',
                bbar: paginador,
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                habilitarDeshabilitar("editar");
                                id = eOpts[0].data.Id;
                                idOperador = eOpts[0].data.Id_Operador;
                                operador = eOpts[0].data.Nombre;
                                entinferior = eOpts[0].data.EntInferior;
                                entsuperior = eOpts[0].data.EntSuperior;
                                tarifaent = eOpts[0].data.TarifaEnt;
                                ingreso = eOpts[0].data.Ingreso;
                                salinferior = eOpts[0].data.SalInferior;
                                salsuperior = eOpts[0].data.SalSuperior;
                                tarifasal = eOpts[0].data.TarifaSal;
                                costo = eOpts[0].data.Costo;
                                ratio = eOpts[0].data.Ratio;

                                fechainicio = eOpts[0].data.FechaInicio;
                                fechafin = eOpts[0].data.FechaFin;
                                idtraficoentrada = eOpts[0].data.Id_TraficoEntrada;
                                idtraficosalida = eOpts[0].data.Id_TraficoSalida;

                                traficoEntrada = eOpts[0].data.DescripcionEntrada;
                                traficoSalida = eOpts[0].data.DescripcionSalida;
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombre', flex: 1, locked: false, text: "Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nombre');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txOperador',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'DescripcionEntrada', flex: 1, locked: false, text: "Id Tráfico Ent",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('DescripcionEntrada');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTraficoEnt',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'EntInferior', flex: 1, text: "Ent Inferior", locked: false,

                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txEntInf',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'EntSuperior', flex: 1, locked: false, text: "Ent Superior",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txEntSuperior',
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
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'TarifaEnt', flex: 1, locked: false, text: "Tarifa Ent",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTarifaEnt',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'Ingreso', flex: 1, locked: false, text: "Ingreso",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txIngreso',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'DescripcionSalida', flex: 1, locked: false, text: "Id Tráfico Sal",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('DescripcionSalida');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTraficoSal',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'SalInferior', flex: 1, locked: false, text: "Sal Inferior",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSalInf',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'SalSuperior', flex: 1, locked: false, text: "Sal Superior",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSalSup',
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
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'TarifaSal', flex: 1, locked: false, text: "TarifaSal",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTarfaSal',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'Costo', flex: 1, locked: false, text: "Costo",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCosto',
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
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'Ratio', flex: 1, locked: false, text: "Ratio",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txRatio',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaInicio', with: 200, locked: false, text: "Fecha Inicio",
                        editor: {
                            xtype: 'textfield'
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
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaFin', with: 200, locked: false, text: "Fecha Fin",

                        editor: {
                            xtype: 'textfield'
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

    function Agregar() {
        var frm_agregar = Ext.create('Ext.form.Panel', {
            dockedItems: [
                {
                    xtype: 'panel',
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            border: false,
                            handler: function () {
                                var form = this.up('form').getForm();
                                if (form.wasValid) {
                                    form.submit({
                                        url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoTarifa/agregar',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            //Id_Acuerdo: Ext.getCmp('txtIdAcuerdo').value,
                                            Operador: Ext.getCmp('cmbOperador').value,
                                            TraficoEnt: Ext.getCmp('cmbTraficoEnt').value,
                                            EntInferior: Ext.getCmp('txtEntInferior').value,
                                            EntSuperior: Ext.getCmp('txtEntSuperior').value,
                                            TarifaEnt: Ext.getCmp('txtTarifaEnt').value,
                                            Ingreso: Ext.getCmp('dpIngreso').value,
                                            TraficoSal: Ext.getCmp('cmbTraficoSal').value,
                                            SalInferior: Ext.getCmp('txtSalInferior').value,
                                            SalSuperior: Ext.getCmp('txtSalSuperior').value,
                                            TarifaSal: Ext.getCmp('txtTarifaSal').value,
                                            Costo: Ext.getCmp('dpCosto').value,
                                            Ratio: Ext.getCmp('dpRatio').value,
                                            FechaInicio: Ext.getCmp('dtfechaInicio').value,
                                            FechaFin: Ext.getCmp('dtfechaFin').value,
                                            lineaNegocio: lineaNegocio
                                        },

                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            store_Buscar.load();
                                            var mensaje;
                                            if (data.results == "ok")
                                                mensaje = "Se agregó correctamente";
                                            else {
                                                if (data.rango == false && data.trafico == true)
                                                    mensaje = "Fecha Inicio es MAYOR que Fecha Fin";
                                                else if (data.rango == true && data.trafico == false)
                                                    mensaje = "Tráfico Ent debe ser diferente a Tráfico Sal";
                                                else if (data.rango == false && data.trafico == false)
                                                    mensaje = "Las fechas y los tráficos son incorrectos";
                                            }

                                            win.destroy();
                                            Ext.Msg.show({
                                                title: "Notificación",
                                                msg: mensaje,
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });

                                            console.log(data.results);

                                            if (data.results == "no")
                                                win.destroy();
                                        },
                                        failure: function (forms, action) {
                                            Ext.Msg.show({
                                                title: "Notificación",
                                                msg: "Ocurrió un error",
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                        }
                                    });
                                }
                            }

                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'flsTarifa',
                    items:
                        [
                            //{
                            //    xtype: 'textfield',
                            //    fieldLabel: "Id Acuerdo",
                            //    hidden: true,
                            //    anchor: '100%',
                            //    margin: '5 5 5 5',
                            //    id: "txtIdAcuerdo",
                            //    enfonceMaxLenght: true,
                            //    maxLenght: 20,
                            //    allowBlank: false,
                            //    blankText: 'El campo Id Acuerdo es requerido',
                            //    msgTarget: 'under'
                            //},
                            {
                                xtype: 'combobox',
                                name: 'cmbOperador',
                                id: 'cmbOperador',
                                fieldLabel: "Operador",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaOperador,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Id_Operador} - {Nombre}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Id_Operador} - {Nombre}',
                                    '</tpl>'
                                ),
                                valueField: 'Id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Operador es requerido",
                                msgTarget: 'under',
                                editable: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbTraficoEnt',
                                id: 'cmbTraficoEnt',
                                fieldLabel: "Tráfico Entrada",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaTrafico,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Id_TraficoTR} - {Descripcion}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Id_TraficoTR} - {Descripcion}',
                                    '</tpl>'
                                ),
                                valueField: 'Id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Tráfico es requerido",
                                msgTarget: 'under',
                                editable: false

                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtEntInferior',
                                id: 'txtEntInferior',
                                fieldLabel: "Ent Inferior",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Ent Inferior es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtEntSuperior',
                                id: 'txtEntSuperior',
                                fieldLabel: "Ent Superior",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Ent Superior es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under',
                                listeners:
                                {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtTarifaEnt').value != null && Ext.getCmp('txtTarifaEnt').value != "") {
                                            var ingreso = Ext.getCmp('txtEntSuperior').value * Ext.getCmp('txtTarifaEnt').value;
                                            Ext.getCmp('dpIngreso').setValue(ingreso.toFixed(2));
                                        }
                                        if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "") {
                                            var ratio = Ext.getCmp('txtEntSuperior').value / Ext.getCmp('txtSalSuperior').value;
                                            Ext.getCmp('dpRatio').setValue(ratio.toFixed(6));
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtTarifaEnt',
                                id: 'txtTarifaEnt',
                                fieldLabel: "Tarifa Ent",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Tarifa Ent es requerido",
                                decimalPrecision: 6,
                                msgTarget: 'under',
                                listeners:
                                {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtTarifaEnt').value != null && Ext.getCmp('txtTarifaEnt').value != "") {
                                            var ingreso = Ext.getCmp('txtEntSuperior').value * Ext.getCmp('txtTarifaEnt').value;
                                            Ext.getCmp('dpIngreso').setValue(ingreso.toFixed(2));
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'displayfield',
                                name: 'dpIngreso',
                                id: 'dpIngreso',
                                fieldLabel: "Ingreso",
                                anchor: '100%',
                                margin: '5 5 5 5'
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbTraficoSal',
                                id: 'cmbTraficoSal',
                                fieldLabel: "Tráfico Salida",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaTrafico,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Id_TraficoTR} - {Descripcion}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Id_TraficoTR} - {Descripcion}',
                                    '</tpl>'
                                ),
                                valueField: 'Id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Tráfico es requerido",
                                msgTarget: 'under',
                                editable: false
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtSalInferior',
                                id: 'txtSalInferior',
                                fieldLabel: "Sal Inferior",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Sal Inferior es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtSalSuperior',
                                id: 'txtSalSuperior',
                                fieldLabel: "Sal Superior",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Sal Superior es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under',
                                listeners:
                                {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        if (Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "" && Ext.getCmp('txtTarifaSal').value != null && Ext.getCmp('txtTarifaSal').value != "") {
                                            var costo = Ext.getCmp('txtSalSuperior').value * Ext.getCmp('txtTarifaSal').value;
                                            Ext.getCmp('dpCosto').setValue(costo.toFixed(2));
                                        }
                                        if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "") {
                                            var ratio = Ext.getCmp('txtEntSuperior').value / Ext.getCmp('txtSalSuperior').value;
                                            Ext.getCmp('dpRatio').setValue(ratio.toFixed(6));
                                        }

                                    }
                                }
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtTarifaSal',
                                id: 'txtTarifaSal',
                                fieldLabel: "Tarifa Sal",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Tarifa Sal es requerido",
                                decimalPrecision: 6,
                                msgTarget: 'under',
                                listeners:
                                {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        if (Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "" && Ext.getCmp('txtTarifaSal').value != null && Ext.getCmp('txtTarifaSal').value != "") {
                                            var costo = Ext.getCmp('txtSalSuperior').value * Ext.getCmp('txtTarifaSal').value;
                                            Ext.getCmp('dpCosto').setValue(costo.toFixed(2));
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'displayfield',
                                name: 'dpCosto',
                                id: 'dpCosto',
                                fieldLabel: "Costo",
                                anchor: '100%',
                                margin: '5 5 5 5'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'dpRatio',
                                id: 'dpRatio',
                                fieldLabel: "Ratio",
                                anchor: '100%',
                                margin: '5 5 5 5'
                            },
                            {
                                id: 'dtfechaInicio',
                                name: 'dtfechaInicio',
                                xtype: 'datefield',
                                editable: false,
                                margin: '5 5 5 5',
                                fieldLabel: "Fecha Inicio",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                msgTarget: 'under',
                                format: 'd-m-Y'
                            },
                            {
                                id: 'dtfechaFin',
                                name: 'dtfechaFin',
                                xtype: 'datefield',
                                editable: false,
                                margin: '5 5 5 5',
                                fieldLabel: "Fecha Fin",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                msgTarget: 'under',
                                format: 'd-m-Y'
                            }
                        ]
                }
            ]
        });
        win = Ext.widget('window', {
            id: 'idWin',
            title: "Nuevo",
            closeAction: 'destroy',
            layout: 'fit',
            width: '30%',
            resizable: false,
            modal: true,
            items: frm_agregar
        });
        win.show();
    }

    //inicia funcion modificar
    function Modificar() {
        var frm_modificar = Ext.widget('form', {
            dockedItems: [
                {
                    xtype: 'panel',
                    id: 'tbBarra',
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            border: false,
                            handler: function () {
                                store_Modificar.getProxy().extraParams.Id = id;
                                store_Modificar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                store_Modificar.getProxy().extraParams.TraficoEnt = Ext.getCmp('cmbTraficoEnt').value;
                                store_Modificar.getProxy().extraParams.EntInferior = Ext.getCmp('txtEntInferior').value;
                                store_Modificar.getProxy().extraParams.EntSuperior = Ext.getCmp('txtEntSuperior').value;
                                store_Modificar.getProxy().extraParams.TarifaEnt = Ext.getCmp('txtTarifaEnt').value;
                                store_Modificar.getProxy().extraParams.Ingreso = Ext.getCmp('dpIngreso').value;
                                store_Modificar.getProxy().extraParams.TraficoSal = Ext.getCmp('cmbTraficoSal').value;
                                store_Modificar.getProxy().extraParams.SalInferior = Ext.getCmp('txtSalInferior').value;
                                store_Modificar.getProxy().extraParams.SalSuperior = Ext.getCmp('txtSalSuperior').value;
                                store_Modificar.getProxy().extraParams.TarifaSal = Ext.getCmp('txtTarifaSal').value;
                                store_Modificar.getProxy().extraParams.Costo = Ext.getCmp('dpCosto').value;
                                store_Modificar.getProxy().extraParams.Ratio = Ext.getCmp('dpRatio').value;
                                store_Modificar.getProxy().extraParams.FechaInicio = Ext.getCmp('dtfechaInicio').value;
                                store_Modificar.getProxy().extraParams.FechaFin = Ext.getCmp('dtfechaFin').value;
                                store_Modificar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store_Modificar.load();
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'fls_empresa',
                    width: '100%',
                    border: 0,
                    frame: false,
                    items: [
                        //{
                        //    xtype: 'displayfield',
                        //    fieldLabel: "Id Acuerdo",
                        //    anchor: '100%',
                        //    margin: '5 5 5 5',
                        //    hidden:true,
                        //    value: idAcuerdo
                        //},
                        {
                            xtype: 'combobox',
                            name: 'cmbOperador',
                            id: 'cmbOperador',
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaOperador,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_Operador} - {Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_Operador} - {Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Operador es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: idOperador
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTraficoEnt',
                            id: 'cmbTraficoEnt',
                            fieldLabel: "Tráfico Entrada",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaTrafico,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_TraficoTR} - {Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_TraficoTR} - {Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Tráfico es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: idtraficoentrada
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtEntInferior',
                            id: 'txtEntInferior',
                            fieldLabel: "Ent Inferior",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Ent Inferior es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: entinferior
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtEntSuperior',
                            id: 'txtEntSuperior',
                            fieldLabel: "Ent Superior",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Ent Superior es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: entsuperior,
                            listeners:
                            {
                                change: function (field, newValue, oldValue, eOpts) {
                                    if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtTarifaEnt').value != null && Ext.getCmp('txtTarifaEnt').value != "") {
                                        var ingreso = Ext.getCmp('txtEntSuperior').value * Ext.getCmp('txtTarifaEnt').value;
                                        Ext.getCmp('dpIngreso').setValue(ingreso.toFixed(2));
                                    }
                                    if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "") {
                                        var ratio = Ext.getCmp('txtEntSuperior').value / Ext.getCmp('txtSalSuperior').value;
                                        Ext.getCmp('dpRatio').setValue(ratio.toFixed(6));
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTarifaEnt',
                            id: 'txtTarifaEnt',
                            fieldLabel: "Tarifa Ent",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Tarifa Ent es requerido",
                            decimalPrecision: 6,
                            msgTarget: 'under',
                            value: tarifaent,
                            listeners:
                            {
                                change: function (field, newValue, oldValue, eOpts) {
                                    if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtTarifaEnt').value != null && Ext.getCmp('txtTarifaEnt').value != "") {
                                        var ingreso = Ext.getCmp('txtEntSuperior').value * Ext.getCmp('txtTarifaEnt').value;
                                        Ext.getCmp('dpIngreso').setValue(ingreso.toFixed(2));
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            name: 'dpIngreso',
                            id: 'dpIngreso',
                            fieldLabel: "Ingreso",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: ingreso
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTraficoSal',
                            id: 'cmbTraficoSal',
                            fieldLabel: "Tráfico Salida",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaTrafico,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_TraficoTR} - {Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_TraficoTR} - {Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Tráfico es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: idtraficosalida
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtSalInferior',
                            id: 'txtSalInferior',
                            fieldLabel: "Sal Inferior",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Sal Inferior es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: salinferior
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtSalSuperior',
                            id: 'txtSalSuperior',
                            fieldLabel: "Sal Superior",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Sal Superior es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: salsuperior,
                            listeners:
                            {
                                change: function (field, newValue, oldValue, eOpts) {
                                    if (Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "" && Ext.getCmp('txtTarifaSal').value != null && Ext.getCmp('txtTarifaSal').value != "") {
                                        var costo = Ext.getCmp('txtSalSuperior').value * Ext.getCmp('txtTarifaSal').value;
                                        Ext.getCmp('dpCosto').setValue(costo.toFixed(2));
                                    }
                                    if (Ext.getCmp('txtEntSuperior').value != null && Ext.getCmp('txtEntSuperior').value != "" && Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "") {
                                        var ratio = Ext.getCmp('txtEntSuperior').value / Ext.getCmp('txtSalSuperior').value;
                                        Ext.getCmp('dpRatio').setValue(ratio.toFixed(6));
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTarifaSal',
                            id: 'txtTarifaSal',
                            fieldLabel: "Tarifa Sal",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Tarifa Sal es requerido",
                            decimalPrecision: 6,
                            msgTarget: 'under',
                            value: tarifasal,
                            listeners:
                            {
                                change: function (field, newValue, oldValue, eOpts) {
                                    if (Ext.getCmp('txtSalSuperior').value != null && Ext.getCmp('txtSalSuperior').value != "" && Ext.getCmp('txtTarifaSal').value != null && Ext.getCmp('txtTarifaSal').value != "") {
                                        var costo = Ext.getCmp('txtSalSuperior').value * Ext.getCmp('txtTarifaSal').value;
                                        Ext.getCmp('dpCosto').setValue(costo.toFixed(2));
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            name: 'dpCosto',
                            id: 'dpCosto',
                            fieldLabel: "Costo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: costo
                        },
                        {
                            xtype: 'displayfield',
                            name: 'dpRatio',
                            id: 'dpRatio',
                            fieldLabel: "Ratio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: ratio
                        },
                        {
                            id: 'dtfechaInicio',
                            name: 'dtfechaInicio',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Inicio",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechainicio
                        },
                        {
                            id: 'dtfechaFin',
                            name: 'dtfechaFin',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Fin",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechafin
                        }

                    ]
                }
            ]
        });

        win = Ext.widget('window', {
            id: 'idWin',
            title: "Editar",
            closeAction: 'destroy',
            layout: 'fit',
            width: '30%',
            resizable: false,
            modal: true,
            items: frm_modificar
        });

        win.show();
    }

    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grid');
        var rec = grp.getSelectionModel().getSelection();

        if (rec.length == 0) {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(true);
            Ext.getCmp('btnGuardar').setDisabled(false);
        } else if (rec.length == 1) {
            Ext.getCmp('btnEditar').setDisabled(false);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnGuardar').setDisabled(true);
        } else {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnGuardar').setDisabled(true);
        }
    }

    function ValidaModificar() {
        var store = Ext.StoreManager.lookup('idstore_ValidaModifica');
        store.getProxy().extraParams.Id = id;
        store.load();
    }

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('AcuerdoTarifa', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
