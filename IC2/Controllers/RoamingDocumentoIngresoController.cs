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
    public class RoamingDocumentoIngresoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();

        // GET: RoamingDocumentoIngreso
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult CargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            List<string> listaErrores = new List<string>();
            var hoy = DateTime.Now;
            IEnumerable<string> lineas = null;
            object respuesta = null;
            int totalProcesados = 0;
            int lineaActual = 1;
            bool status = false;
            string ope, fact;
            string exception = "Error, se presento un error inesperado."; 

            try
            {
                List<string> csvData = new List<string>();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(archivoCSV.InputStream))
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

                using (TransactionScope scope = new TransactionScope())
                {
                    foreach (string ln in lineas)
                    {
                        string linea = ln.Replace('%', ' ');
                        var lineaSplit = linea.Split('|');
                        ++lineaActual;
                        if (lineaSplit.Count() == 26)
                        {

                            RoamingDocumentoIngreso entidad = new RoamingDocumentoIngreso();

                            try
                            {
                                ope = lineaSplit[6];
                                fact = lineaSplit[19];

                                entidad.Anio = lineaSplit[0];
                                entidad.FechaContable = datos.Periodo.ToString(); //lineaSplit[1];
                                entidad.FechaConsumo = lineaSplit[2];
                                entidad.Compania = lineaSplit[3];
                                entidad.Servicio = lineaSplit[4];
                                entidad.Grupo = lineaSplit[5];
                                entidad.IdOperador = lineaSplit[6];
                                entidad.NombreOperador = lineaSplit[7];
                                entidad.Deudor = lineaSplit[8];
                                entidad.Material = lineaSplit[9];
                                entidad.Trafico = lineaSplit[10];
                                entidad.Iva = lineaSplit[11];
                                entidad.PorcentajeIva = lineaSplit[12];
                                entidad.Moneda = lineaSplit[13];
                                entidad.Minutos = lineaSplit[14];
                                entidad.Tarifa = lineaSplit[15];
                                entidad.Monto = lineaSplit[16];
                                entidad.MontoFacturado = lineaSplit[17];
                                entidad.FechaFactura = lineaSplit[18];
                                entidad.FolioDocumento = lineaSplit[19];
                                entidad.TipoCambio = lineaSplit[20];
                                entidad.MontoMxn = lineaSplit[21];
                                entidad.CuentaContable = lineaSplit[22];
                                entidad.ClaseDocumento = lineaSplit[23];
                                entidad.ClaseDocumentoSap = lineaSplit[24];
                                entidad.NumeroDocumentoSap = lineaSplit[25];
                                entidad.Activo = "1";
                                entidad.LineaNegocio = "1";
                                entidad.FechaCarga = DateTime.Now;

                                totalProcesados++;

                                db.RoamingDocumentoIngreso.Add(entidad);

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
                var Query = from p in db.RoamingDocumentoIngreso
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

            string mes = Periodo.Month.ToString().Length == 1 ? "0" + Periodo.Month.ToString() : Periodo.Month.ToString();
            string anio = Periodo.Year.ToString();

            try
            {
                var JoinQuery = from C in db.RoamingDocumentoIngreso
                                where C.FechaContable.Substring(5, 2) == mes &&
                                C.FechaContable.Substring(0, 4) == anio &&
                                C.LineaNegocio == "1"
                                orderby C.FolioDocumento ascending

                                select new
                                {
                                    C.Anio,
                                    C.FechaContable,
                                    C.FechaConsumo,
                                    C.Compania,
                                    C.Servicio,
                                    C.Grupo,
                                    C.IdOperador,
                                    C.NombreOperador,
                                    C.Deudor,
                                    C.Material,
                                    C.Trafico,
                                    C.Iva,
                                    C.PorcentajeIva,
                                    C.Moneda,
                                    C.Minutos,
                                    C.Tarifa,
                                    C.Monto,
                                    C.MontoFacturado,
                                    C.FechaFactura,
                                    C.FolioDocumento,
                                    C.TipoCambio,
                                    C.MontoMxn,
                                    C.CuentaContable,
                                    C.ClaseDocumento,
                                    C.ClaseDocumentoSap,
                                    C.NumeroDocumentoSap
                                };

                foreach (var elemento in JoinQuery)
                {
                    lista.Add(new
                    {
                        elemento.Anio,
                        elemento.FechaContable,
                        elemento.FechaConsumo,
                        elemento.Compania,
                        elemento.Servicio,
                        elemento.Grupo,
                        elemento.IdOperador,
                        elemento.NombreOperador,
                        elemento.Deudor,
                        elemento.Material,
                        elemento.Trafico,
                        elemento.Iva,
                        elemento.PorcentajeIva,
                        elemento.Moneda,
                        elemento.Minutos,
                        elemento.Tarifa,
                        elemento.Monto,
                        elemento.MontoFacturado,
                        elemento.FechaFactura,
                        elemento.FolioDocumento,
                        elemento.TipoCambio,
                        elemento.MontoMxn,
                        elemento.CuentaContable,
                        elemento.ClaseDocumento,
                        elemento.ClaseDocumentoSap,
                        elemento.NumeroDocumentoSap
                    });
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