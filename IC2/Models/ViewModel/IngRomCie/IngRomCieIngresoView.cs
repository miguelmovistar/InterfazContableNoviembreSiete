using IC2.Comun.Entities;
using System;

namespace IC2.Models.ViewModel
{
    public class IngRomCieIngresoView
    {
        [ExcelColumnDesc("A")]
        [Fecha]
        public string Periodo { get; set; }
        [ExcelColumnDesc("B")]
        public string CuentaDeResultados { get; set; }
        [ExcelColumnDesc("C")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("D")]
        public string Operador { get; set; }
        [ExcelColumnDesc("R")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("E")]
        public string SoGL { get; set; }
        [ExcelColumnDesc("F")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("R", TypeDataExcel.Decimal)]
        public decimal? CancelacionDevengoTrafico { get; set; }
        [ExcelColumnDesc("G", TypeDataExcel.Decimal)]
        public decimal? CancelacionProvNcTarifaMesAnterior { get; set; }
        [ExcelColumnDesc("H", TypeDataExcel.Decimal)]
        public decimal? CancelacionProvCostoTarifaMesAnterior { get; set; }
        [ExcelColumnDesc("I", TypeDataExcel.Decimal)]
        public decimal? CancelacionDevengoTotalMesAnterior { get; set; }
        [ExcelColumnDesc("J", TypeDataExcel.Decimal)]
        public decimal? FacturacionTrafico { get; set; }
        [ExcelColumnDesc("K", TypeDataExcel.Decimal)]
        public decimal? FacturacionTarifa { get; set; }
        [ExcelColumnDesc("L", TypeDataExcel.Decimal)]
        public decimal? NcrTrafico { get; set; }
        [ExcelColumnDesc("M", TypeDataExcel.Decimal)]
        public decimal? NcrTarifa { get; set; }
        [ExcelColumnDesc("N", TypeDataExcel.Decimal)]
        public decimal? DevengoCostoTrafico { get; set; }
        [ExcelColumnDesc("O", TypeDataExcel.Decimal)]
        public decimal? ProvCostoDifTarifa { get; set; }
        [ExcelColumnDesc("P", TypeDataExcel.Decimal)]
        public decimal? ProvNcDifTarifa { get; set; }
        [ExcelColumnDesc("Q", TypeDataExcel.Decimal)]
        public decimal? ExcesoOInsufDevMesAnt { get; set; }
        [ExcelColumnDesc("R", TypeDataExcel.Decimal)]
        public decimal? OtrosAjustes { get; set; }
        [ExcelColumnDesc("S", TypeDataExcel.Decimal)]
        public decimal? FluctuacionAReclasificar { get; set; }
        [ExcelColumnDesc("T", TypeDataExcel.Decimal)]
        public decimal? TotalDevengo { get; set; }
        [ExcelColumnDesc("U")]
        public string Grupo { get; set; }

    }
}