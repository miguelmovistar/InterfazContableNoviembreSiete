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
    
    public partial class sp_GestionAcuerdos_Select_Result
    {
        public int Id { get; set; }
        public Nullable<System.DateTime> periodo { get; set; }
        public string sentido { get; set; }
        public string operador { get; set; }
        public string trafico { get; set; }
        public Nullable<decimal> minutosPoliza { get; set; }
        public Nullable<decimal> tarifaPoliza { get; set; }
        public Nullable<decimal> USDPoliza { get; set; }
        public Nullable<decimal> minutosAcuerdo { get; set; }
        public Nullable<decimal> tarifaAcuerdo { get; set; }
        public Nullable<decimal> USDAcuerdo { get; set; }
        public Nullable<decimal> VariacionMinutos { get; set; }
        public Nullable<decimal> VariacionMonto { get; set; }
        public Nullable<System.DateTime> mes { get; set; }
        public Nullable<int> id_operador { get; set; }
        public Nullable<int> id_trafico { get; set; }
        public Nullable<int> Id_Sociedad { get; set; }
        public Nullable<int> id_servicio { get; set; }
        public Nullable<int> idDeudorAcreedor { get; set; }
        public string deudorAcreedor { get; set; }
        public Nullable<int> id_grupo { get; set; }
        public string Grupo { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public string Moneda { get; set; }
        public Nullable<int> llamadas { get; set; }
    }
}