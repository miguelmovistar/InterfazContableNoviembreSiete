using IC2.Comun;
using IC2.Models.DataAccess;
using IC2.Negocio;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class CierreCostosROMController : GridController
    {

        public CierreCostosROMController()
        {
            gridBusiness = new GridBusiness(new CierreCostosRomRepository());
        }

        [HttpGet]
        [ActionName("ConsultaGeneralXFiltro")]
        public async Task<ActionResult> ConsultaGeneralXFiltroAsync(
            [ModelBinder(typeof(FilterModelBinderCosCieRom))]object filtro, 
            [ModelBinder(typeof(FilterModelBinderPaginador))]Paginador paginador,
            [ModelBinder(typeof(ModelBinderGridCieExtraParam))] IParams extraParam,
            [ModelBinder(typeof(ModelBinderConfig))] Config config)
        {
 
            object result = await _ConsultaXFiltroAsync(filtro, config, paginador, extraParam);
            return Json(result, JsonRequestBehavior.AllowGet);

        }

    }
}