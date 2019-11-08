using System;

namespace IC2.Models
{
    public partial class CosRomCieFacturacionTraficoView
    {
        public int CosRomCieFacturacionTraficoId { get; set; }
        public DateTime FechaContable { get; set; }
        public DateTime FechaFactura { get; set; }
        [ExcelColumnDesc("A")]
        public DateTime FechaTrafico { get; set; }
        [ExcelColumnDesc("B")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("C")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("E")]
        public string NoConfirmacionSap { get; set; }
        [ExcelColumnDesc("F")]
        public decimal? FacturadoUsd { get; set; }
        [ExcelColumnDesc("G")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("H")]
        public decimal? Tc { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? Mxn { get; set; }
    }
}