using IC2.Comun.Entities;
using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngCieRomTCView
    {
        [ExcelColumnDesc("A")]
        [Fecha]
        public string Periodo { get; set; }

        [ExcelColumnDesc("B")]
        public string Concepto { get; set; }

        [ExcelColumnDesc("C", TypeDataExcel.Decimal)]
        public decimal TC { get; set; }
    }

}