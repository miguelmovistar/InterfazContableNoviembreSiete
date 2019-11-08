using IC2.Comun;
using IC2.Models;
using IC2.Negocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class GridController:Controller
    {

        protected GridBusiness gridBusiness;

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        protected async Task<object> _ConsultaXFiltroAsync(object filtro, Config config, Paginador paginador, IParams extraParam)
        {
            if (string.IsNullOrWhiteSpace(config.ElementType))
                return Json(new { success = true, results = new List<object>(), total = 0 }, JsonRequestBehavior.AllowGet);

            return await gridBusiness.ConsultaXFiltroAsync(filtro, config, paginador, extraParam);
       
        }

        [HttpPost]
        [ActionName("RealizarCalculo")]
        public async Task<ActionResult> RealizarCalculoAsync(string periodo)
        {
            try
            {
                DateTime periodoFecha = DateTime.ParseExact(periodo, "MM-dd-yyyy", CultureInfo.InvariantCulture);
                bool esOk = await gridBusiness.RealizarCalculos(periodoFecha);
                return Json(new { success = esOk });
            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }

        [HttpGet]
        public async Task<ActionResult> LlenaPeriodo(int? lineaNegocio)
        {

            var periodos = await gridBusiness.ObtenerPeriodos();
            var respuesta = new { success = true, results = periodos, total = periodos.Count };

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> Exportar([ModelBinder(typeof(ModelBinderGridCieExportar))]IParams parametros, string consulta)
        {
            object respuesta = await gridBusiness.Exportar(parametros, consulta);
            return Json(respuesta);

        }

    }
}