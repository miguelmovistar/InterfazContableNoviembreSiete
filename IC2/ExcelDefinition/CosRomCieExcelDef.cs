using IC2.Comun;
using IC2.Models.ViewModel;

namespace IC2.ExcelDefinition
{
    internal class CosRomCieExcelDef: IExcelDef
    {
        public IProxy Proxy { get; set; }

        public  CosRomCieExcelDef() {
            
            Metadato.AgregarTabs(DTOMetadata.RoamingCierreCostosMetadata);

        }

        public ExcelMetadata Metadato { get; set; }

    }
}