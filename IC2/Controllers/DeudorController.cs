using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class DeudorController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Deudor/Prueba
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Deudor,
                                                                            string Nombre)
        {
            List<object> listaDeudor = new List<object>();
            object respuesta = null;
            try
            {

                var deudor = from elemento in db.Deudor
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                             && DbFiltro.String(elemento.Deudor1, Deudor)
                             && DbFiltro.String(elemento.NombreDeudor, Nombre)

                             select new
                             {
                                 elemento.Id,
                                 elemento.Deudor1,
                                 elemento.NombreDeudor,
                                 elemento.Activo
                             };

                foreach (var elemento in deudor)
                {
                    listaDeudor.Add(new
                    {
                        Id = elemento.Id,
                        Deudor= elemento.Deudor1,
                        Nombre = elemento.NombreDeudor
                        
                    });
                }
                respuesta = new { success = true, results = listaDeudor.Skip(start).Take(limit), total = listaDeudor.Count };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarDeudor(string Deudor, string Nombre, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Deudor();
                Deudor deudor = db.Deudor.Where(x => x.Deudor1 == Deudor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                if (deudor == null)
                {
                    nuevo.Deudor1 = Deudor;
                    nuevo.NombreDeudor = Nombre;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.Deudor.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Deudor.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", dato = Deudor };
                }
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarDeudor(int Id)
        {
            object respuesta = null;

            try
            {
                Deudor oDeudor = db.Deudor.Where(x => x.Id == Id && x.Activo ==1).SingleOrDefault();
                List<object> listaDeudor = new List<object>();

                respuesta = new { success = true, results = oDeudor };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarDeudor(string strID)
        {
            object respuesta = null;
            int Id = 0;
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
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Deudor", Id);

                        if (strresp_val.Length == 0)
                        {
                            Deudor oDeudor = db.Deudor.Where(a => a.Id == Id).SingleOrDefault();
                            oDeudor.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oDeudor, "Eliminado", "Deudor.html", Request.UserHostAddress);

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
                respuesta = new { success = false, result = "no" };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificarDeudor( string Deudor, string Nombre, int Id)
        {
            object respuesta = null;

            try
            {

                Deudor oDeudor = db.Deudor.Where(a => a.Id == Id).SingleOrDefault();

                //oDeudor.Id_Deudor = Id_Deudor;
                oDeudor.Deudor1 = Deudor;
                oDeudor.NombreDeudor = Nombre;
                Log log = new Log();
                log.insertaBitacoraModificacion(oDeudor, "Id", oDeudor.Id, "Clase_Servicio.html", Request.UserHostAddress);

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

            string strresp_val = funGralCtrl.ValidaRelacion("Deudor", Id);

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