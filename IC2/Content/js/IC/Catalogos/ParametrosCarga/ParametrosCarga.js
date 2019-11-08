// Nombre: ParametrosCarga.js
// Creado por: David Enrique Rangel Flores
// Fecha: 22/ene/2018
// Descripcion:Catalogo de Parametros de Carga
// Ultima Fecha de modificación: 
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
    var BodyCosto = Ext.getBody();
    //
    //Obtener Lenguaje
    var idioma = Ext.util.Cookies.get('leng');
    var lineaNegocio;
    var pais = 1;
    var Id;
    var idDocumento;
    var idServicio;
    var nombreDocumento;
    var nombreArchivo;
    var pathUrl;
    var diaCorte;
    var horaCorte;
    var caracterSeparador;
    var caracterFinLinea;
    var Activo;
    var servicio;

    var extraParams = {};
    var campoTextoFiltrado = null;

    lineaNegocio = document.getElementById('idLinea').value;

    if (lineaNegocio == 1)
        servicio = "RO";
    else if (lineaNegocio == 2)
        servicio = "LD";
    else
        servicio = "MV";

    Ext.define('model_BuscarParametros',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'idDocumento', mapping: 'idDocumento' },
                { name: 'servicio', mapping: 'servicio' },
                { name: 'nombreDocumento', mapping: 'nombreDocumento' },
                { name: 'nombreArchivo', mapping: 'nombreArchivo' },
                { name: 'pathURL', mapping: 'pathURL' },
                { name: 'diaCorte', mapping: 'diaCorte' },
                { name: 'horaCorte', mapping: 'horaCorte' },
                { name: 'caracterSeparador', mapping: 'caracterSeparador' },
                { name: 'caracterFinLinea', mapping: 'caracterFinLinea' },
                { name: 'activo', mapping: 'activo' }
            ]
        });

    Ext.define('model_LlenaComboServ',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_Servicio', mapping: 'Id_Servicio' },
                { name: 'Servicio', mapping: 'Servicio' }
            ]
        });

    var diaCte = Ext.create('Ext.data.Store', {
        fields: ['id', 'dia'],
        data: [
            { "id": "1", "dia": "01" },
            { "id": "2", "dia": "02" },
            { "id": "3", "dia": "03" },
            { "id": "4", "dia": "04" },
            { "id": "5", "dia": "05" },
            { "id": "6", "dia": "06" },
            { "id": "7", "dia": "07" },
            { "id": "8", "dia": "08" },
            { "id": "9", "dia": "09" },
            { "id": "10", "dia": "10" },
            { "id": "11", "dia": "11" },
            { "id": "12", "dia": "12" },
            { "id": "13", "dia": "13" },
            { "id": "14", "dia": "14" },
            { "id": "15", "dia": "15" },
            { "id": "16", "dia": "16" },
            { "id": "17", "dia": "17" },
            { "id": "18", "dia": "18" },
            { "id": "19", "dia": "19" },
            { "id": "20", "dia": "20" },
            { "id": "21", "dia": "21" },
            { "id": "22", "dia": "22" },
            { "id": "23", "dia": "23" },
            { "id": "24", "dia": "24" },
            { "id": "25", "dia": "25" },
            { "id": "26", "dia": "26" },
            { "id": "27", "dia": "27" },
            { "id": "28", "dia": "28" },
            { "id": "29", "dia": "29" },
            { "id": "30", "dia": "30" },
            { "id": "31", "dia": "31" }
        ]
    });

    var horaCte = Ext.create('Ext.data.Store', {
        fields: ['id', 'hora'],
        data: [
            { "id": "1", "hora": "01" },
            { "id": "2", "hora": "02" },
            { "id": "3", "hora": "03" },
            { "id": "4", "hora": "04" },
            { "id": "5", "hora": "05" },
            { "id": "6", "hora": "06" },
            { "id": "7", "hora": "07" },
            { "id": "8", "hora": "08" },
            { "id": "9", "hora": "09" },
            { "id": "10", "hora": "10" },
            { "id": "11", "hora": "11" },
            { "id": "12", "hora": "12" },
            { "id": "13", "hora": "13" },
            { "id": "14", "hora": "14" },
            { "id": "15", "hora": "15" },
            { "id": "16", "hora": "16" },
            { "id": "17", "hora": "17" },
            { "id": "18", "hora": "18" },
            { "id": "19", "hora": "19" },
            { "id": "20", "hora": "20" },
            { "id": "21", "hora": "21" },
            { "id": "22", "hora": "22" },
            { "id": "23", "hora": "23" },
            { "id": "24", "hora": "24" }
        ]
    });

    var caracSep = Ext.create('Ext.data.Store', {
        fields: ['id', 'char'],
        data: [
            { "id": "&", "char": "& - Ampersand" },
            { "id": ";", "char": "; - Punto y Coma" },
            { "id": ",", "char": ", - Coma" },
            { "id": "|", "char": "| - Pipe" },
            { "id": "\\", "char": "\\ - Slash" },
            { "id": "*", "char": "* - Asterisco" },
            { "id": "9", "char": "|----| - Tabulador" }
        ]
    });

    var caracFinLin = Ext.create('Ext.data.Store', {
        fields: ['id', 'char'],
        data: [
            { "id": "&", "char": "& - Ampersand" },
            { "id": ";", "char": "; - Punto y Coma" },
            { "id": ",", "char": ", - Coma" },
            { "id": "|", "char": "| - Pipe" },
            { "id": "\\", "char": "\\ - Slash" },
            { "id": "*", "char": "* - Asterisco" },
            { "id": "9", "char": "|----| - Tabulador" },
            { "id": "\\n", "char": "[] - Salto de linea" }
        ]
    });

    var pageSize = Ext.create('Ext.data.Store', {
        fields: ['id', 'size'],
        data: [
            { "id": "1", "size": "5" },
            { "id": "2", "size": "10" },
            { "id": "3", "size": "20" },
            { "id": "4", "size": "30" },
            { "id": "5", "size": "40" }
        ]
    });

    var store_BuscarParametros = Ext.create('Ext.data.Store', {
        model: 'model_BuscarParametros',
        storeId: 'idstore_BuscarParametros',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ParametrosCarga/LlenaGrid?servicio=' + servicio,
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
                var panels = Ext.ComponentQuery.query('#pnl_ParametrosCarga');
                if (panels.length > 0) {
                    var columnasGrid = panels[0].down('gridpanel').columns;
                    Help.habilitarCamposDeFiltrado(columnasGrid, true, campoTextoFiltrado);
                }
            }
        }
    });

    var store_ModificarParametrosCarga = Ext.create('Ext.data.Store', {
        model: 'model_BuscarParametros',
        storeId: 'idstore_ModificarParametrosCarga',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ParametrosCarga/ModificarParametros',
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
                    store_BuscarParametros.load();
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

    var store_seleccionarParametrosCarga = Ext.create('Ext.data.Store', {
        model: 'model_BuscarParametros',
        storeId: 'idstore_seleccionarParametrosCarga',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ParametrosCarga/buscarParametrosCarga',
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

                    var grpParametrosCarga = Ext.getCmp('grp_ParametrosCarga');
                    var obj_FilaSeleccionada = grpParametrosCarga.getSelectionModel().getSelection()[0];

                    Id = obj_FilaSeleccionada.data.Id;
                    idDocumento = obj_FilaSeleccionada.data.Id_Documento;
                    servicio = obj_FilaSeleccionada.data.Id_Servicio;
                    nombreDocumento = obj_FilaSeleccionada.data.Nombre_Documento;
                    nombreArchivo = obj_FilaSeleccionada.data.Nombre_Archivo;
                    pathUrl = obj_FilaSeleccionada.data.Path_Url;
                    diaCorte = obj_FilaSeleccionada.data.Dia_Corte;
                    horaCorte = obj_FilaSeleccionada.data.horaCorte;
                    caracterSeparador = obj_FilaSeleccionada.data.Caracter_Separador;
                    caracterFinLinea = obj_FilaSeleccionada.data.Caracter_Fin_Linea;
                    activo = obj_FilaSeleccionada.data.Activo;

                    var storeSParametros = Ext.StoreManager.lookup('idstore_seleccionarParametrosCarga');
                    storeSParametros.getProxy().extraParams.Id_Param = Id;
                    storeSParametros.getProxy().extraParams.Id_Documento = idDocumento;
                    storeSParametros.getProxy().extraParams.Id_Servicio = servicio;
                    storeSParametros.getProxy().extraParams.Nombre_Documento = nombreDocumento;
                    storeSParametros.getProxy().extraParams.Nombre_Archivo = nombreArchivo;
                    storeSParametros.getProxy().extraParams.Path_Url = pathUrl;
                    storeSParametros.getProxy().extraParams.Dia_Corte = diaCorte;
                    storeSParametros.getProxy().extraParams.Hora_Corte = horaCorte;
                    storeSParametros.getProxy().extraParams.Caracter_Separador = caracterSeparador;
                    storeSParametros.getProxy().extraParams.Caracter_Fin_Linea = caracterFinLinea;
                    storeSParametros.getProxy().extraParams.Activo = Activo;
                    storeSParametros.load();
                }
            }
        });

    var ptb_ParametrosDocumentos = new Ext.PagingToolbar({
        id: 'ptb_ParametrosCarga',
        store: store_BuscarParametros,
        displayInfo: true,
        displayMsg: 'Documentos {0} - {1} of {2}',
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
                store: pageSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuentag = field.rawValue;
                        store_BuscarParametros.pageSize = cuentag;
                        store_BuscarParametros.load();
                    }
                }
            }
        ]
    });

    var pnl_ParametrosCarga = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_ParametrosCarga',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Parámetros de Carga</div><br/>",
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
                            "<button id='refresh' style='border:none' class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var store = Ext.StoreManager.lookup('idstore_BuscarParametros');
                            store.load();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary' style='outline:none'>Editar</button>",
                        border: false,
                        margin: '0 0 0 -5',
                        disabled: true,
                        handler: function () {
                            var grp = Ext.getCmp('grp_ParametrosCarga');
                            var rec = grp.getSelectionModel().getSelection();

                            if (rec.length == 1) {
                                id = rec[0].data.Id;
                                idDocumento = rec[0].data.idDocumento;
                                servicio = rec[0].data.servicio;
                                nombreDocumento = rec[0].data.nombreDocumento;
                                nombreArchivo = rec[0].data.nombreArchivo;
                                pathUrl = rec[0].data.pathURL;
                                diaCorte = rec[0].data.diaCorte;
                                horaCorte = rec[0].data.horaCorte;
                                caracterSeparador = rec[0].data.caracterSeparador;
                                caracterFinLinea = rec[0].data.caracterFinLinea
                                activo = rec[0].data.activo;
                                ModificarParametro();
                                //store.load();   
                            }
                        }
                    }
                ]
            },
            {
                html: "<br/>",
                border: false
            }, {
                xtype: 'gridpanel',
                id: 'grp_ParametrosCarga',
                store: store_BuscarParametros,
                bbar: ptb_ParametrosDocumentos,
                flex: 1,
                width: '100%',
                height: '100%',
                selModel:
                {
                    selType: "checkboxmodel",
                    listeners: {
                        selectionchange: function (selected, eOpts) {
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'gridcolumn',
                        hidden: true,
                        text: "ID",
                        dataIndex: 'Id',
                        flex: 1,
                        sortable: true,
                        locked: true
                    },
                    {
                        xtype: "gridcolumn",
                        sortable: true,
                        dataIndex: 'Id_Documento',
                        flex: 1,
                        locked: false,
                        text: "Id Documento",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('idDocumento');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }

                        }
                    },
                    {
                        xtype: "gridcolumn",
                        sortable: true,
                        dataIndex: 'servicio',
                        flex: 1,
                        locked: false,
                        text: "Id Servicio",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('servicio');
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
                                    Ext.defer(function() {
                                        campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams);
                                        extraParams.servicioCol = extraParams.servicio
                                    }, 16);
                                    // Fix por ya haber un parametro llamado servicio
                                    // configurado en el proxy
                                    // Fin de fix
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn",
                        sortable: true, dataIndex: 'nombreDocumento', flex: 1, text: "Nombre del Documento", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('nombreDocumento');
                        },
                        editor: {
                            xtype: 'displayfield'
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'nombreArchivo', flex: 1, text: "Nombre del Archivo", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('nombreArchivo');
                        },
                        editor: {
                            xtype: 'displayfield'
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'pathURL', flex: 1, locked: false, text: "Path / URL",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('pathURL');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'diaCorte', flex: 1, locked: false, text: "Día de Corte",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('diaCorte');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'horaCorte', flex: 1, locked: false, text: "Hora de Corte",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('horaCorte');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'caracterSeparador', flex: 1, locked: false, text: "Caracter Separador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('caracterSeparador');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'caracterFinLinea', flex: 1, locked: false, text: "Caracter de Fin de Línea",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('caracterFinLinea');
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'activo', flex: 1, locked: false, text: "Activo",
                        renderer: function (v, cellValues, rec) {
                            if (rec.get('activo'))
                                return 1;
                            return 0;
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
                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, ptb_ParametrosDocumentos, extraParams); }, 16);
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
        pnl_ParametrosCarga.setSize(w - 15, h - 255);
        pnl_ParametrosCarga.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        pnl_ParametrosCarga.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        pnl_ParametrosCarga.doComponentLayout();
    });

    function AgregarParametroCarga() {
        var frm_agregar = Ext.create('Ext.form.Panel', {
            dockedItems: [
                {
                    xtype: 'panel',
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            border: false,
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='n'>Guardar</button>",
                            enableKeyEvents: true,
                            listeners: {
                                click: function () {
                                    var form = this.up('form').getForm();
                                    if (form.wasValid) {
                                        form.submit({
                                            url: '../' + VIRTUAL_DIRECTORY + 'ParametrosCarga/AgregarParametroCarga',
                                            waitMsg: "Nuevo",
                                            params:
                                            {
                                                idDoc: Ext.getCmp('txtIdDoc').value,
                                                idServ: servicio,
                                                nomDoc: Ext.getCmp('txtNomDoc').value,
                                                nomArch: Ext.getCmp('txtNomArch').value,
                                                pathUrl: Ext.getCmp('txtPathUrl').value,
                                                diaCorte: Ext.getCmp('cmbDiaCte').value,
                                                horaCorte: Ext.getCmp('cmbHrCte').value,
                                                carSeparador: Ext.getCmp('cmbCarSep').value,
                                                carFinLinea: Ext.getCmp('cmbCarFinLinea').value
                                            },
                                            success: function (form, action) {
                                                var data = Ext.JSON.decode(action.response.responseText);
                                                var store = Ext.StoreManager.lookup('idstore_BuscarParametros');

                                                // servicio falta aqui

                                                store.getProxy().extraParams.idDoc = Ext.getCmp('txtIdDoc').value;
                                                //store.getProxy().extraParams.idServ = Ext.getCmp('cmbIdServicio').value;
                                                store.getProxy().extraParams.nomDoc = Ext.getCmp('txtNomDoc').value;
                                                store.getProxy().extraParams.nomArch = Ext.getCmp('txtNomArch').value;
                                                store.getProxy().extraParams.pathUrl = Ext.getCmp('txtPathUrl').value;
                                                store.getProxy().extraParams.diaCorte = Ext.getCmp('cmbDiaCte').value;
                                                store.getProxy().extraParams.horaCorte = Ext.getCmp('cmbHrCte').value;
                                                store.getProxy().extraParams.carSeparador = Ext.getCmp('cmbCarSep').value;
                                                store.getProxy().extraParams.carFinLinea = Ext.getCmp('cmbCarFinLinea').value;
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
                                                    msg: action.result.results,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });
                                            }
                                        });
                                    }
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
                            name: 'txtIdDoc',
                            id: 'txtIdDoc',
                            fieldLabel: "Id del Documento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 10,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNomDoc',
                            id: 'txtNomDoc',
                            fieldLabel: "Nombre del Documento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNomArch',
                            id: 'txtNomArch',
                            fieldLabel: "Nombre del Archivo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtPathUrl',
                            id: 'txtPathUrl',
                            fieldLabel: "Path o URL",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 500,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDiaCte',
                            id: 'cmbDiaCte',
                            store: diaCte,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'dia',
                            fieldLabel: "Dia de Corte",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbHrCte',
                            id: 'cmbHrCte',
                            store: horaCte,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'hora',
                            fieldLabel: "Hora de Corte",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 5,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCarSep',
                            id: 'cmbCarSep',
                            store: caracSep,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'char',
                            fieldLabel: "Caracter Separación",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCarFinLinea',
                            id: 'cmbCarFinLinea',
                            store: caracFinLin,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'char',
                            fieldLabel: "Caracter de Final de Linea",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                    ]
                }
            ]
        });
        var map = new Ext.util.KeyMap({
            target: Ext.getCmp('btn_Guardar'),
            binding: [{
                key: "n",
                alt: true,
                handler: function () {
                    alert('Prueba.');
                }
            }]
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
    function ModificarParametro() {
        var frm_agregar = Ext.widget('form', {

            dockedItems: [
                {
                    xtype: 'panel',
                    border: false,
                    id: 'tbBarra',
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            border: false,
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='n'>Guardar</button>",
                            handler: function () {
                                var storeSParametros = Ext.StoreManager.lookup('idstore_ModificarParametrosCarga');
                                storeSParametros.getProxy().extraParams.Id = id;
                                storeSParametros.getProxy().extraParams.Id_Documento = Ext.getCmp('txtIdDoc').value;;
                                storeSParametros.getProxy().extraParams.Id_Servicio = servicio;
                                storeSParametros.getProxy().extraParams.Nombre_Documento = Ext.getCmp('txtNomDoc').value;//nombreDocumento;
                                storeSParametros.getProxy().extraParams.Nombre_Archivo = Ext.getCmp('txtNomArch').value;//nombreArchivo;
                                storeSParametros.getProxy().extraParams.Path_Url = Ext.getCmp('txtPathUrl').value;//pathUrl;
                                storeSParametros.getProxy().extraParams.diaCorte = Ext.getCmp('cmbDiaCte').value;//diaCorte;
                                storeSParametros.getProxy().extraParams.horaCorte = Ext.getCmp('cmbHrCte').value;//horaCorte;
                                storeSParametros.getProxy().extraParams.Caracter_Separador = Ext.getCmp('cmbCarSep').value;//caracterSeparador;
                                storeSParametros.getProxy().extraParams.Caracter_Fin_Linea = Ext.getCmp('cmbCarFinLinea').value;//caracterFinLinea;
                                storeSParametros.getProxy().extraParams.Activo = activo;
                                storeSParametros.load();
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
                            name: 'txtIdDoc',
                            id: 'txtIdDoc',
                            fieldLabel: "ID del Documento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: idDocumento,
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNomDoc',
                            id: 'txtNomDoc',
                            fieldLabel: "Nombre del Documento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: nombreDocumento,
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNomArch',
                            id: 'txtNomArch',
                            fieldLabel: "Nombre del Archivo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: nombreArchivo,
                            msgTarget: 'under',
                            maxLength: 50,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtPathUrl',
                            id: 'txtPathUrl',
                            fieldLabel: "Path o URL",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: pathUrl,
                            msgTarget: 'under',
                            maxLength: 500,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbDiaCte',
                            id: 'cmbDiaCte',
                            store: diaCte,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'dia',
                            fieldLabel: "Día de Corte",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: diaCorte,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbHrCte',
                            id: 'cmbHrCte',
                            store: horaCte,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'hora',
                            fieldLabel: "Hora de Corte",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: horaCorte,
                            msgTarget: 'under',
                            maxLength: 5,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCarSep',
                            id: 'cmbCarSep',
                            store: caracSep,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'char',
                            fieldLabel: "Caracter Separación",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: caracterSeparador,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCarFinLinea',
                            id: 'cmbCarFinLinea',
                            store: caracFinLin,
                            queryMode: 'remote',
                            valueField: 'id',
                            displayField: 'char',
                            fieldLabel: "Caracter de Final de Línea",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: caracterFinLinea,
                            msgTarget: 'under',
                            maxLength: 25,
                            enforceMaxLength: true
                        },
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
        var grp = Ext.getCmp('grp_ParametrosCarga');
        var rec = grp.getSelectionModel().getSelection();

        if (rec.length == 0) {
            Ext.getCmp('btnEditar').setDisabled(true);
        } else if (rec.length == 1) {
            Ext.getCmp('btnEditar').setDisabled(false);
        } else {
            Ext.getCmp('btnEditar').setDisabled(true);
        }
    }

    // Parte de la logica de filtrado de grid
    var grid = pnl_ParametrosCarga.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    // Fix por ya haber un parametro llamado servicio
    // configurado en el proxy
    extraParams.servicioCol = extraParams.servicio
    // Fin de fix
    proxy.extraParams = extraParams;

    permisosElementos('ParametrosCarga', 'grp_ParametrosCarga', null, 'btnEditar', null, 'log');

})