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
    
    public partial class IngRomCieNcTarifa
    {
        public long IngRomCieNcTarifaId { get; set; }
        public long OperadorId { get; set; }
        public Nullable<System.DateTime> FechaFactura { get; set; }
        public Nullable<System.DateTime> FechaInicio { get; set; }
        public Nullable<System.DateTime> FechaFin { get; set; }
        public string FolioFacturaSap { get; set; }
        public Nullable<decimal> FacturadoSinImpuestos { get; set; }
        public string Grupo { get; set; }
        public Nullable<decimal> Tc { get; set; }
        public Nullable<decimal> Mxn { get; set; }
    }
}