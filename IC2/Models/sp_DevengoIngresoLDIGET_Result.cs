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
    
    public partial class sp_DevengoIngresoLDIGET_Result
    {
        public string Cuenta { get; set; }
        public string Servicio { get; set; }
        public string Deudor { get; set; }
        public string SoGL { get; set; }
        public string Grupo { get; set; }
        public string NombreCorto { get; set; }
        public string Moneda { get; set; }
        public Nullable<System.DateTime> FechaConsumo { get; set; }
        public Nullable<System.DateTime> FechaSolicitud { get; set; }
        public Nullable<decimal> TipoCambio { get; set; }
        public Nullable<decimal> TipoCambioFactura { get; set; }
        public Nullable<decimal> CancelProvision { get; set; }
        public Nullable<decimal> CancelProvNCR { get; set; }
        public Nullable<decimal> Facturacion { get; set; }
        public Nullable<decimal> NCREmitidas { get; set; }
        public Nullable<decimal> Provision { get; set; }
        public Nullable<decimal> ProvisionNCR { get; set; }
        public Nullable<decimal> Exceso { get; set; }
        public Nullable<decimal> TotalDevengo { get; set; }
        public Nullable<decimal> Fluctuacion { get; set; }
        public Nullable<decimal> TotalDevengoFluctuacion { get; set; }
    }
}
