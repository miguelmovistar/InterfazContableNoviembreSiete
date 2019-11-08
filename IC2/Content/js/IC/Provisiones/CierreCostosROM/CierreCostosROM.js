/* Nombre: CierreCostosROM.js  
* Creado por: Margarito Mancilla Torres
* Fecha de Creación: 20/Agosto/2019
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

    tabsConfig.push({
        title: 'Costos', config: Utils.defineModelStore([
            {
                name: 'CosRomCieCosto',
                title:'Costos',
                paginadorText: "Costos",
                urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
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
                    { name: "Grupo", mapping: "Grupo" },
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
                    { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },

                ]
            },
            //{
            //    name: 'CosRomCieCosto_01_',
            //    title: 'Costos Recurrentes',
            //    paginadorText: "Costos Recurrentes",
            //    urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro?EsCostoRecurrente=true',
            //    modelFields: [
            //        { name: "Periodo", mapping: "Periodo" },
            //        { name: "CuentaDeResultados", mapping: "CuentaDeResultados" },
            //        { name: "Plmn", mapping: "Plmn" },
            //        { name: "Operador", mapping: "Operador" },
            //        { name: "Acreedor", mapping: "Acreedor" },
            //        { name: "SoGL", mapping: "SoGL" },
            //        { name: "Moneda", mapping: "Moneda" },
            //        { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
            //        { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
            //        { name: "CancelacionProvCostoTarifaMesAnterior", mapping: "CancelacionProvCostoTarifaMesAnterior" },
            //        { name: "CancelacionDevengoTotalMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior" },
            //        { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
            //        { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
            //        { name: "NcrTrafico", mapping: "NcrTrafico" },
            //        { name: "NcrTarifa", mapping: "NcrTarifa" },
            //        { name: "DevengoCostoTrafico", mapping: "DevengoCostoTrafico" },
            //        { name: "ProvCostoDifTarifa", mapping: "ProvCostoDifTarifa" },
            //        { name: "ProvNcDifTarifa", mapping: "ProvNcDifTarifa" },
            //        { name: "ExcesoOInsufDevMesAnt", mapping: "ExcesoOInsufDevMesAnt" },
            //        { name: "OtrosAjustes", mapping: "OtrosAjustes" },
            //        { name: "FluctuacionAReclasificar", mapping: "FluctuacionAReclasificar" },
            //        { name: "TotalDevengo", mapping: "TotalDevengo" },
            //        { name: "Grupo", mapping: "Grupo" },
            //    ],
            //    gridColumns: [
            //        { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
            //        { id: "CuentaDeResultados", dataIndex: "CuentaDeResultados", text: "CuentaDeResultados", width: "8%" },
            //        { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
            //        { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
            //        { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
            //        { id: "SoGL", dataIndex: "SoGL", text: "SoGL", width: "8%" },
            //        { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
            //        { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
            //        { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
            //        { id: "CancelacionProvCostoTarifaMesAnterior", dataIndex: "CancelacionProvCostoTarifaMesAnterior", text: "CancelacionProvCostoTarifaMesAnterior", width: "8%" },
            //        { id: "CancelacionDevengoTotalMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior", text: "CancelacionDevengoTotalMesAnterior", width: "8%" },
            //        { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
            //        { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
            //        { id: "NcrTrafico", dataIndex: "NcrTrafico", text: "NcrTrafico", width: "8%" },
            //        { id: "NcrTarifa", dataIndex: "NcrTarifa", text: "NcrTarifa", width: "8%" },
            //        { id: "DevengoCostoTrafico", dataIndex: "DevengoCostoTrafico", text: "DevengoCostoTrafico", width: "8%" },
            //        { id: "ProvCostoDifTarifa", dataIndex: "ProvCostoDifTarifa", text: "ProvCostoDifTarifa", width: "8%" },
            //        { id: "ProvNcDifTarifa", dataIndex: "ProvNcDifTarifa", text: "ProvNcDifTarifa", width: "8%" },
            //        { id: "ExcesoOInsufDevMesAnt", dataIndex: "ExcesoOInsufDevMesAnt", text: "ExcesoOInsufDevMesAnt", width: "8%" },
            //        { id: "OtrosAjustes", dataIndex: "OtrosAjustes", text: "OtrosAjustes", width: "8%" },
            //        { id: "FluctuacionAReclasificar", dataIndex: "FluctuacionAReclasificar", text: "FluctuacionAReclasificar", width: "8%" },
            //        { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
            //        { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" }
            //    ]
            //},
            //{
            //    name: 'CosRomCieCosto_02_',
            //    title: 'Costos MXN',
            //    paginadorText: "Costos Recurrentes",
            //    urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro?ExPaEsMxn=true',
            //    modelFields: [
            //        { name: "Periodo", mapping: "Periodo" },
            //        { name: "CuentaDeResultados", mapping: "CuentaDeResultados" },
            //        { name: "Plmn", mapping: "Plmn" },
            //        { name: "Operador", mapping: "Operador" },
            //        { name: "Acreedor", mapping: "Acreedor" },
            //        { name: "SoGL", mapping: "SoGL" },
            //        { name: "Moneda", mapping: "Moneda" },
            //        { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
            //        { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
            //        { name: "CancelacionProvCostoTarifaMesAnterior", mapping: "CancelacionProvCostoTarifaMesAnterior" },
            //        { name: "CancelacionDevengoTotalMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior" },
            //        { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
            //        { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
            //        { name: "NcrTrafico", mapping: "NcrTrafico" },
            //        { name: "NcrTarifa", mapping: "NcrTarifa" },
            //        { name: "DevengoCostoTrafico", mapping: "DevengoCostoTrafico" },
            //        { name: "ProvCostoDifTarifa", mapping: "ProvCostoDifTarifa" },
            //        { name: "ProvNcDifTarifa", mapping: "ProvNcDifTarifa" },
            //        { name: "ExcesoOInsufDevMesAnt", mapping: "ExcesoOInsufDevMesAnt" },
            //        { name: "OtrosAjustes", mapping: "OtrosAjustes" },
            //        { name: "FluctuacionAReclasificar", mapping: "FluctuacionAReclasificar" },
            //        { name: "TotalDevengo", mapping: "TotalDevengo" },
            //        { name: "Grupo", mapping: "Grupo" },
            //    ],
            //    gridColumns: [
            //        { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
            //        { id: "CuentaDeResultados", dataIndex: "CuentaDeResultados", text: "CuentaDeResultados", width: "8%" },
            //        { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
            //        { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
            //        { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
            //        { id: "SoGL", dataIndex: "SoGL", text: "SoGL", width: "8%" },
            //        { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
            //        { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
            //        { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
            //        { id: "CancelacionProvCostoTarifaMesAnterior", dataIndex: "CancelacionProvCostoTarifaMesAnterior", text: "CancelacionProvCostoTarifaMesAnterior", width: "8%" },
            //        { id: "CancelacionDevengoTotalMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior", text: "CancelacionDevengoTotalMesAnterior", width: "8%" },
            //        { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
            //        { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
            //        { id: "NcrTrafico", dataIndex: "NcrTrafico", text: "NcrTrafico", width: "8%" },
            //        { id: "NcrTarifa", dataIndex: "NcrTarifa", text: "NcrTarifa", width: "8%" },
            //        { id: "DevengoCostoTrafico", dataIndex: "DevengoCostoTrafico", text: "DevengoCostoTrafico", width: "8%" },
            //        { id: "ProvCostoDifTarifa", dataIndex: "ProvCostoDifTarifa", text: "ProvCostoDifTarifa", width: "8%" },
            //        { id: "ProvNcDifTarifa", dataIndex: "ProvNcDifTarifa", text: "ProvNcDifTarifa", width: "8%" },
            //        { id: "ExcesoOInsufDevMesAnt", dataIndex: "ExcesoOInsufDevMesAnt", text: "ExcesoOInsufDevMesAnt", width: "8%" },
            //        { id: "OtrosAjustes", dataIndex: "OtrosAjustes", text: "OtrosAjustes", width: "8%" },
            //        { id: "FluctuacionAReclasificar", dataIndex: "FluctuacionAReclasificar", text: "FluctuacionAReclasificar", width: "8%" },
            //        { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
            //        { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" }
            //    ]
            //}
        ])
    });

    //tabsConfig.push({
    //    title: 'Costos', config: Utils.defineModelStore([
    //        //{
    //        //    name: 'CosRomCieCosto',
    //        //    title: 'Costos',
    //        //    paginadorText: "Costos",
    //        //    urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
    //        //    modelFields: [
    //        //        { name: "Periodo", mapping: "Periodo" },
    //        //        { name: "CuentaDeResultados", mapping: "CuentaDeResultados" },
    //        //        { name: "Plmn", mapping: "Plmn" },
    //        //        { name: "Operador", mapping: "Operador" },
    //        //        { name: "Acreedor", mapping: "Acreedor" },
    //        //        { name: "SoGL", mapping: "SoGL" },
    //        //        { name: "Moneda", mapping: "Moneda" },
    //        //        { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
    //        //        { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
    //        //        { name: "CancelacionProvCostoTarifaMesAnterior", mapping: "CancelacionProvCostoTarifaMesAnterior" },
    //        //        { name: "CancelacionDevengoTotalMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior" },
    //        //        { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
    //        //        { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
    //        //        { name: "NcrTrafico", mapping: "NcrTrafico" },
    //        //        { name: "NcrTarifa", mapping: "NcrTarifa" },
    //        //        { name: "DevengoCostoTrafico", mapping: "DevengoCostoTrafico" },
    //        //        { name: "ProvCostoDifTarifa", mapping: "ProvCostoDifTarifa" },
    //        //        { name: "ProvNcDifTarifa", mapping: "ProvNcDifTarifa" },
    //        //        { name: "ExcesoOInsufDevMesAnt", mapping: "ExcesoOInsufDevMesAnt" },
    //        //        { name: "OtrosAjustes", mapping: "OtrosAjustes" },
    //        //        { name: "FluctuacionAReclasificar", mapping: "FluctuacionAReclasificar" },
    //        //        { name: "TotalDevengo", mapping: "TotalDevengo" },
    //        //        { name: "Grupo", mapping: "Grupo" },
    //        //    ],
    //        //    gridColumns: [
    //        //        { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
    //        //        { id: "CuentaDeResultados", dataIndex: "CuentaDeResultados", text: "CuentaDeResultados", width: "8%" },
    //        //        { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
    //        //        { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
    //        //        { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
    //        //        { id: "SoGL", dataIndex: "SoGL", text: "SoGL", width: "8%" },
    //        //        { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
    //        //        { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
    //        //        { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
    //        //        { id: "CancelacionProvCostoTarifaMesAnterior", dataIndex: "CancelacionProvCostoTarifaMesAnterior", text: "CancelacionProvCostoTarifaMesAnterior", width: "8%" },
    //        //        { id: "CancelacionDevengoTotalMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior", text: "CancelacionDevengoTotalMesAnterior", width: "8%" },
    //        //        { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
    //        //        { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
    //        //        { id: "NcrTrafico", dataIndex: "NcrTrafico", text: "NcrTrafico", width: "8%" },
    //        //        { id: "NcrTarifa", dataIndex: "NcrTarifa", text: "NcrTarifa", width: "8%" },
    //        //        { id: "DevengoCostoTrafico", dataIndex: "DevengoCostoTrafico", text: "DevengoCostoTrafico", width: "8%" },
    //        //        { id: "ProvCostoDifTarifa", dataIndex: "ProvCostoDifTarifa", text: "ProvCostoDifTarifa", width: "8%" },
    //        //        { id: "ProvNcDifTarifa", dataIndex: "ProvNcDifTarifa", text: "ProvNcDifTarifa", width: "8%" },
    //        //        { id: "ExcesoOInsufDevMesAnt", dataIndex: "ExcesoOInsufDevMesAnt", text: "ExcesoOInsufDevMesAnt", width: "8%" },
    //        //        { id: "OtrosAjustes", dataIndex: "OtrosAjustes", text: "OtrosAjustes", width: "8%" },
    //        //        { id: "FluctuacionAReclasificar", dataIndex: "FluctuacionAReclasificar", text: "FluctuacionAReclasificar", width: "8%" },
    //        //        { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
    //        //        { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },

    //        //    ]
    //        //},
    //        {
    //            name: 'CosRomCieCosto_01_',
    //            title: 'Costos Recurrentes',
    //            paginadorText: "Costos Recurrentes",
    //            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro?EsCostoRecurrente=true',
    //            modelFields: [
    //                { name: "Periodo", mapping: "Periodo" },
    //                { name: "CuentaDeResultados", mapping: "CuentaDeResultados" },
    //                { name: "Plmn", mapping: "Plmn" },
    //                { name: "Operador", mapping: "Operador" },
    //                { name: "Acreedor", mapping: "Acreedor" },
    //                { name: "SoGL", mapping: "SoGL" },
    //                { name: "Moneda", mapping: "Moneda" },
    //                { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
    //                { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
    //                { name: "CancelacionProvCostoTarifaMesAnterior", mapping: "CancelacionProvCostoTarifaMesAnterior" },
    //                { name: "CancelacionDevengoTotalMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior" },
    //                { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
    //                { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
    //                { name: "NcrTrafico", mapping: "NcrTrafico" },
    //                { name: "NcrTarifa", mapping: "NcrTarifa" },
    //                { name: "DevengoCostoTrafico", mapping: "DevengoCostoTrafico" },
    //                { name: "ProvCostoDifTarifa", mapping: "ProvCostoDifTarifa" },
    //                { name: "ProvNcDifTarifa", mapping: "ProvNcDifTarifa" },
    //                { name: "ExcesoOInsufDevMesAnt", mapping: "ExcesoOInsufDevMesAnt" },
    //                { name: "OtrosAjustes", mapping: "OtrosAjustes" },
    //                { name: "FluctuacionAReclasificar", mapping: "FluctuacionAReclasificar" },
    //                { name: "TotalDevengo", mapping: "TotalDevengo" },
    //                { name: "Grupo", mapping: "Grupo" },
    //            ],
    //            gridColumns: [
    //                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
    //                { id: "CuentaDeResultados", dataIndex: "CuentaDeResultados", text: "CuentaDeResultados", width: "8%" },
    //                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
    //                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
    //                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
    //                { id: "SoGL", dataIndex: "SoGL", text: "SoGL", width: "8%" },
    //                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
    //                { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
    //                { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
    //                { id: "CancelacionProvCostoTarifaMesAnterior", dataIndex: "CancelacionProvCostoTarifaMesAnterior", text: "CancelacionProvCostoTarifaMesAnterior", width: "8%" },
    //                { id: "CancelacionDevengoTotalMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior", text: "CancelacionDevengoTotalMesAnterior", width: "8%" },
    //                { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
    //                { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
    //                { id: "NcrTrafico", dataIndex: "NcrTrafico", text: "NcrTrafico", width: "8%" },
    //                { id: "NcrTarifa", dataIndex: "NcrTarifa", text: "NcrTarifa", width: "8%" },
    //                { id: "DevengoCostoTrafico", dataIndex: "DevengoCostoTrafico", text: "DevengoCostoTrafico", width: "8%" },
    //                { id: "ProvCostoDifTarifa", dataIndex: "ProvCostoDifTarifa", text: "ProvCostoDifTarifa", width: "8%" },
    //                { id: "ProvNcDifTarifa", dataIndex: "ProvNcDifTarifa", text: "ProvNcDifTarifa", width: "8%" },
    //                { id: "ExcesoOInsufDevMesAnt", dataIndex: "ExcesoOInsufDevMesAnt", text: "ExcesoOInsufDevMesAnt", width: "8%" },
    //                { id: "OtrosAjustes", dataIndex: "OtrosAjustes", text: "OtrosAjustes", width: "8%" },
    //                { id: "FluctuacionAReclasificar", dataIndex: "FluctuacionAReclasificar", text: "FluctuacionAReclasificar", width: "8%" },
    //                { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
    //                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" }
    //            ]
    //        },
    //        //{
    //        //    name: 'CosRomCieCosto_02_',
    //        //    title: 'Costos MXN',
    //        //    paginadorText: "Costos Recurrentes",
    //        //    urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro?ExPaEsMxn=true',
    //        //    modelFields: [
    //        //        { name: "Periodo", mapping: "Periodo" },
    //        //        { name: "CuentaDeResultados", mapping: "CuentaDeResultados" },
    //        //        { name: "Plmn", mapping: "Plmn" },
    //        //        { name: "Operador", mapping: "Operador" },
    //        //        { name: "Acreedor", mapping: "Acreedor" },
    //        //        { name: "SoGL", mapping: "SoGL" },
    //        //        { name: "Moneda", mapping: "Moneda" },
    //        //        { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
    //        //        { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
    //        //        { name: "CancelacionProvCostoTarifaMesAnterior", mapping: "CancelacionProvCostoTarifaMesAnterior" },
    //        //        { name: "CancelacionDevengoTotalMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior" },
    //        //        { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
    //        //        { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
    //        //        { name: "NcrTrafico", mapping: "NcrTrafico" },
    //        //        { name: "NcrTarifa", mapping: "NcrTarifa" },
    //        //        { name: "DevengoCostoTrafico", mapping: "DevengoCostoTrafico" },
    //        //        { name: "ProvCostoDifTarifa", mapping: "ProvCostoDifTarifa" },
    //        //        { name: "ProvNcDifTarifa", mapping: "ProvNcDifTarifa" },
    //        //        { name: "ExcesoOInsufDevMesAnt", mapping: "ExcesoOInsufDevMesAnt" },
    //        //        { name: "OtrosAjustes", mapping: "OtrosAjustes" },
    //        //        { name: "FluctuacionAReclasificar", mapping: "FluctuacionAReclasificar" },
    //        //        { name: "TotalDevengo", mapping: "TotalDevengo" },
    //        //        { name: "Grupo", mapping: "Grupo" },
    //        //    ],
    //        //    gridColumns: [
    //        //        { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
    //        //        { id: "CuentaDeResultados", dataIndex: "CuentaDeResultados", text: "CuentaDeResultados", width: "8%" },
    //        //        { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
    //        //        { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
    //        //        { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
    //        //        { id: "SoGL", dataIndex: "SoGL", text: "SoGL", width: "8%" },
    //        //        { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
    //        //        { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
    //        //        { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
    //        //        { id: "CancelacionProvCostoTarifaMesAnterior", dataIndex: "CancelacionProvCostoTarifaMesAnterior", text: "CancelacionProvCostoTarifaMesAnterior", width: "8%" },
    //        //        { id: "CancelacionDevengoTotalMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior", text: "CancelacionDevengoTotalMesAnterior", width: "8%" },
    //        //        { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
    //        //        { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
    //        //        { id: "NcrTrafico", dataIndex: "NcrTrafico", text: "NcrTrafico", width: "8%" },
    //        //        { id: "NcrTarifa", dataIndex: "NcrTarifa", text: "NcrTarifa", width: "8%" },
    //        //        { id: "DevengoCostoTrafico", dataIndex: "DevengoCostoTrafico", text: "DevengoCostoTrafico", width: "8%" },
    //        //        { id: "ProvCostoDifTarifa", dataIndex: "ProvCostoDifTarifa", text: "ProvCostoDifTarifa", width: "8%" },
    //        //        { id: "ProvNcDifTarifa", dataIndex: "ProvNcDifTarifa", text: "ProvNcDifTarifa", width: "8%" },
    //        //        { id: "ExcesoOInsufDevMesAnt", dataIndex: "ExcesoOInsufDevMesAnt", text: "ExcesoOInsufDevMesAnt", width: "8%" },
    //        //        { id: "OtrosAjustes", dataIndex: "OtrosAjustes", text: "OtrosAjustes", width: "8%" },
    //        //        { id: "FluctuacionAReclasificar", dataIndex: "FluctuacionAReclasificar", text: "FluctuacionAReclasificar", width: "8%" },
    //        //        { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
    //        //        { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" }
    //        //    ]
    //        //}
    //    ])
    //});

    tabsConfig.push({
        title: 'Prov Tarifa', config: Utils.defineModelStore({
            name: 'CosRomCieProvTar',
            paginadorText: "Prov Tarifa",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieProvTarId", mapping: "CosRomCieProvTarId" },
                //{ name: "OperadorId", mapping: "OperadorId" },
                //{ name: "PXQCostosROMId", mapping: "PXQCostosROMId" },
                //{ name: "CostoMovimientoPeriodosAnterioresId", mapping: "CostoMovimientoPeriodosAnterioresId" },
                { name: "Periodo", mapping: "Periodo" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Operador", mapping: "Operador" },
                { name: "SoGl", mapping: "SoGl" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "ProvTarifa", mapping: "ProvTarifa" },
                { name: "AjusteTarifaRealVsProvisionMesPasado", mapping: "AjusteTarifaRealVsProvisionMesPasado" },
                { name: "ProvisionTarifaDevengada", mapping: "ProvisionTarifaDevengada" },
                { name: "ProvisionNcTarifaCancelada", mapping: "ProvisionNcTarifaCancelada" },
                { name: "ProvisionNcTarifa", mapping: "ProvisionNcTarifa" },
                { name: "TotalProvisionNcTarifa", mapping: "TotalProvisionNcTarifa" },
                { name: "ProvisionDeCostoCancelada", mapping: "ProvisionDeCostoCancelada" },
                { name: "ProvisionDeCostoTarifaCancelada", mapping: "ProvisionDeCostoTarifaCancelada" },
                { name: "TotalProvCostoTarifa", mapping: "TotalProvCostoTarifa" },
                { name: "ComplementoTarifaMesesAnteriores", mapping: "ComplementoTarifaMesesAnteriores" },
                { name: "TotalProvTarifa", mapping: "TotalProvTarifa" },

            ],
            gridColumns: [
                //{ id: "CosRomCieProvTarId", dataIndex: "CosRomCieProvTarId", text: "CosRomCieProvTarId", width: "8%" },
                //{ id: "OperadorId", dataIndex: "OperadorId", text: "OperadorId", width: "8%" },
                //{ id: "PXQCostosROMId", dataIndex: "PXQCostosROMId", text: "PXQCostosROMId", width: "8%" },
                //{ id: "CostoMovimientoPeriodosAnterioresId", dataIndex: "CostoMovimientoPeriodosAnterioresId", text: "CostoMovimientoPeriodosAnterioresId", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "SoGl", dataIndex: "SoGl", text: "SoGl", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "ProvTarifa", dataIndex: "ProvTarifa", text: "ProvTarifa", width: "8%" },
                { id: "AjusteTarifaRealVsProvisionMesPasado", dataIndex: "AjusteTarifaRealVsProvisionMesPasado", text: "AjusteTarifaRealVsProvisionMesPasado", width: "8%" },
                { id: "ProvisionTarifaDevengada", dataIndex: "ProvisionTarifaDevengada", text: "ProvisionTarifaDevengada", width: "8%" },
                { id: "ProvisionNcTarifaCancelada", dataIndex: "ProvisionNcTarifaCancelada", text: "ProvisionNcTarifaCancelada", width: "8%" },
                { id: "ProvisionNcTarifa", dataIndex: "ProvisionNcTarifa", text: "ProvisionNcTarifa", width: "8%" },
                { id: "TotalProvisionNcTarifa", dataIndex: "TotalProvisionNcTarifa", text: "TotalProvisionNcTarifa", width: "8%" },
                { id: "ProvisionDeCostoCancelada", dataIndex: "ProvisionDeCostoCancelada", text: "ProvisionDeCostoCancelada", width: "8%" },
                { id: "ProvisionDeCostoTarifaCancelada", dataIndex: "ProvisionDeCostoTarifaCancelada", text: "ProvisionDeCostoTarifaCancelada", width: "8%" },
                { id: "TotalProvCostoTarifa", dataIndex: "TotalProvCostoTarifa", text: "TotalProvCostoTarifa", width: "8%" },
                { id: "ComplementoTarifaMesesAnteriores", dataIndex: "ComplementoTarifaMesesAnteriores", text: "ComplementoTarifaMesesAnteriores", width: "8%" },
                { id: "TotalProvTarifa", dataIndex: "TotalProvTarifa", text: "TotalProvTarifa", width: "8%" },

            ]
        })
    });

    tabsConfig.push({
        title: 'Aj NC mes anterior ', config: Utils.defineModelStore({
            name: 'CosRomCieAjNcMesAnterior',
            paginadorText: "Aj NC mes anterior",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieAjNcMesAnteriorId", mapping: "CosRomCieAjNcMesAnteriorId" },
                { name: "PlmnV", mapping: "PlmnV" },
                { name: "Operador", mapping: "Operador" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "ProvisionTarifaMesAnterior", mapping: "ProvisionTarifaMesAnterior" },
                { name: "ProvisionRealTarifaDeMesAnterior", mapping: "ProvisionRealTarifaDeMesAnterior" },
                { name: "AjustesTarifaReal", mapping: "AjustesTarifaReal" },
                { name: "Periodo", mapping: "Periodo" }
            ],
            gridColumns: [
                //{ id: "CosRomCieAjNcMesAnteriorId", dataIndex: "CosRomCieAjNcMesAnteriorId", text: "CosRomCieAjNcMesAnteriorId", width: "8%" },
                { id: "PlmnV", dataIndex: "PlmnV", text: "PlmnV", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "ProvisionTarifaMesAnterior", dataIndex: "ProvisionTarifaMesAnterior", text: "ProvisionTarifaMesAnterior", width: "8%" },
                { id: "ProvisionRealTarifaDeMesAnterior", dataIndex: "ProvisionRealTarifaDeMesAnterior", text: "ProvisionRealTarifaDeMesAnterior", width: "8%" },
                { id: "AjustesTarifaReal", dataIndex: "AjustesTarifaReal", text: "AjustesTarifaReal", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Trafico Por Mes', config: Utils.defineModelStore({
            name: 'CosRomCieTraficoPorMes',
            paginadorText: "Trafico Por Mes",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [{ name: "Plmn", mapping: "Plmn" },
            { name: "Periodo", mapping: "Periodo" },
            { name: "RemantentProvTrafico", mapping: "RemantentProvTrafico" },
            { name: "RemantentProvTotal", mapping: "RemantentProvTotal" },
            { name: "RealConfirmadoProvTrafico", mapping: "RealConfirmadoProvTrafico" },
            { name: "TotalConfirmado", mapping: "TotalConfirmado" },
            { name: "CancelacionProvTrafico", mapping: "CancelacionProvTrafico" },
            { name: "TotalProvCancelada", mapping: "TotalProvCancelada" },
            { name: "RemantentActualProvTrafico", mapping: "RemantentActualProvTrafico" }
            ],
            gridColumns: [
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "RemantentProvTrafico", dataIndex: "RemantentProvTrafico", text: "RemantentProvTrafico", width: "8%" },
                { id: "RemantentProvTotal", dataIndex: "RemantentProvTotal", text: "RemantentProvTotal", width: "8%" },
                { id: "RealConfirmadoProvTrafico", dataIndex: "RealConfirmadoProvTrafico", text: "RealConfirmadoProvTrafico", width: "8%" },
                { id: "TotalConfirmado", dataIndex: "TotalConfirmado", text: "TotalConfirmado", width: "8%" },
                { id: "CancelacionProvTrafico", dataIndex: "CancelacionProvTrafico", text: "CancelacionProvTrafico", width: "8%" },
                { id: "TotalProvCancelada", dataIndex: "TotalProvCancelada", text: "TotalProvCancelada", width: "8%" },
                { id: "RemantentActualProvTrafico", dataIndex: "RemantentActualProvTrafico", text: "RemantentActualProvTrafico", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Costos Recurrentes', config: Utils.defineModelStore({
            name: 'CosRomCieCostosRecurrentes',
            paginadorText: "Costos Recurrentes",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "Periodo", mapping: "Periodo" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Moneda", mapping: "Moneda" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "RemanenteProvCostoRecurrente", mapping: "RemanenteProvCostoRecurrente" },
                { name: "RemanenteTotalProvCostoRecurrente", mapping: "RemanenteTotalProvCostoRecurrente" },
                { name: "RealConfirmadoProvCostoRecurrente", mapping: "RealConfirmadoProvCostoRecurrente" },
                { name: "RealConfirmadoTotalProvCosto", mapping: "RealConfirmadoTotalProvCosto" },
                { name: "CancelacionProvCostoRecurrente", mapping: "CancelacionProvCostoRecurrente" },
                { name: "CancelacionTotalProvCostoRecurrente", mapping: "CancelacionTotalProvCostoRecurrente" },
                { name: "RemantenteActualCostoRecurrente", mapping: "RemantenteActualCostoRecurrente" },
                { name: "RemantenteActualCostoRecurrente", mapping: "RemantenteActualCostoRecurrente" },
                { name: "TotalCostoRecurrente", mapping: "TotalCostoRecurrente" }
            ],
            gridColumns: [
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "PLMN", width: "8%" },
                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "RemanenteProvCostoRecurrente", dataIndex: "RemanenteProvCostoRecurrente", text: "RemanenteProvCostoRecurrente", width: "8%" },
                { id: "RemanenteTotalProvCostoRecurrente", dataIndex: "RemanenteTotalProvCostoRecurrente", text: "RemanenteTotalProvCostoRecurrente", width: "8%" },
                { id: "RealConfirmadoProvCostoRecurrente", dataIndex: "RealConfirmadoProvCostoRecurrente", text: "RealConfirmadoProvCostoRecurrente", width: "8%" },
                { id: "RealConfirmadoTotalProvCosto", dataIndex: "RealConfirmadoTotalProvCosto", text: "RealConfirmadoTotalProvCosto", width: "8%" },
                { id: "CancelacionProvCostoRecurrente", dataIndex: "CancelacionProvCostoRecurrente", text: "CancelacionProvCostoRecurrente", width: "8%" },
                { id: "CancelacionTotalProvCostoRecurrente", dataIndex: "CancelacionTotalProvCostoRecurrente", text: "CancelacionTotalProvCostoRecurrente", width: "8%" },
                { id: "RemantenteActualCostoRecurrente", dataIndex: "RemantenteActualCostoRecurrente", text: "RemantenteActualCostoRecurrente", width: "8%" },
                { id: "RemantenteActualCostoRecurrente", dataIndex: "RemantenteActualCostoRecurrente", text: "CostoRecurrenteActual", width: "8%" },
                { id: "TotalCostoRecurrente", dataIndex: "TotalCostoRecurrente", text: "TotalCostoRecurrente", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Devengo Acumulado', config: Utils.defineModelStore({
            name: 'CosRomCieDevengoAcumulado',
            paginadorText: "Devengo Acumulado",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "Periodo", mapping: "Periodo" },
                { name: "Periodo", mapping: "Periodo" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "EsCostoRecurrente", mapping: "EsCostoRecurrente" },
                { name: "Moneda", mapping: "Moneda" },
                { name: "RemanenteProvCostoTraficoMesAnterior", mapping: "RemanenteProvCostoTraficoMesAnterior" },
                { name: "TotalAceptaciones", mapping: "TotalAceptaciones" },
                { name: "CancelacionProv", mapping: "CancelacionProv" },
                { name: "RemanenteProvCostoTraficoMesProv", mapping: "RemanenteProvCostoTraficoMesProv" },
                { name: "DevengoDeTrafico", mapping: "DevengoDeTrafico" },
                { name: "CostosRecurrentes", mapping: "CostosRecurrentes" },
                { name: "AjusteProv", mapping: "AjusteProv" },
                { name: "AjustesTraficoDevengadoVsReal", mapping: "AjustesTraficoDevengadoVsReal" },
                { name: "DevengoMesProv", mapping: "DevengoMesProv" },
                { name: "ProvTotalMesProv", mapping: "ProvTotalMesProv" }

            ],
            gridColumns: [
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "EsCostoRecurrente", dataIndex: "EsCostoRecurrente", text: "EsCostoRecurrente", width: "8%" },
                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
                { id: "RemanenteProvCostoTraficoMesAnterior", dataIndex: "RemanenteProvCostoTraficoMesAnterior", text: "RemanenteProvCostoTraficoMesAnterior", width: "8%" },
                { id: "TotalAceptaciones", dataIndex: "TotalAceptaciones", text: "TotalAceptaciones", width: "8%" },
                { id: "CancelacionProv", dataIndex: "CancelacionProv", text: "CancelacionProv", width: "8%" },
                { id: "RemanenteProvCostoTraficoMesProv", dataIndex: "RemanenteProvCostoTraficoMesProv", text: "RemanenteProvCostoTraficoMesProv", width: "8%" },
                { id: "DevengoDeTrafico", dataIndex: "DevengoDeTrafico", text: "DevengoDeTrafico", width: "8%" },
                { id: "CostosRecurrentes", dataIndex: "CostosRecurrentes", text: "CostosRecurrentes", width: "8%" },
                { id: "AjusteProv", dataIndex: "AjusteProv", text: "AjusteProv", width: "8%" },
                { id: "AjustesTraficoDevengadoVsReal", dataIndex: "AjustesTraficoDevengadoVsReal", text: "AjustesTraficoDevengadoVsReal", width: "8%" },
                { id: "DevengoMesProv", dataIndex: "DevengoMesProv", text: "DevengoMesProv", width: "8%" },
                { id: "ProvTotalMesProv", dataIndex: "ProvTotalMesProv", text: "ProvTotalMesProv", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Base de datos', config: Utils.defineModelStore({
            name: 'CosRomCieBaseDatos',
            paginadorText: "Base de Datos",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
               // { name: "OperadorId", mapping: "OperadorId" },
                //{ name: "AcreedorId", mapping: "AcreedorId" },
                //{ name: "ProvTarId", mapping: "ProvTarId" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "NoAcreedorSap", mapping: "NoAcreedorSap" },
                { name: "AcreedorRegistro", mapping: "AcreedorRegistro" },
                { name: "Periodo", mapping: "Periodo" },
                { name: "TipoRegistro", mapping: "TipoRegistro" },
                { name: "Operacion", mapping: "Operacion" },
                { name: "Moneda", mapping: "Moneda" },
                { name: "ImporteMd", mapping: "ImporteMd" },
                { name: "ImporteMxn", mapping: "ImporteMxn" },
                { name: "SociedadGl", mapping: "SociedadGl" },
                { name: "RealConfirmado", mapping: "RealConfirmado" },
                { name: "Cancelacion", mapping: "Cancelacion" },
                { name: "RemanenteMd", mapping: "RemanenteMd" },
                { name: "RemanenteMxn", mapping: "RemanenteMxn" },
                { name: "RemanenteUsd", mapping: "RemanenteUsd" },
               // { name: "CostosBaseDatosId", mapping: "CostosBaseDatosId" }
            ],
            gridColumns: [
               // { id: "OperadorId", dataIndex: "OperadorId", text: "OperadorId", width: "8%" },
               // { id: "AcreedorId", dataIndex: "AcreedorId", text: "AcreedorId", width: "8%" },
               // { id: "ProvTarId", dataIndex: "ProvTarId", text: "ProvTarId", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "NoAcreedorSap", dataIndex: "NoAcreedorSap", text: "NoAcreedorSap", width: "8%" },
                { id: "AcreedorRegistro", dataIndex: "AcreedorRegistro", text: "AcreedorRegistro", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%", xtype: "datecolumn" },
                { id: "TipoRegistro", dataIndex: "TipoRegistro", text: "TipoRegistro", width: "8%" },
                { id: "Operacion", dataIndex: "Operacion", text: "Operacion", width: "8%" },
                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
                { id: "ImporteMd", dataIndex: "ImporteMd", text: "ImporteMd", width: "8%" },
                { id: "ImporteMxn", dataIndex: "ImporteMxn", text: "ImporteMxn", width: "8%" },
                { id: "SociedadGl", dataIndex: "SociedadGl", text: "SociedadGl", width: "8%" },
                { id: "RealConfirmado", dataIndex: "RealConfirmado", text: "RealConfirmado", width: "8%" },
                { id: "Cancelacion", dataIndex: "Cancelacion", text: "Cancelacion", width: "8%" },
                { id: "RemanenteMd", dataIndex: "RemanenteMd", text: "RemanenteMd", width: "8%" },
                { id: "RemanenteMxn", dataIndex: "RemanenteMxn", text: "RemanenteMxn", width: "8%" },
                { id: "RemanenteUsd", dataIndex: "RemanenteUsd", text: "RemanenteUsd", width: "8%" },
               // { id: "CostosBaseDatosId", dataIndex: "CostosBaseDatosId", text: "CostosBaseDatosId", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Prov Tar Acum Meses Ante', config: Utils.defineModelStore({
            name: 'CosRomCieProvTarAcumMesesAnte',
            paginadorText: "Prov Tar Acum Meses Ante",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieProvTarAcumMesesAnteId", mapping: "CosRomCieProvTarAcumMesesAnteId" },
                { name: "Periodo", mapping: "Periodo" },
                { name: "ProvNcTarifaUsd", mapping: "ProvNcTarifaUsd" },
                { name: "ProvCostoTarifaUsd", mapping: "ProvCostoTarifaUsd" },
                { name: "ProvTarifaTotalUsd", mapping: "ProvTarifaTotalUsd" },
                { name: "CancelacionProvisionNcTarifa", mapping: "CancelacionProvisionNcTarifa" },
                { name: "CancelacionProvisionCostoTarifa", mapping: "CancelacionProvisionCostoTarifa" },
                { name: "TotalNcAcumuladaPeriodosAnteriores", mapping: "TotalNcAcumuladaPeriodosAnteriores" },
                { name: "TotalProvCostoAcumuladaPeriodosAnteriores", mapping: "TotalProvCostoAcumuladaPeriodosAnteriores" },
                { name: "TC", mapping: "TC" },
                { name: "ProvNcTarifaMxn", mapping: "ProvNcTarifaMxn" },
                { name: "ProvCostoTarifaMxn", mapping: "ProvCostoTarifaMxn" }
            ],
            gridColumns: [
                //{ id: "CosRomCieProvTarAcumMesesAnteId", dataIndex: "CosRomCieProvTarAcumMesesAnteId", text: "CosRomCieProvTarAcumMesesAnteId", width: "8%" },
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "ProvNcTarifaUsd", dataIndex: "ProvNcTarifaUsd", text: "ProvNcTarifaUsd", width: "8%" },
                { id: "ProvCostoTarifaUsd", dataIndex: "ProvCostoTarifaUsd", text: "ProvCostoTarifaUsd", width: "8%" },
                { id: "ProvTarifaTotalUsd", dataIndex: "ProvTarifaTotalUsd", text: "ProvTarifaTotalUsd", width: "8%" },
                { id: "CancelacionProvisionNcTarifa", dataIndex: "CancelacionProvisionNcTarifa", text: "CancelacionProvisionNcTarifa", width: "8%" },
                { id: "CancelacionProvisionCostoTarifa", dataIndex: "CancelacionProvisionCostoTarifa", text: "CancelacionProvisionCostoTarifa", width: "8%" },
                { id: "TotalNcAcumuladaPeriodosAnteriores", dataIndex: "TotalNcAcumuladaPeriodosAnteriores", text: "TotalNcAcumuladaPeriodosAnteriores", width: "8%" },
                { id: "TotalProvCostoAcumuladaPeriodosAnteriores", dataIndex: "TotalProvCostoAcumuladaPeriodosAnteriores", text: "TotalProvCostoAcumuladaPeriodosAnteriores", width: "8%" },
                { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
                { id: "ProvNcTarifaMxn", dataIndex: "ProvNcTarifaMxn", text: "ProvNcTarifaMxn", width: "8%" },
                { id: "ProvCostoTarifaMxn", dataIndex: "ProvCostoTarifaMxn", text: "ProvCostoTarifaMxn", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Facturacion Trafico', config: Utils.defineModelStore({
            name: 'CosRomCieFacturacionTrafico',
            paginadorText: "Facturacion Trafico",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieFacturacionTraficoId", mapping: "CosRomCieFacturacionTraficoId" },
                { name: "FechaTrafico", mapping: "FechaTrafico" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "NoConfirmacionSap", mapping: "NoConfirmacionSap" },
                { name: "FacturadoUsd", mapping: "FacturadoUsd" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" }],
            gridColumns: [
               // { id: "CosRomCieFacturacionTraficoId", dataIndex: "CosRomCieFacturacionTraficoId", text: "CosRomCieFacturacionTraficoId", width: "8%" },
                { id: "FechaTrafico", dataIndex: "FechaTrafico", text: "FechaTrafico", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "NoConfirmacionSap", dataIndex: "NoConfirmacionSap", text: "NoConfirmacionSap", width: "8%" },
                { id: "FacturadoUsd", dataIndex: "FacturadoUsd", text: "FacturadoUsd", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'NC Tarifa', config: Utils.defineModelStore({
            name: 'CosRomCieNCTarifa',
            paginadorText: "NC Tarifa",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
            //{ name: "CosRomCieNCTarifaId", mapping: "CosRomCieNCTarifaId" },
            { name: "FechaInicio", mapping: "FechaInicio" },
            { name: "FechaFin", mapping: "FechaFin" },
            { name: "Plmn", mapping: "Plmn" },
            { name: "Acreedor", mapping: "Acreedor" },
            { name: "Operador", mapping: "Operador" },
            { name: "NoConfirmacionSap", mapping: "NoConfirmacionSap" },
            { name: "Facturado", mapping: "Facturado" },
            { name: "Grupo", mapping: "Grupo" },
            { name: "Tc", mapping: "Tc" },
            { name: "Mxn", mapping: "Mxn" },
            { name: "ClaseDocumentoSap", mapping: "ClaseDocumentoSap" },
            { name: "Tipo", mapping: "Tipo" }
            ],
            gridColumns: [
                //{ id: "CosRomCieNCTarifaId", dataIndex: "CosRomCieNCTarifaId", text: "CosRomCieNCTarifaId", width: "8%" },
                { id: "FechaInicio", dataIndex: "FechaInicio", text: "FechaInicio", width: "8%" },
                { id: "FechaFin", dataIndex: "FechaFin", text: "FechaFin", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "NoConfirmacionSap", dataIndex: "NoConfirmacionSap", text: "NoConfirmacionSap", width: "8%" },
                { id: "Facturado", dataIndex: "Facturado", text: "Facturado", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" },
                { id: "ClaseDocumentoSap", dataIndex: "ClaseDocumentoSap", text: "ClaseDocumentoSap", width: "8%" },
                { id: "Tipo", dataIndex: "Tipo", text: "Tipo", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Facturacion Costos Recurrentes', config: Utils.defineModelStore({
            name: 'CosRomCieFacturacionCostosRecurrentes',
            paginadorText: "Facturacion Costos Recurrentes",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieFacturacionCostosRecurrentesId", mapping: "CosRomCieFacturacionCostosRecurrentesId" },
                { name: "FechaConsumo", mapping: "FechaConsumo" },
                { name: "Concepto", mapping: "Concepto" },
                { name: "Operador", mapping: "Operador" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "NoConfirmacionSap", mapping: "NoConfirmacionSap" },
                { name: "Moneda", mapping: "Moneda" },
                { name: "Facturado", mapping: "Facturado" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" },
                { name: "Tipo", mapping: "Tipo" }
            ],
            gridColumns: [
               // { id: "CosRomCieFacturacionCostosRecurrentesId", dataIndex: "CosRomCieFacturacionCostosRecurrentesId", text: "CosRomCieFacturacionCostosRecurrentesId", width: "8%" },
                { id: "FechaConsumo", dataIndex: "FechaConsumo", text: "FechaConsumo", width: "8%" },
                { id: "Concepto", dataIndex: "Concepto", text: "Concepto", width: "8%" },
                { id: "Operador", dataIndex: "Operador", text: "Operador", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "NoConfirmacionSap", dataIndex: "NoConfirmacionSap", text: "NoConfirmacionSap", width: "8%" },
                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
                { id: "Facturado", dataIndex: "Facturado", text: "Facturado", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" },
                { id: "Tipo", dataIndex: "Tipo", text: "Tipo", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Factura Tarifa', config: Utils.defineModelStore({
            name: 'CosRomCieFacturaTarifa',
            paginadorText: "Factura Tarifa",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieFacturaTarifaId", mapping: "CosRomCieFacturaTarifaId" },
                { name: "FechaInicio", mapping: "FechaInicio" },
                { name: "FechaFin", mapping: "FechaFin" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "Nombre", mapping: "Nombre" },
                { name: "NoConfirmacionSap", mapping: "NoConfirmacionSap" },
                { name: "FacturadoUsd", mapping: "FacturadoUsd" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" },
                { name: "ClaseDocumentoSap", mapping: "ClaseDocumentoSap" },
                { name: "Tipo", mapping: "Tipo" }
            ],
            gridColumns: [
                //{ id: "CosRomCieFacturaTarifaId", dataIndex: "CosRomCieFacturaTarifaId", text: "CosRomCieFacturaTarifaId", width: "8%" },
                { id: "FechaInicio", dataIndex: "FechaInicio", text: "FechaInicio", width: "8%" },
                { id: "FechaFin", dataIndex: "FechaFin", text: "FechaFin", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "Nombre", dataIndex: "Nombre", text: "Nombre", width: "8%" },
                { id: "NoConfirmacionSap", dataIndex: "NoConfirmacionSap", text: "NoConfirmacionSap", width: "8%" },
                { id: "FacturadoUsd", dataIndex: "FacturadoUsd", text: "FacturadoUsd", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" },
                { id: "ClaseDocumentoSap", dataIndex: "ClaseDocumentoSap", text: "ClaseDocumentoSap", width: "8%" },
                { id: "Tipo", dataIndex: "Tipo", text: "Tipo", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'NC Trafico', config: Utils.defineModelStore({
            name: 'CosRomCieNCTrafico',
            paginadorText: "NC Trafico",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                //{ name: "CosRomCieNCTraficoId", mapping: "CosRomCieNCTraficoId" },
                { name: "FechaTrafico", mapping: "FechaTrafico" },
                { name: "Plmn", mapping: "Plmn" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "NoConfirmacionSap", mapping: "NoConfirmacionSap" },
                { name: "FacturadoUsd", mapping: "FacturadoUsd" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Tc", mapping: "Tc" },
                { name: "Mxn", mapping: "Mxn" },
                { name: "ClaseDocumentoSap", mapping: "ClaseDocumentoSap" },
                { name: "Tipo", mapping: "Tipo" }],
            gridColumns: [
                //{ id: "CosRomCieNCTraficoId", dataIndex: "CosRomCieNCTraficoId", text: "CosRomCieNCTraficoId", width: "8%" },
                { id: "FechaTrafico", dataIndex: "FechaTrafico", text: "FechaTrafico", width: "8%" },
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "NoConfirmacionSap", dataIndex: "NoConfirmacionSap", text: "NoConfirmacionSap", width: "8%" },
                { id: "FacturadoUsd", dataIndex: "FacturadoUsd", text: "FacturadoUsd", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" },
                { id: "Mxn", dataIndex: "Mxn", text: "Mxn", width: "8%" },
                { id: "ClaseDocumentoSap", dataIndex: "ClaseDocumentoSap", text: "ClaseDocumentoSap", width: "8%" },
                { id: "Tipo", dataIndex: "Tipo", text: "Tipo", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'TC', config: Utils.defineModelStore({
            name: 'CosRomCieTC',
            paginadorText: "TC",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [
                { name: "Periodo", mapping: "Periodo" },
                { name: "Moneda", mapping: "Moneda" },
                { name: "Concepto", mapping: "Concepto" },
                { name: "Tipo", mapping: "Tipo" },
                { name: "Tc", mapping: "Tc" }
            ],
            gridColumns: [
                { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
                { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
                { id: "Concepto", dataIndex: "Concepto", text: "Concepto", width: "8%" },
                { id: "Tipo", dataIndex: "Tipo", text: "Tipo", width: "8%" },
                { id: "Tc", dataIndex: "Tc", text: "Tc", width: "8%" }
            ]
        })
    });

    tabsConfig.push({
        title: 'Sabana', config: Utils.defineModelStore({
            name: 'CosRomCieSabana',
            paginadorText: "Sabana",
            urlStore: '..' + VIRTUAL_DIRECTORY + 'CierreCostosROM/ConsultaGeneralXFiltro',
            modelFields: [{ name: "Plmn", mapping: "Plmn" },
                { name: "Grupo", mapping: "Grupo" },
                { name: "Nombre", mapping: "Nombre" },
                { name: "Acreedor", mapping: "Acreedor" },
                { name: "SociedadGl", mapping: "SociedadGl" },
               // { name: "ProvTarMesAnteAcum", mapping: "ProvTarMesAnteAcum" },
                { name: "ProvTarifa", mapping: "ProvTarifa" },
                { name: "TotalProvTarifa", mapping: "TotalProvTarifa" },
                { name: "ProvRealReg", mapping: "ProvRealReg" },
                { name: "NuevaProvAcum", mapping: "NuevaProvAcum" },
                { name: "TotalNuevaProvTarifa", mapping: "TotalNuevaProvTarifa" }
            ],
            gridColumns: [
                { id: "Plmn", dataIndex: "Plmn", text: "Plmn", width: "8%" },
                { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
                { id: "Nombre", dataIndex: "Nombre", text: "Nombre", width: "8%" },
                { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
                { id: "SociedadGl", dataIndex: "SociedadGl", text: "SociedadGL", width: "8%" },
                //{ id: "ProvTarMesAnteAcum", dataIndex: "ProvTarMesAnteAcum", text: "ProvTarMesAnteAcum", width: "8%" },
                { id: "ProvTarifa", dataIndex: "ProvTarifa", text: "ProvTarifa", width: "8%" },
                { id: "TotalProvTarifa", dataIndex: "TotalProvTarifa", text: "TotalProvTarifa", width: "8%" },
                { id: "ProvRealReg", dataIndex: "ProvRealReg", text: "ProvRealReg", width: "8%" },
                { id: "NuevaProvAcum", dataIndex: "NuevaProvAcum", text: "NuevaProvAcum", width: "8%" },
                { id: "TotalNuevaProvTarifa", dataIndex: "TotalNuevaProvTarifa", text: "TotalNuevaProvTarifa", width: "8%" },

            ]
        })
    });

    return tabsConfig;
}

Ext.onReady(function () {
    Ext.QuickTips.init();

    var tabsConfig = getTabsConfig();

    var panelDef = Utils.panelPrincipal({
        title: 'Cierre de Costos ROAMING',
        controller: 'CierreCostosROM',
        conCalculo: true,
        tabsConfig: tabsConfig
    });

    var panel = Ext.create('Ext.form.Panel', panelDef);


    tabsConfig[0].config[0].store.source.load();

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

    var lectura = ["CosRomCieCosto", "CosRomCieProvTar", "CosRomCieAjNcMesAnterior", "CosRomCieTraficoPorMes", "CosRomCieCostosRecurrentes", "CosRomCieDevengoAcumulado", "CosRomCieBaseDatos", "CosRomCieProvTarAcumMesesAnte", "CosRomCieFacturacionTrafico", "CosRomCieNCTarifa", "CosRomCieFacturacionCostosRecurrentes", "CosRomCieFacturaTarifa", "CosRomCieNCTrafico", "CosRomCieTC", "CosRomCieSabana"];
    var nuevo = null;
    var editar = null;
    var eliminar = null;

    permisosVariosElementos('CierreCostosROM', lectura, nuevo, editar, eliminar, 'log');


}); //Termina funcion inicial