using IC2.Comun;
using IC2.Models.ViewModel.IngRomCie;
using System.Collections.Generic;
using System.Data;

namespace IC2.Models.ViewModel
{
    internal static class DTOMetadata
    {
        public static IReadOnlyDictionary<string, Metadata> RoamingCierreCostosMetadata => new Dictionary<string, Metadata> {
            { typeof(CosRomCieProvTar).Name, new Metadata{ EntityType= typeof(CosRomCieProvTarView), InsertSentence= "psCosRomCieProvTarXPeriodoInsert", SelectSentence="spCosRomCieProvTarSelect", DbType="dbo.CosRomCieProvTarType", ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieAjNcMesAnterior).Name, new Metadata{ EntityType= typeof(CosRomCieAjNcMesAnteriorView), InsertSentence= "spCosRomCieAjNcMesAnteriorPeriodoInsert", SelectSentence="spCosRomCieAjNcMesAnteriorPeriodoSelect", DbType="dbo.CosRomCieAjNcMesAnteriorType", ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieBaseDatos).Name, new Metadata{ EntityType= typeof(CosRomCieBaseDatosView), InsertSentence= "spCosRomCieBaseDatosInsert", SelectSentence="spCosRomCieBaseDatosSelect", DbType = "CosRomCieBaseDatosType", ExtraParamType = typeof(CosRomCieCRExtraParams)} },
            { typeof(CosRomCieProvTarAcumMesesAnte).Name, new Metadata{ EntityType= typeof(CosRomCieProvTarAcumMesesAnteView), InsertSentence= "spCosRomCieProvTarAcumMesesAnteInsert", SelectSentence="spCosRomCieProvTarAcumMesesAnteSelect", DbType= "CosRomCieProvTarAcumMesesAnteType", ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieTraficoPorMes).Name, new Metadata{ EntityType= typeof(CosRomCieTraficoPorMesView), InsertSentence= "spCosRomCieTraficoPorMesInsert", SelectSentence="spCosRomCieTraficoPorMesSelect", DbType="CosRomCieTraficoPorMesType", ExtraParamType = typeof(CosRomCieCRExtraParams)} },
            { typeof(CosRomCieFacturacionTrafico).Name, new Metadata{ EntityType= typeof(CosRomCieFacturacionTraficoView), InsertSentence= "spCosRomCieFacturacionTraficoInsert", SelectSentence="spCosRomCieFacturaTraficoNCSelect", DbType="CosRomCieFacturaTraficoNCSelectType", TableCustom=GenerarCustomTable(), ExtraParamType = typeof(CosRomCieCRExtraParams)} },
            { typeof(CosRomCieFacturacionCostosRecurrentes).Name, new Metadata{ EntityType= typeof(CosRomCieFacturacionCostosRecurrentesView), InsertSentence= "spCosRomCieFacturacionCostosRecurrentesInsert", SelectSentence="spCosRomCieFacturaTraficoNCSelect", DbType="CosRomCieFacturaTraficoNCSelectType", TableCustom=GenerarCustomTable(), ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieFacturaTarifa).Name, new Metadata{ EntityType= typeof(CosRomCieFacturaTarifaView), InsertSentence= "spCosRomCieFacturaTarifaInsert", SelectSentence="spCosRomCieFacturaTraficoNCSelect", DbType="CosRomCieFacturaTraficoNCSelectType", TableCustom=GenerarCustomTable(), ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieNCTrafico).Name, new Metadata{ EntityType= typeof(CosRomCieNCTraficoView), InsertSentence= "spCosRomCieNCTraficoInsert", SelectSentence="spCosRomCieFacturaTraficoNCSelect", DbType="CosRomCieFacturaTraficoNCSelectType", TableCustom=GenerarCustomTable(), ExtraParamType = typeof(CosRomCieCRExtraParams)  } },
            { typeof(CosRomCieNCTarifa).Name, new Metadata{ EntityType= typeof(CosRomCieNCTarifaView), InsertSentence= "spCosRomCieNCTarifaInsert", SelectSentence="spCosRomCieFacturaTraficoNCSelect", DbType="CosRomCieFacturaTraficoNCSelectType", TableCustom=GenerarCustomTable(), ExtraParamType = typeof(CosRomCieCRExtraParams)  } },
            { typeof(CosRomCieCosto).Name, new Metadata{ EntityType= typeof(CosRomCieCostoView), InsertSentence= "spCosRomCieCostoInsert", SelectSentence="spCosRomCieCostoSelect", DbType="CosRomCieCostoType", ExtraParamType = typeof(CosRomCieCRExtraParams) }},
  //           { "CosRomCieCostoCR", new Metadata{ EntityType= typeof(CosRomCieCostoView), InsertSentence= "", SelectSentence="spCosRomCieCostoCRSelect", DbType="CosRomCieCostoType", ExtraParamType = typeof(CosRomCieCRExtraParams) }},
            { typeof(CosRomCieCostosRecurrentes).Name, new Metadata{ EntityType= typeof(CosRomCieCostoRecurrenteView), InsertSentence= "spCosRomCieCostosRecurrentesInsert", SelectSentence="spCosRomCieCostosRecurrentesSelect", DbType="CosRomCieCostosRecurrentesType", ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieDevengoAcumulado).Name, new Metadata{ EntityType= typeof(CosRomCieDevengoAcumuladoView), InsertSentence= "spCosRomCieDevengoAcumuladoInsert", SelectSentence="spCosRomCieDevengoAcumuladoSelect", DbType="CosRomCieDevengoAcumuladoType", ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieTC).Name, new Metadata{ EntityType= typeof(CosRomCieTCView), InsertSentence= "spCosRomCieTCInsert", SelectSentence="spCosRomCieTCSelect", DbType="CosRomCieTCType", ExtraParamType = typeof(CosRomCieCRExtraParams) } },
            { typeof(CosRomCieSabana).Name, new Metadata{ EntityType= typeof(CosRomCieSabana), InsertSentence= "spCosRomCieSabanaInsert", SelectSentence="spCosRomCieSabanaSelect", DbType="CosRomCieSabanaType", ExtraParamType = typeof(CosRomCieCRExtraParams) } }
        };

        public static IReadOnlyDictionary<string, Metadata> RoamingCierreIngresoMetadata => new Dictionary<string, Metadata> {
            { typeof(IngRomCieBaseDatos).Name, new Metadata{ EntityType= typeof(IngRomCieBaseDatosView), InsertSentence= "spIngRomCieBaseDatosInsert", SelectSentence="spIngRomCieBaseDatosSelect", DbType="dbo.IngRomCieBaseDatosType", ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieDevengoAcumuladoTrafico).Name, new Metadata{ EntityType= typeof(IngRomCieDevengoAcumuladoTraficoView), InsertSentence= "spIngRomCieDevengoAcumuladoTraficoInsert", SelectSentence="spIngRomCieDevengoAcumuladoTraficoSelect", DbType="dbo.IngRomCieDevengoAcumuladoTraficoType" , ExtraParamType = typeof(IngRomCieCRExtraParams)} },
            { typeof(IngRomCieProvTarifa).Name, new Metadata{ EntityType= typeof(IngRomCieProvTarifaView), InsertSentence= "spIngRomCieProvTarInsert", SelectSentence="spIngRomCieProvTarSelect", DbType="dbo.IngRomCieProvTarType", ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieAjusNcRealVsDev).Name, new Metadata{ EntityType= typeof(IngRomCieAjusNcRealVsDevView), InsertSentence= "spIngRomCieAjusNcRealVsDevInsert", SelectSentence="spIngRomCieAjusNcRealVsDevSelect", DbType="dbo.IngRomCieAjusNcRealVsDevType", ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieProvTarifaAcumMesAnte).Name, new Metadata{ EntityType= typeof(IngRomCieProvTarifaAcumMesAnteView), InsertSentence= "spIngRomCieProvTarifaAcumMesAnteInsert", SelectSentence="spIngRomCieProvTarAcumMesesAnteSelect", DbType="dbo.IngRomCieProvTarifaAcumMesAnteType", ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieFacturacionTrafico).Name, new Metadata{ EntityType= typeof(IngRomCieFacturaTraficoNCSelectView), InsertSentence= "spIngRomCieFacturacionTraficoInsert", SelectSentence="spIngRomCieFacturaTraficoNCSelect", DbType="dbo.IngRomCieFacturaTraficoNCSelectType", TableCustom = GenerarCustomIngTable(), ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieFacturaTarifa).Name, new Metadata{ EntityType= typeof(IngRomCieFacturaTraficoNCSelectView), InsertSentence= "spIngRomCieFacturaTarifaInsert", SelectSentence="spIngRomCieFacturaTraficoNCSelect", DbType="dbo.IngRomCieFacturaTraficoNCSelectType", TableCustom = GenerarCustomIngTable(), ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieNcTarifa).Name, new Metadata{ EntityType= typeof(IngRomCieFacturaTraficoNCSelectView), InsertSentence= "spIngRomCieNCTarifaInsert", SelectSentence="spIngRomCieFacturaTraficoNCSelect", DbType="dbo.IngRomCieFacturaTraficoNCSelectType", TableCustom = GenerarCustomIngTable(), ExtraParamType = typeof(IngRomCieCRExtraParams)} },
            { typeof(IngRomCieNcTrafico).Name, new Metadata{ EntityType= typeof(IngRomCieFacturaTraficoNCSelectView), InsertSentence= "spIngRomCieNCTraficoInsert", SelectSentence="spIngRomCieFacturaTraficoNCSelect", DbType="dbo.IngRomCieFacturaTraficoNCSelectType", TableCustom = GenerarCustomIngTable(), ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieTC).Name, new Metadata{ EntityType= typeof(IngCieRomTCView), InsertSentence= "spIngRomCieTCInsert", SelectSentence="spIngRomCieTCSelect", DbType="dbo.IngRomCieTCType", ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieIngreso).Name, new Metadata{ EntityType= typeof(IngRomCieIngresoView), InsertSentence= "spIngRomCieIngresoInsert", SelectSentence="spIngRomCieIngresoSelect", DbType="dbo.IngRomCieIngresoType", ExtraParamType = typeof(IngRomCieCRExtraParams) } },
            { typeof(IngRomCieSabana).Name, new Metadata{ EntityType= typeof(IngRomCieSabanaView), InsertSentence= "spIngRomCieSabanaInsert", SelectSentence="spIngRomCieSabanaSelect", DbType="dbo.IngRomCieSabanaType", ExtraParamType = typeof(IngRomCieCRExtraParams) } }
        };

        public static IReadOnlyDictionary<string, Metadata> RoamingCancelacionCostoMetadata => new Dictionary<string, Metadata> {
            { typeof(RoamingCancelacionCosto).Name, new Metadata{ EntityType= typeof(RoamingCancelacionCostoView), InsertSentence = null, SelectSentence = null, DbType = null } }
        };

        public static IReadOnlyDictionary<string, Metadata> PxQIngresosRomRecalculoMetadato => new Dictionary<string, Metadata> {
            { "Ajustes", new Metadata{ EntityType= typeof(AjustesView), SelectSentence = "spAjustesSelect", ExtraParamType =  typeof(RecalculoParm)} }
        };

        static DataTable GenerarCustomTable() {
            var dt =  new DataTable();
            dt.Columns.Add("FechaContable");
            dt.Columns.Add("FechaFactura");
            dt.Columns.Add("FechaTrafico");
            dt.Columns.Add("FechaInicio");
            dt.Columns.Add("FechaFin");
            dt.Columns.Add("FechaConsumo");
            dt.Columns.Add("Plmn");
            dt.Columns.Add("Operador");
            dt.Columns.Add("Acreedor");
            dt.Columns.Add("Grupo");
            dt.Columns.Add("ClaseDocumentoSap");
            dt.Columns.Add("NoConfirmacionSap");
            dt.Columns.Add("Concepto");
            dt.Columns.Add("Tipo");
            dt.Columns.Add("Moneda");
            dt.Columns.Add("FacturadoUsd");
            dt.Columns.Add("Tc");
            dt.Columns.Add("Mxn");
            dt.Columns.Add("Facturado");
            dt.Columns.Add("MontoFacturado");
            return dt;
        }

        static DataTable GenerarCustomIngTable()
        {
            var dt = new DataTable();
            dt.Columns.Add("FechaFactura");
            dt.Columns.Add("FechaTrafico");
            dt.Columns.Add("FechaInicio");
            dt.Columns.Add("FechaFin");
            dt.Columns.Add("FechaConsumo");
            dt.Columns.Add("Plmn");
            dt.Columns.Add("Operador");
            dt.Columns.Add("Deudor");
            dt.Columns.Add("Grupo");
            dt.Columns.Add("Concepto");
            dt.Columns.Add("Tipo");
            dt.Columns.Add("Moneda");
            dt.Columns.Add("FolioFacturaSap");
            dt.Columns.Add("FolioSap");
            dt.Columns.Add("FacturadoSinImpuestos");
            dt.Columns.Add("Tc");
            dt.Columns.Add("Mxn");
            dt.Columns.Add("ReporteARMonthlyInvoice");
            dt.Columns.Add("PorEmitir");
            return dt;
        }
    }
}