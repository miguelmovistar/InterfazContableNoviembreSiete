using System;

namespace IC2.Models
{
    public partial class CosRomCieFacturaTarifaView
    {
        public int CosRomCieFacturaTarifaId { get; set; }
        public DateTime FechaContable { get; set; }
        public DateTime FeachaFactura { get; set; }
        [ExcelColumnDesc("A")]
        public DateTime FechaInicio { get; set; }
        [ExcelColumnDesc("B")]
        public DateTime FechaFin { get; set; }
        [ExcelColumnDesc("C")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("D")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("E",Header ="Nombre")]
        public string Nombre { get; set; }
        [ExcelColumnDesc("F")]
        public string NoConfirmacionSap { get; set; }
        [ExcelColumnDesc("G", Header ="Facturado")]
        public decimal? FacturadoUsd { get; set; }

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