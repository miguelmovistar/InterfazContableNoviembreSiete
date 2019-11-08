/* Nombre: NotaCredito.js
*Creado por: Jaime Alfredo Ladrón de Guevara Herrero
*Fecha: Enero
*Descripcion: Catalogo Notas de Credito
*Modificado por: Jaime Alfredo Ladrón de Guevara Herrero
*Ultima Fecha de modificación: 12/julio/2019
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

    var id, sentido, idsociedad, idtrafico, idservicio;
    var idoperador, idgrupo, importe, idmoneda;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'sentido', mapping: 'sentido' },
                { name: 'id_sociedad', mapping: 'id_sociedad' },
                { name: 'sociedad', mapping: 'sociedad' },
                { name: 'id_trafico', mapping: 'id_trafico' },
                { name: 'trafico', mapping: 'trafico' },
                { name: 'id_servicio', mapping: 'id_servicio' },
                { name: 'servicio', mapping: 'servicio' },
                { name: 'deudorAcreedorId', mapping: 'deudorAcreedorId' },
                { name: 'deudorAcreedor', mapping: 'deudorAcreedor' },
                { name: 'id_grupo', mapping: 'id_grupo' },
                { name: 'grupo', mapping: 'grupo' },
                { name: 'importe', mapping: 'importe' },
                { name: 'id_operador', mappint: 'id_operador' },
                { name: 'operador', mapping: 'operador' },
                { name: 'id_moneda', mapping: 'id_moneda' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'mes_consumo', mapping: 'mes_consumo' },
                { name: 'periodo_carga', mapping: 'periodo_carga' },
                { name: 'mes_consumo_drop', mapping: 'mes_consumo_drop'}
            ]
        });

    Ext.define('modeloSociedad',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_sociedad', mapping: 'id_sociedad' },
                { name: 'sociedad', mapping: 'sociedad' }

            ]
        });

    Ext.define('modeloTrafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_trafico', mapping: 'id_trafico' },
                { name: 'trafico', mapping: 'trafico' }

            ]
        });

    Ext.define('modeloServicio',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_servicio', mapping: 'id_servicio' },
                { name: 'servicio', mapping: 'servicio' }

            ]
        });

    Ext.define('modeloDeudorAcreedor',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'clave', mapping: 'clave' },
                { name: 'nombre', mapping: 'nombre' }

            ]
        });

    Ext.define('modeloOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_operador', mapping: 'id_operador' },
                { name: 'operador', mapping: 'operador' }

            ]
        });

    Ext.define('modeloGrupo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', mapping: 'id' },
                { name: 'id_grupo', mapping: 'id_grupo' },
                { name: 'grupo', mapping: 'grupo' }

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

    Ext.define('modeloPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    var storeLlenaGrid = Ext.create('Ext.data.Store', {
        model: 'modelo',
        autoLoad: false,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaGrid',
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
                var panels = Ext.ComponentQuery.query('#panel_notacredito');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
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

    Ext.define('model_Buscar',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'mes_consumo', mapping: 'mes_consumo' },
                
            ]
        });

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costos" },
            { "id": "2", "sentido": "Ingresos" }
        ]
    });

    var storePeriodo = Ext.create('Ext.data.Store', {
        model: 'modeloPeriodo',
        storeId: 'idstore_llenaPeriodo',
        autoLoad: true,       
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaPeriodo?lineaNegocio=' + lineaNegocio,
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
        model: 'modeloSociedad',
        storeId: 'idstore_llenaSociedad',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaSociedad?lineaNegocio=' + lineaNegocio,
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
        model: 'modeloTrafico',
        storeId: 'idstore_llenaTrafico',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaTrafico?lineaNegocio=' + lineaNegocio,
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
        model: 'modeloServicio',
        storeId: 'idstore_llenaServicio',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaServicio?lineaNegocio=' + lineaNegocio,
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
        model: 'modeloDeudorAcreedor',
        storeId: 'idstore_llenaDeudorAcreedor',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaDeudorAcreedor?lineaNegocio=' + lineaNegocio,
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
        model: 'modeloGrupo',
        storeId: 'idstore_llenaGrupo',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaGrupo?lineaNegocio=' + lineaNegocio,
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
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaMoneda?lineaNegocio=' + lineaNegocio,
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
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/llenaOperador?lineaNegocio=' + lineaNegocio,
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

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/borrar',
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

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: storeLlenaGrid,
        displayInfo: true,
        displayMsg: "Notas de crédito",
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
        itemId: 'panel_notacredito',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>NC Recibidas</div><br/>",
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
                                url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/ExportaCSV',
                                method: 'POST',
                                contentType: false,
                                processData: false,
                                params: {
                                    lineaNegocio: lineaNegocio,
                                    periodo: Ext.getCmp('cmbPeriodo').value
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
                                }
                            })
                        },
                    }
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
                                html: "<div style='font-size:15px';>Periodo contable</div><br/>",
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
                                                id = eOpts[0].data.id;
                                                sentido = eOpts[0].data.sentido;
                                                idsociedad = eOpts[0].data.id_sociedad;
                                                sociedad = eOpts[0].data.sociedad;
                                                idtrafico = eOpts[0].data.id_trafico;
                                                trafico = eOpts[0].data.trafico;
                                                idservicio = eOpts[0].data.id_servicio;
                                                servicio = eOpts[0].data.servicio;
                                                deudoracreedorid = eOpts[0].data.deudorAcreedorId;
                                                deudoracreedor = eOpts[0].data.deudorAcreedor;
                                                idoperador = eOpts[0].data.id_operador;
                                                operador = eOpts[0].data.operador;
                                                idgrupo = eOpts[0].data.id_grupo;
                                                grupo = eOpts[0].data.Grupo;
                                                importe = eOpts[0].data.importe;
                                                idmoneda = eOpts[0].data.id_moneda;
                                                moneda = eOpts[0].data.moneda;
                                                mesconsumo = eOpts[0].data.mes_consumo;
                                                mes_consumo_dropdown = eOpts[0].data.mes_consumo_drop;
                                            }
                                            habilitarDeshabilitar();
                                        }
                                    }
                                },
                                columns: [
                                    //Sentido
                                    {
                                        xtype: 'gridcolumn', text: "Sentido", dataIndex: 'sentido', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('sentido');
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
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Sociedad
                                    {
                                        xtype: 'gridcolumn', text: "Sociedad", dataIndex: 'sociedad', flex: 1, sortable: true, locked: false,
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
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Tráfico
                                    {
                                        xtype: 'gridcolumn', text: "Tráfico", dataIndex: 'trafico', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('trafico');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txTrafico",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Servicio
                                    {
                                        xtype: 'gridcolumn', text: "Servicio", dataIndex: 'servicio', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('servicio');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txServicio",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Deudor Acreedor
                                    {
                                        xtype: 'gridcolumn', text: "Deudor/Acreedor", dataIndex: 'deudorAcreedor', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('deudorAcreedor');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txDeudorAcreedor",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Operador
                                    {
                                        xtype: 'gridcolumn', text: "Operador", dataIndex: 'operador', flex: 1, sortable: true, locked: false,
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
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Grupo
                                    {
                                        xtype: 'gridcolumn', text: "Grupo", dataIndex: 'grupo', flex: 1, sortable: true, locked: false,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('grupo');
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            id: "txGrupo",
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Periodo
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'mes_consumo', with: 200, flex: 1, locked: false, text: "Periodo",
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
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Importe
                                    {
                                        xtype: 'gridcolumn', text: "Importe", format: '0,000.00', dataIndex: 'importe', flex: 1, sortable: true, locked: false, align: 'right',
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('importe');
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
                                                keyup: function () {
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    //Moneda
                                    {
                                        xtype: 'gridcolumn', text: "Moneda", dataIndex: 'moneda', flex: 1, sortable: true, locked: false,
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
                                                    Ext.defer(function () { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
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
                                                url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/agregar',
                                                waitMsg: "Nuevo",
                                                params:
                                                {
                                                    Sentido: Ext.getCmp('cmbSentido').value,
                                                    Sociedad: Ext.getCmp('cmbSociedad').value,
                                                    Trafico: Ext.getCmp('cmbTrafico').value,
                                                    Servicio: Ext.getCmp('cmbServicio').value,
                                                    DeudorAcreedor: Ext.getCmp('cmbDeudorAcreedor').value,
                                                    Operador: Ext.getCmp('cmbOperador').value,
                                                    Grupo: Ext.getCmp('cmbGrupo').value,
                                                    Importe: Ext.getCmp('txtImporte').value,
                                                    Moneda: Ext.getCmp('cmbMoneda').value,
                                                    MesConsumo: Ext.getCmp('dtf_mesConsumo').value,
                                                    lineaNegocio: lineaNegocio
                                                },
                                                success: function (form, action) {
                                                    var data = Ext.JSON.decode(action.response.responseText);
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
                                fieldLabel: "Sentido",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeSentido,
                                displayField: 'sentido',
                                valueField: 'sentido',
                                id: "cmbSentido",
                                allowBlank: false,
                                blankText: "El campo Sentido es requerido"
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
                                    '<div class="x-boundlist-item">{id_sociedad} - {sociedad}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_sociedad} - {sociedad}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Sociedad es requerido",
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
                                    '<div class="x-boundlist-item">{id_trafico} - {trafico}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_trafico} - {trafico}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
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
                                    '<div class="x-boundlist-item">{id_servicio} - {servicio}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_servicio} - {servicio}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Servicio es requerido",
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
                                    '<div class="x-boundlist-item">{clave} - {nombre}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{clave} - {nombre}',
                                    '</tpl>'
                                ),
                                valueField: 'clave',
                                renderTo: Ext.getBody(),
                                msgTarget: 'under',
                                editable: false,
                                allowBlank: false,
                                blankText: "El campo Deudor/Acreedor es requerido"
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
                                    '<div class="x-boundlist-item">{id_operador} - {operador}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_operador} - {operador}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Operador es requerido",
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
                                    '<div class="x-boundlist-item">{id_grupo} - {grupo}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_grupo} - {grupo}',
                                    '</tpl>'
                                ),

                                renderTo: Ext.getBody(),
                                displayField: 'grupo',
                                valueField: 'id',

                                allowBlank: false,
                                blankText: "El campo Grupo es requerido",
                                msgTarget: 'under',
                                editable: false
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
                                hideTrigger: true
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
                                editable: false
                            },
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
                                format: 'm-Y'
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
                width: 300,
                height: 405,
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
                                                url: '../' + VIRTUAL_DIRECTORY + 'NotaCredito/modificar',
                                                waitMsg: "Nuevo",
                                                params:
                                                {
                                                    id: id,
                                                    Sentido: Ext.getCmp('cmbSentido').value,
                                                    Sociedad: Ext.getCmp('cmbSociedad').value,
                                                    Trafico: Ext.getCmp('cmbTrafico').value,
                                                    Servicio: Ext.getCmp('cmbServicio').value,
                                                    DeudorAcreedor: Ext.getCmp('cmbDeudorAcreedor').value,
                                                    Operador: Ext.getCmp('cmbOperador').value,
                                                    Grupo: Ext.getCmp('cmbGrupo').value,
                                                    Importe: Ext.getCmp('txtImporte').value,
                                                    Moneda: Ext.getCmp('cmbMoneda').value,
                                                    MesConsumo: Ext.getCmp('dtf_mesConsumo').value,
                                                    lineaNegocio: lineaNegocio
                                                },
                                                success: function (form, action) {
                                                    var data = Ext.JSON.decode(action.response.responseText);
                                                    Ext.Msg.show({
                                                        title: "Confirmación",
                                                        msg: "El registro se modificó exitosamente",
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
                                fieldLabel: "Sentido",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeSentido,
                                displayField: 'sentido',
                                valueField: 'sentido',
                                id: "cmbSentido",
                                allowBlank: false,
                                blankText: "El campo Sentido es requerido",
                                value: sentido
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
                                    '<div class="x-boundlist-item">{id_sociedad} - {sociedad}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_sociedad} - {sociedad}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Sociedad es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idsociedad
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
                                    '<div class="x-boundlist-item">{id_trafico} - {trafico}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_trafico} - {trafico}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Tráfico es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idtrafico
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
                                    '<div class="x-boundlist-item">{id_servicio} - {servicio}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_servicio} - {servicio}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Servicio es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idservicio
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
                                    '<div class="x-boundlist-item">{clave} - {nombre}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{clave} - {nombre}',
                                    '</tpl>'
                                ),
                                valueField: 'clave',
                                renderTo: Ext.getBody(),
                                msgTarget: 'under',
                                editable: false,
                                allowBlank: false,
                                blankText: "El campo Deudor/Acreedor es requerido",
                                value: deudoracreedor
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
                                    '<div class="x-boundlist-item">{id_operador} - {operador}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_operador} - {operador}',
                                    '</tpl>'
                                ),
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Operador es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idoperador
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
                                    '<div class="x-boundlist-item">{id_grupo} - {grupo}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{id_grupo} - {grupo}',
                                    '</tpl>'
                                ),

                                renderTo: Ext.getBody(),
                                displayField: 'grupo',
                                valueField: 'id',

                                allowBlank: false,
                                blankText: "El campo Grupo es requerido",
                                msgTarget: 'under',
                                editable: false,
                                value: idgrupo
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
                                format: 'd-m-Y',
                                value: mes_consumo_dropdown
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
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;
    permisosElementos('NotaCredito', 'grid', 'btnGuardar', 'btnEditar', 'btnEliminar', 'log');
});
