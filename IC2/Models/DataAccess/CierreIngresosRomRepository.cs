using IC2.Comun;
using IC2.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace IC2.Models.DataAccess
{

    internal class CierreIngresosRomRepository: GridRepository
    {

        override protected IReadOnlyDictionary<string, Metadata> Entidades => DTOMetadata.RoamingCierreIngresoMetadata;

        protected override void GetExtraParams(Config config, Dictionary<string, object> extraParams, object obj, IParams extraParam)
        {

            switch (config.ElementType)
            {
                case "IngRomCieFacturacionTrafico": extraParams.Add("tipo", 1); break;
                case "IngRomCieNcTarifa": extraParams.Add("tipo", 2); break;
                case "IngRomCieFacturaTarifa": extraParams.Add("tipo", 4); break;
                case "IngRomCieNcTrafico": extraParams.Add("tipo", 5); break;
            }

        }

        public override async Task<IList<object>> ConsultarWithSumsXFiltroAsync(Config config, object parametro, IParams extraParam)
        {
            if (parametro.GetType().GetProperty("Periodo") != null && (extraParam as IPeriodo).Periodo != default(DateTime))
            {
                parametro.GetType().GetProperty("Periodo").SetValue(parametro, (extraParam as IPeriodo).Periodo);
            }

            if (Entidades[config.ElementType].DbType == "dbo.IngRomCieFacturaTraficoNCSelectType")
            {
                PropertyInfo propiedad = parametro.GetType().GetProperty("FechaFactura");
                propiedad.SetValue(parametro, (extraParam as IPeriodo).Periodo);
            }

           return await base.ConsultarWithSumsXFiltroAsync(config, parametro, extraParam);
         }

        public override async Task<List<object>> ObtenerPeriodos()
        {
            List<object> periodos = new List<object>();

            try
            {
                var elements = (await _ConsultarAsync("getListFechas", typeof(DateTime?), null)).Cast<DateTime?>().ToList();

                foreach (var el in elements)
                {
                    //var fecha = el.Key??default;
                    var fecha = el ?? default(DateTime);
                    var fechaTemp = fecha.AddMonths(1);
                    var fechaMostrar = new DateTime(fechaTemp.Year, fechaTemp.Month, DateTime.DaysInMonth(fechaTemp.Year, fechaTemp.Month));
                    periodos.Add(new { Id = 1, Periodo = fecha.ToString("MM-dd-yyyy"), Fecha = meses[fechaMostrar.Month] + " " + fechaMostrar.Year });
                }

                return periodos;

            }
            catch (Exception)
            {
                throw;
            }

        }

        public override async Task<bool> RealizarCalculosAsync(DateTime periodo)
        {
            try
            {
                using (var uow = UnitOfWork.Create())
                {
                    await InsertAsync("spIngCierRomInsert", periodo, uow);
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