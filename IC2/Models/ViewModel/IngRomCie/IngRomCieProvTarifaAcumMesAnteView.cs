using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieProvTarifaAcumMesAnteView
    {
        [ExcelColumnDesc("A")]
        public string Periodo { get; set; }
        [ExcelColumnDesc("B", TypeDataExcel.Decimal)]
        public decimal? ProvNcTarifaUsdMesAnte { get; set; }
        [ExcelColumnDesc("C", TypeDataExcel.Decimal)]
        public decimal? ProvIngresoTarifaUsdMesAnte { get; set; }
        [ExcelColumnDesc("D", TypeDataExcel.Decimal)]
        public decimal? ProvTarifaTotalUsd { get; set; }
        [ExcelColumnDesc("E", TypeDataExcel.Decimal)]
        public decimal? CancelacionProvisionNcTarifa { get; set; }
        [ExcelColumnDesc("F", TypeDataExcel.Decimal)]
        public decimal? CancelacionProvisionIngresoTarifa { get; set; }
        [ExcelColumnDesc("G", TypeDataExcel.Decimal)]
        public decimal? TotalNcAcumulada { get; set; }
        [ExcelColumnDesc("H", TypeDataExcel.Decimal)]
        public decimal? TotalProvIngresoAcumulada { get; set; }
        [ExcelColumnDesc("I", TypeDataExcel.Decimal)]
        public decimal? Tc { get; set; }
        [ExcelColumnDesc("J", TypeDataExcel.Decimal)]
        public decimal? ProvNcTarifaMxn { get; set; }
        [ExcelColumnDesc("K", TypeDataExcel.Decimal)]
        public decimal? ProvIngrsoMxn { get; set; }

    }
}