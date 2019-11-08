using System.Collections.Generic;
using System.Threading.Tasks;

namespace IC2.Comun
{
    public interface IConfigBase
    {
        Task<IList<object>> Consulta(object filtro, Config config, IParams periodo);
    }
}