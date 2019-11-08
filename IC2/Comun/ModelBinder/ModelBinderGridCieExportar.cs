using System;
using System.Web.Mvc;

namespace IC2.Comun
{
    internal class ModelBinderGridCieExportar : DefaultModelBinder
    {
        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {

            PeriodoParam obj = new PeriodoParam();

            if (controllerContext.HttpContext.Request.Params["periodo"] != null)
            {
                DateTime periodo = DateTime.ParseExact(controllerContext.HttpContext.Request.Params["periodo"], "MM-dd-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                (obj as IPeriodo).Periodo = periodo;
            }

            return obj;

        }
    }
}