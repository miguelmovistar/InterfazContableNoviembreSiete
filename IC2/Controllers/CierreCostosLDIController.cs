using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.IO;
using OfficeOpenXml;
using System.Drawing;
using OfficeOpenXml.Style;
using IC2.Helpers;
using System.Globalization;

namespace IC2.Controllers
{
    public class CierreCostosLDIController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();

        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };
        // GET: CierrecostosLDI
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
                var datos = from periodos in db.cierreCostosLDI
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
                respuesta = new { success = true, results = lista, total = total };
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
                var query = from costos in db.cierreCostosLDI
                            where costos.periodo.Month == periodo.Month &&
                            costos.periodo.Year == periodo.Year &&
                            costos.lineaNegocio == 2
                            select new
                            {
                                costos.Id,
                                costos.periodo,
                                costos.moneda,
                                costos.operador,
                                costos.trafico,
                                costos.minuto,
                                costos.tarifa,
                                costos.USD,
                                costos.MXN,
                                costos.tipoCambio
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
                respuesta = new { results = lista, start = start, limit = limit, total = total, success = true };

            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult ExportarReporte(DateTime periodo)
        {
            string nombreArchivo = "Cierre LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/Cierre_LDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Cierre Ingresos */
                    ExcelWorksheet worksheetIngresos = excelPackage.Workbook.Worksheets["Ingreso LDI"];
                    HojaCierreIngresos(ref worksheetIngresos, periodo, true, db);
                    /* Cierre Costos */
                    ExcelWorksheet worksheetCostos = excelPackage.Workbook.Worksheets["Costo LDI"];
                    HojaCierreCostos(ref worksheetCostos, periodo, true, db);
                    /* Cierre SMS */
                    ExcelWorksheet worksheetSMS = excelPackage.Workbook.Worksheets["SMS"];
                    HojaCierreSMS(ref worksheetSMS, periodo, true, db);

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }
        public static void HojaCierreIngresos(ref ExcelWorksheet worksheet, DateTime periodo, bool blnTabla, ICPruebaEntities db)
        {
            var mes = periodo.ToString("MMMM", new CultureInfo("es-ES"));
            mes = char.ToUpper(mes[0]) + mes.Substring(1);
            int fila = 5;
            worksheet.Cells["D1"].Value = mes;
            worksheet.Cells["D1"].Style.Font.Color.SetColor(Color.Red);
            var lista = new List<cierreIngresosLDI>();
            if ( blnTabla) {
                lista = db.cierreIngresosLDI.Where(x => x.periodo.Month == periodo.Month && x.periodo.Year == periodo.Year && x.lineaNegocio == 2).ToList();
            } else {
                List<GACierreIngresosLDI> consultaGCI = db.GACierreIngresosLDI.Where(x => x.periodo.Month == periodo.Month && x.periodo.Year == periodo.Year && x.lineaNegocio == 2).ToList();
                lista = consultaGCI.Select(x => new cierreIngresosLDI() {
                    Id = x.Id,
                    moneda = x.moneda,
                    operador = x.operador,
                    trafico = x.trafico,
                    minuto = x.minuto,
                    tarifa = x.tarifa,
                    USD = x.USD,
                    MXN = x.MXN,
                    tipoCambio = x.tipoCambio
                }).ToList();
            }

            decimal tipo_cambio = Convert.ToDecimal(lista[0].tipoCambio);
            worksheet.Cells["H1"].Value = tipo_cambio;
            worksheet.Cells["H1"].Style.Numberformat.Format = "_-$* #,##0.0000_-";

            foreach (cierreIngresosLDI row in lista) {
                if (row.operador != "TOTAL GENERAL")
                    worksheet.Cells[("A" + fila)].Value = mes + " " + periodo.Year;
                worksheet.Cells[("B" + fila)].Value = row.moneda;
                worksheet.Cells[("C" + fila)].Value = row.operador;
                worksheet.Cells[("D" + fila)].Value = row.trafico;

                worksheet.Cells[("E" + fila)].Value = row.minuto;
                worksheet.Cells[("E" + fila)].Style.Numberformat.Format = "#,##0.00_-";

                worksheet.Cells[("F" + fila)].Value = row.tarifa;
                worksheet.Cells[("F" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";

                worksheet.Cells[("G" + fila)].Value = row.USD;
                worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                worksheet.Cells[("H" + fila)].Value = row.MXN;
                worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                if (row.trafico == "TOTAL") {
                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.BackgroundColor.SetColor(Color.Khaki);
                    fila++;
                }
                fila++;
            }
        }

        public static void HojaCierreCostos(ref ExcelWorksheet worksheet, DateTime periodo, bool blnTabla, ICPruebaEntities db)
        {
            int fila = 5;
            var mes = periodo.ToString("MMMM", new CultureInfo("es-ES"));
            mes = char.ToUpper(mes[0]) + mes.Substring(1);
            worksheet.Cells["D1"].Value = mes;
            worksheet.Cells["D1"].Style.Font.Color.SetColor(Color.Red);

            List<cierreCostosLDI> lista = new List<cierreCostosLDI>();
            if (blnTabla) {
                lista = db.cierreCostosLDI.Where(x => x.periodo.Month == periodo.Month && x.periodo.Year == periodo.Year && x.lineaNegocio == 2).ToList();
            } else {
                List<GACierreCostosLDI> consultaGCI = db.GACierreCostosLDI.Where(x => x.periodo.Month == periodo.Month && x.periodo.Year == periodo.Year && x.lineaNegocio == 2).ToList();
                lista = consultaGCI.Select(x => new cierreCostosLDI()
                {
                    Id = x.Id,
                    moneda = x.moneda,
                    operador = x.operador,
                    trafico = x.trafico,
                    minuto = x.minuto,
                    tarifa = x.tarifa,
                    USD = x.USD,
                    MXN = x.MXN,
                    tipoCambio = x.tipoCambio
                }).ToList();
            }

            decimal tipo_cambio = Convert.ToDecimal(lista[0].tipoCambio);
            worksheet.Cells["H1"].Value = tipo_cambio;
            worksheet.Cells["H1"].Style.Numberformat.Format = "_-$* #,##0.0000_-";

            foreach (cierreCostosLDI row in lista) {
                if (row.operador != "TOTAL GENERAL")
                    worksheet.Cells[("A" + fila)].Value = mes + " " + periodo.Year;
                worksheet.Cells[("B" + fila)].Value = row.moneda;
                worksheet.Cells[("C" + fila)].Value = row.operador;
                worksheet.Cells[("D" + fila)].Value = row.trafico;

                worksheet.Cells[("E" + fila)].Value = row.minuto;
                worksheet.Cells[("E" + fila)].Style.Numberformat.Format = "#,##0.00_-";

                worksheet.Cells[("F" + fila)].Value = row.tarifa;
                worksheet.Cells[("F" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";

                worksheet.Cells[("G" + fila)].Value = row.USD;
                worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                worksheet.Cells[("H" + fila)].Value = row.MXN;
                worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                if (row.trafico == "TOTAL") {
                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.BackgroundColor.SetColor(Color.Khaki);

                    fila++;
                }
                fila++;
            }
        }
        public static void HojaCierreSMS(ref ExcelWorksheet worksheet, DateTime periodo, bool blnTabla, ICPruebaEntities db)
        {
            int fila = 9;
            int increment = 0;
            char[] index = { 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K' };
            var mes = periodo.ToString("MMMM", new CultureInfo("es-ES"));
            mes = char.ToUpper(mes[0]) + mes.Substring(1);
            worksheet.Cells["A5"].Value = mes;
            worksheet.Cells["A5"].Style.Font.Color.SetColor(Color.Red);

            decimal tipo_cambio = 0;

            List<cierreSMSLDI> lista = new List<cierreSMSLDI>();
            if (blnTabla) {
                lista = db.cierreSMSLDI.Where(x => x.periodo.Month == periodo.Month && x.periodo.Year == periodo.Year && x.lineaNegocio == 2).ToList();
                if (lista.Count > 0)
                    tipo_cambio = (decimal)db.cierreSMSLDI.Where(x => x.periodo.Year == periodo.Year && x.periodo.Month == (periodo.Month)).Select(x => x.tipoCambio).FirstOrDefault();
            } else {
                List<GACierreSMSLDI> consultaGCI = db.GACierreSMSLDI.Where(x => x.periodo.Month == periodo.Month && x.periodo.Year == periodo.Year && x.lineaNegocio == 2).ToList();
                lista = consultaGCI.Select(x => new cierreSMSLDI()
                {
                    trafico = x.trafico,
                    movimiento = x.movimiento,
                    eventos = x.eventos,
                    tarifa = x.tarifa,
                    USD = x.USD,
                    MXN = x.MXN
                }).ToList();
                if (lista.Count > 0)
                    tipo_cambio = (decimal)db.GACierreSMSLDI.Where(x => x.periodo.Year == periodo.Year && x.periodo.Month == (periodo.Month)).Select(x => x.tipoCambio).FirstOrDefault();
            }
            worksheet.Cells["E1"].Value = tipo_cambio;
            worksheet.Cells["E1"].Style.Numberformat.Format = "_-$* #,##0.0000_-";
            foreach (cierreSMSLDI row in lista) {
                worksheet.Cells[(index[0 + increment] + "" + fila)].Value = row.trafico;

                worksheet.Cells[(index[1 + increment] + "" + fila)].Value = row.eventos;
                worksheet.Cells[(index[1 + increment] + "" + fila)].Style.Numberformat.Format = "#,##0_-";

                worksheet.Cells[(index[2 + increment] + "" + fila)].Value = row.tarifa;
                worksheet.Cells[(index[2 + increment] + "" + fila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";

                worksheet.Cells[(index[3 + increment] + "" + fila)].Value = row.USD;
                worksheet.Cells[(index[3 + increment] + "" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                worksheet.Cells[(index[4 + increment] + "" + fila)].Value = row.MXN;
                worksheet.Cells[(index[4 + increment] + "" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

                if (row.trafico == "TOTAL") {
                    worksheet.Cells[(index[4 + increment] + "" + fila)].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[(index[4 + increment] + "" + fila)].Style.Fill.BackgroundColor.SetColor(Color.Khaki);
                    fila = 9;
                    increment = 5;
                } else {
                    fila++;
                }
            }


        }

    }
}