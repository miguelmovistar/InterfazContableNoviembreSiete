"use strict";

var Utils = {

    panelPrincipal: function (config) {

        var lineaNegocio = document.getElementById('idLinea').value;

        var tabsConfig = config.tabsConfig;

        var botones = [{
                html: "<div style='font-size:25px;'>" + config.title + "</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%'
            }];
        
        if (!config.botones || config.botones.busqueda) {

            var storeLlenaPeriodo = Utils.defineStore('..'+VIRTUAL_DIRECTORY + config.controller + '/LlenaPeriodo?lineaNegocio=' + lineaNegocio,
                'idstore_LlenaPeriodo',
                {
                    name: 'LlenaPeriodo',
                    modelFields: [
                        { name: 'Id', mapping: 'Id' },
                        { name: 'Periodo', mapping: 'Periodo' },
                        { name: 'Fecha', mapping: 'Fecha' }
                    ]
                }, 20);
            storeLlenaPeriodo.load();

            botones.push(
                {
                    columnWidth: 0.15,
                    bodyStyle: { "background-color": "#E6E6E6" },
                    border: false,
                    items: [
                        {
                            html: 'Buscar Periodo',
                            margin: '0 0 0 5',
                            bodyStyle: { "background-color": "#E6E6E6" },
                            border: false
                        },
                        {
                            xtype: 'combobox',
                            id: 'cmbPeriodos',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            queryMode: 'local',
                            bodyStyle: { "background-color": "#E6E6E6" },
                            border: false,
                            msgTarget: 'under',
                            store: storeLlenaPeriodo,
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
                        }
                    ]
                });

            botones.push(        //Aqui Van Los Botones 
                {
                    xtype: 'button',
                        html: "<button class='btn btn-primary' style='outline:none;'>Buscar</button>",
                            id: 'btnResultados3',
                                margin: '-35px 0 0 160px',
                                    border: false,
                                        handler: function () {
                                            var periodo = Ext.getCmp('cmbPeriodos').value;
                                            if (!periodo) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }

                                            const realizarCalculo = (function (tabsConfig) {
                                                return function (response) {
                                                    for (var i = 0; i < tabsConfig.length; i++) {
                                                        for (var j = 0; j < tabsConfig[i].config.length; j++) {

                                                            tabsConfig[i].config[j].store.source.getProxy().extraParams.periodo = periodo;
                                                            tabsConfig[i].config[j].store.source.getProxy().extraParams.elementType = tabsConfig[i].config[j].view.name;
                                                            tabsConfig[i].config[j].store.source.load();
                                                        }
                                                    }
                                                };
                                            })(tabsConfig);

                                            if (config.conCalculo)
                                                AjaxCustom.realizarCalculo(periodo, '..'+VIRTUAL_DIRECTORY + config.controller + '/RealizarCalculo', realizarCalculo);
                                            else
                                                realizarCalculo(null);
                                        }
                });
        }

        if (!config.botones || config.botones.exportar) {
            botones.push({
                xtype: 'button',
                html: "<button class='btn btn-primary' style='outline:none;'>Exportar</button>",
                id: 'btnExportarFluctuacion',
                margin: '-38px 0 0 260px',
                border: false,
                handler: function () {
                    var periodo = Ext.getCmp('cmbPeriodos').value;

                        if (periodo == null) {
                            Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                            return;
                        }

                        Ext.Ajax.request({
                            timeout: 3600000,
                            url: '..'+VIRTUAL_DIRECTORY + config.controller + '/Exportar',
                            params: {
                                Periodo: periodo,
                                Consulta: config.controller
                            },
                            success: function (response) {
                                var result = Ext.decode(response.responseText);
                                if (result.Success) {
                                    var disposition = response.getResponseHeader('Content-Disposition');
                                    var bytes = new Uint8Array(result.bytes);
                                    var blob = new Blob([bytes], { type: 'application/xls' });
                                    var URL = window.URL || window.webkitURL;
                                    var downloadUrl = URL.createObjectURL(blob);
                                    var a = document.createElement("a");
                                    a.href = downloadUrl;
                                    a.download = result.responseText;
                                    document.body.appendChild(a);
                                    a.click();
                                    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                                }
                                else {
                                    Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                                }
                            },
                            failure: function (response, opts) {
                                mask.hide();
                                var result = Ext.decode(response.responseText);
                                Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                            }
                        });
                    }
            });
        }

        botones.push(
        {
            xtype: 'tabpanel',
            width: '100%',
            margin: '3 0 0 0',
            height: 320,
            renderTo: Ext.getBody(),
            items: []
        });

        var Body = Ext.getBody();
        var panelPrincipal = {
            frame: false,
            border: false,
            margin: '0 0 0 6',
            width: "100%",
            height: '100%',
            layout: { type: 'vbox' },
            flex: 1,
            items: botones,
            bodyStyle: { "background-color": "#E6E6E6" },
            renderTo: Body
        };

        var panelTab = panelPrincipal.items[panelPrincipal.items.length-1];
        config.tabsConfig.forEach(function (tabConfig) {
            panelTab.items.push(Utils.tabPanel(tabConfig));
        });
        return panelPrincipal;
    },

    tabPanel: function (configPanel) {

        const grids = [];
        const opciones = [];
        if (configPanel.config.length > 1) {

            for (var ii= 0; ii < configPanel.config.length; ii++) {
                var configOpc = configPanel.config[ii];
                opciones.push({
                    xtype: 'checkboxfield',
                    boxLabel: configOpc.view.title
                    , inputValue: configOpc.view.name 
                    , checked: ii===0
                    ,listeners: {
                        change: function (newValue, oldValue, eOpts) {
                            const value = newValue.inputValue;
                            const gridEl = Ext.getCmp(value);
                            const gridTitleEl = Ext.getCmp(value).previousSibling();

                            if (!this.checked) {
                                gridEl.hide();
                                gridTitleEl.hide();
                            }
                            else
                            {
                                gridEl.show();
                                gridTitleEl.show();
                            }
                        }
                    }
                });
            }

            grids.push({
                layout: {type:'hbox'},
                items: opciones
            });
        }

        for (var i = 0; i < configPanel.config.length; i++) {
            var config = configPanel.config[i];

            if (configPanel.config.length > 1) {
                grids.push({
                    html: '<h3>' + config.view.title + '</h3>'
                   ,hidden : i > 0
                });
            }

            grids.push({
                xtype: 'gridpanelcustom'
                , hidden : i > 0
                ,id: config.view.name,
                filter: {},
                store: config.store.source,
                bbar: config.paginador.paginadorHandler,
                columns: config.view.columns
            });
        }

        return {
            xtype: 'panelcustom',
            title: configPanel.title,
            items: grids
        };

    },
     crearModelStore: function(config){
         var configStore = {};
         configStore.model = {};
         configStore.model.name = "model_" + config.name;

         Utils.defineModel({
             name: configStore.model.name,
             modelFields: config.modelFields
         });

         configStore.store = {};
         configStore.store.id = "idstore_" + config.name;
         configStore.store.source = Utils.defineStore(config.urlStore,
             configStore.store.id, configStore.model.name, null);

         configStore.paginador = {};
         configStore.paginador.id = "paginador" + config.name;
         configStore.paginador.paginadorHandler = Utils.definePager(
             configStore.paginador.id, config.paginadorText,
             configStore.store.source, pagSize);

         configStore.view = {};
         configStore.view.columns = Utils.defineColumns(config.gridColumns);
         configStore.view.name = config.name;
         configStore.view.title = config.title;
       
         return configStore;
    },
    //name - url - fields(para el Modelo) - columns (para el grid)
    defineModelStore: function (config) {

        const configStore = [];

        if (Array.isArray(config))
        {
            for (var i = 0; i < config.length; i++) {
                configStore.push(Utils.crearModelStore(config[i]));
            }
        }
        else 
            configStore.push(Utils.crearModelStore(config));
 
        return configStore;
    },

    defineModel: function (config) {
        Ext.define(config.name,
            {
                extend: 'Ext.data.Model',
                fields: config.modelFields
            });
    },

    defineStore: function (url, id, model, pageSize, forTable) {
        var modelId = '';
        if (typeof (model) !== "string") {
            Utils.defineModel(model);
            modelId = model.name;
        } else
            modelId = model;

        if (!pageSize)
            pageSize = 20;

        return Ext.create('Ext.data.Store', {
            model: modelId,
            storeId: id,
            //autoLoad: true,
            pageSize: pageSize,
            proxy: {
                type: 'ajax',
                url: url,
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
    },

    definePager: function (id, msjDisplay, store, pagSize) {
        return new Ext.PagingToolbar(
            {
                id: id,
                store: store,
                displayInfo: true,
                displayMsg: msjDisplay,
                afterPageText: "Siguiente",
                beforePageText: "Anterior",
                emptyMsg: "Vacío",
                enabled: true,
                listeners:
                {
                    beforechange: function () {
                        var periodo = Ext.getCmp('cmbPeriodos').value;
                        store.getProxy().extraParams.filter = this.up().filter;
                        store.getProxy().extraParams.periodo = periodo;
                        store.getProxy().extraParams.elementType = this.up().id;
                    }
                }
                , items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: "Size",
                        width: '20%',
                        margin: '0 0 30 0',
                        store: pagSize,
                        displayField: 'size',
                        valueField: 'id',
                        listeners:
                        {
                            change: function (field, newValue, oldValue, eOpts) {
                                var limit = field.rawValue;
                                var periodo = Ext.getCmp('cmbPeriodos').value;
                                store.getProxy().extraParams = this.up().up().filter;
                                store.getProxy().extraParams.elementType = this.up().up().id;
                                store.getProxy().extraParams.limit = limit;
                                store.getProxy().extraParams.periodo = periodo;
                                store.load();
                            }
                        }
                    }
                ]
            });
    },

    defineColumns: function (cols) {
        return cols.map(function (col) { return Utils.defineColumn(col); });
    },

    defineColumn: function (col) {
        var id = col.id;
        var dataIndex = col.dataIndex;
        var text = col.text;
        var width = col.width;

        if (!col.xtype)
            col.xtype = "gridcolumn";

        var columnDef = {
            xtype: col.xtype, sortable: true, dataIndex: dataIndex, text: text, width: width,
            renderer: function (v, cellValues, rec) {
                var val = rec.get(dataIndex);
                if (typeof val !== "string" || val.indexOf("Date") === -1)
                    return rec.get(dataIndex);

                const valInt = parseInt(val.substring(6, val.indexOf(")")));
                if (valInt > 0)
                    return new Date(valInt).toLocaleDateString();
                return '';

            },
            //editor: {
            //    xtype: 'textfield'
            //},
            items:
            {
                xtype: 'textfield',
                flex: 1,
                margin: 2,
                enableKeyEvents: true,
                listeners:
                {
                    keyup: function () {
                        
                        var grid = this.up('gridpanel');
                        var up1 = this.up();
                        var cadena = this.value;
                        if (!cadena)
                            return;
                        var periodo = Ext.getCmp('cmbPeriodos').value;
                        
                        grid.filter[up1.dataIndex] = cadena;
                        grid.store.getProxy().extraParams = grid.filter;
                        grid.store.getProxy().extraParams.periodo = periodo;
                        grid.store.getProxy().extraParams.elementType = grid.id;
                        grid.store.load();

                    }
                }
            }
        }

        if (col.xtype === "numbercolumn") {
            columnDef.format = "0,000";
            columnDef.align = "right";
        }
        else
            if (col.xtype === "datecolumn") {
                columnDef.format = "Y-m-d";
            }

        return columnDef;
    }
}