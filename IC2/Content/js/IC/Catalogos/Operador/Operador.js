
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
    var Nombre;
    var Razon_Social;
    var Id_Grupo;
    var idDeudor;
    var idAcreedor;
    var idSociedad;
    var RFC;
    var Sociedad_GL;
    var Tipo_Operador;
    var id;
    var idOperador;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'Razon_Social', mapping: 'Razon_Social' },
                { name: 'Id_Grupo', mapping: 'Id_Grupo' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'Id_Deudor', mapping: 'Id_Deudor' },
                { name: 'Acreedor', mapping: 'Acreedor' },
                { name: 'Id_Acreedor', mapping: 'Id_Acreedor' },
                { name: 'RFC', mapping: 'RFC' },
                { name: 'Sociedad_GL', mapping: 'Sociedad_GL' },
                { name: 'Tipo_Operador', mapping: 'Tipo_Operador' },
                { name: 'Descripcion', mapping: 'Descripcion' },
                { name: 'DescripcionGrupo', mapping: 'DescripcionGrupo' },
                { name: 'Grupo1', mapping: 'Grupo1' },
                { name: 'Id_Sociedad', mapping: 'Id_Sociedad' },
                { name: 'NombreSociedad', mapping: 'NombreSociedad' },
                { name: 'NombreDeudor', mapping: 'NombreDeudor' },
                { name: 'NombreAcreedor', mapping: 'NombreAcreedor' }
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

    var store_BuscarOperador = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_buscarOperador',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_operador');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_BorrarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_BorrarEmpresa',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/borrarOperador',
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
                    store_BuscarOperador.load();
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
                else  if (!request.proxy.reader.jsonData.success) {

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

    var store_ModificarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/modificarOperador',
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
                    store_BuscarOperador.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Se modificó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Algunos datos no son válidos (" + request.proxy.reader.jsonData.dato + ")",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/validaModif',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

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

    var store_seleccionarEmpresa = Ext.create('Ext.data.Store', {
        model: 'model_BuscarEmpresa',
        storeId: 'idstore_seleccionarEmpresa',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/buscarOperador',
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
        store: store_BuscarOperador,
        displayInfo: true,
        displayMsg: 'Operadores {0} - {1} of {2}',
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
                        store_BuscarOperador.pageSize = cuenta;
                        store_BuscarOperador.load();
                    }
                }
            }


        ]
    });

    var storeLlenaGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_llenaGrupo',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/llenaGrupo?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaAcreedor = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_llenaAcreedor',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/llenaAcreedor?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaDeudor = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_llenaDeudor',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/llenaDeudor?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaSociedad = Ext.create('Ext.data.Store', {
        model: 'model_BuscarOperador',
        storeId: 'idstore_llenaSociedad',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Operador/llenaSociedad?lineaNegocio=' + lineaNegocio,
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

    var pnl_empresa = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_operador',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Operadores</div><br/>",
                border: false,
                margin: '0 0 0 10'
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '50%',
                border: false, items: [
                    {
                        xtype: 'button',
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none' class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var store = Ext.StoreManager.lookup('idstore_buscarOperador');
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
                            Agregar(rec);
                            var store = Ext.StoreManager.lookup('idstore_buscarOperador');
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
                            var grp = Ext.getCmp('grp_Empresa');
                            var rec = grp.getSelectionModel().getSelection();
                            var strID = "";
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ","
                            }

                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarEmpresa');
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
                id: 'grp_Empresa',
                store: store_BuscarOperador,
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
                                idOperador = eOpts[0].data.Id_Operador;
                                Nombre = eOpts[0].data.Nombre;
                                Razon_Social = eOpts[0].data.Razon_Social;
                                grupo = eOpts[0].data.Grupo;
                                Id_Grupo = eOpts[0].data.Id_Grupo;
                                idAcreedor = eOpts[0].data.Id_Acreedor;
                                acreedor = eOpts[0].data.Acreedor;
                                idDeudor = eOpts[0].data.Id_Deudor;
                                deudor = eOpts[0].data.Deudor;
                                idSociedad = eOpts[0].data.Id_Sociedad,
                                    RFC = eOpts[0].data.RFC;
                                Sociedad_GL = eOpts[0].data.Sociedad_GL;
                                Tipo_Operador = eOpts[0].data.Tipo_Operador;
                                nombreSociedad = eOpts[0].data.NombreSociedad;

                                var store = Ext.StoreManager.lookup('idstore_seleccionarEmpresa');
                                store.getProxy().extraParams.Id_Operador = idOperador;
                                store.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'gridcolumn', hidden: false, text: "Operador Id", dataIndex: 'Id_Operador', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_Operador');
                        },
                        editor: { xtype: 'textfield' },
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombre', flex: 1, text: "Nombre", locked: false,
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Razon_Social', flex: 1, locked: true, text: 'Razón Social', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Razon_Social');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'DescripcionGrupo', flex: 1, locked: true, text: 'Grupo', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('DescripcionGrupo');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Acreedor', flex: 1, locked: true, text: 'Acreedor', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Acreedor');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Deudor', flex: 1, locked: true, text: 'Deudor', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Deudor');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'RFC', flex: 1, locked: true, text: 'RFC', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('RFC');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }

                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NombreSociedad', flex: 1, locked: true, text: 'Sociedad', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('NombreSociedad');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sociedad_GL', flex: 1, locked: true, text: 'Sociedad GL', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sociedad_GL');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Tipo_Operador', flex: 1, locked: true, text: 'Tipo de Operador', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Tipo_Operador');
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
                                keyup: function () {
                                    campoTextoFiltrado = Help.filtrarColumna(this, paginador, extraParams);
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
        pnl_empresa.setSize(w - 15, h - 255);
        pnl_empresa.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_empresa.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_empresa.doComponentLayout();
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Operador/agregarOperador',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Id_Operador: Ext.getCmp("txtIdOperador").value,
                                            Nombre: Ext.getCmp("txtNombre").value,
                                            Razon_Social: Ext.getCmp("txtRazonSocial").value,
                                            Id_Grupo: Ext.getCmp("cmbGrupo").value,
                                            Id_Acreedor: Ext.getCmp("cmbAcreedor").value,
                                            Id_Deudor: Ext.getCmp("cmbDeudor").value,
                                            RFC: Ext.getCmp("txtRFC").value,
                                            Id_Sociedad: Ext.getCmp("cmbSociedad").value,
                                            Sociedad_GL: Ext.getCmp("txtSociedadGL").value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_buscarOperador');

                                            store.getProxy().extraParams.Id_Operador = Ext.getCmp('txtIdOperador').value;
                                            store.getProxy().extraParams.Nombre = Ext.getCmp('txtNombre').value;
                                            store.getProxy().extraParams.Razon_Social = Ext.getCmp('txtRazonSocial').value;
                                            store.getProxy().extraParams.Id_Grupo = Ext.getCmp('cmbGrupo').value;
                                            store.getProxy().extraParams.Id_Acreedor = Ext.getCmp("cmbAcreedor").value;
                                            store.getProxy().extraParams.Id_Deudor = Ext.getCmp("cmbDeudor").value;
                                            store.getProxy().extraParams.RFC = Ext.getCmp('txtRFC').value;
                                            store.getProxy().extraParams.Id_Sociedad = Ext.getCmp("cmbSociedad").value;
                                            store.getProxy().extraParams.Sociedad_GL = Ext.getCmp('txtSociedadGL').value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store.load();

                                            var mensaje;
                                            if (data.results == "ok") {
                                                mensaje = "El registro se agregó exitosamente";
                                            } else if (data.results == "no") {
                                                mensaje = "El operador: " + data.dato + " ya existe";
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
                            name: 'txtIdOperador',
                            id: 'txtIdOperador',
                            fieldLabel: "Operador Id",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El Operador Id es requerido",
                            msgTarget: 'under',
                            maxLength: 25,
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
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtRazonSocial',
                            id: 'txtRazonSocial',
                            fieldLabel: "Razón Social",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbGrupo',
                            id: 'cmbGrupo',
                            fieldLabel: "Grupo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaGrupo,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Grupo1} - {DescripcionGrupo}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Grupo1} - {DescripcionGrupo}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbAcreedor',
                            id: 'cmbAcreedor',
                            fieldLabel: "Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaAcreedor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Acreedor} - {NombreAcreedor}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Acreedor} - {NombreAcreedor}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDeudor',
                            id: 'cmbDeudor',
                            fieldLabel: "Deudor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaDeudor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Deudor} - {NombreDeudor}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Deudor} - {NombreDeudor}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtRFC',
                            id: 'txtRFC',
                            fieldLabel: "RFC",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbSociedad',
                            id: 'cmbSociedad',
                            fieldLabel: "Sociedad",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaSociedad,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_Sociedad} - {NombreSociedad}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_Sociedad} - {NombreSociedad}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Sociedad es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtSociedadGL',
                            id: 'txtSociedadGL',
                            fieldLabel: "Sociedad GL",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Sociedad GL es requerido",
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    var valor = this.value;

                                    if (valor == '9999' || valor == null || valor == '') {
                                        Ext.getCmp('dplTipoOperador').setValue('TERCERO');
                                    }
                                    else {
                                        Ext.getCmp('dplTipoOperador').setValue('INTERCO');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            id: 'dplTipoOperador',
                            fieldLabel: "Tipo de Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: "TERCERO"
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
                                var store = Ext.StoreManager.lookup('idstore_Modificar');
                                store.getProxy().extraParams.Id_Operador = idOperador;
                                store.getProxy().extraParams.Nombre = Ext.getCmp('txtNombre').value;
                                store.getProxy().extraParams.Razon_Social = Ext.getCmp('txtRazonSocial').value;
                                store.getProxy().extraParams.Id_Grupo = Ext.getCmp('cmbGrupo').value;
                                store.getProxy().extraParams.Id_Acreedor = Ext.getCmp('cmbAcreedor').value;
                                store.getProxy().extraParams.Id_Deudor = Ext.getCmp('cmbDeudor').value;
                                store.getProxy().extraParams.RFC = Ext.getCmp('txtRFC').value;
                                store.getProxy().extraParams.Id_Sociedad = Ext.getCmp('cmbSociedad').value;
                                store.getProxy().extraParams.Sociedad_GL = Ext.getCmp('txtSociedadGL').value;
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
                    id: 'fls_empresa',
                    items: [
                        {
                            xtype: 'displayfield',
                            name: 'dsIdOperador',
                            value: id,
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: idOperador
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNombre',
                            id: 'txtNombre',
                            fieldLabel: "Nombre",
                            allowBlank: false,
                            msgTarget: 'under',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: Nombre,
                            maxLength: 100,
                            enforceMaxLength: true,
                            blankText: "El campo Nombre es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtRazonSocial',
                            id: 'txtRazonSocial',
                            fieldLabel: "Razón Social",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: Razon_Social,
                            msgTarget: 'under',
                            allowBlank: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbGrupo',
                            id: 'cmbGrupo',
                            fieldLabel: "Grupo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaGrupo,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Grupo1} - {DescripcionGrupo}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Grupo1} - {DescripcionGrupo}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            displayField: 'DescripcionGrupo',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            value: Id_Grupo,
                            allowBlank: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbAcreedor',
                            id: 'cmbAcreedor',
                            fieldLabel: "Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaAcreedor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Acreedor} - {NombreAcreedor}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Acreedor} - {NombreAcreedor}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            displayField: 'NombreAcreedor',
                            value: idAcreedor,
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDeudor',
                            id: 'cmbDeudor',
                            fieldLabel: "Deudor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaDeudor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Deudor} - {NombreDeudor}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Deudor} - {NombreDeudor}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            displayField: 'NombreDeudor',
                            value: idDeudor,
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtRFC',
                            id: 'txtRFC',
                            fieldLabel: "RFC",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: RFC,
                            allowBlank: true,
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbSociedad',
                            id: 'cmbSociedad',
                            fieldLabel: "Sociedad",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaSociedad,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_Sociedad} - {NombreSociedad}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_Sociedad} - {NombreSociedad}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            displayField: 'NombreSociedad',
                            value: idSociedad,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Sociedad es obligatorio ",
                            editable: false
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtSociedadGL',
                            id: 'txtSociedadGL',
                            fieldLabel: "Sociedad GL",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: Sociedad_GL,
                            allowBlank: false,
                            blankText: "El campo Sociedad GL es obligatorio ",
                            msgTarget: 'under',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    var valor = this.value;

                                    if (valor == '9999' || valor == null || valor == '') {
                                        Ext.getCmp('dplTipoOperador').setValue('TERCERO');
                                    } else {
                                        Ext.getCmp('dplTipoOperador').setValue('INTERCO');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            id: 'dplTipoOperador',
                            fieldLabel: "Tipo de Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: Tipo_Operador
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
        store.getProxy().extraParams.Id = id;
        store.load();
    }

    // Parte de la logica de filtrado de grid
    var grid = pnl_empresa.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Operador', 'grp_Empresa', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
