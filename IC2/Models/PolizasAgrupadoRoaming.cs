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
    
    public partial class PolizasAgrupadoRoaming
    {
        public long Id { get; set; }
        public string Poliza { get; set; }
        public string TipoFichero { get; set; }
        public string Sentido { get; set; }
        public string Servicio { get; set; }
        public string Operador { get; set; }
        public string SociedadSAP { get; set; }
        public string Estado { get; set; }
        public Nullable<bool> Enviado { get; set; }
        public string Nombre { get; set; }
        public string FechaCreacion { get; set; }
        public string FechaEnvio { get; set; }
        public string TipoFactura { get; set; }
        public Nullable<System.DateTime> PeriodoConsumido { get; set; }
        public string NumeroPoliza { get; set; }
        public string DescripcionMensaje { get; set; }
        public string Rechazado { get; set; }
        public string Reprocesado { get; set; }
        public Nullable<bool> PolizaGenerada { get; set; }
    }
}