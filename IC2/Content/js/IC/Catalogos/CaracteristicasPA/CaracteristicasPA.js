/* Nombre: CaracteristicasPA.js
*Creado por: Ivan Rios Sandoval
*Fecha: junio
*Descripcion: Catalogo Caracteristicas PA
 * Modificado por: Jaime Alfredo Ladrón de Guevara Herrero
*Ultima Fecha de modificación: 11/julio/2019
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

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;

    var id,
        sentido,
        codigoMaterial,
        descripcionMaterial,
        cuenta,
        subsegmentoPA,
        segmentoPA,
        producto,
        canal,
        bundle,
        trafico_Id,
        traficoDescripcion,
        subtipolinea,
        nlicencia,
        region,
        ambito;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'CodigoMaterial', mapping: 'CodigoMaterial' },
                { name: 'DescripcionMaterial', mapping: 'DescripcionMaterial' },
                { name: 'Cuenta', mapping: 'Cuenta' },
                { name: 'SubsegmentoPA', mapping: 'SubsegmentoPA' },
                { name: 'SegmentoPA', mapping: 'SegmentoPA' },
                { name: 'Producto', mapping: 'Producto' },
                { name: 'Canal', mapping: 'Canal' },
                { name: 'Bundle', mapping: 'Bundle' },
                { name: 'Trafico_Id', mapping: 'Trafico_Id' },
                { name: 'TraficoDescripcion', mapping: 'TraficoDescripcion' },
                { name: 'Subtipolinea', mapping: 'Subtipolinea' },
                { name: 'Nlicencia', mapping: 'Nlicencia' },
                { name: 'Region', mapping: 'Region' },
                { name: 'Ambito', mapping: 'Ambito' },
            ]
        });

    Ext.define('modelo_trafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Descripcion', mapping: 'Descripcion' }
            ]
        });

    Ext.define('modelo_CuentaRes',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'CuentaR', mapping: 'CuentaR' },
                { name: 'Codigo_Material', mapping: 'Codigo_Material' },
                { name: 'Material', mapping: 'Material' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Trafico_Id', mapping: 'Trafico_Id' },
                { name: 'TraficoDescripcion', mapping: 'TraficoDescripcion' }
            ]
        });

    var store_Buscar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_buscar',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/LlenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#panel_caracteristicasPA');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_ValidaCambios = Ext.create('Ext.data.Store', {
        storeId: 'idstore_valida',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/ValidaCambios',
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
                                modificarCaracteristica();
                            }
                        }, this);
                    }
                    else {
                        modificarCaracteristica();
                    }
                }
                else {
                    modificarCaracteristica();
                }
            },
            readCallback: function (request) {
                if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "InformacionSistema",
                        msg: "Se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                }
                else if (request.proxy.reader.jsonData.results == "not") {
                    Ext.MessageBox.show({
                        title: "InformacionSistema",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }

            }
        }
    });

    var store_Modificar = Ext.create('Ext.data.Store', {
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/ModificarCaracteristica',
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

    var store_Borrar = Ext.create('Ext.data.Store', {
        storeId: 'idstore_Borrar',
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/Borrar',
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
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.results.length != 4) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO8
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

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costos" },
            { "id": "2", "sentido": "Ingresos" }
        ]
    });

    var storeLlenaCuenta = Ext.create('Ext.data.Store', {
        model: 'modelo_CuentaRes',
        storeId: 'id_storeLlenaCuenta',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/LlenaCuenta?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaTrafico = Ext.create('Ext.data.Store', {
        model: 'modelo_trafico',
        storeId: 'idstore_llenaTrafico',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/LlenaTrafico?lineaNegocio=' + lineaNegocio,
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
        id: 'ptb_empresa',
        store: store_Buscar,
        displayInfo: true,
        displayMsg: 'Características PA {0} - {1} of {2}',
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
        itemId: 'panel_caracteristicasPA',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:20px';>Características PA</div><br/>",
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
                            storeBuscar.clearFilter();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnNuevo',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary' style='outline:none'>Nuevo</button>",
                        handler: function () {
                            Agregar();
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
                            validaCambios();
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
                                sentido = eOpts[0].data.Sentido;
                                codigoMaterial = eOpts[0].data.CodigoMaterial;
                                descripcionMaterial = eOpts[0].data.DescripcionMaterial;
                                cuenta = eOpts[0].data.Cuenta;
                                subsegmentoPA = eOpts[0].data.SubsegmentoPA;
                                segmentoPA = eOpts[0].data.SegmentoPA;
                                producto = eOpts[0].data.Producto;
                                canal = eOpts[0].data.Canal;
                                bundle = eOpts[0].data.Bundle;
                                traficoDescripcion = eOpts[0].data.TraficoDescripcion;
                                subtipolinea = eOpts[0].data.Subtipolinea;
                                nlicencia = eOpts[0].data.Nlicencia;
                                region = eOpts[0].data.Region;
                                ambito = eOpts[0].data.Ambito;
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    //Sentido
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
                            id: 'txSentido',
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
                    // codigo material
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CodigoMaterial', flex: 1, locked: false, text: "Código Material",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CodigoMaterial');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCodigoMaterial',
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
                    // descripcion material
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'DescripcionMaterial', flex: 1, locked: false, text: "Material",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('DescripcionMaterial');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txDescripcionMaterial',
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
                    //cuenta
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Cuenta', flex: 1, locked: false, text: "Cuenta Contable",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Cuenta');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCuenta',
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
                    //subsegmentopa
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'SubsegmentoPA', flex: 1, locked: false, text: "Subsegmento PA",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('SubsegmentoPA');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSubsegmentoPA',
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
                    //SegmentoPA
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'SegmentoPA', flex: 1, locked: false, text: "Segmento PA",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('SegmentoPA');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSegmentoPA',
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
                    //Producto
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Producto', flex: 1, locked: false, text: "Producto",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Producto');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txProducto',
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
                    //Canal
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Canal', flex: 1, locked: false, text: "Canal",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Canal');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCanal',
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
                    //Bundle
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Bundle', flex: 1, locked: false, text: "Bundle",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Bundle');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txBundle',
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
                    //trafico
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
                    //SubTipolinea
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Subtipolinea', flex: 1, locked: false, text: "Subtipo de Línea",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Subtipolinea');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSubtipolinea',
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
                    //licencia
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nlicencia', flex: 1, locked: false, text: "N° licencia",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nlicencia');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txNlicencia',
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
                    //Region
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Region', flex: 1, locked: false, text: "Región",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Region');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txRegion',
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
                    //Ambito
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Ambito', flex: 1, locked: false, text: "Ámbito",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Ambito');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txAmbito',
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

    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grid');
        var rec = grp.getSelectionModel().getSelection();

        if (rec.length == 0) {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(true);
            Ext.getCmp('btnNuevo').setDisabled(false);
        } else if (rec.length == 1) {
            Ext.getCmp('btnEditar').setDisabled(false);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnNuevo').setDisabled(true);
        } else {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnNuevo').setDisabled(true);
        }
    }

    //Agregar
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
                                var nCuenta = Ext.getCmp('cmbCuentaRes').valueModels[0].data.CuentaR;
                                var form = this.up('form').getForm();
                                if (form.wasValid) {
                                    form.submit({
                                        url: '../' + VIRTUAL_DIRECTORY + 'CaracteristicasPA/AgregarCaracteristicaPA',
                                        method: 'POST',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            idCuenta: Ext.getCmp('cmbCuentaRes').value,
                                            cuenta: nCuenta,
                                            sentido: Ext.getCmp('idcmbSentido').value,
                                            codMaterial: Ext.getCmp('idtxtCodMaterial').value,
                                            material: Ext.getCmp('idtxtMaterial').value,
                                            subsegmentoPA: Ext.getCmp('txtSubsegmentoPA').value,
                                            segmentoPA: Ext.getCmp('txtSegmentopa').value,
                                            producto: Ext.getCmp('txtProducto').value,
                                            canal: Ext.getCmp('txtCanal').value,
                                            bundle: Ext.getCmp('txtBundle').value,
                                            trafico: Ext.getCmp('idtxtTrafico').value,
                                            subtipoLinea: Ext.getCmp('txtSubtipolinea').value,
                                            licencia: Ext.getCmp('txtNlicencia').value,
                                            region: Ext.getCmp('txtRegion').value,
                                            ambito: Ext.getCmp('txtAmbito').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            Ext.Msg.show({
                                                title: "Confirmación",
                                                msg: "El registro se agregó exitosamente",
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                            win.destroy();

                                            var storeBuscar = Ext.StoreManager.lookup('idstore_buscar');
                                            storeBuscar.load();
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
                    id: 'flsNuevaCar',
                    border: 0,
                    frame: false,
                    items:
                        [
                            //CuentaResultados
                            {
                                xtype: 'combobox',
                                name: 'cmbCuentaRes',
                                id: 'cmbCuentaRes',
                                fieldLabel: "Cuenta Resultados",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaCuenta,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Id} - {Sentido} - {CuentaR} - {Codigo_Material} -{TraficoDescripcion}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Id} - {CuentaR}',
                                    '</tpl>'
                                ),
                                valueField: 'Id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Cuenta es requerido",
                                msgTarget: 'under',
                                editable: false,
                                listeners:
                                {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        var nValSentido = Ext.getCmp('cmbCuentaRes').valueModels[0].data.Sentido;
                                        Ext.getCmp('idcmbSentido').setValue(nValSentido);

                                        var nValCodMaterial = Ext.getCmp('cmbCuentaRes').valueModels[0].data.Codigo_Material;
                                        Ext.getCmp('idtxtCodMaterial').setValue(nValCodMaterial);

                                        var nValMaterial = Ext.getCmp('cmbCuentaRes').valueModels[0].data.Material;
                                        Ext.getCmp('idtxtMaterial').setValue(nValMaterial);
                                    }
                                }
                            },
                            //sentido
                            {
                                xtype: 'combobox',
                                fieldLabel: "Sentido",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeSentido,
                                displayField: 'sentido',
                                valueField: 'sentido',
                                id: "idcmbSentido",
                                readOnly: true,
                                editable: false,
                                allowBlank: false,
                                blankText: "El campo Sentido es requerido",
                            },
                            //código material
                            {
                                xtype: 'textfield',
                                name: 'txtCodMaterial',
                                id: 'idtxtCodMaterial',
                                fieldLabel: "Código Material",
                                readOnly: true,
                                msgTarget: 'under',
                                blankText: 'El campo Código Material es obligatorio',
                                anchor: '100%',
                                margin: '5 5 5 5'
                            },
                            //material
                            {
                                xtype: 'textfield',
                                name: 'txtMaterial',
                                id: 'idtxtMaterial',
                                fieldLabel: "Material",
                                readOnly: true,
                                msgTarget: 'under',
                                blankText: 'El campo Material es obligatorio',
                                anchor: '100%',
                                margin: '5 5 5 5'
                            },
                            //subsegmentopa
                            {
                                xtype: 'textfield',
                                name: 'txtSubsegmentoPA',
                                id: 'txtSubsegmentoPA',
                                fieldLabel: "Subsegmento PA",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo subsegmento PA es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //SegmentoPa
                            {
                                xtype: 'textfield',
                                name: 'txtSegmentopa',
                                id: 'txtSegmentopa',
                                fieldLabel: "Segmento Pa",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Segmento PA es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Producto
                            {
                                xtype: 'textfield',
                                name: 'txtProducto',
                                id: 'txtProducto',
                                fieldLabel: "Producto",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Producto es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Canal
                            {
                                xtype: 'textfield',
                                name: 'txtCanal',
                                id: 'txtCanal',
                                fieldLabel: "Canal",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Canal es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Bundle
                            {
                                xtype: 'textfield',
                                name: 'txtBundle',
                                id: 'txtBundle',
                                fieldLabel: "Bundle",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Bundle es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Trafico
                            {
                                xtype: 'textfield',
                                name: 'txtTrafico',
                                id: 'idtxtTrafico',
                                fieldLabel: "Tráfico",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Tráfico es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //SubtipoLinea
                            {
                                xtype: 'textfield',
                                name: 'txtSubtipolinea',
                                id: 'txtSubtipolinea',
                                fieldLabel: "Subtipo de línea",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Subtipo línea es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Licencia
                            {
                                xtype: 'textfield',
                                name: 'txtNlicencia',
                                id: 'txtNlicencia',
                                fieldLabel: "N° Licencia",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo N° Licencia es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Region
                            {
                                xtype: 'textfield',
                                name: 'txtRegion',
                                id: 'txtRegion',
                                fieldLabel: "Región",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Cuenta es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            //Ambito
                            {
                                xtype: 'textfield',
                                name: 'txtAmbito',
                                id: 'txtAmbito',
                                fieldLabel: "Ambito",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Ambito es requerido",
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

    //Cambios
    function validaCambios() {
        var store = Ext.StoreManager.lookup('idstore_valida');
        store.getProxy().extraParams.Id = id;
        store.load();
    }

    function modificarCaracteristica() {
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
                                var nCuenta = Ext.getCmp('cmbCuentaRes').valueModels[0].data.CuentaR;

                                store_Modificar.getProxy().extraParams.Id = id;                                                                
                                store_Modificar.getProxy().extraParams.idCuenta = Ext.getCmp('cmbCuentaRes').value;
                                store_Modificar.getProxy().extraParams.cuenta = nCuenta;
                                store_Modificar.getProxy().extraParams.sentido = Ext.getCmp('idcmbSentido').value;
                                store_Modificar.getProxy().extraParams.codMaterial = Ext.getCmp('idtxtCodMaterial').value;
                                store_Modificar.getProxy().extraParams.material = Ext.getCmp('idtxtMaterial').value;
                                store_Modificar.getProxy().extraParams.subsegmentoPA = Ext.getCmp('txtSubsegmentoPA').value;
                                store_Modificar.getProxy().extraParams.segmentoPA = Ext.getCmp('txtSegmentopa').value;
                                store_Modificar.getProxy().extraParams.producto = Ext.getCmp('txtProducto').value;
                                store_Modificar.getProxy().extraParams.canal = Ext.getCmp('txtCanal').value;
                                store_Modificar.getProxy().extraParams.bundle = Ext.getCmp('txtBundle').value;
                                store_Modificar.getProxy().extraParams.trafico = Ext.getCmp('idtxtTrafico').value;
                                store_Modificar.getProxy().extraParams.subtipolinea = Ext.getCmp('txtSubtipolinea').value;
                                store_Modificar.getProxy().extraParams.licencia = Ext.getCmp('txtNlicencia').value;
                                store_Modificar.getProxy().extraParams.region = Ext.getCmp('txtRegion').value;
                                store_Modificar.getProxy().extraParams.ambito = Ext.getCmp('txtAmbito').value;
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
                    id: 'fls_caracteristicas',
                    width: '100%',
                    border: 0,
                    frame: false,
                    items: [
                        //CuentaResultados
                        {
                            xtype: 'combobox',
                            name: 'cmbCuentaRes',
                            id: 'cmbCuentaRes',
                            fieldLabel: "Cuenta Resultados",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaCuenta,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id} - {Sentido} - {CuentaR} - {Codigo_Material} -{TraficoDescripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id} - {CuentaR}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            value: id,
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Cuenta es requerido",
                            msgTarget: 'under',
                            editable: false,
                            listeners:
                            {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var nValSentido = Ext.getCmp('cmbCuentaRes').valueModels[0].data.Sentido;
                                    Ext.getCmp('idcmbSentido').setValue(nValSentido);

                                    var nValCodMaterial = Ext.getCmp('cmbCuentaRes').valueModels[0].data.Codigo_Material;
                                    Ext.getCmp('idtxtCodMaterial').setValue(nValCodMaterial);

                                    var nValMaterial = Ext.getCmp('cmbCuentaRes').valueModels[0].data.Material;
                                    Ext.getCmp('idtxtMaterial').setValue(nValMaterial);

                                }
                            }
                        },
                        //sentido
                        {
                            xtype: 'combobox',
                            fieldLabel: "Sentido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            value: sentido,
                            displayField: 'sentido',
                            valueField: 'sentido',
                            id: "idcmbSentido",
                            readOnly: true,
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Sentido es requerido",
                        },
                        //código material
                        {
                            xtype: 'textfield',
                            name: 'txtCodMaterial',
                            id: 'idtxtCodMaterial',
                            fieldLabel: "Código Material",
                            readOnly: true,
                            msgTarget: 'under',
                            value: codigoMaterial,
                            blankText: 'El campo Código Material es obligatorio',
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        //material
                        {
                            xtype: 'textfield',
                            name: 'txtMaterial',
                            id: 'idtxtMaterial',
                            fieldLabel: "Material",
                            value: descripcionMaterial,
                            readOnly: true,
                            msgTarget: 'under',
                            blankText: 'El campo Material es obligatorio',
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        //subsegmentopa
                        {
                            xtype: 'textfield',
                            name: 'txtSubsegmentoPA',
                            id: 'txtSubsegmentoPA',
                            fieldLabel: "Subsegmento PA",
                            anchor: '100%',
                            value: subsegmentoPA,
                            margin: '5 5 5 5',
                            allowBlank: false,
                            hideTrigger: true,
                            blankText: "El campo subsegmento PA es requerido",
                            msgTarget: 'under'
                        },
                        //SegmentoPa
                        {
                            xtype: 'textfield',
                            name: 'txtSegmentopa',
                            id: 'txtSegmentopa',
                            fieldLabel: "Segmento Pa",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: segmentoPA,
                            hideTrigger: true,
                            blankText: "El campo Segmento PA es requerido",
                            msgTarget: 'under'
                        },
                        //Producto
                        {
                            xtype: 'textfield',
                            name: 'txtProducto',
                            id: 'txtProducto',
                            fieldLabel: "Producto",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: producto,
                            hideTrigger: true,
                            blankText: "El campo Producto es requerido",
                            msgTarget: 'under'
                        },
                        //Canal
                        {
                            xtype: 'textfield',
                            name: 'txtCanal',
                            id: 'txtCanal',
                            fieldLabel: "Canal",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: canal,
                            hideTrigger: true,
                            blankText: "El campo Canal es requerido",
                            msgTarget: 'under'
                        },
                        //Bundle
                        {
                            xtype: 'textfield',
                            name: 'txtBundle',
                            id: 'txtBundle',
                            fieldLabel: "Bundle",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: bundle,
                            hideTrigger: true,
                            blankText: "El campo Bundle es requerido",
                            msgTarget: 'under'
                        },
                        //Trafico
                        {
                            xtype: 'textfield',
                            name: 'txtTrafico',
                            id: 'idtxtTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: traficoDescripcion,
                            hideTrigger: true,
                            blankText: "El campo Tráfico es requerido",
                            msgTarget: 'under'
                        },

                        //SubtipoLinea
                        {
                            xtype: 'textfield',
                            name: 'txtSubtipolinea',
                            id: 'txtSubtipolinea',
                            fieldLabel: "Subtipo de línea",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: subtipolinea,
                            hideTrigger: true,
                            blankText: "El campo Subtipo línea es requerido",
                            msgTarget: 'under'
                        },
                        //Licencia
                        {
                            xtype: 'textfield',
                            name: 'txtNlicencia',
                            id: 'txtNlicencia',
                            fieldLabel: "N° Licencia",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: nlicencia,
                            hideTrigger: true,
                            blankText: "El campo N° Licencia es requerido",
                            msgTarget: 'under'
                        },
                        //Region
                        {
                            xtype: 'textfield',
                            name: 'txtRegion',
                            id: 'txtRegion',
                            fieldLabel: "Región",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: region,
                            hideTrigger: true,
                            blankText: "El campo Cuenta es requerido",
                            msgTarget: 'under'
                        },
                        //Ambito
                        {
                            xtype: 'textfield',
                            name: 'txtAmbito',
                            id: 'txtAmbito',
                            fieldLabel: "Ambito",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: ambito,
                            hideTrigger: true,
                            blankText: "El campo Ambito es requerido",
                            msgTarget: 'under'
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

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    permisosElementos('CaracteristicasPA', 'grid', 'btnNuevo', 'btnEditar', 'btnEliminar', 'log');

})
