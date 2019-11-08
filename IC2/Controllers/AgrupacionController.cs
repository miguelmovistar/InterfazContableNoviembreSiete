// Nombre: AgrupacionController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de Agrupacion
// Ultima Fecha de modificación: 

using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class AgrupacionController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Sentido,
                                                                            string Nivel,
                                                                            string Etiqueta,
                                                                            string Utilizacion)
        {
            List<object> listaAgrupacion = new List<object>();
            object respuesta = null;
            try
            {

                var agrupacion = from elemento in db.Agrupacion
                                 where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                                 && DbFiltro.String(elemento.Sentido, Sentido)
                                 && DbFiltro.Decimal(elemento.Nivel, Nivel)
                                 && DbFiltro.String(elemento.Etiqueta, Etiqueta)
                                 && DbFiltro.String(elemento.Utilizacion, Utilizacion)

                                 select new
                                 {
                                     elemento.Id,
                                     elemento.Sentido,
                                     elemento.Nivel,
                                     elemento.Etiqueta,
                                     elemento.Utilizacion
                                 };

                foreach (var elemento in agrupacion)
                {
                    listaAgrupacion.Add(new
                    {
                        Id = elemento.Id,
                        Sentido = elemento.Sentido,
                        Nivel = elemento.Nivel,
                        Etiqueta = elemento.Etiqueta,
                        Utilizacion = elemento.Utilizacion
                    });
                }
                respuesta = new
                {
                    success = true,
                    results = listaAgrupacion.Skip(start).Take(limit).ToList(),
                    total = listaAgrupacion.Count()
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarAgrupacion(string Sentido, int Nivel, string Etiqueta, string Utilizacion, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Agrupacion();

                nuevo.Sentido = Sentido;
                nuevo.Nivel = Nivel;
                nuevo.Etiqueta = Etiqueta;
                nuevo.Utilizacion = Utilizacion;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;

                db.Agrupacion.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Agrupacion.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarAgrupacion(int Id)
        {
            object respuesta = null;

            try
            {
                Agrupacion oAgrupacion = db.Agrupacion.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();


                respuesta = new { success = true, results = oAgrupacion };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarAgrupacion(string strId)
        {
            int Id = 0;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            strId = strId.TrimEnd(',');
            object respuesta;

            try
            {
                string[] Ids = strId.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Agrupacion", Id);

                        if (strresp_val.Length == 0)
                        {
                            Agrupacion oAgrupacion = db.Agrupacion.Where(x => x.Id == Id).SingleOrDefault();
                            oAgrupacion.Activo = 0;
                            Log log = new Log();
                            log.insertaBitacoraModificacion(oAgrupacion, "Id", oAgrupacion.Id, "Agrupacion.html", Request.UserHostAddress);
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

        public JsonResult modificarAgrupacion(string Sentido, int Nivel, string Etiqueta, string Utilizacion, int Id)
        {
            object respuesta = null;

            try
            {

                Agrupacion oAgrupacion = db.Agrupacion.Where(a => a.Id == Id).SingleOrDefault();

                oAgrupacion.Sentido = Sentido;
                oAgrupacion.Nivel = Nivel;
                oAgrupacion.Etiqueta = Etiqueta;
                oAgrupacion.Utilizacion = Utilizacion;
                Log log = new Log();
                log.insertaNuevoOEliminado(oAgrupacion, "Eliminado", "Agrupacion.html", Request.UserHostAddress);
                db.SaveChanges();

                respuesta = new { success = true, results = oAgrupacion };
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

            string strresp_val = funGralCtrl.ValidaRelacion("Agrupacion", Id);

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