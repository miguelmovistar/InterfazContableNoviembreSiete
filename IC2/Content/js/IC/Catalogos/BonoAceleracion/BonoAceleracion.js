/* Nombre: Bono_Consumo.js  
* Creado por: Jaime ALfredo Ladrón de Guevara Herrero
* Fecha de Creación: 16/ene/2018
* Descripcion: Catalogo de Bonos por Consumo
* Modificado por: 
* Ultima Fecha de modificación:   
*/
Ext.define('CMS.view.FileDownload', {
    extend: 'Ext.Component',
    alias: 'widget.FileDownloader',
    autoEl: {
        tag: 'iframe',
        cls: 'x-hidden',
        src: Ext.SSL_SECURE_URL
    },
    stateful: false,
    load: function (config) {
        var e = this.getEl();
        e.dom.src = config.url +
            (config.params ? '?' + Ext.urlEncode(config.params) : '');
        e.dom.onload = function () {
            if (e.dom.contentDocument.body.childNodes[0].wholeText == '404') {
                Ext.Msg.show({
                    title: 'NO FUE POSIBLE GENERAR EL DOCUMENTO...',
                    msg: 'Por favor contacte al area de soporte para identificar el origen del problema.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                })
            }
        }
    }
});

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
    var idOperador;
    var operadorId;
    var operador;
    var factMin;
    var factMax;
    var bonoComPor;
    var fechainicio;
    var fechafin;
    var iBusca = 0;
    var store;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Operador', mapping: 'Id_Operador' },
                { name: 'OperadorId', mapping: 'OperadorId' },
                { name: 'FactMin', mapping: 'FactMin' },
                { name: 'FactMax', mapping: 'FactMax' },
                { name: 'BonoComPor', mapping: 'BonoComPor' },
                { name: 'FechaInicio', mapping: 'FechaInicio' },
                { name: 'FechaFin', mapping: 'FechaFin' },
                { name: 'Nombre', mapping: 'Nombre' }
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
            url: '../' + VIRTUAL_DIRECTORY + 'BonoAceleracion/llenaGrid?lineaNegocio=' + lineaNegocio,
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
            url: '../' + VIRTUAL_DIRECTORY + 'BonoAceleracion/borrar',
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

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_Buscar.load();
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
            url: '../' + VIRTUAL_DIRECTORY + 'BonoAceleracion/modificar',
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
                    title: "Aviso",
                    msg: request.proxy.reader.jsonData.results,
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
            url: '../' + VIRTUAL_DIRECTORY + 'BonoAceleracion/validaModif',
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

    var storeLlenaOperador = Ext.create('Ext.data.Store', {
        model: 'modeloOperador',
        storeId: 'idstore_llenaOperador',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'BonoAceleracion/llenaOperador?lineaNegocio=' + lineaNegocio,
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
        displayMsg: 'Bonos {0} - {1} of {2}',
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
                html: "<div style='font-size:25px';>Bonos de Aceleración</div><br/>",
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
                            "<button id='refresh' style='border:none' class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
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
                            ValidaModificar();
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
                                idOperador = eOpts[0].data.Id_Operador;
                                operadorId = eOpts[0].data.OperadorId;
                                operador = eOpts[0].data.Nombre;
                                factMin = eOpts[0].data.FactMin;
                                factMax = eOpts[0].data.FactMax;
                                bonoComPor = eOpts[0].data.BonoComPor;
                                fechainicio = eOpts[0].data.FechaInicio;
                                fechafin = eOpts[0].data.FechaFin;
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Id_Operador', flex: 1, locked: true, text: "Id Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Id_Operador');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txIdOperador',
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
                                            property: 'Id_Operador',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombre', flex: 1, locked: true, text: "Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nombre');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txOperador',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'FactMin', flex: 1, text: "Fact. Mínimo", locked: true,

                        editor: {
                            xtype: 'numberfield'
                        },
                        items:
                        {
                            xtype: 'numberfield',
                            id: 'txFactMin',
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
                                            property: 'FactMin',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'FactMax', flex: 1, locked: true, text: "Fact. Máximo",
                        editor: {
                            xtype: 'numberfield'
                        },
                        items:
                        {
                            xtype: 'numberfield',
                            id: 'txFactMax',
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
                                            property: 'FactMax',
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
                        xtype: "numbercolumn", align: 'right', format: '0.00', sortable: true, dataIndex: 'BonoComPor', flex: 1, locked: true, text: "Bono Comercial (%)",
                        editor: {
                            xtype: 'numberfield'
                        },
                        items:
                        {
                            xtype: 'numberfield',
                            id: 'txBonoComPor',
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
                                            property: 'BonoComPor',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaInicio', with: 200, locked: true, text: "Vigencia Inicio",
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaFin', with: 200, locked: true, text: "Vigencia Fin",

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
                                        url: '../' + VIRTUAL_DIRECTORY + 'BonoAceleracion/agregar',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Operador: Ext.getCmp('cmbOperador').value,
                                            FactMin: Ext.getCmp('txtFactMin').value,
                                            FactMax: Ext.getCmp('txtFactMax').value,
                                            BonoComPor: Ext.getCmp('txtBonoComPor').value,
                                            FechaInicio: Ext.getCmp('dtfechaInicio').value,
                                            FechaFin: Ext.getCmp('dtfechaFin').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            store_Buscar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                            store_Buscar.getProxy().extraParams.FactMin = Ext.getCmp('txtFactMin').value;
                                            store_Buscar.getProxy().extraParams.FactMax = Ext.getCmp('txtFactMax').value;
                                            store_Buscar.getProxy().extraParams.BonoComPor = Ext.getCmp('txtBonoComPor').value;
                                            store_Buscar.getProxy().extraParams.FechaInicio = Ext.getCmp('dtfechaInicio').value;
                                            store_Buscar.getProxy().extraParams.FechaFin = Ext.getCmp('dtfechaFin').value;
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
                    items:
                        [
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
                                xtype: 'numberfield',
                                name: 'txtFactMin',
                                id: 'txtFactMin',
                                fieldLabel: "Fact. Mínimo",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Fact. Mínimo es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under',
                                renderTo: Ext.getBody(),
                                minValue: 0.01,
                                minText: "El valor mínimo para este campo es {0}"
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtFactMax',
                                id: 'txtFactMax',
                                fieldLabel: "Fact. Máximo",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Fact. Máximo es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under',
                                minValue: 0.01,
                                minText: "El valor mínimo para este campo es {0}"
                            },
                            {
                                xtype: 'numberfield',
                                name: 'txtBonoComPor',
                                id: 'txtBonoComPor',
                                fieldLabel: "Bono Comercial (%)",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Bono Comercial (%) es requerido",
                                decimalPrecision: 2,
                                minValue: 0.01,
                                minText: "El valor mínimo para este campo es {0}",
                                msgTarget: 'under'
                            },
                            {
                                id: 'dtfechaInicio',
                                name: 'dtfechaInicio',
                                xtype: 'datefield',
                                margin: '5 5 5 5',
                                fieldLabel: "Vigencia Inicio",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                blankText: "El campo Vigencia Inicio es requerido",
                                msgTarget: 'under',
                                format: 'd-m-Y'
                            },
                            {
                                id: 'dtfechaFin',
                                name: 'dtfechaFin',
                                xtype: 'datefield',
                                margin: '5 5 5 5',
                                fieldLabel: "Vigencia Fin",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                blankText: "El campo Vigencia Fin es requerido",
                                msgTarget: 'under',
                                format: 'd-m-Y'
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
                                store_Modificar.getProxy().extraParams.Id_Operador = Ext.getCmp('cmbOperador').value;
                                store_Modificar.getProxy().extraParams.FactMin = Ext.getCmp('txtFactMin').value;
                                store_Modificar.getProxy().extraParams.FactMax = Ext.getCmp('txtFactMax').value;
                                store_Modificar.getProxy().extraParams.BonoComPor = Ext.getCmp('txtBonoComPor').value;
                                store_Modificar.getProxy().extraParams.FechaInicio = Ext.getCmp('dtfechaInicio').value;
                                store_Modificar.getProxy().extraParams.FechaFin = Ext.getCmp('dtfechaFin').value;
                                store_Modificar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store_Modificar.load();
                                //this.up('window').destroy();
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
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Operador es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: idOperador
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtFactMin',
                            id: 'txtFactMin',
                            fieldLabel: "Fact. Mínimo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Fact. Mínimo es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: factMin
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtFactMax',
                            id: 'txtFactMax',
                            fieldLabel: "Fact. Máximo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Fact. Máximo es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: factMax
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txtBonoComPor',
                            id: 'txtBonoComPor',
                            fieldLabel: "Bono Compra (%)",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Bono Compra (%) es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: bonoComPor
                        },
                        {
                            id: 'dtfechaInicio',
                            name: 'dtfechaInicio',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Vigencia Inicio",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Vigencia Inicio es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechainicio
                        },
                        {
                            id: 'dtfechaFin',
                            name: 'dtfechaFin',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Vigencia Fin",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Vigencia Fin es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            value: fechafin
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

    function ValidaModificar() {
        var store = Ext.StoreManager.lookup('idstore_ValidaModifica');
        store.getProxy().extraParams.Id = id;
        store.load();

    }


    permisosElementos('BonoAceleracion', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
