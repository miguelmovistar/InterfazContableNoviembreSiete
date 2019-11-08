using IC2.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class DevengoCostoLDIController : Controller
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
        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from periodos in db.DevengoCosto
                            group periodos by periodos.FechaSolicitud into g
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
        public JsonResult LlenaGridDocumento(DateTime periodo, int start, int limit)
        {
            object respuesta = null;
            var listDev = new List<object>();
            var total = 0;
            try {
                var lista = db.sp_DevengoCostoLDIGET(1, periodo).ToList();
                lista.ForEach(devengo =>
                {
                    listDev.Add(new
                    {
                        CuentaPiv = $"{devengo.CuentaResultados}-{devengo.Servicio}",
                        CuentaResultados = devengo.CuentaResultados,
                        CentroCostos = devengo.CentroCostos,
                        AreaFuncional = devengo.AreaFuncional,
                        Servicio = devengo.Servicio,
                        Acreedor = devengo.Acreedor,
                        SoGL = devengo.SoGL,
                        Grupo = devengo.Grupo,
                        NombreCorto = devengo.NombreCorto,
                        Moneda = devengo.Moneda,
                        FechaConsumo = devengo.FechaConsumo,
                        FechaSolicitud = devengo.FechaSolicitud,
                        TipoCambio = devengo.TipoCambio,
                        TipoCambioFactura = devengo.TipoCambioFactura,
                        CancelacionProvision = devengo.CancelacionProvision,
                        CancelacionprovisionNCR = devengo.CancelacionprovisionNCR,
                        Facturacion = devengo.Facturacion,
                        NCREmitidas = devengo.NCREmitidas,
                        Provision = devengo.Provision,
                        ProvisionNCR = devengo.ProvisionNCR,
                        Exceso = devengo.Exceso,
                        TotalDevengo = devengo.TotalDevengo
                    });
                });
                total = listDev.Count();
                listDev = listDev.Skip(start).Take(limit).ToList();
                respuesta = new { results = listDev, start = start, limit = limit, total = total, success = true };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenaGridLocal(DateTime periodo, int start, int limit)
        {
            object respuesta = null;
            var lista = new List<sp_DevengoCostoLDIGET_Result>();
            var listDev = new List<object>();
            var total = 0;
            try {
                lista = db.sp_DevengoCostoLDIGET(2, periodo).ToList();
                lista.ForEach(devengo =>
                {
                    listDev.Add(new
                    {
                        CuentaPiv = $"{devengo.CuentaResultados}-{devengo.Servicio}",
                        CuentaResultados = devengo.CuentaResultados,
                        CentroCostos = devengo.CentroCostos,
                        AreaFuncional = devengo.AreaFuncional,
                        Servicio = devengo.Servicio,
                        Acreedor = devengo.Acreedor,
                        SoGL = devengo.SoGL,
                        Grupo = devengo.Grupo,
                        NombreCorto = devengo.NombreCorto,
                        Moneda = devengo.Moneda,
                        FechaConsumo = devengo.FechaConsumo,
                        FechaSolicitud = devengo.FechaSolicitud,
                        TipoCambio = devengo.TipoCambio,
                        TipoCambioFactura = devengo.TipoCambioFactura,
                        CancelacionProvision = devengo.CancelacionProvision,
                        CancelacionprovisionNCR = devengo.CancelacionprovisionNCR,
                        Facturacion = devengo.Facturacion,
                        NCREmitidas = devengo.NCREmitidas,
                        Provision = devengo.Provision,
                        ProvisionNCR = devengo.ProvisionNCR,
                        Exceso = devengo.Exceso,
                        TotalDevengo = devengo.TotalDevengo,
                        devengo.Fluctuacion,
                        devengo.TotalDevengoFluctuacion
                    });
                });
                total = listDev.Count();
                listDev = listDev.Skip(start).Take(limit).ToList();
                respuesta = new { results = listDev, start = start, limit = limit, total = total, succes = true };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
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
                        totalImporteRevaluado += Convert.ToDecimal(lDatosFluctuacion.importe_Provision_MXN);
                        totalImporteFacturado += Convert.ToDecimal(lDatosFluctuacion.importe_Revaluado);
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
        public JsonResult ExportarReporte(DateTime periodo)
        {
            string nombreArchivo = "Devengo Costo LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/Devengo_Costo_LDI.xlsx");
            object respuesta = null;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile)) {
                try {
                    /* Devengo Documento */
                    ExcelWorksheet worksheetDocumento = excelPackage.Workbook.Worksheets["Moneda Documento"];
                    HojaDevengoDocumento(ref worksheetDocumento, periodo, 1, db);
                    /* Devengo Local */
                    ExcelWorksheet worksheetLocal = excelPackage.Workbook.Worksheets["Moneda Local"];
                    HojaDevengoLocal(ref worksheetLocal, periodo, 2, db);
                    /* Fluctuaciones */
                    ExcelWorksheet worksheetFluctuaciones = excelPackage.Workbook.Worksheets["Fluctuación"];
                    FluctuacionCostosLDIController.HojaFluctuacionCosto(ref worksheetFluctuaciones, periodo, true, db);

                    /* GENERAR ARCHIVO */
                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                } catch (Exception err) {
                    respuesta = new { results = err.Message, success = false };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }
        public static void HojaDevengoDocumento(ref ExcelWorksheet worksheet, DateTime periodo, int tabla, ICPruebaEntities db)
        {
            decimal[] listaSubtotales = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            var lista = new List<sp_DevengoCostoLDIGET_Result>();
            var dtDocumento = new DataTable();

            lista = db.sp_DevengoCostoLDIGET(tabla, periodo).ToList();
            dtDocumento.Columns.Add("Cuenta");
            dtDocumento.Columns.Add("Servicio");

            dtDocumento.Columns.Add("CentroCosto");
            dtDocumento.Columns.Add("Area_Funcional");

            dtDocumento.Columns.Add("Acreedor");
            dtDocumento.Columns.Add("Sociedad");
            dtDocumento.Columns.Add("Grupo");
            dtDocumento.Columns.Add("NombreCorto");
            dtDocumento.Columns.Add("Moneda");
            dtDocumento.Columns.Add("FechaConsumo");
            dtDocumento.Columns.Add("FechaSolicitud");
            dtDocumento.Columns.Add("TipoCambio");
            dtDocumento.Columns.Add("TipoCambioFactura");
            dtDocumento.Columns.Add("CancelProvision");
            dtDocumento.Columns.Add("CancelProvNCR");
            dtDocumento.Columns.Add("Facturacion");
            dtDocumento.Columns.Add("NCREmitidas");
            dtDocumento.Columns.Add("Provision");
            dtDocumento.Columns.Add("ProvisionNCR");
            dtDocumento.Columns.Add("Exceso");
            dtDocumento.Columns.Add("TotalDevengo");
            foreach (var elemento in lista) {
                DataRow rowdt = default(DataRow);
                rowdt = dtDocumento.NewRow();
                rowdt["Cuenta"] = elemento.CuentaResultados;
                rowdt["Servicio"] = elemento.Servicio;
                rowdt["CentroCosto"] = elemento.CentroCostos;
                rowdt["Area_Funcional"] = elemento.AreaFuncional;
                rowdt["Acreedor"] = elemento.Acreedor;
                rowdt["Sociedad"] = elemento.SoGL;
                rowdt["Grupo"] = elemento.Grupo;
                rowdt["NombreCorto"] = elemento.NombreCorto;
                rowdt["Moneda"] = elemento.Moneda;
                rowdt["FechaConsumo"] = elemento.FechaConsumo;
                rowdt["FechaSolicitud"] = elemento.FechaSolicitud;
                rowdt["TipoCambio"] = elemento.TipoCambio;
                rowdt["TipoCambioFactura"] = elemento.TipoCambioFactura;
                rowdt["CancelProvision"] = elemento.CancelacionProvision;
                rowdt["CancelProvNCR"] = elemento.CancelacionprovisionNCR;
                rowdt["Facturacion"] = elemento.Facturacion;
                rowdt["NCREmitidas"] = elemento.NCREmitidas;
                rowdt["Provision"] = elemento.Provision;
                rowdt["ProvisionNCR"] = elemento.ProvisionNCR;
                rowdt["Exceso"] = elemento.Exceso;
                rowdt["TotalDevengo"] = elemento.TotalDevengo;
                dtDocumento.Rows.Add(rowdt);
            }
            worksheet.Cells[("A3")].Value = DateTime.Now.ToString("dd-MM-yyyy");

            int lFila = 7;
            long lCuentaPrimaria = 0, lCuentaSecundaria = 0;
            string lServicioPrincipal = string.Empty, lServicioSecundario = string.Empty;

            for (int lIteracion = 0; lIteracion < dtDocumento.Rows.Count;) {
                if (lIteracion == 0 || lIteracion <= dtDocumento.Rows.Count - 2) {
                    lCuentaPrimaria = Convert.ToInt64(dtDocumento.Rows[lIteracion]["Cuenta"]);

                    if (dtDocumento.Rows.Count > 1) {
                        lCuentaSecundaria = Convert.ToInt64(dtDocumento.Rows[lIteracion + 1]["Cuenta"]);
                        lServicioSecundario = dtDocumento.Rows[lIteracion + 1]["Servicio"].ToString();
                    }

                    lServicioPrincipal = dtDocumento.Rows[lIteracion]["Servicio"].ToString();


                    if (lIteracion == 0) {
                        ColocarDatosCuenta(ref worksheet, dtDocumento.Rows[lIteracion], lFila, true);
                        AcumularSubtotales(dtDocumento.Rows[lIteracion], listaSubtotales, true);

                        if (lServicioPrincipal != lServicioSecundario) {
                            ColocarEstilos(worksheet, lFila, lCuentaPrimaria, true);
                            ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, true);
                            lFila++;
                        }

                        lCuentaPrimaria = lCuentaSecundaria;
                        lServicioPrincipal = lServicioSecundario;

                        lIteracion++;
                        lFila++;

                    } else {
                        ColocarDatosCuenta(ref worksheet, dtDocumento.Rows[lIteracion], lFila, true);
                        AcumularSubtotales(dtDocumento.Rows[lIteracion], listaSubtotales, true);

                        if (lCuentaPrimaria != lCuentaSecundaria) {
                            ColocarEstilos(worksheet, lFila, lCuentaPrimaria, true);
                            ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, true);
                            lFila++;
                        } else if (lServicioPrincipal != lServicioSecundario) {
                            ColocarEstilos(worksheet, lFila, lCuentaPrimaria, true);
                            ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, true);
                            lFila++;
                        }

                        lCuentaPrimaria = lCuentaSecundaria;
                        lServicioPrincipal = lServicioSecundario;

                        lIteracion++;
                        lFila++;
                    }
                } else {
                    if (lCuentaPrimaria != lCuentaSecundaria) {
                        ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, true);
                        ColocarEstilos(worksheet, lFila, lCuentaPrimaria, true);
                        lFila++;
                    } else if (lServicioPrincipal != lServicioSecundario) {
                        ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, true);
                        ColocarEstilos(worksheet, lFila, lCuentaPrimaria, true);
                        lFila++;
                    }

                    ColocarDatosCuenta(ref worksheet, dtDocumento.Rows[lIteracion], lFila, true);
                    AcumularSubtotales(dtDocumento.Rows[lIteracion], listaSubtotales, true);

                    ColocarEstilos(worksheet, lFila, lCuentaPrimaria, true);
                    ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, true);

                    lIteracion++;
                }
            }
            worksheet.Cells["A7:W" + lFila].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        }
        public static void HojaDevengoLocal(ref ExcelWorksheet worksheet, DateTime periodo, int tabla, ICPruebaEntities db)
        {
            decimal[] listaSubtotales = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            var lista = new List<sp_DevengoCostoLDIGET_Result>();
            var dtDocumento = new DataTable();

            lista = db.sp_DevengoCostoLDIGET(tabla, periodo).ToList();
            dtDocumento.Columns.Add("Cuenta");
            dtDocumento.Columns.Add("Servicio");

            dtDocumento.Columns.Add("CentroCosto");
            dtDocumento.Columns.Add("Area_Funcional");

            dtDocumento.Columns.Add("Acreedor");
            dtDocumento.Columns.Add("Sociedad");
            dtDocumento.Columns.Add("Grupo");
            dtDocumento.Columns.Add("NombreCorto");
            dtDocumento.Columns.Add("Moneda");
            dtDocumento.Columns.Add("FechaConsumo");
            dtDocumento.Columns.Add("FechaSolicitud");
            dtDocumento.Columns.Add("TipoCambio");
            dtDocumento.Columns.Add("TipoCambioFactura");
            dtDocumento.Columns.Add("CancelProvision");
            dtDocumento.Columns.Add("CancelProvNCR");
            dtDocumento.Columns.Add("Facturacion");
            dtDocumento.Columns.Add("NCREmitidas");
            dtDocumento.Columns.Add("Provision");
            dtDocumento.Columns.Add("ProvisionNCR");
            dtDocumento.Columns.Add("Exceso");
            dtDocumento.Columns.Add("TotalDevengo");
            dtDocumento.Columns.Add("Fluctuacion");
            dtDocumento.Columns.Add("TotalDevengoFluctuacion");

            foreach (var elemento in lista) {
                DataRow rowdt = default(DataRow);
                rowdt = dtDocumento.NewRow();
                rowdt["Cuenta"] = elemento.CuentaResultados;
                rowdt["Servicio"] = elemento.Servicio;
                rowdt["CentroCosto"] = elemento.CentroCostos;
                rowdt["Area_Funcional"] = elemento.AreaFuncional;
                rowdt["Acreedor"] = elemento.Acreedor;
                rowdt["Sociedad"] = elemento.SoGL;
                rowdt["Grupo"] = elemento.Grupo;
                rowdt["NombreCorto"] = elemento.NombreCorto;
                rowdt["Moneda"] = elemento.Moneda;
                rowdt["FechaConsumo"] = elemento.FechaConsumo;
                rowdt["FechaSolicitud"] = elemento.FechaSolicitud;
                rowdt["TipoCambio"] = elemento.TipoCambio;
                rowdt["TipoCambioFactura"] = elemento.TipoCambioFactura;
                rowdt["CancelProvision"] = elemento.CancelacionProvision;
                rowdt["CancelProvNCR"] = elemento.CancelacionprovisionNCR;
                rowdt["Facturacion"] = elemento.Facturacion;
                rowdt["NCREmitidas"] = elemento.NCREmitidas;
                rowdt["Provision"] = elemento.Provision;
                rowdt["ProvisionNCR"] = elemento.ProvisionNCR;
                rowdt["Exceso"] = elemento.Exceso;
                rowdt["TotalDevengo"] = elemento.TotalDevengo;
                rowdt["Fluctuacion"] = elemento.Fluctuacion;
                rowdt["TotalDevengoFluctuacion"] = elemento.TotalDevengoFluctuacion;

                dtDocumento.Rows.Add(rowdt);
            }

            worksheet.Cells[("A3")].Value = DateTime.Now.ToString("dd-MM-yyyy");

            int lFila = 7;
            long lCuentaPrimaria = 0, lCuentaSecuandaria = 0;
            string lServicioPrincipal = string.Empty, lServicioSecundario = string.Empty;

            for (int lIteracion = 0; lIteracion < dtDocumento.Rows.Count;) {
                if (lIteracion == 0 || lIteracion <= dtDocumento.Rows.Count - 2) {
                    lCuentaPrimaria = Convert.ToInt64(dtDocumento.Rows[lIteracion]["Cuenta"]);

                    if (dtDocumento.Rows.Count > 1) {
                        lCuentaSecuandaria = Convert.ToInt64(dtDocumento.Rows[lIteracion + 1]["Cuenta"]);
                        lServicioSecundario = dtDocumento.Rows[lIteracion + 1]["Servicio"].ToString();
                    }

                    lServicioPrincipal = dtDocumento.Rows[lIteracion]["Servicio"].ToString();


                    if (lIteracion == 0) {
                        ColocarDatosCuenta(ref worksheet, dtDocumento.Rows[lIteracion], lFila, false);
                        AcumularSubtotales(dtDocumento.Rows[lIteracion], listaSubtotales, false);

                        if (lServicioPrincipal != lServicioSecundario) {
                            ColocarEstilos(worksheet, lFila, lCuentaPrimaria, false);
                            ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, false);
                            lFila++;
                        }

                        lCuentaPrimaria = lCuentaSecuandaria;
                        lServicioPrincipal = lServicioSecundario;

                        lIteracion++;
                        lFila++;

                    } else {
                        ColocarDatosCuenta(ref worksheet, dtDocumento.Rows[lIteracion], lFila, false);
                        AcumularSubtotales(dtDocumento.Rows[lIteracion], listaSubtotales, false);

                        if (lCuentaPrimaria != lCuentaSecuandaria) {
                            ColocarEstilos(worksheet, lFila, lCuentaPrimaria, false);
                            ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, false);
                            lFila++;
                        } else if (lServicioPrincipal != lServicioSecundario) {
                            ColocarEstilos(worksheet, lFila, lCuentaPrimaria, false);
                            ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, false);
                            lFila++;
                        }

                        lCuentaPrimaria = lCuentaSecuandaria;
                        lServicioPrincipal = lServicioSecundario;

                        lIteracion++;
                        lFila++;
                    }
                } else {
                    if (lCuentaPrimaria != lCuentaSecuandaria) {
                        ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, false);
                        ColocarEstilos(worksheet, lFila, lCuentaPrimaria, false);
                        lFila++;
                    } else if (lServicioPrincipal != lServicioSecundario) {
                        ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, false);
                        ColocarEstilos(worksheet, lFila, lCuentaPrimaria, false);
                        lFila++;
                    }

                    ColocarDatosCuenta(ref worksheet, dtDocumento.Rows[lIteracion], lFila, false);
                    AcumularSubtotales(dtDocumento.Rows[lIteracion], listaSubtotales, false);

                    ColocarEstilos(worksheet, lFila, lCuentaPrimaria, false);
                    ColocarSubtotales(ref worksheet, lFila, lCuentaPrimaria, listaSubtotales, false);

                    lIteracion++;
                }
            }
            worksheet.Cells["A7:W" + lFila].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        }
        public static void ColocarEstilos(ExcelWorksheet worksheet, int pFila, long pCuentaPrimaria, Boolean tipo)
        {
            pFila++;
            string rango = "";
            if (tipo)
                rango = ("A" + pFila + ":U" + pFila);
            else
                rango = ("A" + pFila + ":W" + pFila);

            worksheet.Cells[rango].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheet.Cells[rango].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
        }
        public static void ColocarDatosCuenta(ref ExcelWorksheet worksheet, DataRow pDevengoCosto, int plFila, Boolean tipo)
        {
            worksheet.Cells[("A" + plFila)].Value = pDevengoCosto["Cuenta"];
            worksheet.Cells[("B" + plFila)].Value = pDevengoCosto["CentroCosto"];
            worksheet.Cells[("C" + plFila)].Value = pDevengoCosto["Area_Funcional"];
            worksheet.Cells[("D" + plFila)].Value = pDevengoCosto["Servicio"];
            worksheet.Cells[("E" + plFila)].Value = pDevengoCosto["Acreedor"];
            worksheet.Cells[("F" + plFila)].Value = pDevengoCosto["Sociedad"];
            worksheet.Cells[("G" + plFila)].Value = pDevengoCosto["Grupo"];
            worksheet.Cells[("H" + plFila)].Value = pDevengoCosto["NombreCorto"];
            worksheet.Cells[("I" + plFila)].Value = pDevengoCosto["Moneda"];
            worksheet.Cells[("J" + plFila)].Value = Convert.ToDateTime(pDevengoCosto["FechaConsumo"]).ToString("dd-MM-yyyy");
            worksheet.Cells[("K" + plFila)].Value = Convert.ToDateTime(pDevengoCosto["FechaSolicitud"]).ToString("dd-MM-yyyy");
            worksheet.Cells[("L" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["TipoCambio"].ToString())) ? Convert.ToDecimal(pDevengoCosto["TipoCambio"]) : (0);
            worksheet.Cells[("L" + plFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
            worksheet.Cells[("M" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["TipoCambioFactura"].ToString())) ? Convert.ToDecimal(pDevengoCosto["TipoCambioFactura"]) : (0);
            worksheet.Cells[("M" + plFila)].Style.Numberformat.Format = "_-$* #,##0.0000_-";
            worksheet.Cells[("N" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["CancelProvision"].ToString())) ? Convert.ToDecimal(pDevengoCosto["CancelProvision"]) : (0);
            worksheet.Cells[("N" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("O" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["CancelProvNCR"].ToString())) ? Convert.ToDecimal(pDevengoCosto["CancelProvNCR"]) : (0);
            worksheet.Cells[("O" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("P" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["Facturacion"].ToString())) ? Convert.ToDecimal(pDevengoCosto["Facturacion"]) : (0);
            worksheet.Cells[("P" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("Q" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["NCREmitidas"].ToString())) ? Convert.ToDecimal(pDevengoCosto["NCREmitidas"]) : (0);
            worksheet.Cells[("Q" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("R" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["Provision"].ToString())) ? Convert.ToDecimal(pDevengoCosto["Provision"]) : (0);
            worksheet.Cells[("R" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("S" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["ProvisionNCR"].ToString())) ? Convert.ToDecimal(pDevengoCosto["ProvisionNCR"]) : (0);
            worksheet.Cells[("S" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("T" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["Exceso"].ToString())) ? Convert.ToDecimal(pDevengoCosto["Exceso"]) : (0);
            worksheet.Cells[("T" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("U" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["TotalDevengo"].ToString())) ? Convert.ToDecimal(pDevengoCosto["TotalDevengo"]) : (0);
            worksheet.Cells[("U" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

            if (!tipo) {
                worksheet.Cells[("V" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["Fluctuacion"].ToString())) ? Convert.ToDecimal(pDevengoCosto["Fluctuacion"]) : (0);
                worksheet.Cells[("V" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                worksheet.Cells[("W" + plFila)].Value = (!String.IsNullOrEmpty(pDevengoCosto["TotalDevengoFluctuacion"].ToString())) ? Convert.ToDecimal(pDevengoCosto["TotalDevengoFluctuacion"]) : (0);
                worksheet.Cells[("W" + plFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            }
        }
        public static void AcumularSubtotales(DataRow pDevengoCosto, decimal[] listaSubtotales, Boolean tipo)
        {
            listaSubtotales[0] += (!String.IsNullOrEmpty(pDevengoCosto["CancelProvision"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["CancelProvision"])) : (0);
            listaSubtotales[1] += (!String.IsNullOrEmpty(pDevengoCosto["CancelProvNCR"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["CancelProvNCR"])) : (0);
            listaSubtotales[2] += (!String.IsNullOrEmpty(pDevengoCosto["Facturacion"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["Facturacion"])) : (0);
            listaSubtotales[3] += (!String.IsNullOrEmpty(pDevengoCosto["NCREmitidas"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["NCREmitidas"])) : (0);
            listaSubtotales[4] += (!String.IsNullOrEmpty(pDevengoCosto["Provision"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["Provision"])) : (0);
            listaSubtotales[5] += (!String.IsNullOrEmpty(pDevengoCosto["ProvisionNCR"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["ProvisionNCR"])) : (0);
            listaSubtotales[6] += (!String.IsNullOrEmpty(pDevengoCosto["Exceso"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["Exceso"])) : (0);
            listaSubtotales[7] += (!String.IsNullOrEmpty(pDevengoCosto["TotalDevengo"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["TotalDevengo"])) : (0);
            if (!tipo) {
                listaSubtotales[8] += (!String.IsNullOrEmpty(pDevengoCosto["Fluctuacion"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["Fluctuacion"])) : (0);
                listaSubtotales[9] += (!String.IsNullOrEmpty(pDevengoCosto["TotalDevengoFluctuacion"].ToString())) ? (Convert.ToDecimal(pDevengoCosto["TotalDevengoFluctuacion"])) : (0);
            }
        }
        public static void ColocarSubtotales(ref ExcelWorksheet worksheet, int pFila, long pCuentaPrimaria, decimal[] listaSubtotales, Boolean tipo)
        {
            pFila++;
            worksheet.Cells[("A" + pFila)].Value = pCuentaPrimaria;
            worksheet.Cells[("M" + pFila)].Value = "Subtotal: ";
            worksheet.Cells[("N" + pFila)].Value = listaSubtotales[0];
            worksheet.Cells[("N" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("O" + pFila)].Value = listaSubtotales[1];
            worksheet.Cells[("O" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("P" + pFila)].Value = listaSubtotales[2];
            worksheet.Cells[("P" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("Q" + pFila)].Value = listaSubtotales[3];
            worksheet.Cells[("Q" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("R" + pFila)].Value = listaSubtotales[4];
            worksheet.Cells[("R" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("S" + pFila)].Value = listaSubtotales[5];
            worksheet.Cells[("S" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("T" + pFila)].Value = listaSubtotales[6];
            worksheet.Cells[("T" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            worksheet.Cells[("U" + pFila)].Value = listaSubtotales[7];
            worksheet.Cells[("U" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            if (!tipo) {
                worksheet.Cells[("V" + pFila)].Value = listaSubtotales[6];
                worksheet.Cells[("V" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
                worksheet.Cells[("W" + pFila)].Value = listaSubtotales[7];
                worksheet.Cells[("W" + pFila)].Style.Numberformat.Format = "_-$* #,##0.00_-";
            }
            Array.Clear(listaSubtotales, 0, listaSubtotales.Length);
        }
    }
}