// Nombre: Tarifa_Fee.js
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 14/dic/2018 
// Descripcion: Catalogo de Tarifa_Fee
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
    var Body = Ext.getBody();
    var id;
    var sociedad;
    var grupo;
    var trafico;
    var fee;
    var fechaInicio;
    var fechaFin;
    var tarifa;
    var porcentaje;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    /**********  MODELOS  **********/

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarTarifa_Fee',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sociedad', mapping: 'Sociedad' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'Fee', mapping: 'Fee' },
                { name: 'Fecha_Inicio', mapping: 'Fecha_Inicio' },
                { name: 'Fecha_Fin', mapping: 'Fecha_Fin' },
                { name: 'Tarifa', mapping: 'Tarifa' },
                { name: 'Porcentaje', mapping: 'Porcentaje' },
                { name: 'DescripcionGrupo', mapping: 'DescripcionGrupo' },
                { name: 'NombreSociedad', mapping: 'NombreSociedad' },
                { name: 'Descripcion', mapping: 'Descripcion' },
                { name: 'Id_Sociedad', mapping: 'Id_Sociedad' },
                { name: 'Grupo1', mapping: 'Grupo1' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Id_Grupo', mapping: 'Id_Grupo' },
                { name: 'Id_Trafico', mapping: 'Id_Trafico' }
            ]
        });

    /**********  STORE  **********/

    //**********  Busca Tarifa_Fee
    var store_BuscarTarifa_Fee = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_BuscarTarifa_Fee',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/llenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_Tarifa_Fee');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    //**********  Borra Tarifa_Fee
    var store_BorrarTarifa_Fee = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_BorrarTarifa_Fee',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/borrarTarifa_Fee',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Tarifa_Fee');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_BuscarTarifa_Fee.load();
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

    //**********  Modifica Tarifa_Fee
    var store_ModificarTarifa_Fee = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_ModificarTarifa_Fee',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/modificarTarifa_Fee',
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
                    store_BuscarTarifa_Fee.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Notificacion",
                        msg: "Se modificó exitosamente",
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
                        msg: "Algunos datos no existen (" + request.proxy.reader.jsonData.mensaje + " )",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/validaModif',
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
                                ModificarTarifa_Fee();
                            }
                        }, this);
                    }
                    else {
                        ModificarTarifa_Fee();
                    }
                }
                else {
                    ModificarTarifa_Fee();
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

    var storeLlenaSociedad = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_llenaSociedad',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/llenaSociedad?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaGrupo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_llenaGrupo',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/llenaGrupo?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaTrafico = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_llenaTrafico',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/llenaTrafico?lineaNegocio=' + lineaNegocio,
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

    //**********  Selecciona Tarifa_Fee
    var store_seleccionarTarifa_Fee = Ext.create('Ext.data.Store', {
        model: 'model_BuscarTarifa_Fee',
        storeId: 'idstore_seleccionarTarifa_Fee',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/buscarTarifa_Fee',
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
        store: store_BuscarTarifa_Fee,
        displayInfo: true,
        displayMsg: 'Tarifa Fee {0} - {1} of {2}',
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
                        store_BuscarTarifa_Fee.pageSize = cuenta;
                        store_BuscarTarifa_Fee.load();
                    }
                }
            }


        ]
    });

    /**********  FORMAS  **********/
    var pnl_Tarifa_Fee = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_Tarifa_Fee',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Tarifas Fee</div><br/>",
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarTarifa_Fee');
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
                            AgregarTarifa_Fee(rec);
                            var store = Ext.StoreManager.lookup('idstore_BuscarTarifa_Fee');
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
                            //ModificarTarifa_Fee();
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
                            var grp = Ext.getCmp('grp_Tarifa_Fee');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarTarifa_Fee');
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
                id: 'grp_Tarifa_Fee',
                store: store_BuscarTarifa_Fee,
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
                                sociedad = eOpts[0].data.Sociedad;
                                grupo = eOpts[0].data.Id_Grupo;
                                trafico = eOpts[0].data.Trafico;
                                fee = eOpts[0].data.Fee;
                                fechaInicio = eOpts[0].data.Fecha_Inicio;
                                fechaFin = eOpts[0].data.Fecha_Fin;
                                tarifa = eOpts[0].data.Tarifa;
                                porcentaje = eOpts[0].data.Porcentaje;

                                var storeSTarifa_Fee = Ext.StoreManager.lookup('idstore_seleccionarTarifa_Fee');
                                storeSTarifa_Fee.getProxy().extraParams.Id = id;
                                storeSTarifa_Fee.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    { xtype: 'gridcolumn', hidden: true, text: "ID", dataIndex: 'Id', flex: 1, sortable: true, locked: false },

                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NombreSociedad', flex: 1, locked: false, text: "Sociedad",
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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'DescripcionGrupo', flex: 1, locked: false, text: "Grupo",
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
                                keyup: function (c) {
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Descripcion', flex: 1, locked: false, text: "Trafico",
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Fee', flex: 1, locked: false, text: "Fee",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Fee');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Fecha_Inicio', flex: 1, locked: false, text: "Fecha Inicio",
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Fecha_Fin', flex: 1, locked: false, text: "Fecha Fin",
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Tarifa', flex: 1, locked: false, text: "Tarifa",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Tarifa');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Porcentaje', flex: 1, locked: false, text: "Porcentaje",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Porcentaje');
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
        pnl_Tarifa_Fee.setSize(w - 15, h - 255);
        pnl_Tarifa_Fee.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_Tarifa_Fee.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_Tarifa_Fee.doComponentLayout();
    });

    function AgregarTarifa_Fee() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Tarifa_Fee/agregarTarifa_Fee',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Sociedad: Ext.getCmp('cmbSociedad').value,
                                            Grupo: Ext.getCmp('cmbGrupo').value,
                                            Trafico: Ext.getCmp('cmbTrafico').value,
                                            Fee: Ext.getCmp('txtFee').value,
                                            Fecha_Inicio: Ext.getCmp('dtfFechaInicio').value,
                                            Fecha_Fin: Ext.getCmp('dtfFechaFin').value,
                                            Tarifa: Ext.getCmp('txtTarifa').value,
                                            Porcentaje: Ext.getCmp('txtPorcentaje').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarTarifa_Fee');

                                            store.getProxy().extraParams.Id = id;
                                            store.getProxy().extraParams.Sociedad = Ext.getCmp('cmbSociedad').value;
                                            store.getProxy().extraParams.Grupo = Ext.getCmp('cmbGrupo').value;
                                            store.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                            store.getProxy().extraParams.Fee = Ext.getCmp('txtFee').value;
                                            store.getProxy().extraParams.Fecha_Inicio = Ext.getCmp('dtfFechaInicio').value;
                                            store.getProxy().extraParams.Fecha_Fin = Ext.getCmp('dtfFechaFin').value;
                                            store.getProxy().extraParams.Tarifa = Ext.getCmp('txtTarifa').value;
                                            store.getProxy().extraParams.Porcentaje = Ext.getCmp('txtPorcentaje').value;
                                            store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store.load();

                                            var mensaje;
                                            if (action.result.results == "ok") {
                                                mensaje = "El registro se agregó correctamente";
                                            } else if (action.result.results == "no") {
                                                mensaje = "Algunos datos no son válidos (" + action.result.mensaje + " )";
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
                            allowBlank: false,
                            blankText: "El campo Sociedad es requerido",
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
                            allowBlank: false,
                            blankText: "El campo Grupo es requerido",
                            msgTarget: 'under',
                            editable: false
                        },
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
                            name: 'txtFee',
                            id: 'txtFee',
                            fieldLabel: "Fee",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Fee es requerido",
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            id: 'dtfFechaInicio',
                            name: 'dtfFechaInicio',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Inicio",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Fecha Inicio es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y'
                        },
                        {
                            id: 'dtfFechaFin',
                            name: 'dtfFechaFin',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Fin",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            blankText: "El campo Fecha Fin es requerido",
                            format: 'd-m-Y'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTarifa',
                            id: 'txtTarifa',
                            fieldLabel: "Tarifa",
                            anchor: '99%',
                            margin: '5 2 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Tarifa es requerido",
                            decimalPrecision: 6
                        },
                        {
                            xtype: 'fieldset',
                            margin: '0 0 3 -3',
                            id: 'fls_porcentaje',
                            layout: { type: 'hbox' },
                            border: false,
                            width: '100%',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'txtPorcentaje',
                                    id: 'txtPorcentaje',
                                    fieldLabel: "Porcentaje",
                                    margin: '0 0 0 -1',
                                    width: '96%',
                                    blankText: "El campo Porcentaje es requerido",
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    decimalPrecision: 3

                                },
                                {
                                    html: " "
                                },
                                {
                                    html: "%", border: false, width: '10%'
                                }
                            ]
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

    function ModificarTarifa_Fee() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarTarifa_Fee');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Sociedad = Ext.getCmp('cmbSociedad').value;
                                store.getProxy().extraParams.Grupo = Ext.getCmp('cmbGrupo').value;
                                store.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                store.getProxy().extraParams.Fee = Ext.getCmp('txtFee').value;
                                store.getProxy().extraParams.Fecha_Inicio = Ext.getCmp('dtfFechaInicio').value;
                                store.getProxy().extraParams.Fecha_Fin = Ext.getCmp('dtfFechaFin').value;
                                store.getProxy().extraParams.Tarifa = Ext.getCmp('txtTarifa').value;
                                store.getProxy().extraParams.Porcentaje = Ext.getCmp('txtPorcentaje').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio
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
                            value: sociedad,
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Sociedad es requerido"
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

                            renderTo: Ext.getBody(),
                            displayField: 'DescripcionGrupo',
                            valueField: 'Id',
                            value: grupo,
                            allowBlank: false,
                            blankText: "El campo Grupo es requerido",
                            msgTarget: 'under',
                            editable: false
                        },
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
                            renderTo: Ext.getBody(),
                            displayField: 'Descripcion',
                            valueField: 'Id',
                            value: trafico,
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Tráfico es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtFee',
                            id: 'txtFee',
                            fieldLabel: "Fee",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Fee es requerido",
                            value: fee,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            id: 'dtfFechaInicio',
                            name: 'dtfFechaInicio',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Inicio",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Fecha Inicio es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechaInicio
                        },
                        {
                            id: 'dtfFechaFin',
                            name: 'dtfFechaFin',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Fin",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Fecha Fin es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechaFin
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTarifa',
                            id: 'txtTarifa',
                            fieldLabel: "Tarifa",
                            anchor: '99%',
                            margin: '5 2 5 5',
                            allowBlank: false,
                            blankText: "El campo Tarifa es requerido",
                            value: tarifa,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            decimalPrecision: 6
                        },
                        {
                            xtype: 'fieldset',
                            margin: '0 0 2 -3',
                            id: 'fls_porcentaje',
                            layout: { type: 'hbox' },
                            border: false,
                            width: '70%',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'txtPorcentaje',
                                    id: 'txtPorcentaje',
                                    fieldLabel: "Porcentaje",
                                    margin: '0 0 0 -1',
                                    width: '96%',
                                    allowBlank: false,
                                    value: porcentaje,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    decimalPrecision: 3,
                                    blankText: "El compo Porcentaje es requerido"
                                },
                                {
                                    html: " "
                                },
                                {
                                    html: "  %", border: false
                                }
                            ]
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
        var grp = Ext.getCmp('grp_Tarifa_Fee');
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
    var grid = pnl_Tarifa_Fee.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('Tarifa_Fee', 'grp_Tarifa_Fee', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

})