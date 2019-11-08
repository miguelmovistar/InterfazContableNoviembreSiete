using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace IC2.Models
{
    internal class ModelQuery
    {
        readonly private Dictionary<string, Metadata> entidades = new Dictionary<string, Metadata> {
            { typeof(CosRomCieProvTar).Name, new Metadata{ EntityType= typeof(CosRomCieProvTarView), InsertSentence= "psCosRomCieProvTarXPeriodoInsert", SelectSentence="spCosRomCieProvTarSelect" } },
            { typeof(CosRomCieAjNcMesAnterior).Name, new Metadata{ EntityType= typeof(CosRomCieAjNcMesAnteriorView), InsertSentence= "spCosRomCieAjNcMesAnteriorPeriodoInsert", SelectSentence="spCosRomCieAjNcMesAnteriorPeriodoSelect" } },
            { typeof(CosRomCieBaseDatos).Name, new Metadata{ EntityType= typeof(CosRomCieBaseDatosView), InsertSentence= "spCosRomCieBaseDatosInsert", SelectSentence="spCosRomCieBaseDatosSelect" } },
            { typeof(CosRomCieProvTarAcumMesesAnte).Name, new Metadata{ EntityType= typeof(CosRomCieProvTarAcumMesesAnte), InsertSentence= "spCosRomCieProvTarAcumMesesAnteInsert", SelectSentence="spCosRomCieProvTarAcumMesesAnteSelect" } },
            { typeof(CosRomCieTraficoPorMes).Name, new Metadata{ EntityType= typeof(CosRomCieTraficoPorMes), InsertSentence= "spCosRomCieTraficoPorMesInsert", SelectSentence="spCosRomCieTraficoPorMesSelect" } }

        };

        public async Task<List<object>> _ConsultarAsync(string typeId, params SqlParameter[] parametros)
        {
            try
            {
                using (var db = new ICPruebaEntities())
                {
                    Metadata metadata = entidades[typeId];
                    string sentencia = "exec " + metadata.SelectSentence+" ";
                    foreach (var item in parametros)
                    {
                        sentencia += item.ParameterName+",";
                    }

                    sentencia = sentencia.Substring(0, sentencia.Length - 1);
                    var result = db.Database.SqlQuery(metadata.EntityType, sentencia, parametros);

                    List<object> result1 = await result.ToListAsync();

                    return result1;
                }
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<object>> ConsultarAsync(string typeId, DateTime periodo)
        {

            try
            {
                return await _ConsultarAsync(typeId, new SqlParameter("@periodo", periodo));
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<object>> ConsultaAsync(string typeId, DateTime periodo, int tipo) {

            try
            {
                return await _ConsultarAsync(typeId, new SqlParameter("@periodo", periodo), new SqlParameter("@tipo", tipo));
            }
            catch
            {
                return null;
            }
        }

        public async Task GenerarAsync(string typeId, DateTime periodo)
        {
            try
            {
                using (var db = new ICPruebaEntities())
                {
                    var param = new SqlParameter
                    {
                        ParameterName = "@result",
                        SqlDbType = SqlDbType.Int,
                        Direction = ParameterDirection.Output
                    };
                    var metadata = entidades[typeId];
                    await db.Database.ExecuteSqlCommandAsync("exec @result=" + metadata.InsertSentence + " @periodo",
                        param,
                        new SqlParameter("@periodo", SqlDbType.Date) { Value = periodo });

                    var result1 = (int)param.Value;

                }
            }
            catch (Exception)
            {
            }

        }

    }
}