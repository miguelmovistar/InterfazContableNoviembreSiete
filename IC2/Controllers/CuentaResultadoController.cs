using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CuentaResultadoController : Controller
    {
        // GET: CuentaResultado
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Sentido,
                                                                            string TraficoDescripcion,
                                                                            string Cuenta,
                                                                            string Codigo_Material,
                                                                            string Material)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try {

                var cuenta = from elemento in db.CuentaResultado
                             join trafico in db.Trafico
                             on elemento.Trafico_Id equals trafico.Id
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                            && DbFiltro.String(elemento.Sentido, Sentido)
                            && DbFiltro.String(elemento.TraficoDescripcion, TraficoDescripcion)
                            && DbFiltro.String(elemento.Cuenta, Cuenta)
                            && DbFiltro.String(elemento.Codigo_Material, Codigo_Material)
                            && DbFiltro.String(elemento.Material, Material)

                             select new
                             {
                                 elemento.Id,
                                 elemento.Sentido,
                                 elemento.Trafico_Id,
                                 trafico.Descripcion,
                                 elemento.Cuenta,
                                 elemento.Codigo_Material,
                                 elemento.Material
                             };

                foreach (var elemento in cuenta) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Sentido = elemento.Sentido,
                        Trafico_Id = elemento.Trafico_Id,
                        TraficoDescripcion = elemento.Descripcion,
                        //TraficoDescripcion = db.Trafico.Where(x => x.Id == elemento.Trafico_Id).SingleOrDefault().Descripcion,
                        Cuenta = elemento.Cuenta,
                        Codigo_Material = elemento.Codigo_Material,
                        Material = elemento.Material
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
        #region Metodos
        public JsonResult Agregar(string Sentido, int Trafico, string Cuenta, string Codigo_Material, string Material, int lineaNegocio)
        {
            //CuentaResultado cuenta = db.CuentaResultado.Where(x => x.Trafico_Id == Trafico && x.Sentido == Sentido && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            object respuesta = null;
            //if (cuenta == null)
            //{
            try {
                Trafico traf = db.Trafico.Where(x => x.Id == Trafico && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
                var nuevo = new CuentaResultado();
                nuevo.Sentido = Sentido;
                nuevo.Trafico_Id = Trafico;
                nuevo.TraficoDescripcion = traf.Id_TraficoTR;
                nuevo.Cuenta = Cuenta;
                nuevo.Codigo_Material = Codigo_Material;
                nuevo.Material = Material;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;
                db.CuentaResultado.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "CuentaResultado.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            //}
            //else
            //{
            //    respuesta = new
            //    {
            //       success = false,
            //        results = "El Tráfico y Sentido actuales ya están dados de alta"
            //    };
            //}

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult modificar(int Id, string Sentido, int Trafico, string Cuenta, string Codigo_Material, string Material, int lineaNegocio)
        {
            object respuesta = null;
            //CuentaResultado cuenta = db.CuentaResultado.Where(x => x.Trafico_Id == Trafico && x.Sentido == Sentido && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

            //if (cuenta == null || cuenta.Id == Id) {
            try {
                Trafico traf = db.Trafico.Where(x => x.Id == Trafico && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
                CuentaResultado oCuentaResultado = db.CuentaResultado.Where(x => x.Id == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                oCuentaResultado.Sentido = Sentido;
                oCuentaResultado.Trafico_Id = Trafico;
                oCuentaResultado.TraficoDescripcion = traf.Id_TraficoTR;
                oCuentaResultado.Cuenta = Cuenta;
                oCuentaResultado.Codigo_Material = Codigo_Material;
                oCuentaResultado.Material = Material;
                Log log = new Log();
                log.insertaBitacoraModificacion(oCuentaResultado, "Id", oCuentaResultado.Id, "CuentaResultado.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            } catch (Exception ex) {
                respuesta = new
                {
                    success = false,
                    results = "Un error ocurrió mientras se realizaba la petición.\n Error: " + ex.Message.ToString()
                };
            }
            //} else {
            //    respuesta = new
            //    {
            //        success = false,
            //        results = "El Tráfico y Sentido actuales ya están dados de alta"
            //    };
            //}

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
            try {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++) {
                    if (Ids[i].Length != 0) {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("CuentaResultado", Id);

                        if (strresp_val.Length == 0) {
                            CuentaResultado oCuentaResultado = db.CuentaResultado.Where(x => x.Id == Id).SingleOrDefault();
                            oCuentaResultado.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oCuentaResultado, "Eliminado", "CuentaResultado.html", Request.UserHostAddress);
                            db.SaveChanges();
                        } else {
                            strmsg = "El(Los) " + Ids.Length.ToString() + " registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) " + strSalto;
                            strmsg = strmsg + strresp_val + strSalto;
                            blsucc = false;
                            break;
                        }
                    }
                }
                respuesta = new { success = blsucc, results = strmsg };
            } catch (Exception ex) {
                strmsg = ex.Message;
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Relaciones        
        public JsonResult LlenaTrafico(int lineaNegocio, string sentido, int start, int limit)
        {
            object respuesta = null;
            int total;
            try {
                List<Trafico> lista = new List<Trafico>();
                var trafico = from oTrafico in db.Trafico.Where(x => x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio)
                              select new
                              {
                                  oTrafico.Id,
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion,
                                  oTrafico.Sentido
                              };

                if (lineaNegocio == 1) {
                    trafico = trafico.Where(x => x.Sentido == sentido);
                }


                foreach (var elemento in trafico) {
                    lista.Add(new Trafico
                    {
                        Id = elemento.Id,
                        Id_TraficoTR = elemento.Id_TraficoTR,
                        Descripcion = elemento.Descripcion
                    });
                }
                total = lista.Count();
                respuesta = new { success = true, results = lista, total = total };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("CuentaResultado", Id);

            if (strresp_val.Length != 0) {
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