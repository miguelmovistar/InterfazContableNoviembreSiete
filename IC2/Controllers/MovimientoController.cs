// Nombre: MovimientoController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de Movimiento
// Ultima Fecha de modificación: 19/dic/2018 

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class MovimientoController : Controller
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

        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Tipo_Movimiento,
                                                                            string Nombre,
                                                                            string Servicio,
                                                                            string Direccion)
        {
            List<object> listaMovimiento = new List<object>();
            object respuesta = null;
            try
            {

                var movimiento = from omovimiento in db.Movimiento
                                 join operador in db.Operador
                                 on omovimiento.Id_Operador equals operador.Id
                                 join servicio in db.Servicio
                                 on omovimiento.Id_Servicio equals servicio.Id
                                 where omovimiento.Activo == 1 && omovimiento.Id_LineaNegocio == lineaNegocio
                                 && operador.Activo == 1 && operador.Id_LineaNegocio == lineaNegocio
                                 && servicio.Activo == 1 && servicio.Id_LineaNegocio == lineaNegocio

                                && DbFiltro.String(omovimiento.Tipo_Movimiento, Tipo_Movimiento)
                                && DbFiltro.String(operador.Nombre, Nombre)
                                && DbFiltro.String(servicio.Servicio1, Servicio)
                                && DbFiltro.String(omovimiento.Direccion, Direccion)

                                 select new
                                 {
                                     omovimiento.Id,
                                     omovimiento.Direccion,
                                     operador.Nombre,
                                     omovimiento.Id_Operador,
                                     omovimiento.Id_Servicio,
                                     omovimiento.Tipo_Movimiento,
                                     servicio.Servicio1
                                 };

                foreach (var elemento in movimiento)
                {
                    listaMovimiento.Add(new
                    {
                        Id = elemento.Id,
                        Direccion = elemento.Direccion,
                        Id_Operador = elemento.Id_Operador,
                        Id_Servicio = elemento.Id_Servicio,
                        Tipo_Movimiento = elemento.Tipo_Movimiento,
                        Nombre = elemento.Nombre,
                        Servicio=elemento.Servicio1
                    });
                }
                respuesta = new { success = true,
                                  results = listaMovimiento.Skip(start).Take(limit).ToList(),
                                  total = listaMovimiento.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult agregarMovimiento(string Tipo_Movimiento, int Id_Operador, int Id_Servicio, string Direccion, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Movimiento();
                
                nuevo.Id_Servicio = Id_Servicio;
                nuevo.Tipo_Movimiento = Tipo_Movimiento;
                nuevo.Id_Operador = Id_Operador;
                nuevo.Direccion = Direccion;
                nuevo.Id_LineaNegocio = lineaNegocio;
                nuevo.Activo = 1;

                db.Movimiento.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Movimiento.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
              
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }
        public JsonResult buscarMovimiento(int Id)
        {
            object respuesta = null;

            try
            {

                var movimiento = db.Movimiento.Where(x => x.Id == Id);
                List<object> lista = new List<object>();

                foreach (var elemento in movimiento)
                {
                    lista.Add(new
                    {
                        Direccion = elemento.Direccion,
                        Id_Operador = elemento.Id_Operador,
                        Id_Servicio = elemento.Id_Servicio,
                        Tipo_Movimiento = elemento.Tipo_Movimiento,
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
        public JsonResult modificarMovimiento(int Id, int Id_Operador, int Id_Servicio, string Tipo_Movimiento, string Direccion)
        {
            object respuesta = null;

            try
            {

                Movimiento oMovimiento = db.Movimiento.Where(a => a.Id == Id).SingleOrDefault();

                oMovimiento.Id_Operador = Id_Operador;
                oMovimiento.Id_Servicio = Id_Servicio;
                oMovimiento.Tipo_Movimiento = Tipo_Movimiento;
                oMovimiento.Direccion = Direccion;
                Log log = new Log();
                log.insertaBitacoraModificacion(oMovimiento, "Id", oMovimiento.Id, "Movimiento.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarMovimiento(string strId)
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

                        string strresp_val = funGralCtrl.ValidaRelacion("Movimiento", Id);

                        if (strresp_val.Length == 0)
                        {
                            Movimiento oMovimiento = db.Movimiento.Where(x => x.Id == Id).SingleOrDefault();
                            oMovimiento.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oMovimiento, "Eliminado", "Movimiento.html", Request.UserHostAddress);

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

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Movimiento", Id);

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
        #region
        /// <summary>
        /// 
        /// </summary>
        /// <param name="lineaNegocio"></param>
        /// <param name="start"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
        public JsonResult llenaOperador(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total = 0;
            try
            {
                List<object> lista = new List<object>();
                var operador = from oOperador in db.Operador
                               where oOperador.Activo == 1 && oOperador.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oOperador.Id,
                                   oOperador.Id_Operador,
                                   oOperador.Nombre
                               };
                foreach (var elemento in operador)
                {
                    lista.Add(new
                    {
                        Id_Operador = elemento.Id,
                        Operador = elemento.Id_Operador,
                        Nombre = elemento.Nombre
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch(Exception ex)
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
                        Id_Servicio = elemento.Id,
                        Servicio = elemento.Servicio1,
                        Nombre = elemento.Id_Servicio
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

        #endregion
    }
}