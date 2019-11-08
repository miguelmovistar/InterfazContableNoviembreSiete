using IC2.Comun;
using IC2.Models.DataAccess;
using IC2.Negocio;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class CierreIngresosROMController : GridController
    {
        public CierreIngresosROMController()
        {
            gridBusiness = new GridBusiness(new CierreIngresosRomRepository());
        }

        [HttpGet]
        [ActionName("ConsultaGeneralXFiltro")]
        public async Task<ActionResult> ConsultaGeneralXFiltroAsync(
            [ModelBinder(typeof(FilterModelBinderIngCieRom))] object filtro,  [ModelBinder(typeof(FilterModelBinderPaginador))] Paginador paginador,
            [ModelBinder(typeof(ModelBinderGridCieExtraParam))] IParams extraParam, [ModelBinder(typeof(ModelBinderConfig))] Config config)
        {
            object result = await _ConsultaXFiltroAsync(filtro, config, paginador, extraParam);

            return Json(result, JsonRequestBehavior.AllowGet);

        }

    }
}