using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ICF2.Utilerias
{
    public class CPermisos
    {
        #region propiedades
        private int _idPermiso;
        private int? _idPadre;
        private string _etiqueta = string.Empty;
        private string _controlador = string.Empty;
        private string _pagina = string.Empty;
        private int _idMenu;
        private int _canRead;
        private int _canNew;
        private int _canEdit;
        private int _canDelete;
        private int _writLog;

        public int IdPermiso { get => _idPermiso; set => _idPermiso = value; }
        public int? IdPadre { get => _idPadre; set => _idPadre = value; }
        public string Etiqueta { get => _etiqueta; set => _etiqueta = value; }
        public string Controlador { get => _controlador; set => _controlador = value; }
        public int CanRead { get => _canRead; set => _canRead = value; }
        public int CanNew { get => _canNew; set => _canNew = value; }
        public int CanEdit { get => _canEdit; set => _canEdit = value; }
        public int CanDelete { get => _canDelete; set => _canDelete = value; }
        public int WritLog { get => _writLog; set => _writLog = value; }
        public string Pagina { get => _pagina; set => _pagina = value; }
        public int IdMenu { get => _idMenu; set => _idMenu = value; }

        #endregion


    }
}
