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
    
    public partial class DevengoAjustesROM
    {
        public int Id { get; set; }
        public string Sentido { get; set; }
        public string SentidoTipo { get; set; }
        public Nullable<System.DateTime> Periodo { get; set; }
        public Nullable<decimal> ImporteDevengoCierreMD { get; set; }
        public Nullable<decimal> TCCierre { get; set; }
        public Nullable<decimal> ImporteDevengoCierreMXN { get; set; }
        public Nullable<decimal> RealFactUSD { get; set; }
        public Nullable<decimal> TCSAP { get; set; }
        public Nullable<decimal> RealFactMXN { get; set; }
        public Nullable<decimal> AjusteUSD { get; set; }
        public Nullable<decimal> AjusteMXN { get; set; }
    }
}
