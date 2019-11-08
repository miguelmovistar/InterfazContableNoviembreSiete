using IC2.Models;
using System.Collections.Generic;

namespace IC2.Comun
{
    internal class ExcelTab {
        public string Nombre { get; set; }
        public List<object> Filas { get; set; }
        public Metadata Source {get;set;}
    }
}