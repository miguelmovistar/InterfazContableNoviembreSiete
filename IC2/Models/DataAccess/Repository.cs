using IC2.Comun;
using IC2.Comun.Entities;
using IC2.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace IC2.Models
{
    public class Repository
    {
        virtual protected IReadOnlyDictionary<string, Metadata> Entidades{get;}

        protected async Task<IList<DefinitionType>> GetDefinitionTypes(string typeName) {

            return (await _ConsultarAsync("spDefinitionTypeSelect", typeof(DefinitionType), new SqlParameter[] { new SqlParameter { ParameterName = "@typeName", Value = typeName } }))
                .Cast<DefinitionType>().ToList();

        }

        virtual protected void GetExtraParams(Config typeId, Dictionary<string, object> extraParamsOut, object obj, IParams extraParam) {
            
        }

        public virtual async Task<IList<object>> ConsultarWithSumsXFiltroAsync(Config config, object parametro, IParams extraParam)
        {
            var result = await ConsultarAsync(config, parametro, extraParam);

            if (config.ConSuma && result != null && result.Count() > 0)
            {
                Type type = Entidades[config.ElementType].EntityType;
                return AgregarSumas(type, result);
            }

            return result?.ToList();
        }

        virtual protected IList<object> AgregarSumas(Type type, IList<object> result)
        {
            var sumsElement = Activator.CreateInstance(type);

            foreach (var property in result.ElementAt(0).GetType().GetProperties())
            {
                if (property.PropertyType == typeof(decimal?) || property.PropertyType == typeof(decimal))
                {
                    property.SetValue(sumsElement, result.Sum(a => (decimal?)property.GetValue(a)));
                }
            }

            var resultList = result.ToList();
            resultList.Add(sumsElement);
            return resultList;
        }

        virtual public async Task<IList<object>> ConsultarAsync(Config config, object parametro, IParams extraParam)
        {

            try
            {
                Dictionary<string, object> extraParams = new Dictionary<string, object>();

                GetExtraParams(config, extraParams, parametro, extraParam);

                var result = await ConsultarAsync(config, parametro, extraParams);

                return result;
            }
            catch
            {
                return null;
            }
        }

        virtual public async Task<IList<object>> ConsultarAsync(Config config, object parametro, IReadOnlyDictionary<string,object> extraParams)
        {

            try
            {
                
                var entidadMetadato = Entidades[config.ElementType];

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                if (entidadMetadato.DbType != null)
                {
                    DataTable table = entidadMetadato.TableCustom ?? await GenerarTablaEstructura(entidadMetadato.DbType);
                    CrearFilaTabla(table, parametro);
                    sqlParams.Add(new SqlParameter("@tabla", SqlDbType.Structured) { Value = table, TypeName = entidadMetadato.DbType });
                }

                if (extraParams != null && extraParams.Count > 0)
                    foreach (var param in extraParams)
                    {
                        sqlParams.Add(new SqlParameter("@" + param.Key, param.Value));
                    }

                var result = await _ConsultarAsync(entidadMetadato.SelectSentence, entidadMetadato.EntityType, sqlParams.ToArray());

                return result;
            }
            catch
            {
                return null;
            }
        }

        private async Task<DataTable> GenerarTablaEstructura(string dbType)
        {
            int pos = dbType.LastIndexOf('.');
            if (pos >= 0)
                dbType = dbType.Remove(0, pos+1);

            var columnas = await GetDefinitionTypes(dbType);

            DataTable table = new DataTable();
            foreach (var item in columnas)
            {
                table.Columns.Add(item.ColumnName);
            }
            return table;
        }

        protected DataTable GenerarTablaEstructura(Type parametro)
        {
            DataTable table = new DataTable();
            PropertyInfo[] properties = parametro.GetProperties();
            foreach (var property in properties)
            {
                table.Columns.Add(property.Name);
            }

            return table;
        }

        protected void CrearFilaTabla(DataTable estructura, object parametro)
        {
            var newRow = estructura.NewRow();
            var properties = parametro.GetType().GetProperties();

            foreach (DataColumn column in estructura.Columns)
            {
                PropertyInfo property = properties.FirstOrDefault(a=>a.Name.ToLowerInvariant() == column.ColumnName.ToLowerInvariant());
                if (property != null)
                {
                    var value = property.GetValue(parametro);
                    if (value != null)
                    {
                        if (value is DateTime)
                            newRow[property.Name] = ((DateTime)value).ToString("yyyy-MM-dd");
                        else if (value is string)
                            newRow[property.Name] = value;
                        else
                        {
                            if (value is decimal?)
                            {
                                decimal valueInt = Convert.ToDecimal(value);
                                if (valueInt != 0)
                                    newRow[property.Name] = value;
                            }
                            else
                            {
                                int valueInt = Convert.ToInt32(value);
                                if (valueInt != 0)
                                    newRow[property.Name] = value;
                            }
                        }
                    }
                }
            }

            estructura.Rows.Add(newRow);
        }

        //protected void CrearFilaTabla(DataTable estructura, object parametro)
        //{
        //    var newRow = estructura.NewRow();
        //    var properties = parametro.GetType().GetProperties();

        //    foreach (var property in properties)
        //    {
        //        var value = property.GetValue(parametro);
        //        if (value != null)
        //        {
        //            if (value is DateTime)
        //                newRow[property.Name] = ((DateTime)value).ToString("MM/dd/yyyy");
        //            else if (value is string)
        //                newRow[property.Name] = value;
        //            else
        //            {
        //                if (value is decimal?)
        //                {
        //                    decimal valueInt = Convert.ToDecimal(value);
        //                    if (valueInt != 0)
        //                        newRow[property.Name] = value;
        //                }
        //                else
        //                {
        //                    int valueInt = Convert.ToInt32(value);
        //                    if (valueInt != 0)
        //                        newRow[property.Name] = value;
        //                }
        //            }
        //        }
        //    }

        //    estructura.Rows.Add(newRow);
        //}

        protected async Task<IList<object>> _ConsultarAsync(string storeName, Type entityType, params SqlParameter[] parametros)
        {
            try
            {
                using (var db = new ICPruebaEntities())
                {
                    
                    string sentencia = "exec " + storeName + " ";
                    if(parametros != null && parametros.Count() > 0)
                        foreach (var item in parametros)
                        {
                            sentencia += item.ParameterName + ",";
                        }

                    sentencia = sentencia.Substring(0, sentencia.Length - 1);
                    System.Data.Entity.Infrastructure.DbRawSqlQuery result = null;
                    if (parametros != null && parametros.Count() > 0)
                        result = db.Database.SqlQuery(entityType, sentencia, parametros);
                    else
                        result = db.Database.SqlQuery(entityType, sentencia);

                    IList<object> result1 = await result.ToListAsync();

                    return result1;
                }
            }
            catch
            {
                return null;
            }
        }

        public async Task InsertAsync(string storeName, UnitOfWork uow, params SqlParameter[] parametros)
        {
            var uow1 = uow ?? UnitOfWork.Create();
            try
            {
                var param = new SqlParameter
                {
                    ParameterName = "@result",
                    SqlDbType = SqlDbType.Int,
                    Direction = ParameterDirection.Output
                };

                var sentencia = "exec @result=" + storeName + " ";
                foreach (var paramIter in parametros)
                {
                    sentencia += paramIter.ParameterName + ",";
                }
                sentencia = sentencia.Substring(0, sentencia.Length - 1);
                List<SqlParameter> parametrosSql = new List<SqlParameter>(parametros);
                parametrosSql.Insert(0, param);
                await uow1.DB.Database.ExecuteSqlCommandAsync(sentencia, parametrosSql.ToArray());

                var result1 = (int)param.Value;

                if (uow == null)
                    uow1.Commit();
            }
            catch (Exception)
            {
                if (uow == null)
                    uow1.Dispose();
            }

        }

        public async Task<IEnumerable<T>> GetAllAsync<T>() where T : class
        {
            using (ICPruebaEntities db = new ICPruebaEntities())
            {
                return await db.Set<T>().ToListAsync();
            }
        }

        public async Task<IEnumerable<T>> GetFilterAsync<T>(Expression<Func<T,bool>> filter) where T : class
        {
            using (ICPruebaEntities db = new ICPruebaEntities())
            {
                return await db.Set<T>().Where(filter).ToListAsync();
            }
        }
    }
}