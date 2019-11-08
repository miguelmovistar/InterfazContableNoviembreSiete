
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
    'Ext.tip.QuickTipManager'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();
    var BodyCosto = Ext.getBody();
    var idServicio;
    var servicio;
    var orden;
    var Id;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarServicio',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id_Servicio', mapping: 'Id_Servicio' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Orden', mapping: 'Orden' },
                { name: 'Id', mapping: 'Id' }
            ]
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

    var store_BuscarServicio = Ext.create('Ext.data.Store', {
        model: 'model_BuscarServicio',
        storeId: 'idstore_buscarServicio',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Servicio/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_servicio');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_BorrarServicio = Ext.create('Ext.data.Store', {
        model: 'model_BuscarServicio',
        storeId: 'idstore_BorrarServicio',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Servicio/borrarServicio',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Servicio');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_BuscarServicio.load();
                }
                else {
                    this.readCallback(request);
                }
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
                        title: "tAvisoSistema",
                        msg: resultado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
                else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "El registro se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "Aviso",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ModificarServicio = Ext.create('Ext.data.Store', {
        model: 'model_BuscarServicio',
        storeId: 'idstore_ModificarServicio',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Servicio/modificarServicio',
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
                    store_BuscarServicio.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: tInformacionSistema,
                        msg: tMensaje_Modificado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "validando cambio",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcreedor',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Servicio/validaModif',
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
                                ModificarServicio();
                            }
                        }, this);
                    }
                    else {
                        ModificarServicio();
                    }
                }
                else {
                    ModificarServicio();
                    //this.readCallback(request);
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

    var store_seleccionarServicio = Ext.create('Ext.data.Store', {
        model: 'model_BuscarServicio',
        storeId: 'idstore_seleccionarServicio',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Servicio/buscarServicio',
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

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarServicio,
        displayInfo: true,
        displayMsg: 'Servicios {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
        listeners: {
            beforechange: function () {
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
                        store_BuscarServicio.pageSize = cuenta;
                        store_BuscarServicio.load();
                    }
                }
            }


        ]
    });

    var pnl_servicio = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_servicio',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Servicios</div><br/>",
                border: false,
                margin: '0 0 0 10'
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
                            "<button id='refresh' style='border:none' class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var store = Ext.StoreManager.lookup('idstore_buscarServicio');
                            store.load();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnGuardar',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary' style='outline:none'>Nuevo</button>",
                        handler: function () {
                            accion = "agregar";
                            var rec = null;
                            AgregarServicio(rec);
                            var store = Ext.StoreManager.lookup('idstore_buscarServicio');
                            store.load();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary' style='outline:none'>Editar</button>",
                        border: false,
                        disabled: true,
                        margin: '0 0 0 -5',
                        handler: function () {
                            ValidaModificar();
                            //ModificarServicio();
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
                            var grp = Ext.getCmp('grp_Servicio');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarServicio');
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
                border: 0
            },
            {
                xtype: 'gridpanel',
                id: 'grp_Servicio',
                store: store_BuscarServicio,
                flex: 1,
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
                                idServicio = eOpts[0].data.Id_Servicio;
                                servicio = eOpts[0].data.Servicio;
                                orden = eOpts[0].data.Orden;
                                Id = eOpts[0].data.Id;

                                var storeSServicio = Ext.StoreManager.lookup('idstore_seleccionarServicio');
                                storeSServicio.getProxy().extraParams.Id = Id;
                                storeSServicio.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'gridcolumn', hidden: false, text: "ID Servicio", dataIndex: 'Id_Servicio', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_Servicio');
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
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Servicio', flex: 1, text: "Servicio", locked: false,
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
                    {
                        xtype: "numbercolumn", sortable: true, dataIndex: 'Orden', flex: 1, locked: false, text: "Orden",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Orden');
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
                    }
                ]
            }
        ],
        renderTo: BodyCosto
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        pnl_servicio.setSize(w - 15, h - 255);
        pnl_servicio.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_servicio.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_servicio.doComponentLayout();
    });

    function AgregarServicio() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Servicio/agregarServicio',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Servicio: Ext.getCmp('txtServicio').value,
                                            Orden: Ext.getCmp('txtOrden').value,
                                            Id_Servicio: Ext.getCmp('txtIdServicio').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_buscarServicio');
                                            store.getProxy().extraParams.Servicio = Ext.getCmp('txtServicio').value;
                                            store.getProxy().extraParams.Orden = Ext.getCmp('txtOrden').value;
                                            store.getProxy().extraParams.Id_Servicio = Ext.getCmp("txtIdServicio").value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store.load();
                                            var mensaje = "";
                                            if (action.result.results == "ok") {
                                                mensaje = "El registro se agregó exitosamente";
                                            } else if (action.result.results == "no") {
                                                mensaje = "El Orden: " + action.result.dato + " ya existe";
                                            }
                                            Ext.Msg.show({
                                                title: "Confirmación",
                                                msg: mensaje,
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                            win.destroy();
                                        },
                                        failure: function (forms, action) {
                                            Ext.Msg.show({
                                                title: "Aviso",
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
                    id: 'fls_movimiento',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'txtIdServicio',
                            id: 'txtIdServicio',
                            fieldLabel: "Id Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Id Servicio es requerido",
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtServicio',
                            id: 'txtServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Servicio es requerido",
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtOrden',
                            id: 'txtOrden',
                            fieldLabel: "Orden",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            hideTrigger: true,
                            allowDecimals: false
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
    function ModificarServicio() {
        var frm_agregar = Ext.widget('form', {
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
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            handler: function () {
                                var store = Ext.StoreManager.lookup('idstore_ModificarServicio');
                                store.getProxy().extraParams.Servicio = Ext.getCmp('txtServicio').value;
                                store.getProxy().extraParams.Orden = Ext.getCmp('txtOrden').value;
                                store.getProxy().extraParams.Id = Id;
                                store.load();
                                //this.up('window').destroy();
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '0 0 0 0',
                    id: 'fls_Servicio',
                    items: [
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            fieldLabel: 'Id_Servicio',
                            value: idServicio
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtServicio',
                            id: 'txtServicio',
                            fieldLabel: "Servicio",
                            msgTarget: 'under',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: servicio,
                            maxLength: 50,
                            enforceMaxLength: true,
                            allowBlank: false,
                            blankText: "El campo Servicio es requerido",
                            msgTarget: 'under'
                        }, {
                            xtype: 'numberfield',
                            name: 'txtOrden',
                            id: 'txtOrden',
                            fieldLabel: "Orden",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: orden,
                            allowBlank: true,
                            msgTarget: 'under',
                            hideTrigger: true,
                            allowDecimals: false
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
            items: frm_agregar
        });
        win.show();
    }

    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grp_Servicio');
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
        store.getProxy().extraParams.Id = Id;
        store.load();
    }

    // Parte de la logica de filtrado de grid
    var grid = pnl_servicio.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Servicio', 'grp_Servicio', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
