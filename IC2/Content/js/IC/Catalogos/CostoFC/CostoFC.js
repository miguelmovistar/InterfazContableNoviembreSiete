//fecha: 30-08-2019
//descripcion: fmodificacion al JS de CostoFC

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
    var archivo;
    var idoperador;
    //var tipoOperador;
    //var operador;
    var idacreedor;
    //var acreedor;
    //var nombreProveedor;
    var idmoneda;
    //var moneda;
    var importe;
    var fechainicio;
    var fechafin;
    //var idcuentacontable;
    //var sociedad;
    var tipocambio;
    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_operador', mapping: 'id_operador' },
                { name: 'tipoOperador', mapping: 'tipoOperador' },
                { name: 'operador', mapping: 'operador' },
                { name: 'id_acreedor', mapping: 'id_acreedor' },
                { name: 'acreedor', mapping: 'acreedor' },
                { name: 'nombreProveedor', mapping: 'nombreProveedor' },
                { name: 'id_moneda', mapping: 'id_moneda' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'importe', mapping: 'importe' },
                { name: 'fechaInicio', mapping: 'fechaInicio' },
                { name: 'fechaFin', mapping: 'fechaFin' },
                //{ name: 'id_cuentaContable', mapping: 'id_cuentaContable' },
                { name: 'cuentaContable', mapping: 'cuentaContable' },
                { name: 'sociedad', mapping: 'sociedad' },
                { name: 'tipoCambio', mapping: 'tipoCambio' }
            ]
        });

    Ext.define('modeloOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_operador', mapping: 'id_operador' },
                { name: 'nombre', mapping: 'nombre' }
            ]
        });

    Ext.define('modeloAcreedor',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'acreedor', mapping: 'acreedor' },
                { name: 'nombreacreedor', mapping: 'nombreacreedor' }
            ]
        });

    Ext.define('modeloMoneda',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_moneda', mapping: 'id_moneda' },
                { name: 'moneda', mapping: 'moneda' }
            ]
        });

    Ext.define('modeloCuentaContable',
        {
            extend: 'Ext.data.Model',
            fields: [
                //{ name: 'id', mapping: 'id' },
                { name: 'cuenta', mapping: 'cuenta' }
            ]
        });


    Ext.define('modelPeriodo', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Id', mapping: 'Id' },
            { name: 'Periodo', mapping: 'Periodo' },
            { name: 'Fecha', mapping: 'Fecha' }
        ]
    });

    var storeLlenaGrid = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'Idstore_LlenaGrid',
        autoLoad: false,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaGrid',
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
                var panels = Ext.ComponentQuery.query('#panel_costofc');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    //Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
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

    var storePeriodo = Ext.create('Ext.data.Store', {
        model: 'modelPeriodo',
        storeId: 'idstore_llenaPeriodo',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaPeriodo?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaOperador = Ext.create('Ext.data.Store', {
        model: 'modeloOperador',
        storeId: 'idstore_llenaOperador',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaOperador?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'succes'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var storeLlenaAcreedor = Ext.create('Ext.data.Store', {
        model: 'modeloAcreedor',
        storeId: 'idstore_llenaAcreedor',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaAcreedor?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaMoneda = Ext.create('Ext.data.Store', {
        model: 'modeloMoneda',
        storeId: 'idstore_llenaMoneda',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaMoneda?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaCuentaContable = Ext.create('Ext.data.Store', {
        model: 'modeloCuentaContable',
        storeId: 'idstore_llenaCuentaContable',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenarCuenta?lineaNegocio=' + lineaNegocio,
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

    //Store_Borrar
    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/borrarCostoFC',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ect.getCmp('grid');
                var elements = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                storeLlenaGrid.load();

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
                }
                else if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "El registro se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
                else {
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

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: storeLlenaGrid,
        displayInfo: true,
        displayMsg: "Costos Fijos Recurrentes",
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
                        storeLlenaGrid.pageSize = cuenta;
                        storeLlenaGrid.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'panel_costofc',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Costos Fijos Recurrentes</div><br/>",
                border: false,
                margin: '0 0 0 10',
                width: '100%',
                height: 35
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '50%',
                border: false,
                margin: '0 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none'  class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            storeLlenaGrid.load();
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
                            Modificar();
                            storeLlenaGrid.load();

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
                                strID = strID + rec[i].data.id + ",";
                            }

                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = store_Borrar;
                                    store.getProxy().extraParams.strId = strID;
                                    store.load();
                                }
                            });
                            storeLlenaGrid.load();
                        }
                    },
                    //{
                    //    xtype: 'button',
                    //    html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                    //    border: false,
                    //    disabled: true,
                    //    margin: '0 0 0 -5',
                    //    id: 'btnExportar',
                    //    disabled: false,
                    //    handler: function () {
                    //        Ext.Ajax.request({
                    //            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/ExportaCSV',
                    //            method: 'POST',
                    //            contentType: false,
                    //            processData: false,
                    //            params: {
                    //                lineaNegocio: lineaNegocio,
                    //                periodo: Ext.getCmp('cmbPeriodo').value
                    //            },
                    //            xhrFields: {
                    //                responseType: 'blob'
                    //            },
                    //            success: function (response, contentType, xhr) {
                    //                var filename = "";
                    //                var disposition = response.getResponseHeader('Content-Disposition');

                    //                if (disposition) {
                    //                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    //                    var matches = filenameRegex.exec(disposition);
                    //                    if (matches !== null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    //                }
                    //                try {
                    //                    var blob = new Blob([response.responseText], { type: contentType });
                    //                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    //                        window.navigator.msSaveBlob(blob, filename);
                    //                    } else {
                    //                        var URL = window.URL || window.webkitURL;
                    //                        var downloadUrl = URL.createObjectURL(blob);
                    //                        if (filename) {
                    //                            var a = document.createElement("a");
                    //                            if (typeof a.download === 'undefined') {
                    //                                window.location = downloadUrl;
                    //                            } else {
                    //                                a.href = downloadUrl;
                    //                                a.download = filename;
                    //                                document.body.appendChild(a);
                    //                                a.target = "_blank";
                    //                                a.click();
                    //                            }
                    //                        } else {
                    //                            window.location = downloadUrl;
                    //                        }
                    //                    }

                    //                } catch (ex) {
                    //                }
                    //            },
                    //            failure: function (response) {
                    //            }
                    //        })
                    //    },
                    //}
                ]

            },
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                renderTo: document.body,
                height: 400,
                frame: false,
                items: [
                    {
                        title: 'Criterios de búsqueda',
                        items: [
                            {
                                html: "<div style='font-size:15px';>Periodo</div><br/>",
                                margin: '5 0 0 40',
                                border: 0,
                                height: 18
                            },
                            {
                                xtype: 'combo',
                                margin: '0 0 0 40',
                                store: storePeriodo,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Fecha}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Fecha}',
                                    '</tpl>'
                                ),
                                valueField: 'Periodo',
                                id: 'cmbPeriodo',
                                editable: false,
                                listeners:
                                {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        storeLlenaGrid.getProxy().extraParams.periodo = Ext.getCmp('cmbPeriodo').value;
                                        storeLlenaGrid.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                        storeLlenaGrid.load();
                                    }
                                }
                            },
                            {
                                xtype: 'grid',
                                store: storeLlenaGrid,
                                margin: '3 0 0 0',
                                id: 'grid',
                                height: 250,
                                autoScroll: true,
                                bbar: paginador,
                                selModel:
                                {
                                    selType: 'checkboxmodel',
                                    listeners:
                                    {
                                        selectionchange: function (selected, eOpts) {
                                            if (eOpts.length == 1) {
                                                //variables | modelo
                                                //debugger;
                                                id = eOpts[0].data.id;
                                                idoperador = eOpts[0].data.id_operador;
                                                tipoOperador = eOpts[0].data.tipoOperador;
                                                operador = eOpts[0].data.operador;
                                                idacreedor = eOpts[0].data.id_acreedor;
                                                acreedor = eOpts[0].data.acreedor;
                                                nombreAcreedor = eOpts[0].data.nombreAcreedor;
                                                idmoneda = eOpts[0].data.id_moneda;
                                                moneda = eOpts[0].data.moneda;
                                                importe = eOpts[0].data.importe;
                                                fechainicio = eOpts[0].data.fechaInicio;
                                                fechafin = eOpts[0].data.fechaFin;
                                                //idcuentacontable = eOpts[0].data.id_cuentaContable;
                                                cuentacontable = eOpts[0].data.cuentaContable;
                                                sociedad = eOpts[0].data.sociedad;
                                                tipocambio = eOpts[0].data.tipoCambio;
                                            }
                                            habilitarDeshabilitar();
                                        }
                                    }
                                },
                                columns: [
                                    //Sentido
                                    {
                                        xtype: 'gridcolumn', text: 'Tipo Operador', dataIndex: 'tipoOperador', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('tipoOperador');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txTipoOperador",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn', text: 'Operador', dataIndex: 'operador', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('operador');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txOperador",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn', text: 'Acreedor', dataIndex: 'acreedor', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('acreedor');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txAperador",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {

                                        xtype: 'gridcolumn', text: 'Nombre Proveedor', dataIndex: 'nombreProveedor', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('nombreProveedor');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txNombreProveedor",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {

                                        xtype: 'gridcolumn', text: 'Moneda', dataIndex: 'moneda', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('moneda');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txMoneda",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {

                                        xtype: 'gridcolumn', text: 'Importe', dataIndex: 'importe', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('importe');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txImporte",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {

                                        xtype: 'gridcolumn', text: 'Fecha Inicio', dataIndex: 'fechaInicio', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fechaInicio');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txFechaInicio",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn', text: 'Fecha Fin', dataIndex: 'fechaFin', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fechaFin');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txFechaFin",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn', text: 'Cuenta Contable', dataIndex: 'cuentaContable', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('cuentaContable');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txCuentaContable",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn', text: 'Sociedad', dataIndex: 'sociedad', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('sociedad');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txSociedad",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn', text: 'TC', dataIndex: 'tipoCambio', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('tipoCambio');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txTipoCambio",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }
                                ]
                            }

                        ]

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
    //Funciones generales

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

    function Agregar() {

        var ventana = Ext.create('Ext.form.Panel',
            {
                dockedItems: [
                    {
                        xtype: 'panel',
                        border: false,
                        items:
                            [
                                {
                                    xtype: 'button',
                                    id: 'btn_Guardar',
                                    html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                                    border: false,
                                    handler: function () {
                                        var form = this.up('form').getForm();
                                        if (form.wasValid) {
                                            form.submit({
                                                url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/agregarCostoFC',
                                                waitMsg: "Nuevo",
                                                params:
                                                {
                                                    Id_Operador: Ext.getCmp('cmbOperador').value,
                                                    Id_Acreedor: Ext.getCmp('cmbAcreedor').value,
                                                    Id_Moneda: Ext.getCmp('cmbMoneda').value,
                                                    Importe: Ext.getCmp('txtImporte').value,
                                                    Fecha_Inicio: Ext.getCmp('dtfFechaInicio').value,
                                                    Fecha_fin: Ext.getCmp('stfFechaFin').value,
                                                    Id_Cuenta: Ext.getCmp('cmbCuentaC').value,
                                                    TC: Ext.getCmp('txtTC').value,
                                                    Linea_Negocio: lineaNegocio
                                                },
                                                success: function (form, action) {
                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                    var store = Ext.StoreManager.lookup('Idstore_LlenaGrid');
                                                    
                                                    store.load();
                                                    Ext.Msg.show({
                                                        title: "Confirmación",
                                                        msg: "El registro se agregó exitosamente",
                                                        buttons: Ext.Msg.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    storePeriodo.load();
                                                    storeLlenaGrid.load();

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
                                            })
                                        }
                                    }
                                }
                            ]
                    }
                ],
                items: [
                    {
                        xtype: 'panel',
                        layout: { type: 'vbox' },
                        margin: '5 5 5 5',
                        border: false,
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
                                    '<div class="x-boundlist-item">{id_operador} - {nombre}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_operador} - {nombre}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "el campo Operador es requerido",
                                msgTarget: 'under',
                                editable: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbAcreedor',
                                id: 'cmbAcreedor',
                                fieldLabel: "Acreedor",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaAcreedor,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{acreedor} - {nombreacreedor}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{acreedor} - {nombreacreedor}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "el campo Acreedor es requerido",
                                msgTarget: 'under',
                                editable: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbMoneda',
                                id: 'cmbMoneda',
                                fieldLabel: 'Moneda',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaMoneda,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{id_moneda} - {moneda}</div>',
                                    '</tpl>'
                                ),
                                diplayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_moneda} - {moneda}',
                                    '</tpl>'
                                ),
                                renderTo: Ext.getBody(),
                                displayField: 'moneda',
                                valueField: 'id',
                                allowBlank: false,
                                blankText: 'El campo Moneda es requerido',
                                magTarger: 'under',
                                editable: false
                            },
                            {
                                xtype: 'numberfield',
                                id: 'txtImporte',
                                name: 'txtImporte',
                                margin: '5 5 5 5',
                                flex: 1,
                                anchor: "100%",
                                fieldLabel: "Importe",
                                allowBlank: false,
                                msgTarget: 'under',
                                blankText: "El campo Moneda es requerido",
                                hideTrigger: true
                            },
                            {
                                xtype: 'datefield',
                                id: 'dtfFechaInicio',
                                name: 'dtfFechaInicio',
                                margin: '5 5 5 5',
                                fieldLabel: "Fecha Inicio",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                blankText: 'El campo Fecha de Inicio es requerido',
                                msgTarget: 'under',
                                format: 'd-m-Y'
                            },
                            {

                                xtype: 'datefield',
                                id: 'stfFechaFin',
                                name: 'stfFechaFin',
                                margin: '5 5 5 5',
                                fieldLabel: "Fecha Fin",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                blankText: 'El campo Fecha Fin es requerido',
                                msgTarget: 'under',
                                format: 'd-m-Y'
                            },
                            {
                                xtype: 'combobox',
                                id: 'cmbCuentaC',
                                name: 'cmbCuentaC',
                                displayField: 'cuenta',
                                fieldLabel: 'Cuenta',
                                valueField: 'cuenta',
                                margin: '5 5 5 5',
                                anchor: '100%',
                                store: storeLlenaCuentaContable,
                                allowBalnk: false,
                                editable: false,
                                blankText: "El campo Cuenta es requerido"
                            },
                            {
                                xtype: 'numberfield',
                                id: 'txtTC',
                                name: 'txtTC',
                                margin: '5 5 5 5',
                                flex: 1,
                                anchor: "100%",
                                fieldLabel: "TC",
                                allowBlank: false,
                                msgTarget: 'under',
                                blankText: "El campo TC es requerido",
                                hideTrigger: true
                            }
                        ]
                    }]
            });

        win = Ext.widget('window', {
            id: 'idWin',
            title: "Nuevo",
            closeAction: 'destroy',
            layout: 'fit',
            width: 300,
            height: 410,

            resizable: false,
            modal: true,
            items: ventana
        });
        win.show();
    }

    function Modificar() {
        var ventana = Ext.create('Ext.form.Panel',
            {
                width: 150,
                height: 300,
                dockedItems: [
                    {
                        xtype: 'panel',
                        border: false,
                        items:
                            [
                                {
                                    xtype: 'button',
                                    id: 'btn_Guardar',
                                    html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                                    border: false,
                                    handler: function () {
                                        var form = this.up('form').getForm();
                                        if (form.wasValid) {
                                            form.submit({
                                                url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/ModificarCostoFC',
                                                waitMsg: "Nuevo",
                                                params:
                                                {
                                                    
                                                    Id: id,
                                                    Id_Operador: Ext.getCmp('cmbOperador').value,
                                                    Id_Acreedor: Ext.getCmp('cmbAcreedor').value,
                                                    Id_Moneda: Ext.getCmp('cmbMoneda').value,
                                                    Importe: Ext.getCmp('txtImporte').value,
                                                    Fecha_Inicio: Ext.getCmp('dtf_FechaInicio').value,
                                                    Fecha_Fin: Ext.getCmp('dtf_FechaFin').value,
                                                    Id_Cuenta: Ext.getCmp('cmbCuenta').value,
                                                    TC: Ext.getCmp('txtTC').value,
                                                    lineaNegocio: lineaNegocio
                                                },
                                                success: function (form, action) {
                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                    var store = Ext.StoreManager.lookup('Idstore_LlenaGrid');

                                                    store.load();
                                                    Ext.Msg.show({
                                                        title: "Confirmación",
                                                        msg: "El registro se modificó exitosamente",
                                                        buttons: Ext.Msg.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    storePeriodo.load();
                                                    storeLlenaGrid.load();
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
                                            })
                                        }
                                    }
                                }
                            ]
                    }
                ],
                items: [
                    {
                        xtype: 'panel',
                        layout: { type: 'vbox' },
                        margin: '5 5 5 5',
                        border: false,
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
                                    '<div class="x-boundlist-item">{id_operador} - {nombre}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_operador} - {nombre}',
                                    '</tpl>'
                                ),

                                renderTo: Ext.getBody(),
                                displayField: 'nombre',
                                valueField: 'id',

                                allowBlank: false,
                                blankText: "El campo Operador es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idoperador
                            },
                            {
                                xtype: 'displayfield',
                                id: 'dplTipoOperador',
                                fieldLabel: "Tipo de Operador",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                value: tipoOperador
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbAcreedor',
                                id: 'cmbAcreedor',
                                fieldLabel: 'Acreedor',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                blankText: "El campo Acreedor es requerido",
                                editable: false,
                                store: storeLlenaAcreedor,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{acreedor} - {nombreacreedor}</div>',
                                    '</tpl>'
                                ),
                                displayField: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{acreedor} - {nombreacreedor}',
                                    '</tpl>'
                                ),
                                renderTo: Ext.getBody(),
                                displayField: 'nombreacreedor',
                                valueField: 'id',
                                masTarget: 'under',
                                value: idacreedor
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbMoneda',
                                id: 'cmbMoneda',
                                fieldLabel: "Moneda",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaMoneda,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{id_moneda} - {moneda}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_moneda} - {moneda}',
                                    '</tpl>'
                                ),

                                renderTo: Ext.getBody(),
                                displayField: 'moneda',
                                valueField: 'id',

                                allowBlank: false,
                                blankText: "El campo Moneda es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idmoneda
                            },
                            {
                                xtype: 'numberfield',
                                id: "txtImporte",
                                name: "txtImporte",
                                margin: "5 0 5 5",
                                flex: 1,
                                anchor: "100%",
                                fieldLabel: "Importe",
                                allowBlank: false,
                                msgTarget: 'under',
                                blankText: "El campo Importe es requerido",
                                hideTrigger: true,
                                value: importe
                            },
                            {
                                id: 'dtf_FechaInicio',
                                name: 'dtf_FechaInicio',
                                xtype: 'datefield',
                                margin: '5 5 5 5',
                                fieldLabel: "Fecha Inicio",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                blankText: 'El campo Fecha Inicio es requerido',
                                msgTarget: 'under',
                                format: 'd/m/Y',
                                value: fechainicio
                            },
                            {
                                id: 'dtf_FechaFin',
                                name: 'dtf_FechaFin',
                                xtype: 'datefield',
                                margin: '5 5 5 5',
                                fieldLabel: "Fecha Fin",
                                anchor: '100%',
                                editable: false,
                                allowBlank: false,
                                blankText: 'El campo Fecha Fin es requerido',
                                msgTarget: 'under',
                                format: 'd/m/Y',
                                value: fechafin
                            },
                            {
                                xtype: 'numberfield',
                                id: "txtImporte",
                                name: "txtImporte",
                                margin: "5 0 5 5",
                                flex: 1,
                                anchor: "100%",
                                fieldLabel: "Importe",
                                allowBlank: false,
                                msgTarget: 'under',
                                blankText: "El campo Importe es requerido",
                                hideTrigger: true,
                                value: importe
                            },
                            {
                                xtype: 'combobox',
                                id: "cmbCuenta",
                                name: "cmbCuenta",
                                fieldLabel: "Cuneta Contable",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaCuentaContable,
                                displayField: 'cuenta',
                                valueField: 'id',
                                editable: false,
                                allowBlank: false,
                                blankText: "El campo Cuenta Contable es requerido",
                                value: cuentacontable
                            },
                            {
                                xtype: 'numberfield',
                                id: "txtTC",
                                name: "txtTC",
                                margin: "5 0 5 5",
                                flex: 1,
                                anchor: "100%",
                                fieldLabel: "TC",
                                allowBlank: false,
                                msgTarget: 'under',
                                blankText: "El campo TC es requerido",
                                hideTrigger: true,
                                value: tipocambio
                            }
                        ]
                    }]
            });

        win = Ext.widget('window', {
            id: 'idWin',
            title: "Modificar",
            closeAction: 'destroy',
            layout: 'fit',
            width: 300,
            height: 410,

            resizable: false,
            modal: true,
            items: ventana
        });
        win.show();


    }

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    //extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;


    permisosElementos('CostoFC', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');

});
