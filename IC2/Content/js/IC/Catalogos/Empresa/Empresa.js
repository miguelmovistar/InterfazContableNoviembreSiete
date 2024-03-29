﻿
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
    var idEmpresa;
    var idControl;
    var abreviatura;
    var nombre;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarEmpresa',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Empresa_Id', mapping: 'Empresa_Id' },
                { name: 'id_control', mapping: 'id_control' },
                { name: 'Abreviatura', mapping: 'Abreviatura' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'st_Activo', mapping: 'st_Activo' }
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

    var store_BuscarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_BuscarEmpresa',
        storeId: 'idstore_buscarEmpresa',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Empresa/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#panel_empresa');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_BorrarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_Borrar',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Empresa/borrarEmpresa',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Empresa');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == true) {
                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                    store_BuscarEmpresa.load();
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
                    // store_BuscarEmpresa.load();
                    //var grid = Ext.getCmp('grp_Empresa');
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

    var store_ModificarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_BuscarEmpresa',
        storeId: 'idstore_ModificarEmpresa',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Empresa/modificarEmpresa',
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
                    store_BuscarEmpresa.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: "Aviso",
                    msg: "Ocurrió un error",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcreedor',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Empresa/validaModif',
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

    var store_seleccionarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_BuscarEmpresa',
        storeId: 'idstore_seleccionarEmpresa',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Empresa/buscarEmpresa',
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
        id: 'ptb_empresa',
        store: store_BuscarEmpresa,
        displayInfo: true,
        displayMsg: 'Empresas {0} - {1} of {2}',
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
                        store_BuscarEmpresa.pageSize = cuenta;
                        store_BuscarEmpresa.load();
                    }
                }
            }
        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'panel_empresa',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Empresas</div><br/>",
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
                            "<button id='refresh' style='border:none'  class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var storeBuscar = Ext.StoreManager.lookup('idstore_buscarEmpresa');
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
                        html: "<button class='btn btn-primary' style='outline:none'>Nuevo</button>",
                        handler: function () {
                            Agregar();
                            var store = Ext.StoreManager.lookup('idstore_buscarEmpresa');
                            store.load();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary' style='outline:none'>Editar</button>",
                        border: false,
                        margin: '0 0 0 -5',
                        disabled: true,
                        handler: function () {
                            ValidaModificar()
                            //Modificar();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEliminar',
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary' style='outline:none'>Eliminar</button>",
                        border: false,
                        disabled: true,
                        handler: function () {
                            var strID = "";
                            var grp = Ext.getCmp('grp_Empresa');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++)
                                strID = strID + rec[i].data.id_control + ",";

                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
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
                id: 'grp_Empresa',
                flex: 1,
                store: store_BuscarEmpresa,
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
                                idEmpresa = eOpts[0].data.Empresa_Id;
                                idControl = eOpts[0].data.id_control;
                                abreviatura = eOpts[0].data.Abreviatura;
                                nombre = eOpts[0].data.Nombre;

                                var storeSEmpresa = Ext.StoreManager.lookup('idstore_seleccionarEmpresa');
                                storeSEmpresa.getProxy().extraParams.Empresa_Id = idControl;
                                storeSEmpresa.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'gridcolumn',
                        hidden: true,
                        text: "ID",
                        dataIndex: 'id_control',
                        flex: 1,
                        sortable: true,
                        locked: true
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Empresa_Id', flex: 1, text: "Id Empresa", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Empresa_Id');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txIdEmpresa',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Abreviatura', flex: 1, text: "Abreviatura", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Abreviatura');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txAbreviatura',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombre', flex: 1, locked: false, text: "Nombre",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nombre');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txNombre',
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Empresa/agregarEmpresa',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Abreviatura: Ext.getCmp('txtAbreviatura').value,
                                            Nombre: Ext.getCmp('txtNombre').value,
                                            Empresa_Id: Ext.getCmp('txtControl').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_buscarEmpresa');

                                            store.getProxy().extraParams.Empresa_Id = Ext.getCmp('txtControl').value;
                                            store.getProxy().extraParams.Abreviatura = Ext.getCmp('txtAbreviatura').value;
                                            store.getProxy().extraParams.Nombre = Ext.getCmp('txtNombre').value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store.load();

                                            var mensaje;
                                            if (data.results == "ok")
                                                mensaje = "El registro se agregó exitosamente";
                                            else
                                                mensaje = "El Id: " + data.dato + " ya existe";
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
                                                msg: action.result.results,
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
                            name: 'txtControl',
                            id: 'txtControl',
                            fieldLabel: "Empresa Id",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Empresa Id es requerido",
                            msgTarget: 'under',
                            maxLength: 10,
                            enforceMaxLength: true

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtAbreviatura',
                            id: 'txtAbreviatura',
                            fieldLabel: "Abreviatura",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Abreviatura es requerido",
                            msgTarget: 'under',
                            maxLength: 15,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNombre',
                            id: 'txtNombre',
                            fieldLabel: "Nombre",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Nombre es requerido",
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
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
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            handler: function () {
                                var store = Ext.StoreManager.lookup('idstore_ModificarEmpresa');
                                store.getProxy().extraParams.id_control = idControl;
                                store.getProxy().extraParams.Abreviatura = Ext.getCmp('txtAbreviaturaM').value;
                                store.getProxy().extraParams.Nombre = Ext.getCmp('txtNombreM').value;
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
                    margin: '5 5 5 5',
                    id: 'fls_empresa',
                    width: '100%',
                    frame: false,
                    items: [
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            id: 'dIdEmpresa',
                            margin: '5 5 5 5',
                            value: idEmpresa,
                            fieldLabel: 'Id Empresa'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtAbreviaturaM',
                            id: 'txtAbreviaturaM',
                            fieldLabel: "Abreviatura",
                            allowBlank: false,
                            blankText: "El campo Abreviatura es requerido",
                            msgTarget: 'under',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: abreviatura,
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNombreM',
                            id: 'txtNombreM',
                            fieldLabel: "Nombre",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: nombre,
                            allowBlank: false,
                            blankText: "El campo Nombre es requerido",
                            msgTarget: 'under'
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
        var grp = Ext.getCmp('grp_Empresa');
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
        store.getProxy().extraParams.Id = idControl;
        store.load();

    }

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Empresa', 'grp_Empresa', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
