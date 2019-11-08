
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
    var idTrafico;
    var sentido;
    var descripcion;
    var idServicio;
    var id;
    var registroSeleccionado;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarTrafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Descripcion', mapping: 'Descripcion' },
                { name: 'Id_Servicio', mapping: 'Id_Servicio' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Nombre', mapping: 'Nombre' }
            ]
        });

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costos" },
            { "id": "2", "sentido": "Ingresos" }
        ]
    });

    Ext.define('modeloServicio',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'IdServicio', mapping: 'IdServicio' },
                { name: 'ServicioDesc', mapping: 'ServicioDesc' },
                { name: 'NombreServicio', mapping: 'NombreServicio' },
                { name: 'NombreCompleto', mapping: 'NombreCompleto' }
            ]
        });

    var store_BuscarTrafico = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTrafico',
        storeId: 'idstore_buscarTrafico',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Trafico/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_trafico');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var storeLlenaServicio = Ext.create('Ext.data.Store', {
        model: 'modeloServicio',
        storeId: 'idstore_llenaServicio',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Trafico/llenaServicio?lineaNegocio=' + lineaNegocio,
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

    var store_ModificarTrafico = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTrafico',
        storeId: 'idstore_ModificarTrafico',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Trafico/modificarTrafico',
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
                    store_BuscarTrafico.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    var mensaje = "";
                    if (request.proxy.reader.jsonData.results == "no")
                        mensaje = "El Id servicio no existe"
                    else
                        mensaje = "Ocurrió un error";
                    Ext.MessageBox.show({
                        title: "Notificacion",
                        msg: mensaje,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "ok") {

                    var store = Ext.StoreManager.lookup('idstore_ModificarTrafico');
                    store.getProxy().extraParams.Id_ServicioTr = Ext.getCmp('txtIdServicio').value;
                    store.getProxy().extraParams.Sentido = Ext.getCmp('txtSentido').value;
                    store.getProxy().extraParams.Descripcion = Ext.getCmp("txtDescripcion").value;
                    store.load();

                    Ext.MessageBox.show({
                        title: "Notificacion",
                        msg: "Se modificó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTrafico',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Trafico/validaModif',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grid');
                var elements = grp.getSelectionModel().getSelection();

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

    var store_BorrarTrafico = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTrafico',
        storeId: 'idstore_BorrarTrafico',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Trafico/borrarTrafico',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + registroSeleccionado + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_BuscarTrafico.load();
                }
                else {
                    this.readCallback(request);
                }
                //if (request.action == 'ok') {
                //    this.readCallback(request);
                //}
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.results.length != 4) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO8
                    });
                }
                else {
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
        store: store_BuscarTrafico,
        displayInfo: true,
        displayMsg: 'Traficos {0} - {1} of {2}',
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
                        store_BuscarTrafico.pageSize = cuenta;
                        store_BuscarTrafico.load();
                    }
                }
            }
        ]
    });

    var pnl_trafico = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_trafico',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Tráfico</div><br/>",
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
                            store_BuscarTrafico.load();
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
                            //  var rec = null;
                            Agregar();
                            store_BuscarTrafico.load();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary'  style='outline:none'>Editar</button>",
                        border: false,
                        disabled: true,
                        margin: '0 0 0 -5',
                        handler: function () {
                            ValidaModificar()
                            //Modificar();
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
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            registroSeleccionado = rec.length;
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s) ? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarTrafico');
                                    store.getProxy().extraParams.strID = strID;
                                    store.load();

                                }
                            });
                            store_BuscarTrafico.load();
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
                width: '100%',
                height: '100%',
                store: store_BuscarTrafico,
                bbar: paginador,
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                id = eOpts[0].data.Id;
                              
                                idTrafico = eOpts[0].data.Id_TraficoTR;
                                sentido = eOpts[0].data.Sentido;
                                descripcion = eOpts[0].data.Descripcion;
                                idServicio = eOpts[0].data.Id_Servicio;
                                servicio = eOpts[0].data.Servicio;
                               
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    { xtype: 'gridcolumn', hidden: true, text: "ID", dataIndex: "Id" },
                    {
                        xtype: 'gridcolumn', hidden: false, text: "Tráfico", flex: 1, dataIndex: 'Id_TraficoTR', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_TraficoTR');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', flex: 1, text: "Sentido", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sentido');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Descripcion', flex: 1, locked: false, text: "Descripción",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Descripcion');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Servicio', flex: 1, locked: false, text: "Servicio",
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
                    }
                ]
            }
        ],
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        pnl_trafico.setSize(w - 15, h - 255);
        pnl_trafico.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_trafico.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_trafico.doComponentLayout();
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
                            border: false,
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            handler: function () {
                                var form = this.up('form').getForm();
                                if (form.wasValid) {
                                    form.submit({
                                        url: '../' + VIRTUAL_DIRECTORY + 'Trafico/agregarTrafico',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Id_TraficoTR: Ext.getCmp("txtIdTrafico").value,
                                            Sentido: Ext.getCmp('cmbSentido').value,
                                            Descripcion: Ext.getCmp('txtDescripcion').value,
                                            Id_Servicio: Ext.getCmp('cmbServicio').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var mensaje = ""

                                            if (action.result.results == "ok") {
                                                mensaje = "El registro se agregó exitosamente";
                                            } else if (action.result.results == "no") {
                                                mensaje = "El servicio " + action.result.dato + " no existe";
                                            }

                                            var store = Ext.StoreManager.lookup('idstore_buscarTrafico');

                                            store.getProxy().extraParams.Id_TraficoTR = Ext.getCmp("txtIdTrafico").value;
                                            store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                            store.getProxy().extraParams.Descripcion = Ext.getCmp('txtDescripcion').value;
                                            store.getProxy().extraParams.Id_ServicioTr = Ext.getCmp('cmbServicio').value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store.load();

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
                    id: 'fls_trafico',
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'txtIdTrafico',
                            name: 'txtIdTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Tráfico es obligatorio',
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: "Sentido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            displayField: "sentido",
                            valueField: "sentido",
                            id: "cmbSentido",
                            flex: 1,
                            editable: false,
                            allowBlank: true,
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtDescripcion',
                            id: 'txtDescripcion',
                            fieldLabel: "Descripción",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
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
                                '<div class="x-boundlist-item">{NombreServicio} - {ServicioDesc}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{NombreServicio} - {ServicioDesc}',
                                '</tpl>'
                            ),
                            valueField: 'IdServicio',
                            displayField: 'ServicioDesc'
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarTrafico');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                store.getProxy().extraParams.Descripcion = Ext.getCmp('txtDescripcion').value;
                                store.getProxy().extraParams.Id_Servicio = Ext.getCmp('cmbServicio').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store.load();
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'fls_deudor',
                    width: '100%',
                    frame: false,
                    items: [
                        {
                            xtype: 'displayfield',
                            margin: '5 5 5 5',
                            abchor: '100%',
                            fieldLabel: 'ID',
                            value: idTrafico
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbSentido',
                            id: 'cmbSentido',
                            fieldLabel: "Sentido",
                            allowBlank: true,
                            msgTarget: 'under',
                            store: storeSentido,
                            valueField: 'sentido',
                            displayField: 'sentido',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: sentido,
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtDescripcion',
                            id: 'txtDescripcion',
                            fieldLabel: "Descripción",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: descripcion,
                            maxLength: 100,
                            enforceMaxLength: true,
                            allowBlank: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Servicio es requerido",
                            editable: false,
                            store: storeLlenaServicio,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{NombreServicio} - {ServicioDesc}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{NombreServicio} - {ServicioDesc}',
                                '</tpl>'
                            ),
                            renderTo: Ext.getBody(),
                            valueField: 'NombreServicio',
                            displayField: 'ServicioDesc',
                            value: idServicio
                        }
                    ]
                }
            ]
        });

        win = Ext.widget('window', {
            id: 'idWin',
            title: 'Editar',
            closeAction: 'destroy',
            layout: 'fit',
            width: '30%',
            resizable: false,
            modal: true,
            items: frm_modificar,
            border: false,
            frame: false
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
    var grid = pnl_trafico.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Trafico', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');


}) //Termina funcion inicial
