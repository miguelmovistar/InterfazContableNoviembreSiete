using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers.Seguridad
{
    public class SeguridadController : Controller
    {
        // GET: Seguridad
        public ActionResult Index()
        {
            return View();
        }
        
    }
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        public CustomAuthorizeAttribute(string strNombreVista)
        {
            var roles = new List<string>();
            //var TodosRoles = (from acs in db.TRSch_AccsesoUsuario
            //                  join sm in db.TCSch_SubMenu on acs.cd_identitySubmenu equals sm.cd_identitySubmenu
            //                  join usu in db.TCSch_Usuario on acs.cd_identityUsuario equals usu.cd_identityUsuario
            //                  where
            //                    sm.nb_vista == strNombreVista
            //                  select usu.cd_usuario);

            //foreach (var NombreRol in TodosRoles)
            //{
            //    roles.AddRange(NombreRol.Split(new[] { ',' }));
            //}

            //Roles = string.Join(",", roles);
            //Roles = String.Join(",", valores);
        }
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
           
            
            base.OnAuthorization(filterContext);
            if (filterContext.Result is  HttpUnauthorizedResult)
            {
                filterContext.Result = new RedirectResult("~/Account/login");
            }
        }
    }
}