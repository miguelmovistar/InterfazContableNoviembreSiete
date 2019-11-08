using System;
using System.Web.Mvc;

namespace IC2.Comun
{
    public class PxQIngresosRomRecalculoConfigBinder : ModelBinderConfig {

        private ConfigPxQIngresosRomRecalculo config = new ConfigPxQIngresosRomRecalculo();

        protected override Config Config => config;

        protected override void SetParameters(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            string esRecalculo = controllerContext.HttpContext.Request.Params["esRecalculo"];
            config.EsRecalculo = Convert.ToBoolean(esRecalculo ?? "false");


        }
    }

}