using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CaracteristicasPAController : Controller
    {
        // GET: CaracteristicasPA
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

        public JsonResult LlenaGrid(int lineaNegocio, int start, int limit, string Ambito,
                                                                            string Bundle,
                                                                            string Canal,
                                                                            string CodigoMaterial,
                                                                            string Cuenta,
                                                                            string DescripcionMaterial,
                                                                            string Nlicencia,
                                                                            string Producto,
                                                                            string Region,
                                                                            string SegmentoPA,
                                                                            string Sentido,
                                                                            string SubsegmentoPA,
                                                                            string Subtipolinea,
                                                                            string TraficoDescripcion)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try {

                var cuenta = from elemento in db.CaracteristicasPA
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                                && DbFiltro.String(elemento.Ambito, Ambito)
                                && DbFiltro.String(elemento.Bundle, Bundle)
                                && DbFiltro.String(elemento.Canal, Canal)
                                && DbFiltro.String(elemento.CodigoMaterial, CodigoMaterial)
                                && DbFiltro.String(elemento.Cuenta, Cuenta)
                                && DbFiltro.String(elemento.DescripcionMaterial, DescripcionMaterial)
                                && DbFiltro.String(elemento.Nlicencia, Nlicencia)
                                && DbFiltro.String(elemento.Producto, Producto)
                                && DbFiltro.String(elemento.Region, Region)
                                && DbFiltro.String(elemento.SegmentoPA, SegmentoPA)
                                && DbFiltro.String(elemento.Sentido, Sentido)
                                && DbFiltro.String(elemento.SubsegmentoPA, SubsegmentoPA)
                                && DbFiltro.String(elemento.Subtipolinea, Subtipolinea)
                                && DbFiltro.String(elemento.TraficoDescripcion, TraficoDescripcion)

                             select new
                             {
                                 elemento.Id,
                                 elemento.Sentido,
                                 elemento.CodigoMaterial,
                                 elemento.DescripcionMaterial,
                                 elemento.Cuenta,
                                 elemento.SubsegmentoPA,
                                 elemento.SegmentoPA,
                                 elemento.Producto,
                                 elemento.Canal,
                                 elemento.Bundle,
                                 elemento.TraficoDescripcion,
                                 elemento.Subtipolinea,
                                 elemento.Nlicencia,
                                 elemento.Region,
                                 elemento.Ambito,
                             };

                foreach (var elemento in cuenta) {
                    lista.Add(new
                    {
                        elemento.Id,
                        elemento.Sentido,
                        elemento.CodigoMaterial,
                        elemento.DescripcionMaterial,
                        elemento.Cuenta,
                        elemento.SubsegmentoPA,
                        elemento.SegmentoPA,
                        elemento.Producto,
                        elemento.Canal,
                        elemento.Bundle,
                        elemento.TraficoDescripcion,
                        elemento.Subtipolinea,
                        elemento.Nlicencia,
                        elemento.Region,
                        elemento.Ambito
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaTrafico(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try {
                var datos = from oTrafico in db.Trafico
                            where oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oTrafico.Id,
                                oTrafico.Descripcion,
                                oTrafico.Id_TraficoTR
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Id_TraficoTR = elemento.Id_TraficoTR,
                        Descripcion = elemento.Id_TraficoTR + " - " + elemento.Descripcion
                    });
                }
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaCuenta(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;

            try {
                var datos = from oCuenta in db.CuentaResultado
                            where oCuenta.Activo == 1 && oCuenta.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oCuenta.Id,
                                oCuenta.Cuenta,
                                oCuenta.Codigo_Material,
                                oCuenta.Material,
                                oCuenta.Sentido,
                                oCuenta.Trafico_Id,
                                oCuenta.TraficoDescripcion
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        CuentaR = elemento.Cuenta,
                        Codigo_Material = elemento.Codigo_Material,
                        Material = elemento.Material,
                        elemento.Sentido,
                        elemento.Trafico_Id,
                        elemento.TraficoDescripcion
                    });
                }
                lista = lista.ToList();
                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AgregarCaracteristicaPA(int idCuenta, string cuenta, string sentido, string codMaterial, string material, string subsegmentoPA, string segmentoPA, string producto, string canal, string bundle, string trafico, string subtipoLinea, string licencia, string region, string ambito, int lineaNegocio)
        {
            object respuesta = null;
            try {
                var nuevo = new CaracteristicasPA();
                nuevo.Sentido = sentido;
                nuevo.CodigoMaterial = codMaterial;
                nuevo.DescripcionMaterial = material;
                nuevo.Cuenta = cuenta;
                nuevo.SubsegmentoPA = subsegmentoPA;
                nuevo.SegmentoPA = segmentoPA;
                nuevo.Producto = producto;
                nuevo.Canal = canal;
                nuevo.Bundle = bundle;
                nuevo.TraficoDescripcion = trafico;
                nuevo.Subtipolinea = subtipoLinea;
                nuevo.Nlicencia = licencia;
                nuevo.Region = region;
                nuevo.Ambito = ambito;
                nuevo.idCuenta = idCuenta;
                nuevo.Activo = 1;
                nuevo.Id_LineaNegocio = lineaNegocio;
                db.CaracteristicasPA.Add(nuevo);
                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "CaracteristicasPA.html", Request.UserHostAddress);
                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ValidaCambios(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("CaracteristicasPA", Id);

            if (strresp_val.Length != 0) {
                //  "El(Los) < cantidad de registros con relación con catálogos> registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) *< Lista de Catálogos con relación> *y deberás eliminarlos primero en el(los) catálogo(s).Si se seleccionaron registros que no están usados por otro catálogo entonces deberá mostrar otra pantalla "El(los) <Cantidad de registros no usados en otras tablas> registros pueden ser eliminados. ¿Desea continuar?
                strmsg = "El registro que quieres modificar se está usando en el(los) catálogo(s) " + strSalto;
                strmsg = strmsg + strresp_val + strSalto;
                strmsg = strmsg + " ¿Estas seguro de hacer la modificación?";

                blsccs = false;
            }

            respuesta = new { success = blsccs, results = strmsg };

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ModificarCaracteristica(int Id, int idCuenta, string cuenta, string sentido, string codMaterial, string material, string subsegmentoPA, string segmentoPA, string producto, string canal, string bundle, string trafico, string subtipoLinea, string licencia, string region, string ambito, int lineaNegocio)
        {
            object respuesta = null;

            try {
                CaracteristicasPA oCaracteristicasPA = db.CaracteristicasPA.Where(x => x.Id == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                oCaracteristicasPA.Sentido = sentido;
                oCaracteristicasPA.CodigoMaterial = codMaterial;
                oCaracteristicasPA.DescripcionMaterial = material;
                oCaracteristicasPA.Cuenta = cuenta;
                oCaracteristicasPA.SubsegmentoPA = subsegmentoPA;
                oCaracteristicasPA.SegmentoPA = segmentoPA;
                oCaracteristicasPA.Producto = producto;
                oCaracteristicasPA.Canal = canal;
                oCaracteristicasPA.Bundle = bundle;
                oCaracteristicasPA.TraficoDescripcion = trafico;
                oCaracteristicasPA.Subtipolinea = subtipoLinea;
                oCaracteristicasPA.Nlicencia = licencia;
                oCaracteristicasPA.Region = region;
                oCaracteristicasPA.Ambito = ambito;
                oCaracteristicasPA.idCuenta = idCuenta;
                oCaracteristicasPA.Activo = 1;
                oCaracteristicasPA.Id_LineaNegocio = lineaNegocio;
                Log log = new Log();
                log.insertaBitacoraModificacion(oCaracteristicasPA, "Id", oCaracteristicasPA.Id, "CaracteristicasPA.html", Request.UserHostAddress);
                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };
            } catch (Exception ex) {
                respuesta = new
                {
                    success = false,
                    results = "Un error ocurrió mientras se realizaba la petición.\n Error: " + ex.Message.ToString()
                };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Borrar(string strID)
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

                        string strresp_val = funGralCtrl.ValidaRelacion("CaracteristicasPA", Id);

                        if (strresp_val.Length == 0) {
                            CaracteristicasPA oCaracteristicasPA = db.CaracteristicasPA.Where(x => x.Id == Id).SingleOrDefault();
                            oCaracteristicasPA.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oCaracteristicasPA, "Eliminado", "CaracteristicasPA.html", Request.UserHostAddress);
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
    }
}