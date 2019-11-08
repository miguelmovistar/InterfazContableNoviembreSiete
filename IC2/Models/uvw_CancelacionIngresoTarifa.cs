//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IC2.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class uvw_CancelacionIngresoTarifa
    {
        public int Id { get; set; }
        public string BanderaConcepto { get; set; }
        public string NumeroProvision { get; set; }
        public string Operador { get; set; }
        public string Concepto { get; set; }
        public string Grupo { get; set; }
        public string Deudor { get; set; }
        public Nullable<decimal> MontoProvision { get; set; }
        public string Moneda { get; set; }
        public Nullable<System.DateTime> Periodo { get; set; }
        public string Tipo { get; set; }
        public string NumeroDocumentoSap { get; set; }
        public string FolioDocumento { get; set; }
        public Nullable<decimal> TipoCambioProvision { get; set; }
        public Nullable<decimal> ImporteMXN { get; set; }
        public Nullable<decimal> ImporteFactura { get; set; }
        public Nullable<decimal> DiferenciaProvisionFactura { get; set; }
        public Nullable<decimal> TipoCambioFactura { get; set; }
        public Nullable<decimal> ExcesoProvisionMXN { get; set; }
        public Nullable<decimal> InsuficienciaProvisionMXN { get; set; }
        public Nullable<System.DateTime> FechaContable { get; set; }
        public Nullable<int> PeriodoCargaMes { get; set; }
        public Nullable<int> PeriodoCargaAnio { get; set; }
        public Nullable<System.DateTime> FechaCarga { get; set; }
        public Nullable<int> IdOperador { get; set; }
        public Nullable<int> IdGrupo { get; set; }
        public Nullable<int> IdDeudor { get; set; }
        public Nullable<int> IdMoneda { get; set; }
    }
}
