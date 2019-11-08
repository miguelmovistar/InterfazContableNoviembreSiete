using IC2.Comun.Entities;
using System;

namespace IC2.Models.ViewModel.IngRomCie
{
    public class IngRomCieBaseDatosView
    {
        public string Plmn { get; set; }
        [ExcelColumnDesc("A")]
        public string TipoRegistro { get; set; }
        [ExcelColumnDesc("B")]
        public string RazonSocial { get; set; }
        [ExcelColumnDesc("C")]
        public string Deudor { get; set; }
        [ExcelColumnDesc("D")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("E", TypeDataExcel.Decimal)]
        public decimal? TC { get; set; }
        [ExcelColumnDesc("F")]
        [Fecha]
        public string Periodo { get; set; }
        [ExcelColumnDesc("G")]
        public string NoAcreedorSap { get; set; }
        [ExcelColumnDesc("H")]
        public string AcreedorRegistro { get; set; }
        [ExcelColumnDesc("I")]
        public string Operacion { get; set; }
        [ExcelColumnDesc("J")]
        public string SociedadGl { get; set; }
        [ExcelColumnDesc("K", TypeDataExcel.Decimal)]
        public decimal? ImporteMd { get; set; }
        [ExcelColumnDesc("L", TypeDataExcel.Decimal)]
        public decimal? ImporteMxn { get; set; }
        [ExcelColumnDesc("M", TypeDataExcel.Decimal)]
        public decimal? RealConfirmado { get; set; }
        [ExcelColumnDesc("N", TypeDataExcel.Decimal)]
        public decimal? Cancelacion { get; set; }
        [ExcelColumnDesc("O", TypeDataExcel.Decimal)]
        public decimal? RemanenteMd { get; set; }
        [ExcelColumnDesc("P", TypeDataExcel.Decimal)]
        public decimal? RemanenteMxn { get; set; }
        [ExcelColumnDesc("Q", TypeDataExcel.Decimal)]
        public decimal? RemanenteUsd { get; set; }
    }
}