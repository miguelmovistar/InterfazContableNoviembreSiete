using IC2.Models.DataAccess;
using IC2.Negocio;

namespace IC2.Comun
{
    public static class ConfiguracionFactory
    {
        public static Business ObtenerConfiguracion(string consulta)
        {
            Business repo = null;

            switch (consulta)
            {
                case "CierreCostosROM":
                    repo = new Business(new CierreCostosRomRepository(), new ExportarGridRoaming());
                    break;
                case "CierreIngresosROM":
                    repo = new Business(new CierreIngresosRomRepository(), new ExportarGridRoaming());
                    break;
                case "RoamingCancelacionCosto":
                    repo = new Business(new RoamingCancelacionCostoRepository());
                    break;
                case "PXQIngresosROMRecalculo":
                    repo = new PxQIngresosRomRecalculoBusiness(new PxQIngresosRomRecalculoRepository());
                    break;
            }

            return repo;
        }


    }
}