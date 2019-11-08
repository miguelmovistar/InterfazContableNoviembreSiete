
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
    var Body = Ext.getBody();
    var idSociedad;
    var abreviatura;
    var nombre;
    var idSAP;
    var sociedadSAP;
    var id;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarSociedad',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Sociedad', mapping: 'Id_Sociedad' },
                { name: 'Abreviatura', mapping: 'Abreviatura' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'Id_SAP', mapping: 'Id_SAP' },
                { name: 'Sociedad_SAP', mapping: 'Sociedad_SAP' }
            ]
        });

    var store_BuscarSociedad = Ext.create('Ext.data.Store', {
        model: 'model_BuscarSociedad',
        storeId: 'idstore_buscarSociedad',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Sociedad/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_sociedad');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_BorrarSociedad = Ext.create('Ext.data.Store', {
        model: 'model_BuscarSociedad',
        storeId: 'idstore_BorrarSociedad',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Sociedad/borrarSociedad',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Sociedad');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_BuscarSociedad.load();
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
                        title: "Notificacion",
                        msg: resultado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    // store_BuscarEmpresa.load();
                    //var grid = Ext.getCmp('grp_Empresa');
                }
                else if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "Notificación",
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

    var store_ModificarSociedad = Ext.create('Ext.data.Store', {
        model: 'model_BuscarSociedad',
        storeId: 'idstore_ModificarSociedad',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Sociedad/modificarSociedad',
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
                    store_BuscarSociedad.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "resultado",
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
        model: 'model_BuscarSociedad',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Sociedad/validaModif',
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
                                ModificarSociedad();
                            }
                        }, this);
                    }
                    else {
                        ModificarSociedad();
                    }
                }
                else {
                    ModificarSociedad();
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

    var store_seleccionarSociedad = Ext.create('Ext.data.Store', {
        model: 'model_BuscarSociedad',
        storeId: 'idstore_seleccionarSociedad',
        // pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Sociedad/buscarSociedad',
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
        store: store_BuscarSociedad,
        displayInfo: true,
        displayMsg: 'Sociedades {0} - {1} of {2}',
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
                        store_BuscarSociedad.pageSize = cuenta;
                        store_BuscarSociedad.load();
                    }
                }
            }


        ]
    });

    var pnl_sociedad = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_sociedad',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Sociedades</div><br/>",
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
                            var store = store_BuscarSociedad;
                            Ext.StoreManager.lookup('idstore_buscarSociedad');
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
                            AgregarSociedad();
                            var store = store_BuscarSociedad;
                            //Ext.StoreManager.lookup('idstore_buscarSociedad');
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
                            //ModificarSociedad();
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
                            var grp = Ext.getCmp('grp_Sociedad');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar  " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarSociedad');
                                    store.getProxy().extraParams.strID = strID;
                                    store.load();

                                }
                            });
                            //store_BuscarSociedad.load();
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
                id: 'grp_Sociedad',
                store: store_BuscarSociedad,
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
                                idSociedad = eOpts[0].data.Id_Sociedad;
                                abreviatura = eOpts[0].data.Abreviatura;
                                nombre = eOpts[0].data.Nombre;
                                idSAP = eOpts[0].data.Id_SAP;
                                sociedadSAP = eOpts[0].data.Sociedad_SAP;
                                id = eOpts[0].data.Id;
                                var storeSociedad = Ext.StoreManager.lookup('idstore_seleccionarSociedad');
                                storeSociedad.getProxy().extraParams.Id = id;
                                storeSociedad.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    { xtype: 'gridcolumn', hidden: true, dataIndex: 'Id' },
                    {
                        xtype: 'gridcolumn', hidden: false, text: "Sociedad", dataIndex: 'Id_Sociedad', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_Sociedad');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Id_SAP', flex: 1, locked: false, text: "SAP",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_SAP');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sociedad_SAP', flex: 1, locked: false, text: "Sociedad SAP", 
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sociedad_SAP');
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
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        pnl_sociedad.setSize(w - 15, h - 255);
        pnl_sociedad.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_sociedad.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_sociedad.doComponentLayout();
    });

    function AgregarSociedad() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Sociedad/agregarSociedad',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Id_Sociedad: Ext.getCmp('txtIdSociedad').value,
                                            Abreviatura: Ext.getCmp('txtAbreviatura').value,
                                            Nombre: Ext.getCmp('txtNombre').value,
                                            Id_SAP: Ext.getCmp('txtId_SAP').value,
                                            Sociedad_SAP: Ext.getCmp('txtSociedad_SAP').value,
                                            lineaNegocio: lineaNegocio

                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = store_BuscarSociedad;
                                            store.getProxy().extraParams.Id_Sociedad = Ext.getCmp('txtIdSociedad').value;
                                            store.getProxy().extraParams.Abreviatura = Ext.getCmp('txtAbreviatura').value;
                                            store.getProxy().extraParams.Nombre = Ext.getCmp('txtNombre').value;
                                            store.getProxy().extraParams.Id_SAP = Ext.getCmp('txtId_SAP').value;
                                            store.getProxy().extraParams.Sociedad_SAP = Ext.getCmp('txtSociedad_SAP').value;

                                            store.load();
                                            var mensaje;
                                            if (data.results == "ok") {
                                                mensaje = "Se agregó correctamente";
                                            } else {
                                                mensaje = "El Id: " + data.dato + " ya existe";
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
                            name: 'txtIdSociedad',
                            id: 'txtIdSociedad',
                            fieldLabel: "Id Sociedad",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Id Sociedad es obligatorio',
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
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 10,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNombre',
                            id: 'txtNombre',
                            fieldLabel: "Nombre",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtId_SAP',
                            id: 'txtId_SAP',
                            fieldLabel: "Id SAP",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 20,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtSociedad_SAP',
                            id: 'txtSociedad_SAP',
                            fieldLabel: "Sociedad SAP",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 10,
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
    function ModificarSociedad() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarSociedad');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Id_Sociedad = idSociedad;
                                store.getProxy().extraParams.Abreviatura = Ext.getCmp('txtAbreviatura').value;
                                store.getProxy().extraParams.Nombre = Ext.getCmp('txtNombre').value;
                                store.getProxy().extraParams.Id_SAP = Ext.getCmp('txtId_SAP').value;
                                store.getProxy().extraParams.Sociedad_SAP = Ext.getCmp('txtSociedad_SAP').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;
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
                    id: 'fls_sociedad',
                    items: [
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: idSociedad,
                            fieldLabel: "Sociedad"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtAbreviatura',
                            id: 'txtAbreviatura',
                            fieldLabel: "Abreviatura",
                            allowBlank: true,
                            msgTarget: 'under',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: abreviatura,
                            maxLength: 10,
                            enforceMaxLength: true
                        }, {
                            xtype: 'textfield',
                            name: 'txtNombre',
                            id: 'txtNombre',
                            fieldLabel: "Nombre",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: nombre,
                            allowBlank: true,
                            maxLength: 100,
                            enforceMaxLength: true
                        }, {
                            xtype: 'textfield',
                            name: 'txtId_SAP',
                            id: 'txtId_SAP',
                            fieldLabel: "Id SAP",
                            allowBlank: true,
                            msgTarget: 'under',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: idSAP,
                            maxLength: 20,
                            enforceMaxLength: true
                        }, {
                            xtype: 'textfield',
                            name: 'txtSociedad_SAP',
                            id: 'txtSociedad_SAP',
                            fieldLabel: "Sociedad SAP",
                            allowBlank: true,
                            msgTarget: 'under',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: sociedadSAP,
                            msgTarget: 'under',
                            enforceMaxLength: true,
                            maxLength: 10
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
        var grp = Ext.getCmp('grp_Sociedad');
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
    var grid = pnl_sociedad.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Sociedad', 'grp_Sociedad', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');


}) //Termina funcion inicial
