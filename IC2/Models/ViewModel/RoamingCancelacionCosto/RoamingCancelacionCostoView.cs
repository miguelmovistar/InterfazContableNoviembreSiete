namespace IC2.Models.ViewModel
{
    public class RoamingCancelacionCostoView
    {

        [ExcelColumnDesc("A")]
        public string BanderaConcepto { get; set; }
        [ExcelColumnDesc("B")]
        public string NumeroProvision { get; set; }
        [ExcelColumnDesc("C")]
        public string CuentaContable { get; set; }
        [ExcelColumnDesc("D")]
        public string Indat { get; set; }
        [ExcelColumnDesc("E")]
        public string Concepto { get; set; }
        [ExcelColumnDesc("F")]
        public string Grupo { get; set; }
        [ExcelColumnDesc("G")]
        public string Acreedor { get; set; }
        [ExcelColumnDesc("H")]
        public string MontoProvision { get; set; }
        [ExcelColumnDesc("I")]
        public string Moneda { get; set; }
        [ExcelColumnDesc("J")]
        public string Periodo { get; set; }
        [ExcelColumnDesc("K")]
        public string Tipo { get; set; }
        [ExcelColumnDesc("L")]
        public string NumeroDocumentoSap { get; set; }
        [ExcelColumnDesc("M")]
        public string FolioDocumento { get; set; }
        [ExcelColumnDesc("N")]
        public string TipoCambioProvision { get; set; }
        [ExcelColumnDesc("O")]
        public string ImporteMxn { get; set; }
        [ExcelColumnDesc("P")]
        public string ImporteFactura { get; set; }
        [ExcelColumnDesc("Q")]
        public string DiferenciaProvisionFactura { get; set; }
        [ExcelColumnDesc("R")]
        public string TipoCambioFactura { get; set; }
        [ExcelColumnDesc("S")]
        public string ExcesoProvisionMxn { get; set; }
        [ExcelColumnDesc("T")]
        public string InsuficienciaProvisionMxn { get; set; }
        [ExcelColumnDesc("U")]
        public string FechaConsumo { get; set; }
        [ExcelColumnDesc("V")]
        public string TipoCambio { get; set; }
        [ExcelColumnDesc("W")]
        public string MontoFacturado { get; set; }

    }
}