
Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;
    var totalProcesados;
    var total;
    var totalErroneos;
    var listaErroneos = new Array();
    var strErroneos = '';
    var mensaje;

    Ext.define('modeloSubmenu',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Controlador', mapping: 'Controlador' },
                { name: 'Nombre', mapping: 'Nombre' }

            ]
        });

    var storeLlenaSubmenu = Ext.create('Ext.data.Store', {
        model: 'modeloSubmenu',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Carga/LlenaCarga?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                noCache: true,
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'hbox' },
        flex: 1,
        items: [
            {
                xtype: 'fieldset',
                margin: '0 0 0 6',
                layout: { type: 'vbox' },
                height: '100%',
                width: '50%',
                border: false,
                items: [
                    {
                        html: "<h2>Cargar Archivo CSV</h2>",
                        border: false,
                        width: '100%'

                    },
                    {
                        xtype: 'panel',
                        layout: { type: 'vbox' },
                        width: '100%',
                        border: false,
                        items: [
                            {
                                xtype: 'combobox',
                                name: 'cmbTipoCarga',
                                id: 'cmbTipoCarga',
                                store: storeLlenaSubmenu,
                                queryMode: 'remote',
                                valueField: 'Controlador',
                                displayField: 'Nombre',
                                fieldLabel: "Tipo carga",
                                width: '60%',
                                margin: '5 0 0 55',
                                editable: false,
                                allowBlank: false,
                                blankText: 'El campo es requerido',
                                msgTarget: 'under',
                                maxLength: 100,
                                enforceMaxLength: true,
                                labelWidth: 100,
                                listeners: {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        listaErroneos = null;
                                        totalProcesados = "";
                                        total = "";
                                        totalErroneos = "";
                                        strErroneos = "";
                                        Ext.getCmp('pnlResultados').setVisible(false);
                                    }
                                }

                            },
                            {
                                xtype: 'filefield',
                                name: 'archivoCSV',
                                id: 'archivoCSV',
                                fieldLabel: 'Archivo Excel',
                                labelWidth: 50,
                                msgTarget: 'side',
                                allowBlank: false,
                                blankText: 'El campo es requerido',
                                buttonText: 'Examinar...',
                                margin: '5 0 0 55',
                                width: '60%',
                                labelWidth: 100,
                                maskRe: '/[a-z\d\-_\.]+\.xlsx/.xls',
                                listeners:
                                {
                                    change: function (f, v) {
                                        var node = Ext.DomQuery.selectNode('input[id=' + f.getInputId() + ']');
                                        node.value = v.replace("C:\\fakepath\\", "");
                                    }
                                }
                            },
                            {
                                xtype: 'fieldset',
                                layout: { type: 'hbox' },
                                margin: '5 0 0 0',
                                flex: 1,
                                width: '50%',
                                border: false,
                                items:
                                    [
                                        {
                                            xtype: 'button',
                                            id: 'btnCargar',
                                            margin: '0 0 0 145',
                                            html: "<button class='btn btn-primary'  style='outline:none'>Ok</button>",
                                            border: 0,
                                            handler: function () {
                                                var form = this.up('form').getForm();
                                                if (form.isValid()) {
                                                    form.submit({
                                                        url: '../' + VIRTUAL_DIRECTORY + Ext.getCmp('cmbTipoCarga').value + '/CargarCSV?lineaNegocio=' + lineaNegocio,
                                                        waitMsg: "Cargando...",
                                                        success: function (form, action) {
                                                            data = Ext.JSON.decode(action.response.responseText);
                                                            Ext.getCmp('pnlResultados').setVisible(false);
                                                            strErroneos = '';
                                                            var mensaje;

                                                            if (data.mensajeExistencia == null) {
                                                                mensaje = data.mensaje;
                                                            } else {
                                                                mensaje = data.mensaje + "<br/>" + data.mensajeExistencia;
                                                            }

                                                            Ext.Msg.show({
                                                                title: "Notificación",
                                                                msg: mensaje,
                                                                buttons: Ext.Msg.OK,
                                                                icon: Ext.MessageBox.INFO
                                                            });

                                                            listaErroneos = data.results;
                                                            totalProcesados = data.totalProcesados;
                                                            total = totalProcesados + listaErroneos.length;
                                                            totalErroneos = listaErroneos.length;

                                                            for (var i = 0; i < listaErroneos.length; ++i)
                                                                strErroneos += listaErroneos[i] + '<br/>';

                                                            Ext.getCmp('pnlResultados').setVisible(true);
                                                        },
                                                        failure: function (forms, action) {
                                                            data = Ext.JSON.decode(action.response.responseText);
                                                            console.log(data);
                                                            mensaje = data.mensaje;
                                                            console.log(data);
                                                            Ext.Msg.show({
                                                                title: "Aviso",
                                                                msg: mensaje,
                                                                buttons: Ext.Msg.OK,
                                                                icon: Ext.MessageBox.INFO
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            id: 'btnCancelar',
                                            margin: '0 -10 0 0',
                                            html: "<button class='btn btn-danger'  style='outline:none'>Cancelar</button>",
                                            border: 0,
                                            handler: function () {
                                                Ext.getCmp('cmbTipoCarga').reset();
                                                Ext.getCmp('archivoCSV').reset();
                                            }
                                        }
                                    ]
                            }

                        ]
                    },
                    {
                        html: "<br/>"
                    }
                ]
            },
            {
                xtype: 'panel',
                title: 'Resultados de la carga',
                id: 'pnlResultados',
                autoScroll: true,
                overflowY: 'auto',
                hidden: true,
                header: {
                    titlePosition: 2,
                    titleAlign: 'center'
                },
                width: 670,
                height: 400,
                listeners:
                {
                    show: function (eOpts) {

                        Ext.getCmp('procesados').setValue("<div>" + totalProcesados + "</div >");
                        Ext.getCmp('total').setValue("<div>" + total + "</div >");
                        Ext.getCmp('erroneos').setValue("<div>" + totalErroneos + "</div >");
                        Ext.getCmp('txtErroneos').setValue("<div> <b>" + strErroneos + "</b></div>");
                    }
                },
                fieldDefaults: {
                    labelStyle: 'font-weight:bold',
                    bodyStyle: "background-color: #E6E6E6"
                },
                items: [
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        width: '80%',
                        border: false,
                        items: [
                            {

                                width: "50%",
                                xtype: 'displayfield',
                                border: false,
                                value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros cargados con éxito</b></div>",
                                margin: '3 0 0 0'

                            },
                            {
                                xtype: 'displayfield',
                                id: 'procesados',
                                border: false,
                                margin: '3 0 0 50'

                            }

                        ]
                    },
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        width: '80%',
                        border: false,
                        items: [
                            {
                                width: "50%",
                                xtype: 'displayfield',
                                border: false,
                                value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros procesados</b></div>",
                                margin: '3 0 0 0'
                            },
                            {
                                xtype: 'displayfield',
                                id: 'total',
                                border: false,
                                margin: '3 0 0 50'
                            }

                        ]
                    },
                    {
                        xtype: 'fieldset',
                        layout: { type: 'hbox' },
                        width: '80%',
                        border: false,
                        items: [
                            {
                                width: "50%",
                                xtype: 'displayfield',
                                border: false,
                                value: "<div style='background-color: #2E64FE; font-size:100%'><b>Registros erróneos</b></div>",
                                margin: '3 0 0 0'

                            },
                            {
                                xtype: 'displayfield',
                                id: 'erroneos',
                                border: false,
                                margin: '3 0 0 50'
                            }

                        ]
                    },
                    {
                        xtype: 'displayfield',
                        id: 'txtErroneos',
                        autoScroll: true,
                        overflowY: 'auto',
                        width: 500,
                        height: 150,
                        margin: '0 5 2 5'
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

});