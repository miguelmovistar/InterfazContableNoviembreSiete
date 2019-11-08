using IC2.Models;
using IC2.Models.ViewModel;
using System.Collections.Generic;

namespace IC2.Comun
{
    public class FilterModelBinderIngCieRom : FilterModelBinder {
        public override IReadOnlyDictionary<string, Metadata> MetadataEntities => DTOMetadata.RoamingCierreIngresoMetadata;
    }

}