using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;
using IC2.Servicios;

namespace IC2.Controllers
{
    public class DatosROMController : Controller
    {
        // GET: DatosROM
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

        public List<object> CargaTAPINA(string periodo, string tipocarga, string ordencarga)
        {
            List<object> lista = new List<object>();

            try {
                var datos = from oDatos in db.datosTraficoTAPINA
                            join oDocumento in db.cargaDocumentoRoaming
                            on oDatos.idCarga equals oDocumento.Id
                            where oDocumento.periodoCarga == periodo
                            && oDocumento.tipoCarga == tipocarga
                            && oDocumento.ordenCarga == ordencarga
                            select new
                            {
                                oDatos.Id,
                                oDatos.settlementDate,
                                oDatos.myPMN,
                                oDatos.VRSFCMTSRH,
                                oDatos.codigoAcreedor,
                                oDatos.theirPMN,
                                oDatos.operatorName,
                                oDatos.rapFileName,
                                oDatos.rapFileAvailableTimeStamp,
                                oDatos.rapStatus,
                                oDatos.rapFileType,
                                oDatos.rapAdjustmentIndicator,
                                oDatos.tapFileType,
                                oDatos.tapFileName,
                                oDatos.callType,
                                oDatos.numberCalls,
                                oDatos.totalRealVolume,
                                oDatos.totalChargedVolume,
                                oDatos.realDuration,
                                oDatos.chargedDuration,
                                oDatos.chargesTaxesSDR,
                                oDatos.taxes,
                                oDatos.totalCharges,
                                oDatos.chargesTaxesLC,
                                oDatos.taxesLocalCurrency1,
                                oDatos.taxesLocalCurrency2,
                                oDatos.totalChargesLC,
                                oDatos.callDate
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        settlementDate = elemento.settlementDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                        myPMN = elemento.myPMN,
                        VRSFCMTSRH = elemento.VRSFCMTSRH,
                        codigoAcreedor = elemento.codigoAcreedor,
                        theirPMN = elemento.theirPMN,
                        operatorName = elemento.operatorName,
                        rapFileName = elemento.rapFileName,
                        rapFileAvailableTimeStamp = elemento.rapFileAvailableTimeStamp,
                        rapStatus = elemento.rapStatus,
                        rapFileType = elemento.rapFileType,
                        rapAdjustmentIndicator = elemento.rapAdjustmentIndicator,
                        tapFileType = elemento.tapFileType,
                        tapFileName = elemento.tapFileName,
                        callType = elemento.callType,
                        numberCalls = elemento.numberCalls,
                        totalRealVolume = elemento.totalRealVolume,
                        totalChargedVolume = elemento.totalChargedVolume,
                        realDuration = elemento.realDuration,
                        chargedDuration = elemento.chargedDuration,
                        chargesTaxesSDR = elemento.chargesTaxesSDR,
                        taxes = elemento.taxes,
                        totalCharges = elemento.totalCharges,
                        chargesTaxesLC = elemento.chargesTaxesLC,
                        taxesLocalCurrency1 = elemento.taxesLocalCurrency1,
                        taxesLocalCurrency2 = elemento.taxesLocalCurrency2,
                        totalChargesLC = elemento.totalChargesLC,
                        callDate = elemento.callDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                    });
                }
            } catch (Exception e) {
                lista = null;
                Console.Write(e.Message);
            }
            return lista;
        }

        public List<object> CargaTAPINB(string periodo, string tipocarga, string ordencarga)
        {
            List<object> lista = new List<object>();

            try {
                var datos = from oDatos in db.datosTraficoTAPINB
                            join oDocumento in db.cargaDocumentoRoaming
                            on oDatos.idCarga equals oDocumento.Id
                            where oDocumento.periodoCarga == periodo
                            && oDocumento.tipoCarga == tipocarga
                            && oDocumento.ordenCarga == ordencarga
                            select new
                            {
                                oDatos.Id,
                                oDatos.settlementDate,
                                oDatos.myPMN,
                                oDatos.VRSFCMTSRH,
                                oDatos.codigoAcreedor,
                                oDatos.theirPMN,
                                oDatos.operatorName,
                                oDatos.rapFileName,
                                oDatos.rapFileAvailableTimeStamp,
                                oDatos.rapStatus,
                                oDatos.rapFileType,
                                oDatos.rapAdjustmentIndicator,
                                oDatos.tapFileType,
                                oDatos.tapFileName,
                                oDatos.callType,
                                oDatos.numberCalls,
                                oDatos.totalRealVolume,
                                oDatos.totalChargedVolume,
                                oDatos.realDuration,
                                oDatos.chargedDuration,
                                oDatos.chargesTaxesSDR,
                                oDatos.taxes,
                                oDatos.totalCharges,
                                oDatos.chargesTaxesLC,
                                oDatos.taxesLocalCurrency1,
                                oDatos.taxesLocalCurrency2,
                                oDatos.totalChargesLC,
                                oDatos.callDate
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        settlementDate = elemento.settlementDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                        myPMN = elemento.myPMN,
                        VRSFCMTSRH = elemento.VRSFCMTSRH,
                        codigoAcreedor = elemento.codigoAcreedor,
                        theirPMN = elemento.theirPMN,
                        operatorName = elemento.operatorName,
                        rapFileName = elemento.rapFileName,
                        rapFileAvailableTimeStamp = elemento.rapFileAvailableTimeStamp,
                        rapStatus = elemento.rapStatus,
                        rapFileType = elemento.rapFileType,
                        rapAdjustmentIndicator = elemento.rapAdjustmentIndicator,
                        tapFileType = elemento.tapFileType,
                        tapFileName = elemento.tapFileName,
                        callType = elemento.callType,
                        numberCalls = elemento.numberCalls,
                        totalRealVolume = elemento.totalRealVolume,
                        totalChargedVolume = elemento.totalChargedVolume,
                        realDuration = elemento.realDuration,
                        chargedDuration = elemento.chargedDuration,
                        chargesTaxesSDR = elemento.chargesTaxesSDR,
                        taxes = elemento.taxes,
                        totalCharges = elemento.totalCharges,
                        chargesTaxesLC = elemento.chargesTaxesLC,
                        taxesLocalCurrency1 = elemento.taxesLocalCurrency1,
                        taxesLocalCurrency2 = elemento.taxesLocalCurrency2,
                        totalChargesLC = elemento.totalChargesLC,
                        callDate = elemento.callDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                    });
                }
            } catch (Exception ) {
                lista = null;
            }

            return lista;
        }

        public List<object> CargaTAPOUTA(string periodo, string tipocarga, string ordencarga)
        {
            List<object> lista = new List<object>();

            try {
                var datos = from oDatos in db.datosTraficoTAPOUTA
                            join oDocumento in db.cargaDocumentoRoaming
                            on oDatos.idCarga equals oDocumento.Id
                            where oDocumento.periodoCarga == periodo
                            && oDocumento.tipoCarga == tipocarga
                            && oDocumento.ordenCarga == ordencarga
                            select new
                            {
                                oDatos.Id,
                                oDatos.settlementDate,
                                oDatos.myPMN,
                                oDatos.VRSFCMTSRH,
                                oDatos.codigoDeudor,
                                oDatos.theirPMN,
                                oDatos.operatorName,
                                oDatos.rapFileName,
                                oDatos.rapFileAvailableTimeStamp,
                                oDatos.rapStatus,
                                oDatos.rapFileType,
                                oDatos.rapAdjustmentIndicator,
                                oDatos.tapFileType,
                                oDatos.tapFileName,
                                oDatos.callType,
                                oDatos.numberCalls,
                                oDatos.totalRealVolume,
                                oDatos.totalChargedVolume,
                                oDatos.realDuration,
                                oDatos.chargedDuration,
                                oDatos.chargesTaxesSDR,
                                oDatos.taxes,
                                oDatos.totalCharges,
                                oDatos.chargesTaxesLC,
                                oDatos.taxesLocalCurrency1,
                                oDatos.taxesLocalCurrency2,
                                oDatos.totalChargesLC,
                                oDatos.callDate
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        settlementDate = elemento.settlementDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                        myPMN = elemento.myPMN,
                        VRSFCMTSRH = elemento.VRSFCMTSRH,
                        codigoAcreedor = elemento.codigoDeudor,
                        theirPMN = elemento.theirPMN,
                        operatorName = elemento.operatorName,
                        rapFileName = elemento.rapFileName,
                        rapFileAvailableTimeStamp = elemento.rapFileAvailableTimeStamp,
                        rapStatus = elemento.rapStatus,
                        rapFileType = elemento.rapFileType,
                        rapAdjustmentIndicator = elemento.rapAdjustmentIndicator,
                        tapFileType = elemento.tapFileType,
                        tapFileName = elemento.tapFileName,
                        callType = elemento.callType,
                        numberCalls = elemento.numberCalls,
                        totalRealVolume = elemento.totalRealVolume,
                        totalChargedVolume = elemento.totalChargedVolume,
                        realDuration = elemento.realDuration,
                        chargedDuration = elemento.chargedDuration,
                        chargesTaxesSDR = elemento.chargesTaxesSDR,
                        taxes = elemento.taxes,
                        totalCharges = elemento.totalCharges,
                        chargesTaxesLC = elemento.chargesTaxesLC,
                        taxesLocalCurrency1 = elemento.taxesLocalCurrency1,
                        taxesLocalCurrency2 = elemento.taxesLocalCurrency2,
                        totalChargesLC = elemento.totalChargesLC,
                        callDate = elemento.callDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                    });
                }
                //respuesta = new { success = true, results = lista, total = total };
            } catch (Exception ) {
                lista = null;
            }

            return lista;
        }

        public List<object> CargaTAPOUTB(string periodo, string tipocarga, string ordencarga)
        {
            List<object> lista = new List<object>();

            try {
                var datos = from oDatos in db.datosTraficoTAPOUTB
                            join oDocumento in db.cargaDocumentoRoaming
                            on oDatos.idCarga equals oDocumento.Id
                            where oDocumento.periodoCarga == periodo
                            && oDocumento.tipoCarga == tipocarga
                            && oDocumento.ordenCarga == ordencarga
                            select new
                            {
                                oDatos.Id,
                                oDatos.settlementDate,
                                oDatos.myPMN,
                                oDatos.VRSFCMTSRH,
                                oDatos.codigoDeudor,
                                oDatos.theirPMN,
                                oDatos.operatorName,
                                oDatos.rapFileName,
                                oDatos.rapFileAvailableTimeStamp,
                                oDatos.rapStatus,
                                oDatos.rapFileType,
                                oDatos.rapAdjustmentIndicator,
                                oDatos.tapFileType,
                                oDatos.tapFileName,
                                oDatos.callType,
                                oDatos.numberCalls,
                                oDatos.totalRealVolume,
                                oDatos.totalChargedVolume,
                                oDatos.realDuration,
                                oDatos.chargedDuration,
                                oDatos.chargesTaxesSDR,
                                oDatos.taxes,
                                oDatos.totalCharges,
                                oDatos.chargesTaxesLC,
                                oDatos.taxesLocalCurrency1,
                                oDatos.taxesLocalCurrency2,
                                oDatos.totalChargesLC,
                                oDatos.callDate
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        settlementDate = elemento.settlementDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                        myPMN = elemento.myPMN,
                        VRSFCMTSRH = elemento.VRSFCMTSRH,
                        codigoAcreedor = elemento.codigoDeudor,
                        theirPMN = elemento.theirPMN,
                        operatorName = elemento.operatorName,
                        rapFileName = elemento.rapFileName,
                        rapFileAvailableTimeStamp = elemento.rapFileAvailableTimeStamp,
                        rapStatus = elemento.rapStatus,
                        rapFileType = elemento.rapFileType,
                        rapAdjustmentIndicator = elemento.rapAdjustmentIndicator,
                        tapFileType = elemento.tapFileType,
                        tapFileName = elemento.tapFileName,
                        callType = elemento.callType,
                        numberCalls = elemento.numberCalls,
                        totalRealVolume = elemento.totalRealVolume,
                        totalChargedVolume = elemento.totalChargedVolume,
                        realDuration = elemento.realDuration,
                        chargedDuration = elemento.chargedDuration,
                        chargesTaxesSDR = elemento.chargesTaxesSDR,
                        taxes = elemento.taxes,
                        totalCharges = elemento.totalCharges,
                        chargesTaxesLC = elemento.chargesTaxesLC,
                        taxesLocalCurrency1 = elemento.taxesLocalCurrency1,
                        taxesLocalCurrency2 = elemento.taxesLocalCurrency2,
                        totalChargesLC = elemento.totalChargesLC,
                        callDate = elemento.callDate.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                    });
                }
            } catch (Exception ) {
                lista = null;
            }

            return lista;
        }

        public JsonResult Consulta(string Periodo, int start, int limit)
        {
            var split = Periodo.Split();
            string periodo = split[0];
            string tipocarga = split[2];
            string ordencarga = split[3];
            object respuesta = null;
            int total = 0;
            List<object> lista = new List<object>();

            if (tipocarga == "TAPIN") {
                if (ordencarga == "A") {
                    lista = CargaTAPINA(periodo, tipocarga, ordencarga);
                } else if (ordencarga == "B") {
                    lista = CargaTAPINB(periodo, tipocarga, ordencarga);
                }
            } else if (tipocarga == "TAPOUT") {
                if (ordencarga == "A") {
                    lista = CargaTAPOUTA(periodo, tipocarga, ordencarga);
                } else if (ordencarga == "B") {
                    lista = CargaTAPOUTB(periodo, tipocarga, ordencarga);
                }
            }

            if (lista != null) {
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            } else {
                respuesta = new { success = false, results = "Hubo un error en la carga de datos!", total = 0 };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Exportar(string Periodo)
        {
            var split = Periodo.Split();
            string periodo = split[0];
            string tipocarga = split[2];
            string ordencarga = split[3];
            var nombreArchivo = "TraficoRoaming_" + tipocarga + "_" + ordencarga + "_" + DateTime.ParseExact(periodo, "yyyy/MM/dd", null).ToString("yyyy MMMM", new CultureInfo("es-ES")).ToUpper() + ".xlsx";
            var listas = new Dictionary<string, List<object>>();
            var excel = new Excel();
            byte[] bytesFile = new byte[0];
            object respuesta = null;

            try {
                // Datos
                List<object> lista = new List<object>();

                if (tipocarga == "TAPIN") {
                    if (ordencarga == "A") {
                        lista = CargaTAPINA(periodo, tipocarga, ordencarga);
                    } else if (ordencarga == "B") {
                        lista = CargaTAPINB(periodo, tipocarga, ordencarga);
                    }
                } else if (tipocarga == "TAPOUT") {
                    if (ordencarga == "A") {
                        lista = CargaTAPOUTA(periodo, tipocarga, ordencarga);
                    } else if (ordencarga == "B") {
                        lista = CargaTAPOUTB(periodo, tipocarga, ordencarga);
                    }
                }
                listas.Add("Tráfico " + tipocarga + " " + ordencarga, lista);

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
        public JsonResult LlenaFecha(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try {
                var fechas = from oFecha in db.cargaDocumentoRoaming
                             where oFecha.estatusCarga == "CC"
                             orderby oFecha.periodoCarga descending
                             select new
                             {
                                 oFecha.Id,
                                 oFecha.periodoCarga,
                                 Periodo = oFecha.periodoCarga + " - " + oFecha.tipoCarga + " " + oFecha.ordenCarga
                             };
                var algo = fechas.ToList();

                respuesta = new { success = true, results = fechas.ToList() };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}