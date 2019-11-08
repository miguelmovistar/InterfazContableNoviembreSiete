using IC2.Models;
using IC2.Models.ViewModel;
using System.Collections.Generic;

namespace IC2.Comun
{

    internal class ExcelDef
        {
            public IProxy Proxy { get; set; }

            public ExcelMetadata Metadato { get; set; }

            public ExcelDef(string consulta)
            {
                Metadato = new ExcelMetadata();
                Metadato.AgregarTabs(ObtenerTabs(consulta));
            }

            private IReadOnlyDictionary<string, Metadata> ObtenerTabs(string consulta)
            {
                IReadOnlyDictionary<string, Metadata> metadata = null;

                switch (consulta)
                {
                    case "CierreCostosROM":
                        metadata = DTOMetadata.RoamingCierreCostosMetadata;
                        break;
                    case "CierreIngresosROM":
                        metadata = DTOMetadata.RoamingCierreIngresoMetadata;
                        break;
                    case "RoamingCancelacionCosto":
                        metadata = DTOMetadata.RoamingCancelacionCostoMetadata;
                        break;
                    default:
                        break;
                }

                return metadata;
            }

 
    }
}