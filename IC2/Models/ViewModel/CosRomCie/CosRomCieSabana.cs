using System;

namespace IC2.Models.ViewModel
{
    public class CosRomCieSabana
    {
        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("A")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("B")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("C")]
        public string Nombre { get; set; }
        [ExcelColumnDesc("D")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("E")]
        public string SociedadGl { get; set; }
        [ExcelColumnDesc("F")]
        public decimal? ProvTarifa { get; set; }
        [ExcelColumnDesc("G")]
        public decimal? TotalProvTarifa { get; set; }
        [ExcelColumnDesc("H")]
        public decimal? ProvRealReg { get; set; }
        [ExcelColumnDesc("I")]
        public decimal? NuevaProvAcumMesAnte { get; set; }
        [ExcelColumnDesc("E")]
        public decimal? NuevaProvAcum { get; set; }
        [ExcelColumnDesc("J")]
        public decimal? TotalNuevaProvTarifa { get; set; }
    }
}