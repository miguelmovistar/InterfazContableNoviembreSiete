using IC2.Comun;
using IC2.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace IC2.Models.DataAccess
{
    internal class CierreCostosRomRepository : GridRepository
    {
        override protected IReadOnlyDictionary<string, Metadata> Entidades => DTOMetadata.RoamingCierreCostosMetadata;

        protected override void GetExtraParams(Config config, Dictionary<string, object> extraParamsOut, object obj, IParams extraParam)
        {
            switch (config.ElementType)
            {
                case "CosRomCieFacturacionTrafico": extraParamsOut["tipo"] = 1; break;
                case "CosRomCieNCTarifa": extraParamsOut["tipo"] = 2; break;
                case "CosRomCieFacturacionCostosRecurrentes": extraParamsOut["tipo"] = 3; break;
                case "CosRomCieFacturaTarifa": extraParamsOut["tipo"] = 4; break;
                case "CosRomCieNCTrafico": extraParamsOut["tipo"] = 5; break;
            }

            if (config.ElementType == "CosRomCieCosto") {
                extraParamsOut["EsCostoRecurrente"] =  (extraParam as ICostos).EsCostoRecurrente;
            }
        }

        public override async Task<IList<object>> ConsultarWithSumsXFiltroAsync(Config config, object parametro, IParams extraParam) {

            if (parametro.GetType().GetProperty("Periodo") != null && (extraParam as IPeriodo).Periodo != default(DateTime))
            {
                parametro.GetType().GetProperty("Periodo").SetValue(parametro, (extraParam as IPeriodo).Periodo);
            }

            if (Entidades[config.ElementType].DbType == "CosRomCieFacturaTraficoNCSelectType")
            {
                PropertyInfo propiedad = parametro.GetType().GetProperty("FechaContable");
                propiedad.SetValue(parametro, (extraParam as IPeriodo).Periodo);
            }

            return await base.ConsultarWithSumsXFiltroAsync(config, parametro, extraParam);
        }

        public override async Task<List<object>> ObtenerPeriodos()
        {
            List<object> periodos = new List<object>();

            var elements = await GetAllAsync<datosTraficoTAPINA>();

            foreach (DateTime fecha in elements.Select(a => a.settlementDate != null ? a.settlementDate.Value : default(DateTime)).Distinct())
            {
                var fechaMostrar = fecha.AddMonths(1);
                periodos.Add(new { Id = 1, Periodo = fecha.ToString("MM-dd-yyyy"), Fecha = meses[fechaMostrar.Month] + " " + fechaMostrar.Year });
            }

            return periodos;
        }

        public override async Task<bool> RealizarCalculosAsync(DateTime periodo)
        {
            try
            {
                using (var uow = UnitOfWork.Create())
                {
                    //await InsertAsync("CosRomCieAjNcMesAnterior", periodo, uow);
                    //await InsertAsync("CosRomCieProvTar", periodo, uow);
                    //await InsertAsync("CosRomCieCostosRecurrentes", periodo, uow);
                    //await InsertAsync("CosRomCieTraficoPorMes", periodo, uow);
                    //await InsertAsync("CosRomCieDevengoAcumulado", periodo, uow);
                    //await InsertAsync("CosRomCieBaseDatos", periodo, uow);
                    //await InsertAsync("CosRomCieProvTarAcumMesesAnte", periodo, uow);
                    //await InsertAsync("CosRomCieFacturaTarifa", periodo, uow);
                    //await InsertAsync("CosRomCieFacturacionCostosRecurrentes", periodo, uow);
                    //await InsertAsync("CosRomCieNCTrafico", periodo, uow);
                    //await InsertAsync("CosRomCieFacturacionTrafico", periodo, uow);
                    //await InsertAsync("CosRomCieNCTarifa", periodo, uow);
                    //await InsertAsync("CosRomCieCosto", periodo, uow);
                    //await InsertAsync("CosRomCieSabana", periodo, uow);
                    //await InsertAsync("CosRomCieTC", periodo, uow);

                    await InsertAsync("spCosRomCieInsert", periodo, uow);

                    uow.Commit();
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}