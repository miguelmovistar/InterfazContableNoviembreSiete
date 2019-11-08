using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CargaController : Controller
    {
        // GET: Carga
        ICPruebaEntities db = new ICPruebaEntities();
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult LlenaCarga(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var menucargas = from cargas in db.MenuCargas
                                 join acceso in db.AccesoCargas
                                 on cargas.id equals acceso.id_cargas
                                 where cargas.activo == 1
                                 && acceso.id_lineaNegocio == lineaNegocio
                                 select new
                                 {
                                     cargas.nombre,
                                     cargas.controlador
                                 };
                foreach (var elemento in menucargas) {
                    lista.Add(new
                    {
                        Controlador = elemento.controlador,
                        Nombre = elemento.nombre
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
    }
}