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
    
    public partial class IngRomCieProvTarifaAcumMesAnte
    {
        public long IngRomCieProvTarifaAcumMesAnteId { get; set; }
        public System.DateTime Periodo { get; set; }
        public Nullable<decimal> ProvNcTarifaUsdMesAnte { get; set; }
        public Nullable<decimal> ProvIngresoTarifaUsdMesAnte { get; set; }
        public Nullable<decimal> ProvTarifaTotalUsd { get; set; }
        public Nullable<decimal> CancelacionProvisionNcTarifa { get; set; }
        public Nullable<decimal> CancelacionProvisionIngresoTarifa { get; set; }
        public Nullable<decimal> TotalNcAcumulada { get; set; }
        public Nullable<decimal> TotalProvIngresoAcumulada { get; set; }
        public Nullable<decimal> Tc { get; set; }
        public Nullable<decimal> ProvNcTarifaMxn { get; set; }
        public Nullable<decimal> ProvIngrsoMxn { get; set; }
    }
}
