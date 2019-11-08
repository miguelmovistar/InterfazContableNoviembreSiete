
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
    var idTrafico;
    var cc;
    var area;
    var store;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Trafico_Id', mapping: 'Trafico_Id' },
                { name: 'TraficoDescripcion', mapping: 'TraficoDescripcion' },
                { name: 'CC', mapping: 'CC' },
                { name: 'Area_Funcional', mapping: 'Area_Funcional' }
            ]
        });

    Ext.define('modeloTrafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Trafico_Id', mapping: 'Trafico_Id' },
                { name: 'Descripcion', mapping: 'Descripcion' }]
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
            url: '../' + VIRTUAL_DIRECTORY + 'CentroCosto/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#panel_centro_costo');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CentroCosto/borrar',
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

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_Buscar.load();
                if (request.action == 'ok') {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {

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

    var store_Modificar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CentroCosto/modificar',
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
                    store_Buscar.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: 'Aviso',
                    msg: request.proxy.reader.jsonData.results,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
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
            url: '../' + VIRTUAL_DIRECTORY + 'CentroCosto/llenaTrafico?lineaNegocio=' + lineaNegocio,
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

    var paginador = new Ext.PagingToolbar({
        id: 'ptb_empresa',
        store: store_Buscar,
        displayInfo: true,
        displayMsg: 'Centro de Costos {0} - {1} of {2}',
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
                        store_Buscar.pageSize = cuenta;
                        store_Buscar.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'panel_centro_costo',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px;width:200px'>Centro de Costos</div><br/>",
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
                            var storeBuscar = Ext.StoreManager.lookup('idstore_buscar');
                            storeBuscar.load();
                            limpiarFiltros();
                            iBusca = 0;
                            store.clearFilter();
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
                            var store = Ext.StoreManager.lookup('idstore_buscar');
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
                            Modificar();
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
                            var grp = Ext.getCmp('grid');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++)
                                strID = strID + rec[i].data.Id + ",";

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
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                id = eOpts[0].data.Id;
                                //idOperador = eOpts[0].data.Operador_Id;
                                idTrafico = eOpts[0].data.Trafico_Id;
                                trafico = eOpts[0].data.TraficoDescripcion;
                                cc = eOpts[0].data.CC;
                                area = eOpts[0].data.Area_Funcional;
                                //valprueba = idOperador + " - " + trafico;
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'TraficoDescripcion', flex: 1, locked: false, text: "Tráfico",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('TraficoDescripcion');
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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CC', flex: 1, locked: false, text: "Centro de Costo",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CC');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCC',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Area_Funcional', flex: 1, locked: false, text: "Area Funcional",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Area_Funcional');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txArea_Funcional',
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'CentroCosto/agregar',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            //Operador: Ext.getCmp('cmbOperador').value,
                                            Trafico: Ext.getCmp('cmbTrafico').value,
                                            CC: Ext.getCmp('txtCC').value,
                                            Area_Funcional: Ext.getCmp('txtArea_Funcional').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            //store_Buscar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                            store_Borrar.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                            store_Buscar.getProxy().extraParams.CC = Ext.getCmp('txtCC').value;
                                            store_Buscar.getProxy().extraParams.Area_Funcional = Ext.getCmp('txtArea_Funcional').value;
                                            store_Buscar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store_Buscar.load();

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
                    id: 'flsTarifa',
                    border: 0,
                    frame: false,
                    items:
                        [
                            //{
                            //    xtype: 'combobox',
                            //    name: 'cmbOperador',
                            //    id: 'cmbOperador',
                            //    fieldLabel: "Operador",
                            //    anchor: '100%',
                            //    margin: '5 5 5 5',
                            //    store: storeLlenaOperador,
                            //    tpl: Ext.create('Ext.XTemplate',
                            //        '<tpl for=".">',
                            //        '<div class="x-boundlist-item">{Id_Operador} - {Nombre}</div>',
                            //        '</tpl>'
                            //    ),
                            //    displayTpl: Ext.create('Ext.XTemplate',
                            //        '<tpl for=".">',
                            //        '{Id_Operador} - {Nombre}',
                            //        '</tpl>'
                            //    ),
                            //    valueField: 'Id',
                            //    renderTo: Ext.getBody(),
                            //    allowBlank: false,
                            //    blankText: "El campo Operador es requerido",
                            //    msgTarget: 'under',
                            //    editable: false
                            //},
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
                                xtype: 'textfield',
                                name: 'txtCC',
                                id: 'txtCC',
                                fieldLabel: "Centro de Costo",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Centro de Costo es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtArea_Funcional',
                                id: 'txtArea_Funcional',
                                fieldLabel: "Area Funcional",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Area Funcional es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
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
                                store_Modificar.getProxy().extraParams.Id = id;
                                //store_Modificar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                store_Modificar.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                store_Modificar.getProxy().extraParams.CC = Ext.getCmp('txtCC').value;
                                store_Modificar.getProxy().extraParams.Area_Funcional = Ext.getCmp('txtArea_Funcional').value;
                                store_Modificar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store_Modificar.load();
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
                    border: 0,
                    frame: false,
                    items: [
                        //{
                        //    xtype: 'combobox',
                        //    name: 'cmbOperador',
                        //    id: 'cmbOperador',
                        //    fieldLabel: "Operador",
                        //    anchor: '100%',
                        //    margin: '5 5 5 5',
                        //    store: storeLlenaOperador,
                        //    tpl: Ext.create('Ext.XTemplate',
                        //        '<tpl for=".">',
                        //        '<div class="x-boundlist-item">{Id_Operador} - {Nombre}</div>',
                        //        '</tpl>'
                        //    ),
                        //    displayTpl: Ext.create('Ext.XTemplate',
                        //        '<tpl for=".">',
                        //        '{Id_Operador} - {Nombre}',
                        //        '</tpl>'
                        //    ),
                        //    valueField: 'Id',
                        //    renderTo: Ext.getBody(),
                        //    allowBlank: false,
                        //    blankText: "El campo Operador es requerido",
                        //    msgTarget: 'under',
                        //    editable: false,
                        //    value: idOperador
                        //},
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
                            xtype: 'textfield',
                            name: 'txtCC',
                            id: 'txtCC',
                            fieldLabel: "Centro de Costo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Centro de Costo es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: cc
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtArea_Funcional',
                            id: 'txtArea_Funcional',
                            fieldLabel: "Area Funcional",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Area Funcional es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: area
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

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('CentroCosto', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
