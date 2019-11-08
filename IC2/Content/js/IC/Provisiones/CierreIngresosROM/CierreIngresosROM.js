/*
 * Autor: Margarito Mancilla
 * Fecha: 11/Agosto/2019
*/
"use strict";

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
                });
            }
        };
    }
});

function getTabsConfig() {
    var tabsConfig = [];
   //Prov Tarifa

    tabsConfig.push({
        title: 'Prov Tarifa',
        config: Utils.defineModelStore({
            name: 'IngRomCieProvTarifa',
            paginadorText: "Prov Tarifa",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "Plmn", mapping: "Plmn" },
                { name: "Periodo", mapping: "Periodo" },
                { name: "Operador", mapping: "Operador" },
                { name: "SoGl", mapping: "SoGl" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "ProvTarifa", mapping: "ProvTarifa" },
                { name: "AjNcRealVsDevengoMesAnte", mapping: "AjNcRealVsDevengoMesAnte" },
                { name: "ProvDevengoTarifa", mapping: "ProvDevengoTarifa" },
                { name: "ProvisionNcTarifaCancelada", mapping: "ProvisionNcTarifaCancelada" },
                { name: "ProvisionNcTarifa", mapping: "ProvisionNcTarifa" },
                { name: "TotalProvIngresoTarifa", mapping: "TotalProvIngresoTarifa" },
                { name: "ProvisionIngresoTarifa", mapping: "ProvisionIngresoTarifa" },
                { name: "CancelacionProvisionIngresoTarifa", mapping: "CancelacionProvisionIngresoTarifa" },
                { name: "TotalProvisionNcTarifa", mapping: "TotalProvisionNcTarifa" },
                { name: "ComplementoTarifaMesesAnteriores", mapping: "ComplementoTarifaMesesAnteriores" },
                { name: "TotalProvTarifa", mapping: "TotalProvTarifa" }
            ],
            gridColumns: [
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "SoGl", dataIndex: "SoGl", text: "SoGl", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "ProvTarifa", dataIndex: "ProvTarifa", text: "ProvTarifa", width: "8%" },
                { id: "AjNcRealVsDevengoMesAnte", dataIndex: "AjNcRealVsDevengoMesAnte", text: "AjNcRealVsDevengoMesAnte", width: "8%" },
                { id: "ProvDevengoTarifa", dataIndex: "ProvDevengoTarifa", text: "ProvDevengoTarifa", width: "8%" },
                { id: "ProvisionNcTarifaCancelada", dataIndex: "ProvisionNcTarifaCancelada", text: "ProvisionNcTarifaCancelada", width: "8%" },
                { id: "ProvisionNcTarifa", dataIndex: "ProvisionNcTarifa", text: "ProvisionNcTarifa", width: "8%" },
                { id: "TotalProvIngresoTarifa", dataIndex: "TotalProvIngresoTarifa", text: "TotalProvIngresoTarifa", width: "8%" },
                { id: "ProvisionIngresoTarifa", dataIndex: "ProvisionIngresoTarifa", text: "ProvisionIngresoTarifa", width: "8%" },
                { id: "CancelacionProvisionIngresoTarifa", dataIndex: "CancelacionProvisionIngresoTarifa", text: "CancelacionProvisionIngresoTarifa", width: "8%" },
                { id: "TotalProvisionNcTarifa", dataIndex: "TotalProvisionNcTarifa", text: "TotalProvisionNcTarifa", width: "8%" },
                { id: "ComplementoTarifaMesesAnteriores", dataIndex: "ComplementoTarifaMesesAnteriores", text: "ComplementoTarifaMesesAnteriores", width: "8%" },
                { id: "TotalProvTarifa", dataIndex: "TotalProvTarifa", text: "TotalProvTarifa", width: "8%" }
            ]
        })
    });

    //Aj Nc Mes Anterior

    tabsConfig.push({
        title: 'Ajus Nc Real Vs Dev',
        config: Utils.defineModelStore({
            name: 'IngRomCieAjusNcRealVsDev',
            paginadorText: "Ajus Nc Real Vs Dev",
            urlStore: '..'+VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "Periodo", mapping: "Periodo" },
                { name: "PlmnV", mapping: "PlmnV" },
                { name: "Operador", mapping: "Operador" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "ProvisionTarifaMesAnterior", mapping: "ProvisionTarifaMesAnterior" },
                { name: "ProvisionRealTarifaDeMesAnterior", mapping: "ProvisionRealTarifaDeMesAnterior" },
                { name: "AjustesTarifaReal", mapping: "AjustesTarifaReal" }
            ],
            gridColumns: [
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "PlmnV", dataIndex: "PlmnV", text: "PlmnV", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "ProvisionTarifaMesAnterior", dataIndex: "ProvisionTarifaMesAnterior", text: "ProvisionTarifaMesAnterior", width: "8%" },
                { id: "ProvisionRealTarifaDeMesAnterior", dataIndex: "ProvisionRealTarifaDeMesAnterior", text: "ProvisionRealTarifaDeMesAnterior", width: "8%" },
                { id: "AjustesTarifaReal", dataIndex: "AjustesTarifaReal", text: "AjustesTarifaReal", width: "8%" }
            ]
        })
    });

    //TC

    tabsConfig.push({
        title: 'IngRomCieTC',
        config: Utils.defineModelStore({
            name: 'IngRomCieTC',
            paginadorText: "IngRomCieTC",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro?conSuma=false',
            modelFields: [
                { name: "Periodo", mapping: "Periodo" },
                { name: "Concepto", mapping: "Concepto" },
                { name: "TC", mapping: "TC" }
            ],
            gridColumns: [
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "Concepto", dataIndex: "Concepto", text: "Concepto", width: "8%" },
                { id: "TC", dataIndex: "TC", text: "TC", width: "8%" }
            ]
        })
    });

   // Devengo Acumulado Tráfico

    tabsConfig.push({
        title: 'Devengo Acumulado Tráfico',
        config: Utils.defineModelStore({
            name: 'IngRomCieDevengoAcumuladoTrafico',
            paginadorText: "Devengo Acumulado Tráfico",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                {name:"Plmn",mapping:"Plmn"},
                {name:"Operador",mapping:"Operador"},
                {name:"Periodo",mapping:"Periodo"},
                {name:"Deudor",mapping:"Deudor"},
                {name:"DevengoTrafico",mapping:"DevengoTrafico"},
                {name:"DevengoPendienteFacturar",mapping:"DevengoPendienteFacturar"},
                {name:"DevengoAcumulado",mapping:"DevengoAcumulado"}
            ],
            gridColumns: [
                {id:"Plmn",dataIndex:"Plmn",text:"Plmn",width:"8%"},
                {id:"Operador",dataIndex:"Operador",text:"Operador",width:"8%"},
                {id:"Periodo",dataIndex:"Periodo",text:"Periodo",width:"8%"},
                {id:"Deudor",dataIndex:"Deudor",text:"Deudor",width:"8%"},
                {id:"DevengoTrafico",dataIndex:"DevengoTrafico",text:"DevengoTrafico",width:"8%"},
                {id:"DevengoPendienteFacturar",dataIndex:"DevengoPendienteFacturar",text:"DevengoPendienteFacturar",width:"8%"},
                {id:"DevengoAcumulado",dataIndex:"DevengoAcumulado",text:"DevengoAcumulado",width:"8%"}
            ]
        })
    });

    //Base de Datos

    tabsConfig.push({
        title: 'Base de Datos',
        config: Utils.defineModelStore({
            name: 'IngRomCieBaseDatos',
            paginadorText: "Base de Datos",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                {name:"Plmn",mapping:"Plmn"},
                { name: "TipoRegistro", mapping:"TipoRegistro"},
                { name: "RazonSocial", mapping:"RazonSocial"},
                {name:"Deudor",mapping:"Deudor"},
                { name: "Moneda", mapping:"Moneda"},
                { name: "TC", mapping: "TC" },
                { name: "Periodo", mapping: "Periodo" },
                { name: "NoAcreedorSap", mapping: "NoAcreedorSap" },
                { name: "AcreedorRegistro", mapping: "AcreedorRegistro" },
                { name: "Operacion", mapping: "Operacion" },
                { name: "SociedadGl", mapping: "SociedadGl" },
                { name: "ImporteMd", mapping: "ImporteMd" },
                { name: "ImporteMxn", mapping: "ImporteMxn" },
                { name: "RealConfirmado", mapping: "RealConfirmado" },
                { name: "Cancelacion", mapping: "Cancelacion" },
                { name: "RemanenteMd", mapping: "RemanenteMd" },
                { name: "RemanenteMxn", mapping: "RemanenteMxn" },
                { name: "RemanenteUsd", mapping: "RemanenteUsd" }
            ],
            gridColumns: [
                {id:"Plmn",dataIndex:"Plmn",text:"Plmn",width:"8%"},
                { id: "TipoRegistro", dataIndex: "TipoRegistro", text:"TipoRegistro",width:"8%"},
                { id: "RazonSocial", dataIndex: "RazonSocial", text:"RazonSocial",width:"8%"},
                {id:"Deudor",dataIndex:"Deudor",text:"Deudor",width:"8%"},
                { id: "Moneda", dataIndex: "Moneda", text:"Moneda",width:"8%"},
                { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "NoAcreedorSap", dataIndex: "NoAcreedorSap", text: "NoAcreedorSap", width: "8%" },
                { id: "AcreedorRegistro", dataIndex: "AcreedorRegistro", text: "AcreedorRegistro", width: "8%" },
                { id: "Operacion", dataIndex: "Operacion", text: "Operacion", width: "8%" },
                { id: "SociedadGl", dataIndex: "SociedadGl", text: "SociedadGl", width: "8%" },
                { id: "ImporteMd", dataIndex: "ImporteMd", text: "ImporteMd", width: "8%" },
                { id: "ImporteMxn", dataIndex: "ImporteMxn", text: "ImporteMxn", width: "8%" },
                { id: "RealConfirmado", dataIndex: "RealConfirmado", text: "RealConfirmado", width: "8%" },
                { id: "Cancelacion", dataIndex: "Cancelacion", text: "Cancelacion", width: "8%" },
                { id: "RemanenteMd", dataIndex: "RemanenteMd", text: "RemanenteMd", width: "8%" },
                { id: "RemanenteMxn", dataIndex: "RemanenteMxn", text: "RemanenteMxn", width: "8%" },
                { id: "RemanenteUsd", dataIndex: "RemanenteUsd", text: "RemanenteUsd", width: "8%" }
            ]
        })
    });

    //ProvTarifaAcumMesAnte

    tabsConfig.push({
        title: 'Prov Tarifa Acum Mes Ante',
        config: Utils.defineModelStore({
            name: 'IngRomCieProvTarifaAcumMesAnte',
            paginadorText: "ProvTarifaAcumMesAnte",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                {name:"Periodo",mapping:"Periodo"},
                { name: "ProvNcTarifaUsdMesAnte", mapping:"ProvNcTarifaUsdMesAnte"},
                { name: "ProvIngresoTarifaUsdMesAnte", mapping:"ProvIngresoTarifaUsdMesAnte"},
                { name: "ProvTarifaTotalUsd", mapping:"ProvTarifaTotalUsd"},
                { name: "CancelacionProvisionNcTarifa", mapping:"CancelacionProvisionNcTarifa"},
                { name: "CancelacionProvisionIngresoTarifa", mapping:"CancelacionProvisionIngresoTarifa"},
                { name: "TotalNcAcumulada", mapping:"TotalNcAcumulada"},
                { name: "TotalProvIngresoAcumulada", mapping:"TotalProvIngresoAcumulada"},
                { name: "Tc", mapping:"Tc"},
                { name: "ProvNcTarifaMxn", mapping:"ProvNcTarifaMxn"},
                { name: "ProvIngrsoMxn", mapping:"ProvIngrsoMxn"}

            ],
            gridColumns: [
                {id:"Periodo",dataIndex:"Periodo",text:"Periodo",width:"8%"},
                { id: "ProvNcTarifaUsdMesAnte", dataIndex: "ProvNcTarifaUsdMesAnte", text:"ProvNcTarifaUsdMesAnte",width:"8%"},
                { id: "ProvIngresoTarifaUsdMesAnte", dataIndex: "ProvIngresoTarifaUsdMesAnte", text:"ProvIngresoTarifaUsdMesAnte",width:"8%"},
                { id: "ProvTarifaTotalUsd", dataIndex: "ProvTarifaTotalUsd", text:"ProvTarifaTotalUsd",width:"8%"},
                { id: "CancelacionProvisionNcTarifa", dataIndex: "CancelacionProvisionNcTarifa", text:"CancelacionProvisionNcTarifa",width:"8%"},
                { id: "CancelacionProvisionIngresoTarifa", dataIndex: "CancelacionProvisionIngresoTarifa", text:"CancelacionProvisionIngresoTarifa",width:"8%"},
                { id: "TotalNcAcumulada", dataIndex: "TotalNcAcumulada", text:"TotalNcAcumulada",width:"8%"},
                { id: "TotalProvIngresoAcumulada", dataIndex: "TotalProvIngresoAcumulada", text:"TotalProvIngresoAcumulada",width:"8%"},
                { id: "Tc", dataIndex: "Tc", text:"Tc",width:"8%"},
                { id: "ProvNcTarifaMxn", dataIndex: "ProvNcTarifaMxn", text:"ProvNcTarifaMxn",width:"8%"},
                { id: "ProvIngrsoMxn", dataIndex: "ProvIngrsoMxn", text:"ProvIngrsoMxn",width:"8%"}
            ]
        })
    });

    //Facturacion Trafico

    tabsConfig.push({
        title: 'Facturación Trafico',
        config: Utils.defineModelStore({
            name: 'IngRomCieFacturacionTrafico',
            paginadorText: "Facturación Trafico",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "FechaFactura", mapping: "FechaFactura" },
                { name: "FechaTrafico", mapping: "FechaTrafico" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "FacturadoSinImpuestos", mapping: "FacturadoSinImpuestos" },
                { name: "PorEmitir", mapping: "PorEmitir" },
                { name: "ReporteARMonthlyInvoice", mapping: "ReporteARMonthlyInvoice" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" }
            ],
            gridColumns: [
                { id: "FechaFactura", dataIndex: "FechaFactura", text: "FechaFactura", width: "8%" },
                { id: "FechaTrafico", dataIndex: "FechaTrafico", text: "FechaTrafico", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "FacturadoSinImpuestos", dataIndex: "FacturadoSinImpuestos", text: "FacturadoSinImpuestos", width: "8%" },
                { id: "PorEmitir", dataIndex: "PorEmitir", text: "PorEmitir", width: "8%" },
                { id: "ReporteARMonthlyInvoice", dataIndex: "ReporteARMonthlyInvoice", text: "ReporteARMonthlyInvoice", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" }
            ]
        })
    });

    //Factura Tarifa

    tabsConfig.push({
        title: 'Factura Tarifa',
        config: Utils.defineModelStore({
            name: 'IngRomCieFacturaTarifa',
            paginadorText: "Factura Tarifa",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
               // { name: "FechaFactura", mapping: "FechaFactura" },
                { name: "FechaInicio", mapping: "FechaInicio" },
                { name: "FechaFin", mapping: "FechaFin" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "FacturadoSinImpuestos", mapping: "FacturadoSinImpuestos" },
                { name: "PorEmitir", mapping: "PorEmitir" },
                { name: "ReporteARMonthlyInvoice", mapping: "ReporteARMonthlyInvoice" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" }
            ],
            gridColumns: [
                //{ id: "FechaFactura", dataIndex: "FechaFactura", text: "FechaFactura", width: "8%" },
                { id: "FechaInicio", dataIndex: "FechaInicio", text: "FechaInicio", width: "8%" },
                { id: "FechaFin", dataIndex: "FechaFin", text: "FechaFin", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "FacturadoSinImpuestos", dataIndex: "FacturadoSinImpuestos", text: "FacturadoSinImpuestos", width: "8%" },
                { id: "PorEmitir", dataIndex: "PorEmitir", text: "PorEmitir", width: "8%" },
                { id: "ReporteARMonthlyInvoice", dataIndex: "ReporteARMonthlyInvoice", text: "ReporteARMonthlyInvoice", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" }
            ]
        })
    });

    //NC Trafico

    tabsConfig.push({
        title: 'NC Trafico',
        config: Utils.defineModelStore({
            name: 'IngRomCieNcTrafico',
            paginadorText: 'NC Trafico',
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "FechaTrafico", mapping: "FechaTrafico" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "FolioSap", mapping: "FolioSap" },
                { name: "FacturadoSinImpuestos", mapping: "FacturadoSinImpuestos" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" }
            ],
            gridColumns: [
                { id: "FechaTrafico", dataIndex: "FechaTrafico", text: "FechaTrafico", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "FolioSap", dataIndex: "FolioSap", text: "FolioSap", width: "8%" },
                { id: "FacturadoSinImpuestos", dataIndex: "FacturadoSinImpuestos", text: "FacturadoSinImpuestos", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" }
            ]
        })
    });

    // NC Tarifa
    tabsConfig.push({
        title: 'NC Tarifa',
        config:
        Utils.defineModelStore({
            name: 'IngRomCieNcTarifa',
            paginadorText: "NC Tarifa",
                urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "FechaInicio", mapping: "FechaInicio" },
                { name: "FechaFin", mapping: "FechaFin" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "Operador", mapping: "Operador" },
                { name: "FolioFacturaSap", mapping: "FolioFacturaSap" },
                { name: "FacturadoSinImpuestos", mapping: "FacturadoSinImpuestos" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" }
            ],
            gridColumns: [
                { id: "FechaInicio", dataIndex: "FechaInicio", text: "FechaInicio", width: "8%" },
                { id: "FechaFin", dataIndex: "FechaFin", text: "FechaFin", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "FolioFacturaSap", dataIndex: "FolioFacturaSap", text: "FolioFacturaSap", width: "8%" },
                { id: "FacturadoSinImpuestos", dataIndex: "FacturadoSinImpuestos", text: "FacturadoSinImpuestos", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" }

            ]
        })
    });

    //Ingreso

    tabsConfig.push({
        title: 'Ingreso',
        config: Utils.defineModelStore({
            name: 'IngRomCieIngreso',
            paginadorText: "Ingreso",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "Periodo", mapping: "Periodo" },
                { name: "CuentaDeResultados", mapping: "CuentaDeResultados" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Operador", mapping: "Operador" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "SoGL", mapping: "SoGL" },
                { name: "Moneda", mapping: "Moneda" },
                { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
                { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
                { name: "CancelacionProvCostoTarifaMesAnterior", mapping: "CancelacionProvCostoTarifaMesAnterior" },
                { name: "CancelacionDevengoTotalMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior" },
                { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
                { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
                { name: "NcrTrafico", mapping: "NcrTrafico" },
                { name: "NcrTarifa", mapping: "NcrTarifa" },
                { name: "DevengoCostoTrafico", mapping: "DevengoCostoTrafico" },
                { name: "ProvCostoDifTarifa", mapping: "ProvCostoDifTarifa" },
                { name: "ProvNcDifTarifa", mapping: "ProvNcDifTarifa" },
                { name: "ExcesoOInsufDevMesAnt", mapping: "ExcesoOInsufDevMesAnt" },
                { name: "OtrosAjustes", mapping: "OtrosAjustes" },
                { name: "FluctuacionAReclasificar", mapping: "FluctuacionAReclasificar" },
                { name: "TotalDevengo", mapping: "TotalDevengo" },
                { name: "Grupo", mapping: "Grupo" }
            ],
            gridColumns: [
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "CuentaDeResultados", dataIndex: "CuentaDeResultados", text: "CuentaDeResultados", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "SoGL", dataIndex: "SoGL", text: "SoGL", width: "8%" },
                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
                { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
                { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
                { id: "CancelacionProvCostoTarifaMesAnterior", dataIndex: "CancelacionProvCostoTarifaMesAnterior", text: "CancelacionProvCostoTarifaMesAnterior", width: "8%" },
                { id: "CancelacionDevengoTotalMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior", text: "CancelacionDevengoTotalMesAnterior", width: "8%" },
                { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
                { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
                { id: "NcrTrafico", dataIndex: "NcrTrafico", text: "NcrTrafico", width: "8%" },
                { id: "NcrTarifa", dataIndex: "NcrTarifa", text: "NcrTarifa", width: "8%" },
                { id: "DevengoCostoTrafico", dataIndex: "DevengoCostoTrafico", text: "DevengoCostoTrafico", width: "8%" },
                { id: "ProvCostoDifTarifa", dataIndex: "ProvCostoDifTarifa", text: "ProvCostoDifTarifa", width: "8%" },
                { id: "ProvNcDifTarifa", dataIndex: "ProvNcDifTarifa", text: "ProvNcDifTarifa", width: "8%" },
                { id: "ExcesoOInsufDevMesAnt", dataIndex: "ExcesoOInsufDevMesAnt", text: "ExcesoOInsufDevMesAnt", width: "8%" },
                { id: "OtrosAjustes", dataIndex: "OtrosAjustes", text: "OtrosAjustes", width: "8%" },
                { id: "FluctuacionAReclasificar", dataIndex: "FluctuacionAReclasificar", text: "FluctuacionAReclasificar", width: "8%" },
                { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" }
            ]
        })
    });

    //Sabana

    tabsConfig.push({
        title: 'Sabana',
        config: Utils.defineModelStore({
            name: 'IngRomCieSabana',
            paginadorText: "Sabana",
            urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultaGeneralXFiltro',
            modelFields: [
               // { name: "IngRomCieSabanaId", mapping: "IngRomCieSabanaId" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Deudor", mapping: "Deudor" },
                { name: "SociedadGL", mapping: "SociedadGL" },
                { name: "Devengo", mapping: "Devengo" },
                { name: "NcAcumMesActual", mapping: "NcAcumMesActual" },
                { name: "TotalNcEmitida", mapping: "TotalNcEmitida" },
                { name: "Acum", mapping: "Acum" },
                { name: "TotalSabana", mapping: "TotalSabana" }
            ],
            gridColumns: [
                //{ id: "IngRomCieSabanaId", dataIndex: "IngRomCieSabanaId", text: "IngRomCieSabanaId", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Deudor", dataIndex: "Deudor", text: "Deudor", width: "8%" },
                { id: "SociedadGL", dataIndex: "SociedadGL", text: "SociedadGL", width: "8%" },
                { id: "Devengo", dataIndex: "Devengo", text: "Devengo", width: "8%" },
                { id: "NcAcumMesActual", dataIndex: "NcAcumMesActual", text: "NcAcumMesActual", width: "8%" },
                { id: "TotalNcEmitida", dataIndex: "TotalNcEmitida", text: "TotalNcEmitida", width: "8%" },
                { id: "Acum", dataIndex: "Acum", text: "Acum", width: "8%" },
                { id: "TotalSabana", dataIndex: "TotalSabana", text: "TotalSabana", width: "8%" }
            ]
        })
    });

    return tabsConfig;
}

Ext.onReady(function () {
    Ext.QuickTips.init();

    var tabsConfig = getTabsConfig();

    var panelDef = Utils.panelPrincipal({
        title: 'Cierre de Ingresos ROAMING',
        controller: 'CierreIngresosROM',
        conCalculo: true,
        tabsConfig : tabsConfig
    });

    var panel = Ext.create('Ext.form.Panel', panelDef);

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

    var lectura = ["IngCieRomTC", "IngRomCieDevengoAcumuladoTrafico", "IngRomCieBaseDatos", "IngRomCieProvTarifaAcumMesAnte", "IngRomCieFacturacionTrafico", "IngRomCieFacturaTarifa", "IngRomCieNcTrafico", "IngRomCieNcTarifa", "IngRomCieIngreso", "IngRomCieSabana"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    //permisosVariosElementos('CierreIngresosROM', lectura, nuevo, editar, eliminar, 'log');


});
