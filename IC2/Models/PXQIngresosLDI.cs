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
    
    public partial class PXQIngresosLDI
    {
        public int Id { get; set; }
        public System.DateTime periodo { get; set; }
        public string moneda { get; set; }
        public string grupo { get; set; }
        public string trafico { get; set; }
        public Nullable<decimal> minuto { get; set; }
        public Nullable<decimal> tarifa { get; set; }
        public Nullable<decimal> USD { get; set; }
        public Nullable<decimal> MXN { get; set; }
        public Nullable<decimal> tipoCambio { get; set; }
        public int lineaNegocio { get; set; }
    }
}
