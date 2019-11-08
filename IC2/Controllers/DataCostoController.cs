/*Nombre:Data Costo
*Creado por:
*Fecha:
*Descripcion: Data Costo Controller
*Ultima Fecha de modificación: 7/11/2019
* Ivan Adrian Rios Sandoval
*/
using IC2.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class DataCostoController : Controller
    {
        // GET: DataCosto
        ICPruebaEntities db = new ICPruebaEntities();
        readonly IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult LlenaGrid(DateTime periodo, string trafico, string cmbacreedor, int start, int limit, string Acreedor,
                                                                                                                string Currency,
                                                                                                                string Importe_Costo,
                                                                                                                string Llamadas,
                                                                                                                string MinFact,
                                                                                                                string Month,
                                                                                                                string Movimiento,
                                                                                                                string Operador,
                                                                                                                string Segundos,
                                                                                                                string Servicio,
                                                                                                                string TarifaEXT,
                                                                                                                string TraficoCol,
                                                                                                                string cantidad,
                                                                                                                string fecha_contable,
                                                                                                                string fecha_proceso,
                                                                                                                string grupo,
                                                                                                                string monto_facturado,
                                                                                                                string no_factura_referencia,
                                                                                                                string sobrecargo)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;
            try
            {
                var costos = from costo in db.DataCostoLDI
                             join mov in db.Movimiento
                                on costo.id_movimiento equals mov.Id into gjmv
                             join moneda in db.Moneda
                                on costo.id_moneda equals moneda.Id into gjmn
                             join servicio in db.Servicio
                                on costo.id_servicio equals servicio.Id into gjsv
                             join grp in db.Grupo
                                on costo.id_grupo equals grp.Id into gjgr
                             join operador in db.Operador
                                on costo.id_operador equals operador.Id into gjop
                             join acreedor in db.Acreedor
                                on costo.id_acreedor equals acreedor.Id into gjac
                             join traficoTb in db.Trafico
                                on costo.id_trafico equals traficoTb.Id into gjtf
                             from submovimiento in gjmv.DefaultIfEmpty()
                             from submoneda in gjmn.DefaultIfEmpty()
                             from subservicio in gjsv.DefaultIfEmpty()
                             from subgrupo in gjgr.DefaultIfEmpty()
                             from suboperador in gjop.DefaultIfEmpty()
                             from subacreedor in gjac.DefaultIfEmpty()
                             from subtrafico in gjtf.DefaultIfEmpty()
                             where costo.fecha_contable.Value.Year == periodo.Year
                                && costo.fecha_contable.Value.Month == periodo.Month

                             && DbFiltro.String(subacreedor.Acreedor1, Acreedor)
                             && DbFiltro.String(submoneda.Moneda1, Currency)
                             && DbFiltro.Decimal(costo.importe_costo, Importe_Costo)
                             && DbFiltro.Decimal(costo.llamadas, Llamadas)
                             && DbFiltro.Decimal(costo.min_fact, MinFact)
                             && DbFiltro.Date(costo.mes, Month, "am")
                             && DbFiltro.String(submovimiento.Tipo_Movimiento, Movimiento)
                             && DbFiltro.String(suboperador.Id_Operador, Operador)
                             && DbFiltro.Decimal(costo.segundos, Segundos)
                             && DbFiltro.String(subservicio.Servicio1, Servicio)
                             && DbFiltro.Decimal(costo.tarifa_ext, TarifaEXT)
                             && DbFiltro.String(subtrafico.Id_TraficoTR, TraficoCol)
                             && DbFiltro.Decimal(costo.cantidad, cantidad)
                             && DbFiltro.Date(costo.fecha_contable, fecha_contable, "dma")
                             && DbFiltro.Date(costo.fecha_proceso, fecha_proceso, "dma")
                             && DbFiltro.String(subgrupo.Grupo1, grupo)
                             && DbFiltro.Decimal(costo.monto_facturado, monto_facturado)
                             && DbFiltro.String(costo.no_factura_referencia, no_factura_referencia)
                             && DbFiltro.Decimal(costo.sobrecargo, sobrecargo)

                             select new
                             {
                                 costo.id,
                                 costo.mes,
                                 Moneda1 = submoneda.Moneda1 ?? String.Empty,
                                 Servicio1 = subservicio.Servicio1 ?? String.Empty,
                                 Grupo1 = subgrupo.Grupo1 ?? String.Empty,
                                 Id_Operador = suboperador.Id_Operador ?? String.Empty,
                                 Id_TraficoTR = subtrafico.Id_TraficoTR ?? String.Empty,
                                 Tipo_Movimiento = submovimiento.Tipo_Movimiento ?? String.Empty,
                                 costo.segundos,
                                 costo.llamadas,
                                 costo.importe_costo,
                                 costo.tarifa_ext,
                                 Acreedor1 = subacreedor.Acreedor1 ?? String.Empty,
                                 costo.min_fact,
                                 costo.cantidad,
                                 costo.fecha_proceso,
                                 costo.fecha_contable,
                                 costo.no_factura_referencia,
                                 costo.monto_facturado,
                                 costo.iva,
                                 costo.sobrecargo
                             };
                if (!string.IsNullOrEmpty(trafico) && !string.IsNullOrEmpty(cmbacreedor))
                {
                    costos = costos.Where(c => c.Id_TraficoTR == trafico
                                                    && c.Acreedor1 == cmbacreedor);
                }
                else if (!string.IsNullOrEmpty(trafico))
                {
                    costos = costos.Where(i => i.Id_TraficoTR == trafico);
                }
                else if (!string.IsNullOrEmpty(cmbacreedor))
                {
                    costos = costos.Where(i => i.Acreedor1 == cmbacreedor);
                }

                foreach (var elemento in costos)
                {
                    lista.Add(new
                    {
                        Id = elemento.id,
                        Month = elemento.mes.Value.Year + " " + meses[elemento.mes.Value.Month],
                        Currency = elemento.Moneda1,
                        Servicio = elemento.Servicio1,
                        grupo = elemento.Grupo1,
                        Operador = elemento.Id_Operador,
                        Trafico = elemento.Id_TraficoTR,
                        Segundos = elemento.segundos,
                        Llamadas = elemento.llamadas,
                        Importe_Costo = elemento.importe_costo,
                        TarifaEXT = elemento.tarifa_ext,
                        Acreedor = elemento.Acreedor1,
                        MinFact = elemento.min_fact,
                        elemento.cantidad,
                        Movimiento = elemento.Tipo_Movimiento,
                        fecha_contable = elemento.fecha_proceso.Value.ToString("dd-MM-yyyy"),
                        fecha_proceso = elemento.fecha_contable.Value.ToString("dd-MM-yyyy"),
                        elemento.no_factura_referencia,
                        elemento.monto_facturado,
                        elemento.iva,
                        elemento.sobrecargo
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { results = lista, start, limit, total, succes = true };


            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #region Combos
        public JsonResult llenaPeriodo(int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var periodo = db.DataCostoLDI.Select(p => p.fecha_contable).Distinct().ToList();
                periodo.ForEach(p =>
                {
                    var Fecha = DateTime.Parse(p.ToString());
                    int Mes = int.Parse(Fecha.ToString("MM"));
                    CultureInfo cultureInfo = new CultureInfo("es-MX", false);
                    DateTimeFormatInfo formatoFecha = cultureInfo.DateTimeFormat;
                    string nombreMes = formatoFecha.GetMonthName(Mes).ToUpper();
                    lista.Add(new
                    {
                        valor = Fecha.ToString("yyyy-MM-dd"),
                        periodo = $"{Fecha.ToString("yyyy")} {nombreMes}"
                    });
                });
                respuesta = new { results = lista, success = true };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaTrafico(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try
            {
                var trafico = (from oTrafico in db.Trafico
                               join oDataCosto in db.DataCostoLDI on oTrafico.Id equals oDataCosto.id_trafico
                               where oTrafico.Id_LineaNegocio == lineaNegocio
                               && oTrafico.Activo == 1
                               select new
                               {
                                   oTrafico.Id,
                                   oTrafico.Id_TraficoTR,

                               }).Distinct();

                foreach (var elemento in trafico)
                {
                    lista.Add(new
                    {
                        id_trafico = elemento.Id_TraficoTR,
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenaAcreedor(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total = 0;
            List<object> lista = new List<object>();
            try
            {
                List<object> listaAcreedor = new List<object>();
                var acreedor = (from oAcreedor in db.Acreedor
                                join odatacosto in db.DataCostoLDI on oAcreedor.Id equals odatacosto.id_acreedor
                                where oAcreedor.Activo == 1 && oAcreedor.Id_LineaNegocio == lineaNegocio

                                select new
                                {
                                    oAcreedor.Acreedor1,
                                    oAcreedor.NombreAcreedor
                                }).Distinct();
                foreach (var elemento in acreedor)
                {
                    listaAcreedor.Add(new
                    {
                        clave = elemento.Acreedor1,
                        nombre = elemento.NombreAcreedor
                    });
                }
                respuesta = new { success = true, results = listaAcreedor, total };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #endregion

    }
}

















