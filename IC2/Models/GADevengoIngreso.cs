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
    
    public partial class GADevengoIngreso
    {
        public int Id { get; set; }
        public string Cuenta { get; set; }
        public Nullable<int> id_servicio { get; set; }
        public Nullable<int> id_deudor { get; set; }
        public Nullable<int> id_grupo { get; set; }
        public string SoGL { get; set; }
        public string Grupo { get; set; }
        public string NombreCorto { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public Nullable<System.DateTime> FechaConsumo { get; set; }
        public System.DateTime FechaSolicitud { get; set; }
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
    }
}
