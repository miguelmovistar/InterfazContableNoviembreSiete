using System;
using System.Collections.Generic;
using System.Web.Mvc;
using IC2.Models;
using IC2.Models.ViewModel;

namespace IC2.Comun
{
    internal class ModelBinderPxQIngresosRomRecalculoParam : ModelBinderGridCieExtraParam {

        protected override IReadOnlyDictionary<string, Metadata> ObtenerMetadata(string elementType)
        {
            return DTOMetadata.PxQIngresosRomRecalculoMetadato;
        }


        protected override void SetExtraParameters(object obj, ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            if (controllerContext.HttpContext.Request.Params["tipo"] != null)
            {
                (obj as RecalculoParm).Tipo = Convert.ToInt32(controllerContext.HttpContext.Request.Params["tipo"]);
            }

        }
    }
}