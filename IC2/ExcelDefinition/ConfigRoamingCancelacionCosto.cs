using IC2.Comun;
using IC2.Models.DataAccess;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IC2.ExcelDefinition
{
    public class ConfigRoamingCancelacionCosto : IConfigBase
    {

        public async Task<IList<object>> Consulta(object filtro, Config config, IParams periodo)
        {

            IList<object> elementos = null;
            var rcc = new RoamingCancelacionCostoRepository();
            elementos = await rcc.ConsultarAsync(config, filtro, periodo);
            return elementos;

        }

    }
}