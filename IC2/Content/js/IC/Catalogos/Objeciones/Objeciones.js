/* Nombre: Objeciones.js
*Creado por: Jaime Alfredo Ladrón de Guevara Herrero
*Fecha: Enero
*Descripcion: Catalogo de Objeciones
*Modificado por: Jaime Alfredo Ladrón de Guevara Herrero
*Ultima Fecha de modificación: 11/julio/2019
*/

/// <reference path="../../../ux/grid/filtersfeature.js" />
/// <reference path="../../../ux/grid/filtersfeature.js" />

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
    var id;
    var sentido;
    var deudorAcreedor;
    var grupo;
    var importe;
    var sociedad;
    var trafico;
    var servicio;
    var longitud;
    var lineaNegocio = document.getElementById('idLinea').value;

    var extraParams = {};
    var campoTextoFiltrado = null;

    ///////////////////////////////////////// MODELO /////////////////////////////////
    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Sociedad', mapping: 'Sociedad' },
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'DeudorAcreedor', mapping: 'DeudorAcreedor' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Importe', mapping: 'Importe' },
                { name: 'Descripcion', mappint: 'Descripcion' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Id_Servicio', mapping: 'Id_Servicio' },
                { name: 'Servicio1', mapping: 'Servicio1' },
                { name: 'Id_Sociedad', mapping: 'Id_Sociedad' },
                { name: 'NombreSociedad', mapping: 'NombreSociedad' },
                { name: 'clave', mapping: 'clave' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'Grupo1', mapping: 'Grupo1' },
                { name: 'DescripcionTR', mapping: 'DescripcionTR' },
                { name: 'ServicioDesc', mapping: 'ServicioDesc' },
                { name: 'DescripcionGR', mapping: 'DescripcionGR' },
                { name: 'DescripcionGrupo', mapping: 'DescripcionGrupo' }
            ]
        });

    var pagSize = Ext.create('Ext.data.Store', {
        fields: ['id', 'size'],
        data: [
            { "id": "1", "size": "5" },
            { "id": "1", "size": "10" },
            { "id": "2", "size": "20" },
            { "id": "3", "size": "30" },
            { "id": "4", "size": "40" }
        ]
    });

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costos" },
            { "id": "2", "sentido": "Ingresos" }
        ]
    });

    var storeLlenaTrafico = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_llenaTrafico',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/LlenaTrafico?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaServicio = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_llenaServicio',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/LlenaServicio?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaSociedad = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_llenaSociedad',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/LlenaSociedad?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaDeudorAcreedor = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_llenaDeudorAcreedor',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/LlenaDeudorAcreedor?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaGrupo = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_llenaGrupo',
        autoLoad: true,        
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/LlenaGrupo?lineaNegocio=' + lineaNegocio,
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

    ////////////////////////////////////////// STORES //////////////////////////////////

    var store_Buscar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_buscar',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/llenaGrid?IdLineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            }
        },
        actionMethods: {
            create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
        },
        listeners: {
            load: function () {
                var panels = Ext.ComponentQuery.query('#pnl_objeciones');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_seleccionar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_seleccionar',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/buscar',
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

    var store_Modificar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/modificar',
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
                if (!request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: tAvisoSistema,
                        msg: resultado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Se  modificó exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else if (request.proxy.reader.jsonData.results == "no") {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Algunos datos no son válidos (" + request.proxy.reader.jsonData.mensaje + " )",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/validaModif',
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

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Objecion/borrar',
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
                //var grid = Ext.getCmp('grp_Empresa');
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
                        title: "Notificación",
                        msg: resultado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    // store_BuscarEmpresa.load();
                    //var grid = Ext.getCmp('grp_Empresa');
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

    ////////////////////////////////////// OBJETOS ////////////////////////////////////

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_Buscar,
        displayInfo: true,
        displayMsg: "Objeciones",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        listeners: {
            beforechange: function () {
                this.getStore().getProxy().extraParams = extraParams;
            }
        },
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '25 0 0 0',
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

    ///////////////////////////////////////////////////////// FORMAS //////////////////////////////////////

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_objeciones',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Objeciones</div><br/>",
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
                        border: false,
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none'  class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var store = Ext.StoreManager.lookup('idstore_buscar');
                            store.load();
                            store.clearFilter();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnGuardar',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<div class=btn-group>" +
                            "<button class='btn btn-primary' style='outline:none'>Nuevo</button></div>",
                        handler: function () {
                            Agregar();                        
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
                        html: "<button class='btn btn-primary'  style='outline:none'>Eliminar</button>",
                        border: false,
                        disabled: true,
                        handler: function () {
                            var strID = "";
                            var grp = Ext.getCmp('grid');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }

                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_Borrar;
                                    store.getProxy().extraParams.strId = strID;
                                    store.load();
                                }
                            });
                            //store_Buscar.load();
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
                                url: '../' + VIRTUAL_DIRECTORY + 'Objecion/ExportaCSV',
                                method: 'POST',
                                contentType: false,
                                processData: false,
                                params: {
                                    IdLineaNegocio: lineaNegocio
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
                border: false
            },
            {
                xtype: 'grid',
                id: 'grid',
                flex: 1,
                width: '100%',
                height: '100%',
                store: store_Buscar,
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
                                sentido = eOpts[0].data.Sentido;
                                trafico = eOpts[0].data.Trafico;
                                servicio = eOpts[0].data.Servicio;
                                sociedad = eOpts[0].data.Sociedad;
                                deudorAcreedor = eOpts[0].data.DeudorAcreedor;
                                grupo = eOpts[0].data.Grupo;
                                importe = eOpts[0].data.Importe;

                                var storeSeleccion = Ext.StoreManager.lookup('idstore_seleccionar');
                                storeSeleccion.getProxy().extraParams.Id = id;
                                storeSeleccion.load();
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                buffer: 500,
                columns:
                    [
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
                                id: "txSentido",
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
                            xtype: 'gridcolumn', text: "Tráfico", dataIndex: 'DescripcionTR', flex: 1, sortable: true, locked: false,
                            renderer: function (v, cellValues, rec) {
                                return rec.get('DescripcionTR');
                            },
                            editor: {
                                xtype: 'textfield'
                            },
                            //filter: {type:'string'}
                            items:
                            {
                                xtype: 'textfield',
                                id: "txDescripcion",
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
                            xtype: 'gridcolumn', text: "Servicio", dataIndex: 'ServicioDesc', flex: 1, sortable: true, locked: false,
                            renderer: function (v, cellValues, rec) {
                                return rec.get('ServicioDesc');
                            },
                            editor: {
                                xtype: 'textfield'
                            },
                            items:
                            {
                                xtype: 'textfield',
                                id: 'txServicio',
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
                            xtype: 'gridcolumn', text: "Sociedad", dataIndex: 'NombreSociedad', flex: 1, sortable: true, locked: false,
                            renderer: function (v, cellValues, rec) {
                                return rec.get('NombreSociedad');
                            },
                            editor: {
                                xtype: 'textfield'
                            },
                            items:
                            {
                                xtype: 'textfield',
                                id: 'txSociedad',
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
                            xtype: 'gridcolumn', text: "Deudor/Acreedor", dataIndex: 'DeudorAcreedor', flex: 1, sortable: true, locked: false,
                            renderer: function (v, cellValues, rec) {
                                return rec.get('DeudorAcreedor');
                            },
                            editor: {
                                xtype: 'textfield'
                            },
                            items:
                            {
                                xtype: 'textfield',
                                id: 'txDeudorAcreedor',
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
                            xtype: 'gridcolumn', text: "Grupo", dataIndex: 'DescripcionGR', flex: 1, sortable: true, locked: false,
                            renderer: function (v, cellValues, rec) {
                                return rec.get('DescripcionGR');
                            },
                            editor: {
                                xtype: 'textfield'
                            },
                            items:
                            {
                                xtype: 'textfield',
                                id: 'txGrupo',
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
                            xtype: 'numbercolumn', text: "Importe", dataIndex: 'Importe', flex: 1, sortable: true, locked: false, format: '0.00', align: 'right',
                            renderer: function (v, cellValues, rec) {
                                return rec.get('Importe');
                            },
                            editor: {
                                xtype: 'textfield'
                            },
                            items:
                            {
                                xtype: 'textfield',
                                id: 'txImporte',
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'Objecion/Nuevo?lineaNegocio=' + lineaNegocio,
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            Sentido: Ext.getCmp("cmbSentido").value,
                                            Sociedad: Ext.getCmp("cmbSociedad").value,
                                            Trafico: Ext.getCmp("cmbTrafico").value,
                                            Servicio: Ext.getCmp("cmbServicio").value,
                                            DeudorAcreedor: Ext.getCmp("cmbDeudorAcreedor").value,
                                            Grupo: Ext.getCmp("cmbGrupo").value,
                                            Importe: Ext.getCmp("txtImporte").value,
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_buscar');
                                            store.load();
                                            store.clearFilter();
                                            var mensaje;

                                            if (data.results == "ok") {
                                                mensaje = "El registro se agregó exitosamente";
                                            }
                                            else if (data.results === "no") {
                                                mensaje = "Algunos datos no son válidos (" + data.mensaje + ")";
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
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: "Sentido",
                            name: 'cmbSentido',
                            id: 'cmbSentido',
                            queryMode: 'local',
                            allowBlank: false,
                            blankText: "El campo Sentido es requerido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            displayField: 'sentido',
                            valueField: 'sentido',
                            editable: false,
                            listeners: {
                                change: function (combo, nvalue) {
                                    Ext.getCmp('cmbTrafico').reset();

                                    storeLlenaTrafico.getProxy().extraParams.sentido = Ext.getCmp('cmbSentido').value;

                                    storeLlenaTrafico.load();
                                }
                            }
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTrafico',
                            id: 'cmbTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            queryMode: 'remote',
                            store: storeLlenaTrafico,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_TraficoTR}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_TraficoTR}',
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
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaServicio,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_Servicio} - {Servicio}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_Servicio} - {Servicio}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Servicio es requerido",
                            msgTarget: 'under',
                            editable: false
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
                            allowBlank: false,
                            blankText: "El campo Sociedad es requerido",
                            msgTarget: 'under',
                            editable: false
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDeudorAcreedor',
                            id: 'cmbDeudorAcreedor',
                            fieldLabel: "Deudor/Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaDeudorAcreedor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'DeudorAcreedor',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Deudor/Acreedor es requerido",
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
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Descripcion}',
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
                            xtype: 'numberfield',
                            id: "txtImporte",
                            name: "txtImporte",
                            margin: "5 5 5 5",
                            flex: 1,
                            anchor: "100%",
                            fieldLabel: "Importe",
                            allowBlank: false,
                            msgTarget: 'under',
                            blankText: "El campo Importe es requerido",
                            hideTrigger: true
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
                                var store = Ext.StoreManager.lookup('idstore_Modificar');
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                store.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                store.getProxy().extraParams.Servicio = Ext.getCmp('cmbServicio').value;
                                store.getProxy().extraParams.Sociedad = Ext.getCmp('cmbSociedad').value;
                                store.getProxy().extraParams.DeudorAcreedor = Ext.getCmp('cmbDeudorAcreedor').value;
                                store.getProxy().extraParams.Grupo = Ext.getCmp('cmbGrupo').value;
                                store.getProxy().extraParams.Importe = Ext.getCmp('txtImporte').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store.load();
                                var storeBuscar = store_Buscar;
                                storeBuscar.load();
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
                            name: 'cmbSentido',
                            id: 'cmbSentido',
                            queryMode: 'remote',
                            allowBlank: false,
                            blankText: "El campo Sentido es requerido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            displayField: 'sentido',
                            valueField: 'sentido',
                            id: "cmbSentido",
                            editable: false,
                            listeners: {
                                change: function (combo, nvalue) {
                                    Ext.getCmp('cmbTrafico').reset();

                                    storeLlenaTrafico.getProxy().extraParams.sentido = Ext.getCmp('cmbSentido').value;

                                    storeLlenaTrafico.load();
                                }
                            }
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTrafico',
                            id: 'cmbTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            queryMode: 'remote',
                            store: storeLlenaTrafico,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'Id_TraficoTR',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Tráfico es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: trafico
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaServicio,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'Id_Servicio',
                            renderTo: Ext.getBody(),
                            value: servicio,
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Servicio es requerido"
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
                            valueField: 'Id_Sociedad',
                            value: sociedad,
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Sociedad es requerido"
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDeudorAcreedor',
                            id: 'cmbDeudorAcreedor',
                            fieldLabel: "Deudor/Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaDeudorAcreedor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'DeudorAcreedor',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Deudor/Acreedor es requerido",
                            value: deudorAcreedor,
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
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Descripcion}',
                                '</tpl>'
                            ),

                            renderTo: Ext.getBody(),
                            displayField: 'Descripcion',
                            valueField: 'Grupo',
                            value: grupo,
                            allowBlank: false,
                            blankText: "El campo Grupo es requerido",
                            msgTarget: 'under',
                            editable: false
                        },
                        {
                            xtype: 'numberfield',
                            id: "txtImporte",
                            name: "txtImporte",
                            margin: "5 5 5 5",
                            flex: 1,
                            anchor: "100%",
                            fieldLabel: "Importe",
                            allowBlank: false,
                            blankText: "El campo Importe es requerido",
                            msgTarget: 'under',
                            value: importe,
                            hideTrigger: true
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

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('Objecion', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

});
