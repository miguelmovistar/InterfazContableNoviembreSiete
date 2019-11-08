using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieProvTarifaView
    {
        [ExcelColumnDesc("A")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("B")]
        public string Periodo { get; set; }
        [ExcelColumnDesc("C")]
        public string Operador { get; set; }
        [ExcelColumnDesc("D")]
        public string SoGl { get; set; }
        [ExcelColumnDesc("E")]
        public string Deudor { get; set; }
        [ExcelColumnDesc("F", TypeDataExcel.Decimal)]
        public decimal? ProvTarifa { get; set; }
        [ExcelColumnDesc("G", TypeDataExcel.Decimal)]
        public decimal? AjNcRealVsDevengoMesAnte { get; set; }
        [ExcelColumnDesc("H", TypeDataExcel.Decimal)]
        public decimal? ProvDevengoTarifa { get; set; }
        [ExcelColumnDesc("I", TypeDataExcel.Decimal)]
        public decimal? ProvisionNcTarifaCancelada { get; set; }
        [ExcelColumnDesc("J", TypeDataExcel.Decimal)]
        public decimal? ProvisionNcTarifa { get; set; }
        [ExcelColumnDesc("K", TypeDataExcel.Decimal)]
        public decimal? TotalProvIngresoTarifa { get; set; }
        [ExcelColumnDesc("L", TypeDataExcel.Decimal)]
        public decimal? ProvisionIngresoTarifa { get; set; }
        [ExcelColumnDesc("M", TypeDataExcel.Decimal)]
        public decimal? CancelacionProvisionIngresoTarifa { get; set; }
        [ExcelColumnDesc("N", TypeDataExcel.Decimal)]
        public decimal? TotalProvisionNcTarifa { get; set; }
        [ExcelColumnDesc("O", TypeDataExcel.Decimal)]
        public decimal? ComplementoTarifaMesesAnteriores { get; set; }
        [ExcelColumnDesc("P", TypeDataExcel.Decimal)]
        public decimal? TotalProvTarifa { get; set; }
    }
}