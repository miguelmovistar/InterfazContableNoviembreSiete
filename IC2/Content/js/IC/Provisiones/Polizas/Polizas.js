/* Nombre: Polizas.js
*Creado por: Luis Espinosa
*Fecha:  25/06/2019
*Descripcion: Polizas S1/S3/SA
*/
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
    'Ext.tip.QuickTipManager',
    'Ext.toolbar.Paging',
    'Ext.ux.*'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();


    var lineaNegocio = document.getElementById('idLinea').value;
    var _Id;
    var _IdArchivoPoliza;
    var _TipoFichero;
    var _Sentido;
    var _Trafico;
    var _SociedadSAP;
    var _Estado;
    var _Enviado;
    var _Nombre;
    var _FechaCreacion;
    var _FechaEnvio;
    var _TipoFactura;
    var _PeriodoConsumido;
    var _NumeroPoliza;
    var _DescripcionMensaje;
    var _Rechazado;
	var _Reprocesado;
	var _Servicio

    var iBusca = 0;
	var store;
	var store_ModificarE

    var _IdLinea2;
    var _ClaveContab;
    var _CME;
    var _IndicadorImpuesto;
    var _CentroCosto;
    var _Cuenta;
    var _Region;
    var _Licencia;
    var _TipoDeTrafico;
    var _Ambito;
    var _Producto;
    var _EmpresaGrupo;
    var _AreaFuncional;
    var _Subsegmento;
    var _BundlePaquetes;
    var _SubtipoLinea;
    var _Canal;
    var _ServiciosPA;
    var _SegmentoPA;
    var miArray = new Array();
	//var miArray;
	var arrayEditar = new Array();
	var arrayEditar2 = new Array();
    var EditarSentido;

    //**********************************Modelos*********************************************
    Ext.define('modeloPolizas',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                //{ name: 'IdPoliza', mapping: 'IdPoliza' },
                { name: 'Poliza', mapping: 'Poliza' },
                { name: 'TipoFichero', mapping: 'TipoFichero' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'SociedadSAP', mapping: 'SociedadSAP' },
                { name: 'Estado', mapping: 'Estado' },
                { name: 'Enviado', mapping: 'Enviado' },
                { name: 'Nombre', mapping: 'Nombre' },
                { name: 'FechaCreacion', mapping: 'FechaCreacion' },
                { name: 'FechaEnvio', mapping: 'FechaEnvio' },
                { name: 'TipoFactura', mapping: 'TipoFactura' },
                { name: 'PeriodoConsumido', mapping: 'PeriodoConsumido' },
                { name: 'NumeroPoliza', mapping: 'NumeroPoliza' },
                { name: 'DescripcionMensaje', mapping: 'DescripcionMensaje' },
                { name: 'Rechazado', mapping: 'Rechazado' },
                { name: 'Reprocesado', mapping: 'Reprocesado' },

            ]
        });

    Ext.define('modeloEncabezadoArchivo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Registro', mapping: 'Registro' },
                { name: 'Mand', mapping: 'Mand' },
                { name: 'Usuario', mapping: 'Usuario' },
            ]
        });

    Ext.define('modeloEncabezadoRegistro',
        {
            extend: 'Ext.data.Model',
            fields: [
                //{ name: 'IdLinea1', mapping: 'IdLinea1' },
                //{ name: 'Id_Devengo', mapping: 'Id_Devengo' },
                { name: 'Reg', mapping: 'Reg' },
                { name: 'Trans', mapping: 'Trans' },
                { name: 'ClaseDocumento', mapping: 'ClaseDocumento' },
                { name: 'Sociedad', mapping: 'Sociedad' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'TipoCambio', mapping: 'TipoCambio' },
                { name: 'FechaDocumento', mapping: 'FechaDocumento' },
                { name: 'FechaContabilizacion', mapping: 'FechaContabilizacion' },
                { name: 'FechaReversion', mapping: 'FechaReversion' },
                { name: 'TextoCabecera', mapping: 'TextoCabecera' },
                { name: 'MotivoReversion', mapping: 'MotivoReversion' },
                { name: 'Libro', mapping: 'Libro' },
                { name: 'Referencia', mapping: 'Referencia' },
                { name: 'Referencia2', mapping: 'Referencia2' },
                { name: 'IdCasuistica', mapping: 'IdCasuistica' },
                { name: 'Asiento', mapping: 'Asiento' },
                { name: 'Referencia22', mapping: 'Referencia22' },
                { name: 'CalculoAut', mapping: 'CalculoAut' },
            ]
        });

    Ext.define('modeloDetalleRegistro',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'IdLinea2', mapping: 'IdLinea2' },
                { name: 'Id_Devengo', mapping: 'Id_Devengo' },
                { name: 'REG', mapping: 'REG' },
                { name: 'ClaveContab', mapping: 'ClaveContab' },
                { name: 'CME', mapping: 'CME' },
				{ name: 'ImporteMD', mapping: 'ImporteMD' },
				{ name: 'ImporteML', mapping: 'ImporteML' },
                { name: 'IndicadorImpuesto', mapping: 'IndicadorImpuesto' },
                { name: 'CentroCosto', mapping: 'CentroCosto' },
                { name: 'Orden', mapping: 'Orden' },
                { name: 'FechaBase', mapping: 'FechaBase' },
                { name: 'Asignacion', mapping: 'Asignacion' },
                { name: 'TextoPosicion', mapping: 'TextoPosicion' },
                { name: 'CondPago', mapping: 'CondPago' },
                { name: 'BloqPago', mapping: 'BloqPago' },
                { name: 'ViaPago', mapping: 'ViaPago' },
                { name: 'BcoPropio', mapping: 'BcoPropio' },
                { name: 'Cuenta', mapping: 'Cuenta' },
                { name: 'REF1', mapping: 'REF1' },
                { name: 'REF2', mapping: 'REF2' },
                { name: 'lineaDeNegocio', mapping: 'lineaDeNegocio' },
                { name: 'Campo20', mapping: 'Campo20' },
                { name: 'Campo21', mapping: 'Campo21' },
                { name: 'Campo22', mapping: 'Campo22' },
                { name: 'SociedadCuentasDeIngresos', mapping: 'SociedadCuentasDeIngresos' },
                { name: 'Subsegm', mapping: 'Subsegm' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Region', mapping: 'Region' },
                { name: 'Licencia', mapping: 'Licencia' },
                { name: 'TipoDeTrafico', mapping: 'TipoDeTrafico' },
                { name: 'Ambito', mapping: 'Ambito' },
                { name: 'Producto', mapping: 'Producto' },
                { name: 'Geografia', mapping: 'Geografia' },
                { name: 'Paquetes', mapping: 'Paquetes' },
                { name: 'PlanRegulatorio', mapping: 'PlanRegulatorio' },
                { name: 'EmpresaGrupo', mapping: 'EmpresaGrupo' },
                { name: 'REF3', mapping: 'REF3' },
                { name: 'AreaFuncional', mapping: 'AreaFuncional' },
                { name: 'CalculoImpuesto', mapping: 'CalculoImpuesto' },
                { name: 'FechaValor', mapping: 'FechaValor' },
                { name: 'IndicadorActividadPEl', mapping: 'IndicadorActividadPEl' },
                { name: 'RegionEstadoFederalLandProvinciaCondado', mapping: 'RegionEstadoFederalLandProvinciaCondado' },
                { name: 'ClaseDeDistribuciónIRPF', mapping: 'ClaseDeDistribuciónIRPF' },
                { name: 'Campo42', mapping: 'Campo42' },
                { name: 'Proyecto', mapping: 'Proyecto' },
                { name: 'SociedadGLAsociada', mapping: 'SociedadGLAsociada' },
                { name: 'Campo45', mapping: 'Campo45' },
                { name: 'CodMaterial', mapping: 'CodMaterial' },
                { name: 'CodEmplazFiscal', mapping: 'CodEmplazFiscal' },
                { name: 'Grafo', mapping: 'Grafo' },
                { name: 'Grafo2', mapping: 'Grafo2' },
                { name: 'Subsegmento', mapping: 'Subsegmento' },
                { name: 'BundlePaquetes', mapping: 'BundlePaquetes' },
                { name: 'SubtipoLinea', mapping: 'SubtipoLinea' },
                { name: 'Canal', mapping: 'Canal' },
                { name: 'ServiciosPA', mapping: 'ServiciosPA' },
                { name: 'SegmentoPA', mapping: 'SegmentoPA' },
                { name: 'importebaseimpuesto', mapping: 'importebaseimpuesto' },
                { name: 'ASIENTO', mapping: 'ASIENTO' },

            ]
        });
    
    Ext.define('modeloObtenerEditarMultiple',
        {
            extend: 'Ext.data.Model',
			fields: [
				{ name: 'Poliza', mapping: 'Poliza' },
                { name: 'IdLinea2', mapping: 'IdLinea2' },
                { name: 'Id_Devengo', mapping: 'Id_Devengo' },
                { name: 'ClaveContab', mapping: 'ClaveContab' },
                { name: 'CME', mapping: 'CME' },   
                { name: 'IndicadorImpuesto', mapping: 'IndicadorImpuesto' },
                { name: 'CentroCosto', mapping: 'CentroCosto' },
                { name: 'Cuenta', mapping: 'Cuenta' },
                { name: 'Region', mapping: 'Region' },
                { name: 'Licencia', mapping: 'Licencia' },
                { name: 'TipoDeTrafico', mapping: 'TipoDeTrafico' },
                { name: 'Ambito', mapping: 'Ambito' },
                { name: 'Producto', mapping: 'Producto' },
                { name: 'EmpresaGrupo', mapping: 'EmpresaGrupo' },
                { name: 'AreaFuncional', mapping: 'AreaFuncional' },
                { name: 'Subsegmento', mapping: 'Subsegmento' },
                { name: 'BundlePaquetes', mapping: 'BundlePaquetes' },
                { name: 'SubtipoLinea', mapping: 'SubtipoLinea' },
                { name: 'Canal', mapping: 'Canal' },
                { name: 'ServiciosPA', mapping: 'ServiciosPA' },
                { name: 'SegmentoPA', mapping: 'SegmentoPA' },               

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

    //*******************************Store***********************************************   

    var store_Buscar = Ext.create('Ext.data.Store', {
        model: 'modeloPolizas',
        storeId: 'idstore_buscar',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/LlenarGridPolizas?lineaNegocio=' + lineaNegocio,
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

    var store_BuscarCabeceraArchivo = Ext.create('Ext.data.Store', {
        model: 'modeloEncabezadoArchivo',
        storeId: 'idstore_buscarEncabezado',
        autoLoad: false,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/ObtenerCabeceraArchivo',
            reader: {
                type: 'json',
                root: 'results',
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var store_BuscarCabeceraRegistro = Ext.create('Ext.data.Store', {
        model: 'modeloEncabezadoRegistro',
        storeId: 'idstore_buscarEncabezadoRegistro',
        autoLoad: false,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/ObtenerCabeceraRegistro',
            reader: {
                type: 'json',
                root: 'results',
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var store_GenerarPolizasCsv = Ext.create('Ext.data.Store', {
        //model: 'model_BuscarPolizas',
        storeId: 'idstore_GenerarPolizasCsv',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/GenerarPolizasCsv',
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


    var storePeriodo = Ext.create('Ext.data.Store', {
        model: 'modeloPeriodo',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/llenaPeriodo',
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

    var store_BuscarDetalleRegistro = Ext.create('Ext.data.Store', {
        model: 'modeloDetalleRegistro',
        storeId: 'idstore_BuscarDetalleRegistro',
        autoLoad: false,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/ObtenerDetalleRegistro',
            reader: {
                type: 'json',
                root: 'results',
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var strore_ModificarPoliza = Ext.create('Ext.data.Store', {
        model: 'modeloDetalleRegistro',
        storeId: 'idstore_ModificarPoliza',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/modificarPolizas',
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
                    Ext.getCmp('idWin').destroy;
                    store_BuscarDetalleRegistro.load;
                }
                else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: "Aviso",
                    msg: "Ocurrió un error",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    var obj_EventoSeleccionarFila = Ext.create('Ext.selection.RowModel',
        {
            listeners: {
                select: function (sm, record) {
                    var grpPoliza = Ext.getCmp('grp_Poliza');
                    var obj_FilaSeleccionada = grpPoliza.getSelectionModel().getSelection()[0];
                    _IdLinea2 = obj_FilaSeleccionada.data.IdLinea2;

                    var storePoliza = Ext.StoreManager.lookup('idstore_seleccionarPoliza');
                    storePoliza.getProxy().extraParams.IdLinea2 = _IdLinea2;
                    storePoliza.load();
                }
            }
        });

    var store_seleccionarAcreedor = Ext.create('Ext.data.Store', {
        model: 'model_BuscarPoliza',
        storeId: 'idstore_seleccionarPoliza',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Acreedor/BuscarPoliza',
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

	var store_ObtenerEditarMultiple = Ext.create('Ext.data.Store', {
        model: 'modeloObtenerEditarMultiple',
        storeId: 'idstore_ObtenerEditarMultiple',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Polizas/ObtenerEditarMultiple',
            //params:
            //{
            //    arrayParam: miArray,
            //    EditarSentido: EditarSentido
            //},
            reader: {
                type: 'json',
                root: 'results',            
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
	});

	var strore_ModificarMultiple = Ext.create('Ext.data.Store', {
		model: 'modeloDetalleRegistro',
		storeId: 'idstore_ModificarMultiplePoliza',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '../' + VIRTUAL_DIRECTORY + 'Polizas/EditarMultipleIdLinea',
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
					Ext.getCmp('idWin').destroy;
					store_BuscarDetalleRegistro.load;
				}
				else {
					this.readCallback(request);
				}
			},
			readCallback: function (request) {
				Ext.MessageBox.show({
					title: "Aviso",
					msg: "Ocurrió un error",
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO
				});
			}
		}
	});

    //**********************************************************************************


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
        displayMsg: 'Archivos S1/S3/SA {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
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
    var paginadorLInea2 = new Ext.PagingToolbar({
        id: 'ptb_empresaLinea2',
        store: store_BuscarDetalleRegistro,
        displayInfo: true,
        displayMsg: 'Archivos S1/S3/SA {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
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

	
    //**************************Panels**************************************************
    var panel = Ext.create('Ext.form.Panel', {
        autoScroll: true,
        frame: false,
        border: false,
        margin: '0 0 0 6',
        width: '50%',
        //height: '100%',
        layout: { type: 'vbox' },
        //flex: 1,
        items: [
            {
                html: "<h3>Pólizas S1/S3/SA</h3> </br>",
                width: '50%',
                border: false
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '60%',
                border: false,
                items: [
                    {
                        xtype: 'button',
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none'   class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var storeBuscar = Ext.StoreManager.lookup('idstore_buscar');
                            storeBuscar.load();
                            //limpiarFiltros();
                            //iBusca = 0;
							storeBuscar.clearFilter();
							border: false
                        },
                        
                    },
                    {
                        xtype: 'button',
                        id: 'btnCancelar',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary'  style='outline:none'>Cancelar</button>",
                        disabled: true,

                        handler: function () {
                            var form = this.up('form').getForm();
                            form.submit({
                                url: '../' + VIRTUAL_DIRECTORY + 'Polizas/CancelarPoliza',
                                waitMsg: "Cargando...",

                                success: function (form, action) {
                                    data = Ext.JSON.decode(action.response.responseText);
                                    Ext.Msg.show({
                                        title: "Notificación",
                                        msg: "Se cancelo Poliza",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.INFO
                                    });

                                    var store = Ext.StoreManager.lookup('idstore_buscar');
                                    store.load();
                                },
                            });
                                                     
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnCrearCSV',
                        html: "<button type = 'submit' class='btn btn-primary'  style='outline:none'>Reprocesar Poliza</button>",
                        border: false,
                        margin: '0 0 0 5',
                        disabled: true,

                        handler: function () {
                            var periodo = Ext.getCmp('cmbPeriodoC').value;
                            var form = this.up('form').getForm();
                            form.submit({
                                url: '../' + VIRTUAL_DIRECTORY + 'Polizas/EnviarPolizas',
                                waitMsg: "Cargando...",
                                params: {
                                    Periodo: periodo
                                },
                                success: function (form, action) {
                                    data = Ext.JSON.decode(action.response.responseText);
                                    Ext.Msg.show({
                                        title: "Notificación",
                                        msg: "Se genero Poliza",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.INFO
                                    });

                                    var store = Ext.StoreManager.lookup('idstore_buscar');
                                    store.load();
                                },
                            });
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
							// Modificar();
                            var periodo = Ext.getCmp('cmbPeriodoC').value;
							store_ModificarE = Ext.StoreManager.lookup('idstore_ObtenerEditarMultiple');
							store_ModificarE.getProxy().extraParams.arrayParam = miArray;
                            store_ModificarE.getProxy().extraParams.EditarSentido = EditarSentido;	
                            store_ModificarE.getProxy().extraParams.Periodo = periodo;	
							store_ModificarE.load();
							Ext.getCmp('btn_Guardar').setDisabled(false);
						}
					},
                    {
                        html: '<br/>',
                        border: false
                    },
                    {
                        html: 'Periodo contable',
                        margin: '8 0 0 5',
                        border: false
                    },
                    {
                        xtype: 'combobox',
                        name: 'cmbPeriodoC',
                        id: 'cmbPeriodoC',
                        store: storePeriodo,
                        querymode: 'local',
                        required: true,
                        editable: false,
                        anchor: '100%',
                        margin: '5 5 5 5',
                        msgTarget: 'under',
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
                    {
                        xtype: 'button',
                        //text: 'Buscar..',
						html: "<button type = 'submit' class='btn btn-primary'  style='outline:none'>Buscar..</button>",
						id: 'btnResultados',
						border: false,
                        disabled: false,
                        margin: '1 0 0 0',
                        handler: function () {

                            periodoContableFiltro = Ext.getCmp('cmbPeriodoC').value;
                            store = Ext.StoreManager.lookup('idstore_buscar');
                            store.getProxy().extraParams.periodoContable = periodoContableFiltro;
                            store.load();
                        },
					},
					{
						xtype: 'button',
						id: 'btnRespustaSAP',
						border: false,
						margin: '0 0 0 -9sap',
						html: "<button class='btn btn-primary'  style='outline:none'>RespuestaSAP</button>",
						disabled: false,

						handler: function () {
							var form = this.up('form').getForm();
							form.submit({
								url: '../' + VIRTUAL_DIRECTORY + 'Polizas/RespuestaSAP',
								waitMsg: "Cargando...",

								success: function (form, action) {
									data = Ext.JSON.decode(action.response.responseText);
									//Ext.Msg.show({
									//	title: "Notificación",
									//	msg: "Se cancelo Poliza",
									//	buttons: Ext.Msg.OK,
									//	icon: Ext.MessageBox.INFO
									//});

									var store = Ext.StoreManager.lookup('idstore_buscar');
									store.load();
								},
							});

						}
					}
                ]
            },
            {
                html: "<br/>",
                border: false
            },

            //Primer tabla
            {
                xtype: 'gridpanel',
                id: 'grid',
                store: store_Buscar,
				width: '100%',
				height: 375,
                autoScroll: true,
                overflowX: 'auto',
                bbar: paginador,
                selModel:
                {
					selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            
                            if (eOpts.length >= 1) {
                                _Id = eOpts[0].data.Id;
                                _IdPoliza = eOpts[0].data.IdPoliza;
                                _Poliza = eOpts[0].data.Poliza;;
                                _TipoFichero = eOpts[0].data.TipoFichero;
                                _Sentido = eOpts[0].data.Sentido;
                                _Trafico = eOpts[0].data.Trafico;
                                _SociedadSAP = eOpts[0].data.SociedadSAP;
                                _Estado = eOpts[0].data.Estado;
                                _Enviado = eOpts[0].data.Enviado;
                                _Nombre = eOpts[0].data.Nombre;
                                _FechaCreacion = eOpts[0].data.FechaCreacion;
                                _FechaEnvio = eOpts[0].data.FechaEnvio;
                                _TipoFactura = eOpts[0].data.TipoFactura;
                                _PeriodoConsumido = eOpts[0].data.PeriodoConsumido;
                                _NumeroPoliza = eOpts[0].data.NumeroPoliza;
                                _DescripcionMensaje = eOpts[0].data.DescripcionMensaje;
                                _Rechazado = eOpts[0].data.Rechazado;
								_Reprocesado = eOpts[0].data.Reprocesado;
								_Servicio = eOpts[0].data.Servicio;

                                //Panel1
                                var storeSeleccionArchivo = Ext.StoreManager.lookup('idstore_buscarEncabezado');
                                storeSeleccionArchivo.getProxy().extraParams.Id = _IdPoliza;
                                storeSeleccionArchivo.load();

                                //Panel2
                                var storeSeleccionLinea1 = Ext.StoreManager.lookup('idstore_buscarEncabezadoRegistro');
                                storeSeleccionLinea1.getProxy().extraParams.Id = _Id;
                                storeSeleccionLinea1.getProxy().extraParams.ClaseDocumento = _Sentido;
                                storeSeleccionLinea1.getProxy().extraParams.Poliza = _Poliza;
                                storeSeleccionLinea1.getProxy().extraParams.Nombre = _Nombre;
								storeSeleccionLinea1.getProxy().extraParams.Estado = _Estado;
                                storeSeleccionLinea1.getProxy().extraParams.Servicio = _Servicio;
                                storeSeleccionLinea1.getProxy().extraParams.Periodo = _PeriodoConsumido;
                                storeSeleccionLinea1.load();

                                //Panel3
                                var storeSeleccionLinea2 = Ext.StoreManager.lookup('idstore_BuscarDetalleRegistro');
								storeSeleccionLinea2.getProxy().extraParams.Id = _Id;
                                storeSeleccionLinea2.getProxy().extraParams.ClaseDocumento = _Sentido;
								storeSeleccionLinea2.getProxy().extraParams.Poliza = _Poliza;
                                storeSeleccionLinea2.getProxy().extraParams.Servicio = _Servicio;
                                storeSeleccionLinea2.getProxy().extraParams.Periodo = _PeriodoConsumido;
                                //storeSeleccionLinea1.getProxy().extraParams.Periodo = _PeriodoConsumido;
								storeSeleccionLinea2.load();


								//Obtenemos la filas seleccionadas
								miArray.length = 0;
								for (var i = 0; i < eOpts.length; i++) {
									miArray[i] = eOpts[i].data.Id;
									EditarSentido = eOpts[i].data.Sentido;
								}
                            }

								//if (selected.selected) {
								//	Ext.getCmp('btnCrearCSV').setDisabled(false);
                                    //for (var i = 0; i <= selected.selected.items.length; i++) {
                                    //    var node = selected.selected.items[i].data.IdPoliza
                                    //    miArray[i] = node;
                                    //    EditarSentido = selected.selected.items[i].data.Sentido
                                    //}

                                //     miArray.length = 0;
                                //    store.each(function (record, index) {
                                //        var node = selected.selected.items[index]
                                //        miArray[index] = node;
                                //        EditarSentido = selected.selected.items[index]
                                //});
                                //	}

                                //miArray.length = 0;
                                //store.each(function (record, index) {
                                //    //miArray.push(record.data.IdPoliza);                                   
                                //});
                             
                            
                            
                            
                            //habilitarDeshabilitar();

                            if (_Estado == "Rechazado") {                              

                                var grp = Ext.getCmp('grid');
                                var rec = grp.getSelectionModel().getSelection();

                                if (rec.length == 0) {
                                    Ext.getCmp('btnCrearCSV').setDisabled(true);
                                    Ext.getCmp('btnCancelar').setDisabled(true);
                                    Ext.getCmp('btnEditar').setDisabled(true);
                                }
                                if (rec.length == 1) {
                                    Ext.getCmp('btnCrearCSV').setDisabled(false);
                                    Ext.getCmp('btnCancelar').setDisabled(false);
                                    Ext.getCmp('btnEditar').setDisabled(false);
                                }
                            }
                            else {
                                var grp = Ext.getCmp('grid');
                                var rec = grp.getSelectionModel().getSelection();

                                if (rec.length == 0) {
                                    Ext.getCmp('btnCrearCSV').setDisabled(true);
                                    Ext.getCmp('btnCancelar').setDisabled(false);
                                }
                                if (rec.length == 1) {
                                    Ext.getCmp('btnCrearCSV').setDisabled(true);
									Ext.getCmp('btnCancelar').setDisabled(false);
									Ext.getCmp('btnEditar').setDisabled(true);
                                }
                            }
                        }
                    }
                },
				columns: [

					{ xtype: "gridcolumn", hidden: true, text: "Id", dataIndex: "Id" },
					//{ xtype: "gridcolumn", hidden: true, text: "IdPoliza", dataIndex: "IdPoliza" },

                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Poliza', width: 100, locked: false, text: "Poliza",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Poliza');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'Poliza',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Poliza',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'TipoFichero', width: 100, locked: false, text: "Tipo Fichero",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('TipoFichero');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtTipoFichero',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TipoFichero',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', width: 100, locked: false, text: "Sentido",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sentido');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtSentido',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Sentido',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Servicio', width: 100, text: "Servicio", locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Servicio');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtTrafico',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Servicio',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'SociedadSAP', width: 100, locked: false, text: "SociedadSAP",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('SociedadSAP');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtSociedadSAP',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'SociedadSAP',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Estado', width: 100, locked: false, text: "Estado",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Estado');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtEstado',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Estado',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Enviado', width: 100, locked: false, text: "Enviado",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Enviado');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtEnviado',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Enviado',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Nombre', width: 180, locked: false, text: "Nombre",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Nombre');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtNombre',
							enableKeyEvents: true,
							width: 180,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Nombre',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaCreacion', width: 100, locked: false, text: "Fecha Creación",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('FechaCreacion');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtFechaCreacion',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'FechaCreacion',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'FechaEnvio', width: 100, locked: false, text: "Fecha Envío",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('FechaEnvio');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtFechaEnvio',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'FechaEnvio',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'TipoFactura', width: 100, locked: false, text: "Tipo Factura",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('TipoFactura');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtTipoFactura',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TipoFactura',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'PeriodoConsumido', width: 100, locked: false, text: "Período Consumido",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('PeriodoConsumido');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtPeriodoConsumido',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'PeriodoConsumido',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NumeroPoliza', width: 100, locked: false, text: "Número Póliza",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('NumeroPoliza');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtNumeroPoliza',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'NumeroPoliza',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'DescripcionMensaje', width: 180, locked: false, text: "Descripción Mensaje",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('DescripcionMensaje');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtDescripcionMensaje',
							enableKeyEvents: true,
							width: 180,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'DescripcionMensaje',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Rechazado', width: 100, locked: false, text: "Rechazado",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Rechazado');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtRechazado',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Rechazado',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Reprocesado', width: 100, locked:false, text: "Reprocesado",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Reprocesado');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txtReprocesado',
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Reprocesado',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            //Primer Tabla
            //*****************
            {
                html: "<br/>",
                border: false
            },           
            {
                html: "<br/>",
                border: false
			},
			{
				html: "<h4>Detalle Archivo</h4> </br>",
				width: '50%',
				border: false
			},
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 300,
                renderTo: document.body,
                items: [

                    {
                        title: 'Línea Tipo 0',
                        border: false,
                        closable: true,
                        items: [
                            {
                                //grid                             
                                xtype: 'gridpanel',
                                id: 'gridPanel0',
                                store: store_BuscarCabeceraArchivo,
                                width: '30%',                                
                                columns:
                                    [
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Registro', width: 100, locked: false, text: "Registro",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Registro');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Mand', width: 100, locked: false, text: "Mand",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Mand');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Usuario', width: 100, locked: false, text: "Usuario",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Usuario');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                    ]
                            },
                        ]
                    },

                    //Panel2
                    {
                        title: 'Línea Tipo 1',
                        border: false,
                        closable: true,
                        items: [
                            {
                                //grid                             
                                xtype: 'gridpanel',
                                id: 'gridPanel1',
                                store: store_BuscarCabeceraRegistro,
								width: '100%',
								height: 95,
								autoScroll: true,
								
                                columns:
                                    [
                                        { xtype: "gridcolumn", hidden: true, text: "IdLinea2", dataIndex: "Id" },

                                        {
                                            xtype: "gridcolumn", sortable: true, hidden: true, dataIndex: 'Id_Devengo', width: 100, locked: false, text: "Id_Devengo",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Id_Devengo');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'REG', width: 100, locked: false, text: "REG",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Reg');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Trans', width: 100, locked: false, text: "Trans",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Trans');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'ClaseDocumento', width: 100, locked: false, text: "ClaseDocumento",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ClaseDocumento');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Sociedad', width: 100, locked: false, text: "Sociedad",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Sociedad');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Moneda', width: 100, locked: false, text: "Moneda",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Moneda');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'TipoCambio', width: 100, locked: false, text: "TipoCambio",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('TipoCambio');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'FechaDocumento', width: 100, locked: false, text: "FechaDocumento",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('FechaDocumento');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'FechaContabilizacion', width: 100, locked: false, text: "FechaContabilizacion",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('FechaContabilizacion');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'FechaReversion', width: 100, locked: false, text: "FechaReversion",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('FechaReversion');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'TextoCabecera', width: 100, locked: false, text: "TextoCabecera",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('TextoCabecera');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'MotivoReversion', width: 100, locked: false, text: "MotivoReversion",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('MotivoReversion');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Libro', width: 100, locked: false, text: "Libro",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Libro');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Referencia', width: 100, locked: false, text: "Referencia",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Referencia');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Referencia2', width: 100, locked: false, text: "Referencia2",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Referencia2');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'IdCasuistica', width: 100, locked: false, text: "IdCasuistica",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('IdCasuistica');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Asiento', width: 100, locked: false, text: "Asiento",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Asiento');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Referencia22', width: 100, locked: false, text: "Referencia22",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Referencia22');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },

                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'CalculoAut', width: 100, locked: false, text: "Calculo",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CalculoAut');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                    ]
                                //grid
                            },
                        ]
                    },

                    //Panel3
                    {
                        title: 'Línea Tipo 2',
                        border: false,
                        closable: true,
                        items: [
                            {
                                //grid
                                xtype: 'gridpanel',
                                id: 'gridpanel2',
                                store: store_BuscarDetalleRegistro,
                                width: '100%',
                                autoScroll: true,
								overflowX: 'auto',
								height: 210,
                                //bar: paginadorLInea2,
                                selModel: {
                                    listeners:
                                    {
                                        selectionchange: function (selected, Opst) {
                                            if (Opst.length) {
                                                _IdLinea2 = Opst[0].data.IdLinea2;
                                                _ClaveContab = Opst[0].data.ClaveContab;
                                                _CME = Opst[0].data.CME;
                                                _IndicadorImpuesto = Opst[0].data.IndicadorImpuesto;
                                                _CentroCosto = Opst[0].data.CentroCosto;
                                                _Cuenta = Opst[0].data.Cuenta;
                                                _Region = Opst[0].data.Region;
                                                _Licencia = Opst[0].data.Licencia;
                                                _TipoDeTrafico = Opst[0].data.TipoDeTrafico;
                                                _Ambito = Opst[0].data.Ambito;
                                                _Producto = Opst[0].data.Producto;
                                                _EmpresaGrupo = Opst[0].data.EmpresaGrupo;
                                                _AreaFuncional = Opst[0].data.AreaFuncional;
                                                _Subsegmento = Opst[0].data.Subsegmento;
                                                _BundlePaquetes = Opst[0].data.BundlePaquetes;
                                                _SubtipoLinea = Opst[0].data.SubtipoLinea;
                                                _Canal = Opst[0].data.Canal;
                                                _ServiciosPA = Opst[0].data.ServiciosPA;
                                                _SegmentoPA = Opst[0].data.SegmentoPA;

                                            }                                            
                                        }
                                    }
                                },
                                columns:
                                    [
                                        { xtype: "gridcolumn", hidden: true, text: "IdLinea2", dataIndex: "Id" },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, hidden: true, dataIndex: 'Id_Devengo', locked: false, text: "Id_Devengo",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Id_Devengo');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'REG', locked: false, text: "REG",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('REG');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'ClaveContab', locked: false, text: "Clave Contable",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ClaveContab');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'CME', locked: false, text: "CME",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CME');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'ImporteMD', locked: false, text: "ImporteMD",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ImporteMD');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'ImporteML', locked: false, text: "ImporteML",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ImporteML');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'IndicadorImpuesto', locked: false, text: "Indicador Impuesto",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('IndicadorImpuesto');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'CentroCosto', width: 100, locked: false, text: "Centro Costo",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CentroCosto');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Orden', locked: false, text: "Orden",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Orden');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'FechaBase', locked: false, text: "Fecha Base",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('FechaBase');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Asignacion', locked: false, text: "Asignacion",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Asignacion');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'TextoPosicion', locked: false, text: "Texto Posición",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('TextoPosicion');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'CondPago', locked: false, text: "Condición Pago",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CondPago');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'BloqPago', locked: false, text: "Bloqueo Pago",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('BloqPago');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'ViaPago', locked: false, text: "Via Pago",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ViaPago');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'BcoPropio', locked: false, text: "Bco Propio",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('BcoPropio');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Cuenta', locked: false, text: "Cuenta",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Cuenta');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'REF1', locked: false, text: "REF1",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('REF1');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'REF2', locked: false, text: "REF2",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('REF2');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'lineaDeNegocio', locked: false, text: "Línea de Negocio",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('lineaDeNegocio');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Campo20', locked: false, text: "Campo20",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Campo20');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Campo21', locked: false, text: "Campo21",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Campo21');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Campo22', locked: false, text: "Campo2",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Campo22');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
											xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'SociedadCuentasDeIngresos', locked: false, text: "Sociedad Si SonCuentas De Ingresos",
                                            renderer: function (v, cellValues, rec) {
												return rec.get('SociedadCuentasDeIngresos');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Subsegm', locked: false, text: "Subsegm",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Subsegm');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Servicio', locked: false, text: "Servicio",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Servicio');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Region', locked: false, text: "Región",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Region');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Licencia', locked: false, text: "Licencia",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Licencia');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'TipoDeTrafico', locked: false, text: "Tipo de Tráfico",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('TipoDeTrafico');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Ambito', locked: false, text: "Ambito",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Ambito');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Producto', locked: false, text: "Producto",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Producto');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Geografia', locked: false, text: "Goegrafía",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Geografia');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'Paquetes', locked: false, text: "Paquetes",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Paquetes');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'PlanRegulatorio', locked: false, text: "Plan Regulatorio",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('PlanRegulatorio');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'EmpresaGrupo', locked: false, text: "Empresa Grupo",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('EmpresaGrupo');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'REF3', locked: false, text: "REF3",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('REF3');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'AreaFuncional', locked: false, text: "Área Funcional",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('AreaFuncional');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'CalculoImpuesto', locked: false, text: "Calculo Impuesto",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CalculoImpuesto');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'FechaValor', locked: false, text: "Fecha Valor",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('FechaValor');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'IndicadorActividadPEl', locked: false, text: "Indicador de Actividad PEl",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('IndicadorActividadPEl');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        //{
                                        //    xtype: "gridcolumn", sortable: true, dataIndex: 'ImpuestoSobreIngresosBrutos',width: 100, locked: true, text: "Impuesto Sobre Ingresos Brutos",
                                        //    renderer: function (v, cellValues, rec) {
                                        //        return rec.get('ImpuestoSobreIngresosBrutos');
                                        //    },
                                        //    editor: {
                                        //        xtype: 'textfield'
                                        //    },
                                        //},
                                        {
                                            xtype: "gridcolumn", width: 100, sortable: true, dataIndex: 'RegionEstadoFederalLandProvinciaCondado', locked: false, text: "Region Estado Federal Land Provincia Condado",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('RegionEstadoFederalLandProvinciaCondado');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'ClaseDeDistribuciónIRPF', width: 100, locked: false, text: "Clase de Distribución IRPF",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ClaseDeDistribuciónIRPF');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Campo42', width: 100, locked: false, text: "Campo42",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Campo42');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Proyecto', width: 100, locked: false, text: "Proyecto",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Proyecto');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'SociedadGLAsociada', width: 100, locked: false, text: "Sociedad GL Agendad",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('SociedadGLAsociada');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Campo45', width: 100, locked: false, text: "Campo45",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Campo45');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'CodMaterial', width: 100, locked: false, text: "Codigo de Material",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CodMaterial');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'CodEmplazFiscal', width: 100, locked: false, text: "Código Emplaz Fiscal",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('CodEmplazFiscal');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Grafo', width: 100, locked: false, text: "Grafo",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Grafo');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Grafo2', width: 100, locked: false, text: "Grafo2",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Grafo2');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Subsegmento', width: 100, locked: false, text: "Subsegmento",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Subsegmento');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'BundlePaquetes', width: 100, locked: false, text: "Bundle Paquetes",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('BundlePaquetes');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'SubtipoLinea', width: 100, locked: false, text: "Subtipo Línea",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('SubtipoLinea');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'Canal', width: 100, locked: false, text: "Canal",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('Canal');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'ServiciosPA', width: 100, locked: false, text: "Servicios PA",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ServiciosPA');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'SegmentoPA', width: 100, locked: false, text: "Segmento PA",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('SegmentoPA');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'importebaseimpuesto', width: 100, locked: false, text: "Importe Base Impuesto",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('importebaseimpuesto');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, dataIndex: 'ASIENTO', width: 100, locked: false, text: "Asiento",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('ASIENTO');
                                            },
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                        },
                                    ]

                            },
                        ]
                    },
                    {
                        html: "<br/>",
                        border: false
                    },
                ]
            },
            {
                html: '<br/>',
                border: false
            },
			{
				html: "<h4>Editar Archivos </h4> </br>",
				width: '50%',
				border: false
			},
            //Panel Editar

              {
                xtype: 'panel',
                width: '100%',
                margin: '3 0 0 0',
                height: 600,
                renderTo: document.body,
                  items: [
                      {
                          xtype: 'button',
                          id: 'btn_Guardar',
						  border: false,
						  disabled: true,
                          html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='n'>Guardar</button>",
                          handler: function () {

						
							  //Recorremos la tabla para sacar los valores
                              arrayEditar.length = 0;
							  store_ModificarE.each(function (record, index) {
								  arrayEditar.push(record.data);								 
							  });

							  //SAcamos los cada uno de los valores
							  for (var i = 0; i <= arrayEditar.length; i++) {
								  var editar = arrayEditar[i];

								  var Poliza = editar.Poliza;
								  var IdLinea2 = editar.IdLinea2;
								  var Id_Devengo = editar.Id_Devengo;
								  var ClaveContab = editar.ClaveContab;
								  var CME = editar.CME;
								  var IndicadorImpuesto = editar.IndicadorImpuesto;
								  var CentroCosto = editar.CentroCosto;
								  var Cuenta = editar.Cuenta;
								  var Region = editar.Region;
								  var Licencia = editar.Licencia;
								  var TipoDeTrafico = editar.TipoDeTrafico;
								  var Ambito = editar.Ambito;
								  var Producto = editar.Producto;
								  var EmpresaGrupo = editar.EmpresaGrupo;
								  var AreaFuncional = editar.AreaFuncional;
								  var Subsegmento = editar.Subsegmento;
								  var BundlePaquetes = editar.BundlePaquetes;
								  var SubtipoLinea = editar.SubtipoLinea;
								  var Canal = editar.Canal;
								  var ServiciosPA = editar.ServiciosPA;
								  var SegmentoPA = editar.SegmentoPA;


								  var store_ModificarM = Ext.StoreManager.lookup('idstore_ModificarMultiplePoliza');

								  store_ModificarM.getProxy().extraParams.Poliza = Poliza;
								  store_ModificarM.getProxy().extraParams.IdLinea2 = IdLinea2;
								  store_ModificarM.getProxy().extraParams.Id_Devengo = Id_Devengo;
								  store_ModificarM.getProxy().extraParams.ClaveContab = ClaveContab;
								  store_ModificarM.getProxy().extraParams.CME = CME;
								  store_ModificarM.getProxy().extraParams.IndicadorImpuesto = IndicadorImpuesto;
								  store_ModificarM.getProxy().extraParams.CentroCosto = CentroCosto;
								  store_ModificarM.getProxy().extraParams.Cuenta = Cuenta;
								  store_ModificarM.getProxy().extraParams.Region = Region;
								  store_ModificarM.getProxy().extraParams.Licencia = Licencia;
								  store_ModificarM.getProxy().extraParams.TipoDeTrafico = TipoDeTrafico;
								  store_ModificarM.getProxy().extraParams.Ambito = Ambito;
								  store_ModificarM.getProxy().extraParams.Producto = Producto;
								  store_ModificarM.getProxy().extraParams.EmpresaGrupo = EmpresaGrupo;
								  store_ModificarM.getProxy().extraParams.AreaFuncional = AreaFuncional;
								  store_ModificarM.getProxy().extraParams.Subsegmento = Subsegmento;
								  store_ModificarM.getProxy().extraParams.BundlePaquetes = BundlePaquetes;
								  store_ModificarM.getProxy().extraParams.SubtipoLinea = SubtipoLinea;
								  store_ModificarM.getProxy().extraParams.Canal = Canal;
								  store_ModificarM.getProxy().extraParams.ServiciosPA = ServiciosPA;
								  store_ModificarM.getProxy().extraParams.SegmentoPA = SegmentoPA;
								  store_ModificarM.getProxy().extraParams.Sentido = EditarSentido;

								  store_ModificarM.load();
							  }
                          }

                      },
                      {
                          //grid                             
                          xtype: 'gridpanel',
                          id: 'gridPanelEditar',
                          store: store_ObtenerEditarMultiple,
						  width: '100%',
						  autoScroll: true,
						  //overflowX: 'auto',
						  selModel: {
							  listeners:
							  {								  
								  selectionchange: function (selected, Opst) {
									 
								  }
							  }
						  },
                          columns:
							  [
								  {
									  xtype: "gridcolumn", width: 100, sortable: true, hidden: true, dataIndex: 'IdLinea2', locked: true, text: "IdLinea2",         
                                      editor: {
                                          xtype: 'textfield',
                                          allowBlank: false
                                      },
								  },
								  {
									  xtype: "gridcolumn", width: 100,  dataIndex: 'Poliza',  text: "Poliza",         
                                      //editor: {
                                      //    xtype: 'textfield',
                                      //   // allowBlank: false
                                      //},
                                  },                                                                  
                                  {
                                      xtype: "gridcolumn",  dataIndex: 'ClaveContab', width: 100,  text: "Clave Contable",            
                                      editor: {
                                          xtype: 'textfield',
                                           allowBlank: false
                                      },
                                  },
                                  {
                                      xtype: "gridcolumn", dataIndex: 'CME', width: 100, text: "CME",                       
                                      editor: {
                                          xtype: 'textfield',
                                          allowBlank: false
                                      },
                                  },
                                  {
                                      xtype: "gridcolumn", dataIndex: 'IndicadorImpuesto', width: 100, text: "Indicador Impuesto",            
                                      editor: {
										  xtype: 'textfield',
										  allowBlank: false
                                      },
								  },

								  {
									  xtype: "gridcolumn", dataIndex: 'CentroCosto', width: 100, text: "Centro Costo",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Cuenta', width: 100, text: "Cuenta",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Region', width: 100, text: "Region",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Licencia', width: 100, text: "Licencia",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'TipoDeTrafico', width: 100, text: "TipoDeTrafico",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Ambito', width: 100, text: "Ambito",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Producto', width: 100, text: "Producto",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'EmpresaGrupo', width: 100, text: "Empresa Grupo",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'AreaFuncional', width: 100, text: "Area Funcional",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Subsegmento', width: 100, text: "Subsegmento",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'BundlePaquetes', width: 100, text: "Bundle Paquetes",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'SubtipoLinea', width: 100, text: "Subtipo Linea",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'Canal', width: 100, text: "Canal",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'ServiciosPA', width: 100, text: "Servicios PA",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },
								  {
									  xtype: "gridcolumn", dataIndex: 'SegmentoPA', width: 100, text: "Segmento PA",
									  editor: {
										  xtype: 'textfield',
										  allowBlank: false
									  },
								  },

							  ],
						  selModel: 'cellmodel',
						  plugins: {
							  ptype: 'cellediting',
							  clicksToEdit: 1,
							  //Ext.getCmp('btn_Guardar').setDisabled(false);
						  },
                          //selModel: 'rowmodel',
                          //plugins: {
                          //    ptype: 'rowediting',
                          //    clicksToEdit: 1
                          //},
                      },
                     
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
        panel.setSize(Ext.getBody().getViewSize().width - 20, Ext.getBody().getViewSize().height - 280);
        panel.doComponentLayout();

    });



    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grid');
        var rec = grp.getSelectionModel().getSelection();

        if (rec.length == 0) {
            Ext.getCmp('btnCrearCSV').setDisabled(true);
            Ext.getCmp('btnCancelar').setDisabled(true);
        }
        if (rec.length == 1) {
            Ext.getCmp('btnCrearCSV').setDisabled(false);
            Ext.getCmp('btnCancelar').setDisabled(false);
        }
    }


    function Modificar() {
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
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='n'>Guardar</button>",
                            handler: function () {

                                var store_Modificar = Ext.StoreManager.lookup('idstore_ModificarPoliza');
                                store_Modificar.getProxy().extraParams.Id = _IdLinea2;
                                ////store_Modificar.getProxy().extraParams.Operador = Ext.getCmp('cmbOperador').value;
                                //store_Modificar.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                store_Modificar.getProxy().extraParams.ClaveContab = Ext.getCmp('txtxClaveContab').value;
                                store_Modificar.getProxy().extraParams.CME = Ext.getCmp('txtCME').value;
                                store_Modificar.getProxy().extraParams.IndicadorImpuesto = Ext.getCmp('txtIndicadorImp').value;
                                store_Modificar.getProxy().extraParams.CentroCosto = Ext.getCmp('txtCC').value;
                                store_Modificar.getProxy().extraParams.Cuenta = Ext.getCmp('txtCuenta').value;
                                store_Modificar.getProxy().extraParams.Region = Ext.getCmp('txtRegion').value;
                                store_Modificar.getProxy().extraParams.Licencia = Ext.getCmp('txtLicencia').value;
                                store_Modificar.getProxy().extraParams.TipoDeTrafico = Ext.getCmp('txtTipoTrafico').value;
                                store_Modificar.getProxy().extraParams.Ambito = Ext.getCmp('txtAmbito').value;
                                store_Modificar.getProxy().extraParams.Producto = Ext.getCmp('txtProducto').value;
                                store_Modificar.getProxy().extraParams.EmpresaGrupo = Ext.getCmp('txtEmpresaGrupo').value;
                                store_Modificar.getProxy().extraParams.AreaFuncional = Ext.getCmp('txtAreaFuncional').value;
                                store_Modificar.getProxy().extraParams.Subsegmento = Ext.getCmp('txtSubsegmento').value;
                                store_Modificar.getProxy().extraParams.BundlePaquetes = Ext.getCmp('txtBundle').value;
                                store_Modificar.getProxy().extraParams.SubtipoLinea = Ext.getCmp('txtSubtipoLinea').value;
                                store_Modificar.getProxy().extraParams.Canal = Ext.getCmp('txtCanal').value;
                                store_Modificar.getProxy().extraParams.ServiciosPA = Ext.getCmp('txtServiciosPA').value;
                                store_Modificar.getProxy().extraParams.SegmentoPA = Ext.getCmp('txtSegmentoPA').value;
                                store_Modificar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store_Modificar.load();

                                this.up('window').destroy();
                                var store = Ext.StoreManager.lookup('idstore_BuscarDetalleRegistro');
                                store.load();
                               
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'fls_empresa',
                    width: '100%',
                    border: 0,
                    frame: false,
                    items: [
                        {
                            xtype: 'displayfield',
                            anchor: '100%',
                            id: 'idPoliza',
                            margin: '5 5 5 5',
                            value: _IdLinea2,
                            fieldLabel: 'Id Poliza'
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtxClaveContab',
                            id: 'txtxClaveContab',
                            fieldLabel: "Clave Contable",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _ClaveContab,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Clave contable es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCME',
                            id: 'txtCME',
                            fieldLabel: "CME",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _CME,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo CME es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtIndicadorImp',
                            id: 'txtIndicadorImp',
                            fieldLabel: "Indicador Impuesto",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _IndicadorImpuesto,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Indicador Impuesto es requerido"

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCC',
                            id: 'txtCC',
                            fieldLabel: "Centro Costo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _CentroCosto,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Centro Costo Impuesto es requerido"

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCuenta',
                            id: 'txtCuenta',
                            fieldLabel: "Cuenta",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Cuenta,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Cuenta Impuesto es requerido"

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtRegion',
                            id: 'txtRegion',
                            fieldLabel: "Region",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Region,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Region es requerido"

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtLicencia',
                            id: 'txtLicencia',
                            fieldLabel: "Licencia",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Licencia,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Licencia es requerido"

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtTipoTrafico',
                            id: 'txtTipoTrafico',
                            fieldLabel: "Tipo Trafico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _TipoDeTrafico,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Tipo de Trafico es requerido"

                        },
                        {
                            xtype: 'textfield',
                            name: 'txtAmbito',
                            id: 'txtAmbito',
                            fieldLabel: "Ambito",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Ambito,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Ambito es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtProducto',
                            id: 'txtProducto',
                            fieldLabel: "Producto",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Producto,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Producto es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtEmpresaGrupo',
                            id: 'txtEmpresaGrupo',
                            fieldLabel: "Empresa Grupo",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _EmpresaGrupo,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Empresa Grupo es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtAreaFuncional',
                            id: 'txtAreaFuncional',
                            fieldLabel: "Area Funcional",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _AreaFuncional,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Area Funcional es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtSubsegmento',
                            id: 'txtSubsegmento',
                            fieldLabel: "Subsegmento",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Subsegmento,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Subsegmento es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtBundle',
                            id: 'txtBundle',
                            fieldLabel: "Bundle",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _BundlePaquetes,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Bundle es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtSubtipoLinea',
                            id: 'txtSubtipoLinea',
                            fieldLabel: "Subtipo Linea",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _SubtipoLinea,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Subtipo Linea es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCanal',
                            id: 'txtCanal',
                            fieldLabel: "Canal",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _Canal,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Canal es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtServiciosPA',
                            id: 'txtServiciosPA',
                            fieldLabel: "ServiciosPA",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _ServiciosPA,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo ServiciosPA es requerido"
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtSegmentoPA',
                            id: 'txtSegmentoPA',
                            fieldLabel: "SegmentoPA",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: _SegmentoPA,
                            maxLength: 50,
                            enforceMaxLength: true,
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo SegmentoPA es requerido"
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


    
    function GuardarEditarMultiple() {

       
    }


    var lectura = ["btnCancelar", "cmbPeriodoC", "btnResultados", "btnRespustaSAP", "grid", "gridPanel0", "gridpanel2","gridPanelEditar"];
    var nuevo = ["btnCrearCSV","btn_Guardar"];
    var editar = ["btnEditar"];
    var eliminar = null;

    permisosVariosElementos('Polizas', lectura, nuevo, editar, eliminar, 'log');

})