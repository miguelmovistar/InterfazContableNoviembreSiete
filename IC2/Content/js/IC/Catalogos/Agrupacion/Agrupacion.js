// Nombre: Agrupacion.js
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de Agrupacion
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
    var sentido;
    var nivel;
    var etiqueta;
    var utilizacion;
    var Activo;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    /**********  MODELOS  **********/

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarAgrupacion',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Nivel', mapping: 'Nivel' },
                { name: 'Etiqueta', mapping: 'Etiqueta' },
                { name: 'Utilizacion', mapping: 'Utilizacion' }
            ]
        });

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costos" },
            { "id": "2", "sentido": "Ingresos" }
        ]
    });

    /**********  STORE  **********/

    //**********  Busca Agrupacion
    var store_BuscarAgrupacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAgrupacion',
        storeId: 'idstore_BuscarAgrupacion',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Agrupacion/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_Agrupacion');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    //**********  Borra Agrupacion
    var store_BorrarAgrupacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAgrupacion',
        storeId: 'idstore_BorrarAgrupacion',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Agrupacion/borrarAgrupacion',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Agrupacion');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == true) {
                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarAgrupacion.load();
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

    //**********  Modifica Agrupacion
    var store_ModificarAgrupacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAgrupacion',
        storeId: 'idstore_ModificarAgrupacion',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Agrupacion/modificarAgrupacion',
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
                    store_BuscarAgrupacion.load();
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
            url: '../' +  VIRTUAL_DIRECTORY + 'Agrupacion/validaModif',
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
                                ModificarAgrupacion();
                            }
                        }, this);
                    }
                    else {
                        ModificarAgrupacion();
                    }
                }
                else {
                    ModificarAgrupacion();
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
    //**********  Selecciona Agrupacion
    var store_seleccionarAgrupacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAgrupacion',
        storeId: 'idstore_seleccionarAgrupacion',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Agrupacion/buscarAgrupacion',
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
        store: store_BuscarAgrupacion,
        displayInfo: true,
        displayMsg: 'Agrupaciones {0} - {1} of {2}',
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
                        store_BuscarAgrupacion.pageSize = cuenta;
                        store_BuscarAgrupacion.load();
                    }
                }
            }
        ]
    });
    /**********  FORMAS  **********/

    var pnl_Agrupacion = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_Agrupacion',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Agrupaciones</div><br/>",
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarAgrupacion');
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
                            AgregarAgrupacion(rec);
                            var store = Ext.StoreManager.lookup('idstore_BuscarAgrupacion');
                            store.load();
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
                            ValidaModificar();
                            //ModificarAgrupacion();
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
                            var grp = Ext.getCmp('grp_Agrupacion');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_BorrarAgrupacion;
                                    store.getProxy().extraParams.strId = strID;
                                    store.load();
                                }
                            });
                            //store_Buscar.load();
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
                id: 'grp_Agrupacion',
                store: store_BuscarAgrupacion,
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
                                Ext.getCmp('btnEditar').setDisabled(false);
                                id = eOpts[0].data.Id;
                                sentido = eOpts[0].data.Sentido;
                                nivel = eOpts[0].data.Nivel;
                                etiqueta = eOpts[0].data.Etiqueta;
                                utilizacion = eOpts[0].data.Utilizacion;

                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarAgrupacion');
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
                        xtype: 'gridcolumn', text: "Sentido", dataIndex: 'Sentido', flex: 1, sortable: true, locked: false,
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },

                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nivel', flex: 1, locked: false, text: "Nivel",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nivel');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Utilizacion', flex: 1, locked: false, text: "Utilización",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Utilizacion');
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
        pnl_Agrupacion.setSize(w - 15, h - 255);
        pnl_Agrupacion.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_Agrupacion.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_Agrupacion.doComponentLayout();
    });

    function AgregarAgrupacion() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Agrupacion/agregarAgrupacion',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            id: id,
                                            sentido: Ext.getCmp('cmbSentido').value,
                                            nivel: Ext.getCmp('txtNivel').value,
                                            etiqueta: Ext.getCmp('txtEtiqueta').value,
                                            utilizacion: Ext.getCmp('txtUtilizacion').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarAgrupacion');

                                            store.getProxy().extraParams.Id = id;
                                            store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                            store.getProxy().extraParams.Nivel = Ext.getCmp('txtNivel').value;
                                            store.getProxy().extraParams.Etiqueta = Ext.getCmp('txtEtiqueta').value;
                                            store.getProxy().extraParams.Utilizacion = Ext.getCmp('txtUtilizacion').value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
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
                            xtype: 'textfield',
                            name: 'txtNivel',
                            id: 'txtNivel',
                            fieldLabel: "Nivel",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Nivel es requerido',
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtEtiqueta',
                            id: 'txtEtiqueta',
                            fieldLabel: "Etiqueta",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Etiqueta es requerido',
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtUtilizacion',
                            id: 'txtUtilizacion',
                            fieldLabel: "Utilización",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Utilización es requerido',
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
    function ModificarAgrupacion() {
        var frm_agregar = Ext.widget('form', {
            dockedItems: [
                {
                    xtype: 'panel',
                    id: 'tbBarra',
                    border: false,
                    flex: 1,
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            border: false,
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            handler: function () {
                                var store = Ext.StoreManager.lookup('idstore_ModificarAgrupacion');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                store.getProxy().extraParams.Nivel = Ext.getCmp('txtNivel').value;
                                store.getProxy().extraParams.Etiqueta = Ext.getCmp('txtEtiqueta').value;
                                store.getProxy().extraParams.Utilizacion = Ext.getCmp('txtUtilizacion').value;
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
                    id: 'fls_deudor',
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: "Sentido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            displayField: 'sentido',
                            valueField: 'sentido',
                            value: sentido,
                            id: "cmbSentido",
                            editable: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNivel',
                            id: 'txtNivel',
                            fieldLabel: "Nivel",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Nivel es requerido',
                            value: nivel,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtEtiqueta',
                            id: 'txtEtiqueta',
                            fieldLabel: "Etiqueta",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Etiqueta es requerido',
                            value: etiqueta,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtUtilizacion',
                            id: 'txtUtilizacion',
                            fieldLabel: "Utilización",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo Utilización es requerido',
                            value: utilizacion,
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
        var grp = Ext.getCmp('grp_Agrupacion');
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
    var grid = pnl_Agrupacion.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('Agrupacion', 'grp_Agrupacion', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

})