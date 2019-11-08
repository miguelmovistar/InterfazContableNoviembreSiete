using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.Transactions;
using System.IO;
using System.Data.Entity;
using System.Globalization;
using System.Text;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CargarDatosController : Controller
    {
        // GET: CargarDatos
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();
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
        public JsonResult CargarDatos(string Periodo, int lineaNegocio)
        {
            object respuesta = null;

            if (lineaNegocio == 3)
                respuesta = CargaDatosMVNO(Periodo);
            else if (lineaNegocio == 2)
                respuesta = CargaDatosLDI(Periodo);

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public string ValidaCampo(string valor, string nombre)
        {
            if (valor == null || valor == "" || valor == " ")
                return null;
            else
                return valor;
        }
        public object CargaDatosLDI(string Periodo)
        {
            string ruta = "", nombreArchivo = "", exception = "Error al cargar el archivo";
            object respuesta = null;
            char separador;
            bool exitoso = false;
            int Id = 0, numeroDeLinea = 0, contador = 0;
            string[] lineas = null;
            string operadores = "", monedas = "", trafico = "";
            string[] arreglo = null;
            string periodo = DateTime.ParseExact(Periodo.ToUpper(), "yyyy MMMM", new CultureInfo("es-ES")).ToString("yyyy/MM");
            DateTime fechaPeriodo = Convert.ToDateTime(periodo);
            int lineaLDI = 2;

            List<Claves> listaIDS = new List<Claves>();
            List<Errores> listaErrores = new List<Errores>();
            List<DatosTraficoLDI> listaTrafico = new List<DatosTraficoLDI>();
            List<DatosTraficoLDI> listaTraficoCompleta = new List<DatosTraficoLDI>();

            int? numeroCarga = db.DatosTraficoLDI.Max(x => x.NumeroCarga);
            if (numeroCarga == null)
                numeroCarga = 1;
            else
                numeroCarga = numeroCarga + 1;
            List<object> lista = new List<object>();

            using (TransactionScope transaction = new TransactionScope()) {
                try {
                    var traficoLDI = from archivo in db.CargaDocumento
                                     join parametro in db.parametrosCargaDocumento
                                     on archivo.Id_Documento equals parametro.idDocumento
                                     where archivo.Periodo == periodo
                                     && archivo.EstatusCarga == "PC"
                                     && archivo.Id_LineaNegocio == lineaLDI
                                     select new
                                     {
                                         parametro.pathURL,
                                         parametro.nombreArchivo,
                                         archivo.Periodo,
                                         archivo.Id,
                                         archivo.EstatusCarga,
                                         parametro.caracterSeparador
                                     };

                    nombreArchivo = traficoLDI.SingleOrDefault().nombreArchivo.Replace("YYYYMM", traficoLDI.SingleOrDefault().Periodo.Replace("/", ""));
                    ruta = traficoLDI.SingleOrDefault().pathURL + nombreArchivo;
                    Id = traficoLDI.SingleOrDefault().Id;
                    separador = Convert.ToChar(traficoLDI.SingleOrDefault().caracterSeparador);

                    lineas = System.IO.File.ReadAllLines(ruta, Encoding.Default).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();

                    string[] arrOperador = new string[lineas.Count()];
                    string[] arrMoneda = new string[lineas.Count()];
                    string[] arrTrafico = new string[lineas.Count()];

                    foreach (string linea in lineas) {
                        if (numeroDeLinea > 0) {
                            arreglo = linea.Split(',');
                            if (ValidaLinea(arreglo)) {
                                operadores = operadores + arreglo[4] + ",";
                                monedas = monedas + arreglo[10] + ",";
                                trafico = trafico + arreglo[13] + ",";

                                arrOperador[contador] = arreglo[4];
                                arrMoneda[contador] = arreglo[10];
                                arrTrafico[contador] = arreglo[13];


                                listaTrafico.Add(new DatosTraficoLDI
                                {
                                    Id_Carga = Id,
                                    Franchise = arreglo[0],
                                    Direccion = arreglo[1],
                                    Billed_Product = arreglo[2],
                                    Rating_Component = arreglo[3],
                                    Unit_Cost_User = decimal.Parse(arreglo[5]),
                                    Month = DateTime.ParseExact(arreglo[6], "dd/MM/yyyy", new CultureInfo("es-ES")),
                                    Calls = decimal.Parse(arreglo[7]),
                                    Actual_Usage = decimal.Parse(arreglo[8]),
                                    Charge_Usage = decimal.Parse(arreglo[9]),
                                    Amount = decimal.Parse(arreglo[11]),
                                    Iva = decimal.Parse(arreglo[12]),
                                    Sobrecargo = decimal.Parse(arreglo[14]),
                                    NumeroCarga = numeroCarga,
                                    fecha_contable = fechaPeriodo.Date
                                });
                                //Código temporal
                                contador++;
                            } else {
                                listaErrores.Add(new Errores
                                {
                                    numeroLinea = numeroDeLinea,
                                    motivo = "Número de campos insuficiente."
                                });
                            }
                        }
                        numeroDeLinea++;
                    }
                    //Obtener ID's correspondientes 
                    listaIDS = BuscaId(listaTrafico, trafico, operadores, monedas, lineaLDI);
                    //Asigna los Id a los elementos de la lista
                    listaTrafico = ValidaAsignaDatos(listaTrafico, listaIDS, arrOperador, arrMoneda, arrTrafico, listaErrores);
                    listaTraficoCompleta = listaTrafico;
                    if (listaTraficoCompleta.Count() > 0) {
                        DbContext context = db;
                        IC2.DbContextSqlServerExtensions.BulkInsert(context, listaTraficoCompleta, true, "DatosTraficoLDI");
                        //Log log3 = new Log();
                        //log3.registraCarga("DatosTraficoLDI.html", Request.UserHostAddress, nombreArchivo);
                    }
                    //Conceptos
                    db.sp_traficoConceptos_Update(fechaPeriodo);
                    //Data Trafico
                    InsertDataTrafico(fechaPeriodo);
                    //Actualiza Carga Documentos
                    CargaDocumento cargaDocumento = db.CargaDocumento.Where(x => x.Id == Id).SingleOrDefault();
                    cargaDocumento.EstatusCarga = "CC";
                    cargaDocumento.FechaCarga = DateTime.Now;
                    InsertCargaDocumento(cargaDocumento, fechaPeriodo);
                    //Log log4 = new Log();
                    //log4.insertaBitacoraModificacion(cargaDocumento, "Id", cargaDocumento.Id, "CargaDocumento.html", Request.UserHostAddress);
                    transaction.Complete();
                    exitoso = true;
                } catch (FileNotFoundException) {
                    exception = "El archivo no se encuentra en el directorio especificado.";
                } catch (UnauthorizedAccessException) {
                    exception = "No tiene permiso para acceder al archivo actual.";
                } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                    exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
                } catch (TransactionAbortedException) {
                    exception = "Transacción abortada. Se presentó un error." + " Línea: " + contador;
                } catch (FormatException) {
                    exception = "Error en la conversión de datos." + " Línea: " + contador;
                } finally {
                    if (exitoso) {

                        respuesta = new { success = true, results = "ok" };
                    } else {
                        respuesta = new { success = false, results = exception };
                    }
                }
            }
            db.SaveChanges();
            db.Dispose();
            return respuesta;
        }
        public object CargaDatosMVNO(string Periodo)
        {
            string ruta = "", nombreArchivo = "", exception = "Error al cargar el archivo.";
            char separador;
            bool exitoso = false;
            int Id = 0;
            int i = 0;
            int? numeroCarga = db.DatosTraficoMVNO.Max(x => x.NumeroCarga);
            if (numeroCarga == null)
                numeroCarga = 1;
            string periodo = DateTime.ParseExact(Periodo.ToUpper(), "yyyy MMMM", new CultureInfo("es-ES")).ToString("yyyy/MM");          
            DateTime fechaPeriodo = Convert.ToDateTime(periodo);

            object respuesta = null;
            using (TransactionScope transaction = new TransactionScope()) {
                try {
                    var traficoMVNO = from archivo in db.CargaDocumento
                                      join parametro in db.parametrosCargaDocumento
                                      on archivo.Id_Documento equals parametro.idDocumento
                                      where archivo.Periodo == periodo
                                      && archivo.EstatusCarga == "PC"
                                      && archivo.Id_LineaNegocio == 3
                                      select new
                                      {
                                          parametro.pathURL,
                                          parametro.nombreArchivo,
                                          archivo.Periodo,
                                          archivo.Id,
                                          archivo.EstatusCarga,
                                          parametro.caracterSeparador
                                      };
                    nombreArchivo = traficoMVNO.SingleOrDefault().nombreArchivo.Replace("YYYYMM", traficoMVNO.SingleOrDefault().Periodo.Replace("/", ""));
                    ruta = traficoMVNO.SingleOrDefault().pathURL + nombreArchivo;
                    Id = traficoMVNO.SingleOrDefault().Id;
                    separador = Convert.ToChar(traficoMVNO.SingleOrDefault().caracterSeparador);
                    string[] lineas = System.IO.File.ReadAllLines(ruta, Encoding.Default).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
                    if (lineas.Count() > 0) {
                        for (i = 0; i < lineas.Count(); i++) {
                            if (lineas[i].Contains("Collection") || lineas[i] == "")
                                continue;

                            var linea = lineas[i].Split(separador);
                            var datosMVNOS = new DatosTraficoMVNO
                            {

                                //ID carga
                                Id_Carga = Id,
                                //Collection
                                Collection = ValidaCampo(linea[0], "Collection"),
                                //HOperator
                                HOperator = ValidaCampo(linea[1], "HOperator"),
                                //Operator
                                Operator = ValidaCampo(linea[2], "Operator"),
                                //ReferenceCode
                                ReferenceCode = ValidaCampo(linea[3], "ReferenceCode"),
                                //TransDate
                                TransDate = DateTime.ParseExact(ValidaCampo(linea[4], "TransDate"), "dd/MM/yyyy", new CultureInfo("es-ES")),
                                //Eventos
                                Eventos = decimal.Parse(ValidaCampo(linea[5], "Eventos")),
                                //IdCollectionServicioRegion
                                IdColleccionServicioRegion = ValidaCampo(linea[6], "IdCollectionServicioRegion"),
                                //Service
                                Service = ValidaCampo(linea[7], "Service"),
                                //Real
                                Real = decimal.Parse(ValidaCampo(linea[8], "Real")),
                                //Duration
                                Duration = decimal.Parse(ValidaCampo(linea[9], "Duration")),
                                //Monto
                                Monto = decimal.Parse(linea[10]),
                                //PrecioUnitario
                                PrecioUnitario = decimal.Parse(linea[11]),
                                //Moneda
                                Moneda = ValidaCampo(linea[12], "Moneda"),
                                //Module
                                Module = ValidaCampo(linea[13], "Module"),
                                //Numero carga
                                NumeroCarga = numeroCarga,
                                //Fecha contable
                                fecha_contable = fechaPeriodo.Date
                            };

                            db.DatosTraficoMVNO.Add(datosMVNOS);
                 
                            db.SaveChanges();
                        }

                        //Log log2 = new Log();
                        //log2.registraCarga("DatosTraficoMVNO.html", Request.UserHostAddress,nombreArchivo);
                        CargaDocumento cargaDocumento = db.CargaDocumento.Where(x => x.Id == Id).SingleOrDefault();
                        cargaDocumento.EstatusCarga = "CC";
                        cargaDocumento.FechaCarga = DateTime.Now;
                        InsertCargaDocumento(cargaDocumento, fechaPeriodo);

                        //log2.insertaBitacoraModificacion(cargaDocumento, "Id", cargaDocumento.Id, "CargaDocumento.html", Request.UserHostAddress);

                        db.SaveChanges();
                    }
                    transaction.Complete();
                    exitoso = true;
                } catch (FileNotFoundException) {
                    exception = "El archivo no se encuentra en el directorio especificado.";
                } catch (UnauthorizedAccessException) {
                    exception = "No tiene permiso para acceder al archivo actual.";
                } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                    exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
                } catch (TransactionAbortedException) {
                    exception = "Transacción abortada. Se presentó un error." + " Línea: " + i ;
                } catch (FormatException) {
                    exception = "Error en la conversión de datos." + " Línea: " + i;
                } finally {
                    if (exitoso) {
                        db.SaveChanges();
                        respuesta = new { success = true, results = "ok" };
                    } else {
                        respuesta = new { success = false, results = exception };
                    }
                }
            }
            db.Dispose();

            return respuesta;
        }

        public bool ValidaLinea(string[] arreglo)
        {
            bool valido = true;
            for (int i = 0; i < arreglo.Length; i++) {
                if (arreglo[i] == "" || arreglo[i] == null)
                    return valido = false;
            }
            return valido;
        }

        public List<Claves> BuscaId(List<DatosTraficoLDI> lista, string trafico, string operador, string moneda, int lineaNegocio)
        {
            //sociedad = sociedad.TrimEnd(',');
            trafico = trafico.TrimEnd(',');
            operador = operador.TrimEnd(',');
            moneda = moneda.TrimEnd(',');

            List<Claves> listaID = new List<Claves>();
            try {
                var relaciones = db.sp_ic_buscaIdsCargaTraficoLDI(trafico, operador, moneda, lineaNegocio);
                foreach (var elemento in relaciones) {
                    listaID.Add(new Claves
                    {
                        clave = elemento.clave,
                        texto = elemento.texto
                    });
                }
            } catch (Exception) {

            }
            return listaID;
        }

        public List<DatosTraficoLDI> ValidaAsignaDatos(List<DatosTraficoLDI> lista, List<Claves> listaIDs, string[] arrOperador, string[] arrMoneda, string[] arrTrafico, List<Errores> listaErroneos)
        {
            int contador = 0, numeroLinea = 1;
            //  List<DatosTraficoLDI> lista = new List<DatosTraficoLDI>();
            try {
                using (ICPruebaEntities data = new ICPruebaEntities()) {
                    foreach (var elemento in lista) {
                        if (listaIDs.Exists(x => x.texto == arrOperador[contador])) {
                            elemento.Billing_Operator = listaIDs.Where(x => x.texto == arrOperador[contador]).FirstOrDefault().clave;
                        } else {
                            listaErroneos.Add(new Errores
                            {
                                numeroLinea = numeroLinea,
                                motivo = "No existe el Operador: " + arrOperador[contador]
                            });

                            elemento.Billing_Operator = 0;
                            goto existe;
                        }
                        if (listaIDs.Exists(x => x.texto == arrMoneda[contador]))
                            elemento.id_moneda = listaIDs.Where(x => x.texto == arrMoneda[contador]).FirstOrDefault().clave;
                        else {
                            listaErroneos.Add(new Errores
                            {
                                numeroLinea = numeroLinea,
                                motivo = "No existe la Moneda: " + arrMoneda[contador]
                            });

                            elemento.id_moneda = 0;
                            goto existe;
                        }
                        if (listaIDs.Exists(x => x.texto.ToUpper() == arrTrafico[contador].ToUpper()))
                            elemento.id_trafico = listaIDs.Where(x => x.texto.ToUpper() == arrTrafico[contador].ToUpper()).FirstOrDefault().clave;
                        else {
                            listaErroneos.Add(new Errores
                            {
                                numeroLinea = numeroLinea,
                                motivo = "No existe el Tráfico: " + arrTrafico[contador]
                            });
                            elemento.id_trafico = 0;
                            goto existe;
                        }
                    existe:
                        contador++;
                        numeroLinea++;

                    }
                }
            } catch (Exception) {

            }
            return lista;
        }

        #region Combos
        public JsonResult LlenaFecha(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            CargaDocumento oCarga = new CargaDocumento();
            object respuesta = null;
            try {
                var fechas = (from oFecha in db.CargaDocumento
                              where oFecha.Id_LineaNegocio == lineaNegocio
                              && oFecha.EstatusCarga == "PC"
                              orderby oFecha.Periodo
                              select new
                              {
                                  oFecha.Id,
                                  oFecha.Periodo
                              }).Take(1);

                foreach (var elemento in fechas) {
                    lista.Add(new
                    {
                        elemento.Id,
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

        #region SP_INSERTS
        public void InsertCargaDocumento(CargaDocumento carga, DateTime fecha)
        {
            String mes = "00" + fecha.AddMonths(1).Month.ToString();
            var datosCD = new CargaDocumento
            {
                //Id_Documento
                Id_Documento = carga.Id_Documento,
                Periodo = fecha.AddMonths(1).Year + "/" + mes.Substring(mes.Length - 2),
                EstatusCarga = "PC",
                Id_LineaNegocio = carga.Id_LineaNegocio
            };
            db.CargaDocumento.Add(datosCD);
        }

        public void InsertDataTrafico(DateTime fechaPeriodo)
        {
            try {
                // Provisiones
                db.sp_DataIngresos_INS(fechaPeriodo, "DataIngresoLDI");
                db.sp_DataCostos_INS(fechaPeriodo, "DataCostoLDI");
                // CIERRES
                db.sp_provisionIngreso(fechaPeriodo, "CIERRE", "cierreIngresosLDI");
                db.sp_provisionFEETIWS(fechaPeriodo, "ProvisionFeeTIWS");
                db.sp_provisionCosto(fechaPeriodo, "CIERRE", "cierreCostosLDI");
                db.sp_provisionSMS(fechaPeriodo, "CIERRE", "cierreSMSLDI");
                // Provision Acuerdos
                db.sp_ProvisionCostoAcuerdosLDI(fechaPeriodo, "ProvisionCostoLDI");
                // PXQ
                db.sp_provisionIngreso(fechaPeriodo, "PXQ", "PXQIngresosLDI");
                db.sp_provisionCosto(fechaPeriodo, "PXQ", "PXQCostosLDI");
                db.sp_provisionSMS(fechaPeriodo, "PXQ", "PXQSMSLDI");
                // Fluctuaciones
                db.sp_FluctuacionesLDI_Insert(fechaPeriodo, "FluctuacionIngresoLDI");
                db.sp_FluctuacionesLDI_Insert(fechaPeriodo, "FluctuacionCostoLDI");
                // Devengo
                db.sp_DevengoLDI_Insert(fechaPeriodo, "DevengoIngreso");
                db.sp_DevengoLDI_Insert(fechaPeriodo, "DevengoCosto");
                // Polizas
                db.usp_ListadoPolizas(fechaPeriodo);
                db.usp_MostrarPolizasAgrupdo(fechaPeriodo);

                //Una vez insertado todos los datos validamos que la tabla Polizas contenga datos
                var polizas = (from countPolizas in db.Polizas.ToArray()
                               select countPolizas).Count();
                if (polizas > 0) {
                    //Enviamos las polizas
                    GenerarPolizas.GeneraPolizasLDI(fechaPeriodo, Session["userName"].ToString());
                }
            } catch (Exception ex) {
                throw ex;
            }
        }
        #endregion
    }
}