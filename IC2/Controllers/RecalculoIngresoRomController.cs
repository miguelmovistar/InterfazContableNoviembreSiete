using IC2.Comun;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class RecalculoIngresoRomController : PXQIngresosROMRecalculoController
    {
        protected override int? Tipo { get => 2; set { } }



    }
}