namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieSabanaView
    {
        [ExcelColumnDesc("A")]
        public string IngRomCieSabanaId { get; set; }
        [ExcelColumnDesc("B")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("V")]
        public string Deudor { get; set; }
        [ExcelColumnDesc("D")]
        public string SociedadGL { get; set; }
        [ExcelColumnDesc("E", TypeDataExcel.Decimal)]
        public decimal? Devengo { get; set; }
        [ExcelColumnDesc("F", TypeDataExcel.Decimal)]
        public decimal? DevengoAcum { get; set; }
        [ExcelColumnDesc("G", TypeDataExcel.Decimal)]
        public decimal? NcAcumMesActual { get; set; }
        [ExcelColumnDesc("H", TypeDataExcel.Decimal)]
        public decimal? TotalNcEmitida { get; set; }
        [ExcelColumnDesc("I", TypeDataExcel.Decimal)]
        public decimal? Acum { get; set; }
        [ExcelColumnDesc("J", TypeDataExcel.Decimal)]
        public decimal? TotalSabana { get; set; }
    }
}