using IC2.Comun;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace IC2.Models.DataAccess
{
    public class GridRepository : Repository {

        protected readonly IReadOnlyDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"}, {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"}, {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"}, {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        public virtual async Task InsertAsync(string typeId, DateTime periodo, UnitOfWork uow)
        {

            try
            {
                await InsertAsync(typeId, uow, new SqlParameter("@periodo", periodo.ToString("yyyy-MM-dd")));
            }
            catch (Exception)
            {

            }

        }

        public virtual async Task<IList<object>> ConsultarAsync(string typeId, DateTime periodo)
        {

            try
            {
                var entidadMetadato = Entidades[typeId];
                var result = await _ConsultarAsync(entidadMetadato.SelectSentence, entidadMetadato.EntityType, new SqlParameter("@periodo", periodo));

                if (result != null && result.Count > 0)
                {
                    var sumsElement = Activator.CreateInstance(Entidades[typeId].EntityType);

                    foreach (var property in result[0].GetType().GetProperties())
                    {
                        if (property.PropertyType == typeof(decimal?))
                        {
                            property.SetValue(sumsElement, result.Sum(a => (decimal?)property.GetValue(a)));
                        }
                    }

                    result.Add(sumsElement);
                    return result;
                }
            }
            catch
            {

            }
            return null;
        }

        public virtual async Task<bool> RealizarCalculosAsync(DateTime periodo) {
            throw new NotImplementedException();
        }

        public virtual async Task<List<object>> ObtenerPeriodos() {
            throw new NotImplementedException();
        }
    }
}