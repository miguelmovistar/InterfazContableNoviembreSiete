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
    
    public partial class CosRomCieAjNcMesAnterior
    {
        public int CosRomCieAjNcMesAnteriorId { get; set; }
        public int OperadorId { get; set; }
        public System.DateTime Periodo { get; set; }
        public Nullable<decimal> ProvisionTarifaMesAnterior { get; set; }
        public Nullable<decimal> ProvisionRealTarifaDeMesAnterior { get; set; }
        public Nullable<decimal> AjustesTarifaReal { get; set; }
    }
}