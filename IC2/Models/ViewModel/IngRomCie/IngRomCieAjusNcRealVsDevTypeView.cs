using IC2.Comun.Entities;
using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieAjusNcRealVsDevView
    {
        [ExcelColumnDesc("A", TypeDataExcel.Texto, "Periodo desde MetaData")]
        [Fecha]
        public string Periodo { get; set; }
        [ExcelColumnDesc("B")]
        public string PlmnV { get; set; }
        [ExcelColumnDesc("C")]
        public string Operador { get; set; }
        [ExcelColumnDesc("B")]
        public string Deudor { get; set; }
        [ExcelColumnDesc("D", TypeDataExcel.Decimal)]
        public decimal? ProvisionTarifaMesAnterior { get; set; }
        [ExcelColumnDesc("E", TypeDataExcel.Decimal)]
        public decimal? ProvisionRealTarifaDeMesAnterior { get; set; }
        [ExcelColumnDesc("F", TypeDataExcel.Decimal)]
        public decimal? AjustesTarifaReal { get; set; }
    }
}