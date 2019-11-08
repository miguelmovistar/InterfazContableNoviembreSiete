using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Controllers.Seguridad;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class AcreedorController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Acreedor/
        //[CustomAuthorize("Index")]
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Acreedor,
                                                                            string Nombre)
        {
            List<object> listaAcreedor = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var acreedor = from elemento in db.Acreedor
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio==lineaNegocio

                                && DbFiltro.String(elemento.Acreedor1, Acreedor)
                                && DbFiltro.String(elemento.NombreAcreedor, Nombre)

                               select new
                               {
                                   elemento.Acreedor1,
                                   elemento.NombreAcreedor,
                                   elemento.Id
                               };

                foreach (var elemento in acreedor)
                {
                    listaAcreedor.Add(new
                    {
                        Acreedor = elemento.Acreedor1,
                        Nombre = elemento.NombreAcreedor,
                        Id=elemento.Id                        
                    });
                }

                respuesta = new { success = true,
                                  results = listaAcreedor.Skip(start).Take(limit).ToList(),
                                  total = listaAcreedor.Count() };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message, total = total };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarAcreedor(string Acreedor, string Nombre, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Acreedor();
                Acreedor acreedor = db.Acreedor.Where(x => x.Acreedor1 == Acreedor && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                if (acreedor == null)
                {
                    nuevo.Acreedor1 = Acreedor;
                    nuevo.NombreAcreedor = Nombre;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;

                    db.Acreedor.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Acreedor.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", dato=Acreedor };
                }
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, result = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarAcreedor(int Id)
        {
            object respuesta = null;

            try
            {
                Acreedor oAcreedor = db.Acreedor.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();
               

                respuesta = new { success = true, results = oAcreedor };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarAcreedor(string strID)
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

                        string  strresp_val = funGralCtrl.ValidaRelacion ("Acreedor", Id);

                        if (strresp_val.Length == 0)
                        {
                            Acreedor oAcreedor = db.Acreedor.Where(a => a.Id == Id).SingleOrDefault();
                            oAcreedor.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oAcreedor, "Eliminado", "Acreedor.html", Request.UserHostAddress);

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

        public JsonResult modificarAcreedor(string Nombre, int Id)
        {
            object respuesta = null;

            try
            {

                Acreedor oAcreedor = db.Acreedor.Where(a => a.Id == Id).SingleOrDefault();

                // oAcreedor.Acreedor1 = Acreedor;
                oAcreedor.NombreAcreedor = Nombre;
                Log log = new Log();
                log.insertaBitacoraModificacion(oAcreedor, "Id", oAcreedor.Id, "Acreedor.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = oAcreedor };
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

            string strresp_val = funGralCtrl.ValidaRelacion("Acreedor", Id);

            if (strresp_val.Length != 0)
            {
                //  "El(Los) < cantidad de registros con relación con catálogos> registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) *< Lista de Catálogos con relación> *y deberás eliminarlos primero en el(los) catálogo(s).Si se seleccionaron registros que no están usados por otro catálogo entonces deberá mostrar otra pantalla "El(los) <Cantidad de registros no usados en otras tablas> registros pueden ser eliminados. ¿Desea continuar?
                strmsg = "El registro que quieres modificar se está usando en el(los) catálogo(s) "  + strSalto;
                strmsg = strmsg + strresp_val + strSalto;
                strmsg = strmsg + " ¿Estas seguro de hacer la modificación?";

                blsccs = false;
            }

            respuesta = new { success = blsccs, results = strmsg };

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
    }
}