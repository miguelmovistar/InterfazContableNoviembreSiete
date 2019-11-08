using System;

namespace IC2.Models
{
    class CosRomCieBaseDatosView
    {
        [ExcelColumnDesc("A")]
        public string NoProvision { get; set; }
        [ExcelColumnDesc("B")]
        public string Plmn { get; set; }
        [ExcelColumnDesc("C")]
        public string RazonSocial { get; set; }
        [ExcelColumnDesc("D")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("I")]
        public string Moneda { get; set; }

        [ExcelColumnDesc("J")]
        public decimal? TC { get; set; }

        [ExcelColumnDesc("F")]
        public DateTime Periodo { get; set; }

        [ExcelColumnDesc("D")]
        public string NoAcreedorSap { get; set; }

        [ExcelColumnDesc("E")]
        public string AcreedorRegistro { get; set; }
        [ExcelColumnDesc("H")]
        public string Operacion { get; set; }
        [ExcelColumnDesc("F")]
        public string SociedadGl { get; set; }
        [ExcelColumnDesc("G",Header ="Tipo de Registro")]
        public string TipoRegistro { get; set; }
        [ExcelColumnDesc("K")]
        public decimal? ImporteMd { get; set; }
        [ExcelColumnDesc("L")]
        public decimal? ImporteMxn { get; set; }
        [ExcelColumnDesc("N")]
        public decimal? RealConfirmado { get; set; }
        [ExcelColumnDesc("O")]
        public decimal? Cancelacion { get; set; }
        public decimal? RemanenteMd { get; set; }
        public decimal? RemanenteMxn { get; set; }
        public decimal? RemanenteUsd { get; set; }
    }
}