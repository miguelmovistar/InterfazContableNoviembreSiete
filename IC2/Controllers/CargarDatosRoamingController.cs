using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.Transactions;
using System.IO;
using System.Globalization;
using IC2.Helpers;
using System.Text;

namespace IC2.Controllers
{
    public class CargarDatosRoamingController : Controller
    {
        // GET: CargarDatos
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
        [HttpPost]
        public string ValidaCampo(string valor, string nombre)
        {
            if (valor == null || valor == "" || valor == " ")
                return null;
            else
                return valor;
        }

        public object CargaTAPINA(string periodo, string ruta, string nombre, int Id, char separador)
        {
            object respuesta = null;
            string res = "";
            int i = 0, defectuosos = 0;
            string exception = "";
            List<string> resultado = new List<string>();
            string[] lineas = null;
            bool exitoso = false;
            CultureInfo cultureInfo = new CultureInfo("es-ES", false);
            DateTime dateRom = new DateTime();
            DateTime dateTime = new DateTime();
            DateTime fecha_carga = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);

            try {
                lineas = System.IO.File.ReadAllLines(ruta + "/" + nombre, Encoding.Default).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
            } catch (FileNotFoundException) {
                exception = "El archivo Selecionado aún no existe en el Repositorio.";
            } catch (UnauthorizedAccessException) {
                exception = "No tiene permiso para acceder al archivo actual.";
            } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
            }
            if (lineas != null) {
                try {
                    var list = new List<datosTraficoTAPINA>();
                    using (TransactionScope scope = new TransactionScope()) {
                        for (i = 1; i < lineas.Count(); i++) {
                            var linea = SepararLineas(lineas[i], separador);
                            var datosROM = new datosTraficoTAPINA();
                            if (linea.Count() != 27) {
                                resultado.Add("Línea " + i + ": Numero de campos insuficiente.");
                                ++defectuosos;
                                continue;
                            }

                            if (ValidaCampo(linea[0], "") != null) {
                                //DateTime dateRom = new DateTime();
                                dateRom = DateTime.Parse(linea[0], cultureInfo);
                                datosROM.settlementDate = dateRom;//DateTime.ParseExact(linea[0], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            } else
                                datosROM.settlementDate = null;


                            datosROM.myPMN = ValidaCampo(linea[1], "");
                            datosROM.VRSFCMTSRH = ValidaCampo(linea[2], "");
                            datosROM.codigoAcreedor = ValidaCampo(linea[3], "");
                            datosROM.theirPMN = ValidaCampo(linea[4], "");
                            datosROM.operatorName = ValidaCampo(linea[5], "");
                            datosROM.rapFileName = ValidaCampo(linea[6], "");
                            if (ValidaCampo(linea[7], "") != null)
                            {

                                dateRom = DateTime.Parse(linea[7], cultureInfo);
                                datosROM.rapFileAvailableTimeStamp = dateRom;//DateTime.ParseExact(linea[7], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.rapFileAvailableTimeStamp = null;
                            datosROM.rapStatus = ValidaCampo(linea[8], "");
                            datosROM.rapFileType = ValidaCampo(linea[9], "");
                            datosROM.rapAdjustmentIndicator = ValidaCampo(linea[10], "");
                            datosROM.tapFileType = ValidaCampo(linea[11], "");
                            datosROM.tapFileName = ValidaCampo(linea[12], "");
                            datosROM.callType = ValidaCampo(linea[13], "");
                            datosROM.numberCalls = Int32.Parse(linea[14]);
                            datosROM.totalRealVolume = Math.Round(decimal.Parse(ValidaCampo(linea[15], ""), NumberStyles.Any), 15);
                            datosROM.totalChargedVolume = Math.Round(decimal.Parse(ValidaCampo(linea[16], ""), NumberStyles.Any), 15);
                            datosROM.realDuration = Math.Round(decimal.Parse(ValidaCampo(linea[17], ""), NumberStyles.Any), 15);
                            datosROM.chargedDuration = Math.Round(decimal.Parse(ValidaCampo(linea[18], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesSDR = Math.Round(decimal.Parse(ValidaCampo(linea[19], ""), NumberStyles.Any), 15);
                            datosROM.taxes = Math.Round(decimal.Parse(ValidaCampo(linea[20], ""), NumberStyles.Any), 15);
                            datosROM.totalCharges = Math.Round(decimal.Parse(ValidaCampo(linea[21], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesLC = Math.Round(decimal.Parse(ValidaCampo(linea[22], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency1 = Math.Round(decimal.Parse(ValidaCampo(linea[23], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency2 = Math.Round(decimal.Parse(ValidaCampo(linea[24], ""), NumberStyles.Any), 15);
                            datosROM.totalChargesLC = Math.Round(decimal.Parse(ValidaCampo(linea[25], ""), NumberStyles.Any), 15);

                            if (ValidaCampo(linea[26], "") != null)
                            {
                                //DateTime dateRom = new DateTime();
                                dateRom = DateTime.Parse(linea[26], cultureInfo);
                                datosROM.callDate = dateRom;//DateTime.ParseExact(linea[26], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.callDate = null;

                            datosROM.idCarga = Id;
                            datosROM.fecha_carga = fecha_carga;
                            list.Add(datosROM);

                            dateRom = DateTime.Parse(linea[0], cultureInfo);
                        }
                        db.BulkInsert(list, true, "datosTraficoTAPINA");
                        //Log log2 = new Log();
                        //log2.registraCarga("datosTraficoTAPINA.html", Request.UserHostAddress,nombre);

                        cargaDocumentoRoaming cargaDocumento = db.cargaDocumentoRoaming.Where(x => x.Id == Id).SingleOrDefault();
                        cargaDocumento.estatusCarga = "CC";

                        //Log log = new Log();
                        //log.insertaBitacoraModificacion(cargaDocumento, "Id", cargaDocumento.Id, "cargaDocumentoRoaming.html", Request.UserHostAddress);

                        var fecha = db.cargaDocumentoRoaming.Where(x => x.Id == Id).Select(c => c.periodoCarga).SingleOrDefault();

                        dateTime = DateTime.Parse(fecha, cultureInfo);

                        dateTime = dateTime.AddMonths(1);

                        res = dateTime.Year + "/" + dateTime.Month.ToString("00") + "/" + dateTime.Day.ToString("00");

                        cargaDocumentoRoaming nuevo = new cargaDocumentoRoaming
                        {
                            idDocumento = "TAPIN",
                            periodoCarga = res,
                            fechaCarga = null,
                            tipoCarga = "TAPIN",
                            ordenCarga = "A",
                            estatusCarga = "PC"
                        };

                        db.cargaDocumentoRoaming.Add(nuevo);
                        //Log log3 = new Log();
                        //log3.insertaNuevoOEliminado(nuevo, "Nuevo", "cargaDocumentoRoaming.html", Request.UserHostAddress);

                        respuesta = new { success = true, results = "ok", exitos = i - defectuosos - 1, total = lineas.Count() - 1, procesados = resultado };
                        db.SaveChanges();
                       
                        // Se hace la transaccion
                        scope.Complete();
                        exitoso = true;

                        
                    }
                }
                catch (FormatException ex) {
                    string error = ex.Message;
                    respuesta = new { success = false, results = "Error en la conversión de datos." + "Linea: " + i, exitos = -1, total = -1 };
                }
                catch (TransactionAbortedException) { 
                    respuesta = new { success = false, results = "Transacción abortada. Se presentó un error.", exitos = -1, total = -1 };
                }
                catch(Exception ex)
                {
                    string error = ex.Message;
                    respuesta = new { success = false, results = "Error en la conversión de datos.", exitos = -1, total = -1 };

                }
            } else {
                respuesta = new { success = false, results = exception, exitos = -1, total = -1 };
            }

            if (exitoso)
            {
				db.Database.CommandTimeout = 3000;
                db.sp_InsertarPXQCostosROM(dateRom);
                MoverArchivo(ruta, nombre);
            }
            return respuesta;
        }

        public object CargaTAPINB(string periodo, string ruta, string nombre, int Id, char separador)
        {
            object respuesta = null;
            string res = "";
            int i = 0, defectuosos = 0;
            string exception = "";
            List<string> resultado = new List<string>();
            string[] lineas = null;
            bool exitoso = false;
            CultureInfo cultureInfo = new CultureInfo("es-ES", false);
            DateTime dateRom = new DateTime();
            DateTime dateTime = new DateTime();
            DateTime fecha_carga = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);

            try {
                lineas = System.IO.File.ReadAllLines(ruta + "/" + nombre, Encoding.Default).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
            } catch (FileNotFoundException) {
                exception = "El archivo no se encuentra en el directorio especificado.";
            } catch (UnauthorizedAccessException) {
                exception = "No tiene permiso para acceder al archivo actual.";
            } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
            }

            if (lineas != null) {
                try {
                    var list = new List<datosTraficoTAPINB>();
                    using (TransactionScope scope = new TransactionScope()) {
                        for (i = 1; i < lineas.Count(); i++) {
                            var linea = SepararLineas(lineas[i], separador);
                            var datosROM = new datosTraficoTAPINB();
                            if (linea.Count() != 27) {
                                resultado.Add("Línea " + i + ": Numero de campos insuficiente.");
                                ++defectuosos;
                                continue;
                            }

                            if (ValidaCampo(linea[0], "") != null)
                            {
                                dateRom = DateTime.Parse(linea[0], cultureInfo);
                                datosROM.settlementDate = dateRom; //DateTime.ParseExact(linea[0], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.settlementDate = null;
                            datosROM.myPMN = ValidaCampo(linea[1], "");
                            datosROM.VRSFCMTSRH = ValidaCampo(linea[2], "");
                            datosROM.codigoAcreedor = ValidaCampo(linea[3], "");
                            datosROM.theirPMN = ValidaCampo(linea[4], "");
                            datosROM.operatorName = ValidaCampo(linea[5], "");
                            datosROM.rapFileName = ValidaCampo(linea[6], "");
                            if (ValidaCampo(linea[7], "") != null)
                            {
                                dateRom = DateTime.Parse(linea[7], cultureInfo);
                                datosROM.rapFileAvailableTimeStamp = dateRom; //DateTime.ParseExact(linea[7], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.rapFileAvailableTimeStamp = null;
                            datosROM.rapStatus = ValidaCampo(linea[8], "");
                            datosROM.rapFileType = ValidaCampo(linea[9], "");
                            datosROM.rapAdjustmentIndicator = ValidaCampo(linea[10], "");
                            datosROM.tapFileType = ValidaCampo(linea[11], "");
                            datosROM.tapFileName = ValidaCampo(linea[12], "");
                            datosROM.callType = ValidaCampo(linea[13], "");
                            datosROM.numberCalls = Int32.Parse(linea[14]);
                            datosROM.totalRealVolume = Math.Round(decimal.Parse(ValidaCampo(linea[15], ""), NumberStyles.Any), 15);
                            datosROM.totalChargedVolume = Math.Round(decimal.Parse(ValidaCampo(linea[16], ""), NumberStyles.Any), 15);
                            datosROM.realDuration = Math.Round(decimal.Parse(ValidaCampo(linea[17], ""), NumberStyles.Any), 15);
                            datosROM.chargedDuration = Math.Round(decimal.Parse(ValidaCampo(linea[18], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesSDR = Math.Round(decimal.Parse(ValidaCampo(linea[19], ""), NumberStyles.Any), 15);
                            datosROM.taxes = Math.Round(decimal.Parse(ValidaCampo(linea[20], ""), NumberStyles.Any), 15);
                            datosROM.totalCharges = Math.Round(decimal.Parse(ValidaCampo(linea[21], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesLC = Math.Round(decimal.Parse(ValidaCampo(linea[22], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency1 = Math.Round(decimal.Parse(ValidaCampo(linea[23], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency2 = Math.Round(decimal.Parse(ValidaCampo(linea[24], ""), NumberStyles.Any), 15);
                            datosROM.totalChargesLC = Math.Round(decimal.Parse(ValidaCampo(linea[25], ""), NumberStyles.Any), 15);

                            if (ValidaCampo(linea[26], "") != null)
                            {
                                dateRom = DateTime.Parse(linea[26], cultureInfo);
                                datosROM.callDate = dateRom;//DateTime.ParseExact(linea[26], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.callDate = null;

                            dateRom = DateTime.Parse(linea[0], cultureInfo);
                            datosROM.idCarga = Id;
                            datosROM.fecha_carga = fecha_carga;
                            list.Add(datosROM);
            
                            //db.datosTraficoTAPINB.Add(datosROM);
                            //db.SaveChanges();
                        }
                        db.BulkInsert(list, true, "datosTraficoTAPINB");
                        //Log log2 = new Log();
                        //log2.registraCarga("datosTraficoTAPINB.html", Request.UserHostAddress,nombre);
                        cargaDocumentoRoaming cargaDocumento = db.cargaDocumentoRoaming.Where(x => x.Id == Id).SingleOrDefault();
                        cargaDocumento.estatusCarga = "CC";
                        //Log log = new Log();
                        //log.insertaBitacoraModificacion(cargaDocumento, "Id", cargaDocumento.Id, "Clase_Servicio.html", Request.UserHostAddress);

                        var fecha = db.cargaDocumentoRoaming.Where(x => x.Id == Id).Select(c => c.periodoCarga).SingleOrDefault();

                        dateTime = DateTime.Parse(fecha, cultureInfo);

                        dateTime = dateTime.AddMonths(1);

                        res = dateTime.Year + "/" + dateTime.Month.ToString("00") + "/" + dateTime.Day.ToString("00");

                        cargaDocumentoRoaming nuevo = new cargaDocumentoRoaming
                        {
                            idDocumento = "TAPIN",
                            periodoCarga = res,
                            fechaCarga = null,
                            tipoCarga = "TAPIN",
                            ordenCarga = "B",
                            estatusCarga = "PC"
                        };

                        db.cargaDocumentoRoaming.Add(nuevo);

                        //Log log4 = new Log();
                        //log4.insertaNuevoOEliminado(nuevo, "Nuevo", "cargaDocumentoRoaming.html", Request.UserHostAddress);

                        respuesta = new { success = true, results = "ok", exitos = i - defectuosos - 1, total = lineas.Count() - 1, procesados = resultado };
                        //respuesta = new { success = true, results = "oki", exitos = i - 1, procesados = resultado };
                        db.SaveChanges();
                        // Se hace la transaccion
                        scope.Complete();
                        exitoso = true;

                    }
                } catch (FormatException) {
                    respuesta = new { success = false, results = "Error en la conversión de datos.", exitos = -1, total = -1 };
                } catch (TransactionAbortedException) {
                    respuesta = new { success = false, results = "Transacción abortada. Se presentó un error.", exitos = -1, total = -1 };
                }
            } else {
                respuesta = new { success = false, results = exception, exitos = -1, total = -1 };
            }

            if (exitoso)
            {
                db.sp_InsertarPXQCostosROM_B(dateRom);
                MoverArchivo(ruta, nombre);
            }
            return respuesta;
        }

        public object CargaTAPOUTA(string periodo, string ruta, string nombre, int Id, char separador)
        {
            object respuesta = null;
            string res = "";
            int i = 0, defectuosos = 0;
            string exception = "";
            List<string> resultado = new List<string>();
            string[] lineas = null;
            bool exitoso = true;
            CultureInfo cultureInfo = new CultureInfo("es-ES", false);
            DateTime dateRom = new DateTime();
            DateTime dateTime = new DateTime();
            DateTime fecha_carga = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);

            try {
                lineas = System.IO.File.ReadAllLines(ruta + "/" + nombre, Encoding.Default).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
            } catch (FileNotFoundException) {
                exception = "El archivo no se encuentra en el directorio especificado.";
            } catch (UnauthorizedAccessException) {
                exception = "No tiene permiso para acceder al archivo actual.";
            } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
            }

            if (lineas != null) {
                try {
                    var list = new List<datosTraficoTAPOUTA>();
                    using (TransactionScope scope = new TransactionScope()) {
                        for (i = 1; i < lineas.Count(); i++) {
                            var linea = SepararLineas(lineas[i], separador);
                            var datosROM = new datosTraficoTAPOUTA();
                            if (linea.Count() != 27) {
                                resultado.Add("Línea " + i + ": Numero de campos insuficiente.");
                                ++defectuosos;
                                continue;
                            }

                            if (ValidaCampo(linea[0], "") != null)
                            {
                                dateRom = DateTime.Parse(linea[0], cultureInfo);
                                datosROM.settlementDate = dateRom;//DateTime.ParseExact(linea[0], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.settlementDate = null;
                            datosROM.myPMN = ValidaCampo(linea[1], "");
                            datosROM.VRSFCMTSRH = ValidaCampo(linea[2], "");
                            datosROM.codigoDeudor = ValidaCampo(linea[3], "");
                            datosROM.theirPMN = ValidaCampo(linea[4], "");
                            datosROM.operatorName = ValidaCampo(linea[5], "");
                            datosROM.rapFileName = ValidaCampo(linea[6], "");

                            if (ValidaCampo(linea[7], "") != null)
                            {
                                dateRom = DateTime.Parse(linea[7], cultureInfo);
                                datosROM.rapFileAvailableTimeStamp = dateRom;//DateTime.ParseExact(linea[7], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.rapFileAvailableTimeStamp = null;

                            datosROM.rapStatus = ValidaCampo(linea[8], "");
                            datosROM.rapFileType = ValidaCampo(linea[9], "");
                            datosROM.rapAdjustmentIndicator = ValidaCampo(linea[10], "");
                            datosROM.tapFileType = ValidaCampo(linea[11], "");
                            datosROM.tapFileName = ValidaCampo(linea[12], "");
                            datosROM.callType = ValidaCampo(linea[13], "");
                            datosROM.numberCalls = Int32.Parse(linea[14]);
                            datosROM.totalRealVolume = Math.Round(decimal.Parse(ValidaCampo(linea[15], ""),NumberStyles.Any), 15);
                            datosROM.totalChargedVolume = Math.Round(decimal.Parse(ValidaCampo(linea[16], ""), NumberStyles.Any), 15);
                            datosROM.realDuration = Math.Round(decimal.Parse(ValidaCampo(linea[17], ""), NumberStyles.Any), 15);
                            datosROM.chargedDuration = Math.Round(decimal.Parse(ValidaCampo(linea[18], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesSDR = Math.Round(decimal.Parse(ValidaCampo(linea[19], ""), NumberStyles.Any), 15);
                            datosROM.taxes = Math.Round(decimal.Parse(ValidaCampo(linea[20], ""), NumberStyles.Any), 15);
                            datosROM.totalCharges = Math.Round(decimal.Parse(ValidaCampo(linea[21], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesLC = Math.Round(decimal.Parse(ValidaCampo(linea[22], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency1 = Math.Round(decimal.Parse(ValidaCampo(linea[23], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency2 = Math.Round(decimal.Parse(ValidaCampo(linea[24], ""), NumberStyles.Any), 15);
                            datosROM.totalChargesLC = Math.Round(decimal.Parse(ValidaCampo(linea[25], ""), NumberStyles.Any), 15);

                            if (ValidaCampo(linea[26], "") != null)
                            {
                                dateRom = DateTime.Parse(linea[26], cultureInfo);
                                datosROM.callDate = dateRom;//DateTime.ParseExact(linea[26], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.callDate = null;

                            datosROM.idCarga = Id;
                            datosROM.fecha_carga = fecha_carga;
                            list.Add(datosROM);

                        

                            dateRom = DateTime.Parse(linea[0], cultureInfo);
                            //db.datosTraficoTAPOUTA.Add(datosROM);
                            //db.SaveChanges();
                        }
                        db.BulkInsert(list, true, "datosTraficoTAPOUTA");
                        //Log log6 = new Log();
                        //log6.registraCarga("datosTraficoTAPOUTA.html", Request.UserHostAddress,nombre);
                        cargaDocumentoRoaming cargaDocumento = db.cargaDocumentoRoaming.Where(x => x.Id == Id).SingleOrDefault();
                        cargaDocumento.estatusCarga = "CC";

                        //Log log = new Log();
                        //log.insertaBitacoraModificacion(cargaDocumento, "Id", cargaDocumento.Id, "cargaDocumentoRoaming.html", Request.UserHostAddress);

                        var fecha = db.cargaDocumentoRoaming.Where(x => x.Id == Id).Select(c => c.periodoCarga).SingleOrDefault();

                        dateTime = DateTime.Parse(fecha, cultureInfo);

                        dateTime = dateTime.AddMonths(1);

                        res = dateTime.Year + "/" + dateTime.Month.ToString("00") + "/" + dateTime.Day.ToString("00");

                        cargaDocumentoRoaming nuevo = new cargaDocumentoRoaming
                        {
                            idDocumento = "TAPOUT",
                            periodoCarga = res,
                            fechaCarga = null,
                            tipoCarga = "TAPOUT",
                            ordenCarga = "A",
                            estatusCarga = "PC"
                        };

                        db.cargaDocumentoRoaming.Add(nuevo);

                        //Log log2 = new Log();
                        //log2.insertaNuevoOEliminado(nuevo, "Nuevo", "cargaDocumentoRoaming.html", Request.UserHostAddress);

                        respuesta = new { success = true, results = "ok", exitos = i - defectuosos - 1, total = lineas.Count() - 1, procesados = resultado };

                        db.SaveChanges();
                        // Se hace la transaccion
                        scope.Complete();
                        
                        exitoso = true;
                    }
                } catch (FormatException) {
                    respuesta = new { success = false, results = "Error en la conversión de datos.", exitos = -1, total = -1 };
                } catch (TransactionAbortedException) {
                    respuesta = new { success = false, results = "Transacción abortada. Se presentó un error.", exitos = -1, total = -1 };
                }
            } else {
                respuesta = new { success = false, results = exception, exitos = -1, total = -1 };
            }

            if (exitoso) {
                db.Database.CommandTimeout = 300;
                db.sp_InsertarPXQIngresosROM(dateRom);
                MoverArchivo(ruta, nombre);
            }
            return respuesta;
        }

        public object CargaTAPOUTB(string periodo, string ruta, string nombre, int Id, char separador)
        {
            object respuesta = null;
            string res = "";
            int i = 0, defectuosos = 0;
            string exception = "";
            List<string> resultado = new List<string>();
            string[] lineas = null;
            bool exitoso = false;
            CultureInfo cultureInfo = new CultureInfo("es-ES", false);
            DateTime dateRom = new DateTime();
            DateTime dateTime = new DateTime();
            DateTime fecha_carga = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);

            try {
                lineas = System.IO.File.ReadAllLines(ruta + "/" + nombre, Encoding.Default).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
            } catch (FileNotFoundException) {
                exception = "El archivo no se encuentra en el directorio especificado.";
            } catch (UnauthorizedAccessException) {
                exception = "No tiene permiso para acceder al archivo actual.";
            } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
            }

            if (lineas != null) {
                try {
                    var list = new List<datosTraficoTAPOUTB>();
                    using (TransactionScope scope = new TransactionScope()) {
                        for (i = 1; i < lineas.Count(); i++) {
                            var linea = SepararLineas(lineas[i], separador);
                            var datosROM = new datosTraficoTAPOUTB();
                            if (linea.Count() != 27) {
                                resultado.Add("Línea " + i + ": Numero de campos insuficiente.");
                                ++defectuosos;
                                continue;
                            }

                            if (ValidaCampo(linea[0], "") != null)
                            {
                               
                                dateRom = DateTime.Parse(linea[0], cultureInfo);
                                datosROM.settlementDate = dateRom;//DateTime.ParseExact(linea[0], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.settlementDate = null;
                            datosROM.myPMN = ValidaCampo(linea[1], "");
                            datosROM.VRSFCMTSRH = ValidaCampo(linea[2], "");
                            datosROM.codigoDeudor = ValidaCampo(linea[3], "");
                            datosROM.theirPMN = ValidaCampo(linea[4], "");
                            datosROM.operatorName = ValidaCampo(linea[5], "");
                            datosROM.rapFileName = ValidaCampo(linea[6], "");
                            if (ValidaCampo(linea[7], "") != null)
                            {
                               
                                dateRom = DateTime.Parse(linea[7], cultureInfo);
                                datosROM.rapFileAvailableTimeStamp = dateRom;//DateTime.ParseExact(linea[7], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.rapFileAvailableTimeStamp = null;
                            datosROM.rapStatus = ValidaCampo(linea[8], "");
                            datosROM.rapFileType = ValidaCampo(linea[9], "");
                            datosROM.rapAdjustmentIndicator = ValidaCampo(linea[10], "");
                            datosROM.tapFileType = ValidaCampo(linea[11], "");
                            datosROM.tapFileName = ValidaCampo(linea[12], "");
                            datosROM.callType = ValidaCampo(linea[13], "");
                            datosROM.numberCalls = Int32.Parse(linea[14]);
                            datosROM.totalRealVolume = Math.Round(decimal.Parse(ValidaCampo(linea[15], ""), NumberStyles.Any), 15);
                            datosROM.totalChargedVolume = Math.Round(decimal.Parse(ValidaCampo(linea[16], ""), NumberStyles.Any), 15);
                            datosROM.realDuration = Math.Round(decimal.Parse(ValidaCampo(linea[17], ""), NumberStyles.Any), 15);
                            datosROM.chargedDuration = Math.Round(decimal.Parse(ValidaCampo(linea[18], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesSDR = Math.Round(decimal.Parse(ValidaCampo(linea[19], ""), NumberStyles.Any), 15);
                            datosROM.taxes = Math.Round(decimal.Parse(ValidaCampo(linea[20], ""), NumberStyles.Any), 15);
                            datosROM.totalCharges = Math.Round(decimal.Parse(ValidaCampo(linea[21], ""), NumberStyles.Any), 15);
                            datosROM.chargesTaxesLC = Math.Round(decimal.Parse(ValidaCampo(linea[22], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency1 = Math.Round(decimal.Parse(ValidaCampo(linea[23], ""), NumberStyles.Any), 15);
                            datosROM.taxesLocalCurrency2 = Math.Round(decimal.Parse(ValidaCampo(linea[24], ""), NumberStyles.Any), 15);
                            datosROM.totalChargesLC = Math.Round(decimal.Parse(ValidaCampo(linea[25], ""), NumberStyles.Any), 15);

                            if (ValidaCampo(linea[26], "") != null)
                            {
                               
                                dateRom = DateTime.Parse(linea[26], cultureInfo);
                                datosROM.callDate = dateRom;//DateTime.ParseExact(linea[26], "dd/MM/yyyy", new CultureInfo("es-ES"));
                            }
                            else
                                datosROM.callDate = null;

                            datosROM.idCarga = Id;
                            datosROM.fecha_carga = fecha_carga;
                            list.Add(datosROM);

                        

                        }
                        db.BulkInsert(list, true, "datosTraficoTAPOUTB");
                        //Log log2 = new Log();
                        //log2.registraCarga("datosTraficoTAPOUTB.html", Request.UserHostAddress,nombre);
                        cargaDocumentoRoaming cargaDocumento = db.cargaDocumentoRoaming.Where(x => x.Id == Id).SingleOrDefault();
                        cargaDocumento.estatusCarga = "CC";

                        //Log log = new Log();
                        //log.insertaBitacoraModificacion(cargaDocumento, "Id", cargaDocumento.Id, "Clase_Servicio.html", Request.UserHostAddress);

                        var fecha = db.cargaDocumentoRoaming.Where(x => x.Id == Id).Select(c => c.periodoCarga).SingleOrDefault();

                        dateTime = DateTime.Parse(fecha, cultureInfo);

                        dateTime = dateTime.AddMonths(1);

                        res = dateTime.Year + "/" + dateTime.Month.ToString("00") + "/" + dateTime.Day.ToString("00");

                        cargaDocumentoRoaming nuevo = new cargaDocumentoRoaming
                        {
                            idDocumento = "TAPOUT",
                            periodoCarga = res,
                            fechaCarga = null,
                            tipoCarga = "TAPOUT",
                            ordenCarga = "B",
                            estatusCarga = "PC"
                        };

                        db.cargaDocumentoRoaming.Add(nuevo);
                        //Log log5 = new Log();
                        //log5.insertaNuevoOEliminado(nuevo, "Nuevo", "cargaDocumentoRoaming.html", Request.UserHostAddress);
                        respuesta = new { success = true, results = "ok", exitos = i - defectuosos - 1, total = lineas.Count() - 1, procesados = resultado };
                        db.SaveChanges();
                        // Se hace la transaccion
                        scope.Complete();
                        exitoso = true;
                    }
                } catch (FormatException) {
                    respuesta = new { success = false, results = "Error en la conversión de datos.", exitos = -1, total = -1 };
                } catch (TransactionAbortedException) {
                    respuesta = new { success = false, results = "Transacción abortada. Se presentó un error.", exitos = -1, total = -1 };
                }
            } else {
                respuesta = new { success = false, results = exception, exitos = -1, total = -1 };
            }

            if (exitoso)
            {
                db.sp_InsertarPXQIngresosROM_B(dateRom);
                MoverArchivo(ruta, nombre);
            }
            return respuesta;
        }

        public JsonResult CargarDatos(string Periodo, int lineaNegocio)
        {
            var split = Periodo.Split(' ');
            string periodo = split[0];
            string tipocarga = split[2];
            string ordencarga = split[3];
            List<object> lista = new List<object>();
            object respuesta = null;
            string ruta = "", nombreArchivo = "", separador = "";
            int Id = 0;

            try {
                var traficoROM = from documento in db.cargaDocumentoRoaming
                                 join parametro in db.parametrosCargaDocumento
                                 on documento.idDocumento equals parametro.idDocumento
                                 where documento.periodoCarga == periodo
                                 && documento.estatusCarga == "PC"
                                 && documento.tipoCarga == tipocarga
                                 && documento.ordenCarga == ordencarga
                                 select new
                                 {
                                     parametro.pathURL,
                                     parametro.nombreArchivo,
                                     documento.periodoCarga,
                                     documento.Id,
                                     documento.estatusCarga,
                                     parametro.caracterSeparador
                                 };
                nombreArchivo = traficoROM.SingleOrDefault().nombreArchivo.Replace("YYYYMMDD", traficoROM.SingleOrDefault().periodoCarga.Replace("/", ""));
                ruta = traficoROM.SingleOrDefault().pathURL;
                Id = traficoROM.SingleOrDefault().Id;
                separador = traficoROM.SingleOrDefault().caracterSeparador;

                if (tipocarga == "TAPIN") {
                    if (ordencarga == "A") {
                        respuesta = CargaTAPINA(periodo, ruta, nombreArchivo, Id, Convert.ToChar(separador));
						////Polizas Roaming 
						//if (Session["Periodo"] != null)
						//{
						//	string _Periodo = Session["Periodo"].ToString();
						//	PolizasRoaming(_Periodo);
						//}
						
						PolizasRoaming(periodo);

					} else if (ordencarga == "B") {
                        respuesta = CargaTAPINB(periodo, ruta, nombreArchivo, Id, Convert.ToChar(separador));
						Session["Periodo"] = periodo;
                    }
                } else if (tipocarga == "TAPOUT") {
                    if (ordencarga == "A") {
                        respuesta = CargaTAPOUTA(periodo, ruta, nombreArchivo, Id, Convert.ToChar(separador));
                    } else if (ordencarga == "B") {
                        respuesta = CargaTAPOUTB(periodo, ruta, nombreArchivo, Id, Convert.ToChar(separador));
                    }


				}




			} catch (Exception ex) {
                var error = ex.Message;
                respuesta = new { success = false, results = "Hubo un error al procesar la peticion.", exitos = -1, total = -1, procesados = "" };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

		private void PolizasRoaming(string Periodo)
		{
			
			DateTime PeriodoPolizas = DateTime.Parse(Periodo);
			db.usp_ListadoPolizasRoaming(PeriodoPolizas);

			var poliza = db.PolizasRoaming.FirstOrDefault(x => x.Id== 1);
			string a = poliza.PeriodoConsumido.ToString();
			DateTime _periodo = DateTime.Parse(a);
		
			GenerarPolizas.GeneraPolizasRoamig(_periodo, "");
		}

        public string[] SepararLineas(string cadena, char separador)
        {
            var aux = "";
            int i;
            for (i = 0; i < cadena.Length - 1; ++i) {
                if (cadena[i] == '"') {
                    do {
                        aux += cadena[i];
                        ++i;
                    } while (cadena[i] != '"');
                    aux += cadena[i];
                }
                if (cadena[i] == separador)
                    aux += ';';
                else
                    aux += cadena[i];
            }

            aux += cadena[i];

            return aux.Split(';');
        }

        public void MoverArchivo(string ruta, string nombre)
        {
            try {
                if (!Directory.Exists(@ruta + "/CargasProcesadas")) {
                    DirectoryInfo di = Directory.CreateDirectory(ruta + "/CargasProcesadas");
                }
                System.IO.File.Move(ruta + "/" + nombre, ruta + "/CargasProcesadas/" + nombre);
            } catch (Exception e) {
                Console.WriteLine("No se pudo completar el proceso: {0}", e.ToString());
            }
        }

        #region Combos

        public JsonResult LlenaFecha(int lineaNegocio)
        {
            CargaDocumento oCarga = new CargaDocumento();
            object respuesta = null;
            int i = 1;
            string p = "p", q = "q";

            try {
                var fechas = (from oFecha in db.cargaDocumentoRoaming
                              where oFecha.estatusCarga == "PC"
                              orderby oFecha.periodoCarga
                              select new
                              {
                                  oFecha.Id,
                                  oFecha.periodoCarga,
                                  oFecha.tipoCarga,
                                  oFecha.ordenCarga,
                                  Periodo = oFecha.periodoCarga + " - " + oFecha.tipoCarga + " " + oFecha.ordenCarga
                              });

                foreach (var a in fechas) {
                    if (i == 1)
                        p = a.ordenCarga;
                    else if (i == 2) {
                        q = a.ordenCarga;
                        break;
                    }
                    ++i;
                }

                if (p != q)
                    fechas = fechas.Take(1);
                else
                    fechas = fechas.Take(2);

                respuesta = new { success = true, results = fechas.ToList() };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}