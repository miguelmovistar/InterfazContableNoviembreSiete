/* Nombre: Acuerdo_Grupo.js
*Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
*Fecha: 06/ene/2018 
*Descripcion: Catalogo de Acuerdos Grupo
*Ultima Fecha de modificación: -
*/

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
    var idAcuerdo;
    var idOperador;
    var idGrupo;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    /**********  MODELOS  **********/

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarAcuerdoGrupo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Acuerdo', mapping: 'Id_Acuerdo' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Id_Grupo', mapping: 'Id_Grupo' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'IdAcuerdo', mapping: 'IdAcuerdo' }

            ]
        });

    Ext.define('model_Acuerdo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Acuerdo', mapping: 'Id_Acuerdo' }
            ]
        });

    Ext.define('modeloOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Nombre', mapping: 'Nombre' }]
        });

    /**********  STORE  **********/

    //**********  Busca Acuerdo Grupo
    var store_BuscarAcuerdoGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcuerdoGrupo',
        storeId: 'idstore_BuscarAcuerdoGrupo',
        autoLoad: true,
        pageSize: 25,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_AcuerdoGrupo');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    //**********  Borra AcuerdoGrupo
    var store_BorrarAcuerdoGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcuerdoGrupo',
        storeId: 'idstore_BorrarAcuerdoGrupo',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/borrarAcuerdoGrupo',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_AcuerdoGrupo');
                var rec = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + rec.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarAcuerdoGrupo.load();
                if (request.action == 'ok') {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {

                if (!request.proxy.reader.jsonData.success) {

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

    //**********  Modifica AcuerdoGrupo
    var store_ModificarAcuerdoGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcuerdoGrupo',
        storeId: 'idstore_ModificarAcuerdoGrupo',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/modificarAcuerdoGrupo',
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
                    store_BuscarAcuerdoGrupo.load();
                }else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: "Notificación",
                    msg: request.proxy.reader.jsonData.mensaje,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    var storeLlenaGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcuerdoGrupo',
        storeId: 'idstore_llenaGrupo',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/llenaGrupo?lineaNegocio=' + lineaNegocio,
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
        model: 'modeloOperador',
        storeId: 'idstore_llenaOperador',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/llenaOperador?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaAcuerdoTarifa = Ext.create('Ext.data.Store', {
        model: 'model_Acuerdo',
        storeId: 'idstore_llenaAcuerdo',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/llenaAcuerdoTarifa?lineaNegocio=' + lineaNegocio,
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

    //**********  Selecciona AcuerdoGrupo
    var store_seleccionarAcuerdoGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcuerdoGrupo',
        storeId: 'idstore_seleccionarAcuerdoGrupo',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/buscarAcuerdoGrupo',
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
        store: store_BuscarAcuerdoGrupo,
        displayInfo: true,
        displayMsg: 'Acuerdos {0} - {1} of {2}',
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
                        store_BuscarAcuerdoGrupo.pageSize = cuenta;
                        store_BuscarAcuerdoGrupo.load();
                    }
                }
            }


        ]
    });

    /**********  FORMAS  **********/

    var pnl_AcuerdoGrupo = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_AcuerdoGrupo',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:20px';>Acuerdos Grupo</div><br/>",
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarAcuerdoGrupo');
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
                            AgregarAcuerdoGrupo(rec);
                            var store = Ext.StoreManager.lookup('idstore_BuscarAcuerdoGrupo');
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
                            ModificarAcuerdoGrupo();
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
                            var grp = Ext.getCmp('grp_AcuerdoGrupo');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s) ? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarAcuerdoGrupo');
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
                id: 'grp_AcuerdoGrupo',
                store: store_BuscarAcuerdoGrupo,
                width: '100%',
                margin: "0 0 0 10",
                height: "100%",
                flex: 1,
                bbar: paginador,
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                id = eOpts[0].data.Id;
                                idAcuerdo = eOpts[0].data.IdAcuerdo;
                                idOperador = eOpts[0].data.Id_Operador;
                                idGrupo = eOpts[0].data.Id_Grupo;
                                nombre = eOpts[0].data.Nombre;
                                grupo = eOpts[0].Grupo
                                /*
                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarAcuerdoGrupo');
                                storeSeleccion.getProxy().extraParams.Id = id;
                                storeSeleccion.load(); */
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'gridcolumn', text: "Acuerdo", dataIndex: 'Id_Acuerdo', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_Acuerdo');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'gridcolumn', text: "Grupo", dataIndex: 'Grupo', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Grupo');
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
        pnl_AcuerdoGrupo.setSize(w - 15, h - 255);
        pnl_AcuerdoGrupo.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_AcuerdoGrupo.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_AcuerdoGrupo.doComponentLayout();
    });

    function AgregarAcuerdoGrupo() {

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
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.wasValid) {
                                        form.submit({
                                            url: '../' + VIRTUAL_DIRECTORY + 'AcuerdoGrupo/agregarAcuerdoGrupo',
                                            waitMsg: "Nuevo",
                                            params:
                                            {
                                                Id_Acuerdo: Ext.getCmp('cmbAcuerdo').value,
                                                Id_Grupo: Ext.getCmp('cmbGrupo').value,
                                                Id_Operador: Ext.getCmp('cmbOperador').value,
                                                lineaNegocio: lineaNegocio
                                            },
                                            success: function (form, action) {

                                                var data = Ext.JSON.decode(action.response.responseText);
                                                var store = Ext.StoreManager.lookup('idstore_BuscarAcuerdoGrupo');

                                                // store.getProxy().extraParams.Id = id;
                                                store.getProxy().extraParams.Id_Acuerdo = Ext.getCmp('cmbAcuerdo').value;
                                                store.getProxy().extraParams.Id_Grupo = Ext.getCmp('cmbGrupo').value;
                                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                                store.getProxy().extraParams.Id_Operador = Ext.getCmp('cmbOperador').value;
                                                store.load();
                                                
                                                Ext.Msg.show({
                                                    title: "Confirmación",
                                                    msg: "El registro se agregó exitosamente",
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });

                                                if (data.results == "ok")
                                                    win.destroy();
                                            },
                                            failure: function (forms, action) {
                                                Ext.Msg.show({
                                                    title: "Notificación",
                                                    msg: action.result.mensaje,
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
                        id: 'fls_acuerdoGrupo',
                        items: [
                            {
                                xtype: 'combobox',
                                name: 'cmbAcuerdo',
                                id: 'cmbAcuerdo',
                                fieldLabel: "Acuerdo",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                blankText: "El campo Id Acuerdo es requerido",
                                msgTarget: 'under',
                                store: storeLlenaAcuerdoTarifa,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Id_Acuerdo}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Id_Acuerdo}',
                                    '</tpl>'
                                ),
                                valueField: 'Id'
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
                                name: 'cmbGrupo',
                                id: 'cmbGrupo',
                                fieldLabel: "Grupo",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                store: storeLlenaGrupo,
                                msgTarget: 'under',
                                blankText: "El campo Grupo es requerido",
                                editable: false,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Grupo}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Grupo}',
                                    '</tpl>'
                                ),
                                valueField: 'Id_Grupo'
                            }
                        ]
                    }
                ]
            });
        win = Ext.widget('window', {
            id: 'idWin',
            title: "Nuevo",
            closeAction: 'destroy',
            //layout: 'fit',
            layout: 'anchor',
            width: '24%',
            resizable: false,
            modal: true,
            items: frm_agregar
        });
        win.show();
    }

    //inicia funcion modificar
    function ModificarAcuerdoGrupo() {

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
                                var store = Ext.StoreManager.lookup('idstore_ModificarAcuerdoGrupo');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Id_Acuerdo = Ext.getCmp('cmbAcuerdo').value;
                                store.getProxy().extraParams.Id_Operador = Ext.getCmp('cmbOperador').value;
                                store.getProxy().extraParams.Id_Grupo = Ext.getCmp('cmbGrupo').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                lineaNegocio = lineaNegocio;
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
                            name: 'cmbAcuerdo',
                            id: 'cmbAcuerdo',
                            fieldLabel: "Acuerdo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Id Acuerdo es requerido",
                            msgTarget: 'under',
                            store: storeLlenaAcuerdoTarifa,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_Acuerdo}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_Acuerdo}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            value: idAcuerdo
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
                            name: 'cmbGrupo',
                            id: 'cmbGrupo',
                            fieldLabel: "Grupo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            store: storeLlenaGrupo,
                            msgTarget: 'under',
                            blankText: "El campo Grupo es requerido",
                            editable: false,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Grupo}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Grupo}',
                                '</tpl>'
                            ),
                            valueField: 'Id_Grupo',
                            value: idGrupo
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
        var grp = Ext.getCmp('grp_AcuerdoGrupo');
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

    // Parte de la logica de filtrado de grid
    var grid = pnl_AcuerdoGrupo.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('AcuerdoGrupo', 'grp_AcuerdoGrupo', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

})