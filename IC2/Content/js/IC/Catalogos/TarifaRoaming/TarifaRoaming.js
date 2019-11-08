
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
    'Ext.ux.*',
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border'
]);


Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;
    var id;
    var sentido;
    var direccion;
    var code;
    var grupo;
    var descripcion;
    var idOperador;
    var nombre;
    var fechaInicio;
    var fechaFin;
    var todata;
    var tosmsmo;
    var tovoicemo;
    var tovoicemt;
    var tfdata;
    var tfsmsmo;
    var tfvoicemo;
    var tfvoicemt;
    var iva;

    var iBusca = 0;
    var store;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Direccion', mapping: 'Direccion' },
                { name: 'Code', mapping: 'Code' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Descripcion', mapping: 'Descripcion' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'FechaInicio', mapping: 'FechaInicio' },
                { name: 'FechaFin', mapping: 'FechaFin' },
                { name: 'ToData', mapping: 'ToData' },
                { name: 'ToSMSMo', mapping: 'ToSMSMo' },
                { name: 'ToVoiceMo', mapping: 'ToVoiceMo' },
                { name: 'ToVoiceMt', mapping: 'ToVoiceMt' },
                { name: 'TfData', mapping: 'TfData' },
                { name: 'TfSMSMo', mapping: 'TfSMSMo' },
                { name: 'TfVoiceMo', mapping: 'TfVoiceMo' },
                { name: 'TfVoiceMt', mapping: 'TfVoiceMt' },
                { name: 'Grupo1', mapping: 'Grupo1' },
                { name: 'DescripcionGrupo', mapping: 'DescripcionGrupo' },
                { name: 'Iva', mapping: 'Iva' }
            ]
        });

    Ext.define('modeloGrupo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Descripcion', mapping: 'Descripcion' }]
        });

    Ext.define('modeloOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'Nombre', mapping: 'Nombre' }]
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

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costos" },
            { "id": "2", "sentido": "Ingresos" }
        ]
    });
    var storeDireccion = Ext.create('Ext.data.Store', {
        fields: ['id', 'direccion'],
        data: [
            { "id": "1", "direccion": "IB" },
            { "id": "2", "direccion": "OB" }
        ]
    });

    var storeTipoCatalogo = Ext.create('Ext.data.Store', {
        fields: ['id', 'Tipo'],
        data: [
            { "id": "1", "Tipo": "TODOS" },
            { "id": "2", "Tipo": "Origen" },
            { "id": "3", "Tipo": "Recalculo" }
        ]
    });

    var store_Buscar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_buscar',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/llenaGrid?lineaNegocio=' + lineaNegocio,
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

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/borrar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                Ext.MessageBox.show({
                    title: "Notificación",
                    msg: "Se eliminó correctamente",
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

                }
                else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
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
            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/modificar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

                Ext.MessageBox.show({
                    title: "Notificación",
                    msg: "Se modificó correctamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_Buscar.load();

                if (request.action == 'read') {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Ocurrió un error",
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
                        title: "Notificaciones",
                        msg: "Prueba",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_seleccionar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_seleccionar',

        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/buscar',
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


    var storeLlenaOperador = Ext.create('Ext.data.Store', {
        model: 'modeloOperador',
        storeId: 'idstore_llenaOperador',
        autoLoad: true,
        //pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/llenaOperador?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                //totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var storeLlenaGrupo = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_llenaGrupo',
        autoLoad: true,
        //pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/llenaGrupo?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                //totalProperty: 'total'
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
        displayMsg: 'Tarifas {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
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
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<h3>Tarifas</h3>",
                border: false
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
                            habilitarDeshabilitar("guardar");
                            iBusca = 0;
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
                            Agregar();
                            var store = Ext.StoreManager.lookup('idstore_buscar');
                            store.load();
                            habilitarDeshabilitar("guardar")
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary'  style='outline:none'>Editar</button>",
                        border: false,
                        margin: '0 0 0 -5',
                        disabled: true,
                        handler: function () {
                            Modificar();
                            habilitarDeshabilitar("guardar");
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
                            for (var i = 0; i < rec.length; i++)
                                strID = strID + rec[i].data.Id + ",";
                            Ext.MessageBox.confirm('Notificación', "¿Desea eliminar " + rec.length + " registro(s) ? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_Borrar');
                                    store.getProxy().extraParams.strID = strID;
                                    store.load();

                                }
                            });
                            store_Buscar.load();
                            habilitarDeshabilitar("guardar");

                        }
                    },
                    {
                        xtype: 'combobox',
                        name: 'cmbTipoCatalogo',
                        id: 'cmbTipoCatalogoid',
                        store: storeTipoCatalogo,
                        queryMode: 'remote',
                        fieldLabel: "Tipo Catálogo",
                        margin: '5 0 0 80',
                        //allowBlank: false,
                        msgTarget: 'under',
                        border: false,
                        editable: false,
                        labelWidth: 100,
                        tpl: Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<div class="x-boundlist-item">{Tipo}</div>',
                            '</tpl>'
                        ),
                        displayTpl: Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '{Tipo}',
                            '</tpl>'
                        ),
                        valueField: 'Tipo',
                        listeners: {
                            change: function (combo, nvalue) {
                                store_Buscar.getProxy().extraParams.TipoCatalogo = Ext.getCmp('cmbTipoCatalogoid').value;
                                store_Buscar.load();
                            }
                        }
                    },

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
                autoScroll: true,
                overflowX: 'auto',
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                habilitarDeshabilitar("editar");
                                id = eOpts[0].data.Id;
                                sentido = eOpts[0].data.Sentido;
                                direccion = eOpts[0].data.Direccion;
                                code = eOpts[0].data.Code;
                                descripcion = eOpts[0].data.Descripcion;
                                grupo = eOpts[0].data.Grupo;
                                idOperador = eOpts[0].data.Id_Operador;
                                nombre = eOpts[0].data.Nombre;
                                fechaInicio = eOpts[0].data.FechaInicio;
                                fechaFin = eOpts[0].data.FechaFin;
                                idTrafico = eOpts[0].data.Id_Trafico;
                                todata = eOpts[0].data.ToData;
                                tosmsmo = eOpts[0].data.ToSMSMo;
                                tovoicemo = eOpts[0].data.ToVoiceMo;
                                tovoicemt = eOpts[0].data.ToVoiceMt;
                                tfdata = eOpts[0].data.TfData;
                                tfsmsmo = eOpts[0].data.TfSMSMo;
                                tfvoicemo = eOpts[0].data.TfVoiceMo;
                                tfvoicemt = eOpts[0].data.TfVoiceMt;
                                iva == eOpts[0].data.Iva;
                                store_seleccionar.getProxy().extraParams.Id = id;

                                store_seleccionar.load();
                            }
                            else if (eOpts.length > 1) {
                                habilitarDeshabilitar("multiple");
                            }
                            else if (eOpts == 0)
                                habilitarDeshabilitar("guardar");
                        }
                    }
                },
                columns: [
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', width: 100, locked: true, text: "Sentido",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sentido');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSentido',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Sentido',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Direccion', width: 100, locked: true, text: "Direccion",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Direccion');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txDireccion',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Direccion',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Grupo', width: 100, text: "Code", locked: true,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Grupo');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCode',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                           listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Grupo',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombre', width: 100, locked: true, text: "Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nombre');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txNombre',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Nombre',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaInicio', with: 200, locked: true, text: "Fecha Inicio",
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
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'FechaInicio',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaFin', with: 200, locked: true, text: "Fecha Fin",

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
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'FechaFin',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'ToData', width: 100, text: "T. O. Data", locked: true,
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('ToData') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('ToData')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txToData',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'ToData',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'ToSMSMo', width: 100, locked: true, text: "T. O. SMS MO",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('ToSMSMo') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('ToSMSMo')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txToSMSMo',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'ToSMSMo',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'ToVoiceMo', width: 100, locked: true, text: "T. O. Voice MO",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('ToVoiceMo') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('ToVoiceMo')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txToVoiceMo',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'ToVoiceMo',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'ToVoiceMt', width: 100, locked: true, text: "T. O. Voice MT",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('ToVoiceMt') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('ToVoiceMt')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txToVoiceMt',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'ToVoiceMt',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'Iva', width: 100, locked: true, text: "IVA",
                        renderer: function (v, cellValues, rec) {
                            return parseFloat(rec.get('Iva') * 100).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txIva',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Iva',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'TfData', width: 100, text: "T. F. Data", locked: true,
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('TfData') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('TfData')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTfData',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TfData',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'TfSMSMo', width: 100, locked: true, text: "T. F. SMS MO",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('TfSMSMo') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('TfSMSMo')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTfSMSMo',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TfSMSMo',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'TfVoiceMo', width: 100, locked: true, text: "T. F. Voice MO",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('TfVoiceMo') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('TfVoiceMo')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTfVoiceMo',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TfVoiceMo',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", align: 'right', format: '0.000000', sortable: true, dataIndex: 'TfVoiceMt', width: 100, locked: true, text: "T. F. Voice MT",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('TfVoiceMt') < 0)
                                return 'Gross'
                            else
                                return parseFloat(rec.get('TfVoiceMt')).toFixed(6);
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTfVoiceMt',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TfVoiceMt',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
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
                                html: "<button class='btn btn-primary'  style='outline:none'>Guardar</button>",
                                border: false,
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.wasValid) {
                                        form.submit({
                                            url: '../' + VIRTUAL_DIRECTORY + 'TarifaRoaming/agregar',
                                            waitMsg: "Nuevo",
                                            params:
                                            {
                                                Sentido: Ext.getCmp('cmbSentido').value,
                                                Direccion: Ext.getCmp('cmbDireccion').value,
                                                Grupo: Ext.getCmp('cmbGrupo').value,
                                                Operador: Ext.getCmp('cmbOperador').value,
                                                FechaInicio: Ext.getCmp('dtfechaInicio').value,
                                                FechaFin: Ext.getCmp('dtfechaFin').value,
                                                TODATA: Ext.getCmp('txtTodata').value,
                                                TOSMSMO: Ext.getCmp('txtToSMSmO').value,
                                                TOVoiceMO: Ext.getCmp('txtToVoiceMo').value,
                                                TOVoiceMT: Ext.getCmp('txtToVoiceMt').value,
                                                TFDATA: Ext.getCmp('txtTfdata').value,
                                                TFSMSMO: Ext.getCmp('txtTfSMSmO').value,
                                                TFVoiceMO: Ext.getCmp('txtTfVoiceMo').value,
                                                TFVoiceMT: Ext.getCmp('txtTfVoiceMt').value,
                                                lineaNegocio: lineaNegocio
                                            },
                                            success: function (form, action) {
                                                var data = Ext.JSON.decode(action.response.responseText);
                                                store_Buscar.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                                store_Buscar.getProxy().extraParams.Direccion = Ext.getCmp('cmbDireccion').value;
                                                store_Borrar.getProxy().extraParams.Grupo = Ext.getCmp('cmbGrupo').value;
                                                store_Buscar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                                store_Buscar.getProxy().extraParams.fechaInicio = Ext.getCmp('dtfechaInicio').value;
                                                store_Buscar.getProxy().extraParams.fechaFin = Ext.getCmp('dtfechaFin').value;
                                                store_Buscar.getProxy().extraParams.TODATA = Ext.getCmp('txtTodata').value;
                                                store_Buscar.getProxy().extraParams.TOSMSMO = Ext.getCmp('txtToSMSmO').value;
                                                store_Buscar.getProxy().extraParams.TOVoiceMO = Ext.getCmp('txtToVoiceMo').value;
                                                store_Buscar.getProxy().extraParams.TOVoiceMT = Ext.getCmp('txtToVoiceMt').value;
                                                store_Buscar.getProxy().extraParams.TFDATA = Ext.getCmp('txtTfdata').value;
                                                store_Buscar.getProxy().extraParams.TFSMSMO = Ext.getCmp('txtTfSMSmO').value;
                                                store_Buscar.getProxy().extraParams.TFVoiceMO = Ext.getCmp('txtTfVoiceMo').value;
                                                store_Buscar.getProxy().extraParams.TFVoiceMT = Ext.getCmp('txtTfVoiceMt').value;
                                                store_Buscar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                                store_Buscar.load();
                                                var mensaje;
                                                if (data.results == "ok")
                                                    mensaje = "Se agregó correctamente";
                                                else
                                                    mensaje = "Fecha Inicio es MAYOR que Fecha Fin";
                                                Ext.Msg.show({
                                                    title: "Notificación",
                                                    msg: mensaje,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });
                                                //if (data.result == "ok")
                                                win.destroy();
                                            },
                                            failure: function (forms, action) {

                                                Ext.Msg.show({
                                                    title: "Notificación",
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
                        id: 'flsTarifa',
                        items:
                            [
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
                                    xtype: 'combobox',
                                    fieldLabel: "Dirección",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    store: storeDireccion,
                                    displayField: 'direccion',
                                    valueField: 'direccion',
                                    blankText: "El campo Direccion es requerido",
                                    msgTarget: 'under',
                                    id: "cmbDireccion",
                                    editable: false
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'cmbGrupo',
                                    id: 'cmbGrupo',
                                    fieldLabel: "Code",
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
                                    blankText: "El campo Code es requerido",
                                    msgTarget: 'under',
                                    editable: false
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
                                    id: 'dtfechaInicio',
                                    name: 'dtfechaInicio',
                                    xtype: 'datefield',
                                    editable: false,
                                    margin: '5 5 5 5',
                                    fieldLabel: "Fecha Inicio",
                                    anchor: '100%',
                                    editable: false,
                                    allowBlank: false,
                                    msgTarget: 'under',
                                    format: 'd-m-Y'
                                },
                                {
                                    id: 'dtfechaFin',
                                    name: 'dtfechaFin',
                                    xtype: 'datefield',
                                    editable: false,
                                    margin: '5 5 5 5',
                                    fieldLabel: "Fecha Fin",
                                    anchor: '100%',
                                    editable: false,
                                    allowBlank: false,
                                    msgTarget: 'under',
                                    format: 'd-m-Y'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtTodata',
                                    id: 'txtTodata',
                                    fieldLabel: "T. O. Data",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    msgTarget: 'under',
                                    blankText: "El campo T. O. Data es requerido",
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtToSMSmO',
                                    id: 'txtToSMSmO',
                                    fieldLabel: "T. O. SMS MO",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    blankText: "El campo T. O. SMS MO es requerido",
                                    msgTarget: 'under',
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtToVoiceMo',
                                    id: 'txtToVoiceMo',
                                    fieldLabel: "T. O. Voice MO",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    blankText: "El campo T. O. Voice MO es requerido",
                                    msgTarget: 'under',
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtToVoiceMt',
                                    id: 'txtToVoiceMt',
                                    fieldLabel: "T. O. Voice MT",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    blankText: "El campo T. O. Voice MT es requerido",
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    msgTarget: 'under',
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtTfdata',
                                    id: 'txtTfdata',
                                    fieldLabel: "T. F. Data",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    blankText: "El campo T. F. Data es requerido",
                                    msgTarget: 'under',
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtTfSMSmO',
                                    id: 'txtTfSMSmO',
                                    fieldLabel: "T. F. SMS MO",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    blankText: "El campo T. F. SMS MO es requerido",
                                    msgTarget: 'under',
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtTfVoiceMo',
                                    id: 'txtTfVoiceMo',
                                    fieldLabel: "T. F. Voice MO",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    blankText: "El campo T. F. Voice MO es requerido",
                                    msgTarget: 'under',
                                    decimalPrecision: 6
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'txtTfVoiceMt',
                                    id: 'txtTfVoiceMt',
                                    fieldLabel: "T. F. Voice MT",
                                    anchor: '100%',
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    decimalSeparator: ".",
                                    hideTrigger: true,
                                    blankText: "El campo T. F. Voice MT es requerido",
                                    msgTarget: 'under',
                                    decimalPrecision: 6
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
        habilitarDeshabilitar("guardar");
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
                            html: "<button class='btn btn-primary'  style='outline:none'>Guardar</button>",
                            handler: function () {

                                store_Modificar.getProxy().extraParams.Id = id;
                                store_Modificar.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                store_Modificar.getProxy().extraParams.Direccion = Ext.getCmp('cmbDireccion').value;
                                store_Modificar.getProxy().extraParams.Grupo = Ext.getCmp('cmbGrupo').value;;
                                store_Modificar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                store_Modificar.getProxy().extraParams.FechaInicio = Ext.getCmp('dtfechaInicio').value;;
                                store_Modificar.getProxy().extraParams.FechaFin = Ext.getCmp('dtfechaFin').value;
                                store_Modificar.getProxy().extraParams.TODATA = Ext.getCmp('txtTodata').value;
                                store_Modificar.getProxy().extraParams.TOSMSMO = Ext.getCmp('txtToSMSmO').value;
                                store_Modificar.getProxy().extraParams.TOVoiceMO = Ext.getCmp('txtToVoiceMo').value;
                                store_Modificar.getProxy().extraParams.TOVoiceMT = Ext.getCmp('txtToVoiceMt').value;
                                store_Modificar.getProxy().extraParams.TFDATA = Ext.getCmp('txtTfdata').value;
                                store_Modificar.getProxy().extraParams.TFSMSMO = Ext.getCmp('txtTfSMSmO').value;
                                store_Modificar.getProxy().extraParams.TFVoiceMO = Ext.getCmp('txtTfVoiceMo').value;
                                store_Modificar.getProxy().extraParams.TfVoiceMt = Ext.getCmp('txtTfVoiceMt').value;
                                store_Modificar.getProxy().extraParams.lineaNegocio = lineaNegocio;

                                store_Modificar.load();
                                habilitarDeshabilitar("guardar");
                                this.up('window').destroy();
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
                    // border: 0,
                    frame: false,
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
                            editable: false,
                            value: sentido
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
                            editable: false,
                            value: direccion
                        },
                        //{
                        //    xtype: 'combobox',
                        //    name: 'cmbGrupo',
                        //    id: 'cmbGrupo',
                        //    fieldLabel: "Code",
                        //    anchor: '100%',
                        //    margin: '5 5 5 5',
                        //    store: storeLlenaGrupo,
                        //    //tpl: Ext.create('Ext.XTemplate',
                        //    //    '<tpl for=".">',
                        //    //    '<div class="x-boundlist-item">{Grupo1} - {DescripcionGrupo}</div>',
                        //    //    '</tpl>'
                        //    //),
                        //    //displayTpl: Ext.create('Ext.XTemplate',
                        //    //    '<tpl for=".">',
                        //    //    '{Grupo1} - {DescripcionGrupo}',
                        //    //    '</tpl>'
                        //    //),
                        //   // valueField: 'Id',
                        //    valueField: 'Grupo1',
                        //    displayField:'DescripcionGrupo',
                        //    allowBlank: false,
                        //    blankText: "El campo Code es requerido",
                        //    msgTarget: 'under',
                        //    editable: false,
                        //    value: grupo
                        //   // renderTo: Ext.getBody()
                        //},
                        {
                            xtype: 'combobox',
                            name: 'cmbGrupo',
                            id: 'cmbGrupo',
                            fieldLabel: "Code",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            queryMode: 'remote',
                            store: storeLlenaGrupo,
                            valueField: 'Grupo1',
                            displayField: 'DescripcionGrupo',
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
                            //  valueField: 'Grupo1',


                            allowBlank: false,
                            blankText: "El campo Code es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: grupo,
                            renderTo: Ext.getBody()
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
                            valueField: 'Id_Operador',
                            displayField: 'Nombre',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Operador es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: idOperador,
                            renderTo: Ext.getBody()
                        },
                        {
                            id: 'dtfechaInicio',
                            name: 'dtfechaInicio',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Inicio",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechaInicio
                        },
                        {
                            id: 'dtfechaFin',
                            name: 'dtfechaFin',
                            xtype: 'datefield',
                            editable: false,
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Fin",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechaFin
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTodata',
                            id: 'txtTodata',
                            fieldLabel: "T. O. Data",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. O. Data es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: todata
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtToSMSmO',
                            id: 'txtToSMSmO',
                            fieldLabel: "T. O. SMS MO",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. O. SMS MO es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tosmsmo
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtToVoiceMo',
                            id: 'txtToVoiceMo',
                            fieldLabel: "T. O. Voice MO",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. O. Voice MO es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tovoicemo
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtToVoiceMt',
                            id: 'txtToVoiceMt',
                            fieldLabel: "T. O. Voice MT",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo T. O. Voice MT es requerido",
                            decimalSeparator: ".",
                            hideTrigger: true,
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tovoicemt
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTfdata',
                            id: 'txtTfdata',
                            fieldLabel: "T. F. Data",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. F. Data es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tfdata
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTfSMSmO',
                            id: 'txtTfSMSmO',
                            fieldLabel: "T. F. SMS MO",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. F. SMS MO es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tfsmsmo
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTfVoiceMo',
                            id: 'txtTfVoiceMo',
                            fieldLabel: "T. F. Voice MO",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. F. Voice MO es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tfvoicemo
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtTfVoiceMt',
                            id: 'txtTfVoiceMt',
                            fieldLabel: "T. F. Voice MT",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo T. F. Voice MT es requerido",
                            msgTarget: 'under',
                            decimalPrecision: 6,
                            value: tfvoicemt
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
    function habilitarDeshabilitar(accion) {
        if (accion == "editar") {
            Ext.getCmp('btnEditar').setDisabled(false);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnGuardar').setDisabled(true);
        }
        else if (accion == "multiple") {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnGuardar').setDisabled(true);
        }

        else {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(true);
            Ext.getCmp('btnGuardar').setDisabled(false);
        }

    }

    permisosElementos('TarifaRoaming', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
