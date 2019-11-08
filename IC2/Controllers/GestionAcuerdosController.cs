using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class GestionAcuerdosController : Controller
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
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult LlenaPeriodo()
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try {
                var datosI = from periodos in db.DataIngresoLDI
                             group periodos by periodos.fecha_contable into g
                             orderby g.Key ascending
                             select new
                             {
                                 Id = g.Key,
                                 Periodo = g.Key
                             };
                var datosC = from periodos in db.DataIngresoLDI
                             group periodos by periodos.fecha_contable into g
                             orderby g.Key ascending
                             select new
                             {
                                 Id = g.Key,
                                 Periodo = g.Key
                             };
                var datos = datosI.Union(datosC).Distinct();
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.Periodo.Value.Year + "-" + elemento.Periodo.Value.Month + "-" + elemento.Periodo.Value.Day,
                        Fecha = elemento.Periodo.Value.Year + " " + meses[elemento.Periodo.Value.Month]
                    });
                }

                respuesta = new { success = true, results = lista };
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
            List<DateTime?> lmes = new List<DateTime?>();
            decimal totalUSDPolizas = 0, totalUSDAcuerdos = 0, totalVarMinutos = 0, totalVarMonto = 0;
            int total = 0;
            try {
                var datos = db.sp_GestionAcuerdos_Select(periodo);

                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.periodo,
                        Sentido = elemento.sentido,
                        Operador = elemento.operador,
                        Trafico = elemento.trafico,
                        MinutosPolizas = elemento.minutosPoliza,
                        TarifaPolizas = elemento.tarifaPoliza,
                        USDPolizas = elemento.USDPoliza,
                        MinutosAcuerdos = elemento.minutosAcuerdo,
                        TarifaAcuerdos = elemento.tarifaAcuerdo,
                        USDAcuerdos = elemento.USDAcuerdo,
                        elemento.VariacionMinutos,
                        elemento.VariacionMonto
                    });
                    lmes.Add(elemento.mes);
                    totalUSDPolizas += (elemento.USDPoliza == null ? 0 : Convert.ToDecimal(elemento.USDPoliza));
                    totalUSDAcuerdos += (elemento.USDAcuerdo == null ? 0 : Convert.ToDecimal(elemento.USDAcuerdo));
                    totalVarMinutos += (elemento.VariacionMinutos == null ? 0 : Convert.ToDecimal(elemento.VariacionMinutos));
                    totalVarMonto += (elemento.VariacionMonto == null ? 0 : Convert.ToDecimal(elemento.VariacionMonto));
                }

                Boolean cambio = false;
                if (lmes.Count > 0) {
                    lmes = lmes.Distinct().ToList();
                    cambio = BuscaCambioAcuerdo(lmes[0]);
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { results = lista, start, limit, total, cambio, success = true };

            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public bool BuscaCambioAcuerdo(DateTime? mes)
        {
            var dataAcuerdo = from acuerdo in db.AcuerdoTarifa
                              where acuerdo.fecha_modificacion != null && mes >= acuerdo.FechaInicio && mes <= acuerdo.FechaFin
                              select new
                              {
                                  Id = acuerdo.IdAcuerdo
                              };

            if (dataAcuerdo.Count() > 0) {
                return true;
            }
            return false;
        }

        public JsonResult Recalcular(DateTime periodo)
        {
            object respuesta = null;

            try {
                db.sp_RecalculoGA_Insert(periodo);
                // CIERRES
                db.sp_provisionCosto(periodo, "CIERRE", "GACierreCostosLDI");
                db.sp_provisionSMS(periodo, "CIERRE", "GACierreSMSLDI");
                //// PXQ
                db.sp_provisionIngreso(periodo, "PXQ", "GAPXQIngresosLDI");
                db.sp_provisionCosto(periodo, "PXQ", "GAPXQCostosLDI");
                db.sp_provisionSMS(periodo, "PXQ", "GAPXQSMSLDI");
                //// Fluctuaciones
                db.sp_FluctuacionesLDI_Insert(periodo, "GAFluctuacionIngresoLDI");
                db.sp_FluctuacionesLDI_Insert(periodo, "GAFluctuacionCostoLDI");
                //// Devengo
                db.sp_DevengoLDI_Insert(periodo, "GADevengoIngreso");
                db.sp_DevengoLDI_Insert(periodo, "GADevengoCosto");

                respuesta = new { success = true, results = true };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EnvioPF(DateTime periodo)
        {
            object respuesta = null;
            try {
                var datos = db.sp_GestionAcuerdos_Select(periodo);
                var parametro = db.parametrosCargaDocumento.Where(x => x.activo == 1 && x.idDocumento == "LDIPF").SingleOrDefault();
                var path = @"" + parametro.pathURL;
                var nombreArchivo = parametro.nombreArchivo.Replace("YYYYMMDD", periodo.ToString("yyyyMMdd"));
                if (!Directory.Exists(path)) {
                    Directory.CreateDirectory(path);
                }
                var fullpath = path + nombreArchivo;

                using (var sw = new StreamWriter(fullpath)) {
                    sw.WriteLine("CONSUMO\tGRUPO\tOPERADOR\tTRAFICO\tIVA\tCURRENCY\tUNIT_COST_USED\tCANTIDAD\tCALLS\tAMOUNT");

                    foreach (var elemento in datos) {

                        sw.WriteLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}",
                            elemento.mes.Value.ToString("yyyyMM"),
                            elemento.Grupo,
                            elemento.operador,
                            elemento.trafico,
                            0,
                            elemento.Moneda,
                            (elemento.tarifaAcuerdo == null) ? Convert.ToDouble(elemento.tarifaPoliza) : Convert.ToDouble(elemento.tarifaAcuerdo),
                            (elemento.minutosAcuerdo == null) ? Convert.ToDouble(elemento.minutosPoliza) : Convert.ToDouble(elemento.minutosAcuerdo),
                            elemento.llamadas,
                            (elemento.USDAcuerdo == null) ? Convert.ToDouble(elemento.USDPoliza) : Convert.ToDouble(elemento.USDAcuerdo)
                            ));
                    }
                    sw.Close();
                }
                respuesta = new { success = true, results = true };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ExportarReporte(DateTime periodo)
        {
            string nombreArchivo = "Gestión Acuerdos LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/GestionAcuerdos_LDI.xlsx");
            object respuesta = null;
            List<DEGestionAcuerdos> lista = new List<DEGestionAcuerdos>();
            int fila = 5;
            decimal totalUSDPolizas = 0, totalUSDAcuerdos = 0, totalVarMinutos = 0, totalVarMonto = 0;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {

                    ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["Gestión de acuerdos"];

                    var datos = db.sp_GestionAcuerdos_Select(periodo);

                    foreach (var elemento in datos) {
                        lista.Add(new DEGestionAcuerdos
                        {
                            Id = elemento.Id,
                            Periodo = elemento.periodo,
                            Sentido = elemento.sentido,
                            Operador = elemento.operador,
                            Trafico = elemento.trafico,
                            MinutosPolizas = elemento.minutosPoliza,
                            TarifaPolizas = elemento.tarifaPoliza,
                            USDPolizas = elemento.USDPoliza,
                            MinutosAcuerdos = elemento.minutosAcuerdo,
                            TarifaAcuerdos = elemento.tarifaAcuerdo,
                            USDAcuerdos = elemento.USDAcuerdo,
                            VariacionMinutos = elemento.VariacionMinutos,
                            VariacionMonto = elemento.VariacionMonto
                        });
                        totalUSDPolizas += (elemento.USDPoliza == null ? 0 : Convert.ToDecimal(elemento.USDPoliza));
                        totalUSDAcuerdos += (elemento.USDAcuerdo == null ? 0 : Convert.ToDecimal(elemento.USDAcuerdo));
                        totalVarMinutos += (elemento.VariacionMinutos == null ? 0 : Convert.ToDecimal(elemento.VariacionMinutos));
                        totalVarMonto += (elemento.VariacionMonto == null ? 0 : Convert.ToDecimal(elemento.VariacionMonto));
                    }

                    worksheet.Cells["A2"].Value = meses[periodo.Month] + " " + periodo.Year;

                    worksheet.Cells["H1"].Style.Numberformat.Format = "_-$* #,##0.0000_-";

                    foreach (DEGestionAcuerdos row in lista) {

                        worksheet.Cells[("A" + fila)].Value = row.Sentido;
                        worksheet.Cells[("B" + fila)].Value = row.Operador;
                        worksheet.Cells[("C" + fila)].Value = row.Trafico;

                        worksheet.Cells[("D" + fila)].Value = row.MinutosPolizas;
                        worksheet.Cells[("D" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("E" + fila)].Value = row.TarifaPolizas;
                        worksheet.Cells[("E" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                        worksheet.Cells[("F" + fila)].Value = row.USDPolizas;
                        worksheet.Cells[("F" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                        worksheet.Cells[("G" + fila)].Value = row.MinutosAcuerdos;
                        worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("H" + fila)].Value = row.TarifaAcuerdos;
                        worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                        worksheet.Cells[("I" + fila)].Value = row.USDAcuerdos;
                        worksheet.Cells[("I" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                        worksheet.Cells[("J" + fila)].Value = row.VariacionMinutos;
                        worksheet.Cells[("J" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                        worksheet.Cells[("K" + fila)].Value = row.VariacionMonto;
                        worksheet.Cells[("K" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                        fila++;
                    }
                    worksheet.Cells["A" + fila + ":E" + fila].Merge = true;
                    worksheet.Cells["A" + fila + ":E" + fila].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    worksheet.Cells["A" + fila + ":E" + fila].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells["A" + fila + ":E" + fila].Style.Fill.BackgroundColor.SetColor(Color.LightSteelBlue);
                    worksheet.Cells[("A" + fila)].Value = "TOTAL";
                    worksheet.Cells[("F" + fila)].Value = totalUSDPolizas;
                    worksheet.Cells["G" + fila + ":H" + fila].Merge = true;
                    worksheet.Cells["G" + fila + ":H" + fila].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells["G" + fila + ":H" + fila].Style.Fill.BackgroundColor.SetColor(Color.LightSteelBlue);
                    worksheet.Cells[("F" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("I" + fila)].Value = totalUSDAcuerdos;
                    worksheet.Cells[("I" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("J" + fila)].Value = totalVarMinutos;
                    worksheet.Cells[("J" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("K" + fila)].Value = totalVarMonto;
                    worksheet.Cells[("K" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }

    }
}