using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using IC2.Models;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace IC2.Controllers
{
    public class PeriodosAnterioresROMController : Controller
    {
        readonly ICPruebaEntities db;
        readonly IDictionary<int, string> meses;

        public PeriodosAnterioresROMController()
        {
            db = new ICPruebaEntities();
            meses = new Dictionary<int, string>() {
                {1, "ENERO"}, {2, "FEBRERO"}, {3, "MARZO"}, {4, "ABRIL"},
                {5, "MAYO"}, {6, "JUNIO"}, {7, "JULIO"}, {8, "AGOSTO"},
                {9, "SEPTIEMBRE"}, {10, "OCTUBRE"}, {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
            };
        }

        #region Vistas

        void CrearViewBag()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
        }

        public ActionResult Index()
        {
            CrearViewBag();
            return View(ViewBag);
        }

        public ActionResult Costo()
        {
            CrearViewBag();
            return View(ViewBag);
        }

        public ActionResult Ingreso()
        {
            CrearViewBag();
            return View(ViewBag);
        }

        #endregion

        #region Llenar Periodos

        [HttpGet]
        public JsonResult LlenaPeriodoCosto(int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                var datos = db.uvw_PeriodosAnterioresPeriodoCosto.Distinct();

                foreach (var elemento in datos.Where(d => d.Periodo.HasValue))
                {
                    var per = elemento.Periodo.Value;
                    lista.Add(new
                    {
                        Id = per.ToString("MM/yyyy"),
                        Periodo = per.Year + "-" + per.Month + "-" + per.Day,
                        Fecha = per.Year + " " + meses[per.Month]
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LlenaPeriodoIngreso(int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                var datos = db.uvw_PeriodosAnterioresPeriodoIngreso.Distinct();

                foreach (var elemento in datos.Where(d => d.Periodo.HasValue))
                {
                    var per = elemento.Periodo.Value;
                    lista.Add(new
                    {
                        Id = per.ToString("MM/yyyy"),
                        Periodo = per.Year + "-" + per.Month + "-" + per.Day,
                        Fecha = per.Year + " " + meses[per.Month]
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Llenar Grid

        [HttpGet]
        public JsonResult LlenaGridCosto(int start, int limit, string periodo, string sort, string filter)
        {
            try
            {
                var partes = new List<int?>() { null, null, null };
                if (!string.IsNullOrEmpty(periodo))
                    partes = periodo.Split('-').Select(p => int.Parse(p) as int?).ToList();

                var datos = ObtenerRegistrosPeriodo<uvw_PeriodosAnterioresCostoROM>(filter, sort);
                if (!string.IsNullOrEmpty(periodo))
                    datos.Where(d => d.PeriodoCargaMes == partes[1] && d.PeriodoCargaAnio == partes[0]);

                var results = datos.Skip(start).Take(limit).ToList();

                return new JsonResult()
                {
                    Data = new
                    {
                        results,
                        start,
                        limit,
                        total = datos.Count(),
                        succes = true
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult()
                {
                    Data = new { results = ex, success = false },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }

        [HttpGet]
        public JsonResult LlenaGridIngreso(int start, int limit, string periodo, string sort, string filter)
        {
            try
            {
                var partes = new List<int?>() { null, null, null };
                if (!string.IsNullOrEmpty(periodo))
                    partes = periodo.Split('-').Select(p => int.Parse(p) as int?).ToList();

                var datos = ObtenerRegistrosPeriodo<uvw_PeriodosAnterioresIngresoROM>(filter, sort);
                if (!string.IsNullOrEmpty(periodo))
                    datos.Where(d => d.PeriodoCargaMes == partes[1] && d.PeriodoCargaAnio == partes[0]);

                var results = datos.Skip(start).Take(limit).ToList();

                return new JsonResult()
                {
                    Data = new
                    {
                        results,
                        start,
                        limit,
                        total = datos.Count(),
                        succes = true
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult()
                {
                    Data = new { results = ex, success = false },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }

        #endregion

        #region Exportar a Excel

        [HttpPost]
        public ActionResult ExportarReporteCosto(string periodo)
        {
            var partes = new List<int?>() { null, null, null };
            if (!string.IsNullOrEmpty(periodo))
                partes = periodo.Split('-').Select(p => int.Parse(p) as int?).ToList();

            using (var package = new ExcelPackage())
            {
                try
                {
                    // Hoja de trabajo
                    var wSheet = package.Workbook.Worksheets.Add("Reporte");

                    // Datos
                    var datos = ObtenerRegistrosPeriodo<uvw_PeriodosAnterioresCostoROM>();
                    datos.Where(d => d.PeriodoCargaMes == partes[1] && d.PeriodoCargaAnio == partes[0]);

                    // Encabezado
                    wSheet.Cells[1, 1].Value = "BANDERA CONCEPTO";
                    wSheet.Cells[1, 2].Value = "TIPO";
                    wSheet.Cells[1, 3].Value = "OPERADOR";
                    wSheet.Cells[1, 4].Value = "ACREEDOR";
                    wSheet.Cells[1, 5].Value = "PERIODO";
                    wSheet.Cells[1, 6].Value = "IMPORTE";
                    wSheet.Cells[1, 7].Value = "MONEDA";
                    wSheet.Cells[1, 8].Value = "CONCEPTO";
                    wSheet.Cells[1, 9].Value = "FOLIO DOCUMENTO";
                    wSheet.Cells[1, 10].Value = "TIPO DE CAMBIO";
                    wSheet.Cells[1, 11].Value = "IMPORTE (MXN)";
                    wSheet.Cells[1, 12].Value = "GRUPO";

                    // Llenado de filas
                    var renglon = 2;
                    foreach (var registro in datos)
                    {
                        wSheet.Cells[renglon, 1].Value = registro.BanderaConcepto;
                        wSheet.Cells[renglon, 2].Value = registro.Tipo;
                        wSheet.Cells[renglon, 3].Value = registro.Operador;
                        wSheet.Cells[renglon, 4].Value = registro.Acreedor;
                        wSheet.Cells[renglon, 5].Value = registro.Periodo;
                        wSheet.Cells[renglon, 6].Value = registro.Importe;
                        wSheet.Cells[renglon, 7].Value = registro.Moneda;
                        wSheet.Cells[renglon, 8].Value = registro.Concepto;
                        wSheet.Cells[renglon, 9].Value = registro.FolioDocumento;
                        wSheet.Cells[renglon, 10].Value = registro.TipoCambio;
                        wSheet.Cells[renglon, 11].Value = registro.ImporteMXN;
                        wSheet.Cells[renglon, 12].Value = registro.Grupo;
                        renglon++;
                    }

                    // Formato de datos
                    wSheet.Column(5).Style.Numberformat.Format = "dd/MM/yyyy";
                    wSheet.Column(6).Style.Numberformat.Format = "#,##0.00_-";
                    wSheet.Column(10).Style.Numberformat.Format = "#,##0.0000_-";
                    wSheet.Column(11).Style.Numberformat.Format = "$ #,##0.00_-";

                    // Formato de vista
                    wSheet.Row(1).Style.Font.Bold = true;
                    wSheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
                    wSheet.Row(1).Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#B4C6E7"));
                    wSheet.SelectedRange[1, 1, 1, 12].AutoFilter = true;
                    for (var x = 1; x < 13; x++)
                        wSheet.Column(x).AutoFit();
                    wSheet.View.FreezePanes(2, 1);

                    // Registro de cambos en la hoja de trabajo
                    var stream = new MemoryStream();
                    package.SaveAs(stream);
                    stream.Flush();
                    stream.Position = 0;
                    var bytesFile = new byte[stream.Length];
                    stream.Read(bytesFile, 0, (int)stream.Length);

                    // Envío de respuesta
                    return Json(new
                    {
                        responseText = string.Format("Costos Periodos Anteriores ROM - {0} {1}.xlsx", meses[partes[1].Value], partes[0].Value),
                        Success = true,
                        bytes = bytesFile
                    }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    Response.Clear();
                    Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    Response.TrySkipIisCustomErrors = true;
                    return new JsonResult()
                    {
                        Data = new
                        {
                            ex.Message,
                            Success = false
                        },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
            }
        }

        [HttpPost]
        public ActionResult ExportarReporteIngreso(string periodo)
        {
            var partes = new List<int?>() { null, null, null };
            if (!string.IsNullOrEmpty(periodo))
                partes = periodo.Split('-').Select(p => int.Parse(p) as int?).ToList();

            using (var package = new ExcelPackage())
            {
                try
                {
                    // Hoja de trabajo
                    var wSheet = package.Workbook.Worksheets.Add("Reporte");

                    // Datos
                    var datos = ObtenerRegistrosPeriodo<uvw_PeriodosAnterioresIngresoROM>();
                    datos.Where(d => d.PeriodoCargaMes == partes[1] && d.PeriodoCargaAnio == partes[0]);

                    // Encabezado
                    wSheet.Cells[1, 1].Value = "BANDERA CONCEPTO";
                    wSheet.Cells[1, 2].Value = "TIPO";
                    wSheet.Cells[1, 3].Value = "OPERADOR";
                    wSheet.Cells[1, 4].Value = "DEUDOR";
                    wSheet.Cells[1, 5].Value = "PERIODO";
                    wSheet.Cells[1, 6].Value = "IMPORTE";
                    wSheet.Cells[1, 7].Value = "MONEDA";
                    wSheet.Cells[1, 8].Value = "CONCEPTO";
                    wSheet.Cells[1, 9].Value = "FOLIO DOCUMENTO";
                    wSheet.Cells[1, 10].Value = "TIPO DE CAMBIO";
                    wSheet.Cells[1, 11].Value = "IMPORTE (MXN)";
                    wSheet.Cells[1, 12].Value = "GRUPO";

                    // Llenado de filas
                    var renglon = 2;
                    foreach (var registro in datos)
                    {
                        wSheet.Cells[renglon, 1].Value = registro.BanderaConcepto;
                        wSheet.Cells[renglon, 2].Value = registro.Tipo;
                        wSheet.Cells[renglon, 3].Value = registro.Operador;
                        wSheet.Cells[renglon, 4].Value = registro.Deudor;
                        wSheet.Cells[renglon, 5].Value = registro.Periodo;
                        wSheet.Cells[renglon, 6].Value = registro.Importe;
                        wSheet.Cells[renglon, 7].Value = registro.Moneda;
                        wSheet.Cells[renglon, 8].Value = registro.Concepto;
                        wSheet.Cells[renglon, 9].Value = registro.FolioDocumento;
                        wSheet.Cells[renglon, 10].Value = registro.TipoCambio;
                        wSheet.Cells[renglon, 11].Value = registro.ImporteMXN;
                        wSheet.Cells[renglon, 12].Value = registro.Grupo;
                        renglon++;
                    }

                    // Formato de datos
                    wSheet.Column(5).Style.Numberformat.Format = "dd/MM/yyyy";
                    wSheet.Column(6).Style.Numberformat.Format = "#,##0.00_-";
                    wSheet.Column(10).Style.Numberformat.Format = "#,##0.0000_-";
                    wSheet.Column(11).Style.Numberformat.Format = "#,##0.00_-";

                    // Formato de vista
                    wSheet.Row(1).Style.Font.Bold = true;
                    wSheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
                    wSheet.Row(1).Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#B4C6E7"));
                    wSheet.SelectedRange[1, 1, 1, 12].AutoFilter = true;
                    for (var x = 1; x < 13; x++)
                        wSheet.Column(x).AutoFit();
                    wSheet.View.FreezePanes(2, 1);

                    // Registro de cambos en la hoja de trabajo
                    var stream = new MemoryStream();
                    package.SaveAs(stream);
                    stream.Flush();
                    stream.Position = 0;
                    var bytesFile = new byte[stream.Length];
                    stream.Read(bytesFile, 0, (int)stream.Length);

                    // Envío de respuesta
                    return Json(new
                    {
                        responseText = string.Format("Ingresos Periodos Anteriores ROM - {0} {1}.xlsx", meses[partes[1].Value], partes[0].Value),
                        Success = true,
                        bytes = bytesFile
                    }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    Response.Clear();
                    Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    Response.TrySkipIisCustomErrors = true;
                    return new JsonResult()
                    {
                        Data = new
                        {
                            ex.Message,
                            Success = false
                        },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
            }
        }

        #endregion

        #region Obtener Registros

        IEnumerable<T> ObtenerRegistrosPeriodo<T>(string filtro = null, string sort = null) where T : class
        {
            var mapaValores = !string.IsNullOrEmpty(filtro) && filtro != "{}" ?
                (Dictionary<string, object>)new JavaScriptSerializer().Deserialize<object>(filtro) :
                new Dictionary<string, object>();

            var mapaSort = new Dictionary<string, object>();
            var listaSort = (!string.IsNullOrEmpty(sort) && sort != "[{}]" ?
                ((object[])new JavaScriptSerializer().Deserialize<object>(sort)).Cast<Dictionary<string, object>>().ToList() :
                new List<Dictionary<string, object>>());
            if (listaSort.Count > 0)
                listaSort.ForEach(l => mapaSort.Add(l["property"].ToString(), l["direction"]));

            var propiedades = typeof(T).GetProperties().Where(p => p.CanWrite && p.CanWrite);

            var respuesta = db.Set<T>() as IQueryable<T>;
            foreach (var campo in mapaValores.Keys.Where(k => propiedades.Select(p => p.Name).Contains(k)))
            {
                respuesta = respuesta.FilterByValue(campo, mapaValores[campo]);
            }
            foreach (var campo in mapaSort.Keys.Where(k => propiedades.Select(p => p.Name).Contains(k)))
            {
                respuesta = mapaSort[campo].ToString() == "DESC" ?
                    respuesta.OrderByPropertyDescending(campo) :
                    respuesta.OrderByProperty(campo);
            }
            return respuesta;
        }

        #endregion
    }
}

internal static class EntityExtension
{
    #region Campos

    static Type[] decimals = new Type[] { typeof(decimal), typeof(decimal?) };
    static Type[] doubles = new Type[] { typeof(double), typeof(double?) };
    static Type[] datetimes = new Type[] { typeof(DateTime), typeof(DateTime?) };
    static Type[] bytes = new Type[] { typeof(byte), typeof(byte?) };
    static Type[] ints = new Type[] { typeof(int), typeof(int?) };
    static Type[] longs = new Type[] { typeof(long), typeof(long?) };
    static Type[] bools = new Type[] { typeof(bool), typeof(bool?) };

    #endregion

    #region Lambdas

    internal static IQueryable<T> FilterByValue<T>(this IQueryable<T> obj, string propertyName, object propertyValue) where T : class
    {
        if (propertyValue != null)
        {
            LambdaExpression expression;
            if (typeof(string).Equals(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionString<T>(propertyValue.ToString());
            else if (bytes.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionByte<T>(propertyValue.ToString());
            else if (ints.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionInt<T>(propertyValue.ToString());
            else if (longs.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionLong<T>(propertyValue.ToString());
            else if (decimals.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionDecimal<T>(propertyValue.ToString());
            else if (doubles.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionDouble<T>(propertyValue.ToString());
            else if (bools.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionBool<T>(propertyValue as bool? ?? false);
            else if (datetimes.Contains(typeof(T).GetProperty(propertyName).PropertyType))
                expression = ExpressionDateTime<T>(propertyValue.ToString());
            else
                expression = ExpressionObject<T>(propertyValue);

            var newSelector = Expression.Property(expression.Parameters[0], propertyName);

            var body = expression.Body.Replace(expression.Parameters[1], newSelector);
            var lambda = Expression.Lambda<Func<T, bool>>(body, expression.Parameters[0]);

            return obj.Where(lambda);
        }
        else
            return obj;
    }

    internal static IOrderedQueryable<T> OrderByProperty<T>(this IQueryable<T> source, string propertyName)
    {
        if (typeof(string).Equals(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaString<T>(propertyName));
        else if (bytes.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaByte<T>(propertyName));
        else if (ints.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaInt<T>(propertyName));
        else if (longs.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaLong<T>(propertyName));
        else if (decimals.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaDecimal<T>(propertyName));
        else if (doubles.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaDouble<T>(propertyName));
        else if (datetimes.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaDate<T>(propertyName));
        else if (bools.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderBy(ToLambdaBool<T>(propertyName));
        else
            return source.OrderBy(ToLambda<T>(propertyName));
    }

    internal static IOrderedQueryable<T> OrderByPropertyDescending<T>(this IQueryable<T> source, string propertyName)
    {
        if (typeof(string).Equals(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaString<T>(propertyName));
        else if (bytes.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaByte<T>(propertyName));
        else if (ints.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaInt<T>(propertyName));
        else if (longs.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaLong<T>(propertyName));
        else if (decimals.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaDecimal<T>(propertyName));
        else if (doubles.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaDouble<T>(propertyName));
        else if (datetimes.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaDate<T>(propertyName));
        else if (bools.Contains(typeof(T).GetProperty(propertyName).PropertyType))
            return source.OrderByDescending(ToLambdaBool<T>(propertyName));
        else
            return source.OrderByDescending(ToLambda<T>(propertyName));
    }

    #endregion

    #region Expressions

    static Expression<Func<T, object, bool>> ExpressionObject<T>(object propertyValue) where T : class
    {
        return (ex, value) =>
            value.Equals(propertyValue);
    }

    static Expression<Func<T, string, bool>> ExpressionString<T>(string propertyValue) where T : class
    {
        return (ex, value) =>
            (SqlFunctions.PatIndex("%" + propertyValue + "%", value) ?? 0) > 0;
    }

    static Expression<Func<T, byte?, bool>> ExpressionByte<T>(string propertyValue) where T : class
    {
        byte response = 0;
        if (byte.TryParse(propertyValue, out response))
            return (ex, value) =>
                Math.Abs(value ?? 0) == response ||
                Math.Abs(value ?? 0) == response * 10;
        else
            return (ex, value) =>
                false;
    }

    static Expression<Func<T, int?, bool>> ExpressionInt<T>(string propertyValue) where T : class
    {
        int response = 0;
        if (int.TryParse(propertyValue, out response))
            return (ex, value) =>
                Math.Abs(value ?? 0) == response ||
                Math.Abs(value ?? 0) == response * 10 ||
                Math.Abs(value ?? 0) == response * 100 ||
                Math.Abs(value ?? 0) == response * 1000 ||
                Math.Abs(value ?? 0) == response * 10000 ||
                Math.Abs(value ?? 0) == response * 100000 ||
                Math.Abs(value ?? 0) == response * 1000000;
        else
            return (ex, value) =>
                false;
    }

    static Expression<Func<T, long?, bool>> ExpressionLong<T>(string propertyValue) where T : class
    {
        long response = 0;
        if (long.TryParse(propertyValue, out response))
            return (ex, value) =>
                Math.Abs(value ?? 0) == response ||
                Math.Abs(value ?? 0) == response * 10 ||
                Math.Abs(value ?? 0) == response * 100 ||
                Math.Abs(value ?? 0) == response * 1000 ||
                Math.Abs(value ?? 0) == response * 10000 ||
                Math.Abs(value ?? 0) == response * 100000 ||
                Math.Abs(value ?? 0) == response * 1000000;
        else
            return (ex, value) =>
                false;
    }

    static Expression<Func<T, decimal?, bool>> ExpressionDecimal<T>(string propertyValue) where T : class
    {
        decimal response = 0;
        if (decimal.TryParse(propertyValue, out response))
            return (ex, value) =>
                Math.Truncate(Math.Abs(value ?? 0)) == response ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 10 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 100 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 1000 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 10000 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 100000 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 1000000;
        else
            return (ex, value) =>
                false;
    }

    static Expression<Func<T, double?, bool>> ExpressionDouble<T>(string propertyValue) where T : class
    {
        double response = 0;
        if (double.TryParse(propertyValue, out response))
            return (ex, value) =>
                Math.Truncate(Math.Abs(value ?? 0)) == response ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 10 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 100 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 1000 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 10000 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 100000 ||
                Math.Truncate(Math.Abs(value ?? 0)) == response * 1000000;
        else
            return (ex, value) =>
                false;
    }

    static Expression<Func<T, bool?, bool>> ExpressionBool<T>(bool propertyValue) where T : class
    {
        return (ex, value) =>
            value.HasValue && value == propertyValue;
    }

    static Expression<Func<T, DateTime?, bool>> ExpressionDateTime<T>(string propertyValue) where T : class
    {
        Expression<Func<T, DateTime?, bool>> result = null;
        var partes = propertyValue.Split('/');
        int dia;
        int mes;
        int año;
        if (partes.Count() == 1)
        {
            if (partes[0].Length == 4)
            {
                if (int.TryParse(partes[0], out año))
                    result = (ex, value) =>
                        (SqlFunctions.DatePart("yyyy", value) ?? 0) == año;
            }
            else if (partes[0].Length == 2)
            {
                if (int.TryParse(partes[0], out dia))
                    result = (ex, value) =>
                        (SqlFunctions.DatePart("dd", value) ?? 0) == dia ||
                        (SqlFunctions.DatePart("mm", value) ?? 0) == dia ||
                        ((SqlFunctions.DatePart("yyyy", value) ?? 0) + 2000) == dia;
            }
        }
        if (partes.Count() == 2)
        {
            if (partes[1].Length == 4)
            {
                var mesBien = int.TryParse(partes[0], out mes);
                var añoBien = int.TryParse(partes[1], out año);
                if (mesBien && añoBien)
                    result = (ex, value) =>
                        (SqlFunctions.DatePart("mm", value) ?? 0) == mes &&
                        (SqlFunctions.DatePart("yyyy", value) ?? 0) == año;
                else
                {
                    if (mesBien)
                        result = (ex, value) =>
                            (SqlFunctions.DatePart("mm", value) ?? 0) == mes;
                    if (añoBien)
                        result = (ex, value) =>
                            (SqlFunctions.DatePart("yyyy", value) ?? 0) == año;
                }
            }
            else if (partes[1].Length == 2)
            {
                var diaBien = int.TryParse(partes[0], out dia);
                var mesBien = int.TryParse(partes[1], out mes);
                if (diaBien && mesBien)
                    result = (ex, value) =>
                        ((SqlFunctions.DatePart("dd", value) ?? 0) == dia &&
                         (SqlFunctions.DatePart("mm", value) ?? 0) == mes) ||
                        ((SqlFunctions.DatePart("mm", value) ?? 0) == dia &&
                         ((SqlFunctions.DatePart("yyyy", value) ?? 0) + 2000) == mes);
            }
        }
        if (partes.Count() == 3)
        {
            if (partes[2].Length == 4)
            {
                var diaBien = int.TryParse(partes[0], out dia);
                var mesBien = int.TryParse(partes[1], out mes);
                var añoBien = int.TryParse(partes[2], out año);
                if (diaBien && mesBien && añoBien)
                    result = (ex, value) =>
                        (SqlFunctions.DatePart("mm", value) ?? 0) == dia &&
                        (SqlFunctions.DatePart("mm", value) ?? 0) == mes &&
                        (SqlFunctions.DatePart("yyyy", value) ?? 0) == año;
                else
                {
                    if (diaBien && mesBien)
                        result = (ex, value) =>
                        (SqlFunctions.DatePart("mm", value) ?? 0) == dia &&
                        (SqlFunctions.DatePart("mm", value) ?? 0) == mes;
                    if (mesBien && añoBien)
                        result = (ex, value) =>
                        (SqlFunctions.DatePart("mm", value) ?? 0) == mes &&
                        (SqlFunctions.DatePart("yyyy", value) ?? 0) == año;
                }
            }
            else if (partes[2].Length == 2)
            {
                var date = DateTime.Today;
                if (DateTime.TryParse(propertyValue, out date))
                    result = (ex, value) =>
                        Math.Abs(SqlFunctions.DateDiff("dd", value, date) ?? 0) < 1;
                else
                {
                    var diaBien = int.TryParse(partes[0], out dia);
                    var mesBien = int.TryParse(partes[1], out mes);
                    var añoBien = int.TryParse(partes[2], out año);
                    if (diaBien && mesBien)
                        result = (ex, value) =>
                            (SqlFunctions.DatePart("mm", value) ?? 0) == dia &&
                            (SqlFunctions.DatePart("mm", value) ?? 0) == mes &&
                            ((SqlFunctions.DatePart("yyyy", value) ?? 0) + 2000) == año;
                    else
                    {
                        if (diaBien && mesBien)
                            result = (ex, value) =>
                            (SqlFunctions.DatePart("mm", value) ?? 0) == dia &&
                            (SqlFunctions.DatePart("mm", value) ?? 0) == mes;
                        if (mesBien && añoBien)
                            result = (ex, value) =>
                            (SqlFunctions.DatePart("mm", value) ?? 0) == mes &&
                            ((SqlFunctions.DatePart("yyyy", value) ?? 0) + 2000) == año;
                    }
                }
            }
        }
        if (result != null)
            return result;
        else
            return (ex, value) =>
                false;
    }

    #endregion

    #region ToLambda

    static Expression<Func<T, object>> ToLambda<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(object));

        return Expression.Lambda<Func<T, object>>(propAsObject, parameter);
    }

    static Expression<Func<T, string>> ToLambdaString<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(string));

        return Expression.Lambda<Func<T, string>>(propAsObject, parameter);
    }

    static Expression<Func<T, byte?>> ToLambdaByte<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(byte?));

        return Expression.Lambda<Func<T, byte?>>(propAsObject, parameter);
    }

    static Expression<Func<T, int?>> ToLambdaInt<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(int?));

        return Expression.Lambda<Func<T, int?>>(propAsObject, parameter);
    }

    static Expression<Func<T, long?>> ToLambdaLong<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(long?));

        return Expression.Lambda<Func<T, long?>>(propAsObject, parameter);
    }

    static Expression<Func<T, bool?>> ToLambdaBool<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(bool?));

        return Expression.Lambda<Func<T, bool?>>(propAsObject, parameter);
    }

    static Expression<Func<T, decimal?>> ToLambdaDecimal<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(decimal?));

        return Expression.Lambda<Func<T, decimal?>>(propAsObject, parameter);
    }

    static Expression<Func<T, double?>> ToLambdaDouble<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(double?));

        return Expression.Lambda<Func<T, double?>>(propAsObject, parameter);
    }

    static Expression<Func<T, DateTime?>> ToLambdaDate<T>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T));
        var property = Expression.Property(parameter, propertyName);
        var propAsObject = Expression.Convert(property, typeof(DateTime?));

        return Expression.Lambda<Func<T, DateTime?>>(propAsObject, parameter);
    }

    #endregion

    static Expression Replace(this Expression expression, Expression searchEx, Expression replaceEx)
    {
        return new ReplaceVisitor(searchEx, replaceEx).Visit(expression);
    }
}

internal class ReplaceVisitor : ExpressionVisitor
{
    readonly Expression from;
    readonly Expression to;

    internal ReplaceVisitor(Expression from, Expression to)
    {
        this.from = from;
        this.to = to;
    }

    public override Expression Visit(Expression node)
    {
        return node == from ? to : base.Visit(node);
    }
}