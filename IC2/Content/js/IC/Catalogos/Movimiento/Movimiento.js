// Nombre: Movimiento.js
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de Movimiento
// Usuario que modifica:Jaíme Alfredo Ladrón de Guevara Herrero
// Ultima Fecha de modificación: 19/dic/2018

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
    var direccion;
    var idOperador;
    var idServicio;
    var tipoMovimiento;
    var Activo;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    /**********  MODELOS  **********/

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarMovimiento',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Tipo_Movimiento', mapping: 'Tipo_Movimiento' },
                { name: 'Direccion', mapping: 'Direccion' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Id_Servicio', mapping: 'Id_Servicio' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'Servicio', mapping: 'Servicio' }

            ]
        });

    var storeTipo_Movimiento = Ext.create('Ext.data.Store', {
        fields: ['id', 'tipoMovimiento'],
        data: [
            { "id": "1", "tipoMovimiento": "Costo" },
            { "id": "2", "tipoMovimiento": "Ingreso" }
        ]
    });

    var storeDireccion = Ext.create('Ext.data.Store', {
        fields: ['id', 'direccion'],
        data: [
            { "id": "1", "direccion": "IB" },
            { "id": "2", "direccion": "OB" }
        ]
    });

    /**********  STORE  **********/

    //**********  Busca Movimiento
    var store_BuscarMovimiento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_BuscarMovimiento',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/llenaGrid?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        },
        listeners: {
            load: function () {
                var panels = Ext.ComponentQuery.query('#pnl_movimiento');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    //**********  Borra Movimiento
    var store_BorrarMovimiento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_BorrarMovimiento',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/borrarMovimiento',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Movimiento');
                var elements = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarMovimiento.load();

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

    //**********  Modifica Movimiento
    var store_ModificarMovimiento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_ModificarMovimiento',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/modificarMovimiento',
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
                    store_BuscarMovimiento.load();
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
                        title: "Notificación",
                        msg: "Se modificó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Algunos datos no son válidos(" + request.proxy.reader.jsonData.dato + ")",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/validaModif',
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
                                ModificarMovimiento();
                            }
                        }, this);
                    }
                    else {
                        ModificarMovimiento();
                    }
                }
                else {
                    ModificarMovimiento();
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

    var storeLlenaServicio = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_llenaServicio',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/llenaServicio?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaOperador = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_llenaOperador',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/llenaOperador?lineaNegocio=' + lineaNegocio,
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

    //**********  Selecciona Movimiento
    var store_seleccionarMovimiento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarMovimiento',
        storeId: 'idstore_seleccionarMovimiento',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/buscarMovimiento',
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
        store: store_BuscarMovimiento,
        displayInfo: true,
        displayMsg: 'Movimientos {0} - {1} of {2}',
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
                        store_BuscarMovimiento.pageSize = cuenta;
                        store_BuscarMovimiento.load();
                    }
                }
            }
        ]
    });

    /**********  FORMAS  **********/

    var pnl_Movimiento = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_movimiento',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Movimientos</div><br/>",
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
                            "<button id='refresh' style='border:none'   class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var store = Ext.StoreManager.lookup('idstore_BuscarMovimiento');
                            store.load();
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
                            accion = "agregar";
                            var rec = null;
                            AgregarMovimiento(rec);
                            var store = Ext.StoreManager.lookup('idstore_BuscarMovimiento');
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
                            //ModificarMovimiento();
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
                            var grp = Ext.getCmp('grp_Movimiento');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s) ? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_BorrarMovimiento;
                                    store.getProxy().extraParams.strId = strID;
                                    store.load();
                                }
                            });
                        }
                    }
                ],
            },
            {
                html: "<br/>",
                border: 0
            },
            {
                xtype: 'gridpanel',
                id: 'grp_Movimiento',
                store: store_BuscarMovimiento,
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
                                tipoMovimiento = eOpts[0].data.Tipo_Movimiento;
                                direccion = eOpts[0].data.Direccion;
                                idOperador = eOpts[0].data.Id_Operador;
                                idServicio = eOpts[0].data.Id_Servicio;

                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarMovimiento');
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
                        xtype: 'gridcolumn', text: "Tipo Movimiento", dataIndex: 'Tipo_Movimiento', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Tipo_Movimiento');
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
                        xtype: 'gridcolumn', text: "Servicio", dataIndex: 'Servicio', flex: 1, sortable: true, locked: false,
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
                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'gridcolumn', text: "Dirección", dataIndex: 'Direccion', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Direccion');
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
                                //keyup: function () {
                                //    store_BuscarMovimiento.clearFilter();
                                //    var cadena = this.value;
                                //    if (this.value && cadena.length > 0) {
                                //        store_BuscarMovimiento.load({ params: { start: 0, limit: 100000 } });
                                //        store_BuscarMovimiento.filter({
                                //            property: 'Direccion',
                                //            value: this.value,
                                //            anyMatch: true,
                                //            caseSensitive: false
                                //        });
                                //    } else {
                                //        store_BuscarMovimiento.clearFilter();
                                //    }
                                //}
                            }
                        }
                    }
                ]
            }
        ],
        renderTo: BodyCosto
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        pnl_Movimiento.setSize(w - 15, h - 255);
        pnl_Movimiento.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_Movimiento.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_Movimiento.doComponentLayout();
    });

    function AgregarMovimiento() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Movimiento/agregarMovimiento',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Tipo_Movimiento: Ext.getCmp('cmbTMovimiento').value,
                                            Direccion: Ext.getCmp('cmbDireccion').value,
                                            Id_Operador: Ext.getCmp('cmbOperador').value,
                                            Id_Servicio: Ext.getCmp('cmbServicio').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarMovimiento');

                                            store.getProxy().extraParams.Id = id;
                                            store.getProxy().extraParams.Tipo_Movimiento = Ext.getCmp('cmbTMovimiento').value;
                                            store.getProxy().extraParams.Direccion = Ext.getCmp('cmbDireccion').value;
                                            store.getProxy().extraParams.Id_Operador = Ext.getCmp('cmbOperador').value;
                                            store.getProxy().extraParams.Id_Servicio = Ext.getCmp('cmbServicio').value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store.load();

                                            var mensaje;
                                            if (data.results == "ok") {
                                                mensaje = "El registro se agregó exitosamente";
                                            } else if (data.results == "no") {
                                                mensaje = "Algunos dato no son válidos (" + data.dato + ")";
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
                            xtype: 'combobox',
                            fieldLabel: "Tipo Movimiento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeTipo_Movimiento,
                            displayField: 'tipoMovimiento',
                            valueField: 'tipoMovimiento',
                            id: "cmbTMovimiento",
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Tipo Movimiento es requerido",
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbOperador',
                            id: 'cmbOperador',
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            textBlank: "El campo Operador es requerido",
                            msgTarget: 'under',
                            store: storeLlenaOperador,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Operador} - {Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Operador} - {Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id_Operador'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            store: storeLlenaServicio,
                            msgTarget: 'under',
                            blankText: "El campo Servicio es requerido",
                            editable: false,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Nombre} - {Servicio}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre} - {Servicio}',
                                '</tpl>'
                            ),
                            valueField: 'Id_Servicio'
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Dirección",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeDireccion,
                            displayField: 'direccion',
                            valueField: 'direccion',
                            id: "cmbDireccion",
                            allowBlank: false,
                            blankText: "El campo Dirección es requerido"
                        }
                    ]
                }
            ]
        });
        win = Ext.widget('window', {
            id: 'idWin',
            title: "Nuevo",
            closeAction: 'destroy',
            layout: 'anchor',
            width: '24%',
            resizable: false,
            modal: true,
            items: frm_agregar
        });
        win.show();
    }

    //inicia funcion modificar
    function ModificarMovimiento() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarMovimiento');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Tipo_Movimiento = Ext.getCmp('cmbTMovimiento').value;
                                store.getProxy().extraParams.Direccion = Ext.getCmp('cmbDireccion').value;
                                store.getProxy().extraParams.Id_Operador = Ext.getCmp('cmbOperador').value;
                                store.getProxy().extraParams.Id_Servicio = Ext.getCmp('cmbServicio').value;
                                lineaNegocio = lineaNegocio;
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
                    id: 'fls_deudor',
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: "Tipo Movimiento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeTipo_Movimiento,
                            displayField: 'tipoMovimiento',
                            valueField: 'tipoMovimiento',
                            value: tipoMovimiento,
                            id: "cmbTMovimiento",
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Tipo Movimiento es requerido"
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbOperador',
                            id: 'cmbOperador',
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            textBlank: "El campo Operador es requerido",
                            msgTarget: 'under',
                            store: storeLlenaOperador,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Operador} - {Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Operador} - {Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id_Operador',
                            displayField: 'Nombre',
                            value: idOperador
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            store: storeLlenaServicio,
                            msgTarget: 'under',
                            blankText: "El campo Servicio es requerido",
                            editable: false,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Nombre} - {Servicio}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre} - {Servicio}',
                                '</tpl>'
                            ),
                            valueField: 'Id_Servicio',
                            value: idServicio
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Dirección",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeDireccion,
                            displayField: 'direccion',
                            value: direccion,
                            valueField: 'direccion',
                            id: "cmbDireccion",
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Dirección es requerido"
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
        var grp = Ext.getCmp('grp_Movimiento');
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
    var grid = pnl_Movimiento.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Movimiento', 'grp_Movimiento', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

})