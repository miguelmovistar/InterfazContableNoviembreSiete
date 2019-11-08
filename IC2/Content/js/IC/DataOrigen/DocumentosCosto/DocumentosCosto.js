
Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;

    var ano, idSociedad, compania, montoMXP, claseDocumentoSAP;
    var idServicio, servicio, idGrupo, grupo, idAcreedor, acreedor, minutos, claseDocumento;
    var idOperador, operador, nombreOperador, codigoMaterial, idCuentaResultado;
    var idTrafico, trafico, montoIva, iva, idMoneda, moneda, id, cuentaContable;
    var tarifa, monto, montoFacturado, factura, tipoCambio;
    var fechaContableR, fechaConsumoR, fechaFacturaR, numDocumentoPF;

    var extraParams = {};
    var campoTextoFiltrado = null;

    Ext.define('model_BuscarDocumentosCosto',
        {
            extend: 'Ext.data.Model',
            fields: [

                { name: 'Id', mapping: 'Id' },
                { name: 'ano', mapping: 'ano' },
                { name: 'fechaContable', mapping: 'fechaContable' },
                { name: 'fechaContableR', mapping: 'fechaContableR' },
                { name: 'fechaConsumo', mapping: 'fechaConsumo' },
                { name: 'fechaConsumoR', mapping: 'fechaConsumoR' },
                { name: 'idSociedad', mapping: 'idSociedad' },
                { name: 'compania', mapping: 'compania' },
                { name: 'idServicio', mapping: 'idServicio' },
                { name: 'servicio', mapping: 'servicio' },
                { name: 'idGrupo', mapping: 'idGrupo' },
                { name: 'grupo', mapping: 'grupo' },
                { name: 'idAcreedor', mapping: 'idAcreedor' },
                { name: 'acreedor', mapping: 'acreedor' },
                { name: 'idOperador', mapping: 'idOperador' },
                { name: 'operador', mapping: 'operador' },
                { name: 'nombreOperador', mapping: 'nombreOperador' },
                { name: 'codigoMaterial', mapping: 'codigoMaterial' },
                { name: 'idTrafico', mapping: 'idTrafico' },
                { name: 'trafico', mapping: 'trafico' },
                { name: 'montoIva', mapping: 'montoIva' },
                { name: 'iva', mapping: 'iva' },
                { name: 'idMoneda', mapping: 'idMoneda' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'minutos', mapping: 'minutos' },
                { name: 'tarifa', mapping: 'tarifa' },
                { name: 'monto', mapping: 'monto' },
                { name: 'montoFacturado', mapping: 'montoFacturado' },
                { name: 'fechaFactura', mapping: 'fechaFactura' },
                { name: 'fechaFacturaR', mapping: 'fechaFacturaR' },
                { name: 'factura', mapping: 'factura' },
                { name: 'tipoCambio', mapping: 'tipoCambio' },
                { name: 'montoMXP', mapping: 'montoMXP' },
                { name: 'idCuentaResultado', mapping: 'idCuentaResultado' },
                { name: 'cuentaContable', mapping: 'cuentaContable' },
                { name: 'claseDocumento', mapping: 'claseDocumento' },
                { name: 'claseDocumentoSAP', mapping: 'claseDocumentoSAP' },
                { name: 'numDocumentoPF', mapping: 'numDocumentoPF' }
            ]
        });

    Ext.define('model_Trafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Desc', mapping: 'Desc' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_Compania',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Nombre', mapping: 'Nombre' },
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

    Ext.define('model_Moneda',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Descripcion', mapping: 'Descripcion' }
            ]
        });

    Ext.define('model_CodigoMaterial',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Codigo', mapping: 'Codigo' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_Grupo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_Acreedor',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Acreedor', mapping: 'Acreedor' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_Operador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Descripcion', mapping: 'Descripcion' },
            ]
        });

    Ext.define('model_Cuenta',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Cuenta', mapping: 'Cuenta' }
            ]
        });

    var storeLlenaTrafico = Ext.create('Ext.data.Store', {
        model: 'model_Trafico',
        storeId: 'idstore_LlenaTrafico',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaTrafico?lineaNegocio=' + lineaNegocio,
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

    var store_BuscarDocumentosCosto = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDocumentosCosto',
        storeId: 'idstore_buscarDocumentosCosto',
        //autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaGrid?lineaNegocio=' + lineaNegocio,
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
                var panels = Ext.ComponentQuery.query('#pnl_documentosCosto');
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
            { "id": "2", "size": "10" },
            { "id": "3", "size": "20" },
            { "id": "4", "size": "30" },
            { "id": "5", "size": "40" }
        ]
    });

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarDocumentosCosto,
        displayInfo: true,
        displayMsg: 'Facturas {0} - {1} of {2}',
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
                        store_BuscarDocumentosCosto.pageSize = cuenta;
                        store_BuscarDocumentosCosto.load();
                    }
                }
            }
        ]
    });

    var store_BorrarDocumentosCosto = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDocumentosCosto',
        storeId: 'idstore_BorrarDocumentosCosto',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/BorrarDocumentosCosto',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grp_DocumentosCosto');
                var elements = grp.getSelectionModel().getSelection();

                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                store_BuscarDocumentosCosto.load();

                if (request.action == 'ok') {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: "Notificación",
                    msg: request.proxy.reader.jsonData.result,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    var store_ModificarDocumentosCosto = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDocumentosCosto',
        storeId: 'idstore_ModificarDocumentosCosto',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/ModificarDocumentosCosto?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                Ext.MessageBox.show({
                    title: "Confirmación",
                    msg: "Se modificó exitosamente",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });

                if (request.proxy.reader.jsonData.results == "ok") {
                    Ext.getCmp('idWin').destroy();
                    var store = Ext.StoreManager.lookup('idstore_buscarDocumentosCosto');
                    store.getProxy().extraParams.fechaInicial = Ext.getCmp('fechaDesdeC').value;
                    store.getProxy().extraParams.fechaFinal = Ext.getCmp('fechaHastaC').value;
                    store.load();
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

    var storeLlenaCompania = Ext.create('Ext.data.Store', {
        model: 'model_Compania',
        storeId: 'idstore_LlenaCompania',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaCompania?lineaNegocio=' + lineaNegocio,
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
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaServicio?lineaNegocio=' + lineaNegocio,
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
        model: 'model_Moneda',
        storeId: 'idstore_LlenaMoneda',
        autoLoad: false,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaMoneda?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaCodigoMaterial = Ext.create('Ext.data.Store', {
        model: 'model_CodigoMaterial',
        storeId: 'idstore_LlenaCodigoMaterial',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaCodigoMaterial?lineaNegocio=' + lineaNegocio,
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
        model: 'model_Grupo',
        storeId: 'idstore_LlenaGrupo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaGrupo?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaAcreedor = Ext.create('Ext.data.Store', {
        model: 'model_Acreedor',
        storeId: 'idstore_LlenaAcreedor',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaAcreedor?lineaNegocio=' + lineaNegocio,
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
        model: 'model_Operador',
        storeId: 'idstore_LlenaOperador',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaOperador?lineaNegocio=' + lineaNegocio,
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

    var storeLlenaCuenta = Ext.create('Ext.data.Store', {
        model: 'model_Cuenta',
        storeId: 'idstore_LlenaCuenta',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/LlenaCuenta?lineaNegocio=' + lineaNegocio,
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

    var panel = Ext.create('Ext.form.Panel', {
        itemId: 'pnl_documentosCosto',
        frame: false,
        border: false,
        margin: '0 0 0 6',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Documentos Costos</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '50%',
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                items: [
                    {
                        xtype: 'button',
                        id: 'btnGuardar',
                        border: false,
                        html: "<button class='btn btn-primary' style='font-size:13px;'>Nuevo</button>",
                        handler: function () {
                            Agregar();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        border: false,
                        disabled: true,
                        html: "<button class='btn btn-primary' style='font-size:13px;'>Editar</button>",
                        handler: function () {
                            Modificar();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEliminar',
                        border: false,
                        disabled: true,
                        html: "<button class='btn btn-primary' style='font-size:13px;'>Eliminar</button>",
                        handler: function () {
                            var strID = "";
                            var grp = Ext.getCmp('grp_DocumentosCosto');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ",
                                function (btn, text) {
                                    if (btn == 'yes') {
                                        var store = Ext.StoreManager.lookup('idstore_BorrarDocumentosCosto');
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
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 500,
                renderTo: document.body,
                frame: false,
                items: [
                    {
                        title: 'Criterios de búsqueda',
                        border: false,
                        items: [
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
                                                html: 'Desde Fecha Contable',
                                                margin: '0 0 0 5',
                                                bodyStyle: { "background-color": "#E6E6E6" },
                                                border: false
                                            },
                                            {
                                                id: 'fechaDesdeC',
                                                name: 'fechaDesdeC',
                                                xtype: 'datefield',
                                                margin: '5 5 5 5',
                                                anchor: '100%',
                                                editable: false,
                                                allowBlank: false,
                                                blankText: "El campo Desde Fecha Contable es requerido",
                                                msgTarget: 'under',
                                                format: 'd-m-Y'
                                            },
                                        ]
                                    },
                                    {
                                        bodyStyle: { "background-color": "#E6E6E6" },
                                        border: false,
                                        columnWidth: 0.15,
                                        items: [
                                            {
                                                html: 'Hasta Fecha Contable',
                                                bodyStyle: { "background-color": "#E6E6E6" },
                                                margin: '0 0 0 5',
                                                border: false
                                            },
                                            {
                                                xtype: 'datefield',
                                                id: 'fechaHastaC',
                                                name: 'fechaHastaC',
                                                margin: '5 5 5 5',
                                                anchor: '100%',
                                                editable: false,
                                                allowBlank: false,
                                                blankText: "El campo Hasta Fecha Contable es requerido",
                                                msgTarget: 'under',
                                                format: 'd-m-Y'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'button',
                                        html: "<button class='btn btn-primary' style='font-size:13px;'>Buscar</button>",
                                        id: 'btnResultados',
                                        margin: '5 0 0 0',
                                        handler: function () {
                                            var fechaIni = Ext.getCmp('fechaDesdeC').value;
                                            var fechaFin = Ext.getCmp('fechaHastaC').value;

                                            if (fechaIni == null || fechaFin == null)
                                                return;

                                            var store = Ext.StoreManager.lookup('idstore_buscarDocumentosCosto');
                                            store.getProxy().extraParams.fechaInicial = Ext.getCmp('fechaDesdeC').value;
                                            store.getProxy().extraParams.fechaFinal = Ext.getCmp('fechaHastaC').value;
                                            store.load();
                                        },
                                    }
                                ]
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grp_DocumentosCosto',
                                flex: 1,
                                store: store_BuscarDocumentosCosto,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginador,
                                selModel:
                                {
                                    selType: 'checkboxmodel',
                                    listeners:
                                    {
                                        selectionchange: function (selected, eOpts) {
                                            if (eOpts.length == 1) {
                                                id = eOpts[0].data.Id;
                                                ano = eOpts[0].data.ano;
                                                fechaContable = eOpts[0].data.fechaContable;
                                                fechaContableR = eOpts[0].data.fechaContableR;
                                                fechaConsumo = eOpts[0].data.fechaConsumo;
                                                fechaConsumoR = eOpts[0].data.fechaConsumoR;
                                                idSociedad = eOpts[0].data.idSociedad;
                                                compania = eOpts[0].data.compania;
                                                idServicio = eOpts[0].data.idServicio;
                                                servicio = eOpts[0].data.servicio;
                                                idGrupo = eOpts[0].data.idGrupo;
                                                grupo = eOpts[0].data.grupo;
                                                idAcreedor = eOpts[0].data.idAcreedor;
                                                acreedor = eOpts[0].data.acreedor;
                                                idOperador = eOpts[0].data.idOperador;
                                                operador = eOpts[0].data.operador;
                                                nombreOperador = eOpts[0].data.nombreOperador;
                                                codigoMaterial = eOpts[0].data.codigoMaterial;
                                                idTrafico = eOpts[0].data.idTrafico;
                                                trafico = eOpts[0].data.trafico;
                                                montoIva = eOpts[0].data.montoIva;
                                                iva = eOpts[0].data.iva;
                                                idMoneda = eOpts[0].data.idMoneda;
                                                moneda = eOpts[0].data.moneda;
                                                minutos = eOpts[0].data.minutos;
                                                tarifa = eOpts[0].data.tarifa;
                                                monto = eOpts[0].data.monto;
                                                montoFacturado = eOpts[0].data.montoFacturado;
                                                fechaFactura = eOpts[0].data.fechaFactura;
                                                fechaFacturaR = eOpts[0].data.fechaFacturaR;
                                                factura = eOpts[0].data.factura;
                                                tipoCambio = eOpts[0].data.tipoCambio;
                                                montoMXP = eOpts[0].data.montoMXP;
                                                idCuentaResultado = eOpts[0].data.idCuentaResultado;
                                                cuentaContable = eOpts[0].data.cuentaContable;
                                                claseDocumento = eOpts[0].data.claseDocumento;
                                                claseDocumentoSAP = eOpts[0].data.claseDocumentoSAP;
                                                numDocumentoPF = eOpts[0].data.numDocumentoPF;
                                            }
                                            habilitarDeshabilitar();
                                        }
                                    }
                                },
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, id: "ano", dataIndex: 'ano', text: "Año", width: 50,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('ano');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'fechaContable', text: "Fecha Contable", width: 90,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fechaContable');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'fechaConsumo', text: "Fecha Consumo", width: 90,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fechaConsumo');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'compania', text: "Compañía", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('compania');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'servicio', text: "Servicio",
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
                                                keyup: function (c) {
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'grupo', text: "Grupo", width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('grupo');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'acreedor', text: "Acreedor", width: 100,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('acreedor');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'operador', text: "Id Operador",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('operador');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'nombreOperador', text: "Nombre Operador", width: 200,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('nombreOperador');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'codigoMaterial', text: "Código Material",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('codigoMaterial');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'trafico', text: "Tráfico",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('trafico');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'montoIva', text: "Monto IVA",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('montoIva');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'iva', text: "% IVA", width: 50,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('iva');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'moneda', text: "Moneda", width: 50,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('moneda');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'minutos', text: "Minutos",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('minutos');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'tarifa', text: "Tarifa",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('tarifa');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.000', sortable: true, dataIndex: 'monto', text: "Monto", width: 90,
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.000', sortable: true, dataIndex: 'montoFacturado', text: "Monto Facturado",
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'fechaFactura', text: "Fecha Factura",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('fechaFactura');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'factura', text: "Factura",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('factura');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.000', sortable: true, dataIndex: 'tipoCambio', text: "Tipo Cambio",
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.000', sortable: true, dataIndex: 'montoMXP', text: "Monto MXP",
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'cuentaContable', text: "Cuenta Contable",
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('cuentaContable');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'claseDocumento', text: "Clase Documento", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('claseDocumento');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'claseDocumentoSAP', text: "Clase Documento SAP", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('claseDocumentoSAP');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'numDocumentoPF', text: "Número Documento PF", width: 120,
                                        renderer: function (v, cellValues, rec) {
                                            return rec.get('numDocumentoPF');
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
                                                    Ext.defer(function() { campoTextoFiltrado = Help.filtrarColumna(c, paginador, extraParams); }, 16);
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
        bodyStyle: { "background-color": "#E6E6E6" },
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 230);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 230);
        panel.doComponentLayout();
    });

    function Agregar() {
        var frm_agregar = Ext.create('Ext.form.Panel', {
            autoScroll: true,
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
                                    var valIdMoneda;
                                    var valMoneda;
                                    /// MVNO no tiena acceso al catalogo de monedas
                                    /// El valor por defecto es MXN
                                    if (lineaNegocio == 3) {
                                        valIdMoneda = 0;
                                        valMoneda = "MXN"
                                    } else {
                                        valIdMoneda = Ext.getCmp('cmbMoneda').value;
                                        valMoneda = Ext.getCmp('cmbMoneda').getRawValue();
                                    }

                                    form.submit({
                                        url: '../' + VIRTUAL_DIRECTORY + 'DocumentosCosto/AgregarDocumentosCosto',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            ano: Ext.getCmp('nmbAnio').value,
                                            fechaContable: Ext.getCmp('dtFechaFactura').value,
                                            fechaConsumo: Ext.getCmp('dtFechaConsumo').value,
                                            idSociedad: Ext.getCmp('cmbCompania').value,
                                            compania: Ext.getCmp('cmbCompania').getRawValue(),
                                            idServicio: Ext.getCmp('cmbServicio').value,
                                            servicio: Ext.getCmp('cmbServicio').getRawValue(),
                                            idGrupo: Ext.getCmp('cmbGrupo').value,
                                            grupo: Ext.getCmp('cmbGrupo').getRawValue(),
                                            idAcreedor: Ext.getCmp('cmbAcreedor').value,
                                            acreedor: Ext.getCmp('cmbAcreedor').getRawValue(),
                                            idOperador: Ext.getCmp('cmbOperador').value,
                                            operador: Ext.getCmp('cmbOperador').getRawValue(),
                                            nombreOperador: Ext.getCmp('txtNombreOperador').getRawValue(),
                                            codigoMaterial: Ext.getCmp('cmbCodeMaterial').value,
                                            idTrafico: Ext.getCmp('cmbTrafico').value,
                                            trafico: Ext.getCmp('cmbTrafico').getRawValue(),
                                            montoIva: Ext.getCmp('nmbMontoIva').value,
                                            iva: Ext.getCmp('nmbIva').value,
                                            idMoneda: valIdMoneda,
                                            moneda: valMoneda,
                                            minutos: Ext.getCmp('nmbMinutos').value,
                                            tarifa: Ext.getCmp('nmbTarifa').value,
                                            monto: Ext.getCmp('nmbMonto').value,
                                            montoFacturado: Ext.getCmp('nmbMontoFacturado').value,
                                            fechaFactura: Ext.getCmp('dtFechaFactura').value,
                                            factura: Ext.getCmp('txtFactura').value,
                                            tipoCambio: Ext.getCmp('nmbTipoCambio').value,
                                            montoMXP: Ext.getCmp('nmbMontoMXP').value,
                                            idCuentaResultado: Ext.getCmp('cmbCuentaContable').value,
                                            cuentaContable: Ext.getCmp('cmbCuentaContable').getRawValue(),
                                            claseDocumento: Ext.getCmp('txtClaseDocumento').value,
                                            claseDocumentoSAP: Ext.getCmp('txtClaseDocumentoSAP').value,
                                            numDocumentoPF: Ext.getCmp('txtNumDocumentoPF').value,
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
                                            store_BuscarDocumentosCosto.load();
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
                            xtype: 'numberfield',
                            name: 'nmbAnio',
                            id: 'nmbAnio',
                            fieldLabel: "Año",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            minValue: 1900,
                            maxValue: 3000,
                            allowBlank: false,
                            blankText: "El campo Año es incorrecto/Es requerido",
                            msgTarget: 'under'
                        },
                        {
                            id: 'dtFechaContable',
                            name: 'dtFechaContable',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Contable",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Fecha Contable es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y'
                        },
                        {
                            id: 'dtFechaConsumo',
                            name: 'dtFechaConsumo',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Consumo",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Fecha Consumo es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            maxValue: Ext.Date.add(new Date(), Ext.Date.DAY, -(new Date().getDate())),
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCompania',
                            id: 'cmbCompania',
                            store: storeLlenaCompania,
                            fieldLabel: "Compañía",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            editable: false,
                            queryMode: 'remote',
                            blankText: "El campo Compañía es requerido",
                            msgTarget: 'under',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbServicio',
                            id: 'cmbServicio',
                            store: storeLlenaServicio,
                            fieldLabel: "Servicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            queryMode: 'remote',
                            editable: false,
                            msgTarget: 'under',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Servicio}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbGrupo',
                            id: 'cmbGrupo',
                            fieldLabel: "Grupo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            editable: false,
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
                                '{Grupo}',
                                '</tpl>'
                            ),
                            valueField: 'Id'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbAcreedor',
                            id: 'cmbAcreedor',
                            fieldLabel: "Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            editable: false,
                            blankText: "El campo Acreedor es requerido",
                            msgTarget: 'under',
                            store: storeLlenaAcreedor,

                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Acreedor}',
                                '</tpl>'
                            ),
                            valueField: 'Id'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbOperador',
                            id: 'cmbOperador',
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            editable: false,
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
                                '{Operador}',
                                '</tpl>'
                            ),
                            valueField: 'Id'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNombreOperador',
                            id: 'txtNombreOperador',
                            fieldLabel: "Nombre Operador",
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCodeMaterial',
                            id: 'cmbCodeMaterial',
                            fieldLabel: "Código Material",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            editable: false,
                            blankText: "El campo Código Material es requerido",
                            msgTarget: 'under',
                            store: storeLlenaCodigoMaterial,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Codigo}',
                                '</tpl>'
                            ),
                            valueField: 'Codigo'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTrafico',
                            id: 'cmbTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            queryMode: 'local',
                            msgTarget: 'under',
                            store: storeLlenaTrafico,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Desc}',
                                '</tpl>'
                            ),
                            valueField: 'Id'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbMontoIva',
                            id: 'nmbMontoIva',
                            fieldLabel: "Monto IVA",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Monto IVA es requerido"
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbIva',
                            id: 'nmbIva',
                            fieldLabel: "IVA",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            maxValue: 99.99,
                            minValue: 0.0,
                            allowBlank: false,
                            blankText: "El campo IVA es requerido"
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbMoneda',
                            id: 'cmbMoneda',
                            fieldLabel: "Moneda",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            editable: false,
                            blankText: "El campo Moneda es requerido",
                            msgTarget: 'under',
                            store: storeLlenaMoneda,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Moneda}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Moneda}',
                                '</tpl>'
                            ),
                            valueField: 'Id'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbMinutos',
                            id: 'nmbMinutos',
                            fieldLabel: "Minutos",
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbTarifa',
                            id: 'nmbTarifa',
                            fieldLabel: "Tarifa",
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbMonto',
                            id: 'nmbMonto',
                            fieldLabel: "Monto",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Monto es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbMontoFacturado',
                            id: 'nmbMontoFacturado',
                            fieldLabel: "Monto Facturado",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Monto es requerido",
                            msgTarget: 'under'
                        },
                        {
                            id: 'dtFechaFactura',
                            name: 'dtFechaFactura',
                            xtype: 'datefield',
                            margin: '5 5 5 5',
                            fieldLabel: "Fecha Factura",
                            anchor: '100%',
                            editable: false,
                            allowBlank: false,
                            blankText: "El campo Fecha Factura es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtFactura',
                            id: 'txtFactura',
                            fieldLabel: "Factura",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Fecha Factura es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbTipoCambio',
                            id: 'nmbTipoCambio',
                            fieldLabel: "Tipo Cambio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Tipo Cambio es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'nmbMontoMXP',
                            id: 'nmbMontoMXP',
                            fieldLabel: "Monto MXP",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Monto MXP es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbCuentaContable',
                            id: 'cmbCuentaContable',
                            fieldLabel: "Cuenta Contable",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                            msgTarget: 'under',
                            store: storeLlenaCuenta,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Cuenta}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Cuenta}',
                                '</tpl>'
                            ),
                            valueField: 'Id'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtClaseDocumento',
                            id: 'txtClaseDocumento',
                            fieldLabel: "Clase Documento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Monto MXP es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtClaseDocumentoSAP',
                            id: 'txtClaseDocumentoSAP',
                            fieldLabel: "Clase Documento SAP",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Monto MXP es requerido",
                            msgTarget: 'under'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtNumDocumentoPF',
                            id: 'txtNumDocumentoPF',
                            fieldLabel: "Número Documento PF",
                            anchor: '100%',
                            margin: '5 5 5 5'
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
            height: 500,
            modal: true,
            items: frm_agregar
        });

        /// MVNO no tiene acceso al catalogo de monedas
        if (lineaNegocio == 3) {
            Ext.getCmp('cmbMoneda').allowBlank = true;
            Ext.getCmp('cmbMoneda').setVisible(false);
            Ext.getCmp('cmbMoneda').validate();
        }

        win.show();
    }

    //inicia funcion modificar
    function Modificar() {
        var frm_modificar = Ext.widget('form', {
            autoScroll: true,
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarDocumentosCosto');
                                store.getProxy().extraParams.id = id;
                                store.getProxy().extraParams.ano = Ext.getCmp('nmbbAnio').value;
                                store.getProxy().extraParams.fechaContable = Ext.getCmp('dttFechaContable').value;
                                store.getProxy().extraParams.fechaConsumo = Ext.getCmp('dttFechaConsumo').value;
                                store.getProxy().extraParams.idSociedad = Ext.getCmp('cmbbCompania').value;
                                store.getProxy().extraParams.compania = Ext.getCmp('cmbbCompania').getRawValue();
                                store.getProxy().extraParams.idServicio = Ext.getCmp('cmbbServicio').value;
                                store.getProxy().extraParams.servicio = Ext.getCmp('cmbbServicio').getRawValue();
                                store.getProxy().extraParams.idGrupo = Ext.getCmp('cmbbGrupo').value;
                                store.getProxy().extraParams.grupo = Ext.getCmp('cmbbGrupo').getRawValue();
                                store.getProxy().extraParams.idAcreedor = Ext.getCmp('cmbbAcreedor').value;
                                store.getProxy().extraParams.acreedor = Ext.getCmp('cmbbAcreedor').getRawValue();
                                store.getProxy().extraParams.idOperador = Ext.getCmp('cmbbOperador').value;
                                store.getProxy().extraParams.operador = Ext.getCmp('cmbbOperador').getRawValue();
                                store.getProxy().extraParams.nombreOperador = Ext.getCmp('txttNombreOperador').getRawValue();
                                store.getProxy().extraParams.codigoMaterial = Ext.getCmp('cmbbCodeMaterial').value;
                                store.getProxy().extraParams.idTrafico = Ext.getCmp('cmbbTrafico').value;
                                store.getProxy().extraParams.trafico = Ext.getCmp('cmbbTrafico').getRawValue();
                                store.getProxy().extraParams.montoIva = Ext.getCmp('nmbbMontoIva').value;
                                store.getProxy().extraParams.iva = Ext.getCmp('nmbbIva').value;
                                store.getProxy().extraParams.idMoneda = Ext.getCmp('cmbbMoneda').value;
                                store.getProxy().extraParams.moneda = Ext.getCmp('cmbbMoneda').getRawValue();
                                store.getProxy().extraParams.minutos = Ext.getCmp('nmbbMinutos').value;
                                store.getProxy().extraParams.tarifa = Ext.getCmp('nmbbTarifa').value;
                                store.getProxy().extraParams.monto = Ext.getCmp('nmbbMonto').value;
                                store.getProxy().extraParams.montoFacturado = Ext.getCmp('nmbbMontoFacturado').value;
                                store.getProxy().extraParams.fechaFactura = Ext.getCmp('dttFechaFactura').value;
                                store.getProxy().extraParams.factura = Ext.getCmp('txttFactura').value;
                                store.getProxy().extraParams.tipoCambio = Ext.getCmp('nmbbTipoCambio').value;
                                store.getProxy().extraParams.montoMXP = Ext.getCmp('nmbbMontoMXP').value;
                                store.getProxy().extraParams.idCuentaResultado = Ext.getCmp('cmbbCuentaContable').value;
                                store.getProxy().extraParams.cuentaContable = Ext.getCmp('cmbbCuentaContable').getRawValue();
                                store.getProxy().extraParams.claseDocumento = Ext.getCmp('txttClaseDocumento').value;
                                store.getProxy().extraParams.claseDocumentoSAP = Ext.getCmp('txttClaseDocumentoSAP').value;
                                store.getProxy().extraParams.numDocumentoPF = Ext.getCmp('txttNumDocumentoPF').value;
                                store.load();
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'numberfield',
                    name: 'nmbbAnio',
                    id: 'nmbbAnio',
                    fieldLabel: "Año",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    minValue: 1900,
                    maxValue: 3000,
                    allowBlank: false,
                    blankText: "El campo Año es incorrecto/Es requerido",
                    msgTarget: 'under',
                    value: ano
                },
                {
                    id: 'dttFechaContable',
                    name: 'dttFechaContable',
                    xtype: 'datefield',
                    margin: '5 5 5 5',
                    fieldLabel: "Fecha Contable",
                    anchor: '100%',
                    editable: false,
                    allowBlank: false,
                    blankText: "El campo Fecha Contable es requerido",
                    msgTarget: 'under',
                    format: 'd-m-Y',
                    value: fechaContableR,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(fechaContableR);
                        }
                    }
                },
                {
                    id: 'dttFechaConsumo',
                    name: 'dttFechaConsumo',
                    xtype: 'datefield',
                    margin: '5 5 5 5',
                    fieldLabel: "Fecha Consumo",
                    anchor: '100%',
                    editable: false,
                    allowBlank: false,
                    blankText: "El campo Fecha Consumo es requerido",
                    msgTarget: 'under',
                    format: 'd-m-Y',
                    value: fechaConsumoR,
                    maxValue: Ext.Date.add(new Date(), Ext.Date.DAY, -(new Date().getDate())),
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(fechaConsumoR);
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbCompania',
                    id: 'cmbbCompania',
                    store: storeLlenaCompania,
                    fieldLabel: "Compañía",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    editable: false,
                    queryMode: 'remote',
                    blankText: "El campo Compañía es requerido",
                    msgTarget: 'under',
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Descripcion}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Nombre}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(compania);
                            this.setValue(idSociedad);
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbServicio',
                    id: 'cmbbServicio',
                    store: storeLlenaServicio,
                    fieldLabel: "Servicio",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    queryMode: 'remote',
                    editable: false,
                    msgTarget: 'under',
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Descripcion}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Servicio}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(servicio);
                            this.setValue(idServicio);
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbGrupo',
                    id: 'cmbbGrupo',
                    fieldLabel: "Grupo",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    editable: false,
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
                        '{Grupo}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    //value: grupo
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(grupo);
                            this.setValue(idGrupo);
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbAcreedor',
                    id: 'cmbbAcreedor',
                    fieldLabel: "Acreedor",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    editable: false,
                    blankText: "El campo Acreedor es requerido",
                    msgTarget: 'under',
                    store: storeLlenaAcreedor,

                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Descripcion}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Acreedor}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(acreedor);
                            this.setValue(idAcreedor);
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbOperador',
                    id: 'cmbbOperador',
                    fieldLabel: "Operador",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    editable: false,
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
                        '{Operador}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(operador);
                            this.setValue(idOperador);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'txttNombreOperador',
                    id: 'txttNombreOperador',
                    fieldLabel: "Nombre Operador",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    value: nombreOperador
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbCodeMaterial',
                    id: 'cmbbCodeMaterial',
                    fieldLabel: "Código Material",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    editable: false,
                    blankText: "El campo Código Material es requerido",
                    msgTarget: 'under',
                    store: storeLlenaCodigoMaterial,
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Descripcion}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Codigo}',
                        '</tpl>'
                    ),
                    valueField: 'Codigo',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setValue(codigoMaterial);
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbTrafico',
                    id: 'cmbbTrafico',
                    fieldLabel: "Tráfico",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    editable: false,
                    queryMode: 'local',
                    msgTarget: 'under',
                    store: storeLlenaTrafico,
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Descripcion}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Desc}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(trafico);
                            this.setValue(idTrafico);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbMontoIva',
                    id: 'nmbbMontoIva',
                    fieldLabel: "Monto IVA",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Monto IVA es requerido",
                    value: montoIva
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbIva',
                    id: 'nmbbIva',
                    fieldLabel: "IVA",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    maxValue: 99.99,
                    minValue: 0.0,
                    allowBlank: false,
                    blankText: "El campo IVA es requerido",
                    value: iva
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbMoneda',
                    id: 'cmbbMoneda',
                    fieldLabel: "Moneda",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    editable: false,
                    blankText: "El campo Moneda es requerido",
                    msgTarget: 'under',
                    store: storeLlenaMoneda,
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Moneda}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Moneda}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    //value: moneda
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(moneda);
                            this.setValue(idMoneda);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbMinutos',
                    id: 'nmbbMinutos',
                    fieldLabel: "Minutos",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    value: minutos
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbTarifa',
                    id: 'nmbbTarifa',
                    fieldLabel: "Tarifa",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    value: tarifa
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbMonto',
                    id: 'nmbbMonto',
                    fieldLabel: "Monto",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Monto es requerido",
                    msgTarget: 'under',
                    value: monto
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbMontoFacturado',
                    id: 'nmbbMontoFacturado',
                    fieldLabel: "Monto Facturado",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Monto Facturado es requerido",
                    msgTarget: 'under',
                    value: montoFacturado
                },
                {
                    id: 'dttFechaFactura',
                    name: 'dttFechaFactura',
                    xtype: 'datefield',
                    margin: '5 5 5 5',
                    fieldLabel: "Fecha Factura",
                    anchor: '100%',
                    editable: false,
                    allowBlank: false,
                    blankText: "El campo Fecha Factura es requerido",
                    msgTarget: 'under',
                    format: 'd-m-Y',
                    value: fechaFacturaR,
                    listeners: {
                        afterrender: function () {
                            this.setRawValue(fechaFacturaR);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'txttFactura',
                    id: 'txttFactura',
                    fieldLabel: "Factura",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Factura es requerido",
                    msgTarget: 'under',
                    value: factura
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbTipoCambio',
                    id: 'nmbbTipoCambio',
                    fieldLabel: "Tipo Cambio",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Tipo Cambio es requerido",
                    msgTarget: 'under',
                    value: tipoCambio
                },
                {
                    xtype: 'numberfield',
                    name: 'nmbbMontoMXP',
                    id: 'nmbbMontoMXP',
                    fieldLabel: "Monto MXP",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Monto MXP es requerido",
                    msgTarget: 'under',
                    value: montoMXP
                },
                {
                    xtype: 'combobox',
                    name: 'cmbbCuentaContable',
                    id: 'cmbbCuentaContable',
                    fieldLabel: "Cuenta Contable",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    editable: false,
                    msgTarget: 'under',
                    store: storeLlenaCuenta,
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{Cuenta}</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{Cuenta}',
                        '</tpl>'
                    ),
                    valueField: 'Id',
                    autoLoadOnValue: true,
                    editable: false,
                    listeners: {
                        afterrender: function () {
                            this.setValue(idCuentaResultado);
                            this.setRawValue(cuentaContable);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'txttClaseDocumento',
                    id: 'txttClaseDocumento',
                    fieldLabel: "Clase Documento",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Clase Documento es requerido",
                    msgTarget: 'under',
                    value: claseDocumento
                },
                {
                    xtype: 'textfield',
                    name: 'txttClaseDocumentoSAP',
                    id: 'txttClaseDocumentoSAP',
                    fieldLabel: "Clase Documento SAP",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    allowBlank: false,
                    blankText: "El campo Clase Documento SAP es requerido",
                    msgTarget: 'under',
                    value: claseDocumentoSAP
                },
                {
                    xtype: 'textfield',
                    name: 'txttNumDocumentoPF',
                    id: 'txttNumDocumentoPF',
                    fieldLabel: "Número Documento PF",
                    anchor: '100%',
                    margin: '5 5 5 5',
                    value: numDocumentoPF
                }
            ]
        });

        win = Ext.widget('window', {
            id: 'idWin',
            title: "Editar",
            closeAction: 'destroy',
            layout: 'fit',
            height: 500,
            width: '30%',
            resizable: false,
            modal: true,
            items: frm_modificar
        });

        if (lineaNegocio == 3) {
            Ext.getCmp('cmbbMoneda').setVisible(false);
            Ext.getCmp('cmbbMoneda').validate();
        }

        win.show();
    }

    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grp_DocumentosCosto');
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

    // Parte de la logica de filtrado de grid
    var grid = panel.down('gridpanel');
    var proxy = grid.getStore().getProxy();
    extraParams = Help.generarExtraParams(grid);
    proxy.extraParams = extraParams;

    var lectura = ["grp_DocumentosCosto", "btnResultados", "fechaDesdeC", "fechaHastaC"];
    var nuevo = ["btnGuardar"];
    var editar = ["btnEditar"];
    var eliminar = ["btnEliminar"];

    permisosVariosElementos('DocumentosCosto', lectura, nuevo, editar, eliminar, 'log');



})
