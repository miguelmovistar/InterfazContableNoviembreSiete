using IC2.Comun;
using IC2.Models;
using IC2.Negocio;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class PXQIngresosROMRecalculoController : Controller
    {
        protected readonly PxQIngresosRomRecalculoBusiness business = ConfiguracionFactory.ObtenerConfiguracion("PXQIngresosROMRecalculo") as PxQIngresosRomRecalculoBusiness;
        virtual protected int? Tipo { get; set; } = 1;

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            ViewBag.Controller = this.GetType().Name.Replace("Controller", "");
            return View();
        }

        public async Task<ActionResult> ConsultaGeneral(
            [ModelBinder(typeof(FilterModelBinderPaginador))] Paginador paginador,
            [ModelBinder(typeof(PxQIngresosRomRecalculoConfigBinder))] Config config,
            [ModelBinder(typeof(ModelBinderPxQIngresosRomRecalculoParam))] IParams extraParams)
        {

            object result = await _ConsultaGeneral(paginador, config, extraParams);
            return Json(result, JsonRequestBehavior.AllowGet); ;

        }
        
        private async Task<object> _ConsultaGeneral(Paginador paginador, Config config, IParams extraParams)
        {

            (extraParams as RecalculoParm).Tipo = Tipo??0;
            (extraParams as RecalculoParm).Periodo = new DateTime(DateTime.Now.Date.Year, DateTime.Now.Date.Month, DateTime.DaysInMonth(DateTime.Now.Date.Year, DateTime.Now.Date.Month));

            object result = await business.ConsultarAsync(null, config, paginador, extraParams);
            return result;
        }
    }
}