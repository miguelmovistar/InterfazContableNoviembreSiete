using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;
using System.Globalization;
using IC2.Servicios;

namespace IC2.Controllers
{
    public class DatosMVNOController : Controller
    {
        // GET: DatosMVNO
        ICPruebaEntities db = new ICPruebaEntities();
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult Consulta(DateTime Periodo, int start, int limit)
        {
            object respuesta = null;
            int total = 0;

            try {
                List<object> lista = new List<object>();
                var datos = from oDatos in db.DatosTraficoMVNO
                            where oDatos.fecha_contable == Periodo
                            select new
                            {
                                oDatos.Collection,
                                oDatos.HOperator,
                                oDatos.Operator,
                                oDatos.ReferenceCode,
                                oDatos.TransDate,
                                oDatos.Eventos,
                                oDatos.IdColleccionServicioRegion,
                                oDatos.Service,
                                oDatos.Real,
                                oDatos.Duration,
                                oDatos.Monto,
                                oDatos.PrecioUnitario,
                                oDatos.Moneda,
                                oDatos.Module
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Collection = elemento.Collection,
                        HOperator = elemento.HOperator,
                        Operator = elemento.Operator,
                        ReferenceCode = elemento.ReferenceCode,
                        TransDate = elemento.TransDate.Value.ToString("dd-MM-yyyy"),
                        Eventos = elemento.Eventos,
                        IdColleccionServicioRegion = elemento.IdColleccionServicioRegion,
                        Service = elemento.Service,
                        Real = elemento.Real,
                        Duration = elemento.Duration,
                        Monto = elemento.Monto,
                        PrecioUnitario = elemento.PrecioUnitario,
                        Moneda = elemento.Moneda,
                        Module = elemento.Module
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };

            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Exportar(DateTime Periodo)
        {
            var nombreArchivo = "TraficoMVNO_" + Periodo.ToString("yyyy MMMM", new CultureInfo("es-ES")).ToUpper() + ".xlsx";
            var listas = new Dictionary<string, List<object>>();
            var excel = new Excel();
            byte[] bytesFile = new byte[0];
            object respuesta = null;

            try {
                // Datos
                List<object> lista = new List<object>();
                var datos = from oDatos in db.DatosTraficoMVNO
                            where oDatos.fecha_contable == Periodo
                            select new
                            {
                                oDatos.Collection,
                                oDatos.HOperator,
                                oDatos.Operator,
                                oDatos.ReferenceCode,
                                oDatos.TransDate,
                                oDatos.Eventos,
                                oDatos.IdColleccionServicioRegion,
                                oDatos.Service,
                                oDatos.Real,
                                oDatos.Duration,
                                oDatos.Monto,
                                oDatos.PrecioUnitario,
                                oDatos.Moneda,
                                oDatos.Module
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Collection = elemento.Collection,
                        HOperator = elemento.HOperator,
                        Operator = elemento.Operator,
                        ReferenceCode = elemento.ReferenceCode,
                        TransDate = elemento.TransDate.Value.ToString("dd-MM-yyyy"),
                        Eventos = elemento.Eventos,
                        IdColleccionServicioRegion = elemento.IdColleccionServicioRegion,
                        Service = elemento.Service,
                        Real = elemento.Real,
                        Duration = elemento.Duration,
                        Monto = elemento.Monto,
                        PrecioUnitario = elemento.PrecioUnitario,
                        Moneda = elemento.Moneda,
                        Module = elemento.Module
                    });
                }
                listas.Add("Tráfico MVNO", lista);

                bytesFile = excel.GenerarArchivo(listas);

                respuesta = new
                {
                    responseText = nombreArchivo,
                    Success = true,
                    bytes = bytesFile
                };
            } catch (Exception ex) {
                respuesta = new
                {
                    results = ex.Message,
                    success = false
                };
            }
            var jsonResult = Json(respuesta, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        #region Combos
        public JsonResult llenaFecha(int lineaNegocio)
        {
            //int total;
            List<object> lista = new List<object>();
            object respuesta = null;
            try {
                var fechas = from oFecha in db.CargaDocumento

                             where oFecha.Id_LineaNegocio == lineaNegocio

                             && oFecha.EstatusCarga == "CC"
                             orderby oFecha.Periodo
                             select new
                             {
                                 oFecha.Id,
                                 oFecha.Periodo
                             };
                foreach (var elemento in fechas) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        fecha = DateTime.ParseExact(elemento.Periodo, "yyyy/MM", null).ToString("yyyy-MM-dd"),
                        Periodo = DateTime.ParseExact(elemento.Periodo, "yyyy/MM", null).ToString("yyyy MMMM", new CultureInfo("es-ES")).ToUpper()
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}