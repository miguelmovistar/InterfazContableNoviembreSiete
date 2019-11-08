using System;

namespace IC2.Models.ViewModel
{
    public class CosRomCieCostoRecurrenteView
    {
        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("D")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("H")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("F")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? RemanenteProvCostoRecurrente { get; set; }
        [ExcelColumnDesc("H")]
        public decimal? RemanenteTotalProvCostoRecurrente { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? RealConfirmadoProvCostoRecurrente { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? RealConfirmadoTotalProvCosto { get; set; }
        [ExcelColumnDesc("K")]
        public decimal? CancelacionProvCostoRecurrente { get; set; }
        [ExcelColumnDesc("L")]
        public decimal? CancelacionTotalProvCostoRecurrente { get; set; }
        [ExcelColumnDesc("M")]
        public decimal? RemantenteActualCostoRecurrente { get; set; }
        [ExcelColumnDesc("N")]
        public decimal? CostoRecurrenteActual { get; set; }
        [ExcelColumnDesc("O")]
        public decimal? TotalCostoRecurrente { get; set; }
    }
}