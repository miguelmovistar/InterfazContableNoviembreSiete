using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;
using ICF2.Utilerias;

namespace IC2.Controllers
{
    public class HomeController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();

        public ActionResult Index(int IdLinea)
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            Session["IdLinea"] = IdLinea;
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public List<Submenu> obtenerMenu(int IdLinea)
        {
            List<Submenu> ListaMenu = new List<Submenu>();
            Submenu parametros = new Submenu();
            var acceso = from oAcceso in db.Acceso
                         join oSubmenu in db.Submenu
                         on oAcceso.Id_Submenu equals oSubmenu.Id
                         where oSubmenu.Activo == 1 && oAcceso.Id_LineaNegocio == IdLinea
                         && oSubmenu.Controlador != "ParametrosCarga"
                         select new
                         {
                             oSubmenu.Controlador,
                             oSubmenu.Nombre,
                             oSubmenu.Id_Menu
                         };
            foreach (var elemento in acceso) {
                ListaMenu.Add(new Submenu
                {
                    Nombre = elemento.Nombre,
                    Controlador = elemento.Controlador,
                    Id_Menu = elemento.Id_Menu
                });
            }
            ListaMenu = ListaMenu.OrderBy(x => x.Nombre ).ToList();
            parametros = db.Submenu.Where(x => x.Controlador == "ParametrosCarga").SingleOrDefault();
            ListaMenu.Insert(0, parametros);
            //ListaMenu.Add(parametros);

            
            return ListaMenu;
        }

        public List<Menu> obtenerMenuPrincipal(int IdLinea)
        {
            List<Menu> lista = new List<Menu>();
            var menu = from oMenu in db.Menu
                       join oMenuacceso in db.MenuAcceso
                       on oMenu.Id equals oMenuacceso.Id_Menu
                       where oMenuacceso.Id_LineaNegocio == IdLinea
                       select new
                       {
                           oMenu.Id,
                           oMenu.Nombre
                       };
            foreach (var elemento in menu) {
                lista.Add(new Menu
                {
                    Id = elemento.Id,
                    Nombre = elemento.Nombre
                });

            }
            return lista;
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public List<MenuSitio> obtenerSubMenu(int perfil)
        {

            List<MenuSitio> lista = new List<MenuSitio>();

            var consulta = from per in db.permisos
                           join men in db.MenuIC on per.IDMenu equals men.Id
                           where per.ID_Perfil == perfil && men.Controlador != "ParametrosCarga" && men.IdPadre != null && men.IdPadre != -1 && per.Activo == true
                           select new
                           {
                               men.Id,
                               men.Etiqueta,
                               men.Controlador,
                               men.pagina,
                               men.IdPadre
                           };

            foreach (var item in consulta)
            {
                MenuSitio element = new MenuSitio();
                element.Id_Menu = item.IdPadre;
                element.Controlador = item.Controlador+"/"+item.pagina;
                element.Nombre = item.Etiqueta;
                lista.Add(element);


            }

            lista = lista.OrderBy(x => x.Nombre).ToList();
            var consulta2 = (from per in db.permisos
                             join men in db.MenuIC on per.IDMenu equals men.Id
                             where per.ID_Perfil == perfil && men.Controlador == "ParametrosCarga" && per.Activo == true
                             select new
                             {
                                 men.Id,
                                 men.Etiqueta,
                                 men.Controlador,
                                 men.pagina,
                                 men.IdPadre
                             }).SingleOrDefault();

            if (consulta2 != null)
            {
                MenuSitio element = new MenuSitio();
                element.Id_Menu = consulta2.IdPadre;
                element.Controlador = consulta2.Controlador;
                element.Nombre = consulta2.Etiqueta;
                lista.Insert(0, element);
            }



            return lista;
        }

        public List<MenuSitio> obtenerMenuPrincipal2(int perfil)
        {

            List<MenuSitio> lista = new List<MenuSitio>();

            var consulta = from per in db.permisos
                           join men in db.MenuIC on per.IDMenu equals men.Id
                           where per.ID_Perfil == perfil && men.Controlador != "ParametrosCarga" && men.IdPadre == null && men.IdPadre != -1 && per.Activo == true
                           select new
                           {
                               men.Id,
                               men.Etiqueta,
                               men.Controlador,
                               men.pagina
                           };

            foreach (var item in consulta)
            {
                MenuSitio element = new MenuSitio();
                element.Id = item.Id;
                element.Controlador = item.Controlador;
                element.Nombre = item.Etiqueta;
                lista.Add(element);


            }


            return lista;
        }



    }
}