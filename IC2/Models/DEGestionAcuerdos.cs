using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IC2.Models
{
    public class DEGestionAcuerdos
    {
        public int Id { get; set; }
        public DateTime? Periodo { get; set; }
        public string Sentido { get; set; }
        public string Operador { get; set; }
        public string Trafico { get; set; }
        public Decimal? MinutosPolizas { get; set; }
        public Decimal? TarifaPolizas { get; set; }
        public Decimal? USDPolizas { get; set; }
        public Decimal? MinutosAcuerdos { get; set; }
        public Decimal? TarifaAcuerdos { get; set; }
        public Decimal? USDAcuerdos { get; set; }
        public Decimal? VariacionMinutos { get; set; }
        public Decimal? VariacionMonto { get; set; }
    }
}
