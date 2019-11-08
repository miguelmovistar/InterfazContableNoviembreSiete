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
    
    public partial class CostoFR
    {
        public int Id { get; set; }
        public Nullable<int> Id_Operador { get; set; }
        public string TipoOperador { get; set; }
        public string Operador { get; set; }
        public Nullable<int> id_Acreedor { get; set; }
        public string Acreedor { get; set; }
        public string NombreProveedor { get; set; }
        public Nullable<int> Id_Moneda { get; set; }
        public string Moneda { get; set; }
        public Nullable<decimal> Importe { get; set; }
        public System.DateTime Fecha_Inicio { get; set; }
        public System.DateTime Fecha_Fin { get; set; }
        public string CuentaContable { get; set; }
        public string Sociedad { get; set; }
        public Nullable<decimal> TC { get; set; }
        public Nullable<int> Activo { get; set; }
        public Nullable<int> Id_LineaNegocio { get; set; }
        public Nullable<System.DateTime> periodo_carga { get; set; }
    
        public virtual Acreedor Acreedor1 { get; set; }
        public virtual LineaNegocio LineaNegocio { get; set; }
        public virtual Moneda Moneda1 { get; set; }
        public virtual Operador Operador1 { get; set; }
    }
}
