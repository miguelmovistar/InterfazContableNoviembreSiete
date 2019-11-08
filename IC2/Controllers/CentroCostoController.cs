using IC2.Helpers;
using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class CentroCostoController : Controller
    {
        // GET: CentroCosto
        ICPruebaEntities db = new ICPruebaEntities();
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string TraficoDescripcion,
                                                                            string CC,
                                                                            string Area_Funcional)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try {

                using (db)
                {
                    var centrocosto = from elemento in db.CentroCosto
                                      join trafico in db.Trafico
                                      on elemento.Trafico_Id equals trafico.Id
                                      where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                                      && DbFiltro.String(elemento.TraficoDescripcion, TraficoDescripcion)
                                      && DbFiltro.String(elemento.CC, CC)
                                      && DbFiltro.String(elemento.Area_Funcional, Area_Funcional)

                                      select new
                                      {
                                          elemento.Id,
                                          elemento.Trafico_Id,
                                          trafico.Descripcion,
                                          elemento.CC,
                                          elemento.Area_Funcional
                                      };

                    foreach (var elemento in centrocosto)
                    {
                        lista.Add(new
                        {
                            Id = elemento.Id,
                            Trafico_Id = elemento.Trafico_Id,
                            TraficoDescripcion = elemento.Descripcion,
                            //TraficoDescripcion = db.Trafico.Where(x => x.Id == elemento.Trafico_Id).SingleOrDefault().Descripcion,
                            CC = elemento.CC,
                            Area_Funcional = elemento.Area_Funcional
                        });
                    }
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            } catch (Exception ex) {
                respuesta = new { success = true, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Metodos
        public JsonResult agregar(int Trafico, string TraficoDescripcion, string CC, string Area_Funcional, int lineaNegocio)
        {
            CentroCosto centrocosto = db.CentroCosto.Where(x => x.Trafico_Id == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            object respuesta = null;
            if (centrocosto == null) {
                try {
                    var nuevo = new CentroCosto();
                    nuevo.Trafico_Id = Trafico;
                    nuevo.TraficoDescripcion = TraficoDescripcion;
                    nuevo.CC = CC;
                    nuevo.Area_Funcional = Area_Funcional;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.CentroCosto.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "CentroCosto.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ex) {
                    respuesta = new { success = false, results = ex.Message };
                }
            } else {
                respuesta = new
                {
                    success = false,
                    results = "El Tráfico actual ya está dado de alta"
                };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult modificar(int Id, int Trafico, string TraficoDescripcion, string CC, string Area_Funcional, int lineaNegocio)
        {
            object respuesta = null;
            CentroCosto centrocosto = db.CentroCosto.Where(x => x.Trafico_Id == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

            if (centrocosto != null) {
                try {
                    CentroCosto oCentroCosto = db.CentroCosto.Where(x => x.Id == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                    oCentroCosto.Trafico_Id = Trafico;
                    oCentroCosto.TraficoDescripcion = TraficoDescripcion;
                    oCentroCosto.CC = CC;
                    oCentroCosto.Area_Funcional = Area_Funcional;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oCentroCosto, "Id", oCentroCosto.Id, "Clase_Servicio.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ex) {
                    respuesta = new
                    {
                        success = false,
                        results = "Un error ocurrió mientras se realizaba la petición.\n Error: " + ex.Message.ToString()
                    };
                }
            } else {
                respuesta = new
                {
                    success = false,
                    results = "El Tráfico actual ya está dado de alta"
                };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrar(string strID)
        {
            int Id = 0;
            strID = strID.TrimEnd(',');
            object respuesta;
            try {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++) {
                    if (Ids[i].Length != 0) {
                        Id = int.Parse(Ids[i]);

                        CentroCosto oCentroCosto = db.CentroCosto.Where(x => x.Id == Id).SingleOrDefault();
                        oCentroCosto.Activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oCentroCosto, "Eliminado", "CentroCosto.html", Request.UserHostAddress);
                        db.SaveChanges();
                    }
                }
                respuesta = new { success = true, results = "ok" };
            } catch {
                respuesta = new { success = false, result = "no" };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Relaciones        
        public JsonResult llenaTrafico(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try {
                List<Trafico> lista = new List<Trafico>();
                var trafico = from oTrafico in db.Trafico
                              where oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == lineaNegocio
                              select new
                              {
                                  oTrafico.Id,
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion
                              };
                foreach (var elemento in trafico) {
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
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}