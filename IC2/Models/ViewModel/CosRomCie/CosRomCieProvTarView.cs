using System;

namespace IC2.Models
{

    class CosRomCieProvTarView
    {
        public int? CosRomCieProvTarId { get; set; }
        [ExcelColumnDesc("A")]
        public string Plmn { get; set; }
        public DateTime Periodo { get; set; }
        public int? PXQCostosROMId { get; set; }
        public int? CostoMovimientoPeriodosAnterioresId { get; set; }
        [ExcelColumnDesc("B")]
        public string Operador { get; set; }
        [ExcelColumnDesc("D")]
        public string SoGl { get; set; }
        [ExcelColumnDesc("C")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("F")]
        public decimal? ProvTarifa { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? AjusteTarifaRealVsProvisionMesPasado { get; set; }
        [ExcelColumnDesc("H")]
        public decimal? ProvisionTarifaDevengada { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? ProvisionNcTarifaCancelada { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? ProvisionNcTarifa { get; set; }
        [ExcelColumnDesc("K")]
        public decimal? TotalProvisionNcTarifa { get; set; }
        [ExcelColumnDesc("L")]
        public decimal? ProvisionDeCostoCancelada { get; set; }
        [ExcelColumnDesc("M")]
        public decimal? ProvisionDeCostoTarifaCancelada { get; set; }
        [ExcelColumnDesc("N")]
        public decimal? TotalProvCostoTarifa { get; set; }
        [ExcelColumnDesc("O")]
        public decimal? ComplementoTarifaMesesAnteriores { get; set; }
        [ExcelColumnDesc("P")]
        public decimal? TotalProvTarifa { get; set; }
    }

}