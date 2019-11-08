/*Nombre:Data Ingreso
*Creado por:
*Fecha:
*Descripcion: Data Ingreso Controller
*Ultima Fecha de modificación: 7/14/2019
* Ivan Adrian Rios Sandoval
*/
using IC2.Helpers;
using IC2.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class DataIngresoController : Controller
    {
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

        public JsonResult LlenaGrid(DateTime periodo, string trafico, string deudor, int start, int limit, string fecha_contable,
                                                                                                           string fecha_proceso,
                                                                                                           string Month,
                                                                                                           string Movimiento,
                                                                                                           string Currency,
                                                                                                           string Servicio,
                                                                                                           string grupo,
                                                                                                           string Operador,
                                                                                                           string DeudorCol,
                                                                                                           string TraficoCol,
                                                                                                           string Segundos,
                                                                                                           string MinFact,
                                                                                                           string TarifaEXT,
                                                                                                           string Llamadas,
                                                                                                           string cantidad,
                                                                                                           string Importe_Ingreso,
                                                                                                           string no_factura_referencia,
                                                                                                           string monto_facturado)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;
            try {
                var ingresos = from ingreso in db.DataIngresoLDI
                               join Mov in db.Movimiento
                                  on ingreso.id_movimiento equals Mov.Id into gjmv
                               join moneda in db.Moneda
                                  on ingreso.id_moneda equals moneda.Id into gjmn
                               join servicio in db.Servicio
                                  on ingreso.id_servicio equals servicio.Id into gjsv
                               join grp in db.Grupo
                                  on ingreso.id_grupo equals grp.Id into gjgr
                               join operador in db.Operador
                                  on ingreso.id_operador equals operador.Id into gjop
                               join deudorDB in db.Deudor
                                  on ingreso.id_deudor equals deudorDB.Id into gjdd
                               join traficoTb in db.Trafico
                                  on ingreso.id_trafico equals traficoTb.Id into gjtf
                               from submovimiento in gjmv.DefaultIfEmpty()
                               from submoneda in gjmn.DefaultIfEmpty()
                               from subservicio in gjsv.DefaultIfEmpty()
                               from subgrupo in gjgr.DefaultIfEmpty()
                               from suboperador in gjop.DefaultIfEmpty()
                               from subdeudor in gjdd.DefaultIfEmpty()
                               from subtrafico in gjtf.DefaultIfEmpty()
                               where                                
                                   DbFiltro.Date(ingreso.fecha_contable, fecha_contable, "dma")
                                && DbFiltro.Date(ingreso.fecha_proceso, fecha_proceso, "dma")
                                && DbFiltro.Date(ingreso.mes, Month, "am")
                                && DbFiltro.String(submovimiento.Tipo_Movimiento, Movimiento)
                                && DbFiltro.String(submoneda.Moneda1, Currency)
                                && DbFiltro.String(subservicio.Servicio1, Servicio)
                                && DbFiltro.String(subgrupo.Grupo1, grupo)
                                && DbFiltro.String(suboperador.Nombre, Operador)
                                && DbFiltro.String(subdeudor.Deudor1, DeudorCol)
                                && DbFiltro.String(subtrafico.Id_TraficoTR, TraficoCol)
                                && DbFiltro.String(ingreso.no_factura_referencia, no_factura_referencia)
                                && DbFiltro.Decimal(ingreso.segundos, Segundos)
                                && DbFiltro.Decimal(ingreso.min_fact, MinFact)
                                && DbFiltro.Decimal(ingreso.tarifa_ext, TarifaEXT)
                                && DbFiltro.Decimal(ingreso.llamadas, Llamadas)
                                && DbFiltro.Decimal(ingreso.cantidad, cantidad)
                                && DbFiltro.Decimal(ingreso.importe_ingreso, Importe_Ingreso)
                                && DbFiltro.Decimal(ingreso.monto_facturado, monto_facturado)
                                
                               select new
                               {
                                   ingreso.id,
                                   ingreso.mes,
                                   ingreso.id_moneda,
                                   ingreso.id_servicio,
                                   ingreso.id_grupo,
                                   Moneda1 = submoneda.Moneda1 ?? String.Empty,
                                   ingreso.id_movimiento,
                                   Tipo_Movimiento = submovimiento.Tipo_Movimiento ?? String.Empty,
                                   Servicio1 = subservicio.Servicio1 ?? String.Empty,
                                   Grupo1 = subgrupo.Grupo1 ?? String.Empty,
                                   ingreso.id_operador,
                                   Nombre = suboperador.Nombre ?? String.Empty,
                                   Id_TraficoTR = subtrafico.Id_TraficoTR ?? String.Empty,
                                   ingreso.id_trafico,
                                   ingreso.segundos,
                                   ingreso.llamadas,
                                   ingreso.importe_ingreso,
                                   ingreso.tarifa_ext,
                                   Deudor1 = subdeudor.Deudor1 ?? String.Empty,
                                   ingreso.min_fact,
                                   ingreso.cantidad,
                                   ingreso.fecha_contable,
                                   ingreso.fecha_proceso,
                                   ingreso.no_factura_referencia,
                                   ingreso.monto_facturado,
                                   ingreso.iva,
                                   ingreso.sobrecargo
                               };

                if (!string.IsNullOrEmpty(trafico) && !string.IsNullOrEmpty(deudor)) {
                    ingresos = ingresos.Where(i => i.Id_TraficoTR == trafico && i.Deudor1 == deudor);
                } else if (!string.IsNullOrEmpty(trafico)) {
                    ingresos = ingresos.Where(i => i.Id_TraficoTR == trafico);
                } else if (!string.IsNullOrEmpty(deudor)) {
                    ingresos = ingresos.Where(i => i.Deudor1 == deudor);
                }
                foreach (var elemento in ingresos) {
                    lista.Add(new
                    {
                        Id = elemento.id,
                        Month = elemento.mes.Value.Year + " " + meses[elemento.mes.Value.Month],
                        Currency = elemento.Moneda1,
                        Servicio = elemento.Servicio1,
                        grupo = elemento.Grupo1,
                        Operador = elemento.Nombre,
                        Trafico = elemento.Id_TraficoTR,
                        Segundos = elemento.segundos,
                        Llamadas = elemento.llamadas,
                        Importe_Ingreso = elemento.importe_ingreso,
                        TarifaEXT = elemento.tarifa_ext,
                        Deudor = elemento.Deudor1,
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
                respuesta = new { succes = true,
                                  results = lista,
                                  start = start,
                                  limit = limit,
                                  total = total };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #region Combos
        public JsonResult llenaPeriodo(int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try {
                var periodo = db.DataIngresoLDI.Select(data => data.fecha_contable).Distinct().ToList();
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

            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaTrafico(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var trafico = (from oTrafico in db.Trafico
                               join oDataIngreso in db.DataIngresoLDI on oTrafico.Id equals oDataIngreso.id_trafico
                               where oTrafico.Id_LineaNegocio == lineaNegocio
                               && oTrafico.Activo == 1
                               select new
                               {
                                   oTrafico.Id_TraficoTR,
                               }).Distinct();

                foreach (var elemento in trafico) {
                    lista.Add(new
                    {
                        id_trafico = elemento.Id_TraficoTR,
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenaDeudor(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total = 0;
            List<object> lista = new List<object>();
            try {
                List<object> listaDeudor = new List<object>();
                var deudor = (from oDeudor in db.Deudor
                              join odataingreso in db.DataIngresoLDI on oDeudor.Id equals odataingreso.id_deudor
                              where oDeudor.Activo == 1 && oDeudor.Id_LineaNegocio == lineaNegocio
                              select new
                              {
                                  oDeudor.Deudor1,
                                  oDeudor.NombreDeudor
                              }).Distinct();

                foreach (var elemento in deudor) {
                    listaDeudor.Add(new
                    {

                        clave = elemento.Deudor1,
                        nombre = elemento.NombreDeudor
                    });
                }
                respuesta = new { success = true, results = listaDeudor, total = total };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult ModificarDIngreso(int lineaNegocio, int Id, DateTime mes, int movimiento, int moneda, string servicio, int grupo, string operador, string deudor, string trafico, decimal segundos, decimal min_fact, decimal tarifa_ext, decimal tarifa_final, decimal cantidad, decimal importe_ingreso, string no_factura, decimal monto_fact, decimal prov_nc, decimal ajuste, decimal nc_emitida, decimal saldo_prov, string motivo_ajuste, string periodo_ajuste, DateTime fecha_ajuste, string responsable_ajuste, string sociedad_sap, string sociedad, string nombre_empresa)
        {
            object respuesta = null;

            string noEncontrados = "";


            bool valido = false;

            try {
                Movimiento oMovimiento = db.Movimiento.Where(x => x.Id == movimiento && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Moneda oMoneda = db.Moneda.Where(x => x.Id == moneda && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Servicio oServicio = db.Servicio.Where(x => x.Id_Servicio == servicio && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Grupo oGrupo = db.Grupo.Where(x => x.Id == grupo && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Operador oOperador = db.Operador.Where(x => x.Id_Operador == operador && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Deudor oDeudor = db.Deudor.Where(x => x.Deudor1 == deudor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Trafico oTrafico = db.Trafico.Where(x => x.Id_TraficoTR == trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                DataIngresoLDI oDI = db.DataIngresoLDI.Where(a => a.id == Id).SingleOrDefault();

                if (oMovimiento == null)
                    noEncontrados = noEncontrados + "Sociedad " + sociedad + ",";
                if (oMoneda == null)
                    noEncontrados = noEncontrados + "Tráfico: " + trafico + ",";
                if (oServicio == null)
                    noEncontrados = noEncontrados + "Servico: " + servicio + ",";
                if (oGrupo == null)
                    noEncontrados = noEncontrados + "Grupo: " + grupo + ",";
                if (oOperador == null)
                    noEncontrados = noEncontrados + "Sociedad " + operador + ",";
                if (oDeudor == null)
                    noEncontrados = noEncontrados + "Tráfico: " + deudor + ",";

                if (oMovimiento != null && oTrafico != null && oServicio != null && oMoneda != null && oGrupo != null && oOperador != null && oDeudor != null && valido == true) {
                    oDI.mes = mes;
                    oDI.id_moneda = oMoneda.Id;
                    oDI.id_servicio = oServicio.Id;
                    oDI.id_grupo = oGrupo.Id;
                    oDI.id_operador = oOperador.Id;
                    oDI.id_trafico = oTrafico.Id;
                    oDI.segundos = segundos;
                    //oDI.llamadas = llamadas;
                    oDI.importe_ingreso = importe_ingreso;
                    oDI.tarifa_ext = tarifa_ext;
                    oDI.id_deudor = oDeudor.Id;
                    oDI.min_fact = min_fact;
                    oDI.cantidad = cantidad;
                    oDI.no_factura_referencia = no_factura;
                    oDI.monto_facturado = monto_fact;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oDI, "id", oDI.id, "DataIngresoLDI.html", Request.UserHostAddress);

                    db.SaveChanges();

                    respuesta = new { success = true, results = "ok" };

                }

                respuesta = new { success = true, results = "" };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}