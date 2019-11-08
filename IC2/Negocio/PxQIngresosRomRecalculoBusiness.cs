using IC2.Comun;
using IC2.Models;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace IC2.Negocio
{
    public class PxQIngresosRomRecalculoBusiness : Business
    {

        public PxQIngresosRomRecalculoBusiness(Repository repos) : base(repos)
        {
        }

        public async Task<object> ConsultarAsync(object filter, Config config, Paginador paginador, IParams extraParams)
        {

            using (UnitOfWork uow = UnitOfWork.Create()) {

                string periodo = (extraParams as IPeriodo).Periodo.ToString("yyyy-MM-dd");

                await Repos.InsertAsync("spPXQIngresosRecalculoInsert", uow, new SqlParameter { ParameterName = "@periodo", Value = periodo });
                uow.Commit();
            }

            return await ConsultaXFiltroAsync(filter, config, paginador, extraParams);
        }

    }
}