// Nombre: GrupoController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 14/dic/2018 
// Descripcion: Catalogo de Grupo
// Ultima Fecha de modificación: 

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class GrupoController : Controller
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Grupo1,
                                                                            string Descripcion)
        {
            List<object> listaGrupo = new List<object>();
            object respuesta = null;
            try
            {

                var grupo = from elemento in db.Grupo
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                            && DbFiltro.String(elemento.Grupo1, Grupo1)
                            && DbFiltro.String(elemento.DescripcionGrupo, Descripcion)

                            select new
                            {
                                elemento.Id,
                                elemento.Grupo1,
                                elemento.DescripcionGrupo
                            };

                foreach (var elemento in grupo)
                {
                    listaGrupo.Add(new
                    {
                        Id = elemento.Id,
                        Grupo1 = elemento.Grupo1,
                        Descripcion = elemento.DescripcionGrupo
                    });
                }
                respuesta = new { success = true, results = listaGrupo.Skip(start).Take(limit), total = listaGrupo.Count };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarGrupo(string Grupo1, string Descripcion, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Grupo();

                nuevo.Grupo1 = Grupo1;
                nuevo.DescripcionGrupo = Descripcion;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;

                db.Grupo.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Grupo.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarGrupo(int Id)
        {
            object respuesta = null;

            try
            {
                Grupo oGrupo = db.Grupo.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();


                respuesta = new { success = true, results = oGrupo };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarGrupo(string strID)
        {
            object respuesta = null;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            strID = strID.TrimEnd(',');

            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        int Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Grupo", Id);

                        if (strresp_val.Length == 0)
                        {
                            Grupo oGrupo = db.Grupo.Where(a => a.Id == Id).SingleOrDefault();
                            oGrupo.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oGrupo, "Eliminado", "Grupo.html", Request.UserHostAddress);

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

        public JsonResult modificarGrupo(/*string Grupo1,*/ string Descripcion, int Id, int lineaNegocio)
        {
            object respuesta = null;

            try
            {
                Grupo oGrupo = db.Grupo.Where(a => a.Id == Id && a.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

                //oGrupo.Grupo1 = Grupo1;
                oGrupo.DescripcionGrupo = Descripcion;
                Log log = new Log();
                log.insertaBitacoraModificacion(oGrupo, "Id", oGrupo.Id, "Grupo.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };
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

            string strresp_val = funGralCtrl.ValidaRelacion("Grupo", Id);

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