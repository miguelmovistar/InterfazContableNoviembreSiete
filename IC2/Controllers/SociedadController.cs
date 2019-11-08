using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class SociedadController : Controller
    {
        // GET:// GET: Sociedades
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Sociedades/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Id_Sociedad,
                                                                            string Abreviatura,
                                                                            string Nombre,
                                                                            string Id_SAP,
                                                                            string Sociedad_SAP)
        {
            List<object> listaSociedad = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var sociedad = from elemento in db.Sociedad
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                               && DbFiltro.String(elemento.Id_Sociedad, Id_Sociedad)
                               && DbFiltro.String(elemento.AbreviaturaSociedad, Abreviatura)
                               && DbFiltro.String(elemento.NombreSociedad, Nombre)
                               && DbFiltro.String(elemento.Id_SAP, Id_SAP)
                               && DbFiltro.String(elemento.Sociedad_SAP, Sociedad_SAP)

                               select new
                               {
                                   elemento.Id,
                                   elemento.Id_Sociedad,
                                   elemento.AbreviaturaSociedad,
                                   elemento.NombreSociedad,
                                   elemento.Id_SAP,
                                   elemento.Sociedad_SAP
                               };

                foreach (var elemento in sociedad)
                {
                    listaSociedad.Add(new
                    {
                        Id_Sociedad = elemento.Id_Sociedad,
                        Abreviatura = elemento.AbreviaturaSociedad,
                        Nombre = elemento.NombreSociedad,
                        Id_SAP = elemento.Id_SAP,
                        Sociedad_SAP = elemento.Sociedad_SAP,
                        Id=elemento.Id
                    });
                }
                total = listaSociedad.Count();
                listaSociedad = listaSociedad.Skip(start).Take(limit).ToList();
                respuesta = new { success = true,
                                  results = listaSociedad.Skip(start).Take(limit).ToList(),
                                  total = listaSociedad.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarSociedad(string Abreviatura, string Nombre, string Id_SAP, string Sociedad_SAP, string Id_Sociedad,  int lineaNegocio)
        {
            object respuesta = null;
            
            try
            {
                Sociedad sociedad = db.Sociedad.Where(x => x.Id_Sociedad == Id_Sociedad && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                
                if ( sociedad ==null)
                {
                    var nuevo = new Sociedad();

                    nuevo.AbreviaturaSociedad = Abreviatura;
                    nuevo.NombreSociedad = Nombre;
                    nuevo.Id_SAP = Id_SAP;
                    nuevo.Sociedad_SAP = Sociedad_SAP;
                    nuevo.Id_Sociedad = Id_Sociedad;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.Sociedad.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Sociedad.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", dato=Id_Sociedad};
                }
                
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }


        public JsonResult buscarSociedad(int Id)
        {
            object respuesta = null;

            try
            {

                Sociedad oSociedad = db.Sociedad.Where(x => x.Id == Id).SingleOrDefault();
                respuesta = new { success = true, results = oSociedad };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarSociedad(string strID)
        {
            object respuesta = null;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            int Id = 0;
            strID = strID.TrimEnd(',');
            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                {
                    Id = int.Parse(Ids[i]);

                    string strresp_val = funGralCtrl.ValidaRelacion("Sociedad", Id);

                    if (strresp_val.Length == 0)
                    {
                        Sociedad oSociedad = db.Sociedad.Where(x => x.Id == Id).SingleOrDefault();
                        oSociedad.Activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oSociedad, "Eliminado", "Sociedad.html", Request.UserHostAddress);

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
                respuesta = new { success = false, result = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult modificarSociedad(string Id_Sociedad, string Abreviatura, string Nombre, string Id_SAP, string Sociedad_SAP,  int Id, int lineaNegocio)
        {
            object respuesta = null;

            try
            {
                Sociedad oSociedad = db.Sociedad.Where(x => x.Id == Id && x.Activo ==1 && x.Id_LineaNegocio== lineaNegocio).SingleOrDefault();
               

                if (oSociedad != null)
                {
                    oSociedad.AbreviaturaSociedad = Abreviatura;
                    oSociedad.NombreSociedad = Nombre;
                    oSociedad.Id_SAP = Id_SAP;
                    oSociedad.Sociedad_SAP = Sociedad_SAP;
                    oSociedad.Id_Sociedad = Id_Sociedad;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oSociedad, "Id", oSociedad.Id, "Sociedad.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                    respuesta = new { success = true, results = "no" };
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

            string strresp_val = funGralCtrl.ValidaRelacion("Sociedad", Id);

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