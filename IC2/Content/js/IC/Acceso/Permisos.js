// Nombre: catUsuarios.js
// Creado por: Julio Cesar Rodriguez Ralda
// Fecha: 10/Oct/2019
// Descripcion: Catalogo de Moneda
// Usuario que modifica:
// Ultima Fecha de modificación:  

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

/**********  VARIABLES GLOBALES  **********/
Ext.onReady(function () {
    Ext.QuickTips.init();
    var BodyCosto = Ext.getBody();
    var id;
    var IdPerfil;
    var IdMenu;
    var NombrePerfil;
    var Etiqueta;
    var CanRead;
    var CanNew;
    var CanEdit;
    var CanDelete;
    var WriteLog;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    /**********  MODELOS  **********/

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarPermiso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'IdPerfil', mapping: 'IdPerfil' },
                { name: 'IdMenu', mapping: 'IdMenu' },
                { name: 'NombrePerfil', mapping: 'NombrePerfil' },
                { name: 'Etiqueta', mapping: 'Etiqueta' },
                { name: 'CanRead', mapping: 'CanRead' },
                { name: 'CanNew', mapping: 'CanNew' },
                { name: 'CanEdit', mapping: 'CanEdit' },
                { name: 'CanDelete', mapping: 'CanDelete' },
                { name: 'WriteLog', mapping: 'WriteLog' }
            ]
        });


    var storevalorLogico = Ext.create('Ext.data.Store', {
        fields: ['Id', 'valor'],
        data: [
            { "Id": "0", "valor": "No" },
            { "Id": "1", "valor": "Si" }
        ]
    });


    Ext.define('model_llenaPerfil',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Nombre', mapping: 'Nombre' }
            ]
        });

    Ext.define('model_llenaMenu',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Etiqueta', mapping: 'Etiqueta' }
            ]
        });


    /**********  STORE  **********/

    //**********  Busca
    var store_BuscarPermiso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPermiso',
        storeId: 'idstore_BuscarPermiso',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/llenaGrid',
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
                var panels = Ext.ComponentQuery.query('#pnl_Permiso');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var storeLlenaPerfil = Ext.create('Ext.data.Store', {
        model: 'model_llenaPerfil',
        storeId: 'idstore_llenaPerfil',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/llenaPerfil',
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

    var storeLlenaMenu = Ext.create('Ext.data.Store', {
        model: 'model_llenaMenu',
        storeId: 'idstore_llenaMenu',
        autoLoad: true,
        pageSize: 1000,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/llenaNombreMenu',
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



    //**********  Borra
    var store_BorrarPermiso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPermiso',
        storeId: 'idstore_BorrarPermiso',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/borrar',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Permiso');
                var elements = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarPermiso.load();

                if (request.action == 'ok') {
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

    //**********  Modifica
    var store_ModificarPermiso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPermiso',
        storeId: 'idstore_ModificarPermiso',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/modifica',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
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
                    store_BuscarPermiso.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: tAvisoSistema,
                        msg: resultado,
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
                } else if (request.proxy.reader.jsonData.results == "not") {
                    Ext.MessageBox.show({
                        title: tInformacionSistema,
                        msg: tMensaje_MovimientoConciliado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPermiso',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/validaModif',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
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
                                ModificarPermiso();
                            }
                        }, this);
                    }
                    else {
                        ModificarPermiso();
                    }
                }
                else {
                    ModificarPermiso();
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

    var store_seleccionarPermiso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPermiso',
        storeId: 'idstore_seleccionarPermiso',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/buscarPermiso',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
            },
            actionMethods:
            {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    /**********  EVENTOS  **********/

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
        store: store_BuscarPermiso,
        displayInfo: true,
        displayMsg: 'Registros {0} - {1} of {2}',
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
                        store_BuscarPermiso.pageSize = cuenta;
                        store_BuscarPermiso.load();
                    }
                }
            }
        ]
    });

    /**********  FORMAS  **********/
    var pnl_Permiso = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_Permiso',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Permisos</div><br/>",
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarPermiso');
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
                            AgregarPermiso(rec);
                            var store = Ext.StoreManager.lookup('idstore_BuscarPermiso');
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
                            var grp = Ext.getCmp('grp_Permiso');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_BorrarPermiso;
                                    store.getProxy().extraParams.strId = strID;
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
                id: 'grp_Permiso',
                store: store_BuscarPermiso,
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
                                id = eOpts[0].data.Id;
                                IdPerfil = eOpts[0].data.IdPerfil;
                                IdMenu = eOpts[0].data.IdMenu;
                                NombrePerfil = eOpts[0].data.NombrePerfil;
                                Etiqueta = eOpts[0].data.Etiqueta;
                                CanRead = eOpts[0].data.CanRead;
                                CanNew = eOpts[0].data.CanNew;
                                CanEdit = eOpts[0].data.CanEdit;
                                CanDelete = eOpts[0].data.CanDelete;
                                WriteLog = eOpts[0].data.WriteLog;
                                console.log("Esto es lo que contiene Nombre perfil : " + NombrePerfil);
                                console.log("Esto es lo que contiene ID menu : " + IdMenu);
                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarPermiso');
                                storeSeleccion.getProxy().extraParams.Id = id;
                                storeSeleccion.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    { xtype: 'gridcolumn', hidden: true, text: "ID", dataIndex: 'Id', flex: 1, sortable: true, locked: false },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NombrePerfil', flex: 1, locked: false, text: "Nombre Perfil",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('NombrePerfil');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Etiqueta', flex: 1, locked: false, text: "Etiqueta",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Etiqueta');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CanRead', flex: 1, locked: false, text: "Leer",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CanRead');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CanNew', flex: 1, locked: false, text: "Nuevo",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CanNew');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CanEdit', flex: 1, locked: false, text: "Editar",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CanEdit');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CanDelete', flex: 1, locked: false, text: "Eliminar",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CanDelete');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'WriteLog', flex: 1, locked: false, text: "Escribir log",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('WriteLog');
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
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
        pnl_Permiso.setSize(w - 15, h - 255);
        pnl_Permiso.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_Permiso.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_Permiso.doComponentLayout();
    });

    function AgregarPermiso() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Permisos/registra',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            idMenu: Ext.getCmp('txtidMenu').value,
                                            idPerfil: Ext.getCmp('txtidPerfil').value,
                                            CanRead: Ext.getCmp('txtCanRead').value,
                                            CanNew: Ext.getCmp('txtCanNew').value,
                                            CanEdit: Ext.getCmp('txtCanEdit').value,
                                            CanDelete: Ext.getCmp('txtCanDelete').value,
                                            CanLog: Ext.getCmp('txtCanLog').value
                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarPermiso');

                                            //store.getProxy().extraParams.IdMenu = Ext.getCmp('txtidMenu').value;
                                            //store.getProxy().extraParams.IdPerfil = Ext.getCmp('txtidPerfil').value;
                                            //store.getProxy().extraParams.CanRead = Ext.getCmp('txtCanRead').value;
                                            //store.getProxy().extraParams.CanNew = Ext.getCmp('txtCanNew').value;
                                            //store.getProxy().extraParams.CanEdit = Ext.getCmp('txtCanEdit').value;
                                            //store.getProxy().extraParams.CanDelete = Ext.getCmp('txtCanDelete').value;
                                            //store.getProxy().extraParams.WriteLog = Ext.getCmp('txtCanLog').value;

                                            store.load();
                                            Ext.Msg.show({
                                                title: "Confirmación",
                                                msg: "El registro se agregó exitosamente",
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
                            xtype: 'combobox',
                            name: 'txtidMenu',
                            id: 'txtidMenu',
                            fieldLabel: "Menu",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaMenu,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Etiqueta}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Etiqueta}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Menu es requerido"
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtidPerfil',
                            id: 'txtidPerfil',
                            fieldLabel: "Perfil",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaPerfil,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo perfil es requerido"
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Leer",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanRead",
                            editable: false
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Nuevo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanNew",
                            editable: false
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Editar",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanEdit",
                            editable: false
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Eliminar",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanDelete",
                            editable: false
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Log",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanLog",
                            editable: false
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

    function ModificarPermiso() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarPermiso');
                                store.getProxy().extraParams.id = id;
                                store.getProxy().extraParams.idMenu = Ext.getCmp('txtidMenu2').value;
                                store.getProxy().extraParams.idPerfil = Ext.getCmp('txtidPerfil2').value;
                                store.getProxy().extraParams.CanRead = Ext.getCmp('txtCanRead2').value;
                                store.getProxy().extraParams.CanNew = Ext.getCmp('txtCanNew2').value;
                                store.getProxy().extraParams.CanEdit = Ext.getCmp('txtCanEdit2').value;
                                store.getProxy().extraParams.CanDelete = Ext.getCmp('txtCanDelete2').value;
                                store.getProxy().extraParams.CanLog = Ext.getCmp('txtCanLog2').value;
                                store.load();
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '0 0 0 0',
                    id: 'fls_deudor',
                    items: [
                        {
                            xtype: 'combobox',
                            name: 'txtidMenu2',
                            id: 'txtidMenu2',
                            fieldLabel: "Menu",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaMenu,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Etiqueta}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Etiqueta}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Menu es requerido",
                            value: IdMenu
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtidPerfil2',
                            id: 'txtidPerfil2',
                            fieldLabel: "Perfil",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaPerfil,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo perfil es requerido",
                            value: IdPerfil
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Leer",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanRead2",
                            editable: false,
                            value: CanRead
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Nuevo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanNew2",
                            editable: false,
                            value: CanNew
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Editar",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanEdit2",
                            editable: false,
                            value: CanEdit
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Eliminar",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanDelete2",
                            editable: false,
                            value: CanDelete
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Log",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storevalorLogico,
                            displayField: 'valor',
                            valueField: 'Id',
                            id: "txtCanLog2",
                            editable: false,
                            value: WriteLog
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
        var grp = Ext.getCmp('grp_Permiso');
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
    var grid = pnl_Permiso.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('Permisos', 'grp_Permiso', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');
})