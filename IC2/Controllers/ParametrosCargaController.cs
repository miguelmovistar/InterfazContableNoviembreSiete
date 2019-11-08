using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class ParametrosCargaController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        // GET: /Deudor/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult LlenaGrid(string servicio, int start, int limit, string Id_Documento,
                                                                           string activo,
                                                                           string caracterFinLinea,
                                                                           string caracterSeparador,
                                                                           string diaCorte,
                                                                           string horaCorte,
                                                                           string nombreArchivo,
                                                                           string nombreDocumento,
                                                                           string pathURL,
                                                                           string servicioCol)
        {
            List<object> listaParametros = new List<object>();
            object respuesta = null;

            try
            {
                var catDocCarg = from elemento in db.parametrosCargaDocumento
                                 where elemento.activo == 1 && elemento.servicio == servicio

                                    && DbFiltro.String(elemento.idDocumento, Id_Documento)
                                    && DbFiltro.Int(elemento.activo, activo)
                                    && DbFiltro.String(elemento.caracterFinLinea, caracterFinLinea)
                                    && DbFiltro.String(elemento.caracterSeparador, caracterSeparador)
                                    && DbFiltro.Int(elemento.diaCorte, diaCorte)
                                    && DbFiltro.Int(elemento.horaCorte, horaCorte)
                                    && DbFiltro.String(elemento.nombreArchivo, nombreArchivo)
                                    && DbFiltro.String(elemento.nombreDocumento, nombreDocumento)
                                    && DbFiltro.String(elemento.pathURL, pathURL)
                                    && DbFiltro.String(elemento.servicio, servicioCol)

                                 select new
                                 {
                                     elemento.Id,
                                     elemento.idDocumento,
                                     elemento.servicio,
                                     elemento.nombreDocumento,
                                     elemento.nombreArchivo,
                                     elemento.pathURL,
                                     elemento.diaCorte,
                                     elemento.horaCorte,
                                     elemento.caracterSeparador,
                                     elemento.caracterFinLinea,
                                     elemento.activo
                                 };

                foreach (var elemento in catDocCarg)
                {
                    listaParametros.Add(new
                    {
                        Id = elemento.Id,
                        idDocumento = elemento.idDocumento,
                        servicio = elemento.servicio,
                        nombreDocumento = elemento.nombreDocumento,
                        nombreArchivo = elemento.nombreArchivo,
                        pathURL = elemento.pathURL,
                        diaCorte = elemento.diaCorte,
                        horaCorte = elemento.horaCorte,
                        caracterSeparador = elemento.caracterSeparador,
                        caracterFinLinea = elemento.caracterFinLinea,
                        activo = elemento.activo
                    });
                }

                respuesta = new
                {
                    success = true,
                    results = listaParametros.Skip(start).Take(limit).ToList(),
                    total = listaParametros.Count()
                };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message.ToString() };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }


        public JsonResult buscarParametrosCarga(int IdParam)
        {
            object respuesta = null;

            try
            {
                List<object> listaParametro = new List<object>();

                var oParametros = from objParametros in db.parametrosCargaDocumento
                                  where objParametros.Id == IdParam
                                  select new
                                  {
                                      objParametros.Id,
                                      objParametros.idDocumento,
                                      objParametros.servicio,
                                      objParametros.nombreDocumento,
                                      objParametros.nombreArchivo,
                                      objParametros.pathURL,
                                      objParametros.caracterSeparador,
                                      objParametros.caracterFinLinea,
                                      objParametros.diaCorte,
                                      objParametros.horaCorte,
                                      objParametros.activo
                                  };

                respuesta = new { success = true, results = oParametros };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ModificarParametros(int Id, string Id_Documento, string Id_Servicio, string Nombre_Documento, string Nombre_Archivo, string Path_Url, int diaCorte, int horaCorte, string Caracter_Separador, string Caracter_Fin_Linea, int Activo)
        {
            object respuesta = null;
            //Cat_Serv_Legacy servicioLegacy = db.Cat_Serv_Legacy.Where(a => a.Id_Servicio == Id_Servicio && a.Activo == 1).SingleOrDefault();
            parametrosCargaDocumento catDocCarg = db.parametrosCargaDocumento.Where(a => a.servicio == Id_Servicio && a.Id == Id && a.activo == 1).SingleOrDefault();

            if (catDocCarg == null)
            {
                respuesta = Guardar(Id, Id_Documento, Id_Servicio, Nombre_Documento, Nombre_Archivo, Path_Url, diaCorte, horaCorte, Caracter_Separador, Caracter_Fin_Linea, Activo);
            }
            else if (catDocCarg != null && catDocCarg.Id == Id)
            {
                respuesta = Guardar(Id, Id_Documento, Id_Servicio, Nombre_Documento, Nombre_Archivo, Path_Url, diaCorte, horaCorte, Caracter_Separador, Caracter_Fin_Linea, Activo);
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public object Guardar(int Id, string Id_Documento, string Id_Servicio, string Nombre_Documento, string Nombre_Archivo, string Path_Url, int diaCorte, int horaCorte, string Caracter_Separador, string Caracter_Fin_Linea, int Activo)
        {
            object respuesta = null;

            try
            {
                parametrosCargaDocumento oCatDocCarga = db.parametrosCargaDocumento.Where(a => a.Id == Id).SingleOrDefault();

                oCatDocCarga.idDocumento = Id_Documento;
                oCatDocCarga.servicio = Id_Servicio;
                oCatDocCarga.nombreDocumento = Nombre_Documento;
                oCatDocCarga.nombreArchivo = Nombre_Archivo;
                oCatDocCarga.pathURL = Path_Url;
                oCatDocCarga.caracterSeparador = Caracter_Separador;
                oCatDocCarga.caracterFinLinea = Caracter_Fin_Linea;
                oCatDocCarga.diaCorte = diaCorte;
                oCatDocCarga.horaCorte = horaCorte;
                oCatDocCarga.activo = 1;
                Log log = new Log();
                log.insertaBitacoraModificacion(oCatDocCarga, "Id", oCatDocCarga.Id, "parametrosCargaDocumento.html", Request.UserHostAddress);

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

            return respuesta;
        }
    }
}