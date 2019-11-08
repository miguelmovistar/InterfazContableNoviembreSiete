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
    
    public partial class datosTraficoTAPOUTB
    {
        public int Id { get; set; }
        public Nullable<System.DateTime> settlementDate { get; set; }
        public string myPMN { get; set; }
        public string VRSFCMTSRH { get; set; }
        public string codigoDeudor { get; set; }
        public string theirPMN { get; set; }
        public string operatorName { get; set; }
        public string rapFileName { get; set; }
        public Nullable<System.DateTime> rapFileAvailableTimeStamp { get; set; }
        public string rapStatus { get; set; }
        public string rapFileType { get; set; }
        public string rapAdjustmentIndicator { get; set; }
        public string tapFileType { get; set; }
        public string tapFileName { get; set; }
        public string callType { get; set; }
        public Nullable<int> numberCalls { get; set; }
        public Nullable<decimal> totalRealVolume { get; set; }
        public Nullable<decimal> totalChargedVolume { get; set; }
        public Nullable<decimal> realDuration { get; set; }
        public Nullable<decimal> chargedDuration { get; set; }
        public Nullable<decimal> chargesTaxesSDR { get; set; }
        public Nullable<decimal> taxes { get; set; }
        public Nullable<decimal> totalCharges { get; set; }
        public Nullable<decimal> chargesTaxesLC { get; set; }
        public Nullable<decimal> taxesLocalCurrency1 { get; set; }
        public Nullable<decimal> taxesLocalCurrency2 { get; set; }
        public Nullable<decimal> totalChargesLC { get; set; }
        public Nullable<System.DateTime> callDate { get; set; }
        public Nullable<int> idCarga { get; set; }
        public Nullable<System.DateTime> fecha_carga { get; set; }
    }
}
