using IC2.Comun.Entities;
using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieFacturaTraficoNCSelectView
    {
        [ExcelColumnDesc("A")]
        [Fecha]
        public string FechaFactura { get; set; }
        [ExcelColumnDesc("B")]
        [Fecha]
        public string FechaTrafico { get; set; }
        [ExcelColumnDesc("C")]
        [Fecha]
        public string FechaInicio { get; set; }
        [ExcelColumnDesc("D")]
        [Fecha]
        public string FechaFin { get; set; }
        [ExcelColumnDesc("E")]
        [Fecha]
        public string FechaConsumo { get; set; }
        [ExcelColumnDesc("F")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("G")]
        public string Operador { get; set; }
        [ExcelColumnDesc("H")]
        public string Deudor { get; set; }
        [ExcelColumnDesc("I")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("J")]
        public string Concepto { get; set; }
        [ExcelColumnDesc("K")]
        public string Tipo { get; set; }
        [ExcelColumnDesc("L")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("M")]
        public string FolioFacturaSap { get; set; }
        [ExcelColumnDesc("N")]
        public string FolioSap { get; set; }
        [ExcelColumnDesc("O")]
        public decimal? FacturadoSinImpuestos { get; set; }
        [ExcelColumnDesc("P", TypeDataExcel.Decimal)]
        public decimal? Tc { get; set; }
        [ExcelColumnDesc("Q", TypeDataExcel.Decimal)]
        public decimal? Mxn { get; set; }
        [ExcelColumnDesc("R", TypeDataExcel.Decimal)]
        public decimal? ReporteARMonthlyInvoice { get; set; }
        [ExcelColumnDesc("S", TypeDataExcel.Decimal)]
        public decimal? PorEmitir { get; set; }
    }
}