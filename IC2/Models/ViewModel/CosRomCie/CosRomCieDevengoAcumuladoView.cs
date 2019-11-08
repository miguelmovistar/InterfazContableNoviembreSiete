using System;

namespace IC2.Models.ViewModel
{
    public class CosRomCieDevengoAcumuladoView
    {

        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("A")]
        public string Plmn { get; set; }
        public bool? EsCostoRecurrente { get; set; }
        public string Moneda { get; set; }
        [ExcelColumnDesc("B")]
        public decimal? RemanenteProvCostoTraficoMesAnterior { get; set; }
        [ExcelColumnDesc("C")]
        public decimal? TotalAceptaciones { get; set; }
        [ExcelColumnDesc("D")]
        public decimal? CancelacionProv { get; set; }
        [ExcelColumnDesc("E")]
        public decimal? RemanenteProvCostoTraficoMesProv { get; set; }
        [ExcelColumnDesc("F")]
        public decimal? DevengoDeTrafico { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? CostosRecurrentes { get; set; }
        [ExcelColumnDesc("H")]
        public decimal? AjusteProv { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? AjustesTraficoDevengadoVsReal { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? DevengoMesProv { get; set; }
        [ExcelColumnDesc("K")]
        public decimal? ProvTotalMesProv { get; set; }
    }
}