using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using IC2.Funciones;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class NotaCreditoController : Controller
    {
        // GET: NotaCredito
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
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

        public JsonResult CargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {

            object respuesta = null;
            Cadenas oCadena = new Cadenas();
            int numLinea = 1, n_code = 0, procesados = 0;
            string nuevaLinea, grupos = "", operadores = "", sociedades = "", trafico = "", servicio = "";
            string deudorAcreedor = "", monedas = "";
            decimal importe = 0;

            string[] arreglo = null;
            IEnumerable<string> Lineas = null;
            List<NotaCredito> lista = new List<NotaCredito>();
            List<NotaCredito> listaProcesados = new List<NotaCredito>();
            List<Claves> listaID = new List<Claves>();
            List<object> ids = new List<object>();
            List<string> listaErroneos = new List<string>();
            try {
                List<string> csvData = new List<string>();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(archivoCSV.InputStream, Encoding.Default)) {
                    while (!reader.EndOfStream) {
                        csvData.Add(reader.ReadLine());
                    }
                }
                Lineas = csvData.Skip(1);

                string[] arrOperador = new string[Lineas.Count()];
                string[] arrSociedad = new string[Lineas.Count()];
                string[] arrTrafico = new string[Lineas.Count()];
                string[] arrServicio = new string[Lineas.Count()];
                string[] arrDeudorAcreedor = new string[Lineas.Count()];
                string[] arrMoneda = new string[Lineas.Count()];
                string[] arrGrupo = new string[Lineas.Count()];
                string[] arrOperadores = new string[Lineas.Count()];
                foreach (string linea in Lineas) {
                    nuevaLinea = linea;
                    //validacion
                    if (nuevaLinea.Contains('"')) {
                        nuevaLinea = oCadena.fixCadena(nuevaLinea);
                        arreglo = nuevaLinea.Split(';');
                    } else
                        arreglo = nuevaLinea.Split(';');
                    //Llena la lista con las notas de crédito en el archivo.
                    if (decimal.Parse(arreglo[7]) < 0)
                        importe = decimal.Parse(arreglo[7].Replace("¬", ""));
                    else
                    {
                        string texto = "Linea " + numLinea + ": El importe debe ser negativo.";
                        listaErroneos.Add(texto);
                        continue;
                    }
                    if (ValidaLinea(arreglo)) {
                        lista.Add(new NotaCredito
                        {
                            sentido = arreglo[0],
                            importe = importe,
                            mes_consumo = DateTime.ParseExact(arreglo[9], "dd/MM/yyyy", new CultureInfo("es-ES"))
                        });

                        sociedades = sociedades + arreglo[1] + ",";
                        trafico = trafico + arreglo[2] + ",";
                        servicio = servicio + arreglo[3] + ",";
                        deudorAcreedor = deudorAcreedor + arreglo[4] + ",";
                        operadores = operadores + arreglo[5] + ",";
                        grupos = grupos + arreglo[6] + ",";
                        monedas = monedas + arreglo[8] + ",";

                        arrSociedad[n_code] = arreglo[1];
                        arrTrafico[n_code] = arreglo[2];
                        arrServicio[n_code] = arreglo[3];
                        arrDeudorAcreedor[n_code] = arreglo[4];
                        arrOperadores[n_code] = arreglo[5];
                        arrGrupo[n_code] = arreglo[6];
                        arrMoneda[n_code] = arreglo[8];

                        n_code++;
                    } else {
                        string texto = "Línea " + numLinea + ": Número de campos insuficiente.";
                        listaErroneos.Add(texto);
                    }
                    numLinea++;
                }
                //Obtener lista sociedad
                listaID = BuscaId(sociedades, trafico, servicio, deudorAcreedor, operadores, grupos, monedas, lineaNegocio);
                listaProcesados = BuscaID(lista, listaID, arrSociedad, arrTrafico, arrServicio, arrDeudorAcreedor, arrOperadores, arrGrupo, arrMoneda, listaErroneos, lineaNegocio);
                listaProcesados = listaProcesados.Where(x => x.activo != 0).ToList();
                procesados = listaProcesados.Count();
                listaErroneos.Count();
                if (listaProcesados.Count() > 0) {
                    DbContext context = db;
                    IC2.DbContextSqlServerExtensions.BulkInsert(context, listaProcesados, true, "NotaCredito");
                }
                respuesta = new { success = true, results = listaErroneos, totalProcesados = procesados, mensaje = "Datos cargados con éxito" };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.InnerException, mensaje = "Error al cargar los datos." };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaGrid(int? lineaNegocio, DateTime periodo, int start, int limit, string deudorAcreedor,
                                                                                                string grupo,
                                                                                                string importe,
                                                                                                string mes_consumo,
                                                                                                string moneda,
                                                                                                string operador,
                                                                                                string sentido,
                                                                                                string servicio,
                                                                                                string sociedad,
                                                                                                string trafico)
        {
            object respuesta = null;
            if (periodo != null) {

                List<object> lista = new List<object>();
                int total = 0;
                try {
                    var notacredito = from nc in db.NotaCredito
                                      join soc in db.Sociedad
                                      on nc.id_sociedad equals soc.Id
                                      join traf in db.Trafico
                                      on nc.id_trafico equals traf.Id
                                      join serv in db.Servicio
                                      on nc.id_servicio equals serv.Id
                                      join oper in db.Operador
                                      on nc.id_operador equals oper.Id
                                      join grp in db.Grupo
                                      on nc.id_grupo equals grp.Id
                                      join mon in db.Moneda
                                      on nc.id_moneda equals mon.Id
                                      where nc.activo == 1 && nc.id_lineaNegocio == lineaNegocio
                                      && soc.Activo == 1 && soc.Id_LineaNegocio == lineaNegocio
                                      && traf.Activo == 1 && traf.Id_LineaNegocio == lineaNegocio
                                      && serv.Activo == 1 && serv.Id_LineaNegocio == lineaNegocio
                                      && oper.Activo == 1 && oper.Id_LineaNegocio == lineaNegocio
                                      && grp.Activo == 1 && grp.Id_LineaNegocio == lineaNegocio
                                      && mon.Activo == 1 && mon.Id_LineaNegocio == lineaNegocio
                                      && nc.periodo_carga.Year == periodo.Year
                                      && nc.periodo_carga.Month == periodo.Month

                                      && DbFiltro.String(nc.deudorAcreedor, deudorAcreedor)
                                      && DbFiltro.String(grp.Grupo1, grupo)
                                      && DbFiltro.Decimal(nc.importe, importe)
                                      && DbFiltro.Date(nc.mes_consumo, mes_consumo, "am")
                                      && DbFiltro.String(mon.Moneda1, moneda)
                                      && DbFiltro.String(oper.Razon_Social, operador)
                                      && DbFiltro.String(nc.sentido, sentido)
                                      && DbFiltro.String(serv.Servicio1, servicio)
                                      && DbFiltro.String(soc.NombreSociedad, sociedad)
                                      && DbFiltro.String(traf.Descripcion, trafico)

                                      select new
                                      {
                                          nc.id,
                                          nc.sentido,
                                          nc.id_sociedad,
                                          soc.NombreSociedad,
                                          nc.id_trafico,
                                          traf.Descripcion,
                                          nc.id_servicio,
                                          serv.Servicio1,
                                          nc.deudorAcreedor,
                                          nc.id_operador,
                                          oper.Razon_Social,
                                          nc.id_grupo,
                                          grp.Grupo1,
                                          nc.importe,
                                          nc.id_moneda,
                                          mon.Moneda1,
                                          nc.mes_consumo
                                      };

                    foreach (var elemento in notacredito) {
                        lista.Add(new
                        {
                            id = elemento.id,
                            sentido = elemento.sentido,
                            id_sociedad = elemento.id_sociedad,
                            sociedad = elemento.NombreSociedad,
                            id_trafico = elemento.id_trafico,
                            trafico = elemento.Descripcion,
                            id_servicio = elemento.id_servicio,
                            servicio = elemento.Servicio1,
                            deudorAcreedor = elemento.deudorAcreedor,
                            id_operador = elemento.id_operador,
                            operador = elemento.Razon_Social,
                            id_grupo = elemento.id_grupo,
                            grupo = elemento.Grupo1,
                            importe = elemento.importe.Value.ToString("C").Replace("$", ""),
                            id_moneda = elemento.id_moneda,
                            moneda = elemento.Moneda1,
                            mes_consumo_drop = elemento.mes_consumo,
                            mes_consumo = elemento.mes_consumo.Day.ToString("00") + "-" + elemento.mes_consumo.Month.ToString("00") + "-" + elemento.mes_consumo.Year,
                        });
                    }
                    total = lista.Count();
                    lista = lista.Skip(start).Take(limit).ToList();
                    respuesta = new { success = true, total = total, results = lista };
                } catch (Exception e) {
                    respuesta = new { success = false, results = e.Message };
                }
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void ExportaCSV(int? lineaNegocio, DateTime periodo)
        {
            StringWriter sw = new StringWriter();
            sw.WriteLine("Sentido;Sociedad;Trafico;Servicio;Deudor/Acreedor;Operador;Grupo;Importe;Moneda;Mes Consumo");

            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=NotasCredito.csv");
            Response.ContentType = "text/csv";

            var notacredito = from nc in db.NotaCredito
                              join sociedad in db.Sociedad
                              on nc.id_sociedad equals sociedad.Id
                              join trafico in db.Trafico
                              on nc.id_trafico equals trafico.Id
                              join servicio in db.Servicio
                              on nc.id_servicio equals servicio.Id
                              join operador in db.Operador
                              on nc.id_operador equals operador.Id
                              join grupo in db.Grupo
                              on nc.id_grupo equals grupo.Id
                              join moneda in db.Moneda
                              on nc.id_moneda equals moneda.Id

                              where nc.activo == 1 && nc.id_lineaNegocio == lineaNegocio
                              && sociedad.Activo == 1 && sociedad.Id_LineaNegocio == lineaNegocio
                              && trafico.Activo == 1 && trafico.Id_LineaNegocio == lineaNegocio
                              && servicio.Activo == 1 && servicio.Id_LineaNegocio == lineaNegocio
                              && operador.Activo == 1 && operador.Id_LineaNegocio == lineaNegocio
                              && grupo.Activo == 1 && grupo.Id_LineaNegocio == lineaNegocio
                              && moneda.Activo == 1 && moneda.Id_LineaNegocio == lineaNegocio
                              && nc.periodo_carga == periodo
                              select new
                              {
                                  nc.sentido,
                                  sociedad.NombreSociedad,
                                  trafico.Descripcion,
                                  servicio.Servicio1,
                                  nc.deudorAcreedor,
                                  operador.Razon_Social,
                                  grupo.Grupo1,
                                  nc.importe,
                                  moneda.Moneda1,
                                  nc.mes_consumo
                              };

            foreach (var elemento in notacredito) {
                sw.WriteLine(string.Format("{0};{1};{2};{3};{4};{5};{6};{7};{8};{9}",
                    elemento.sentido.Replace("\r\n", string.Empty),
                    elemento.NombreSociedad.Replace("\r\n", string.Empty),
                    elemento.Descripcion.Replace("\r\n", string.Empty),
                    elemento.Servicio1.Replace("\r\n", string.Empty),
                    elemento.deudorAcreedor.Replace("\r\n", string.Empty),
                    elemento.Razon_Social.Replace("\r\n", string.Empty),
                    elemento.Grupo1.Replace("\r\n", string.Empty),
                    elemento.importe,
                    elemento.Moneda1.Replace("\r\n", string.Empty),
                    elemento.mes_consumo.ToString("yyyy MMMM", new CultureInfo("es-ES")).ToUpper().Replace("\r\n", string.Empty)));
            }

            Response.Write(sw.ToString());
            Response.End();
        }
        public JsonResult Borrar(string strId)
        {
            int Id = 0;
            strId = strId.TrimEnd(',');
            string strmsg = "ok";
            bool blsucc = true;
            object respuesta;
            try {
                string[] Ids = strId.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        NotaCredito oNotaCredito = db.NotaCredito.Where(x => x.id == Id).SingleOrDefault();
                        oNotaCredito.activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oNotaCredito, "Eliminado", "NotaCredito.html", Request.UserHostAddress);

                        db.SaveChanges();

                    }
                }
                respuesta = new { success = blsucc, results = strmsg };
            } catch (Exception ex) {
                strmsg = ex.Message;
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Agregar(string Sentido, int? Sociedad, int? Trafico, int? Servicio, string DeudorAcreedor, int? Operador, int? Grupo, decimal Importe, int? Moneda, DateTime MesConsumo, int lineaNegocio)
        {
            object respuesta = null;
            DateTime fecha_contable = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            try {
                var nuevo = new NotaCredito();

                nuevo.sentido = Sentido;
                nuevo.id_sociedad = Sociedad;
                nuevo.id_trafico = Trafico;
                nuevo.id_servicio = Servicio;
                nuevo.deudorAcreedor = DeudorAcreedor;
                nuevo.id_operador = Operador;
                nuevo.id_grupo = Grupo;
                nuevo.importe = Importe;
                nuevo.id_moneda = Moneda;
                nuevo.mes_consumo = new DateTime(MesConsumo.Year, MesConsumo.Month, 1);
                nuevo.id_lineaNegocio = lineaNegocio;
                nuevo.activo = 1;
                nuevo.periodo_carga = fecha_contable;
                db.NotaCredito.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "NotaCredito.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };

            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar(int id, string Sentido, int? Sociedad, int? Trafico, int? Servicio, string DeudorAcreedor, int? Operador, int? Grupo, decimal Importe, int? Moneda, DateTime MesConsumo, int lineaNegocio)
        {
            object respuesta = null;
            try {
                NotaCredito nc = db.NotaCredito.Where(x => x.id == id).SingleOrDefault();

                nc.sentido = Sentido;
                nc.id_sociedad = Sociedad;
                nc.id_trafico = Trafico;
                nc.id_servicio = Servicio;
                nc.deudorAcreedor = DeudorAcreedor;
                nc.id_operador = Operador;
                nc.id_grupo = Grupo;
                nc.importe = Importe;
                nc.id_moneda = Moneda;
                nc.mes_consumo = new DateTime(MesConsumo.Year, MesConsumo.Month, 1);
                Log log = new Log();
                log.insertaBitacoraModificacion(nc, "id", nc.id, "Clase_Servicio.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };

            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #region combos
        public JsonResult llenaSociedad(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var sociedad = from oSociedad in db.Sociedad
                               where oSociedad.Id_LineaNegocio == lineaNegocio
                               && oSociedad.Activo == 1
                               select new
                               {
                                   oSociedad.Id,
                                   oSociedad.Id_Sociedad,
                                   oSociedad.NombreSociedad
                               };
                foreach (var elemento in sociedad) {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_sociedad = elemento.Id_Sociedad,
                        sociedad = elemento.NombreSociedad
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaTrafico(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var trafico = from oTrafico in db.Trafico
                              where oTrafico.Id_LineaNegocio == lineaNegocio
                              && oTrafico.Activo == 1
                              select new
                              {
                                  oTrafico.Id,
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion
                              };
                foreach (var elemento in trafico) {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_trafico = elemento.Id_TraficoTR,
                        trafico = elemento.Descripcion
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaServicio(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var trafico = from oServicio in db.Servicio
                              where oServicio.Id_LineaNegocio == lineaNegocio
                              && oServicio.Activo == 1
                              select new
                              {
                                  oServicio.Id,
                                  oServicio.Id_Servicio,
                                  oServicio.Servicio1
                              };
                foreach (var elemento in trafico) {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_servicio = elemento.Id_Servicio,
                        servicio = elemento.Servicio1
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaDeudorAcreedor(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                List<object> listaDeudor = new List<object>();
                List<object> listaAcreedor = new List<object>();
                var deudor = from oDeudor in db.Deudor
                             where oDeudor.Activo == 1 && oDeudor.Id_LineaNegocio == lineaNegocio

                             select new
                             {
                                 oDeudor.Deudor1,
                                 oDeudor.Id,
                                 oDeudor.NombreDeudor
                             };
                foreach (var elemento in deudor) {
                    listaDeudor.Add(new
                    {
                        id = elemento.Id,
                        clave = elemento.Deudor1,
                        nombre = elemento.NombreDeudor + " (Deudor)"
                    });
                }
                var acreedor = from oAcreedor in db.Acreedor
                               where oAcreedor.Activo == 1 && oAcreedor.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oAcreedor.Acreedor1,
                                   oAcreedor.Id,
                                   oAcreedor.NombreAcreedor
                               };
                foreach (var elemento in acreedor) {
                    listaAcreedor.Add(new
                    {
                        id = elemento.Id,
                        clave = elemento.Acreedor1,
                        nombre = elemento.NombreAcreedor + " (Acreedor)"
                    });
                }
                lista = listaDeudor.Union(listaAcreedor).ToList();
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaOperador(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var operador = from oOperador in db.Operador
                               where oOperador.Id_LineaNegocio == lineaNegocio
                               && oOperador.Activo == 1
                               select new
                               {
                                   oOperador.Id,
                                   oOperador.Id_Operador,
                                   oOperador.Razon_Social
                               };
                foreach (var elemento in operador) {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_operador = elemento.Id_Operador,
                        operador = elemento.Razon_Social
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaGrupo(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var grupo = from oGrupo in db.Grupo
                            where oGrupo.Id_LineaNegocio == lineaNegocio
                            && oGrupo.Activo == 1
                            select new
                            {
                                oGrupo.Id,
                                oGrupo.Grupo1,
                                oGrupo.DescripcionGrupo
                            };
                foreach (var elemento in grupo) {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_grupo = elemento.Grupo1,
                        grupo = elemento.DescripcionGrupo
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaMoneda(int lineaNegocio)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try {
                var moneda = from oMoneda in db.Moneda
                             where oMoneda.Id_LineaNegocio == lineaNegocio
                             && oMoneda.Activo == 1
                             select new
                             {
                                 oMoneda.Id,
                                 oMoneda.Moneda1,
                                 oMoneda.Descripcion
                             };
                foreach (var elemento in moneda) {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_moneda = elemento.Moneda1,
                        moneda = elemento.Descripcion
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenaPeriodo(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try {
                var datos = from periodos in db.NotaCredito
                            where periodos.id_lineaNegocio == lineaNegocio
                            group periodos by periodos.periodo_carga into g
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };

                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }

                total = lista.Count();
                respuesta = new { success = true, results = lista, total };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
        public string obtieneMes(string mes)
        {
            var diccionario = new Dictionary<string, string>
            {
               {"01","ENERO"},
               {"02","FEBRERO"},
               {"03","MARZO"},
               {"04","ABRIL"},
               {"05","MAYO"},
               {"06","JUNIO"},
               {"07","JULIO"},
               {"08","AGOSTO"},
               {"09","SEPTIEMBRE"},
               {"10","OCTUBRE"},
               {"11","NOVIEMBRE"},
               {"12","DICIEMBRE"},
            };

            return diccionario[mes];
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
        public List<Claves> BuscaId(string sociedad, string trafico, string servicio, string deudorAcreedor, string operador, string grupo, string moneda, int lineaNegocio)
        {
            sociedad = sociedad.TrimEnd(',');
            trafico = trafico.TrimEnd(',');
            servicio = servicio.TrimEnd(',');
            deudorAcreedor = deudorAcreedor.TrimEnd(',');
            operador = operador.TrimEnd(',');
            grupo = grupo.TrimEnd(',');
            moneda = moneda.TrimEnd(',');

            List<Claves> listaID = new List<Claves>();
            try {
                var relaciones = db.sp_ic_buscaIdsCargaNC(sociedad, trafico, servicio, deudorAcreedor, operador, grupo, moneda, lineaNegocio);
                foreach (var elemento in relaciones) {
                    listaID.Add(new Claves
                    {
                        clave = elemento.clave,
                        texto = elemento.texto,
                        tabla = elemento.Tabla

                    });
                }
            } catch (Exception) {

            }
            return listaID;
        }
        public List<NotaCredito> BuscaID(List<NotaCredito> lista, List<Claves> listaID, string[] arrSociedad, string[] arrTrafico, string[] arrServicio, string[] arrDeudorAcreedor, string[] arrOperadores, string[] arrGrupo, string[] arrMoneda, List<string> listaErroneos, int lineaNegocio)
        {
            int contador = 0, numLinea = 1;
            try {
                //bool exite = true;
                DateTime fecha_contable;
                if (lineaNegocio == 1) {
                    fecha_contable = DateTime.Parse( db.cargaDocumentoRoaming.Where(x => x.estatusCarga == "PC" && x.ordenCarga == "A" && x.idDocumento == "TAPOUT").Select(x => x.periodoCarga).SingleOrDefault());

                } else {
                    fecha_contable = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                }

                foreach (var elemento in lista) {
                    if (listaID.Exists(x => x.texto == arrSociedad[contador])) {
                        elemento.id_sociedad = listaID.Where(x => x.texto == arrSociedad[contador]).FirstOrDefault().clave;
                        elemento.activo = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        listaErroneos.Add("Linea: " + numLinea + " Sociedad: " + arrSociedad[contador] + " No existe");
                        elemento.activo = 0;
                        goto existe;
                    }
                    if (listaID.Exists(x => x.texto == arrTrafico[contador])) {
                        elemento.id_trafico = listaID.Where(x => x.texto == arrTrafico[contador]).FirstOrDefault().clave;
                        elemento.id_lineaNegocio = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        listaErroneos.Add("Linea: " + numLinea + " Tráfico: " + arrTrafico[contador] + " No existe");
                        elemento.activo = 0;
                        goto existe;
                    }
                    if (listaID.Exists(x => x.texto == arrServicio[contador])) {
                        elemento.id_servicio = listaID.Where(x => x.texto == arrServicio[contador]).FirstOrDefault().clave;
                        elemento.activo = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        listaErroneos.Add("Linea: " + numLinea + " Servicio: " + arrServicio[contador] + " No existe");
                        elemento.activo = 0;
                        goto existe;
                    }
                    if (listaID.Exists(x => x.texto == arrDeudorAcreedor[contador])) {
                        elemento.deudorAcreedor = arrDeudorAcreedor[contador];
                        elemento.activo = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        if (listaID.Exists(x => x.texto == arrDeudorAcreedor[contador])) {
                            elemento.deudorAcreedor = arrDeudorAcreedor[contador];
                            elemento.activo = 1;
                            elemento.periodo_carga = fecha_contable;
                        } else {
                            listaErroneos.Add("Linea: " + numLinea + " Deucor/Acreedor: " + arrDeudorAcreedor[contador] + " No existe");
                            elemento.activo = 0;
                            goto existe;
                        }
                    }
                    if (listaID.Exists(x => x.texto == arrOperadores[contador])) {
                        elemento.id_operador = listaID.Where(x => x.texto == arrOperadores[contador] && x.tabla == "Operador").FirstOrDefault().clave;
                        elemento.activo = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        listaErroneos.Add("Linea: " + numLinea + " Operador: " + arrOperadores[contador] + " No existe");
                        elemento.activo = 0;
                        goto existe;
                    }
                    if (listaID.Exists(x => x.texto == arrGrupo[contador])) {
                        elemento.id_grupo = listaID.Where(x => x.texto == arrGrupo[contador] && x.tabla == "Grupo").FirstOrDefault().clave;
                        elemento.activo = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        listaErroneos.Add("Linea: " + numLinea + " Grupo: " + arrGrupo[contador] + " No existe");
                        elemento.activo = 0;
                        goto existe;
                    }
                    if (listaID.Exists(x => x.texto == arrMoneda[contador])) {
                        elemento.id_moneda = listaID.Where(x => x.texto == arrMoneda[contador]).FirstOrDefault().clave;
                        elemento.activo = 1;
                        elemento.periodo_carga = fecha_contable;
                        elemento.id_lineaNegocio = lineaNegocio;
                    } else {
                        listaErroneos.Add("Linea: " + numLinea + " Moneda: " + arrMoneda[contador] + " No existe");
                        elemento.activo = 0;
                        goto existe;
                    }
                existe:
                    contador++;
                    numLinea++;
                }

            } catch (Exception) {
                return null;
            }
            return lista;
        }

    }
}