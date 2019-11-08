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
    
    public partial class uvw_DocumentoCostoSinProvision
    {
        public int Id { get; set; }
        public Nullable<int> Anio { get; set; }
        public Nullable<System.DateTime> FechaContable { get; set; }
        public Nullable<System.DateTime> FechaConsumo { get; set; }
        public string Compania { get; set; }
        public string Servicio { get; set; }
        public string Grupo { get; set; }
        public string Operador { get; set; }
        public string NombreOperador { get; set; }
        public string Acreedor { get; set; }
        public string Material { get; set; }
        public string Trafico { get; set; }
        public Nullable<decimal> Iva { get; set; }
        public Nullable<decimal> PorcentajeIva { get; set; }
        public string Moneda { get; set; }
        public Nullable<int> Minutos { get; set; }
        public Nullable<decimal> Tarifa { get; set; }
        public Nullable<decimal> Monto { get; set; }
        public Nullable<decimal> MontoFacturado { get; set; }
        public Nullable<System.DateTime> FechaFactura { get; set; }
        public string FolioDocumento { get; set; }
        public Nullable<decimal> TipoCambio { get; set; }
        public Nullable<decimal> MontoMxn { get; set; }
        public string CuentaContable { get; set; }
        public string ClaseDocumento { get; set; }
        public string ClaseDocumentoSap { get; set; }
        public string NumeroDocumentoSap { get; set; }
        public Nullable<bool> Activo { get; set; }
        public Nullable<int> LineaNegocio { get; set; }
        public Nullable<System.DateTime> FechaCarga { get; set; }
        public Nullable<int> PeriodoCargaMes { get; set; }
        public Nullable<int> PeriodoCargaAnio { get; set; }
        public Nullable<int> IdOperador { get; set; }
        public Nullable<int> IdGrupo { get; set; }
        public Nullable<int> IdAcreedor { get; set; }
        public Nullable<int> IdMoneda { get; set; }
    }
}
