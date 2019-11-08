using System;

namespace IC2.Models.ViewModel
{
    public class CosRomCieTCView
    {
        [ExcelColumnDesc("A")]
        public DateTime Periodo { get; set; }
        [ExcelColumnDesc("B")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("C")]
        public string Concepto { get; set; }
        [ExcelColumnDesc("D")]
        public string Tipo { get; set; }
        [ExcelColumnDesc("E")]
        public decimal Tc { get; set; }
     }
}