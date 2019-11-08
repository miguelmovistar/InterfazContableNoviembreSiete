using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using IC2.Helpers;
using IC2.Models;
using Newtonsoft.Json.Linq;

namespace IC2.Controllers
{
    public class TraficoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Trafico/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Id_TraficoTR,
                                                                            string Sentido,
                                                                            string Descripcion,
                                                                            string Servicio)
        {
            List<object> listaTrafico = new List<object>();
            object respuesta = null;

            try
            {

                var trafico = from elemento in db.Trafico
                              join oServicio in db.Servicio
                              on elemento.Id_ServicioTR equals oServicio.Id
                              where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                              && oServicio.Activo == 1 && oServicio.Id_LineaNegocio == lineaNegocio

                              && DbFiltro.String(elemento.Id_TraficoTR, Id_TraficoTR)
                              && DbFiltro.String(elemento.Sentido, Sentido)
                              && DbFiltro.String(elemento.Descripcion, Descripcion)
                              && DbFiltro.String(oServicio.Servicio1, Servicio)

                              select new
                               {
                                   oServicio.Id_Servicio,
                                   elemento.Sentido,
                                   elemento.Descripcion,
                                   elemento.Id_TraficoTR,
                                   elemento.Id,
                                   oServicio.Servicio1
                               };

                foreach (var elemento in trafico)
                {
                    listaTrafico.Add(new
                    {
                        Id_TraficoTR = elemento.Id_TraficoTR,
                        Sentido = elemento.Sentido,
                        Descripcion = elemento.Descripcion,
                        Id_Servicio = elemento.Id_Servicio,
                        Id = elemento.Id,
                        Servicio = elemento.Servicio1
                    });
                }

                respuesta = new { success = true,
                                  results = listaTrafico.Skip(start).Take(limit).ToList(),
                                  total = listaTrafico.Count };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult agregarTrafico(string Sentido, string Descripcion, int Id_Servicio, string Id_TraficoTR, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Trafico();
                //Busca el Id_Servicio que se desea ingresar
                Servicio oServicio = db.Servicio.Where(x => x.Id == Id_Servicio && x.Activo == 1).SingleOrDefault();
                //Evalua si se encontro el servicio
                if (oServicio != null)
                {
                    nuevo.Sentido = Sentido;
                    nuevo.Descripcion = Descripcion;
                    nuevo.Id_ServicioTR = oServicio.Id;
                    nuevo.Id_TraficoTR = Id_TraficoTR;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio=lineaNegocio;
                    db.Trafico.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Trafico.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new {success=true , results="ok"};
                }
             else
                respuesta = new { success = true, results = "no", dato= Id_Servicio };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarTrafico(int Id)
        {
            object respuesta = null;

            try
            {
               
               Trafico oTrafico = db.Trafico.Where(x => x.Id == Id).SingleOrDefault();
               respuesta = new { success = true, results = oTrafico };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarTrafico(string strID)
        {
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            object respuesta = null;
            strID = strID.TrimEnd(',');
            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                 {
                    if (Ids[i].Length != 0)
                       {
                          int Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Trafico", Id);

                        if (strresp_val.Length == 0)
                        {
                            Trafico oTrafico = db.Trafico.Where(x => x.Id == Id).SingleOrDefault();
                            oTrafico.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oTrafico, "Eliminado", "Trafico.html", Request.UserHostAddress);

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
                respuesta = new { success = false, results = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificarTrafico(string Sentido, string Descripcion, string Id_Servicio, int Id, int lineaNegocio/*, string Servicio*/)
        {
            object respuesta = null;

            try
            {
                Trafico oTrafico = db.Trafico.Where(x => x.Id == Id).SingleOrDefault();
                Servicio oServicio = db.Servicio.Where(x => x.Id_Servicio == Id_Servicio && x.Activo==1 && x.Id_LineaNegocio == lineaNegocio ).SingleOrDefault();

            //    if (oServicio != null)
              //  { 
                        oTrafico.Sentido = Sentido;
                        oTrafico.Descripcion = Descripcion;
                        oTrafico.Id_ServicioTR = oServicio.Id;
                Log log = new Log();
                log.insertaBitacoraModificacion(oTrafico, "Id", oTrafico.Id, "Trafico.html", Request.UserHostAddress);

                db.SaveChanges();

                     respuesta = new { success = true, results = "ok" };
              //}
              //else
                //   respuesta = new { success = false, results = "no" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaServicio(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var servicio = from oServicio in db.Servicio
                               where oServicio.Activo == 1 && oServicio.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oServicio.Id_Servicio,
                                   oServicio.Servicio1,
                                   oServicio.Id
                               };
                foreach (var elemento in servicio)
                {
                    lista.Add(new
                    {
                        IdServicio = elemento.Id,
                        ServicioDesc = elemento.Servicio1,
                        NombreServicio = elemento.Id_Servicio,
                        NombreCompleto = elemento.Id_Servicio + "-"+elemento.Servicio1
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
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

            string strresp_val = funGralCtrl.ValidaRelacion("Trafico", Id);

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