/* Nombre: AjustesObjecion.js
*Creado por: -
*Fecha: -
*Descripcion: Data Origen Ajustes Objecion
*Modificado por: Jaime Alfredo Ladrón de Guevara Herrero
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
    var store;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarAjustesObjecion',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'sentido', mapping: 'sentido' },
                { name: 'idSociedad', mapping: 'idSociedad' },
                { name: 'sociedad', mapping: 'sociedad' },
                { name: 'idTrafico', mapping: 'idTrafico' },
                { name: 'trafico', mapping: 'trafico' },
                { name: 'idServicio', mapping: 'idServicio' },
                { name: 'servicio', mapping: 'servicio' },
                { name: 'idDeudorAcreedor', mapping: 'idDeudorAcreedor' },
                { name: 'deudorAcreedor', mapping: 'deudorAcreedor' },
                { name: 'idOperador', mapping: 'idOperador' },
                { name: 'operador', mapping: 'operador' },
                { name: 'idGrupo', mapping: 'idGrupo' },
                { name: 'grupo', mapping: 'grupo' },
                { name: 'periodo', mapping: 'periodo' },
                { name: 'minutos', mapping: 'minutos' },
                { name: 'importe', mapping: 'importe' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'periodoContable', mapping: 'periodoContable' },
            ]
        });

    Ext.define('model_Sociedad',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'NombreSociedad', mapping: 'NombreSociedad' },
                { name: 'Descripcion', mapping: 'Descripcion' },
                { name: 'AbreviaturaSociedad', mapping: 'AbreviaturaSociedad' }
            ]
        });

    Ext.define('model_Trafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'IdTraficoTR', mapping: 'IdTraficoTR' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_Servicio',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_LlenaDeudorAcreedor',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'DeudorAcreedor', mapping: 'DeudorAcreedor' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_LlenaOperador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'IdOperador', mapping: 'IdOperador' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_LlenaGrupo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Descripcion', mapping: 'Descripcion' },
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

    Ext.define('model_LlenaPeriodoContable',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    Ext.define('model_LlenaPeriodoDato',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    Ext.define('model_LlenaTraficoFiltro',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Trafico', mapping: 'Trafico' }
            ]
        });

    var sentidoCombo = Ext.create('Ext.data.Store', {
        fields: ['Id', 'Valor'],
        data: [
            { 'Id': 'INGRESO', 'Valor': 'INGRESO' },
            { 'Id': 'COSTO', 'Valor': 'COSTO' }
        ]
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

    var store_BuscarAjustesObjecion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAjustesObjecion',
        storeId: 'idstore_buscarAjustesObjecion',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#panel_ajustesobjecion');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var storeLlenaSociedad = Ext.create('Ext.data.Store', {
        model: 'model_Sociedad',
        storeId: 'idstore_LlenaSociedad',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaSociedad?lineaNegocio=' + lineaNegocio,
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
        model: 'model_Trafico',
        storeId: 'idstore_LlenaTrafico',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaTrafico?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaServicio = Ext.create('Ext.data.Store', {
        model: 'model_Servicio',
        storeId: 'idstore_LlenaServicio',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaServicio?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaDeudorAcreedor = Ext.create('Ext.data.Store', {
        model: 'model_LlenaDeudorAcreedor',
        storeId: 'idstore_LlenaLlenaDeudorAcreedor',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaDeudorAcreedor?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaOperador = Ext.create('Ext.data.Store', {
        model: 'model_LlenaOperador',
        storeId: 'idstore_LlenaLlenaOperador',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaOperador?lineaNegocio=' + lineaNegocio,
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
        model: 'model_LlenaGrupo',
        storeId: 'idstore_LlenaLlenaGrupo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaGrupo?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaMoneda = Ext.create('Ext.data.Store', {
        model: 'modeloMoneda',
        storeId: 'idstore_llenaMoneda',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/llenaMoneda?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaPeriodoContable = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodoContable',
        storeId: 'idstore_LlenaPeriodoContable',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaPeriodoContable?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaPeriodoDato = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodoDato',
        storeId: 'idstore_LlenaPeriodoDato',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaPeriodoDato?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaTraficoFiltro = Ext.create('Ext.data.Store', {
        model: 'model_LlenaTraficoFiltro',
        storeId: 'idstore_LlenaTraficoFiltro',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/LlenaTraficoFiltro?lineaNegocio=' + lineaNegocio,
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
        id: 'paginador',
        store: store_BuscarAjustesObjecion,
        displayInfo: true,
        displayMsg: 'Ajustes {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
        listeners: {
            beforechange: function () {
                this.getStore().getProxy().extraParams.sentido = Ext.getCmp('cmbSentidoC').value;
                this.getStore().getProxy().extraParams.trafico = Ext.getCmp('cmbTraficoC').value;
                this.getStore().getProxy().extraParams.periodo = Ext.getCmp('cmbPeriodoD').value;
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
                        store_BuscarAjustesObjecion.pageSize = cuenta;
                        store_BuscarAjustesObjecion.load();
                    }
                }
            }
        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'panel_ajustesobjecion',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Ajustes Objeción</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            {
                xtype: 'button',
                id: 'btnGuardar',
                border: false,
                html: "<button class='btn btn-primary' style='width:100%; font-size:13px;'>Nuevo</button>",
                handler: function () {
                    Agregar();
                }
            },
            {
                xtype: 'panel',
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                width: '100%',
                layout: 'column',
                items: [
                    {
                        columnWidth: 0.15,
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        items: [
                            {
                                html: 'Periodo carga',
                                margin: '0 0 0 5',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbPeriodoC',
                                id: 'cmbPeriodoC',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                queryMode: 'local',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                editable: false,
                                msgTarget: 'under',
                                store: storeLlenaPeriodoContable,
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
                                valueField: 'Periodo'
                            },
                        ]
                    },
                    {
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        columnWidth: 0.15,
                        items: [
                            {
                                html: 'Sentido',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                margin: '0 0 0 5',
                                border: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbSentidoC',
                                id: 'cmbSentidoC',
                                store: sentidoCombo,
                                querymode: 'local',
                                editable: false,
                                displayField: 'Valor',
                                valueField: 'Valor',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                msgTarget: 'under'
                            }
                        ]
                    },
                    {
                        columnWidth: 0.15,
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        items: [
                            {
                                html: 'Tráfico',
                                margin: '0 0 0 5',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbTraficoC',
                                id: 'cmbTraficoC',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                queryMode: 'local',
                                multiSelect: true,
                                editable: false,
                                forceSelection: true,
                                typeAhead: false,
                                delimiter: ';',
                                mode: 'local',
                                store: storeLlenaTraficoFiltro,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Trafico}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Trafico}',
                                    '</tpl>'
                                ),
                                valueField: 'Trafico'
                            },
                        ]
                    },
                    {
                        columnWidth: 0.15,
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        items: [
                            {
                                html: 'Periodo contable',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                margin: '0 0 0 5',
                                border: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbPeriodoD',
                                id: 'cmbPeriodoD',
                                anchor: '100%',
                                margin: '5 5 5 5',
                                editable: false,
                                queryMode: 'local',
                                msgTarget: 'under',
                                store: storeLlenaPeriodoDato,
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
                                valueField: 'Periodo'
                            },
                        ]
                    },
                    {
                        xtype: 'button',
                        html: "<button class='btn btn-primary'  style='outline:none;'>Buscar</button>",
                        id: 'btnResultados',
                        disabled: false,
                        border: false,
                        margin: '5 0 0 0',
                        handler: function () {
                            store = Ext.StoreManager.lookup('idstore_buscarAjustesObjecion');

                            store.getProxy().extraParams.periodoCol = store.getProxy().extraParams.periodo;
                            store.getProxy().extraParams.sentidoCol = store.getProxy().extraParams.sentido;
                            store.getProxy().extraParams.traficoCol = store.getProxy().extraParams.trafico;

                            store.getProxy().extraParams.periodoContable = Ext.getCmp('cmbPeriodoC').value;
                            store.getProxy().extraParams.sentido = Ext.getCmp('cmbSentidoC').value;
                            store.getProxy().extraParams.trafico = Ext.getCmp('cmbTraficoC').value;
                            store.getProxy().extraParams.periodo = Ext.getCmp('cmbPeriodoD').value;

                            store.load({
                                callback: function (records) {
                                    if (records.length == 0) {
                                        Ext.getCmp('btnExportar').setDisabled(true);
                                    } else {
                                        Ext.getCmp('btnExportar').setDisabled(false);
                                    }
                                }
                            });
                        },
                    },
                    {
                        xtype: 'button',
                        html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                        id: 'btnExportar',
                        disabled: true,
                        margin: '5 0 0 -5',
                        border: false,
                        handler: function () {
                            Ext.Ajax.request({
                                url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/ExportaCSV',
                                method: 'POST',
                                contentType: false,
                                processData: false,
                                params: {
                                    lineaNegocio: lineaNegocio,
                                    periodoContable: Ext.getCmp('cmbPeriodoC').value,
                                    sentido: Ext.getCmp('cmbSentidoC').value,
                                    trafico: Ext.getCmp('cmbTraficoC').value,
                                    periodo: Ext.getCmp('cmbPeriodoD').value
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
                html: '<br>',
                border: false
            },
            {
                xtype: 'gridpanel',
                id: 'grp_AjustesObjecion',
                flex: 1,
                columnLines: true,
                store: store_BuscarAjustesObjecion,
                width: '100%',
                height: '100%',
                bbar: paginador,
                columns: [
                    {
                        xtype: 'gridcolumn',
                        hidden: true,
                        text: "ID",
                        dataIndex: 'Id',
                        flex: 1,
                        sortable: true,
                        locked: false
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'sentido', flex: 1, text: "Sentido", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('sentido');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtSentido',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function () {
                                        c.up('gridpanel').getStore().getProxy().extraParams.sentidoCol = c.value;
                                        campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams);
                                    }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'sociedad', flex: 1, text: "Sociedad", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('sociedad');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtSociedad',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'trafico', flex: 1, text: "Tráfico", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('trafico');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtTrafico',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function () {
                                        c.up('gridpanel').getStore().getProxy().extraParams.traficoCol = c.value;
                                        campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams);
                                    }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'servicio', flex: 1, locked: false, text: "Servicio",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('servicio');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtServicio',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'deudorAcreedor', flex: 1, locked: false, text: "Deudor/Acreedor",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('deudorAcreedor');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtDeudorAcreedor',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'operador', flex: 1, locked: false, text: "Id Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('operador');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtOperador',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'grupo', flex: 1, locked: false, text: "Grupo",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('grupo');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtGrupo',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'periodo', flex: 1, locked: false, text: "Periodo",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('periodo');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtPeriodo',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function (c) {
                                    Ext.defer(function () {
                                        c.up('gridpanel').getStore().getProxy().extraParams.periodoCol = c.value;
                                        campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams);
                                    }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'minutos', text: "Minutos", width: "14%", align: "right", flex: 1, locked: false,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtMinutos',
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
                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'importe', text: "Importe", width: "14%", align: "right", flex: 1, locked: false,
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtImporte',
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
                        xtype: "gridcolumn", sortable: true, dataIndex: 'moneda', flex: 1, locked: false, text: "Moneda",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('moneda');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtMoneda',
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
        bodyStyle: { "background-color": "#E6E6E6" },
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'AjustesObjecion/AgregarAjustesObjecion',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            sentido: Ext.getCmp('cmbSentido').value,
                                            sociedad: Ext.getCmp('cmbSociedad').value,
                                            trafico: Ext.getCmp('cmbTrafico').value,
                                            servicio: Ext.getCmp('cmbServicio').value,
                                            deudorAcreedor: Ext.getCmp('cmbDeudorAcreedor').value,
                                            operador: Ext.getCmp('cmbOperador').value,
                                            grupo: Ext.getCmp('cmbGrupo').value,
                                            periodo: Ext.getCmp('dtPeriodo').value,
                                            minutos: Ext.getCmp('txMinutos').value,
                                            importe: Ext.getCmp('txImporte').value,
                                            moneda: Ext.getCmp('cmbMoneda').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            Ext.Msg.show({
                                                title: "Confirmación",
                                                msg: "El registro se agregó exitosamente.",
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                            win.destroy();
                                            store = Ext.StoreManager.lookup('idstore_buscarAjustesObjecion');

                                            store.getProxy().extraParams.periodoContable = Ext.getCmp('cmbPeriodoC').value;
                                            store.getProxy().extraParams.sentido = Ext.getCmp('cmbSentidoC').value;
                                            store.getProxy().extraParams.trafico = Ext.getCmp('cmbTraficoC').value;
                                            store.getProxy().extraParams.periodo = Ext.getCmp('cmbPeriodoD').value;

                                            store.load({
                                                callback: function (records) {
                                                    if (records.length == 0) {
                                                        Ext.getCmp('btnExportar').setDisabled(true);
                                                    } else {
                                                        Ext.getCmp('btnExportar').setDisabled(false);
                                                    }
                                                }
                                            });
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
                            xtype: 'combobox',
                            name: 'cmbSentido',
                            id: 'cmbSentido',
                            fieldLabel: "Sentido",
                            store: sentidoCombo,
                            querymode: 'local',
                            displayField: 'Id',
                            valueField: 'Valor',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Sentido es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbSociedad',
                            id: 'cmbSociedad',
                            fieldLabel: "Sociedad",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Sociedad es requerido",
                            msgTarget: 'under',
                            store: storeLlenaSociedad,
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
                            valueField: 'AbreviaturaSociedad'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTrafico',
                            id: 'cmbTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: true,
                            msgTarget: 'under',
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
                            valueField: 'IdTraficoTR'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: true,
                            queryMode: 'local',
                            msgTarget: 'under',
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
                            valueField: 'Servicio'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDeudorAcreedor',
                            id: 'cmbDeudorAcreedor',
                            fieldLabel: "Deudor/Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            queryMode: 'local',
                            blankText: "El campo Deudor/Acreedor es requerido",
                            msgTarget: 'under',
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
                            valueField: 'DeudorAcreedor'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbOperador',
                            id: 'cmbOperador',
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            queryMode: 'local',
                            blankText: "El campo Operador es requerido",
                            msgTarget: 'under',
                            store: storeLlenaOperador,
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
                            valueField: 'IdOperador'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbGrupo',
                            id: 'cmbGrupo',
                            fieldLabel: "Grupo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            allowBlank: false,
                            queryMode: 'local',
                            blankText: "El campo Grupo es requerido",
                            msgTarget: 'under',
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
                            valueField: 'Grupo'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txMinutos',
                            id: 'txMinutos',
                            fieldLabel: "Minutos",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Minutos es requerido",
                            msgTarget: 'under',
                            allowDecimals: true,
                            decimalPrecision: 6,
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'numberfield',
                            name: 'txImporte',
                            id: 'txImporte',
                            fieldLabel: "Importe",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Importe es requerido",
                            msgTarget: 'under',
                            allowDecimals: true,
                            decimalPrecision: 6,
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbMoneda',
                            id: 'cmbMoneda',
                            fieldLabel: "Moneda",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
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
                            valueField: 'id_moneda',

                            allowBlank: false,
                            blankText: "El campo Moneda es requerido",
                            msgTarget: 'under',
                            editable: false
                        },
                        {
                            id: 'dtPeriodo',
                            name: 'dtPeriodo',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Periodo",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Periodo es requerido",
                            msgTarget: 'under',
                            format: 'm-Y'
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

        if (lineaNegocio != 1) {
            var ext = Ext.getCmp('cmbTrafico');
            Ext.apply(ext, { allowBlank: false });
            Ext.apply(ext, { blankText: "El campo Tráfico es requerido" });

            var ext = Ext.getCmp('cmbServicio');
            Ext.apply(ext, { allowBlank: false });
            Ext.apply(ext, { blankText: "El campo Servicio es requerido" });
        }

        win.show();
    }

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    var lectura = ["grp_AjustesObjecion", "cmbPeriodoC", "cmbSentidoC", "cmbTraficoC", "cmbPeriodoD"];
    var nuevo = ["btnGuardar"];
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('AjustesObjecion', lectura, nuevo, editar, eliminar, 'log');

});
