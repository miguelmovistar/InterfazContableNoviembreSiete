using IC2.Models;
using System;
using System.Collections.Generic;

namespace IC2.Comun
{
    internal class BinderModelMetodos {

        virtual public object CrearObjeto(string typeId, IReadOnlyDictionary<string,Metadata> MetadataEntities, bool EsExtraParam=false)
        {
            if (typeId == null)
                return null;

            string[] typeIdSplit = typeId.Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries);
            if (typeIdSplit == null || typeIdSplit.Length == 0 || !MetadataEntities.ContainsKey(typeIdSplit[0]))
                return null;

            Metadata meta = MetadataEntities[typeIdSplit[0]];

            if(!EsExtraParam)
                return Activator.CreateInstance(meta.EntityType);
            else
                return Activator.CreateInstance(meta.ExtraParamType);
        }

    }

}