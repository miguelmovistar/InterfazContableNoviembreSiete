using System;

namespace IC2.Models
{
    public class CosRomCieNCTraficoView
    {
        public int CosRomCieNCTraficoId { get; set; }
        public DateTime FechaContable { get; set; }
        public DateTime FechaFactura { get; set; }
        [ExcelColumnDesc("A")]
        public DateTime FechaTrafico { get; set; }
        [ExcelColumnDesc("B")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("C")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("D")]
        public string NoConfirmacionSap { get; set; }

        [ExcelColumnDesc("E")]
        public decimal? FacturadoUsd { get; set; }
        [ExcelColumnDesc("F")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("H")]
        public decimal? Tc { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? Mxn { get; set; }
        [ExcelColumnDesc("J")]
        public string ClaseDocumentoSap { get; set; }

        [ExcelColumnDesc("K")]
        public string Tipo { get; set; }
    }
}