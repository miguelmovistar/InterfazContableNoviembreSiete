using System;

namespace IC2.Models.ViewModel
{
    public partial class CosRomCieTraficoPorMesView
    {
        public int? CosRomCieTraficoPorMesId { get; set; }

        [ExcelColumnDesc("A")]
        public string Plmn { get; set; }
        public DateTime Periodo { get; set; }

        [ExcelColumnDesc("B", Header ="Remantente Actual Prov Trafico")]
        public decimal?RemantentProvTrafico { get; set; }

        [ExcelColumnDesc("C")]
        public decimal?RemantentProvTotal { get; set; }

        [ExcelColumnDesc("D")]
        public decimal?RealConfirmadoProvTrafico { get; set; }

        [ExcelColumnDesc("E")]
        public decimal?TotalConfirmado { get; set; }

        [ExcelColumnDesc("F")]
        public decimal?CancelacionProvTrafico { get; set; }

        [ExcelColumnDesc("G")]
        public decimal?TotalProvCancelada { get; set; }

        [ExcelColumnDesc("H")]
        public decimal?RemantentActualProvTrafico { get; set; }

        [ExcelColumnDesc("I")]
        public decimal? RemantentActualProvTraficoTotal { get; set; }
    }
}