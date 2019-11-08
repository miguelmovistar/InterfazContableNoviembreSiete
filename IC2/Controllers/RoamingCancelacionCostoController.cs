using IC2.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class RoamingCancelacionCostoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();        
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();

        // GET: RoamingCancelacionCosto
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult cargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            List<string> listaErrores = new List<string>();
            var hoy = DateTime.Now;
            IEnumerable<string> lineas = null;
            object respuesta = null;
            int totalProcesados = 0;
            int lineaActual = 1;
            int contador = 0;
            bool status = false;
            string ope, fact;
            string exception = "Error, se presento un error inesperado.";

            try
            {
                List<string> csvData = new List<string>();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(archivoCSV.InputStream, System.Text.Encoding.GetEncoding("ISO-8859-1")))
                {
                    while (!reader.EndOfStream)
                    {
                        csvData.Add(reader.ReadLine());
                    }
                }
                lineas = csvData.Skip(1);

                var datos = (from periodos in db.cargaDocumentoRoaming
                             where periodos.idDocumento == "TAPIN" & periodos.ordenCarga == "A" & periodos.estatusCarga == "PC"
                             group periodos by periodos.periodoCarga into g
                             orderby g.Key ascending
                             select new
                             { Id = g.Key, Periodo = g.Key }).FirstOrDefault();



                var _IdOperador = db.Operador
                                   .Select(p => p.Id_Operador)
                                   .ToArray();

                var _Acreedor = db.Acreedor
                                   .Select(p => p.Acreedor1)
                                   .ToArray();


                string Activo = "";
                String Valor = "";

                using (TransactionScope scope = new TransactionScope())
                {
                    foreach (string ln in lineas)
                    {
                        string linea = ln.Replace('%', ' ');
                        var lineaSplit = linea.Split('|');
                        ++lineaActual;
                        if (lineaSplit.Count() == 14)
                        {
                            RoamingCancelacionCosto entidad = new RoamingCancelacionCosto();

                            try
                            {
                                contador++;
                                ope = lineaSplit[2];
                                fact = lineaSplit[11];

                                Activo = ((!_IdOperador.Any(o => o == lineaSplit[3].ToUpper())) ? "0" : "1");

                                if (Activo == "1")
                                {
                                    Activo = ((!_Acreedor.Any(o => o == lineaSplit[6].ToUpper())) ? "0" : "1");
                                }

                                decimal importeMXNtest = 0;
                                decimal difProvFact = 0;

                                entidad.BanderaConcepto = lineaSplit[0];
                                entidad.NumeroProvision = lineaSplit[1];
                                entidad.FechaContable = datos.Periodo.ToString();
                                entidad.CuentaContable = lineaSplit[2];
                                entidad.Indat = lineaSplit[3];
                                entidad.Concepto = lineaSplit[4];
                                entidad.Grupo = lineaSplit[5];
                                entidad.Acreedor = lineaSplit[6];
                                entidad.MontoProvision = lineaSplit[7];
                                entidad.Moneda = lineaSplit[8];
                                entidad.Periodo = lineaSplit[9];
                                entidad.Tipo = lineaSplit[10];
                                entidad.NumeroDocumentoSap = lineaSplit[11];
                                entidad.FolioDocumento = lineaSplit[12];
                                entidad.TipoCambioProvision = lineaSplit[13];
                                //entidad.ImporteMxn = lineaSplit[14];
                                //entidad.ImporteFactura = lineaSplit[15];
                                //entidad.DiferenciaProvisionFactura = lineaSplit[16];
                                //entidad.TipoCambioFactura = lineaSplit[17];
                                //entidad.ExcesoProvisionMxn = lineaSplit[18];
                                //Valor = lineaSplit[19];
                                //entidad.InsuficienciaProvisionMxn = Valor.Replace(",,", "");



                                importeMXNtest = Convert.ToDecimal(entidad.MontoProvision) * Convert.ToDecimal(entidad.TipoCambioProvision);
                                entidad.ImporteMxn = Convert.ToString(importeMXNtest);

                                var monto = from montodock in db.RoamingDocumentoCosto
                                            where montodock.IdOperador == entidad.Indat & montodock.FolioDocumento == entidad.FolioDocumento
                                            & montodock.FechaConsumo == entidad.Periodo

                                            group montodock by new { montodock.FechaContable }

                                into mygroup
                                            select mygroup.FirstOrDefault();

                                foreach (var elemento in monto)
                                {
                                    entidad.ImporteFactura = elemento.Monto;
                                }

                                difProvFact = Convert.ToDecimal(entidad.MontoProvision) + Convert.ToDecimal(entidad.ImporteFactura);
                                entidad.DiferenciaProvisionFactura = Convert.ToString(difProvFact);

                                var tipocambiotest = from tipoCamb in db.RoamingDocumentoCosto
                                                     where tipoCamb.FechaConsumo == entidad.Periodo & tipoCamb.IdOperador == entidad.Indat
                                                     & tipoCamb.FolioDocumento == entidad.FolioDocumento

                                                     group tipoCamb by new { tipoCamb.FechaContable }

                                into mygroup
                                                     select mygroup.FirstOrDefault();

                                foreach (var elemento in tipocambiotest)
                                {
                                    entidad.TipoCambioFactura = elemento.TipoCambio;
                                }

                                if (float.Parse(entidad.DiferenciaProvisionFactura) < 0)
                                {
                                    decimal excprov = 0;

                                    excprov = Convert.ToDecimal(entidad.DiferenciaProvisionFactura) * Convert.ToDecimal(entidad.TipoCambioProvision);

                                    entidad.ExcesoProvisionMxn = Convert.ToString(excprov);
                                }
                                else
                                {
                                    entidad.ExcesoProvisionMxn = "0";
                                }


                                if (Convert.ToDecimal(entidad.DiferenciaProvisionFactura) > 0)
                                {

                                    decimal insufiProvi = 0;
                                    insufiProvi = Convert.ToDecimal(entidad.DiferenciaProvisionFactura) * Convert.ToDecimal(entidad.TipoCambioFactura);
                                    entidad.InsuficienciaProvisionMxn = Convert.ToString(insufiProvi);
                                }
                                else
                                {
                                    entidad.InsuficienciaProvisionMxn = "0";
                                }

                                //entidad.InsuficienciaProvisionMxn = lineaSplit[18];


                                entidad.Activo = Activo;
                                entidad.LineaNegocio = "1";
                                entidad.FechaCarga = DateTime.Now;

                                var flujo = from consuImpo in db.RoamingDocumentoCosto
                                            where consuImpo.IdOperador == entidad.Indat & consuImpo.FolioDocumento == entidad.FolioDocumento
                                            group consuImpo by new { consuImpo.FechaContable }

                                into mygroup
                                            select mygroup.FirstOrDefault();

                                foreach (var elemento in flujo)
                                {
                                    if (entidad.BanderaConcepto == "TARIFA")
                                    {
                                        entidad.FechaConsumoTarifa = elemento.FechaConsumo;
                                        entidad.ImporteFacturaTarifa = elemento.MontoFacturado;
                                    }
                                }

                                totalProcesados++;

                                db.RoamingCancelacionCosto.Add(entidad);
                            }
                            catch (FormatException e)
                            {
                                if (e.Message == "String was not recognized as a valid DateTime.")
                                {
                                    listaErrores.Add("Línea " + lineaActual + ": Campo de Fecha con formato erróneo.");
                                }
                                else
                                    listaErrores.Add("Línea " + lineaActual + ": Campo con formato erróneo.");
                            }
                            catch (Exception)
                            {
                                listaErrores.Add("Línea " + lineaActual + ": Error desconocido. ");
                            }
                        }
                        else
                        {
                            listaErrores.Add("Línea " + lineaActual + ": Número de campos insuficiente.");
                        }
                    }
                    db.SaveChanges();
                    scope.Complete();
                    exception = "Datos cargados con éxito";
                    status = true;
                }

                // LLenar fluctuacion
                if (status)
                {
                    db.Database.CommandTimeout = 3000;
                    db.sp_FluctuacionROM_Insert(DateTime.Parse(datos.Periodo), "COSTO", "FluctuacionCostoROM");

                    using (var anteriores = new Negocio.PeriodosAnteriores())
                        anteriores.CrearPeriodosAnteriores(db);
                }


            }
            catch (FileNotFoundException)
            {
                exception = "El archivo Selecionado aún no existe en el Repositorio.";
                status = false;
            }
            catch (UnauthorizedAccessException)
            {
                exception = "No tiene permiso para acceder al archivo actual.";
                status = false;
            }
            catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32)
            {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
                status = false;
            }
            catch (TransactionAbortedException)
            {
                exception = "Transacción abortada. Se presentó un error.";
                status = false;
            }
            catch (Exception err)
            {
                exception = "Error desconocido. " + err.InnerException.ToString();
                status = false;
            }
            finally
            {
                respuesta = new
                {
                    success = true,
                    results = listaErrores,
                    mensaje = exception,
                    totalProcesados = totalProcesados,
                    status = status
                };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;
            string _LineaNegocio = lineaNegocio.ToString();

            try
            {
                var Query = from p in db.RoamingCancelacionCosto
                            group p by new { p.FechaContable }
                            into mygroup
                            select mygroup.FirstOrDefault();

                foreach (var elemento in Query)
                {
                    DateTime _Fecha = DateTime.Parse(elemento.FechaContable.ToString());

                    lista.Add(new
                    {
                        Id = _Fecha,
                        Periodo = _Fecha.Year + "-" + (_Fecha.Month.ToString("d2")) + "-" + _Fecha.Day,
                        Fecha = _Fecha.Year + " " + meses[(_Fecha.Month)]
                    });
                }

                total = lista.Count();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        public JsonResult LlenaGrid(int? lineaNegocio, DateTime Periodo, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;
            DateTime periodo = DateTime.Now;

            string mes = Periodo.Month.ToString().Length == 1 ? "0" + Periodo.Month.ToString() : Periodo.Month.ToString();
            string anio = Periodo.Year.ToString();

            try
            {
                var JoinQuery =
                    from C in db.RoamingCancelacionCosto
                        join D in db.RoamingDocumentoCosto
                            on new { FIRST = C.FolioDocumento, SECOND = C.Indat }
                                equals new { FIRST = D.FolioDocumento, SECOND = D.IdOperador } into gj
                    from D in gj.DefaultIfEmpty()
                    where C.FechaContable.Substring(5, 2) == mes &&
                                C.FechaContable.Substring(0, 4) == anio &&
                                C.LineaNegocio == "1"
                    orderby C.Indat ascending

                    select new
                    {
                        C.BanderaConcepto,
                        C.NumeroProvision,
                        C.FechaContable,
                        C.CuentaContable,
                        C.Indat,
                        C.Concepto,
                        C.Grupo,
                        C.Acreedor,
                        C.MontoProvision,
                        C.Moneda,
                        C.Periodo,
                        C.Tipo,
                        C.NumeroDocumentoSap,
                        C.FolioDocumento,
                        C.TipoCambioProvision,
                        C.ImporteMxn,
                        C.ImporteFactura,
                        C.DiferenciaProvisionFactura,
                        C.TipoCambioFactura,
                        C.ExcesoProvisionMxn,
                        C.InsuficienciaProvisionMxn,
                        D.FechaConsumo,
                        D.TipoCambio,
                        D.MontoFacturado
                    };

                string MontoFacturado = "", FechaConsumo = "", TipoCambio = "";
                foreach (var elemento in JoinQuery)
                {
                    if (elemento.ImporteFactura == "")
                    {
                        MontoFacturado = elemento.MontoFacturado;
                        FechaConsumo = elemento.FechaConsumo;
                        TipoCambio = elemento.TipoCambio;
                    }

                    lista.Add(new
                    {
                        elemento.BanderaConcepto,
                        elemento.NumeroProvision,
                        elemento.FechaContable,
                        elemento.CuentaContable,
                        elemento.Indat,
                        elemento.Concepto,
                        elemento.Grupo,
                        elemento.Acreedor,
                        elemento.MontoProvision,
                        elemento.Moneda,
                        elemento.Periodo,
                        elemento.Tipo,
                        elemento.NumeroDocumentoSap,
                        elemento.FolioDocumento,
                        elemento.TipoCambioProvision,
                        elemento.ImporteMxn,
                        elemento.ImporteFactura,
                        elemento.DiferenciaProvisionFactura,
                        elemento.TipoCambioFactura,
                        elemento.ExcesoProvisionMxn,
                        elemento.InsuficienciaProvisionMxn,
                        FechaConsumo,
                        TipoCambio,
                        MontoFacturado
                    });

                    MontoFacturado = "";
                    FechaConsumo = "";
                    TipoCambio = "";

                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { results = lista, start = start, limit = limit, total = total, succes = true };

            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

    }
}