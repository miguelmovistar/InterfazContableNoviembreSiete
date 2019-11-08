using IC2.Models;
using IC2.Models.ViewModel;
using System.Collections.Generic;

namespace IC2.Comun
{

    public class FilterModelBinderCosCieRom : FilterModelBinder
    {
        override public IReadOnlyDictionary<string, Metadata> MetadataEntities => DTOMetadata.RoamingCierreCostosMetadata;
    }
}