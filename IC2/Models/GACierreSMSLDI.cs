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
    
    public partial class GACierreSMSLDI
    {
        public int Id { get; set; }
        public System.DateTime periodo { get; set; }
        public string trafico { get; set; }
        public string movimiento { get; set; }
        public decimal eventos { get; set; }
        public Nullable<decimal> tarifa { get; set; }
        public Nullable<decimal> USD { get; set; }
        public Nullable<decimal> MXN { get; set; }
        public Nullable<decimal> tipoCambio { get; set; }
        public int lineaNegocio { get; set; }
    }
}
