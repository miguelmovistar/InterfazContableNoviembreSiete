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
    
    public partial class IngRomCieIngreso
    {
        public long IngRomCieIngresoId { get; set; }
        public string CuentaDeResultados { get; set; }
        public int OperadorId { get; set; }
        public System.DateTime Periodo { get; set; }
        public Nullable<decimal> MonedaId { get; set; }
        public Nullable<decimal> CancelacionDevengoTrafico { get; set; }
        public Nullable<decimal> CancelacionProvNcTarifaMesAnterior { get; set; }
        public Nullable<decimal> CancelacionProvCostoTarifaMesAnterior { get; set; }
        public Nullable<decimal> CancelacionProvNCObjecion { get; set; }
        public Nullable<decimal> CancelaciónDevengoTotalMesAnterior { get; set; }
        public Nullable<decimal> FacturaciónTrafico { get; set; }
        public Nullable<decimal> FacturacionTarifa { get; set; }
        public Nullable<decimal> NcrTrafico { get; set; }
        public Nullable<decimal> NcrTarifa { get; set; }
        public Nullable<decimal> DevengoCostoTrafico { get; set; }
        public Nullable<decimal> ProvCostoDifTarifa { get; set; }
        public Nullable<decimal> ProvNcDifTarifa { get; set; }
        public Nullable<decimal> ProvNcrObjeciones { get; set; }
        public Nullable<decimal> ExcesoOInsufDevMesAnt { get; set; }
        public Nullable<decimal> FluctuacionAReclasificar { get; set; }
        public Nullable<decimal> TotalDevengo { get; set; }
        public string Grupo { get; set; }
    }
}
