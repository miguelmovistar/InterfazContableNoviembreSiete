using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Models;
using System.IO;
using System.Transactions;
using System.Globalization;
using System.Text;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class DocumentosCostoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        // GET: DocumentosCosto
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();
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

        public JsonResult LlenaGrid(int? lineaNegocio, DateTime fechaInicial, DateTime fechaFinal, int start, int limit, string ano,
                                                                                                                         string fechaContable,
                                                                                                                         string fechaConsumo,
                                                                                                                         string compania,
                                                                                                                         string servicio,
                                                                                                                         string grupo,
                                                                                                                         string acreedor,
                                                                                                                         string operador,
                                                                                                                         string nombreOperador,
                                                                                                                         string codigoMaterial,
                                                                                                                         string trafico,
                                                                                                                         string montoIva,
                                                                                                                         string iva,
                                                                                                                         string moneda,
                                                                                                                         string minutos,
                                                                                                                         string tarifa,
                                                                                                                         string monto,
                                                                                                                         string montoFacturado,
                                                                                                                         string fechaFactura,
                                                                                                                         string factura,
                                                                                                                         string tipoCambio,
                                                                                                                         string montoMXP,
                                                                                                                         string cuentaContable,
                                                                                                                         string claseDocumento,
                                                                                                                         string claseDocumentoSAP,
                                                                                                                         string numDocumentoPF)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            int total;
            try {
                var datos = from oDatos in db.documentosCosto
                            where oDatos.activo == 1 &&
                            oDatos.lineaNegocio == lineaNegocio &&
                            oDatos.fechaContable >= fechaInicial && oDatos.fechaContable <= fechaFinal

                            && DbFiltro.Date(oDatos.ano, ano, "am")
                            && DbFiltro.Date(oDatos.fechaContable, fechaContable, "dma")
                            && DbFiltro.Date(oDatos.fechaConsumo, fechaConsumo, "dma")
                            && DbFiltro.String(oDatos.compania, compania)
                            && DbFiltro.String(oDatos.servicio, servicio)
                            && DbFiltro.String(oDatos.grupo, grupo)
                            && DbFiltro.String(oDatos.acreedor, acreedor)
                            && DbFiltro.String(oDatos.operador, operador)
                            && DbFiltro.String(oDatos.nombreOperador, nombreOperador)
                            && DbFiltro.String(oDatos.codigoMaterial, codigoMaterial)
                            && DbFiltro.String(oDatos.trafico, trafico)
                            && DbFiltro.Decimal(oDatos.montoIva, montoIva)
                            && DbFiltro.Decimal(oDatos.iva, iva)
                            && DbFiltro.String(oDatos.moneda, moneda)
                            && DbFiltro.Decimal(oDatos.minutos, minutos)
                            && DbFiltro.Decimal(oDatos.tarifa, tarifa)
                            && DbFiltro.Decimal(oDatos.monto, monto)
                            && DbFiltro.Decimal(oDatos.montoFacturado, montoFacturado)
                            && DbFiltro.Date(oDatos.fechaFactura, fechaFactura, "dma")
                            && DbFiltro.String(oDatos.factura, factura)
                            && DbFiltro.Decimal(oDatos.tipoCambio, tipoCambio)
                            && DbFiltro.Decimal(oDatos.montoMXP, montoMXP)
                            && DbFiltro.String(oDatos.cuentaContable, cuentaContable)
                            && DbFiltro.String(oDatos.claseDocumento, claseDocumento)
                            && DbFiltro.String(oDatos.claseDocumentoSAP, claseDocumentoSAP)
                            && DbFiltro.String(oDatos.numDocumentoPF, numDocumentoPF)

                            select new
                            {
                                oDatos.Id,
                                oDatos.ano,
                                oDatos.fechaContable,
                                oDatos.fechaConsumo,
                                oDatos.idSociedad,
                                oDatos.compania,
                                oDatos.idServicio,
                                oDatos.servicio,
                                oDatos.idGrupo,
                                oDatos.grupo,
                                oDatos.idAcreedor,
                                oDatos.acreedor,
                                oDatos.idOperador,
                                oDatos.operador,
                                oDatos.nombreOperador,
                                oDatos.codigoMaterial,
                                oDatos.idTrafico,
                                oDatos.trafico,
                                oDatos.montoIva,
                                oDatos.iva,
                                oDatos.idMoneda,
                                oDatos.moneda,
                                oDatos.minutos,
                                oDatos.tarifa,
                                oDatos.monto,
                                oDatos.montoFacturado,
                                oDatos.fechaFactura,
                                oDatos.factura,
                                oDatos.tipoCambio,
                                oDatos.montoMXP,
                                oDatos.idCuentaResultado,
                                oDatos.cuentaContable,
                                oDatos.claseDocumento,
                                oDatos.claseDocumentoSAP,
                                oDatos.numDocumentoPF
                            };

                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento.Id,
                        ano = elemento.ano.Year,
                        fechaContable = elemento.fechaContable.Day.ToString("00") + "-" + elemento.fechaContable.Month.ToString("00") + "-" + +elemento.fechaContable.Year,
                        fechaContableR = elemento.fechaContable.Day.ToString("00") + "-" + elemento.fechaContable.Month.ToString("00") + "-" + elemento.fechaContable.Year,
                        fechaConsumo = elemento.fechaConsumo.Day.ToString("00") + "-" + elemento.fechaConsumo.Month.ToString("00") + "-" + +elemento.fechaConsumo.Year,
                        fechaConsumoR = elemento.fechaConsumo.Day.ToString("00") + "-" + elemento.fechaConsumo.Month.ToString("00") + "-" + elemento.fechaConsumo.Year,
                        elemento.idSociedad,
                        elemento.compania,
                        elemento.idServicio,
                        elemento.servicio,
                        elemento.idGrupo,
                        elemento.grupo,
                        elemento.idAcreedor,
                        elemento.acreedor,
                        elemento.idOperador,
                        elemento.operador,
                        elemento.nombreOperador,
                        elemento.codigoMaterial,
                        elemento.idTrafico,
                        elemento.trafico,
                        elemento.montoIva,
                        elemento.iva,
                        elemento.idMoneda,
                        elemento.moneda,
                        elemento.minutos,
                        elemento.tarifa,
                        elemento.monto,
                        elemento.montoFacturado,
                        fechaFactura = elemento.fechaFactura.Day.ToString("00") + "-" + elemento.fechaFactura.Month.ToString("00") + "-" + +elemento.fechaFactura.Year,
                        fechaFacturaR = elemento.fechaFactura.Day.ToString("00") + "-" + elemento.fechaFactura.Month.ToString("00") + "-" + elemento.fechaFactura.Year,
                        elemento.factura,
                        elemento.tipoCambio,
                        elemento.montoMXP,
                        elemento.idCuentaResultado,
                        elemento.cuentaContable,
                        elemento.claseDocumento,
                        elemento.claseDocumentoSAP,
                        elemento.numDocumentoPF
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true,
                                  results = lista,
                                  total = total };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            List<string> listaErrores = new List<string>();
            var hoy = DateTime.Now;
            IEnumerable<string> lineas = null;
            object respuesta = null;
            string mensajeExistencia = "";
            int totalProcesados = 0;
            int lineaActual = 1;
            bool status = false;
            string ope, fact;
            string exception = "Error, se presento un error inesperado.";

            try {
                List<string> csvData = new List<string>();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(archivoCSV.InputStream, Encoding.Default)) {
                    while (!reader.EndOfStream) {
                        csvData.Add(reader.ReadLine());
                    }
                }
                lineas = csvData.Skip(1);

                string pd = lineas.First();
                pd = pd.Replace('%', ' ');
                var pdSplit = pd.Split(';');
                DateTime periodoDocumento = FNCGrales.ConvierteFecha(pdSplit[1], char.Parse("-"), "DMY");
                documentosCosto docCosto = db.documentosCosto.Where(x => x.fechaContable == periodoDocumento && x.activo == 1 && x.lineaNegocio == lineaNegocio).FirstOrDefault();
                if (docCosto != null) {
                    mensajeExistencia = "Los documentos del periodo " + periodoDocumento.Year + " " + meses[periodoDocumento.Month] + " se han actualizado";
                    db.sp_BorrarCargas_Delete("documentosCosto", periodoDocumento, lineaNegocio);
                }

                using (TransactionScope scope = new TransactionScope()) {
                    foreach (string ln in lineas) {
                        string linea = ln.Replace('%', ' ');
                        var lineaSplit = linea.Split(';');
                        ++lineaActual;
                        if (lineaSplit.Count() == 26) {
                            documentosCosto documento = new documentosCosto();
                            try {
                                ope = lineaSplit[6];
                                fact = lineaSplit[19];

                                documentosCosto veriDocumento = db.documentosCosto.Where(x => x.operador == ope && x.factura == fact && x.activo == 1 && x.lineaNegocio == lineaNegocio).FirstOrDefault();
                                if (veriDocumento != null) {
                                    listaErrores.Add("Línea " + lineaActual + ": El Operador y Factura actual ya estan dados de alta.");
                                    continue;
                                }

                                if (lineaSplit[0] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Año es obligatorio.");
                                    continue;
                                }
                                documento.ano = new DateTime(Int32.Parse(lineaSplit[0]), 01, 01);

                                if (lineaSplit[1] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Fecha Contable es obligatorio.");
                                    continue;
                                }
                                DateTime dtFecha = FNCGrales.ConvierteFecha(lineaSplit[1], '-', "DMY");

                                documento.fechaContable = dtFecha;

                                if (lineaSplit[2] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Fecha Consumo es obligatorio.");
                                    continue;
                                }

                                dtFecha = FNCGrales.ConvierteFecha("01-" + lineaSplit[2], '-', "DMY");
                                documento.fechaConsumo = dtFecha;
                                if (documento.fechaConsumo.Month >= hoy.Month && documento.fechaConsumo.Year == hoy.Year) {
                                    listaErrores.Add("Línea " + lineaActual + ": No se permite cargar facturas con Mes Consumo que sean del mes en curso en adelante.");
                                    continue;
                                }

                                if (lineaSplit[3] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Compañia es obligatorio.");
                                    continue;
                                }
                                documento.compania = lineaSplit[3];
                                documento.servicio = lineaSplit[4];

                                if (lineaSplit[5] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Grupo es obligatorio.");
                                    continue;
                                }
                                documento.grupo = lineaSplit[5];

                                if (lineaSplit[6] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Id Operador es obligatorio.");
                                    continue;
                                }
                                documento.operador = lineaSplit[6];
                                documento.nombreOperador = lineaSplit[7];

                                if (lineaSplit[8] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Acreedor es obligatorio.");
                                    continue;
                                }
                                documento.acreedor = lineaSplit[8];

                                if (lineaSplit[9] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Código Material es obligatorio.");
                                    continue;
                                }
                                documento.codigoMaterial = lineaSplit[9];
                                documento.trafico = lineaSplit[10];

                                if (lineaSplit[11] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Monto IVA es obligatorio.");
                                    continue;
                                }
                                documento.montoIva = decimal.Parse(lineaSplit[11]);

                                if (lineaSplit[12] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo IVA es obligatorio.");
                                    continue;
                                }
                                documento.iva = decimal.Parse(lineaSplit[12]);

                                if (lineaSplit[13] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Moneda es obligatorio.");
                                    continue;
                                }
                                documento.moneda = lineaSplit[13];

                                if (lineaSplit[14] == null || lineaSplit[14] == "")
                                    documento.minutos = null;
                                else
                                    documento.minutos = decimal.Parse(lineaSplit[14]);

                                if (lineaSplit[15] == null || lineaSplit[15] == "")
                                    documento.tarifa = null;
                                else
                                    documento.tarifa = decimal.Parse(lineaSplit[15]);

                                if (lineaSplit[16] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Monto es obligatorio.");
                                    continue;
                                }
                                documento.monto = decimal.Parse(lineaSplit[16]);

                                if (lineaSplit[17] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Monto Facturado es obligatorio.");
                                    continue;
                                }
                                documento.montoFacturado = decimal.Parse(lineaSplit[17]);

                                if (lineaSplit[18] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Fecha Factura es obligatorio.");
                                    continue;
                                }
                                documento.fechaFactura = DateTime.ParseExact(lineaSplit[18], "dd/MM/yyyy", new CultureInfo("en-US"), DateTimeStyles.None);

                                if (lineaSplit[19] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Factura es obligatorio.");
                                    continue;
                                }
                                documento.factura = lineaSplit[19];

                                if (lineaSplit[20] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Tipo Cambio es obligatorio.");
                                    continue;
                                }
                                documento.tipoCambio = decimal.Parse(lineaSplit[20]);

                                if (lineaSplit[21] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Monto MXP es obligatorio.");
                                    continue;
                                }
                                documento.montoMXP = decimal.Parse(lineaSplit[21]);
                                documento.cuentaContable = lineaSplit[22];

                                var result = db.spValidaDocumentosCost(documento.compania, documento.servicio,
                                    documento.grupo, documento.acreedor, documento.operador, documento.trafico,
                                    documento.moneda, documento.cuentaContable, documento.codigoMaterial, lineaNegocio
                                ).ToList();

                                documento.idSociedad = result[0].idSociedad;
                                documento.idServicio = result[0].idServicio;
                                documento.idGrupo = result[0].idGrupo;
                                documento.idOperador = result[0].idOperador;
                                documento.idAcreedor = result[0].idAcreedor;
                                documento.idTrafico = result[0].idTrafico;
                                documento.idMoneda = result[0].idMoneda;
                                documento.idCuentaResultado = result[0].idCuentaResultado;

                                if (result[0].idStatus == 1) {
                                    documento.activo = 1;
                                    totalProcesados++;
                                } else {
                                    documento.activo = 0;
                                    var cadena = result[0].cadenaResultado;
                                    listaErrores.Add("Línea " + lineaActual + ": Error en la carga, no se encontraron coincidencias" +
                                        " en los siguientes catálogo(s)" + cadena.Remove(cadena.Length - 1) + ".");
                                }

                                if (lineaSplit[23] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Clase Documento es obligatorio.");
                                    continue;
                                }
                                documento.claseDocumento = lineaSplit[23];

                                if (lineaSplit[24] == "") {
                                    listaErrores.Add("Línea " + lineaActual + ": El campo Clase Documento SAP es obligatorio.");
                                    continue;
                                }
                                documento.claseDocumentoSAP = lineaSplit[24];
                                // Se agrega en el Sprint 7
                                documento.numDocumentoPF = lineaSplit[25];
                                documento.estatus = "PENDIENTE DE PROCESAR";
                                documento.lineaNegocio = lineaNegocio;
                                db.documentosCosto.Add(documento);
                                Log log = new Log();
                                log.insertaNuevoOEliminado(documento, "Nuevo", "documentosCosto.html", Request.UserHostAddress);

                            } catch (FormatException e ) {
                                if ( e.Message == "String was not recognized as a valid DateTime.") {
                                    listaErrores.Add("Línea " + lineaActual + ": Campo de Fecha con formato erróneo.");
                                } else
                                listaErrores.Add("Línea " + lineaActual + ": Campo con formato erróneo.");
                            } catch (Exception ) {
                                listaErrores.Add("Línea " + lineaActual + ": Error desconocido. ");
                            }
                        } else {
                            listaErrores.Add("Línea " + lineaActual + ": Número de campos insuficiente.");
                        }
                    }
                    db.SaveChanges();
                    scope.Complete();
                    exception = "Datos cargados con éxito";
                    status = true;
                }
            } catch (FileNotFoundException ) {
                exception = "El archivo Selecionado aún no existe en el Repositorio.";
                status = false;
            } catch (UnauthorizedAccessException ) {
                exception = "No tiene permiso para acceder al archivo actual.";
                status = false;
            } catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32) {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
                status = false;
            } catch (TransactionAbortedException ) {
                exception = "Transacción abortada. Se presentó un error.";
                status = false;
            } catch (Exception err) {
                exception = "Error desconocido. " + err.InnerException.ToString();
                status = false;
            } finally {
                respuesta = new
                {
                    success = true,
                    results = listaErrores,
                    mensaje = exception,
                    mensajeExistencia,
                    totalProcesados = totalProcesados,
                    status = status
                };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AgregarDocumentosCosto(int ano, DateTime fechaContable, DateTime fechaConsumo, int idSociedad,
            string compania, int? idServicio, string servicio, int idGrupo, string grupo, int idAcreedor, string acreedor, int idOperador,
            string operador, string nombreOperador, string codigoMaterial, int? idTrafico, string trafico, decimal montoIva,
            decimal iva, int idMoneda, string moneda, decimal? minutos, decimal? tarifa, decimal monto, decimal montoFacturado,
            DateTime fechaFactura, string factura, decimal tipoCambio, decimal montoMXP, int? idCuentaResultado, string cuentaContable,
            string claseDocumento, string claseDocumentoSAP, string numDocumentoPF, int lineaNegocio)
        {
            object respuesta = null;

            documentosCosto veriDocumento = db.documentosCosto.Where(x => x.operador == operador && x.factura == factura && x.activo == 1 && x.lineaNegocio == lineaNegocio).SingleOrDefault();
            if (veriDocumento == null) {
                try {
                    documentosCosto documento = new documentosCosto();
                    documento.ano = new DateTime(ano, 01, 01);
                    documento.fechaContable = fechaContable;
                    documento.fechaConsumo = fechaConsumo;
                    documento.idSociedad = idSociedad;
                    documento.compania = compania;
                    documento.idServicio = idServicio;
                    documento.servicio = servicio;
                    documento.idGrupo = idGrupo;
                    documento.grupo = grupo;
                    documento.idAcreedor = idAcreedor;
                    documento.acreedor = acreedor;
                    documento.idOperador = idOperador;
                    documento.operador = operador;
                    documento.nombreOperador = nombreOperador;
                    documento.codigoMaterial = codigoMaterial;
                    documento.idTrafico = idTrafico;
                    documento.trafico = trafico;
                    documento.montoIva = montoIva;
                    documento.iva = iva;
                    documento.idMoneda = idMoneda;
                    documento.moneda = moneda;
                    documento.minutos = minutos;
                    documento.tarifa = tarifa;
                    documento.monto = monto;
                    documento.montoFacturado = montoFacturado;
                    documento.fechaFactura = fechaFactura;
                    documento.factura = factura;
                    documento.tipoCambio = tipoCambio;
                    documento.montoMXP = montoMXP;
                    documento.idCuentaResultado = idCuentaResultado;
                    documento.cuentaContable = cuentaContable;
                    documento.claseDocumento = claseDocumento;
                    documento.claseDocumentoSAP = claseDocumentoSAP;
                    documento.numDocumentoPF = numDocumentoPF;
                    documento.activo = 1;
                    documento.lineaNegocio = lineaNegocio;
                    documento.estatus = "PENDIENTE DE PROCESAR";
                    db.documentosCosto.Add(documento);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(documento, "Nuevo", "documentosCosto.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ) {
                    respuesta = new { success = false, results = "Hubo un error al momento de realizar la petición." };
                }
            } else {
                respuesta = new { success = false, results = "El Operador y Factura actual ya estan dados de alta." };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ModificarDocumentosCosto(int lineaNegocio, int id, int ano, DateTime fechaContable, DateTime fechaConsumo,
            int idSociedad, string compania, int? idServicio, string servicio, int idGrupo, string grupo, int idAcreedor, string acreedor,
            int idOperador, string operador, string nombreOperador, string codigoMaterial, int? idTrafico, string trafico,
            decimal montoIva, decimal iva, int idMoneda, string moneda, decimal? minutos, decimal? tarifa, decimal monto,
            decimal montoFacturado, DateTime fechaFactura, string factura, decimal tipoCambio, decimal montoMXP,
            int? idCuentaResultado, string cuentaContable, string claseDocumento, string claseDocumentoSAP, string numDocumentoPF)
        {
            object respuesta = null;

            documentosCosto VerificaDoc = db.documentosCosto.Where(x => x.operador == operador && x.factura == factura && x.activo == 1 && x.lineaNegocio == lineaNegocio).SingleOrDefault();
            if (VerificaDoc == null || VerificaDoc.Id == id) {
                try {
                    documentosCosto documento = db.documentosCosto.Where(x => x.Id == id).SingleOrDefault();

                    if (documento.lineaNegocio != 1) {
                        documento.idMoneda = idMoneda;
                        documento.moneda = moneda;
                    }

                    documento.ano = new DateTime(ano, 01, 01);
                    documento.fechaContable = fechaContable;
                    documento.fechaConsumo = fechaConsumo;
                    documento.idSociedad = idSociedad;
                    documento.compania = compania;
                    documento.idServicio = idServicio;
                    documento.servicio = servicio;
                    documento.idGrupo = idGrupo;
                    documento.grupo = grupo;
                    documento.idAcreedor = idAcreedor;
                    documento.acreedor = acreedor;
                    documento.idOperador = idOperador;
                    documento.operador = operador;
                    documento.nombreOperador = nombreOperador;
                    documento.codigoMaterial = codigoMaterial;
                    documento.idTrafico = idTrafico;
                    documento.trafico = trafico;
                    documento.montoIva = montoIva;
                    documento.iva = iva;
                    documento.idMoneda = idMoneda;
                    documento.moneda = moneda;
                    documento.minutos = minutos;
                    documento.tarifa = tarifa;
                    documento.monto = monto;
                    documento.montoFacturado = montoFacturado;
                    documento.fechaFactura = fechaFactura;
                    documento.factura = factura;
                    documento.tipoCambio = tipoCambio;
                    documento.montoMXP = montoMXP;
                    documento.idCuentaResultado = idCuentaResultado;
                    documento.cuentaContable = cuentaContable;
                    documento.claseDocumento = claseDocumento;
                    documento.claseDocumentoSAP = claseDocumentoSAP;
                    documento.numDocumentoPF = numDocumentoPF;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(documento, "Id", documento.Id, "documentosCosto.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ) {
                    respuesta = new { success = false, results = "Hubo un error mientras se procesaba la petición." };
                }
            } else {
                respuesta = new { success = false, results = "El Operador y Factura actual ya estan dados de alta." };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult BorrarDocumentosCosto(string strID)
        {
            object respuesta = null;
            int Id = 0;
            strID = strID.TrimEnd(',');
            try {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++) {
                    if (Ids[i].Length != 0) {
                        Id = int.Parse(Ids[i]);
                        documentosCosto documento = db.documentosCosto.Where(x => x.Id == Id && x.activo == 1).SingleOrDefault();
                        documento.activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(documento, "Eliminado", "documentosCosto.html", Request.UserHostAddress);

                        db.SaveChanges();
                    }
                }
                respuesta = new { success = true, result = "ok" };
            } catch (Exception ex) {
                respuesta = new { success = false, result = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaAcreedor(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oAcreedor in db.Acreedor
                            where oAcreedor.Activo == 1 && oAcreedor.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oAcreedor.Id,
                                oAcreedor.Acreedor1,
                                oAcreedor.NombreAcreedor
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Acreedor = elemento.Acreedor1,
                        Descripcion = elemento.Acreedor1 + " - " + elemento.NombreAcreedor
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

        public JsonResult LlenaCompania(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oSociedad in db.Sociedad
                            where oSociedad.Activo == 1 && oSociedad.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oSociedad.Id,
                                oSociedad.Id_Sociedad,
                                oSociedad.AbreviaturaSociedad
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Nombre = elemento.AbreviaturaSociedad,
                        Descripcion = elemento.Id_Sociedad + " - " + elemento.AbreviaturaSociedad
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

        public JsonResult LlenaServicio(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oSservicio in db.Servicio
                            where oSservicio.Activo == 1 && oSservicio.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oSservicio.Id,
                                oSservicio.Servicio1,
                                oSservicio.Id_Servicio
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Servicio = elemento.Servicio1,
                        Descripcion = elemento.Id_Servicio + " - " + elemento.Servicio1
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

        public JsonResult LlenaGrupo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oGrupo in db.Grupo
                            where oGrupo.Activo == 1 && oGrupo.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oGrupo.Id,
                                oGrupo.Grupo1,
                                oGrupo.DescripcionGrupo
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Grupo = elemento.Grupo1,
                        Descripcion = elemento.Grupo1 + " - " + elemento.DescripcionGrupo
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

        public JsonResult LlenaOperador(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oOperador in db.Operador
                            where oOperador.Activo == 1 && oOperador.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oOperador.Id,
                                oOperador.Id_Operador,
                                oOperador.Nombre
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Operador = elemento.Id_Operador,
                        Descripcion = elemento.Id_Operador + " - " + elemento.Nombre
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

        public JsonResult LlenaCodigoMaterial(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oCuenta in db.CuentaResultado
                            where oCuenta.Activo == 1 &&
                            oCuenta.Id_LineaNegocio == lineaNegocio &&
                            oCuenta.Sentido == "Costos"
                            select new
                            {
                                oCuenta.Id,
                                oCuenta.Material,
                                oCuenta.Codigo_Material,
                               
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Codigo = elemento.Codigo_Material,
                        Descripcion = elemento.Codigo_Material + " - " + elemento.Material
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

        public JsonResult LlenaTrafico(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;
            try {
                var datos = from oTrafico in db.Trafico
                            where oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oTrafico.Id,
                                oTrafico.Descripcion,
                                oTrafico.Id_TraficoTR
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Desc = elemento.Id_TraficoTR,
                        Descripcion = elemento.Id_TraficoTR + " - " + elemento.Descripcion
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

        public JsonResult LlenaMoneda(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oMoneda in db.Moneda
                            where oMoneda.Activo == 1 && oMoneda.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oMoneda.Id,
                                oMoneda.Moneda1,
                                oMoneda.Descripcion
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Moneda = elemento.Moneda1,
                        Descripcion = elemento.Moneda1 + " - " + elemento.Descripcion
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

        public JsonResult LlenaCuenta(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from oCuenta in db.CuentaResultado
                            where oCuenta.Activo == 1 && oCuenta.Id_LineaNegocio == lineaNegocio
                            && oCuenta.Sentido == "Costos"
                            select new
                            {
                                oCuenta.Id,
                                oCuenta.Cuenta
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Cuenta = elemento.Cuenta
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

        public string[] separarLineas(string cadena)
        {
            var aux = "";
            int i;
            for (i = 0; i < cadena.Length-1; ++i) {
                if (cadena[i] == '"') {
                    do {
                        aux += cadena[i];
                        ++i;
                    } while (cadena[i] != '"');
                    aux += cadena[i];
                }
                if (cadena[i] == ';')
                    aux += '|';
                else
                    aux += cadena[i];
            }

            aux += cadena[i];

            return aux.Split('|');
        }
    }
}