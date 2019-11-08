/* Nombre: BonoTraficoController.cs  
* Creado por: Jaime ALfredo Ladrón de Guevara Herrero
* Fecha de Creación: 12/feb/2019
* Descripcion: Catalogo de Bonos Trafico
* Modificado por: 
* Ultima Fecha de modificación:   
*/
using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class BonoAceleracionTraficoController : Controller
    {
        // GET: BonoTrafico
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        #region Vista
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {
                var bonoT = from elemento in db.BonoTrafico
                               join operador in db.Operador
                               on elemento.Id_Operador equals operador.Id
                               join trafico in db.Trafico
                               on elemento.Trafico_Id equals trafico.Id
                               where
                               elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   elemento.Id,
                                   operador.Id_Operador,
                                   OperadorId = operador.Id,
                                   operador.Nombre,
                                   elemento.Trafico_Id,
                                   trafico.Descripcion,
                               };

                foreach (var elemento in bonoT)
                {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Id_Operador = elemento.Id_Operador,
                        OperadorId = elemento.OperadorId,
                        Nombre = elemento.Nombre,
                        Trafico_Id = elemento.Trafico_Id,
                        TraficoDescripcion = elemento.Descripcion,
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
        #region Metodos
        public JsonResult agregar(int? Operador, int Trafico, string TraficoDescripcion, int lineaNegocio)
        {
            BonoTrafico bonoT = db.BonoTrafico.Where(x => x.Id_Operador == Operador && x.Trafico_Id == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            object respuesta = null;
            if (bonoT == null)
            {
                try
                {
                    var nuevo = new BonoTrafico();
                    nuevo.Id_Operador = Operador;
                    nuevo.Trafico_Id = Trafico;
                    nuevo.TraficoDescripcion = TraficoDescripcion;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.BonoTrafico.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "BonoTrafico.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                catch (Exception ex)
                {
                    respuesta = new { success = false, results = ex.Message };
                }
            }
            else
            {
                respuesta = new
                {
                    success = false,
                    results = "El Operador y Tráfico actual ya están dados de alta"
                };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificar(int Id, string Id_Operador, int? Operador, int Trafico, string TraficoDescripcion, int lineaNegocio)
        {
            object respuesta = null;
            Operador operador = db.Operador.Where(x => x.Id_Operador == Id_Operador && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            BonoTrafico bonoT = db.BonoTrafico.Where(x => x.Id_Operador == Operador && x.Trafico_Id == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

            if (bonoT == null || bonoT.Id == Id)
            {
                try
                {
                    BonoTrafico oBonoTrafico = db.BonoTrafico.Where(x => x.Id == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                    oBonoTrafico.Id_Operador = operador.Id;
                    oBonoTrafico.Trafico_Id = Trafico;
                    oBonoTrafico.TraficoDescripcion = TraficoDescripcion;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oBonoTrafico, "Id", oBonoTrafico.Id, "BonoTrafico.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                catch (Exception ex)
                {
                    respuesta = new
                    {
                        success = false,
                        results = "Un error ocurrió mientras se realizaba la petición.\n Error: " + ex.Message.ToString()
                    };
                }
            }
            else
            {
                respuesta = new
                {
                    success = false,
                    results = "El Operador y Tráfico actual ya están dados de alta"
                };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrar(string strID)
        {
            int Id = 0;
            strID = strID.TrimEnd(',');
            object respuesta;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;

            try
            {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("BonoTrafico", Id);

                        if (strresp_val.Length == 0)
                        {
                            BonoTrafico oBonoTrafico = db.BonoTrafico.Where(x => x.Id == Id).SingleOrDefault();
                            oBonoTrafico.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oBonoTrafico, "Eliminado", "BonoTrafico.html", Request.UserHostAddress);
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
        #endregion
        #region Relaciones
        public JsonResult llenaOperador(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<Operador> lista = new List<Operador>();
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
                    lista.Add(new Operador
                    {
                        Id = elemento.Id,
                        Id_Operador = elemento.Id_Operador,
                        Nombre = elemento.Nombre
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
        public JsonResult llenaTrafico(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<Trafico> lista = new List<Trafico>();
                var trafico = from oTrafico in db.Trafico
                              where oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == lineaNegocio
                              select new
                              {
                                  oTrafico.Id,
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion
                              };
                foreach (var elemento in trafico)
                {
                    lista.Add(new Trafico
                    {
                        Id = elemento.Id,
                        Id_TraficoTR = elemento.Id_TraficoTR,
                        Descripcion = elemento.Descripcion
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

        #region Funciones
        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("BonoTrafico", Id);

            if (strresp_val.Length != 0)
            {
               
                strmsg = "El registro que quieres modificar se está usando en el(los) catálogo(s) " + strSalto;
                strmsg = strmsg + strresp_val + strSalto;
                strmsg = strmsg + " ¿Estas seguro de hacer la modificación?";

                blsccs = false;
            }

            respuesta = new { success = blsccs, results = strmsg };

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}