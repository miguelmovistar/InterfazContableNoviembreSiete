using IC2.Comun;
using IC2.Models;
using IC2.Models.DataAccess;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IC2.Negocio
{

    public class GridBusiness : Business {

        private readonly GridRepository repos;
        private readonly ExportarGridRoaming  exp = new ExportarGridRoaming();

        protected override Exportar Exp => exp;
        protected override Repository Repos => repos;

        public GridBusiness(GridRepository repos) : base(repos)
        {
            this.repos = repos;
        }

        public async Task<bool> RealizarCalculos(DateTime periodoFecha)
        {
            return await repos.RealizarCalculosAsync(periodoFecha);
        }

        public async Task<List<object>> ObtenerPeriodos()
        {
            return await repos.ObtenerPeriodos();
        }

    }

}