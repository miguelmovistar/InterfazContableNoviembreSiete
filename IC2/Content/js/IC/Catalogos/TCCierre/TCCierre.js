// Nombre: TCCierreController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de TCCierre
// Usuario que modifica:Jaíme Alfredo Ladrón de Guevara Herrero
// Ultima Fecha de modificación: 20/feb/2018

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
    var mesConsumo;
    var monedaOrigen;
    var tcMxn;
    var tcUsd;
    var tcCorp;
    var sentido;
    var Activo;
    var lineaNegocio = document.getElementById('idLinea').value; 
    /**********  MODELOS  **********/

    var extraParams = {};
    var campoTextoFiltrado = null;

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarTCCierre',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Mes_Consumo', mapping: 'Mes_Consumo' },
                { name: 'Mes_ConsumoFormato', mapping: 'Mes_ConsumoFormato' },
                { name: 'Moneda_Origen', mapping: 'Moneda_Origen' },
                { name: 'TC_MXN', mapping: 'TC_MXN' },
                { name: 'TC_USD', mapping: 'TC_USD' },
                { name: 'TC_CORPORATIVO', mapping: 'TC_CORPORATIVO' },
                { name: 'Sentido', mapping: 'Sentido' }
            ]
        });

    Ext.define('model_Moneda',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Descripcion', mapping: 'Descripcion' },
                { name: 'Moneda', mapping: 'Moneda' }
            ]
        });
    Ext.define('model_Sentido',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' }
            ]
        });

    /**********  STORE  **********/

    //**********  Busca TCCierre
    var store_BuscarTCCierre = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTCCierre',
        storeId: 'idstore_BuscarTCCierre',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TCCierre/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_TCCierre');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_Moneda = Ext.create('Ext.data.Store', {
        model: 'model_Moneda',
        storeId: 'idstore_Moneda',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TCCierre/llenaMoneda?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    //**********  Borra TCCierre
    var store_BorrarTCCierre = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTCCierre',
        storeId: 'idstore_BorrarTCCierre',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TCCierre/borrarTCCierre',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_TCCierre');
                var elements = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarTCCierre.load();

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

    //**********  Modifica TCCierre
    var store_ModificarTCCierre = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTCCierre',
        storeId: 'idstore_ModificarTCCierre',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TCCierre/modificarTCCierre',
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
                    store_BuscarTCCierre.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Aviso",
                        msg: request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Se modificó exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "La moneda " + request.proxy.reader.jsonData.dato + " no existe.",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    //**********  Selecciona TCCierre
    var store_seleccionarTCCierre = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTCCierre',
        storeId: 'idstore_seleccionarTCCierre',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TCCierre/buscarTCCierre',
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

    var store_Sentido = Ext.create('Ext.data.Store', {
        fields: ['Id', 'Sentido'],
        data: [
            { "Id": "1", "Sentido": "Costos" },
            { "Id": "2", "Sentido": "Ingresos" }
        ]
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
        store: store_BuscarTCCierre,
        displayInfo: true,
        displayMsg: 'TC Cierre {0} - {1} of {2}',
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
                        store_BuscarTCCierre.pageSize = cuenta;
                        store_BuscarTCCierre.load();
                    }
                }
            }
        ]
    });

    /**********  FORMAS  **********/
    var pnl_TCCierre = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_TCCierre',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>TC Cierre</div><br/>",
                border: false,
                width: '50%',
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarTCCierre');
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
                            AgregarTCCierre(rec);
                            if (lineaNegocio == 2)
                            {
                                var cmbSentido = Ext.getCmp('cmbSentidoA');
                                cmbSentido.setVisible(false);
                            }
                            var store = Ext.StoreManager.lookup('idstore_BuscarTCCierre');
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
                            ModificarTCCierre();
                            if (lineaNegocio == 2) {
                                var cmbSentido = Ext.getCmp('cmbSentido');
                                cmbSentido.setVisible(false);
                            }
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
                            var grp = Ext.getCmp('grp_TCCierre');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_BorrarTCCierre;
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
                border: false
            },
            {
                xtype: 'gridpanel',
                id: 'grp_TCCierre',
                store: store_BuscarTCCierre,
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
                                mesConsumo = eOpts[0].data.Mes_Consumo;
                                monedaOrigen = eOpts[0].data.Moneda_Origen;
                                tcMxn = eOpts[0].data.TC_MXN;
                                tcUsd = eOpts[0].data.TC_USD;
                                tcCorp = eOpts[0].data.TC_CORPORATIVO;
                                sentido = eOpts[0].data.Sentido;

                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarTCCierre');
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
                        xtype: "gridcolumn", sortable: true, align: 'right', dataIndex: 'Mes_ConsumoFormato', with: 200, flex: 1, locked: false, text: "Mes Consumo",
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
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        store_BuscarTCCierre.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarTCCierre.filter({
                                            property: 'Mes_ConsumoFormato',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }

                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, align: 'right', dataIndex: 'Moneda_Origen', width: 87, flex: 1, locked: false, text: "Moneda Origen",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Moneda_Origen');
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
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        store_BuscarTCCierre.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarTCCierre.filter({
                                            property: 'Moneda_Origen',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, dataIndex: 'TC_MXN', flex: 1, locked: false, text: "TC MXN",
                        format: '0.000000', align: 'right', width: 300,
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
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        store_BuscarTCCierre.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarTCCierre.filter({
                                            property: 'TC_MXN',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, dataIndex: 'TC_USD', flex: 1, locked: false, text: "TC USD",
                        format: '0.000000', align: 'right', width: 300,
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
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        store_BuscarTCCierre.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarTCCierre.filter({
                                            property: 'TC_USD',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", sortable: true, dataIndex: 'TC_CORPORATIVO', flex: 1, locked: false, text: "TC CORPORATIVO",
                        format: '0.000000', align: 'right', width: 300,
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
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        store_BuscarTCCierre.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarTCCierre.filter({
                                            property: 'TC_CORPORATIVO',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, align: 'center', dataIndex: 'Sentido', with: 200, flex: 1, locked: false, text: "Sentido",
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
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        store_BuscarTCCierre.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarTCCierre.filter({
                                            property: 'Sentido',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
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
        pnl_TCCierre.setSize(w - 15, h - 255);
        pnl_TCCierre.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_TCCierre.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_TCCierre.doComponentLayout();
    });

    function AgregarTCCierre() {
        var frm_agregar = Ext.create('Ext.form.Panel', {
            dockedItems: [
                {
                    xtype: 'panel',
                    id: 'panelAgregar',
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
                                    var paramSentido = '';
                                    if (lineaNegocio == 1) {
                                        paramSentido = Ext.getCmp('cmbSentidoA').value;
                                    }
                                    form.submit({
                                        url: '../' + VIRTUAL_DIRECTORY + 'TCCierre/agregarTCCierre',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Id: id,
                                            Mes_Consumo: Ext.getCmp('dtf_mesConsumo').value,
                                            Moneda_Origen: Ext.getCmp('cmbMoneda').value,
                                            TC_MXN: Ext.getCmp('txtTCMXN').value,
                                            TC_USD: Ext.getCmp('txtTCUSD').value,
                                            TC_CORPORATIVO: Ext.getCmp('txtTC_CORPORATIVO').value,
                                            Sentido: paramSentido,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarTCCierre');
                                            var paramSentido1 = '';
                                            if (lineaNegocio == 1) {
                                                paramSentido1 = Ext.getCmp('cmbSentidoA').value;
                                            }
                                            store.getProxy().extraParams.Id = id;
                                            store.getProxy().extraParams.Mes_Consumo = Ext.getCmp('dtf_mesConsumo').value;
                                            store.getProxy().extraParams.Moneda_Origen = Ext.getCmp('cmbMoneda').value;
                                            store.getProxy().extraParams.TC_MXN = Ext.getCmp('txtTCMXN').value;
                                            store.getProxy().extraParams.TC_USD = Ext.getCmp('txtTCUSD').value;
                                            store.getProxy().extraParams.TC_CORPORATIVO = Ext.getCmp('txtTC_CORPORATIVO').value;
                                            store.getProxy().extraParams.Sentido = paramSentido1;
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
                            id: 'dtf_mesConsumo',
                            name: 'dtf_mesConsumo',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Mes Consumo",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: 'El campo Mes Consumo es obligatorio',
                            msgTarget: 'under',
                            format: 'd-M-Y'
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Moneda Origen',
                            queryMode: 'remote',
                            valueField: 'Id',
                            displayField: 'Moneda',
                            store: store_Moneda,
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            blankText: 'El campo Moneda Origen es obligatorio',
                            anchor: '100%',
                            id: 'cmbMoneda'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTCMXN',
                            id: 'txtTCMXN',
                            fieldLabel: "TC MXN",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo TC MXN es obligatorio',
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTCUSD',
                            id: 'txtTCUSD',
                            fieldLabel: "TC USD",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo TC USD es obligatorio',
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTC_CORPORATIVO',
                            id: 'txtTC_CORPORATIVO',
                            fieldLabel: "TC CORPORATIVO",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Sentido',
                            queryMode: 'remote',
                            valueField: 'Sentido',
                            displayField: 'Sentido',
                            store: store_Sentido,
                            margin: '5 5 5 5',
                            editable: false,
                            anchor: '100%',
                            id: 'cmbSentidoA'
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

    if (lineaNegocio == 2)
    {
        var grid = Ext.getCmp('grp_TCCierre');
        grid.columns[6].setVisible(false);

        
    }

    //inicia funcion modificar
    function ModificarTCCierre() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarTCCierre');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Mes_Consumo = Ext.getCmp('dtf_mesConsumo').value;
                                store.getProxy().extraParams.Moneda_Origen = Ext.getCmp('cmbMoneda').value;
                                store.getProxy().extraParams.TC_MXN = Ext.getCmp('txtTCMXN').value;
                                store.getProxy().extraParams.TC_USD = Ext.getCmp('txtTCUSD').value;
                                store.getProxy().extraParams.TC_CORPORATIVO = Ext.getCmp('txtTC_CORPORATIVO').value;
                                if (lineaNegocio == 1) {
                                    store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                } else
                                {
                                    store.getProxy().extraParams.Sentido = '';
                                }
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
                    margin: '0 0 0 0',
                    id: 'fls_deudor',
                    items: [
                        {
                            id: 'dtf_mesConsumo',
                            name: 'dtf_mesConsumo',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Mes Consumo",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: 'El campo Mes Consumo es obligatorio',
                            msgTarget: 'under',
                            format: 'd-M-Y',
                            value: formatoFecha(mesConsumo)
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Moneda origen',
                            queryMode: 'remote',
                            valueField: 'Moneda',
                            displayField: 'Moneda',
                            store: store_Moneda,
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            blankText: 'El campo Moneda es obligatorio',
                            anchor: '100%',
                            id: 'cmbMoneda',
                            value: monedaOrigen
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTCMXN',
                            id: 'txtTCMXN',
                            fieldLabel: "TC MXN",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo TC MXN es obligatorio',
                            value: tcMxn,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTCUSD',
                            id: 'txtTCUSD',
                            fieldLabel: "TC txtTCUSD",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: 'El campo TC USD es obligatorio',
                            value: tcUsd,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTC_CORPORATIVO',
                            id: 'txtTC_CORPORATIVO',
                            fieldLabel: "TC CORPORATIVO",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: true,
                            value: tcCorp,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Sentido',
                            queryMode: 'remote',
                            valueField: 'Sentido',
                            displayField: 'Sentido',
                            store: store_Sentido,
                            margin: '5 5 5 5',
                            editable: false,
                            anchor: '100%',
                            id: 'cmbSentido',
                            value: sentido
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

    function formatoFecha(fecha) {
        var d_fecha = new Date(parseInt(fecha.substr(6)));
        return Ext.Date.format(d_fecha, 'd-M-Y');
    }

    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grp_TCCierre');
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
    var grid = pnl_TCCierre.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;


    permisosElementos('TCCierre', 'grp_TCCierre', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

})

