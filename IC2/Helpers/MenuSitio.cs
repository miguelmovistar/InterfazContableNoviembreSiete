using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ICF2.Utilerias
{
    public class MenuSitio
    {
        private string _Nombre = string.Empty;
        private string _Controlador = string.Empty;
        private int? _Id_Menu;
        private int? _Id;
        public string Nombre { get => _Nombre; set => _Nombre = value; }
        public string Controlador { get => _Controlador; set => _Controlador = value; }
        public int? Id_Menu { get => _Id_Menu; set => _Id_Menu = value; }
        public int? Id { get => _Id; set => _Id = value; }
    }
}
