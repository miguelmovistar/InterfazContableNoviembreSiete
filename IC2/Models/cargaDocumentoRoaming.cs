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
    
    public partial class cargaDocumentoRoaming
    {
        public int Id { get; set; }
        public string idDocumento { get; set; }
        public string periodoCarga { get; set; }
        public Nullable<System.DateTime> fechaCarga { get; set; }
        public string tipoCarga { get; set; }
        public string ordenCarga { get; set; }
        public string estatusCarga { get; set; }
    }
}
