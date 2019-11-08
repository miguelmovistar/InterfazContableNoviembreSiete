using System;

namespace IC2.Models
{

    internal class CosRomCieAjNcMesAnteriorView
    {
        public int? CosRomCieAjNcMesAnteriorId { get; set; }
        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("A")]
        public string PlmnV { get; set; }
        [ExcelColumnDesc("B")]
        public string Operador { get; set; }
        [ExcelColumnDesc("C")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("D")]
        public decimal? ProvisionTarifaMesAnterior { get; set; }
        [ExcelColumnDesc("E")]
        public decimal? ProvisionRealTarifaDeMesAnterior { get; set; }
        [ExcelColumnDesc("F")]
        public decimal? AjustesTarifaReal { get; set; }
    }
}