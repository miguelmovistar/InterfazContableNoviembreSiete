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
    
    public partial class RoamingCancelacionIngreso
    {
        public int IdCancelacionIngreso { get; set; }
        public string BanderaConcepto { get; set; }
        public string NumeroProvision { get; set; }
        public string IdOperador { get; set; }
        public string Concepto { get; set; }
        public string Grupo { get; set; }
        public string Deudor { get; set; }
        public string MontoProvision { get; set; }
        public string Moneda { get; set; }
        public string Periodo { get; set; }
        public string Tipo { get; set; }
        public string NumeroDocumentoSap { get; set; }
        public string FolioDocumento { get; set; }
        public string TipoCambioProvision { get; set; }
        public string ImporteMxn { get; set; }
        public string ImporteFactura { get; set; }
        public string DiferenciaProvisionFactura { get; set; }
        public string TipoCambioFactura { get; set; }
        public string ExcesoProvisionMxn { get; set; }
        public string InsuficienciaProvisionMxn { get; set; }
        public string Activo { get; set; }
        public string LineaNegocio { get; set; }
        public System.DateTime FechaCarga { get; set; }
        public string FechaContable { get; set; }
        public string FechaConsumoTarifa { get; set; }
        public string ImporteFacturaTarifa { get; set; }
    }
}
