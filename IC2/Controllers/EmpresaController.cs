using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class EmpresaController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Empresa/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult llenaGrid(int lineaNegocio,int start, int limit, string Empresa_Id,
                                                                           string Abreviatura,
                                                                           string Nombre)
        {
            List<object> listaEmpresa = new List<object>();
            object respuesta = null;
            int total;
            try
            {

                var empresa = from elemento in db.EmpresaIC
                              where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                                && DbFiltro.String(elemento.Id_Empresa, Empresa_Id)
                                && DbFiltro.String(elemento.Abreviatura, Abreviatura)
                                && DbFiltro.String(elemento.Nombre_Empresa, Nombre)

                              select new
                              {
                                  elemento.Id_Empresa,
                                  elemento.Id,
                                  elemento.Abreviatura,
                                  elemento.Nombre_Empresa
                                  
                              };

                foreach (var elemento in empresa)
                {
                    listaEmpresa.Add(new
                    {
                        Empresa_Id = elemento.Id_Empresa,
                        id_control = elemento.Id,
                        Abreviatura = elemento.Abreviatura,
                        Nombre = elemento.Nombre_Empresa

                    });
                }
                total = listaEmpresa.Count();
                listaEmpresa = listaEmpresa.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = listaEmpresa, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarEmpresa(string Empresa_Id, string Abreviatura, string Nombre, int lineaNegocio)
        {
            object respuesta = null;
            try
            {

                //Aquí busca el id que estás agregando
                EmpresaIC oEmpresa = db.EmpresaIC.Where(x => x.Id_Empresa == Empresa_Id && x.Activo == 1).SingleOrDefault();
                //valida si existe ese id, si la respuesta es nula te deja agregarlo
                if (oEmpresa == null)
                {

                    var nuevo = new EmpresaIC();
                    nuevo.Id_Empresa = Empresa_Id;
                    nuevo.Abreviatura = Abreviatura;
                    nuevo.Nombre_Empresa = Nombre;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.EmpresaIC.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "EmpresaIC.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                // si no es nulo, quiere decir que ya existe ese folio y no lo agrega
                else
                {
                    respuesta = new { success = true, results = "no", dato=Empresa_Id };
                }
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, result = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarEmpresa(string Empresa_Id)
        {
            object respuesta = null;

            try
            {
               
             EmpresaIC oEmpresa=  db.EmpresaIC.Where(a => a.Id_Empresa== Empresa_Id && a.Activo==1).SingleOrDefault();
                if (oEmpresa != null)
                    respuesta = new { success = true, results = oEmpresa };
                else
                    respuesta = new { success = true, result = "vacio" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarEmpresa(string strID)
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

                        string strresp_val = funGralCtrl.ValidaRelacion("EmpresaIC", Id);

                        if (strresp_val.Length == 0)
                        {
                            EmpresaIC oEmpresa = db.EmpresaIC.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();
                            oEmpresa.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oEmpresa, "Eliminado", "EmpresaIC.html", Request.UserHostAddress);

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

        public JsonResult modificarEmpresa(int id_control, string Abreviatura, string Nombre)
        {
            object respuesta = null;

            try
            {
                EmpresaIC oEmpresa = db.EmpresaIC.Where(a => a.Id == id_control).SingleOrDefault();
                oEmpresa.Abreviatura = Abreviatura;
                oEmpresa.Nombre_Empresa = Nombre;
                Log log = new Log();
                log.insertaBitacoraModificacion(oEmpresa, "Id", oEmpresa.Id, "EmpresaIC.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = oEmpresa };
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

            string strresp_val = funGralCtrl.ValidaRelacion("EmpresaIC", Id);

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