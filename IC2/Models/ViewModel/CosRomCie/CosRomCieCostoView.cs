using System;

namespace IC2.Models.ViewModel
{
    public class CosRomCieCostoView
    {
        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("C")]
        public string CuentaDeResultados { get; set; }
        [ExcelColumnDesc("D")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("E")]
        public string Operador { get; set; }
        [ExcelColumnDesc("F")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("G", Header ="So. GL.")]
        public string SoGL { get; set; }
        [ExcelColumnDesc("H")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? CancelacionDevengoTrafico { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? CancelacionProvNcTarifaMesAnterior { get; set; }
        [ExcelColumnDesc("K")]
        public decimal? CancelacionProvCostoTarifaMesAnterior { get; set; }
        [ExcelColumnDesc("L")]
        public decimal? CancelacionDevengoTotalMesAnterior { get; set; }
        [ExcelColumnDesc("M")]
        public decimal? FacturacionTrafico { get; set; }
        [ExcelColumnDesc("N")]
        public decimal? FacturacionTarifa { get; set; }
        [ExcelColumnDesc("O")]
        public decimal? NcrTrafico { get; set; }
        [ExcelColumnDesc("P")]
        public decimal? NcrTarifa { get; set; }
        [ExcelColumnDesc("Q")]
        public decimal? DevengoCostoTrafico { get; set; }
        [ExcelColumnDesc("R")]
        public decimal? ProvCostoDifTarifa { get; set; }
        [ExcelColumnDesc("S")]
        public decimal? ProvNcDifTarifa { get; set; }
        [ExcelColumnDesc("T")]
        public decimal? ExcesoOInsufDevMesAnt { get; set; }
        [ExcelColumnDesc("U")]
        public decimal? OtrosAjustes { get; set; }
        [ExcelColumnDesc("V")]
        public decimal? FluctuacionAReclasificar { get; set; }
        [ExcelColumnDesc("W")]
        public decimal? TotalDevengo { get; set; }
        [ExcelColumnDesc("X")]
        public string Grupo { get; set; }
    }
}