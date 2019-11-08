using IC2.Comun.Entities;
using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieDevengoAcumuladoTraficoView
    {
        [ExcelColumnDesc("A")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("B")]
        public string Operador { get; set; }
        [ExcelColumnDesc("C")]
        [Fecha]
        public string Periodo { get; set; }
        [ExcelColumnDesc("D")]
        public string Deudor { get; set; }
        [ExcelColumnDesc("E", TypeDataExcel.Decimal)]
        public decimal? DevengoTrafico { get; set; }
        [ExcelColumnDesc("F", TypeDataExcel.Decimal)]
        public decimal? DevengoPendienteFacturar { get; set; }
        [ExcelColumnDesc("G", TypeDataExcel.Decimal)]
        public decimal? DevengoAcumulado { get; set; }
    }
}