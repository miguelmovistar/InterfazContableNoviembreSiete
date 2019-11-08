using System;
using System.Collections.Generic;
using System.Web.Mvc;
using IC2.Models;
using IC2.Models.ViewModel;

namespace IC2.Comun
{
    internal class ModelBinderGridCieExtraParam : DefaultModelBinder
    {
        BinderModelMetodos metodos = new BinderModelMetodos();

        protected virtual IReadOnlyDictionary<string,Metadata> ObtenerMetadata(string elementType)
        {
            return elementType.StartsWith("IngRomCie") ? DTOMetadata.RoamingCierreIngresoMetadata : DTOMetadata.RoamingCierreCostosMetadata;
        }

        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            string elementType = controllerContext.HttpContext.Request.Params["elementType"];

            if(elementType == null)
                return null;

            object obj= metodos.CrearObjeto(elementType, ObtenerMetadata(elementType), true);
            if (obj == null)
                return null;

            if (controllerContext.HttpContext.Request.Params["periodo"] != null){
                DateTime periodo = DateTime.ParseExact(controllerContext.HttpContext.Request.Params["periodo"], "MM-dd-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                (obj as IPeriodo).Periodo = periodo;
            }

            if (controllerContext.HttpContext.Request.Params["ExMxn"] != null)
            {
                (obj as IConvertirMxn).EsMxn = Convert.ToBoolean(controllerContext.HttpContext.Request.Params["ExMxn"]);
            }

            if (controllerContext.HttpContext.Request.Params["EsCostoRecurrente"] != null)
            {
                (obj as ICostos).EsCostoRecurrente = Convert.ToBoolean(controllerContext.HttpContext.Request.Params["EsCostoRecurrente"]);
            }

            SetExtraParameters(obj, controllerContext, bindingContext);

            return obj;

        }

        virtual protected void SetExtraParameters(object obj,ControllerContext controllerContext, ModelBindingContext bindingContext) {

        }

    }
}