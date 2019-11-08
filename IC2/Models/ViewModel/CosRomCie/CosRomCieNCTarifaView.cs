using System;

namespace IC2.Models
{
    public partial class CosRomCieNCTarifaView
    {
        public int CosRomCieNCTarifaId { get; set; }
        public DateTime FechaContable { get; set; }
        public DateTime FechaFactura { get; set; }
        [ExcelColumnDesc("A")]
        public DateTime FechaInicio { get; set; }
        [ExcelColumnDesc("B")]
        public DateTime FechaFin { get; set; }
        [ExcelColumnDesc("C")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("D")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("E")]
        public string Operador { get; set; }
        [ExcelColumnDesc("F",Header = "No. Doc SAP")]
        public string NoConfirmacionSap { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? Facturado { get; set; }
        [ExcelColumnDesc("H")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? Tc { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? Mxn { get; set; }

        [ExcelColumnDesc("K")]
        public string ClaseDocumentoSap { get; set; }
        [ExcelColumnDesc("L")]
        public string Tipo { get; set; }
    }
}