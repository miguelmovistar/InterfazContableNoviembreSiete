using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.IO;
using System.Transactions;
using OfficeOpenXml;
using System.Drawing;
using OfficeOpenXml.Style;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CierreIngresosLDIController : Controller
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
        // GET: CierreIngresosLDI
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from periodos in db.cierreIngresosLDI
                            where periodos.lineaNegocio == lineaNegocio                           
                            group periodos by periodos.periodo into g
                            orderby g.Key ascending
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };

                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGrid(DateTime periodo, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;
            try {
                var query = from ingresos in db.cierreIngresosLDI
                            where ingresos.periodo.Month == periodo.Month &&
                            ingresos.periodo.Year == periodo.Year &&
                            ingresos.lineaNegocio == 2
                            select new
                            {
                                ingresos.Id,
                                ingresos.periodo,
                                ingresos.moneda,
                                ingresos.operador,
                                ingresos.trafico,
                                ingresos.minuto,
                                ingresos.tarifa,
                                ingresos.USD,
                                ingresos.MXN,
                                ingresos.tipoCambio
                            };
                foreach (var elemento in query) {
                    lista.Add(new
                    {
                        elemento.Id,
                        periodo = elemento.periodo.Year + " " + meses[elemento.periodo.Month],
                        elemento.moneda,
                        elemento.operador,
                        elemento.trafico,
                        elemento.minuto,
                        elemento.tarifa,
                        elemento.USD,
                        elemento.MXN,
                        elemento.tipoCambio
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { results = lista, start, limit, total, success = true };

            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        
        /* EXPORTAR REPORTE SE GENERA EN EL CONTROLADOR CIERRECOSTOSLDI */
    }
}