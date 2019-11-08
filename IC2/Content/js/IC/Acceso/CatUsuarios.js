// Nombre: catUsuarios.js
// Creado por: Julio Cesar Rodriguez Ralda
// Fecha: 10/Oct/2019
// Descripcion: Catalogo de Moneda
// Usuario que modifica:
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
    var BodyCosto = Ext.getBody();
    var id;
    var idUsuario;
    var nombre;
    var aPaterno;
    var aMaterno;
    var idPerfil;
    var idLinea;
    var nombrePerfil;
    var nombreLinea;
    var paginaInicio;
    var IdMenu;
    var lineaNegocio = document.getElementById('idLinea').value;
    var obj = 'btnEditar';

    var extraParams = {};
    var campoTextoFiltrado = null;

    /**********  MODELOS  **********/

    //**********  Modelo de Busqueda
    Ext.define('model_BuscarUsuarios',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'IdUsuario', mapping: 'IdUsuario' },
                { name: 'Nombres', mapping: 'Nombres' },
                { name: 'ApellidoPaterno', mapping: 'ApellidoPaterno' },
                { name: 'ApellidoMaterno', mapping: 'ApellidoMaterno' },
                { name: 'NPerfil', mapping: 'NPerfil' },
                { name: 'NLinea', mapping: 'NLinea' },
                { name: 'IdPerfil', mapping: 'IdPerfil' },
                { name: 'IdRegLinea', mapping: 'IdRegLinea' },
                { name: 'FechaCreacion', mapping: 'FechaCreacion' },
                { name: 'FechaModificacion', mapping: 'FechaModificacion' },
                { name: 'paginaInicio', mapping: 'paginaInicio' },
                { name: 'IdMenu', mapping: 'IdMenu' }
            ]
        });

    //Ext.define('model_permiso',
    //    {
    //        extend: 'Ext.data.Model',
    //        fields: [
    //            { name: 'CanRead', mapping: 'CanRead' },
    //            { name: 'CanNew', mapping: 'CanNew' },
    //            { name: 'CanEdit', mapping: 'CanEdit' },
    //            { name: 'CanDelete', mapping: 'CanDelete' },
    //            { name: 'WriteLog', mapping: 'WriteLog' }
    //        ]
    //    });


    Ext.define('model_llenaPerfil',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Nombre', mapping: 'Nombre' }
            ]
        });

    Ext.define('model_llenaLinea',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'idLinea', mapping: 'idLinea' },
                { name: 'nombre', mapping: 'nombre' }
            ]
        });

    Ext.define('model_llenaPaginaInicio',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'IdMenu', mapping: 'IdMenu' },
                { name: 'paginaInicio', mapping: 'paginaInicio' }
            ]
        });

    /**********  STORE  **********/

    //**********  Busca
    var store_BuscarUsuario = Ext.create('Ext.data.Store', {
        model: 'model_BuscarUsuarios',
        storeId: 'idstore_BuscarUsuarios',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/llenaGrid',
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
                var panels = Ext.ComponentQuery.query('#pnl_Usuario');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    //var storePermiso = Ext.create('Ext.data.Store', {
    //    model: 'model_permiso',
    //    storeId: 'idstore_permiso',
    //    autoLoad: true,
    //    pageSize: 10,
    //    proxy: {
    //        type: 'ajax',
    //        url: '../' + VIRTUAL_DIRECTORY + 'Permisos/permisoControlador',
    //        reader: {
    //            type: 'json',
    //            root: 'results',
    //            successProperty: 'success',
    //            totalProperty: 'total'
    //        },
    //        extraParams: {
    //            nombreControlador:'CatUsuarios'
    //        },
    //        actionMethods: {
    //            create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
    //        },
    //        afterRequest: function (request, success) {
    //            if (request.proxy.reader.jsonData.success) {
    //                console.log('proceso ejecutado correctamente');
    //            } else {
    //                console.log('proceso no ejecutado correctamente');
    //            }

    //            if (request.proxy.reader.jsonData.CanRead==1) {
    //                Ext.getCmp(obj).hide();
    //            }


    //        }
    //    }

    //});

    var storeLlenaPerfil = Ext.create('Ext.data.Store', {
        model: 'model_llenaPerfil',
        storeId: 'idstore_llenaPerfil',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/llenaPerfil',
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


    var storeLlenaPaginaInicio = Ext.create('Ext.data.Store', {
        model: 'model_llenaPaginaInicio',
        storeId: 'idstore_llenaPaginaInicio',
        autoLoad: true,
        pageSize: 1000,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/obtieneMenu',
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


    var storeLlenaLinea = Ext.create('Ext.data.Store', {
        model: 'model_llenaLinea',
        storeId: 'idstore_llenaLinea',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/llenaLineaNegocio',
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



    //**********  Borra
    var store_BorrarUsuario = Ext.create('Ext.data.Store', {
        model: 'model_BuscarUsuarios',
        storeId: 'idstore_BorrarUsuario',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/borrar',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_Usuario');
                var elements = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarUsuario.load();

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

    //**********  Modifica
    var store_ModificarUsuario = Ext.create('Ext.data.Store', {
        model: 'model_BuscarUsuarios',
        storeId: 'idstore_ModificarUsuario',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/modifica',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
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
                    store_BuscarUsuario.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: tAvisoSistema,
                        msg: resultado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: tInformacionSistema,
                        msg: tMensaje_Modificado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "not") {
                    Ext.MessageBox.show({
                        title: tInformacionSistema,
                        msg: tMensaje_MovimientoConciliado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarUsuarios',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/validaModif',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
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
                                ModificarUsuario();
                            }
                        }, this);
                    }
                    else {
                        ModificarUsuario();
                    }
                }
                else {
                    ModificarUsuario();
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

    var store_seleccionarUsuario = Ext.create('Ext.data.Store', {
        model: 'model_BuscarUsuarios',
        storeId: 'idstore_seleccionarUsuario',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/buscarUsuario',
            reader: {
                type: 'json',
                root: 'results',
                totalProperty: 'total'
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
        store: store_BuscarUsuario,
        displayInfo: true,
        displayMsg: 'Usuarios {0} - {1} of {2}',
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
                        store_BuscarUsuario.pageSize = cuenta;
                        store_BuscarUsuario.load();
                    }
                }
            }
        ]
    });

    /**********  FORMAS  **********/
    var pnl_Usuario = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_Usuario',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Usuarios</div><br/>",
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
                            "<button id='refresh' style='border:none'  class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var store = Ext.StoreManager.lookup('idstore_BuscarUsuarios');
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
                            AgregarUsuario(rec);
                            var store = Ext.StoreManager.lookup('idstore_BuscarUsuarios');
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
                            var strID = "";
                            var grp = Ext.getCmp('grp_Usuario');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_BorrarUsuario;
                                    store.getProxy().extraParams.strId = strID;
                                    store.load();
                                }
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                        border: false,
                        disabled: true,
                        margin: '0 0 0 -5',
                        id: 'btnExportar',
                        disabled: false,
                        handler: function () {
                            Ext.Ajax.request({
                                url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/exportar',
                                method: 'POST',
                                contentType: false,
                                processData: false,
                                params: {

                                },
                                xhrFields: {
                                    responseType: 'blob'
                                },
                                success: function (response, contentType, xhr) {
                                    var filename = "";
                                    var disposition = response.getResponseHeader('Content-Disposition');

                                    if (disposition) {
                                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                                        var matches = filenameRegex.exec(disposition);
                                        if (matches !== null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                                    }
                                    try {
                                        var blob = new Blob([response.responseText], { type: contentType });
                                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                                            window.navigator.msSaveBlob(blob, filename);
                                        } else {
                                            var URL = window.URL || window.webkitURL;
                                            var downloadUrl = URL.createObjectURL(blob);
                                            if (filename) {
                                                var a = document.createElement("a");
                                                if (typeof a.download === 'undefined') {
                                                    window.location = downloadUrl;
                                                } else {
                                                    a.href = downloadUrl;
                                                    a.download = filename;
                                                    document.body.appendChild(a);
                                                    a.target = "_blank";
                                                    a.click();
                                                }
                                            } else {
                                                window.location = downloadUrl;
                                            }
                                        }

                                    } catch (ex) {
                                    }
                                },
                                failure: function (response) {
                                    console.log(response);
                                }
                            })
                        },
                    }
                ]
            },
            {
                html: "<br/>",
                border: 0
            },
            {
                xtype: 'gridpanel',
                id: 'grp_Usuario',
                store: store_BuscarUsuario,
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
                                idUsuario = eOpts[0].data.IdUsuario;
                                nombre = eOpts[0].data.Nombres;
                                aPaterno = eOpts[0].data.ApellidoPaterno;
                                aMaterno = eOpts[0].data.ApellidoMaterno;
                                idPerfil = eOpts[0].data.IdPerfil;
                                idLinea = eOpts[0].data.IdRegLinea;
                                nombrePerfil = eOpts[0].data.NPerfil;
                                nombreLinea = eOpts[0].data.NLinea;
                                paginaInicio = eOpts[0].data.paginaInicio;
                                IdMenu = eOpts[0].data.IdMenu;

                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionarUsuario');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'IdUsuario', flex: 1, locked: false, text: "IdUsuario",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('IdUsuario');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombres', flex: 1, locked: false, text: "Nombres",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nombres');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'ApellidoPaterno', flex: 1, locked: false, text: "Apellido Paterno",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('ApellidoPaterno');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'ApellidoMaterno', flex: 1, locked: false, text: "Apellido Materno",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('ApellidoMaterno');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NPerfil', flex: 1, locked: false, text: "Perfil",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('NPerfil');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NLinea', flex: 1, locked: false, text: "Linea",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('NLinea');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'paginaInicio', flex: 1, locked: false, text: "Pagina inicio",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('paginaInicio');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaCreacion', flex: 1, locked: false, text: "Fecha Creacion",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('FechaCreacion');
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaModificacion', flex: 1, locked: false, text: "Fecha Modificacion",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('FechaModificacion');
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
        renderTo: BodyCosto
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        pnl_Usuario.setSize(w - 15, h - 255);
        pnl_Usuario.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_Usuario.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_Usuario.doComponentLayout();
    });

    function AgregarUsuario() {
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'CatUsuarios/registra',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            idUsuario: Ext.getCmp('txtidUsuario').value,
                                            nombres: Ext.getCmp('txtnombres').value,
                                            aPaterno: Ext.getCmp('txtaPaterno').value,
                                            aMaterno: Ext.getCmp('txtaMaterno').value,
                                            idPerfil: Ext.getCmp('txtidPerfil').value,
                                            idLinea: Ext.getCmp('txtidLinea').value,
                                            IdMenu: Ext.getCmp('txtIdMenu').value
                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarUsuarios');

                                            store.getProxy().extraParams.idUsuario = Ext.getCmp('txtidUsuario').value;
                                            store.getProxy().extraParams.nombres = Ext.getCmp('txtnombres').value;
                                            store.getProxy().extraParams.aPaterno = Ext.getCmp('txtaPaterno').value;
                                            store.getProxy().extraParams.aMaterno = Ext.getCmp('txtaMaterno').value;
                                            store.getProxy().extraParams.idPerfil = Ext.getCmp('txtidPerfil').value;
                                            store.getProxy().extraParams.idLinea = Ext.getCmp('txtidLinea').value;

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
                            xtype: 'textfield',
                            name: 'txtidUsuario',
                            id: 'txtidUsuario',
                            fieldLabel: "Id Usuario",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Id usuario es requerido",
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtnombres',
                            id: 'txtnombres',
                            fieldLabel: "Nombres",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "Esta informacion es requerida",
                            msgTarget: 'under',
                            maxLength: 70,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtaPaterno',
                            id: 'txtaPaterno',
                            fieldLabel: "Apellido Paterno",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "Esta informacion es requerida",
                            msgTarget: 'under',
                            maxLength: 70,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtaMaterno',
                            id: 'txtaMaterno',
                            fieldLabel: "Apellido Materno",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "Esta informacion es requerida",
                            msgTarget: 'under',
                            maxLength: 70,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtidPerfil',
                            id: 'txtidPerfil',
                            fieldLabel: "Perfil",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaPerfil,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Perfil es requerido"
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtidLinea',
                            id: 'txtidLinea',
                            fieldLabel: "Linea",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaLinea,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{idLinea}-{nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{idLinea}-{nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Linea es requerido"
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtIdMenu',
                            id: 'txtIdMenu',
                            fieldLabel: "Pagina inicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaPaginaInicio,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{paginaInicio}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{paginaInicio}',
                                '</tpl>'
                            ),
                            valueField: 'IdMenu',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Pagina Inicio es requerido"
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

    function ModificarUsuario() {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarUsuario');
                                store.getProxy().extraParams.id = id;
                                store.getProxy().extraParams.idUsuario = Ext.getCmp('txtidUsuario2').value;
                                store.getProxy().extraParams.nombres = Ext.getCmp('txtnombres2').value;
                                store.getProxy().extraParams.aPaterno = Ext.getCmp('txtaPaterno2').value;
                                store.getProxy().extraParams.aMaterno = Ext.getCmp('txtaMaterno2').value;
                                store.getProxy().extraParams.idPerfil = Ext.getCmp('txtidPerfil2').value;
                                store.getProxy().extraParams.idLinea = Ext.getCmp('txtidLinea2').value;
                                store.getProxy().extraParams.IdMenu = Ext.getCmp('txtIdMenu2').value;
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
                            xtype: 'textfield',
                            name: 'txtidUsuario2',
                            id: 'txtidUsuario2',
                            fieldLabel: "Id Usuario",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Id usuario es requerido",
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true,
                            value: idUsuario
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtnombres2',
                            id: 'txtnombres2',
                            fieldLabel: "Nombres",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "Esta informacion es requerida",
                            msgTarget: 'under',
                            maxLength: 70,
                            enforceMaxLength: true,
                            value: nombre
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtaPaterno2',
                            id: 'txtaPaterno2',
                            fieldLabel: "Apellido Paterno",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "Esta informacion es requerida",
                            msgTarget: 'under',
                            maxLength: 70,
                            enforceMaxLength: true,
                            value: aPaterno
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtaMaterno2',
                            id: 'txtaMaterno2',
                            fieldLabel: "Apellido Materno",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "Esta informacion es requerida",
                            msgTarget: 'under',
                            maxLength: 70,
                            enforceMaxLength: true,
                            value: aMaterno
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtidPerfil2',
                            id: 'txtidPerfil2',
                            fieldLabel: "Perfil",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaPerfil,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Perfil es requerido",
                            value: idPerfil
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtidLinea2',
                            id: 'txtidLinea2',
                            fieldLabel: "Linea",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaLinea,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{idLinea}-{nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{idLinea}-{nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Linea es requerido",
                            value: idLinea
                        },
                        {
                            xtype: 'combobox',
                            name: 'txtIdMenu2',
                            id: 'txtIdMenu2',
                            fieldLabel: "Pagina Inicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaPaginaInicio,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{paginaInicio}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{paginaInicio}',
                                '</tpl>'
                            ),
                            valueField: 'IdMenu',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo pagina inicio es requerido",
                            value: IdMenu
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
        var grp = Ext.getCmp('grp_Usuario');
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
    var grid = pnl_Usuario.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('CatUsuarios', 'grp_Usuario', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');
})
