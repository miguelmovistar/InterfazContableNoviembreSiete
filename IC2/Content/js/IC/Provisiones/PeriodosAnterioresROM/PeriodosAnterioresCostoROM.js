
Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();

    Ext.define('model_LlenaPeriodo', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Id', mapping: 'Id' },
            { name: 'Periodo', mapping: 'Periodo' },
            { name: 'Fecha', mapping: 'Fecha' }
        ]
    });

    var modelo = [
        { name: 'IdRegistro', mapping: 'IdRegistro' },
        { name: 'Bandera', mapping: 'BanderaConcepto', width: '10%' },
        { name: 'Tipo', mapping: 'Tipo', width: '10%' },
        { name: 'Operador', mapping: 'Operador', width: '9%' },
        { name: 'Acreedor', mapping: 'Acreedor', width: '9%' },
        { name: 'Periodo', mapping: 'Periodo', width: '7%', format: 'date' },
        { name: 'Importe', mapping: 'Importe', width: '7%', format: 'number' },
        { name: 'Moneda', mapping: 'Moneda', width: '7%' },
        { name: 'Concepto', mapping: 'Concepto', width: '10%' },
        { name: 'Folio', mapping: 'FolioDocumento', width: '7%' },
        { name: 'Tipo de Cambio', mapping: 'TipoCambio', width: '7%', format: 'number' },
        { name: 'Importe (MXN)', mapping: 'ImporteMXN', width: '8%', format: 'currency' },
        { name: 'Grupo', mapping: 'Grupo', width: '9%' },
        { name: 'Operador', mapping: 'IdOperador' },
        { name: 'Acreedor', mapping: 'IdAcreedor' },
        { name: 'Identificador', mapping: 'Identificador' },
        { name: 'Fecha de Carga', mapping: 'FechaCarga' },
        { name: 'Moneda', mapping: 'IdMoneda' },
        { name: 'Grupo', mapping: 'IdGrupo' }
    ];

    var campos = [];
    var columnas = [];

    var fw = {
        formatDate: function (date) {
            let thisDate = new Date(date.match(/\d+/)[0] * 1);
            return thisDate.getDate().toString().padStart(2, '0') + '/' +
                (thisDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                (thisDate.getYear() + 1900).toString();
        },
        formatAbsolute: function (number) {
            var absolute = Math.abs(number);
            var temp = Math.floor(Math.abs(absolute)).toString().padStart(21, '0');
            var parts = [];
            for (var i = 0; i < 7; i++) {
                var actual = parseInt(temp.substr(i * 3, 3));
                if (actual !== 0) {
                    parts.push(actual);
                }
            }
            var response = '0.';
            if (parts.length !== 0)
                response = parts.join(',') + '.';
            if (absolute !== Math.floor(absolute)) {
                response += Math.floor(((Math.round(absolute * 100) / 100) - Math.floor(absolute)) * 100)
                    .toString().padStart(2, '0');
            } else {
                response += '00';
            }
            return response;
        },
        formatNumber: function (number) {
            var response = fw.formatAbsolute(number);
            if (number < 0)
                response = '- ' + response;
            return response;
        },
        formatCurrency: function (number) {
            var response = '$ ' + fw.formatAbsolute(number);
            if (number < 0) {
                return '-' + response;
            }
            return response;
        },
        filter: {}
    };

    for (var x in modelo) {
        campos.push({
            name: modelo[x].mapping,
            mapping: modelo[x].mapping
        });

        if (modelo[x].width !== undefined)
            (function (m, n, w, f) {
                columnas.push({
                    xtype: "gridcolumn",
                    sortable: true,
                    id: m,
                    dataIndex: m,
                    text: n,
                    width: w,
                    align: f !== undefined ? 'rigth' : 'left',
                    renderer: function (v, cellValues, rec) {
                        var value = rec.get(m);
                        var response = null;
                        if (value === null) {
                            response = '';
                        } else {
                            if (f !== undefined) {
                                switch (f) {
                                    case 'date':
                                        response = fw.formatDate(value);
                                        break;
                                    case 'number':
                                        response = fw.formatNumber(value);
                                        break;
                                    case 'currency':
                                        response = fw.formatCurrency(value);
                                        break;
                                }
                            } else {
                                response = value.toString();
                            }
                        }
                        return response;
                    },
                    editor: {
                        xtype: 'textfield'
                    },
                    items: {
                        xtype: 'textfield',
                        flex: 1,
                        margin: 2,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function () {
                                var cadena = this.value;
                                var aPorEllo = false;
                                if ((!this.value || cadena === '') && fw.filter[m] !== undefined) {
                                    delete fw.filter[m];
                                    aPorEllo = true;
                                }
                                if (this.value && cadena.length > 1) {
                                    fw.filter[m] = cadena;
                                    aPorEllo = true;
                                }
                                if (aPorEllo === true) {
                                    ptb_PeriodosAnterioresROM.moveFirst();
                                    store_BuscarPeriodosAnterioresROM.clearFilter();
                                    store_BuscarPeriodosAnterioresROM.getProxy().extraParams = { filter: JSON.stringify(fw.filter) };
                                    //for (var x in fw.filter) {
                                    //    if (fw.filter[x]) {
                                    //        store_BuscarPeriodosAnterioresROM.filter(x, fw.filter[x]);
                                    //    }
                                    //}
                                    store_BuscarPeriodosAnterioresROM.load();
                                }
                            }
                        }
                    }
                });
            })(
                modelo[x].mapping,
                modelo[x].name,
                modelo[x].width,
                modelo[x].format
            );
    }

    Ext.define('model_BuscarPeriodosAnterioresROM', {
        extend: 'Ext.data.Model',
        fields: campos
    });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '..' + VIRTUAL_DIRECTORY + 'PeriodosAnterioresROM/LlenaPeriodoCosto',
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

    var store_BuscarPeriodosAnterioresROM = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPeriodosAnterioresROM',
        storeId: 'idstore_buscarPeriodosAnterioresROM',
        remoteSort: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '..' + VIRTUAL_DIRECTORY + 'PeriodosAnterioresROM/LlenaGridCosto',
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

    var ptb_PeriodosAnterioresROM = new Ext.PagingToolbar({
        id: 'ptb_PeriodosAnterioresROM',
        store: store_BuscarPeriodosAnterioresROM,
        displayInfo: true,
        displayMsg: 'Registros {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
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
                        store_BuscarPeriodosAnterioresROM.pageSize = cuenta;
                        store_BuscarPeriodosAnterioresROM.load();
                    }
                }
            }
        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox' },
        flex: 1,
        items: [{
            html: "<div style='font-size:25px';>Costo de Periodos Anteriores ROM</div><br/>",
            border: false,
            bodyStyle: { "background-color": "#E6E6E6" },
            width: '50%'
        }, {
            xtype: 'tabpanel',
            width: '100%',
            margin: '3 0 0 0',
            height: 500,
            renderTo: document.body,
            frame: false,
            items: [{
                title: 'Criterios de búsqueda',
                border: false,
                items: [{ // Panel superior
                    xtype: 'panel',
                    bodyStyle: { "background-color": "#E6E6E6" },
                    border: false,
                    width: '100%',
                    layout: 'column',
                    items: [{
                        html: 'Periodo',
                        margin: '5 5 5 5',
                        bodyStyle: { 'background-color': '#E6E6E6' },
                        border: false
                    }, {
                        xtype: 'combobox',
                        name: 'cmbPeriodo',
                        id: 'cmbPeriodo',
                        anchor: '100%',
                        margin: '5 5 5 5',
                        queryMode: 'local',
                        border: false,
                        editable: false,
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
                    }, { //Buscar
                        xtype: 'button',
                        id: 'btnBuscar',
                        border: false,
                        html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                        margin: '10 0 0 0',
                        handler: function () {
                            var periodo = Ext.getCmp('cmbPeriodo').value;
                            if (periodo === null) {
                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                return;
                            } else {
                                store_BuscarPeriodosAnterioresROM.getProxy().extraParams.periodo = periodo;
                            }
                            store_BuscarPeriodosAnterioresROM.getProxy().extraParams.filter = JSON.stringify(fw.filter);
                            var store = Ext.StoreManager.lookup('idstore_buscarPeriodosAnterioresROM');
                            store.load({
                                callback: function (records) {
                                    if (records.length === 0) {
                                        Ext.getCmp('btnExportar').setDisabled(true);
                                    } else {
                                        Ext.getCmp('btnExportar').setDisabled(false);
                                    }
                                }
                            });
                        }
                    }, { //Exportar
                        xtype: 'button',
                        id: 'btnExportar',
                        html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                        border: false,
                        disabled: true,
                        margin: '10 0 0 0',
                        handler: function () {
                            Ext.Ajax.request({
                                timeout: 3600000,
                                url: '..' + VIRTUAL_DIRECTORY + 'PeriodosAnterioresROM/ExportarReporteCosto',
                                method: 'POST',
                                params: {
                                    periodo: Ext.getCmp('cmbPeriodo').value
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
                                    } else {
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
                    }, {
                        html: '<div id="container"></div>'
                    }]
                }, { // Tabla
                    xtype: 'gridpanel',
                    id: 'grp_PeriodosAnterioresROM',
                    flex: 1,
                    store: store_BuscarPeriodosAnterioresROM,
                    width: '100%',
                    height: 275,
                    columnLines: true,
                    scrollable: true,
                    bbar: ptb_PeriodosAnterioresROM,
                    renderTo: Ext.getBody(),
                    selectable: {
                        columns: false, // Can select cells and rows, but not columns
                        extensible: true // Uses the draggable selection extender
                    },
                    columns: columnas
                }]
            }]
        }],
        bodyStyle: { "background-color": "#E6E6E6" },
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

    var lectura = ["cmbPeriodo", "btnBuscar", "btnExportar", "grp_PeriodosAnterioresROM"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('PeriodosAnterioresROM', lectura, nuevo, editar, eliminar, 'log');




}); //Termina funcion inicial
