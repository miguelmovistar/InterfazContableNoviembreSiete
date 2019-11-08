using IC2.Models;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Web.Mvc;

namespace IC2.Comun
{

    public abstract class FilterModelBinder : DefaultModelBinder {
        abstract public IReadOnlyDictionary<string, Metadata> MetadataEntities { get; }

        BinderModelMetodos metodos = new BinderModelMetodos();

        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            object obj = null;
            PropertyInfo[] properties = null;
            obj = metodos.CrearObjeto(controllerContext.HttpContext.Request.Params["elementType"], MetadataEntities);
            if (obj == null)
                return null;

            properties = obj.GetType().GetProperties();

            foreach (var property in properties)
            {
                var name = property.Name;

                if (controllerContext.HttpContext.Request.Params[name] != null && !String.IsNullOrWhiteSpace(controllerContext.HttpContext.Request.Params[name]))
                {
                    var value = controllerContext.HttpContext.Request.Params[name];
                    try
                    {
                        if (property.PropertyType == typeof(DateTime))
                        {
                            if (DateTime.TryParseExact(value, "MM-dd-yyyy", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.AssumeLocal, out DateTime data))
                                property.SetValue(obj, data);
                        }
                        else
                            if (property.PropertyType.FullName.ToLowerInvariant().Contains("decimal"))
                        {
                            decimal data = Convert.ToDecimal(value);
                            property.SetValue(obj, data);
                        }
                        else
                            if (property.PropertyType.FullName.ToLowerInvariant().Contains("int"))
                        {
                            int data = Convert.ToInt32(value);
                            property.SetValue(obj, data);
                        }
                        else
                        {
                            property.SetValue(obj, value);
                        }

                    }
                    catch
                    {
                    }
                }

            }
            return obj;
        }
    }

}