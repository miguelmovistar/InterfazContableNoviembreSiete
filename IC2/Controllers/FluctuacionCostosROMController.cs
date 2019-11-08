/* Nombre: FluctuacionCostosLDIController.cs
*Creado por: Ana Ilse Aguila Rojas
*Fecha: 04/sept/2019
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

namespace IC2.Controllers
{
    public class FluctuacionCostosROMController : Controller
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

        public JsonResult LlenaPeriodo()
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try
            {
                var datos = from periodos in db.FluctuacionCostoROM
                            group periodos by periodos.fecha_Carga into g
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };
                foreach (var elemento in datos)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }

                respuesta = new { success = true, results = lista };
            }
            catch (Exception e)
            {
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
            try
            {
                var lDatosConsulta = from fluctuacion in db.FluctuacionCostoROM
                                     where fluctuacion.fecha_Carga == Periodo
                                     select new
                                     {
                                         fluctuacion.id,
                                         fluctuacion.no_Provision,
                                         fluctuacion.cuenta_Contable,
                                         fluctuacion.pmln,
                                         fluctuacion.nombre,
                                         fluctuacion.acreedor,
                                         fluctuacion.sociedad_GL,
                                         fluctuacion.periodo,
                                         fluctuacion.tipo,
                                         fluctuacion.tipo_Registro,
                                         fluctuacion.documento,
                                         fluctuacion.no_DocumentoSap,
                                         fluctuacion.moneda,
                                         fluctuacion.tC_Provision,
                                         fluctuacion.tC_Cierre,
                                         fluctuacion.tC_Facturado,
                                         fluctuacion.importe_Provision,
                                         fluctuacion.importe_ProvisionMXN,
                                         fluctuacion.importe_Revaluado,
                                         fluctuacion.importe_Facturado,
                                         fluctuacion.importe_Facturado_Provision,
                                         fluctuacion.facturado_MXN,
                                         fluctuacion.variacion_MXN,
                                         fluctuacion.efecto_Operativo,
                                         fluctuacion.fluctuacion_Cambiaria,
                                         fluctuacion.estatus,
                                         fluctuacion.cuenta_Fluctuacion
                                     };


                if (lDatosConsulta != null)
                {
                    foreach (var lDatosFluctuacion in lDatosConsulta)
                    {
                        lLista.Add(new
                        {
                            lDatosFluctuacion.id,
                            lDatosFluctuacion.no_Provision,
                            lDatosFluctuacion.cuenta_Contable,
                            lDatosFluctuacion.pmln,
                            lDatosFluctuacion.nombre,
                            lDatosFluctuacion.acreedor,
                            lDatosFluctuacion.sociedad_GL,
                            periodo = lDatosFluctuacion.periodo,
                            lDatosFluctuacion.tipo,
                            lDatosFluctuacion.tipo_Registro,
                            lDatosFluctuacion.documento,
                            lDatosFluctuacion.no_DocumentoSap,
                            lDatosFluctuacion.moneda,
                            lDatosFluctuacion.tC_Provision,
                            lDatosFluctuacion.tC_Cierre,
                            lDatosFluctuacion.tC_Facturado,
                            lDatosFluctuacion.importe_Provision,
                            lDatosFluctuacion.importe_ProvisionMXN,
                            lDatosFluctuacion.importe_Revaluado,
                            lDatosFluctuacion.importe_Facturado,
                            lDatosFluctuacion.importe_Facturado_Provision,
                            lDatosFluctuacion.facturado_MXN,
                            lDatosFluctuacion.variacion_MXN,
                            lDatosFluctuacion.efecto_Operativo,
                            lDatosFluctuacion.fluctuacion_Cambiaria,
                            lDatosFluctuacion.estatus,
                            lDatosFluctuacion.cuenta_Fluctuacion
                        });
                        totalImporteProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                        totalImporteProvisionMXN += Convert.ToDecimal(lDatosFluctuacion.importe_ProvisionMXN);
                        totalImporteRevaluado += Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                        totalImporteFacturado += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                        totalImpFacSopProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado_Provision);
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
            }
            catch (Exception e)
            {
                lRespuesta = new { success = false, results = e.Message };
            }

            return Json(lRespuesta, JsonRequestBehavior.AllowGet);
        }
        public string FormarCadenas(List<string> pListaCadena, string pDelimitador)
        {
            string lCadena = string.Empty;

            for (int lIteracion = 0; lIteracion < pListaCadena.Count; lIteracion++)
            {
                lCadena += pListaCadena[lIteracion] + pDelimitador;
            }
            lCadena = lCadena.Substring(0, (lCadena.Length - 1));

            return lCadena;

        }

        public JsonResult ExportarReporte(DateTime periodo)
        {
            string nombreArchivo = "Fluctuación Costos ROM " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/FluctuacionCambiariaCostosROM.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile))
            {
                try
                {
                    /* Fluctuaciones */
                    ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["Fluctuación Costos"];

                    decimal TotalImporteProvision = 0;
                    decimal TotalImporteProvisionMXN = 0;
                    decimal TotalImporteRevaluado = 0;
                    decimal TotalImporteFacturado = 0;
                    decimal TotalImpFacSopProvision = 0;
                    decimal TotalFacturadoMXN = 0;
                    decimal TotalVariacionMXN = 0;
                    decimal TotalEfectoOperativo = 0;
                    decimal TotalFluctuacionCambiaria = 0;

                    var lResultadoConsulta = from fluctuacion in db.FluctuacionCostoROM
                                             where fluctuacion.fecha_Carga == periodo
                                             select new
                                             {
                                                 fluctuacion.id,
                                                 fluctuacion.no_Provision,
                                                 fluctuacion.cuenta_Contable,
                                                 fluctuacion.pmln,
                                                 fluctuacion.nombre,
                                                 fluctuacion.acreedor,
                                                 fluctuacion.sociedad_GL,
                                                 fluctuacion.periodo,
                                                 fluctuacion.tipo,
                                                 fluctuacion.tipo_Registro,
                                                 fluctuacion.documento,
                                                 fluctuacion.no_DocumentoSap,
                                                 fluctuacion.moneda,
                                                 fluctuacion.tC_Provision,
                                                 fluctuacion.tC_Cierre,
                                                 fluctuacion.tC_Facturado,
                                                 fluctuacion.importe_Provision,
                                                 fluctuacion.importe_ProvisionMXN,
                                                 fluctuacion.importe_Revaluado,
                                                 fluctuacion.importe_Facturado,
                                                 fluctuacion.importe_Facturado_Provision,
                                                 fluctuacion.facturado_MXN,
                                                 fluctuacion.variacion_MXN,
                                                 fluctuacion.efecto_Operativo,
                                                 fluctuacion.fluctuacion_Cambiaria,
                                                 fluctuacion.estatus,
                                                 fluctuacion.cuenta_Fluctuacion
                                             };
                    lResultadoConsulta.ToList();
                    int lFila = 2;

                    foreach (var lDatosFluctuacion in lResultadoConsulta)
                    {
                        worksheet.Cells[("A" + lFila)].Value = lDatosFluctuacion.no_Provision;
                        worksheet.Cells[("B" + lFila)].Value = lDatosFluctuacion.cuenta_Contable;
                        worksheet.Cells[("C" + lFila)].Value = lDatosFluctuacion.pmln;
                        worksheet.Cells[("D" + lFila)].Value = lDatosFluctuacion.nombre;
                        worksheet.Cells[("E" + lFila)].Value = lDatosFluctuacion.acreedor;
                        worksheet.Cells[("F" + lFila)].Value = lDatosFluctuacion.sociedad_GL;
                        worksheet.Cells[("G" + lFila)].Value = lDatosFluctuacion.periodo;
                        worksheet.Cells[("H" + lFila)].Value = lDatosFluctuacion.tipo;
                        worksheet.Cells[("I" + lFila)].Value = lDatosFluctuacion.tipo_Registro;
                        worksheet.Cells[("J" + lFila)].Value = lDatosFluctuacion.documento;
                        worksheet.Cells[("K" + lFila)].Value = lDatosFluctuacion.no_DocumentoSap;
                        worksheet.Cells[("L" + lFila)].Value = lDatosFluctuacion.moneda;
                        worksheet.Cells[("M" + lFila)].Value = lDatosFluctuacion.tC_Provision;
                        worksheet.Cells[("N" + lFila)].Value = lDatosFluctuacion.tC_Cierre;
                        worksheet.Cells[("O" + lFila)].Value = lDatosFluctuacion.tC_Facturado;
                        worksheet.Cells[("P" + lFila)].Value = lDatosFluctuacion.importe_Provision;
                        worksheet.Cells[("Q" + lFila)].Value = lDatosFluctuacion.importe_ProvisionMXN;
                        worksheet.Cells[("R" + lFila)].Value = lDatosFluctuacion.importe_Revaluado;
                        worksheet.Cells[("S" + lFila)].Value = lDatosFluctuacion.importe_Facturado;
                        worksheet.Cells[("T" + lFila)].Value = lDatosFluctuacion.importe_Facturado_Provision;
                        worksheet.Cells[("U" + lFila)].Value = lDatosFluctuacion.facturado_MXN;
                        worksheet.Cells[("V" + lFila)].Value = lDatosFluctuacion.variacion_MXN;
                        worksheet.Cells[("W" + lFila)].Value = lDatosFluctuacion.efecto_Operativo;
                        worksheet.Cells[("X" + lFila)].Value = lDatosFluctuacion.fluctuacion_Cambiaria;
                        worksheet.Cells[("Y" + lFila)].Value = lDatosFluctuacion.estatus;
                        worksheet.Cells[("Z" + lFila)].Value = lDatosFluctuacion.cuenta_Fluctuacion ;

                        TotalImporteProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Provision);
                        TotalImporteProvisionMXN += Convert.ToDecimal(lDatosFluctuacion.importe_ProvisionMXN);
                        TotalImporteRevaluado += Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
                        TotalImporteFacturado += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado);
                        TotalImpFacSopProvision += Convert.ToDecimal(lDatosFluctuacion.importe_Facturado_Provision);
                        TotalFacturadoMXN += Convert.ToDecimal(lDatosFluctuacion.facturado_MXN);
                        TotalVariacionMXN += Convert.ToDecimal(lDatosFluctuacion.variacion_MXN);
                        TotalEfectoOperativo += Convert.ToDecimal(lDatosFluctuacion.efecto_Operativo);
                        TotalFluctuacionCambiaria += Convert.ToDecimal(lDatosFluctuacion.fluctuacion_Cambiaria);

                        lFila++;
                    }
                    int lFila2 = lFila + 1;

                    foreach (var lDatosFluctuacion in lResultadoConsulta)
                    {
                        worksheet.Cells[("O" + lFila2)].Value = "TOTAL";
                        worksheet.Cells[("P" + lFila2)].Value = TotalImporteProvision;
                        worksheet.Cells[("Q" + lFila2)].Value = TotalImporteProvisionMXN;
                        worksheet.Cells[("R" + lFila2)].Value = TotalImporteRevaluado;
                        worksheet.Cells[("S" + lFila2)].Value = TotalImporteFacturado;
                        worksheet.Cells[("T" + lFila2)].Value = TotalImpFacSopProvision;
                        worksheet.Cells[("U" + lFila2)].Value = TotalFacturadoMXN;
                        worksheet.Cells[("V" + lFila2)].Value = TotalVariacionMXN;
                        worksheet.Cells[("W" + lFila2)].Value = TotalEfectoOperativo;
                        worksheet.Cells[("X" + lFila2)].Value = TotalFluctuacionCambiaria;
                        worksheet.Cells[("X" + lFila2)].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        worksheet.Cells[("X" + lFila2)].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);
                    }

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                }
                catch (Exception err)
                {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }


    }
}
