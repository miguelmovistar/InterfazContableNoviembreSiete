using IC2.Comun;
using IC2.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IC2.Negocio
{
    public class Business
    {
        virtual protected Repository Repos { get; set; }
        virtual protected Exportar Exp { get; set; }

        public Business(Repository repos) {
            Repos = repos;
        }

        public Business(Repository repos, Exportar exportar)
        {
            Repos = repos;
            Exp = exportar;
        }

        public async Task<object> ConsultaXFiltroAsync(object filtro, Config config, Paginador paginador, IParams extraParam)
        {
            object result = null;

            if ((extraParam as IPeriodo).Periodo != null)
            {
                IList<object> elements = await Repos.ConsultarWithSumsXFiltroAsync(config, filtro, extraParam);

                int total = 0;
                if (elements != null && elements.Count() > 0)
                {
                    total = elements.Count();
                    var sumsElement = elements.Last();
                    elements = elements.Skip(paginador.Start).Take(paginador.Limit).ToList();
                    if (paginador.Limit < total)
                        elements.Add(sumsElement);
                }

                result = new { success = true, results = elements??new List<object>(), total };
            }
            else
                result = new { success = true, results = new object[] { }, total = 0 };

            return result;
        }

        public async Task<IList<object>> ConsultaAsync(object filtro, Config config, IParams extraParam)
        {
            IList<object> elements;
            elements = await Repos.ConsultarWithSumsXFiltroAsync(config, filtro, extraParam);
            return elements;
        }


        public async Task<object> Exportar(IParams parametros, string consulta) {

            object respuesta = await Exp.ExportarExcel(parametros, consulta, ConsultaAsync);
            return respuesta;
        }
    }

}