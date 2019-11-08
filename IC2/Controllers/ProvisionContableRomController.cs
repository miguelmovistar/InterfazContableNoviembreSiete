using System.Web.Mvc;

namespace IC2.Controllers
{
    public class ProvisionContableRomController : PXQIngresosROMRecalculoController
    {
        protected override int? Tipo { get => 1; set { } }

    }
}