using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class LineaNegocioController : Controller
    {
        public ActionResult LineaNegocio()
        {
            string PaginaInicio = Session["PaginaInicio"].ToString();
            if (!PaginaInicio.ToUpper().Contains("LINEANEGOCIO"))
            {
                return RedirectToAction(PaginaInicio.Split('/')[1], PaginaInicio.Split('/')[0]);
            }

            return View();
        }
      
    }
}
