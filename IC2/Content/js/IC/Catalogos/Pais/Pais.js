/* Nombre: Pais.js
*Creado por: Jaime Alfredo Ladrón de Guevara Herrero
*Fecha: Junio
*Descripcion: Catalogo de Paises
*Modificado por: Jaime Alfredo Ladrón de Guevara Herrero
*Ultima Fecha de modificación: 11/julio/2019
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
    'Ext.tip.QuickTipManager'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var id;
    var plmn;
    var country;
    var texto;
    var lineaNegocio = document.getElementById('idLinea').value;

    Ext.define('model_BuscarPais',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'Country', mapping: 'Country' },
                { name: 'Texto', mapping: 'Texto' }
            ]
        });

    Ext.define('model_Grupo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Grupo', mapping: 'Grupo' }
            ]
        });

    var store_Grupo = Ext.create('Ext.data.Store', {
        model: 'model_Grupo',
        storeId: 'idstore_Grupo',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Pais/llenaGrupo?lineaNegocio=' + lineaNegocio,
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

    var store_BuscarPais = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPais',
        storeId: 'idstore_BuscarPais',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Pais/llenaGrid?lineaNegocio=' + lineaNegocio,
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

    var store_BorrarPais = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPais',
        storeId: 'idstore_BorrarPais',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Pais/borrarPais',
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
                store_BuscarPais.load();

                if (request.action == 'ok') {
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


    //var store_ModificarPais = Ext.create('Ext.data.Store', {
    //    model: 'model_BuscarPais',
    //    storeId: 'idstore_ModificarPais',
    //    autoLoad: false,
    //    proxy: {
    //        type: 'ajax',
    //        url: '../' + VIRTUAL_DIRECTORY + 'Pais/modificarPais',
    //        reader: {
    //            type: 'json',
    //            root: 'results'
    //        },
    //        actionMethods: {
    //            create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
    //        },
    //        afterRequest: function (request, success) {
    //            if (request.proxy.reader.jsonData.success) {
    //                Ext.MessageBox.show({
    //                    title: "Confirmación",
    //                    msg: "Se modificó exitosamente",
    //                    buttons: Ext.MessageBox.OK,
    //                    icon: Ext.MessageBox.INFO
    //                });
    //                Ext.getCmp('idWin').destroy();
    //                store_BuscarGrupo.load();
    //            } else {
    //                this.readCallback(request);
    //            }
    //        },
    //        readCallback: function (request) {
    //            Ext.MessageBox.show({
    //                title: "Aviso",
    //                msg: "Ocurrió un error",
    //                buttons: Ext.MessageBox.OK,
    //                icon: Ext.MessageBox.INFO
    //            });
    //        }
    //    }
    //});

    var store_ModificarPais = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPais',
        storeId: 'idstore_ModificarPais',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Pais/modificarPais',
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
                    store_BuscarPais.load();
                } else {
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
                } else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "tMensaje_Modificado",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "tMensaje_MovimientoConciliado",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPais',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Pais/validaModif',
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

    var store_seleccionarPais = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPais',
        storeId: 'idstore_seleccionarPais',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Pais/buscarPais',
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

    var obj_EventoSeleccionarFila = Ext.create('Ext.selection.RowModel',
        {
            listeners: {
                select: function (sm, record) {
                    var grpDeudor = Ext.getCmp('grp_Deudor');
                    var obj_FilaSeleccionada = grpDeudor.getSelectionModel().getSelection()[0];
                    id = obj_FilaSeleccionada.data.Id;
                    deudor = obj_FilaSeleccionada.data.Deudor;
                    nombre = obj_FilaSeleccionada.data.Nombre;

                    var storeSDeudor = Ext.StoreManager.lookup('idstore_seleccionarDeudor');
                    storeSDeudor.getProxy().extraParams.Id = id;
                    storeSDeudor.load();
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
        store: store_BuscarPais,
        displayInfo: true,
        displayMsg: 'Paises {0} - {1} of {2}',
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
                        store_BuscarPais.pageSize = cuenta;
                        store_BuscarPais.load();
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
                html: "<div style='font-size:25px';>Paises</div><br/>",
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarPais');
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
                            Agregar();
                            var store = Ext.StoreManager.lookup('idstore_BuscarPais');
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
                        ValidaModificar()
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
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ",
                                function (btn, text) {
                                    if (btn == 'yes') {
                                        var store = Ext.StoreManager.lookup('idstore_BorrarPais');
                                        store.getProxy().extraParams.strID = strID;
                                        store.load();
                                    }
                                }
                            );
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
                store: store_BuscarPais,
                bbar: paginador,
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                id = eOpts[0].data.Id;
                                plmn = eOpts[0].data.PLMN;
                                country = eOpts[0].data.Country;
                                texto = eOpts[0].data.Texto;

                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarPais');
                                storeSeleccion.getProxy().extraParams.Id = id;
                                storeSeleccion.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    { xtype: "gridcolumn", hidden: true, text: "ID", dataIndex: "Id" },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'PLMN', flex: 1, locked: true, text: "PLMN",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('PLMN');
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
                                    store_BuscarPais.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarPais.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarPais.filter({
                                            property: 'PLMN',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarPais.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Country', flex: 1, locked: true, text: "Country",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Country');
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
                                    store_BuscarPais.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarPais.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarPais.filter({
                                            property: 'Country',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarPais.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Texto', flex: 1, locked: true, text: "Región",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Texto');
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
                                    store_BuscarPais.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarPais.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarPais.filter({
                                            property: 'Texto',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarPais.clearFilter();
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Pais/agregarPais',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            id: id,
                                            plmn: Ext.getCmp('cmbGrupo').value,
                                            country: Ext.getCmp('txtCountry').value,
                                            texto: Ext.getCmp('txtTexto').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarPais');

                                            store.getProxy().extraParams.Id = id;
                                            store.getProxy().extraParams.PLMN = Ext.getCmp('cmbGrupo').value;
                                            store.getProxy().extraParams.Country = Ext.getCmp('txtCountry').value;
                                            store.getProxy().extraParams.Texto = Ext.getCmp('txtTexto').value;

                                            store.load();
                                            var mensaje;
                                            if (data.results == "ok") {
                                                mensaje = "El registro se agregó exitosamente";
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
                            fieldLabel: 'PLMN',
                            queryMode: 'remote',
                            valueField: 'Grupo',
                            displayField: 'Grupo',
                            store: store_Grupo,
                            margin: '5 5 5 5',
                            editable: false,
                            anchor: '100%',
                            id: 'cmbGrupo'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCountry',
                            id: 'txtCountry',
                            fieldLabel: "Country",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTexto',
                            id: 'txtTexto',
                            fieldLabel: "Región",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
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
    function Modificar() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarPais');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.PLMN = Ext.getCmp('cmbGrupo').value;
                                store.getProxy().extraParams.Country = Ext.getCmp('txtCountry').value;
                                store.getProxy().extraParams.Texto = Ext.getCmp('txtTexto').value;
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
                            xtype: 'combobox',
                            fieldLabel: 'PLMN',
                            queryMode: 'remote',
                            valueField: 'Grupo',
                            displayField: 'Grupo',
                            store: store_Grupo,
                            margin: '5 5 5 5',
                            editable: false,
                            anchor: '100%',
                            id: 'cmbGrupo',
                            value: plmn
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCountry',
                            id: 'txtCountry',
                            fieldLabel: "Country",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: country,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTexto',
                            id: 'txtTexto',
                            fieldLabel: "Región",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: texto,
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

    permisosElementos('Pais', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

}) //Termina funcion inicial
