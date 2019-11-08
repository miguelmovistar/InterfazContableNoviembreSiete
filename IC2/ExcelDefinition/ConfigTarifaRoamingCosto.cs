using IC2.Comun;
using IC2.Models.DataAccess;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IC2.ExcelDefinition
{
    public class ConfigPxQIngresoRecalculo : IConfigBase
    {

        public async Task<IList<object>> Consulta(object filtro, Config config, IParams periodo)
        {

            IList<object> elementos = null;
            var rcc = new PxQIngresosRomRecalculoRepository();
            IList<object> elements = await rcc.ConsultarAsync(config, null, periodo);
            elementos = elements;
            return elementos;

        }

    }
}