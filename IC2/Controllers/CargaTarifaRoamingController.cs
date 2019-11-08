using System;
using System.Web;
using System.Web.Mvc;
using IC2.Models;
using IC2.Negocio;

namespace IC2.Controllers
{
    public class CargaTarifaRoamingController : Controller
    {
        readonly TarifaRoamingBusiness business = new TarifaRoamingBusiness();

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public ActionResult CargarCSV(HttpPostedFileBase archivoCSV, int? lineaNegocio, bool? esRecalculo=true)
        {
            object respuesta = null;
            try
            {
                business.CargarElementos(archivoCSV.InputStream, esRecalculo ?? true);
                respuesta = new { success = true, results = business.ListaErrores, totalProcesados = business.TotalProcesados, mensaje = "Datos cargados con éxito" };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.InnerException, mensaje = e.Message };
            }

            return Json(respuesta);
        }

        public ActionResult llenarCarga() {
            object respuesta = null;
            try
            {
                var opciones = business.ObtenerOpciones();
                respuesta = new { success = true, results = opciones };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

    }
}