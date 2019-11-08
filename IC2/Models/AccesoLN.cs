using System.Collections.Generic;
using System.Linq;

namespace IC2.Models
{
    public class AccesoLN
    {
        ICPruebaEntities db = new ICPruebaEntities();
        public string Nombre { get; set; }
        public string Controlador { get; set; }

      //  List<AccesoLN> lista = obtenerMenu(IdLinea);

        public List<AccesoLN> obtenerMenu(int IdLinea)
        {
            List<AccesoLN> ListaMenu = new List<AccesoLN>();
            var acceso = from oAcceso in db.Acceso
                         join oSubmenu in db.Submenu
                         on oAcceso.Id_Submenu equals oSubmenu.Id
                         where oSubmenu.Activo == 1 && oAcceso.Id_LineaNegocio == IdLinea
                         select new
                         {
                             oSubmenu.Controlador,
                             oSubmenu.Nombre
                         };
            foreach (var elemento in acceso)
            {
                ListaMenu.Add(new AccesoLN
                {
                    Nombre = elemento.Nombre,
                    Controlador = elemento.Controlador
                });
            }
            return ListaMenu;
        }
    }
   
}