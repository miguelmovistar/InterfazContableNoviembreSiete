using System;
using System.Web.Mvc;

namespace IC2.Comun
{
    public class ModelBinderConfig : DefaultModelBinder {
        virtual protected Config Config { get; set; } = new Config();

        public ModelBinderConfig()
        {
        }

        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var elementType = controllerContext.HttpContext.Request.Params["elementType"];
            if (elementType != null)
            {
                string[] elementTypeSplit = elementType.Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries);
                Config.ElementType = elementTypeSplit[0];
                Config.ElementTypeNameOriginal = elementType;

                var conSuma = controllerContext.HttpContext.Request.Params["conSuma"];
                Config.ConSuma = Convert.ToBoolean(conSuma ?? "true");
            }
            else
            {
                Config = new Config();
            }

            SetParameters(controllerContext, bindingContext);

            return Config;
        }

        virtual protected void SetParameters(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            
        }
    }

}