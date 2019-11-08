// Nombre: MonedaController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de Moneda
// Ultima Fecha de modificación: 19/dic/2018 

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using IC2.Models;
using System.Globalization;
using IC2.Helpers;
using Newtonsoft.Json.Linq;
using System.Data.Entity.SqlServer;

namespace IC2.Controllers
{
    public class MonedaController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Moneda/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Moneda1,
                                                                            string Descripcion)
        {
            List<object> listaMoneda = new List<object>();
            object respuesta = null;
            try
            {

                var moneda = from elemento in db.Moneda
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                            && DbFiltro.String(elemento.Moneda1, Moneda1)
                            && DbFiltro.String(elemento.Descripcion, Descripcion)

                             select new
                             {
                                 elemento.Id,
                                 elemento.Moneda1,
                                 elemento.Descripcion
                             };

                foreach (var elemento in moneda)
                {
                    listaMoneda.Add(new
                    {
                        Id = elemento.Id,
                        Moneda1 = elemento.Moneda1,
                        Descripcion = elemento.Descripcion
                    });
                }
                respuesta = new { success = true,
                                  results = listaMoneda.Skip(start).Take(limit).ToList(),
                                  total = listaMoneda.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarMoneda(string Moneda1, string Descripcion, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Moneda();

                nuevo.Moneda1 = Moneda1;
                nuevo.Descripcion = Descripcion;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;

                db.Moneda.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Moneda.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, result = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, result = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarMoneda(int Id)
        {
            object respuesta = null;

            try
            {
                Moneda oMoneda = db.Moneda.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();
                respuesta = new { success = true, results = oMoneda };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarMoneda(string strId)
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

                        string strresp_val = funGralCtrl.ValidaRelacion("Acreedor", Id);

                        if (strresp_val.Length == 0)
                        {
                            Moneda oMoneda = db.Moneda.Where(x => x.Id == Id).SingleOrDefault();
                            oMoneda.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oMoneda, "Eliminado", "Moneda.html", Request.UserHostAddress);

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
            catch
            {
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificarMoneda(string Moneda1, string Descripcion, int Id)
        {
            object respuesta = null;

            try
            {

                Moneda oMoneda = db.Moneda.Where(a => a.Id == Id).SingleOrDefault();

                oMoneda.Moneda1 = Moneda1;
                oMoneda.Descripcion = Descripcion;
                Log log = new Log();
                log.insertaBitacoraModificacion(oMoneda, "Id", oMoneda.Id, "Moneda.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = oMoneda };

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