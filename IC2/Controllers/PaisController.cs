// Nombre: PaisController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 14/dic/2018 
// Descripcion: Catalogo de Pais
// Usuario que modifica:Jaíme Alfredo Ladrón de Guevara Herrero
// Ultima Fecha de modificación: 18/12/2018

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PaisController : Controller
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
        public JsonResult llenaGrid(int lineaNegocio)
        {
            List<object> listaPais = new List<object>();
            object respuesta = null;
            try
            {

                var pais = from elemento in db.Pais
                           join grupo in db.Grupo
                           on elemento.Id_Grupo equals grupo.Id
                           where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                           select new
                           {
                               elemento.Id,
                               grupo.Grupo1,
                               elemento.Country,
                               elemento.Texto
                           };

                foreach (var elemento in pais)
                {
                    listaPais.Add(new
                    {
                        Id = elemento.Id,
                        PLMN = elemento.Grupo1,
                        Country = elemento.Country,
                        Texto = elemento.Texto
                    });
                }
                respuesta = new { success = true, results = listaPais };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarPais(string PLMN, string Country, string Texto, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                Grupo grupo = db.Grupo.Where(x => x.Grupo1 == PLMN && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                var nuevo = new Pais();

                nuevo.Id_Grupo = grupo.Id;
                nuevo.Country = Country;
                nuevo.Texto = Texto;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;
                db.Pais.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Pais.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarPais(int Id)
        {
            object respuesta = null;

            try
            {
                Pais oPais = db.Pais.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();


                respuesta = new { success = true, results = oPais };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarPais(string strId)
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

                        string strresp_val = funGralCtrl.ValidaRelacion("Pais", Id);

                        if (strresp_val.Length == 0)
                        {
                            Pais oPais = db.Pais.Where(x => x.Id == Id).SingleOrDefault();
                            oPais.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oPais, "Eliminado", "Pais.html", Request.UserHostAddress);

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
            catch(Exception ex)
            {
                strmsg = ex.Message;
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificarPais(string PLMN, string Country, string Texto, int Id, int lineaNegocio)
        {
            object respuesta = null;

            try
            {

                Pais oPais = db.Pais.Where(a => a.Id == Id).SingleOrDefault();
                Grupo grupo = db.Grupo.Where(x => x.Grupo1 == PLMN && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

                oPais.Id_Grupo = grupo.Id;
                oPais.Country = Country;
                oPais.Texto = Texto;
                Log log = new Log();
                log.insertaBitacoraModificacion(oPais, "Id", oPais.Id, "Clase_Servicio.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaGrupo(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Grupo
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                elemento.Grupo1
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Grupo = elemento.Grupo1
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

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Pais", Id);

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