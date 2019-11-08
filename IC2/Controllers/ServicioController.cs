using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class ServicioController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();

        //
        // GET: /Servicio/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Id_Servicio,
                                                                            string Servicio,
                                                                            string Orden)
        {
            List<object> listaServicio = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var servicio = from elemento in db.Servicio
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                               && DbFiltro.String(elemento.Id_Servicio, Id_Servicio)
                               && DbFiltro.String(elemento.Servicio1, Servicio)
                               && DbFiltro.Int(elemento.Orden, Orden)

                               select new
                               {
                                   elemento.Id_Servicio,
                                   elemento.Servicio1,
                                   elemento.Orden,
                                   elemento.Activo,
                                   elemento.Id
                               };

                foreach (var elemento in servicio)
                {
                    listaServicio.Add(new
                    {
                        Id_Servicio = elemento.Id_Servicio,
                        Servicio = elemento.Servicio1,
                        Orden = elemento.Orden,
                        Id = elemento.Id
                        //Activo = elemento.Activo
                    });
                }
                total = listaServicio.Count();
                listaServicio = listaServicio.Skip(start).Take(limit).ToList();
                respuesta = new { success = true,
                                  results = listaServicio.Skip(start).Take(limit).ToList(),
                                  total = listaServicio.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarServicio(string Servicio, int Orden, string Id_Servicio, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                Servicio oServicio = db.Servicio.Where(x => x.Orden == Orden && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                if (oServicio == null)
                {
                    var nuevo = new Servicio();

                    nuevo.Id_Servicio = Id_Servicio;
                    nuevo.Servicio1 = Servicio;
                    nuevo.Orden = Orden;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.Servicio.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Servicio.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", dato = Orden };
                }

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, result = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarServicio(int Id)
        {
            object respuesta = null;

            try
            {
                List<object> listaServicio = new List<object>();

                var oServicio = from objServicio in db.Servicio
                                where objServicio.Id == Id
                                select new
                                {
                                    objServicio.Id_Servicio,
                                    objServicio.Servicio1,
                                    objServicio.Orden
                                };

                foreach (var elemento in oServicio)
                {
                    listaServicio.Add(new
                    {
                        Id_Servicio = elemento.Id_Servicio,
                        Servicio = elemento.Servicio1,
                        Orden = elemento.Orden,
                    });
                }

                respuesta = new { success = true, results = oServicio };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarServicio(string strID)
        {
            object respuesta = null;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            int Id = 0;
            strID = strID.TrimEnd(',');

            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Servicio", Id);

                        if (strresp_val.Length == 0)
                        {
                            Servicio oServicio = db.Servicio.Where(x => x.Id == Id).SingleOrDefault();
                            oServicio.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oServicio, "Eliminado", "Servicio.html", Request.UserHostAddress);

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
                respuesta = new { success = blsucc, result = strmsg };
            }
            catch (Exception ex)
            {
                strmsg = ex.Message;
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificarServicio(string Servicio, int Orden, int Id)
        {
            object respuesta = null;

            try
            {
                Servicio oServicio = db.Servicio.Where(x => x.Id == Id).SingleOrDefault();
                oServicio.Servicio1 = Servicio;
                oServicio.Orden = Orden;

                Servicio oServicioModificado = db.Servicio.Where(x => x.Orden == oServicio.Orden && x.Servicio1 == oServicio.Servicio1).SingleOrDefault();
                if (oServicioModificado == null)
                {
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oServicio, "Id", oServicio.Id, "Clase_Servicio.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", dato = Orden };
                }

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Servicio", Id);

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
    }
}