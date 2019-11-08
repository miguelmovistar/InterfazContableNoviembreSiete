/* Nombre: FluctuacionCostosLDIController.cs
*Creado por: María Esthér Sandoval García
*Fecha: 06/jun/2019
*Descripcion: Reporte de Fluctuación Cambiaria Costos LDI
*Ultima Fecha de modificación: -
*/

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class FluctuacionCostosLDIController : Controller
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

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult LlenaPeriodo(int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from periodos in db.FluctuacionCostoLDI
                            group periodos by periodos.periodo into g
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.Periodo.Value.Year + "-" + elemento.Periodo.Value.Month + "-" + elemento.Periodo.Value.Day,
                        Fecha = elemento.Periodo.Value.Year + " " + meses[elemento.Periodo.Value.Month]
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

        public JsonResult LlenarGridFluctuacion(DateTime Periodo, int start, int limit)
        {
            object lRespuesta;
            List<object> lLista = new List<object>();
            decimal totalImporteProvision = 0;
            decimal totalImporteProvisionMXN = 0;
            decimal totalImporteRevaluado = 0;
            decimal totalImporteFacturado = 0;
            decimal totalImpFacSopProvision = 0;
            decimal totalFacturadoMXN = 0;
            decimal totalVariacionMXN = 0;
            decimal totalEfectoOperativo = 0;
            decimal totalFluctuacionCambiaria = 0;
            int lTotal = 0;
            try {
                var lDatosConsulta = from fluctuacion in db.FluctuacionCostoLDI
                                     where fluctuacion.periodo == Periodo
                                     select new
                                     {
                                         fluctuacion.id,
                                         fluctuacion.cuentaContable,
                                         fluctuacion.nombreGrupo,
                                         fluctuacion.nombreAcreedorSAP,
                                         fluctuacion.codigoAcreedor,
                                         fluctuacion.sociedadGL,
                                         fluctuacion.fecha_contable,
                                         fluctuacion.claseDocumento,
                                         fluctuacion.factura,
                                         fluctuacion.num_Documento_PF,
                                         fluctuacion.moneda,
                                         fluctuacion.TC_Provision,
                                         fluctuacion.TC_Cierre,
                                         fluctuacion.TC_Facturado,
                                         fluctuacion.importe_Provision,
                                         fluctuacion.importe_Provision_MXN,
                                         fluctuacion.importe_Revaluado,
                                         fluctuacion.importe_Facturado,
                                         fluctuacion.imp_Fac_Sop_Provision,
                                         fluctuacion.facturado_MXN,
                                         fluctuacion.variacion_MXN,
                                         fluctuacion.efecto_Operativo,
                                         fluctuacion.fluctuacion_Cambiaria,
                                         fluctuacion.estatus,
                                         fluctuacion.cuenta_Fluctuacion
                                     };


                if (lDatosConsulta != null) {
                    foreach (var lDatosFluctuacion in lDatosConsulta) {
                        lLista.Add(new
                        {
                            lDatosFluctuacion.id,
                            lDatosFluctuacion.cuentaContable,
                            lDatosFluctuacion.nombreGrupo,
                            lDatosFluctuacion.nombreAcreedorSAP,
                            lDatosFluctuacion.codigoAcreedor,
                            lDatosFluctuacion.sociedadGL,
                            fecha_contable = lDatosFluctuacion.fecha_contable.Value.ToString("dd-MM-yyyy"),
                            lDatosFluctuacion.claseDocumento,
                            lDatosFluctuacion.factura,
                            lDatosFluctuacion.num_Documento_PF,
                            lDatosFluctuacion.moneda,
                            lDatosFluctuacion.TC_Provision,
                            lDatosFluctuacion.TC_Cierre,
                            lDatosFluctuacion.TC_Facturado,
                            lDatosFluctuacion.importe_Provision,
                            lDatosFluctuacion.importe_Provision_MXN,
                            lDatosFluctuacion.importe_Revaluado,
                            lDatosFluctuacion.importe_Facturado,
                            lDatosFluctuacion.imp_Fac_Sop_Provision,
                            lDatosFluctuacion.facturado_MXN,
                            lDatosFluctuacion.variacion_MXN,
                            lDatosFluctuacion.efecto_Operativo,
                            lDatosFluctuacion.fluctuacion_Cambiaria,
                            lDatosFluctuacion.estatus,
                            lDatosFluctuacion.cuenta_Fluctuacion
                        });
                        totalImporteProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                        totalImporteProvisionMXN += Convert.ToDecimal(lDatosFluctuacion.importe_Provision_MXN);
                        totalImporteRevaluado += Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                        totalImporteFacturado += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                        totalImpFacSopProvision += Convert.ToDecimal(lDatosFluctuacion.imp_Fac_Sop_Provision);
                        totalFacturadoMXN += Convert.ToDecimal(lDatosFluctuacion.facturado_MXN);
                        totalVariacionMXN += Convert.ToDecimal(lDatosFluctuacion.variacion_MXN);
                        totalEfectoOperativo += Convert.ToDecimal(lDatosFluctuacion.efecto_Operativo);
                        totalFluctuacionCambiaria += Convert.ToDecimal(lDatosFluctuacion.fluctuacion_Cambiaria);
                    }
                }
                List<object> listaTotales = new List<object>();
                listaTotales.Add(new
                {
                    totalImporteProvision,
                    totalImporteProvisionMXN,
                    totalImporteRevaluado,
                    totalImporteFacturado,
                    totalImpFacSopProvision,
                    totalFacturadoMXN,
                    totalVariacionMXN,
                    totalEfectoOperativo,
                    totalFluctuacionCambiaria
                });
                lTotal = lLista.Count();
                lLista = lLista.Skip(start).Take(limit).ToList();
                lRespuesta = new { results = lLista, listaTotales, start, limit, total = lTotal, success = true };
            } catch (Exception e) {
                lRespuesta = new { success = false, results = e.Message };
            }

            return Json(lRespuesta, JsonRequestBehavior.AllowGet);
        }
        public string FormarCadenas(List<string> pListaCadena, string pDelimitador)
        {
            string lCadena = string.Empty;

            for (int lIteracion = 0; lIteracion < pListaCadena.Count; lIteracion++) {
                lCadena += pListaCadena[lIteracion] + pDelimitador;
            }
            lCadena = lCadena.Substring(0, (lCadena.Length - 1));

            return lCadena;

        }

        public JsonResult ExportarReporte(DateTime periodo)
        {
            string nombreArchivo = "Fluctuación Costos LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/FluctuacionCambiariaCostosLDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Fluctuaciones */
                    ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["Fluctuación Costos"];

                    HojaFluctuacionCosto(ref worksheet, periodo, true, db);

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }

        public static void HojaFluctuacionCosto(ref ExcelWorksheet worksheet, DateTime periodo, Boolean blnTabla, ICPruebaEntities db)
        {
            int lFila = 2;
            decimal TotalImporteProvision = 0;
            decimal TotalImporteProvisionMXN = 0;
            decimal TotalImporteRevaluado = 0;
            decimal TotalImporteFacturado = 0;
            decimal TotalImpFacSopProvision = 0;
            decimal TotalFacturadoMXN = 0;
            decimal TotalVariacionMXN = 0;
            decimal TotalEfectoOperativo = 0;
            decimal TotalFluctuacionCambiaria = 0;

            if (blnTabla) {
                var consultaFC = db.FluctuacionCostoLDI.Where(x => x.periodo == periodo).ToList();
                foreach (var lDatosFluctuacion in consultaFC) {
                    worksheet.Cells[("A" + lFila)].Value = lDatosFluctuacion.cuentaContable;
                    worksheet.Cells[("B" + lFila)].Value = lDatosFluctuacion.nombreGrupo;
                    worksheet.Cells[("C" + lFila)].Value = lDatosFluctuacion.nombreAcreedorSAP;
                    worksheet.Cells[("D" + lFila)].Value = lDatosFluctuacion.codigoAcreedor;
                    worksheet.Cells[("E" + lFila)].Value = lDatosFluctuacion.sociedadGL;
                    worksheet.Cells[("F" + lFila)].Value = lDatosFluctuacion.fecha_contable.Value.ToString("dd-MM-yyyy");
                    worksheet.Cells[("G" + lFila)].Value = lDatosFluctuacion.claseDocumento;
                    worksheet.Cells[("H" + lFila)].Value = lDatosFluctuacion.sentido;
                    worksheet.Cells[("I" + lFila)].Value = lDatosFluctuacion.factura;
                    worksheet.Cells[("J" + lFila)].Value = lDatosFluctuacion.num_Documento_PF;
                    worksheet.Cells[("K" + lFila)].Value = lDatosFluctuacion.moneda;
                    worksheet.Cells[("L" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.TC_Provision);
                    worksheet.Cells[("L" + lFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("M" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.TC_Cierre);
                    worksheet.Cells[("M" + lFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("N" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.TC_Facturado);
                    worksheet.Cells[("N" + lFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("O" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                    worksheet.Cells[("O" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("P" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Provision_MXN);
                    worksheet.Cells[("P" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("Q" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                    worksheet.Cells[("Q" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("R" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                    worksheet.Cells[("R" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("S" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.imp_Fac_Sop_Provision);
                    worksheet.Cells[("S" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("T" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.facturado_MXN);
                    worksheet.Cells[("T" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("U" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.variacion_MXN);
                    worksheet.Cells[("U" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("V" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.efecto_Operativo);
                    worksheet.Cells[("V" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("W" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.fluctuacion_Cambiaria);
                    worksheet.Cells[("W" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("X" + lFila)].Value = lDatosFluctuacion.estatus;
                    worksheet.Cells[("Y" + lFila)].Value = lDatosFluctuacion.cuenta_Fluctuacion;

                    TotalImporteProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                    TotalImporteProvisionMXN += Convert.ToDecimal(lDatosFluctuacion.importe_Provision_MXN);
                    TotalImporteRevaluado += Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                    TotalImporteFacturado += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                    TotalImpFacSopProvision += Convert.ToDecimal(lDatosFluctuacion.imp_Fac_Sop_Provision);
                    TotalFacturadoMXN += Convert.ToDecimal(lDatosFluctuacion.facturado_MXN);
                    TotalVariacionMXN += Convert.ToDecimal(lDatosFluctuacion.variacion_MXN);
                    TotalEfectoOperativo += Convert.ToDecimal(lDatosFluctuacion.efecto_Operativo);
                    TotalFluctuacionCambiaria += Convert.ToDecimal(lDatosFluctuacion.fluctuacion_Cambiaria);

                    lFila++;
                }
            } else {
                var consultaFC = db.GAFluctuacionCostoLDI.Where(x => x.periodo == periodo).ToList();
                foreach (var lDatosFluctuacion in consultaFC) {
                    worksheet.Cells[("A" + lFila)].Value = lDatosFluctuacion.cuentaContable;
                    worksheet.Cells[("B" + lFila)].Value = lDatosFluctuacion.nombreGrupo;
                    worksheet.Cells[("C" + lFila)].Value = lDatosFluctuacion.nombreAcreedorSAP;
                    worksheet.Cells[("D" + lFila)].Value = lDatosFluctuacion.codigoAcreedor;
                    worksheet.Cells[("E" + lFila)].Value = lDatosFluctuacion.sociedadGL;
                    worksheet.Cells[("F" + lFila)].Value = lDatosFluctuacion.fecha_contable.Value.ToString("dd-MM-yyyy");
                    worksheet.Cells[("G" + lFila)].Value = lDatosFluctuacion.claseDocumento;
                    worksheet.Cells[("H" + lFila)].Value = lDatosFluctuacion.sentido;
                    worksheet.Cells[("I" + lFila)].Value = lDatosFluctuacion.factura;
                    worksheet.Cells[("J" + lFila)].Value = lDatosFluctuacion.num_Documento_PF;
                    worksheet.Cells[("K" + lFila)].Value = lDatosFluctuacion.moneda;
                    worksheet.Cells[("L" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.TC_Provision);
                    worksheet.Cells[("L" + lFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("M" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.TC_Cierre);
                    worksheet.Cells[("M" + lFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("N" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.TC_Facturado);
                    worksheet.Cells[("N" + lFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
                    worksheet.Cells[("O" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                    worksheet.Cells[("O" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("P" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Provision_MXN);
                    worksheet.Cells[("P" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("Q" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                    worksheet.Cells[("Q" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("R" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                    worksheet.Cells[("R" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("S" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.imp_Fac_Sop_Provision);
                    worksheet.Cells[("S" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("T" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.facturado_MXN);
                    worksheet.Cells[("T" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("U" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.variacion_MXN);
                    worksheet.Cells[("U" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("V" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.efecto_Operativo);
                    worksheet.Cells[("V" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("W" + lFila)].Value = Convert.ToDecimal(lDatosFluctuacion.fluctuacion_Cambiaria);
                    worksheet.Cells[("W" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                    worksheet.Cells[("X" + lFila)].Value = lDatosFluctuacion.estatus;
                    worksheet.Cells[("Y" + lFila)].Value = lDatosFluctuacion.cuenta_Fluctuacion;

                    TotalImporteProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                    TotalImporteProvisionMXN += Convert.ToDecimal(lDatosFluctuacion.importe_Provision_MXN);
                    TotalImporteRevaluado += Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                    TotalImporteFacturado += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                    TotalImpFacSopProvision += Convert.ToDecimal(lDatosFluctuacion.imp_Fac_Sop_Provision);
                    TotalFacturadoMXN += Convert.ToDecimal(lDatosFluctuacion.facturado_MXN);
                    TotalVariacionMXN += Convert.ToDecimal(lDatosFluctuacion.variacion_MXN);
                    TotalEfectoOperativo += Convert.ToDecimal(lDatosFluctuacion.efecto_Operativo);
                    TotalFluctuacionCambiaria += Convert.ToDecimal(lDatosFluctuacion.fluctuacion_Cambiaria);

                    lFila++;
                }
            }

            lFila++;
            worksheet.Cells[("N" + lFila)].Value = "TOTAL";
            worksheet.Cells[("O" + lFila)].Value = TotalImporteProvision;
            worksheet.Cells[("O" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("P" + lFila)].Value = TotalImporteProvisionMXN;
            worksheet.Cells[("P" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("Q" + lFila)].Value = TotalImporteRevaluado;
            worksheet.Cells[("Q" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("R" + lFila)].Value = TotalImporteFacturado;
            worksheet.Cells[("R" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("S" + lFila)].Value = TotalImpFacSopProvision;
            worksheet.Cells[("S" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("T" + lFila)].Value = TotalFacturadoMXN;
            worksheet.Cells[("T" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("U" + lFila)].Value = TotalVariacionMXN;
            worksheet.Cells[("U" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("V" + lFila)].Value = TotalEfectoOperativo;
            worksheet.Cells[("V" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("W" + lFila)].Value = TotalFluctuacionCambiaria;
            worksheet.Cells[("W" + lFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("W" + lFila)].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheet.Cells[("W" + lFila)].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Khaki);

            worksheet.Cells["L2:W" + lFila].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        }
        
    }
}
