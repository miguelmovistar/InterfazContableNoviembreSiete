using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class ObjecionController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Objecion/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            //List<Submenu> lista = new List<Submenu>();
            //List<Menu> listaMenu = new List<Menu>();
            //lista = oHome.obtenerMenu((int)Session["IdLinea"]);
            //listaMenu = oHome.obtenerMenuPrincipal((int)Session["IdLinea"]);
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int IdLineaNegocio, int start, int limit, string Sentido,
                                                                              string DescripcionTR,
                                                                              string ServicioDesc,
                                                                              string NombreSociedad,
                                                                              string DeudorAcreedor,
                                                                              string DescripcionGR,
                                                                              string Importe)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try
            {
                var objecion = from objObjecion in db.Objecion
                               join oTrafico in db.Trafico
                               on objObjecion.Id_trafico equals oTrafico.Id
                               join oServicio in db.Servicio
                               on objObjecion.Id_servicio equals oServicio.Id
                               join oSociedad in db.Sociedad
                               on objObjecion.Id_Sociedad equals oSociedad.Id
                               join oGrupo in db.Grupo
                               on objObjecion.Id_Grupo equals oGrupo.Id
                               where objObjecion.Activo == 1 && objObjecion.Id_LineaNegocio == IdLineaNegocio
                               && oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == IdLineaNegocio
                               && oServicio.Activo == 1 && oServicio.Id_LineaNegocio == IdLineaNegocio
                               && oSociedad.Activo == 1 && oSociedad.Id_LineaNegocio == IdLineaNegocio
                               && oGrupo.Activo == 1 && oGrupo.Id_LineaNegocio == IdLineaNegocio

                               && DbFiltro.String(objObjecion.Sentido, Sentido)
                               && DbFiltro.String(oTrafico.Descripcion, DescripcionTR)
                               && DbFiltro.String(oServicio.Servicio1, ServicioDesc)
                               && DbFiltro.String(oSociedad.NombreSociedad, NombreSociedad)
                               && DbFiltro.String(objObjecion.Deudor_Acreedor, DeudorAcreedor)
                               && DbFiltro.String(oGrupo.DescripcionGrupo, DescripcionGR)
                               && DbFiltro.Decimal(objObjecion.Importe, Importe)

                               select new
                               {
                                   objObjecion.Sentido,
                                   oTrafico.Id_TraficoTR,
                                   oServicio.Id_Servicio,
                                   oSociedad.Id_Sociedad,
                                   objObjecion.Deudor_Acreedor,
                                   oGrupo.Grupo1,
                                   objObjecion.Importe,
                                   objObjecion.id,
                                   oTrafico.Descripcion,
                                   oServicio.Servicio1,
                                   oSociedad.NombreSociedad,
                                   oGrupo.DescripcionGrupo

                               };
                foreach (var elemento in objecion)
                {
                    lista.Add(new
                    {
                        Id = elemento.id,
                        Sentido = elemento.Sentido,
                        Trafico = elemento.Id_TraficoTR,
                        Servicio = elemento.Id_Servicio,
                        Sociedad = elemento.Id_Sociedad,
                        DeudorAcreedor = elemento.Deudor_Acreedor,
                        Grupo = elemento.Grupo1,
                        Importe = elemento.Importe,
                        DescripcionTR = elemento.Descripcion,
                        ServicioDesc = elemento.Servicio1,
                        NombreSociedad = elemento.NombreSociedad,
                        DescripcionGR = elemento.DescripcionGrupo
                    });
                }

                respuesta = new { success = true,
                                  results = lista.Skip(start).Take(limit).ToList(),
                                  total = lista.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public void ExportaCSV(int IdLineaNegocio)
        {
            StringWriter sw = new StringWriter();
            sw.WriteLine("\"Sentido\";\"Trafico\";\"Servicio\";\"Sociedad\";\"Deudor/Acreedor\";\"Grupo\";\"Importe\"");

            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=CatalogoObjeciones.csv");
            Response.ContentType = "text/csv";

            var objecion = from objObjecion in db.Objecion
                           join oTrafico in db.Trafico
                           on objObjecion.Id_trafico equals oTrafico.Id
                           join oServicio in db.Servicio
                           on objObjecion.Id_servicio equals oServicio.Id
                           join oSociedad in db.Sociedad
                           on objObjecion.Id_Sociedad equals oSociedad.Id
                           join oGrupo in db.Grupo
                           on objObjecion.Id_Grupo equals oGrupo.Id
                           where objObjecion.Activo == 1 && objObjecion.Id_LineaNegocio == IdLineaNegocio
                           && oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == IdLineaNegocio
                           && oServicio.Activo == 1 && oServicio.Id_LineaNegocio == IdLineaNegocio
                           && oSociedad.Activo == 1 && oSociedad.Id_LineaNegocio == IdLineaNegocio
                           && oGrupo.Activo == 1 && oGrupo.Id_LineaNegocio == IdLineaNegocio
                           select new
                           {
                               objObjecion.Sentido,
                               oTrafico.Descripcion,
                               oServicio.Servicio1,
                               oSociedad.NombreSociedad,
                               objObjecion.Deudor_Acreedor,
                               oGrupo.DescripcionGrupo,
                               objObjecion.Importe,

                           };
            foreach (var elemento in objecion)
            {
                sw.WriteLine(string.Format("\"{0}\";\"{1}\";\"{2}\";\"{3}\";\"{4}\";\"{5}\";\"{6}\"",
                  elemento.Sentido.Replace("\r\n", string.Empty),
                  elemento.Descripcion.Replace("\r\n", string.Empty),
                  elemento.Servicio1.Replace("\r\n", string.Empty),
                  elemento.NombreSociedad.Replace("\r\n", string.Empty),
                  elemento.Deudor_Acreedor.Replace("\r\n", string.Empty),
                  elemento.DescripcionGrupo.Replace("\r\n", string.Empty),
                  elemento.Importe));
            }

            Response.Write(sw.ToString());
            Response.End();
        }

        public JsonResult Nuevo(int lineaNegocio, string Sentido, int Sociedad, int Trafico, int Servicio, string DeudorAcreedor, int Grupo, string Importe)
        {
            string oDeudorAcreedor = "";
            decimal d_importe = decimal.Parse(Importe);
            object respuesta = null;

            try {
                Objecion objObjecion = new Objecion();

                Deudor oDeudor = db.Deudor.Where(x => x.Deudor1 == DeudorAcreedor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

                if (oDeudor == null) {
                    Acreedor oAcreedor = db.Acreedor.Where(x => x.Acreedor1 == DeudorAcreedor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                    if (oAcreedor != null) {
                        oDeudorAcreedor = oAcreedor.Acreedor1;
                    }
                } else {
                    oDeudorAcreedor = oDeudor.Deudor1;
                }
                var nuevo = new Objecion();
                nuevo.Sentido = Sentido;
                nuevo.Id_Sociedad = Sociedad;
                nuevo.Id_trafico = Trafico;
                nuevo.Id_servicio = Servicio;
                nuevo.Deudor_Acreedor = DeudorAcreedor;
                nuevo.Id_Grupo = Grupo;
                nuevo.Importe = d_importe;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;
                db.Objecion.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Objecion.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult buscar(int Id)
        {
            object respuesta = null;
            try
            {
                Objecion oObjecion = db.Objecion.Where(x => x.id == Id && x.Activo == 1).SingleOrDefault();
                respuesta = new { success = true, results = oObjecion };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };

            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar(int Id, string Sentido, string Sociedad, string Trafico, string Servicio, string DeudorAcreedor, string Grupo, string Importe, int lineaNegocio)
        {
            object respuesta = null;
            string oDeudorAcreedor = "";
            string noEncontrados = "";

            bool valido = false;
            decimal d_importe = decimal.Parse(Importe);
            try
            {
                Objecion objObjecion = db.Objecion.Where(x => x.id == Id).SingleOrDefault();
                Sociedad oSociedad = db.Sociedad.Where(x => x.Id_Sociedad == Sociedad && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Trafico oTrafico = db.Trafico.Where(x => x.Id_TraficoTR == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio && x.Sentido == Sentido).SingleOrDefault();
                Servicio oServicio = db.Servicio.Where(x => x.Id_Servicio == Servicio && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Grupo oGrupo = db.Grupo.Where(x => x.Grupo1 == Grupo && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
                Deudor oDeudor = db.Deudor.Where(x => x.Deudor1 == DeudorAcreedor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

                if (oSociedad == null)
                    noEncontrados = noEncontrados + "Sociedad " + Sociedad + ",";
                if (oTrafico == null)
                    noEncontrados = noEncontrados + "Tráfico: " + Trafico + ",";
                if (oServicio == null)
                    noEncontrados = noEncontrados + "Servico: " + Servicio + ",";
                if (oGrupo == null)
                    noEncontrados = noEncontrados + "Grupo: " + Grupo + ",";
                if (oDeudor == null)
                {
                    Acreedor oAcreedor = db.Acreedor.Where(x => x.Acreedor1 == DeudorAcreedor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                    if (oAcreedor != null)
                    {
                        oDeudorAcreedor = oAcreedor.Acreedor1;
                        valido = true;
                    }
                }
                else
                {
                    oDeudorAcreedor = oDeudor.Deudor1;
                    valido = true;
                }
                if (valido == false)
                    noEncontrados = noEncontrados + "Deudor/Acreedor: " + DeudorAcreedor + ",";
                if (oSociedad != null && oTrafico != null && oServicio != null && valido == true)
                {

                    objObjecion.Sentido = Sentido;
                    objObjecion.Id_Sociedad = oSociedad.Id;
                    objObjecion.Id_trafico = oTrafico.Id;
                    objObjecion.Id_servicio = oServicio.Id;
                    objObjecion.Deudor_Acreedor = DeudorAcreedor;
                    objObjecion.Id_Grupo = oGrupo.Id;
                    objObjecion.Importe = d_importe;

                    Log log = new Log();
                    log.insertaBitacoraModificacion(objObjecion, "id", objObjecion.id, "Objecion.html", Request.UserHostAddress);


                    db.SaveChanges();

                    respuesta = new { success = true, results = "ok" };

                }
                else
                {
                    respuesta = new { success = true, results = "no", mensaje = noEncontrados.Trim(',') };
                }

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult borrar(string strId)
        {
            int Id = 0;
            strId = strId.TrimEnd(',');
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            object respuesta;
            try
            {
                string[] Ids = strId.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Objecion", Id);
                        if (strresp_val.Length == 0)
                        {
                            Objecion oObjecion = db.Objecion.Where(x => x.id == Id).SingleOrDefault();
                            oObjecion.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oObjecion, "Eliminado", "Objecion.html", Request.UserHostAddress);
                            db.SaveChanges();
                        }
                        else
                        {
                            strmsg = "El(Los) " + Ids.Length.ToString() + " registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) " + strSalto;
                            strmsg = strmsg + strresp_val + strSalto;
                            blsucc = false;
                            break;
                        }
                    }
                }
                respuesta = new { success = blsucc, results = strmsg };
            }
            catch (Exception ex)
            {
                strmsg = ex.Message;
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Objecion", Id);

            if (strresp_val.Length != 0)
            {
                //  "El(Los) < cantidad de registros con relación con catálogos> registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) *< Lista de Catálogos con relación> *y deberás eliminarlos primero en el(los) catálogo(s).Si se seleccionaron registros que no están usados por otro catálogo entonces deberá mostrar otra pantalla "El(los) <Cantidad de registros no usados en otras tablas> registros pueden ser eliminados. ¿Desea continuar?
                strmsg = "El registro que quieres modificar se está usando en el(los) catálogo(s) " + strSalto;
                strmsg = strmsg + strresp_val + strSalto;
                strmsg = strmsg + " ¿Estas seguro de hacer la modificación?";

                blsccs = false;
            }

            respuesta = new { success = blsccs, results = strmsg };

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaTrafico(int lineaNegocio, string sentido)
        {
            object respuesta = null;
            
            try {
                List<Trafico> lista = new List<Trafico>();
                var datos = from oTrafico in db.Trafico.Where(x => x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio)
                              select new
                              {
                                  oTrafico.Id,
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion,
                                  oTrafico.Sentido
                              };

                if (lineaNegocio == 1) {
                    datos = datos.Where(x => x.Sentido == sentido);
                }

                foreach (var elemento in datos) {
                    lista.Add(new Trafico
                    {
                        Id = elemento.Id,
                        Id_TraficoTR = elemento.Id_TraficoTR,
                        Descripcion = elemento.Descripcion
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaServicio(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try {
                var datos = from oServicio in db.Servicio
                            where oServicio.Activo == 1 && oServicio.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oServicio.Id,
                                oServicio.Id_Servicio,
                                oServicio.Servicio1
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Servicio = elemento.Servicio1,
                        Id_Servicio = elemento.Id_Servicio,
                        Descripcion = elemento.Id_Servicio + " - " + elemento.Servicio1
                    });
                }                
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaSociedad(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try {
                var datos = from oSociedad in db.Sociedad
                            where oSociedad.Activo == 1 && oSociedad.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oSociedad.Id,
                                oSociedad.NombreSociedad,
                                oSociedad.AbreviaturaSociedad,
                                oSociedad.Id_Sociedad
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        NombreSociedad = elemento.NombreSociedad,
                        AbreviaturaSociedad = elemento.AbreviaturaSociedad,
                        Descripcion = elemento.Id_Sociedad + " - " + elemento.NombreSociedad,
                        Id_Sociedad = elemento.Id_Sociedad
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaDeudorAcreedor(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try {
                var datosA = from oDeudor in db.Acreedor
                             where oDeudor.Activo == 1 && oDeudor.Id_LineaNegocio == lineaNegocio
                             select new
                             {
                                 oDeudor.Id,
                                 Deudor1 = oDeudor.Acreedor1,
                                 NombreDeudor = oDeudor.NombreAcreedor
                             };

                var datosD = from oDeudor in db.Deudor
                             where oDeudor.Activo == 1 && oDeudor.Id_LineaNegocio == lineaNegocio
                             select new
                             {
                                 oDeudor.Id,
                                 oDeudor.Deudor1,
                                 oDeudor.NombreDeudor
                             };
                var datos = Enumerable.Union(datosA, datosD);

                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        DeudorAcreedor = elemento.Deudor1,
                        Descripcion = elemento.Deudor1 + " - " + elemento.NombreDeudor
                    });
                }                
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGrupo(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;            

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
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
    }
}