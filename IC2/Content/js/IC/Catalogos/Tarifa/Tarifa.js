
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
    var tarifa;
    var idOperador;
    var sentido;
    var idTrafico;
    var volminimo;
    var volmaximo;
    var viginicio;
    var vigfinal;
    
    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Id_Trafico', mapping: 'Id_Trafico' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'VolMinimo', mapping: 'VolMinimo' },
                { name: 'VolMaximo', mapping: 'VolMaximo' },
                { name: 'Tarifa', mapping: 'Tarifa' },
                { name: 'VigInicio', mapping: 'VigInicio' },
                { name: 'VigFin', mapping: 'VigFin' },
                { name: 'NombreOperador', mapping: 'NombreOperador' },
                { name: 'NombreTrafico', mapping: 'NombreTrafico' },
                { name: 'IdOperador', mapping: 'IdOperador' },
                { name: 'IdTrafico', mapping: 'IdTrafico' }
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
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/llenaGrid?lineaNegocio=' + lineaNegocio,
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

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/borrar',
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
                //if (request.action == 'ok') {
                //    this.readCallback(request);
                //}
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.result.length != 4) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: request.proxy.reader.jsonData.result,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });   
                }
                else if (!request.proxy.reader.jsonData.success) {

                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: resultado,
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
        model: 'modelo',
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/modificar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

                Ext.MessageBox.show({
                    title: "Notificación",
                    msg: "Se modificó correctamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_Buscar.load();

                if (request.action == 'read') {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Notificaciones",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: tInformacionSistema,
                        msg: tMensaje_Modificado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificaciones",
                        msg: "Prueba",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/validaModif',
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

    var store_seleccionar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_seleccionar',
       
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/buscar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods:
            {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
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
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/llenaOperador?lineaNegocio=' + lineaNegocio,
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
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/llenaTrafico?lineaNegocio=' + lineaNegocio,
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
    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Entrante" },
            { "id": "2", "sentido": "Saliente" }
        ]
    });

    var paginador = new Ext.PagingToolbar({
        id: 'ptb_Tarifa',
        store: store_Buscar,
        displayInfo: true,
        displayMsg: 'Tarifas {0} - {1} of {2}',
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
                        store_Buscar.pageSize = cuenta;
                        store_Buscar.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<h3>Tarifas</h3>",
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
                           
                            iBusca = 0;
                           
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
                html: "<br/>"
            },
            {
                xtype: 'gridpanel',
                id: 'grid',
                flex: 1,
                store: store_Buscar,
                width: '100%',
                height: '100%',
                bbar: paginador,
                dockedItems: [
                    {
                        dock: 'right',
                        xtype: 'toolbar',
                        collapsible: true,
                        items: [
                            {
                                glyph: 61,
                                xtype: 'button',
                                menu:
                                    [
                                        {
                                            xtype: 'button',
                                            text:'CSV'
                                        }
                                    ]
                            
                            }
                        ]
                    }
                ],

                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                id = eOpts[0].data.Id;
                                sentido = eOpts[0].data.Sentido;
                                idOperador = eOpts[0].data.Id_Operador;
                                operador = eOpts[0].data.Operador;
                                idTrafico = eOpts[0].data.Id_Trafico;
                                trafico = eOpts[0].data.Trafico;
                                volminimo = eOpts[0].data.VolMinimo;
                                volmaximo = eOpts[0].data.VolMaximo;
                                tarifa = eOpts[0].data.Tarifa;
                                viginicio = eOpts[0].data.VigInicio;
                                vigfinal = eOpts[0].data.VigFin;
                                store_seleccionar.getProxy().extraParams.Id = id;
                                store_seleccionar.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', flex: 1, locked: false, text: "Sentido",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sentido');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSentido',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'Sentido',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'IdOperador', flex: 1, locked: false, text: "Id Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('IdOperador');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txIdOperador',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'IdOperador',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Operador', flex: 1, locked: false, text: "Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Operador');
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
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'Operador',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'IdTrafico', flex: 1, locked: false, text: "Id Tráfico",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('IdTrafico');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txIdTrafico',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'IdTrafico',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Trafico', flex: 1, locked: false, text: "Tráfico",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Trafico');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTrafico',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'Trafico',
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
                        xtype: "numbercolumn", align: 'right', format: "0.000000", sortable: true, dataIndex: 'VolMinimo', flex: 1, locked: false, text: "Volumen Mínimo",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txVolMin',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'VolMinimo',
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
                        xtype: "numbercolumn", sortable: true, align: 'right', format: '0.000000', dataIndex: 'VolMaximo', flex: 1, locked: false, text: "Volumen Máximo",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txVolMax',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'VolMaximo',
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
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'Tarifa', flex: 1, locked: false, text: "Tarifa",
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTarifa',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    var cadena = this.value;
                                    if (cadena.length >= 2) {
                                        store.filter({
                                            property: 'Tarifa',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'VigInicio', with: 200, locked: false, text: "Vigencia Inicio",
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
                                    var cadena = this.value;
                                    store.clearFilter();
                                    if (this.value && cadena.length >= 2) {
                                        store.filter({
                                            property: 'VigInicio',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'VigFin', with: 200, locked: false, text: "Vigencia Fin",
                        
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
                                    var cadena = this.value;
                                    store.clearFilter();
                                    if (this.value && cadena.length >= 2) {
                                        store.filter({
                                            property: 'VigFin',
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

        var frm_agregar = Ext.create('Ext.form.Panel',
            {
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
                                handler: function ()
                                {
                                    var form = this.up('form').getForm();
                                    if (form.wasValid) {
                                        form.submit({
                                            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa/agregar',
                                            waitMsg: "Nuevo",
                                            params:
                                            {
                                              
                                                Operador: Ext.getCmp('cmbOperador').value,
                                                Sentido: Ext.getCmp('cmbSentido').value,
                                                Trafico: Ext.getCmp('cmbTrafico').value,
                                                Volminimo: Ext.getCmp('txtVolmin').value,
                                                Volmaximo: Ext.getCmp('txtVolmax').value,
                                                Tarifa: Ext.getCmp('txtTarifa').value,
                                                Viginicio: Ext.getCmp('dtVigInicio').value,
                                                Vigfin: Ext.getCmp('dtVigFin').value,
                                                lineaNegocio: lineaNegocio
                                            },
                                            success: function (form, action) {

                                                var data = Ext.JSON.decode(action.response.responseText);
                                                store_Buscar.load();
                                                var mensaje;
                                                if (data.results == "ok")
                                                    mensaje = "Se agregó correctamente";
                                                else
                                                {
                                                    
                                                    if (data.rango == false)
                                                    {
                                                        mensaje = "Vigencia Inicio es MAYOR que Vigencia Fin";
                                                    }
                                                    
                                                }
                                                Ext.Msg.show({
                                                    title: "Notificación",
                                                    msg: mensaje,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });
                                                //if (data.result == "ok")
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
                                {
                                    xtype: 'combobox',
                                    fieldLabel: "Sentido",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    store: storeSentido,
                                    displayField: 'sentido',
                                    valueField: 'sentido',
                                    id: "cmbSentido",
                                    editable: false
                                },
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
                                    name: 'cmbTrafico',
                                    id: 'cmbTrafico',
                                    fieldLabel: "Tráfico",
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
                                    name: 'txtVolmin',
                                    id: 'txtVolmin',
                                    fieldLabel: "Volumen Mínimo",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    blankText: "El campo Volúmen Mínimo  es requerido",
                                    msgTarget: 'under',
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    decimalPrecision: 6,
                                    minValue: 0.01,
                                    minText: 'El valor mínimo para este campo es {0}'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtVolmax',
                                    id: 'txtVolmax',
                                    fieldLabel: "Volumen Máximo",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    blankText: "El campo Volúmen Máximo  es requerido",
                                    msgTarget: 'under',
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    decimalPrecision: 6,
                                    minValue: 0.01,
                                    minText: 'El valor mínimo para este campo es {0}'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtTarifa',
                                    id: 'txtTarifa',
                                    fieldLabel: "Tarifa",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    blankText: "El campo Tarifa  es requerido",
                                    msgTarget: 'under',
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    decimalPrecision: 6,
                                    minValue: 0.01,
                                    minText: 'El valor mínimo para este campo es {0}'
                                },
                                {
                                    id: 'dtVigInicio',
                                    name: 'dtVigInicio',
                                    xtype: 'datefield',
                                    editable: false,
                                    margin: '5 5 5 5',
                                    fieldLabel: "Vigencia Inicio",
                                    anchor: '100%',
                                    editable: false,
                                    allowBlank: false,
                                    msgTarget: 'under',
                                    format: 'd-m-Y'
                                },
                                {
                                    id: 'dtVigFin',
                                    name: 'dtVigFin',
                                    xtype: 'datefield',
                                    editable: false,
                                    margin: '5 5 5 5',
                                    fieldLabel: "Vigencia Fin",
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
                            border: false,
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='n'>Guardar</button>",
                            handler: function () {
                                var store = Ext.StoreManager.lookup('idstore_Modificar');
                                store.getProxy().extraParams.Id = id
                                store.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                store.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                store.getProxy().extraParams.Volminimo = Ext.getCmp('txtVolmin').value;
                                store.getProxy().extraParams.Volmaximo = Ext.getCmp('txtVolmax').value;
                                store.getProxy().extraParams.Tarifa = Ext.getCmp('txtTarifa').value;
                                store.getProxy().extraParams.Viginicio = Ext.getCmp('dtVigInicio').value;
                                store.getProxy().extraParams.Vigfin = Ext.getCmp('dtVigFin').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;

                                store.load();
                                this.up('window').destroy();
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
                    // border: 0,
                    frame: false,
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: "Sentido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            displayField: 'sentido',
                            valueField: 'sentido',
                            id: "cmbSentido",
                            editable: false,
                            value: sentido
                        },
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
                            name: 'cmbTrafico',
                            id: 'cmbTrafico',
                            fieldLabel: "Tráfico",
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
                            value: idTrafico
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtVolmin',
                            id: 'txtVolmin',
                            fieldLabel: "Volumen Mínimo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Volúmen Mínimo  es requerido",
                            msgTarget: 'under',
                            decimalSeparator: ".",
                            hideTrigger: true,
                            decimalPrecision: 6,
                            minValue: 0.01,
                            minText: 'El valor mínimo para este campo es {0}',
                            value: volminimo
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtVolmax',
                            id: 'txtVolmax',
                            fieldLabel: "Volumen Máximo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Volúmen Máximo  es requerido",
                            msgTarget: 'under',
                            decimalSeparator: ".",
                            hideTrigger: true,
                            decimalPrecision: 6,
                            minValue: 0.01,
                            minText: 'El valor mínimo para este campo es {0}',
                            value: volmaximo
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTarifa',
                            id: 'txtTarifa',
                            fieldLabel: "Tarifa",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Tarifa  es requerido",
                            msgTarget: 'under',
                            decimalSeparator: ".",
                            hideTrigger: true,
                            decimalPrecision: 6,
                            minValue: 0.01,
                            minText: 'El valor mínimo para este campo es {0}',
                            value: tarifa
                        },
                        {
                            id: 'dtVigInicio',
                            name: 'dtVigInicio',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Vigencia Inicio",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: viginicio
                        },
                        {
                            id: 'dtVigFin',
                            name: 'dtVigFin',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Vigencia Fin",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: vigfinal
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
    permisosElementos('Tarifa', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
