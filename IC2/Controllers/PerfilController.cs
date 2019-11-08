using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PerfilController : Controller
    {
        // GET: Perfil
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


        public JsonResult llenaGrid(int start, int limit, string Id, string Nombre)
        {

            object respuesta = null;
            try
            {
                List<object> lista = new List<object>();
                var consulta = from oPer in db.Perfil
                               where oPer.Activo == true
                               && DbFiltro.Int(oPer.Id, Id)
                               && DbFiltro.String(oPer.Nombre, Nombre)

                               select new
                               {
                                   oPer.Id,
                                   oPer.Nombre
                               };
                foreach (var item in consulta)
                {

                    lista.Add(new
                    {
                        Id = item.Id,
                        Nombre = item.Nombre
                    });

                }

                respuesta = new
                {
                    success = true,
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


        public JsonResult buscarPerfil(int Id)
        {

            object respuesta = null;
            try
            {
                List<object> lista = new List<object>();
                var consulta = from oPer in db.Perfil
                               where oPer.Activo == true
                               && oPer.Id == Id

                               select new
                               {
                                   oPer.Id,
                                   oPer.Nombre
                               };
                foreach (var item in consulta)
                {

                    lista.Add(new
                    {
                        Id = item.Id,
                        Nombre = item.Nombre
                    });

                }

                respuesta = new { success = true, results = lista[0] };


            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);



        }


        public JsonResult modifica(int id, string Nombre)
        {
            object respuesta = null;
            try
            {
                Perfil oPer = db.Perfil.Where(a => a.Id == id).SingleOrDefault();
                oPer.Nombre = Nombre;
                Log log = new Log();
                log.insertaBitacoraModificacion(oPer, "Id", oPer.Id, "Perfil.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }



        public JsonResult borrar(string strID)
        {


            int Id = 0;
            strID = strID.TrimEnd(',');
            object respuesta = null;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;

            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                {
                    Id = int.Parse(Ids[i]);

                    string strresp_val = funGralCtrl.ValidaRelacion("Perfil", Id);

                    if (strresp_val.Length == 0)
                    {
                        Perfil oPer = db.Perfil.Where(a => a.Id == Id).SingleOrDefault();
                        oPer.Activo = false;
                        //Log log = new Log();
                        //log.insertaNuevoOEliminado(oPer, "Eliminado", "Perfil.html", Request.UserHostAddress);

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

                respuesta = new { success = blsucc, result = strmsg };
            }
            catch (Exception ex)
            {
                strmsg = ex.Message;
                respuesta = new { success = false, results = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);


        }


        public JsonResult registra(string nombre)
        {
            object respuesta = null;

            try
            {
                var nuevo = new Perfil();
                nuevo.Nombre = nombre;
                nuevo.Activo = true;
                db.Perfil.Add(nuevo);
                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };

                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Perfil.html", Request.UserHostAddress);
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

            string strresp_val = funGralCtrl.ValidaRelacion("Perfil", Id);

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