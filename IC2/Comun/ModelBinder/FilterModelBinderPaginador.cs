using System;
using System.Web.Mvc;

namespace IC2.Comun
{
    public class FilterModelBinderPaginador : DefaultModelBinder {

        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            string start = controllerContext.HttpContext.Request.Params["start"];
            string limit = controllerContext.HttpContext.Request.Params["limit"];

            if (!string.IsNullOrEmpty(start) || string.IsNullOrEmpty(limit)) {
                Paginador paginador = new Paginador { Start = Convert.ToInt32(start), Limit = Convert.ToInt32(limit) };
                return paginador;
            }

            return base.BindModel(controllerContext, bindingContext);
        }

    }
}