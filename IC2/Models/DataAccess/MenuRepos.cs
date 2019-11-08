using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace IC2.Models
{

    internal class MenuRepos
    {
        public IEnumerable<Submenu> ObtenerMenuXLineaNegocio(int idLinea)
        {
            using (var uow = UnitOfWork.Create())
            {
                var db = uow.DB;

                yield return db.Submenu.FirstOrDefault(x => x.Controlador == "ParametrosCarga");

                var acceso = from oAcceso in db.Acceso
                              join oSubmenu in db.Submenu
                              on oAcceso.Id_Submenu equals oSubmenu.Id
                              where oSubmenu.Activo == 1 &&
                                     oAcceso.Id_LineaNegocio == idLinea
                                      && oSubmenu.Controlador != "ParametrosCarga"
                              orderby oSubmenu.Nombre
                              select new
                              {
                                  oSubmenu.Controlador,
                                  oSubmenu.Nombre,
                                  oSubmenu.Id_Menu
                              };
                foreach (var elemento in acceso)
                {
                    yield return new Submenu
                    {
                        Nombre = elemento.Nombre,
                        Controlador = elemento.Controlador,
                        Id_Menu = elemento.Id_Menu
                    };
                }

            }
            
        }

        public IEnumerable<Menu> ObtenerMenuPrincipalXLineaNegocio(int IdLinea)
        {
            using (var uow = UnitOfWork.Create())
            {
                var db = uow.DB;
                var menu = from oMenu in db.Menu
                           join oMenuacceso in db.MenuAcceso
                           on oMenu.Id equals oMenuacceso.Id_Menu
                           where oMenuacceso.Id_LineaNegocio == IdLinea
                           select new
                           {
                               oMenu.Id,
                               oMenu.Nombre
                           };
                foreach (var elemento in menu)
                {
                    yield return new Menu
                    {
                        Id = elemento.Id,
                        Nombre = elemento.Nombre
                    };
                }
            }
        }
    }

}