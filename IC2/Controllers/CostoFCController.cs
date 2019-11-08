using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Mvc;
using IC2.Models;
using System.Transactions;
using System.Text;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CostoFCController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        IDictionary<int, string> meses = new Dictionary<int, string>()
        {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        // GET: CostoFC
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }



        public JsonResult llenaGrid(int lineaNegocio, DateTime periodo)
        {
            List<object> listaCostoFC = new List<object>();
            object respuesta = null;
            try
            {
                
                var pais = from elemento in db.CostoFR
                           where periodo.Month == elemento.Fecha_Inicio.Month && periodo.Year == elemento.Fecha_Inicio.Year 
                                 && elemento.Id_LineaNegocio == lineaNegocio && elemento.Activo == 1
                           select new
                           {
                               elemento.Id,
                               elemento.Id_Operador,
                               elemento.TipoOperador,
                               elemento.Operador,
                               elemento.id_Acreedor,
                               elemento.Acreedor,
                               elemento.NombreProveedor,
                               elemento.Id_Moneda,
                               elemento.Moneda,
                               elemento.Importe,
                               elemento.Fecha_Inicio,
                               elemento.Fecha_Fin,
                               //elemento.Id_CuentaContable,
                               elemento.CuentaContable,
                               elemento.Sociedad,
                               elemento.TC
                           };

                foreach (var elemento in pais)
                {
                    listaCostoFC.Add(new
                    {
                        id = elemento.Id,
                        id_operador = elemento.Id_Operador,
                        tipoOperador = elemento.TipoOperador,
                        operador = elemento.Operador,
                        id_acreedor = elemento.id_Acreedor,
                        acreedor = elemento.Acreedor,
                        nombreProveedor = elemento.NombreProveedor,
                        id_moneda = elemento.Id_Moneda,
                        moneda = elemento.Moneda,
                        importe = elemento.Importe,
                        fechaInicio = elemento.Fecha_Inicio.Day.ToString("00") + "/" + elemento.Fecha_Inicio.Month.ToString("00") + "/" + elemento.Fecha_Inicio.Year,
                        fechaFin = elemento.Fecha_Fin.Day.ToString("00") + "/" + elemento.Fecha_Fin.Month.ToString("00") + "/" + elemento.Fecha_Fin.Year,
                        //id_cuentaContable = elemento.Id_CuentaContable,
                        cuentaContable = elemento.CuentaContable,
                        sociedad = elemento.Sociedad,
                        tipoCambio = elemento.TC
                    });
                }
                respuesta = new { success = true, results = listaCostoFC };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //Borrar
        public JsonResult borrarCostoFC(string strID)
        {
            int Id = 0;
            strID = strID.TrimEnd(',');
            string strmsg = "ok";//string strSalto = "</br>";
            bool blsucc = true;
            object respuesta;
            try
            {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);//string strresp_val = funGralCtrl.ValidaRelacion("CostoFC", Id);

                        
                            CostoFR CostoFC = db.CostoFR.Where(x => x.Id == Id).SingleOrDefault();
                            CostoFC.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(CostoFC, "Eliminado", "CostoFR.html", Request.UserHostAddress);

                            db.SaveChanges();
                        
                    }
                }
                respuesta = new { success = blsucc, results = strmsg };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //agregar                                                   
        public JsonResult agregarCostoFC(int? Id_Operador, int? Id_Acreedor, int? Id_Moneda, decimal Importe, DateTime Fecha_Inicio, DateTime Fecha_fin, string Id_Cuenta, string TC, int Linea_Negocio)
        {
            object respuesta = null;
            bool valid = true;
            var mensaje = "";
            TC_Cierre tC_Cierre = db.TC_Cierre.Where(x => x.Id_Moneda == Id_Moneda && x.Mes_Consumo.Year == Fecha_Inicio.Year && x.Mes_Consumo.Month == Fecha_Inicio.Month && x.Sentido == "COSTO" && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Operador operador = db.Operador.Where(x => x.Id == Id_Operador && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Acreedor acreedor = db.Acreedor.Where(x => x.Id == Id_Acreedor && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Moneda moneda = db.Moneda.Where(x => x.Id == Id_Moneda && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            // Sociedad sociedad = db.Sociedad.Where(x => x.Id == Id_Sociedad && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();

            if (DateTime.Compare(Fecha_Inicio, Fecha_fin) >= 0)
            {
                valid = false;
                mensaje = "Fecha Inicio Debe Ser MENOR que  Fin";
            }

            if (Importe <= 0) //numeros negativos
            {
                valid = false;
                if (mensaje != "")
                    mensaje = mensaje + " y " + "Importe No Pueder Ser Menor a Cero";
            }

            if (valid)
            {
                try
                {
                    var nuevo = new CostoFR();
                    nuevo.Id_Operador = operador.Id;
                    nuevo.TipoOperador = operador.Tipo_Operador;
                    nuevo.Operador = operador.Id_Operador;
                    nuevo.id_Acreedor = acreedor.Id;
                    nuevo.Acreedor = acreedor.Acreedor1;
                    nuevo.NombreProveedor = acreedor.NombreAcreedor;
                    nuevo.Id_Moneda = moneda.Id;
                    nuevo.Moneda = moneda.Moneda1;
                    nuevo.Importe = Importe;//decimal.Parse(Importe);
                    nuevo.Fecha_Inicio = Fecha_Inicio;
                    nuevo.Fecha_Fin = Fecha_fin;
                    nuevo.CuentaContable = Id_Cuenta;
                    nuevo.Sociedad = operador.Sociedad_GL;

                    if (TC == null)
                    {
                        if (tC_Cierre == null)
                            nuevo.TC = 0;
                        else
                            nuevo.TC = tC_Cierre.TC_MXN;
                    }
                    else
                        nuevo.TC = decimal.Parse(TC);

                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = Linea_Negocio;

                    db.CostoFR.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "CostoFR.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, result = "ok" };

                }
                catch (Exception ex)
                {
                    var error = ex.Message;
                    respuesta = new { success = false, result = "Hubo un error mientras se procesaba la petición" };
                }
            }
            else
            {
                respuesta = new { success = false, result = mensaje };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //modificar
        public JsonResult ModificarCostoFC(int? Id, int? Id_Operador, int? Id_Acreedor, int? Id_Moneda, decimal Importe, DateTime Fecha_Inicio, DateTime Fecha_Fin, string Id_Cuenta, string TC, int lineaNegocio)
        {
            object respuesta = null;
            CultureInfo cultureInfo = new CultureInfo("es-ES", false);
            CostoFR costofr = db.CostoFR.Where(x => x.Id == Id).SingleOrDefault();
            Acreedor acreedor = db.Acreedor.Where(x => x.Id == Id_Acreedor && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            Operador operador = db.Operador.Where(x => x.Id == Id_Operador && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            Moneda moneda = db.Moneda.Where(x => x.Id == Id_Moneda && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            //CuentaResultado cuentaResultado = db.CuentaResultado.Where(x => x.Cuenta == Id_Cuenta && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();

            //costofr.Id_Operador = operador.Id;


            bool valid = true;
            var mensaje = "";



            if (DateTime.Compare(Fecha_Inicio, Fecha_Fin) > 0)
            {
                valid = false;
                mensaje = "Fecha Inicio debe ser menor que Fecha Fin";
            }


            if (valid)
            {
                try
                {
                    costofr.Id_Operador = operador.Id;
                    costofr.TipoOperador = operador.Tipo_Operador;
                    costofr.Operador = operador.Id_Operador;
                    costofr.id_Acreedor = acreedor.Id;
                    costofr.Acreedor = acreedor.Acreedor1;
                    costofr.NombreProveedor = acreedor.NombreAcreedor;
                    costofr.Id_Moneda = moneda.Id;
                    costofr.Moneda = moneda.Moneda1;
                    costofr.Importe = Importe;
                    costofr.Fecha_Inicio = Fecha_Inicio;
                    costofr.Fecha_Fin = Fecha_Fin;
                    costofr.CuentaContable = Id_Cuenta;
                    costofr.Sociedad = operador.Sociedad_GL;
                    costofr.TC = decimal.Parse(TC);

                    Log log = new Log();
                    log.insertaBitacoraModificacion(costofr, "Id", costofr.Id, "CostoFR.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };

                }
                catch (Exception ex)
                {
                    var error = ex.Message;
                    respuesta = new { success = false, results = "Hubo un error mientras se procesaba la petición" };
                }
            }
            else
            {
                respuesta = new { success = false, results = mensaje };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult cargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();
            List<string> listaErrores = new List<string>();
            IEnumerable<string> lineas = null;
            object respuesta = null;
            int totalProcesados = 0;
            int lineaActual = 2;
            bool status = false;
            string exception = "Error, se presento un error inesperado";
            
            //DateTime fecha = new DateTime();
            try
            {
                List<string> csvData = new List<string>();
                using (StreamReader reader = new StreamReader(archivoCSV.InputStream, Encoding.Default))
                {
                    while (!reader.EndOfStream)
                    {
                        csvData.Add(reader.ReadLine());
                    }
                }

                var periodoCarga = db.cargaDocumentoRoaming.Where(x => x.estatusCarga == "PC" && x.ordenCarga == "A" && x.idDocumento == "TAPIN").Select(x => x.periodoCarga).SingleOrDefault();

                lineas = csvData.Skip(1);

                totalProcesados = lineas.Count();
                using (TransactionScope scope = new TransactionScope())
                {
                    foreach (string linea in lineas)
                    {
                        var lineaSplit = linea.Split(';');
                        if (lineaSplit.Count() == 12)
                        {
                            try
                            {
                                CostoFR CFR = new CostoFR();

                                CFR.TipoOperador = lineaSplit[0];
                                CFR.Operador = lineaSplit[1];
                                CFR.Acreedor = lineaSplit[2];
                                CFR.NombreProveedor = lineaSplit[3];
                                CFR.Moneda = lineaSplit[4];
                                CFR.Importe = Convert.ToDecimal(lineaSplit[5]);
                                //DateTime FechaInicio = FNCGrales.ConvierteFecha(lineaSplit[6], '/', "DMY");

                                    CFR.Fecha_Inicio = DateTime.ParseExact(lineaSplit[6], "dd/MM/yyyy", new CultureInfo("en-US"), DateTimeStyles.None);

                                DateTime FechaFin = FNCGrales.ConvierteFecha(lineaSplit[7], '/', "DMY");
                                CFR.Fecha_Fin = FechaFin;
                                CFR.CuentaContable = lineaSplit[8];
                                CFR.Sociedad = lineaSplit[9];
                                CFR.TC = decimal.Parse(string.IsNullOrEmpty(lineaSplit[10]) ? "0" : lineaSplit[10]);

                                CFR.Id_LineaNegocio = lineaNegocio;
                                CFR.periodo_carga = DateTime.Parse(periodoCarga);

                                var resultado = db.spValidaIdCostoFR(CFR.Operador, CFR.Acreedor, CFR.Moneda, lineaNegocio).ToList();

                                CFR.Id_Operador = resultado[0].idOperador;
                                CFR.id_Acreedor = resultado[0].idAcreedor;
                                CFR.Id_Moneda = resultado[0].idMoneda;

                                if (resultado[0].estatus == 1)
                                    CFR.Activo = 1;
                                else
                                    CFR.Activo = 0;

                                db.CostoFR.Add(CFR);
                                Log log = new Log();
                                log.insertaNuevoOEliminado(CFR, "Nuevo", "CostoFR.html", Request.UserHostAddress);

                            }
                            catch (FormatException)
                            {
                                listaErrores.Add("línea " + lineaActual + ": Campo con formato erróneo");
                            }
                        }
                        else
                        {
                            listaErrores.Add("Línea " + lineaActual + ": Número de campos insuficiente.");
                        }
                        ++lineaActual;
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
            finally
            {
                respuesta = new
                {
                    success = true,
                    results = listaErrores,
                    mensaje = exception,
                    totalProcesados,
                    status
                };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #region Combos
        public JsonResult llenaPeriodo(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;
            try
            {
                var datos = from periodo in db.CostoFR
                            where periodo.Id_LineaNegocio == lineaNegocio
                            group periodo by periodo.Fecha_Inicio into g
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
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month.ToString("00") + "-" + elemento.Periodo.Day.ToString("00"),
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }
                total = lista.Count();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception ex)
            {
                lista = null;
                respuesta = new { succes = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaOperador(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Operador
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                elemento.Id_Operador,
                                elemento.Id,
                                elemento.Nombre
                                //DesOperador = elemento.Id_Operador + " - " + elemento.Nombre,
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        id_operador = elemento.Id_Operador,
                        nombre = elemento.Nombre
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaAcreedor(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Acreedor
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                elemento.Acreedor1,
                                elemento.NombreAcreedor,
                                elemento.Id
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        id = elemento.Id,
                        acreedor = elemento.Acreedor1,
                        nombreacreedor = elemento.NombreAcreedor
                    });
                }
                respuesta = new { success = true, results = lista };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaMoneda(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Moneda
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new

                            {
                                elemento.Id,
                                elemento.Moneda1,
                                elemento.Descripcion
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new

                    {
                        id = elemento.Id,
                        id_moneda = elemento.Moneda1,
                        moneda = elemento.Descripcion
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenarCuenta(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = (from elemento in db.CuentaResultado
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio && elemento.Sentido == "Costos"
                             select new
                             {
                                 elemento.Cuenta
                             }).Distinct();
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        //id = elemento.Id,
                        cuenta = elemento.Cuenta
                    });
                }

                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { seccess = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaTraficoCuenta(int? Id_TraficoTR)
        {
            List<object> list = new List<object>();
            object respuesta = null;
            try
            {

                var operador = from CuentaResultado in db.CuentaResultado
                               where CuentaResultado.Trafico_Id == Id_TraficoTR
                               select new
                               {
                                   id = CuentaResultado.Trafico_Id,
                                   cuenta = CuentaResultado.Cuenta

                               };

                foreach (var item in operador)
                {
                    list.Add(new
                    {
                        id = item.id,
                        cuenta = item.cuenta
                    });
                }

                respuesta = new { success = true, result = list };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaSociedad(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Sociedad
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                elemento.Id_Sociedad,
                                elemento.NombreSociedad,
                                elemento.Id,

                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        sociedad = elemento.Id_Sociedad,
                        NombreSociedad = elemento.NombreSociedad
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }



        #endregion
    }
}