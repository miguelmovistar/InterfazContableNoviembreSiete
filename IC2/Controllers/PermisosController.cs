using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PermisosController : Controller
    {
        // GET: Permisos
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

        public JsonResult llenaGrid(int start, int limit, string NombrePerfil, string Etiqueta, string CanRead, string CanNew, string CanEdit, string CanDelete, string WriteLog)
        {

            object respuesta = null;

            try
            {
                List<object> lista = new List<object>();
                var consulta = from per in db.Perfil
                               join perm in db.permisos on per.Id equals perm.ID_Perfil
                               join men in db.MenuIC on perm.IDMenu equals men.Id
                               where perm.Activo == true && men.Activo == true && per.Activo == true
                               && DbFiltro.String(per.Nombre, NombrePerfil)
                               && DbFiltro.String(men.Etiqueta, Etiqueta)
                               && DbFiltro.Int(perm.CanRead, CanRead != string.Empty ? (CanRead.ToUpper() == "SI" ? "1" : "0") : "")
                               && DbFiltro.Int(perm.CanNew, CanNew != string.Empty ? (CanNew.ToUpper() == "SI" ? "1" : "0") : "")
                               && DbFiltro.Int(perm.CanEdit, CanEdit != string.Empty ? (CanEdit.ToUpper() == "SI" ? "1" : "0") : "")
                               && DbFiltro.Int(perm.CanDelete, CanDelete != string.Empty ? (CanDelete.ToUpper() == "SI" ? "1" : "0") : "")
                               && DbFiltro.Int(perm.WriteLog, WriteLog != string.Empty ? (WriteLog.ToUpper() == "SI" ? "1" : "0") : "")
                               select new
                               {
                                   perm.Id,
                                   per.Nombre,
                                   men.Descripcion,
                                   IdMenu = perm.IDMenu,
                                   perm.CanRead,
                                   perm.CanNew,
                                   perm.CanEdit,
                                   perm.CanDelete,
                                   perm.WriteLog,
                                   IdPerfil = per.Id
                               };
                foreach (var item in consulta)
                {
                    lista.Add(new
                    {
                        Id = item.Id,
                        IdPerfil = item.IdPerfil,
                        IdMenu = item.IdMenu,
                        NombrePerfil = item.Nombre,
                        Etiqueta = item.Descripcion,
                        CanRead = (item.CanRead == 1 ? "Si" : "No"),
                        CanNew = (item.CanNew == 1 ? "Si" : "No"),
                        CanEdit = (item.CanEdit == 1 ? "Si" : "No"),
                        CanDelete = (item.CanDelete == 1 ? "Si" : "No"),
                        WriteLog = (item.WriteLog == 1 ? "Si" : "No")

                    });

                }

                respuesta = new
                {
                    success = true,
                    results = lista.Skip(start).Take(limit).ToList(),
                    total = lista.Count
                };




            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }


            return Json(respuesta, JsonRequestBehavior.AllowGet);



        }



        public JsonResult buscarPermiso(int Id)
        {

            object respuesta = null;

            try
            {
                List<object> lista = new List<object>();
                var consulta = (from per in db.Perfil
                                join perm in db.permisos on per.Id equals perm.ID_Perfil
                                join men in db.MenuIC on perm.IDMenu equals men.Id
                                where perm.Activo == true && men.Activo == true && per.Activo == true
                                && perm.Id == Id
                                select new
                                {
                                    perm.Id,
                                    per.Nombre,
                                    men.Etiqueta,
                                    IdMenu = men.Id,
                                    perm.CanRead,
                                    perm.CanNew,
                                    perm.CanEdit,
                                    perm.CanDelete,
                                    perm.WriteLog,
                                    IdPerfil = per.Id
                                });
                foreach (var item in consulta)
                {
                    lista.Add(new
                    {
                        Id = item.Id,
                        IdPerfil = item.IdPerfil,
                        IdMenu = item.IdMenu,
                        NombrePerfil = item.Nombre,
                        Etiqueta = item.Etiqueta,
                        CanRead = (item.CanRead == 1 ? "Si" : "No"),
                        CanNew = (item.CanNew == 1 ? "Si" : "No"),
                        CanEdit = (item.CanEdit == 1 ? "Si" : "No"),
                        CanDelete = (item.CanDelete == 1 ? "Si" : "No"),
                        WriteLog = (item.WriteLog == 1 ? "Si" : "No")

                    });

                }

                respuesta = new { success = true, results = lista[0] };



            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }


            return Json(respuesta, JsonRequestBehavior.AllowGet);



        }




        public JsonResult registra(int idMenu, int idPerfil, string CanRead, string CanNew, string CanEdit, string CanDelete, string CanLog)
        {


            object respuesta = null;
            try
            {
                permisos nuevo = new permisos();
                nuevo.IDMenu = idMenu;
                nuevo.ID_Perfil = idPerfil;
                nuevo.CanRead = Convert.ToInt32(CanRead);
                nuevo.CanNew = Convert.ToInt32(CanNew);
                nuevo.CanEdit = Convert.ToInt32(CanEdit);
                nuevo.CanDelete = Convert.ToInt32(CanDelete);
                nuevo.WriteLog = Convert.ToInt32(CanLog);
                nuevo.CreateDate = DateTime.Now;
                nuevo.ModifiedDate = DateTime.Now;
                nuevo.UserModify = Session["userName"].ToString();
                nuevo.Activo = true;
                db.permisos.Add(nuevo);
                db.SaveChanges();


                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "permisos.html", Request.UserHostAddress);
                registraPadre(idMenu, idPerfil);
                respuesta = new { success = true, results = "ok" };
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

            string strresp_val = funGralCtrl.ValidaRelacion("permisos", Id);

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


        public JsonResult borrar(string strID)
        {


            int Id = 0;
            strID = strID.TrimEnd(',');
            object respuesta = null;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;

            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                {
                    Id = int.Parse(Ids[i]);

                    string strresp_val = funGralCtrl.ValidaRelacion("permisos", Id);

                    if (strresp_val.Length == 0)
                    {
                        permisos oPer = db.permisos.Where(a => a.Id == Id).SingleOrDefault();
                        oPer.Activo = false;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oPer, "Eliminado", "permisos.html", Request.UserHostAddress);

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
                respuesta = new { success = false, results = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);


        }


        public JsonResult modifica(int id, int idMenu, int idPerfil, string CanRead, string CanNew, string CanEdit, string CanDelete, string CanLog)
        {
            object respuesta = null;
            try
            {
                permisos oPer = db.permisos.Where(a => a.Id == id).SingleOrDefault();
                oPer.IDMenu = idMenu;
                oPer.ID_Perfil = idPerfil;
                oPer.CanRead = Convert.ToInt32(CanRead.ToUpper() == "SI" ? "1" : "0");
                oPer.CanNew = Convert.ToInt32(CanNew.ToUpper() == "SI" ? "1" : "0");
                oPer.CanEdit = Convert.ToInt32(CanEdit.ToUpper() == "SI" ? "1" : "0");
                oPer.CanDelete = Convert.ToInt32(CanDelete.ToUpper() == "SI" ? "1" : "0");
                oPer.WriteLog = Convert.ToInt32(CanLog.ToUpper() == "SI" ? "1" : "0");
                oPer.ModifiedDate = DateTime.Now;
                oPer.UserModify = Session["userName"].ToString();

                Log log = new Log();
                log.insertaBitacoraModificacion(oPer, "Id", oPer.Id, "permisos.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }


        public JsonResult llenaPerfil(int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var consulta = from oPer in db.Perfil
                               where oPer.Activo == true
                               select new
                               {
                                   oPer.Id,
                                   oPer.Nombre
                               };

                foreach (var item in consulta)
                {
                    lista.Add(new
                    {

                        Id = item.Id,
                        Nombre = item.Nombre
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

        public JsonResult llenaNombreMenu(int start, int limit)
        {

            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var consulta = from oMenu in db.MenuIC
                               where oMenu.Activo == true && oMenu.IdPadre != null
                               select new
                               {
                                   oMenu.Id,
                                   oMenu.Descripcion

                               };

                foreach (var item in consulta)
                {
                    lista.Add(new
                    {
                        Id = item.Id,
                        Etiqueta = item.Descripcion
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

        public void registraPadre(int idMenu, int IdPerfil)
        {

            var consultaMenu = db.MenuIC.Where(a => a.Id == idMenu && a.Activo == true).SingleOrDefault();
            if (consultaMenu.IdPadre != null)
            {
                var consultaPermiso = db.permisos.Where(a => a.IDMenu == consultaMenu.IdPadre && a.Activo == true && a.ID_Perfil == IdPerfil).SingleOrDefault();


                if (consultaPermiso == null)
                {
                    permisos nuevo = new permisos();
                    nuevo.IDMenu = Convert.ToInt32(consultaMenu.IdPadre);
                    nuevo.ID_Perfil = IdPerfil;
                    nuevo.CanRead = 0;
                    nuevo.CanNew = 0;
                    nuevo.CanEdit = 0;
                    nuevo.CanDelete = 0;
                    nuevo.WriteLog = 0;
                    nuevo.CreateDate = DateTime.Now;
                    nuevo.ModifiedDate = DateTime.Now;
                    nuevo.UserModify = Session["userName"].ToString();
                    nuevo.Activo = true;
                    db.permisos.Add(nuevo);
                    db.SaveChanges();
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "permisos.html", Request.UserHostAddress);
                    registraPadre(Convert.ToInt32(consultaMenu.IdPadre), IdPerfil);
                }

            }
            else
            {
                var consultaPermiso = db.permisos.Where(a => a.IDMenu == consultaMenu.Id && a.Activo == true && a.ID_Perfil == IdPerfil).SingleOrDefault();
                if (consultaPermiso == null)
                {
                    permisos nuevo = new permisos();
                    nuevo.IDMenu = consultaMenu.Id;
                    nuevo.ID_Perfil = IdPerfil;
                    nuevo.CanRead = 0;
                    nuevo.CanNew = 0;
                    nuevo.CanEdit = 0;
                    nuevo.CanDelete = 0;
                    nuevo.WriteLog = 0;
                    nuevo.CreateDate = DateTime.Now;
                    nuevo.ModifiedDate = DateTime.Now;
                    nuevo.UserModify = Session["userName"].ToString();
                    nuevo.Activo = true;
                    db.permisos.Add(nuevo);
                    db.SaveChanges();
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "permisos.html", Request.UserHostAddress);
                }

            }







        }


        public JsonResult permisoControlador(int start, int limit, string nombreControlador)
        {
            object respuesta = null;
            //int idPerfil = (int)Session["IdPerfil"];
            int idPerfil = 1;
            List<object> permisos = new List<object>();


            try
            {
                var consulta = (from per in db.permisos
                                join men in db.MenuIC on per.IDMenu equals men.Id
                                where men.Controlador == nombreControlador && per.ID_Perfil == idPerfil
                                select new
                                {
                                    per.CanRead,
                                    per.CanNew,
                                    per.CanEdit,
                                    per.CanDelete,
                                    per.WriteLog
                                }).FirstOrDefault();


                respuesta = new { success = true, results = permisos, total = 1, CanRead = consulta.CanRead, CanNew = consulta.CanNew, CanEdit = consulta.CanEdit, CanDelete = consulta.CanDelete, WriteLog = consulta.WriteLog };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message + " " + ex.StackTrace };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);



        }



    }
}