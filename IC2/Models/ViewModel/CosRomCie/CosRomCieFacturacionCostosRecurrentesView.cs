using System;

namespace IC2.Models
{
    public partial class CosRomCieFacturacionCostosRecurrentesView
    {
        public int CosRomCieFacturacionCostosRecurrentesId { get; set; }
        public DateTime FechaContable { get; set; }
        public DateTime FechaFactura { get; set; }
        [ExcelColumnDesc("A")]
        public DateTime FechaConsumo { get; set; }
        [ExcelColumnDesc("B")]
        public string Concepto { get; set; }
        [ExcelColumnDesc("D")]
        public string Operador { get; set; }
        [ExcelColumnDesc("C")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("E")]
        public string NoConfirmacionSap { get; set; }
        [ExcelColumnDesc("F")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? Facturado { get; set; }
        [ExcelColumnDesc("H")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? Tc { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? Mxn { get; set; }
        [ExcelColumnDesc("K")]
        public string Tipo { get; set; }
    }
}