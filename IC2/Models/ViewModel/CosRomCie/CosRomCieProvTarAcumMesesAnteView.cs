using System;

namespace IC2.Models.ViewModel
{
    public class CosRomCieProvTarAcumMesesAnteView
    {
        [ExcelColumnDesc("A")]
        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("B")]
        public decimal? ProvNcTarifaUsd { get; set; }
        [ExcelColumnDesc("C")]
        public decimal? ProvCostoTarifaUsd { get; set; }
        [ExcelColumnDesc("D")]
        public decimal? ProvTarifaTotalUsd { get; set; }
        [ExcelColumnDesc("E")]
        public decimal? CancelacionProvisionNcTarifa { get; set; }
        [ExcelColumnDesc("F")]
        public decimal? CancelacionProvisionCostoTarifa { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? TotalNcAcumuladaPeriodosAnteriores { get; set; }

        [ExcelColumnDesc("H")]
        public decimal? TotalProvCostoAcumuladaPeriodosAnteriores { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? TC { get; set; }

        [ExcelColumnDesc("J")]
        public decimal? ProvNcTarifaMxn { get; set; }
        [ExcelColumnDesc("K")]
        public decimal? ProvCostoTarifaMxn { get; set; }
    }
}