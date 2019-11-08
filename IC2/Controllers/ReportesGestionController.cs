using IC2.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class ReportesGestionController : Controller
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

        public JsonResult LlenaPeriodo(int tipoReporte, int sentido)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            List<DateTime> datos = new List<DateTime>();
            try {
                if (tipoReporte == 1) {
                    datos = db.GACierreIngresosLDI.Where(x => x.lineaNegocio == 2).GroupBy(x => x.periodo).Select(x => x.Key).ToList();
                } else if (tipoReporte == 2) {
                    datos = db.GAPXQIngresosLDI.Where(x => x.lineaNegocio == 2).GroupBy(x => x.periodo).Select(x => x.Key).ToList();

                } else {
                    if (sentido == 1) {
                        datos = db.GADevengoIngreso.GroupBy(x => x.FechaSolicitud).Select(x => x.Key).ToList();
                    } else {
                        datos = db.GADevengoCosto.GroupBy(x => x.FechaSolicitud).Select(x => x.Key).ToList();
                    }
                }

                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento,
                        Periodo = elemento.Year + "-" + elemento.Month + "-" + elemento.Day,
                        Fecha = elemento.Year + " " + meses[elemento.Month]
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ExportarReporte(DateTime periodo, int tipoReporte, int sentido)
        {
            JsonResult result = new JsonResult();
            if (tipoReporte == 1) {
                result = ReporteCierre(periodo);
            } else if (tipoReporte == 2) {
                result = ReportePXQ(periodo);
            } else if (tipoReporte == 3) {
                if (sentido == 1) {
                    result = ReporteDevengoIngreso(periodo);
                } else if (sentido == 2) {
                    result = ReporteDevengoCosto(periodo);
                }
            }
            return result;
        }

        #region Cierre
        public JsonResult ReporteCierre(DateTime periodo)
        {
            string nombreArchivo = "Cierre LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/Cierre_LDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Cierre Ingresos */
                    ExcelWorksheet worksheetIngresos = excelPackage.Workbook.Worksheets["Ingreso LDI"];
                    CierreCostosLDIController.HojaCierreIngresos(ref worksheetIngresos, periodo, false, db);
                    /* Cierre Costos */
                    ExcelWorksheet worksheetCostos = excelPackage.Workbook.Worksheets["Costo LDI"];
                    CierreCostosLDIController.HojaCierreCostos(ref worksheetCostos, periodo, false, db);
                    /* Cierre SMS */
                    ExcelWorksheet worksheetSMS = excelPackage.Workbook.Worksheets["SMS"];
                    CierreCostosLDIController.HojaCierreSMS(ref worksheetSMS, periodo, false, db);

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region PXQ
        public JsonResult ReportePXQ(DateTime periodo)
        {
            string nombreArchivo = "PxQ LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/PxQ_LDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Cierre Ingresos */
                    ExcelWorksheet worksheetIngresos = excelPackage.Workbook.Worksheets["PxQ Ingresos LDI"];
                    PXQIngresosLDIController.HojaPxQIngresos(ref worksheetIngresos, periodo, false, db);
                    /* Cierre Costos */
                    ExcelWorksheet worksheetCostos = excelPackage.Workbook.Worksheets["PxQ Costos LDI"];
                    PXQIngresosLDIController.HojaPxQCostos(ref worksheetCostos, periodo, false, db);
                    /* Cierre SMS */
                    ExcelWorksheet worksheetSMS = excelPackage.Workbook.Worksheets["SMS"];
                    PXQIngresosLDIController.HojaPxQSMS(ref worksheetSMS, periodo, false, db);

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Devengo Ingreso
        public JsonResult ReporteDevengoIngreso(DateTime periodo)
        {
            string nombreArchivo = "Devengo Ingreso LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/Devengo_Ingreso_LDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Devengo Documento */
                    ExcelWorksheet worksheetDocumento = excelPackage.Workbook.Worksheets["Moneda Documento"];
                    DevengoIngresoLDIController.HojaDevengoDocumento(ref worksheetDocumento, periodo, 3, db);
                    /* Devengo Local */
                    ExcelWorksheet worksheetLocal = excelPackage.Workbook.Worksheets["Moneda Local"];
                    DevengoIngresoLDIController.HojaDevengoLocal(ref worksheetLocal, periodo, 4, db);
                    /* Fluctuaciones */
                    ExcelWorksheet worksheetFluctuaciones = excelPackage.Workbook.Worksheets["Fluctuación"];
                    FluctuacionIngresosLDIController.HojaFluctuacionIngreso(ref worksheetFluctuaciones, periodo, false, db);
                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Devengo Costo
        public JsonResult ReporteDevengoCosto(DateTime periodo)
        {
            string nombreArchivo = "Devengo Costo LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/Devengo_Costo_LDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Devengo Documento */
                    ExcelWorksheet worksheetDocumento = excelPackage.Workbook.Worksheets["Moneda Documento"];
                    DevengoCostoLDIController.HojaDevengoDocumento(ref worksheetDocumento, periodo, 3, db);
                    /* Devengo Local */
                    ExcelWorksheet worksheetLocal = excelPackage.Workbook.Worksheets["Moneda Local"];
                    DevengoCostoLDIController.HojaDevengoLocal(ref worksheetLocal, periodo, 4, db);
                    /* Fluctuaciones */
                    ExcelWorksheet worksheetFluctuaciones = excelPackage.Workbook.Worksheets["Fluctuación"];
                    FluctuacionCostosLDIController.HojaFluctuacionCosto(ref worksheetFluctuaciones, periodo, false, db);

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
    }
}