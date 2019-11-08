using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;
using System.IO;

namespace IC2.Controllers
{
    public class CatUsuariosController : Controller
    {

        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();

        // GET: CatUsuarios
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }


        public JsonResult llenaGrid(int start, int limit, string id, string IdUsuario, string Nombres, string ApellidoPaterno, string ApellidoMaterno,
            string NPerfil, string NLinea, string FechaCreacion, string FechaModificacion, string paginaInicio)
        {
            List<object> lstUsuarios = new List<object>();
            object respuesta = null;
            try
            {

                var usuario = from usu in db.usuarios
                              join per in db.Perfil on usu.IdPerfil equals per.Id
                              join cat in db.cat_TipoLinea on usu.IdLineaNegocio equals cat.Id
                              join men in db.MenuIC on usu.PaginaInicio equals men.Id
                              where per.Activo == true && usu.Activo == true
                              && DbFiltro.Int(usu.Id, id)
                              && DbFiltro.String(usu.IdUsuario, IdUsuario)
                              && DbFiltro.String(usu.Nombre, Nombres)
                              && DbFiltro.String(usu.APaterno, ApellidoPaterno)
                              && DbFiltro.String(usu.AMaterno, ApellidoMaterno)
                              && DbFiltro.String(per.Nombre, NPerfil)
                              && DbFiltro.String(cat.nombre, NLinea)
                              && DbFiltro.Date(usu.FechaCreacion, FechaCreacion, null)
                              && DbFiltro.Date(usu.FechaModificacion, FechaModificacion, null)
                              && DbFiltro.String(men.Descripcion, paginaInicio)
                              select new
                              {
                                  usu.Id,
                                  usu.IdUsuario,
                                  usu.Nombre,
                                  usu.APaterno,
                                  usu.AMaterno,
                                  NombrePerfil = per.Nombre,
                                  IdPerfil = per.Id,
                                  NombreLinea = cat.nombre,
                                  IdRegLinea = cat.Id,
                                  usu.FechaCreacion,
                                  usu.FechaModificacion,
                                  men.Descripcion,
                                  IdMenu = men.Id
                              };

                foreach (var elemento in usuario)
                {

                    lstUsuarios.Add(new
                    {
                        Id = elemento.Id,
                        IdUsuario = elemento.IdUsuario,
                        Nombres = elemento.Nombre,
                        ApellidoPaterno = elemento.APaterno,
                        ApellidoMaterno = elemento.AMaterno,
                        NPerfil = elemento.NombrePerfil,
                        IdPerfil = elemento.IdPerfil,
                        NLinea = elemento.NombreLinea,
                        IdRegLinea = elemento.IdRegLinea,
                        FechaCreacion = elemento.FechaCreacion.ToString("dd-MM-yyyy"),
                        FechaModificacion = elemento.FechaModificacion.ToString("dd-MM-yyyy"),
                        paginaInicio = elemento.Descripcion,
                        IdMenu = elemento.IdMenu
                    });
                }


                respuesta = new
                {
                    success = true,
                    results = lstUsuarios.Skip(start).Take(limit).ToList(),
                    total = lstUsuarios.Count
                };


            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public void exportar()
        {

            try
            {
                StringWriter sw = new StringWriter();
                sw.WriteLine("\"Id\",\"IdUsuario\",\"Nombre\",\"Apellido_Paterno\",\"Apellido_Materno\",\"Perfil\",\"Linea\",\"Fecha_Creacion\",\"Fecha_Modificacion\"");

                Response.ClearContent();
                Response.AddHeader("content-disposition", "attachment;filename=ListadoUsuarios.csv");
                Response.ContentType = "text/csv";

                var usuario = from usu in db.usuarios
                              join per in db.Perfil on usu.IdPerfil equals per.Id
                              join cat in db.cat_TipoLinea on usu.IdLineaNegocio equals cat.Id
                              where per.Activo == true && usu.Activo == true
                              select new
                              {
                                  usu.Id,
                                  usu.IdUsuario,
                                  usu.Nombre,
                                  usu.APaterno,
                                  usu.AMaterno,
                                  NombrePerfil = per.Nombre,
                                  NombreLinea = cat.nombre,
                                  usu.FechaCreacion,
                                  usu.FechaModificacion,

                              };

                foreach (var elemento in usuario)
                {


                    sw.WriteLine(string.Format("\"{0}\",\"{1}\",\"{2}\",\"{3}\",\"{4}\",\"{5}\",\"{6}\",\"{7}\",\"{8}\"",
           elemento.Id,
           elemento.IdUsuario.Replace("\r\n", string.Empty),
           elemento.Nombre.Replace("\r\n", string.Empty),
           elemento.APaterno.Replace("\r\n", string.Empty),
           elemento.AMaterno.Replace("\r\n", string.Empty),
           elemento.NombrePerfil.Replace("\r\n", string.Empty),
           elemento.NombreLinea.Replace("\r\n", string.Empty),
           elemento.FechaCreacion.ToString("dd-MM-yyyy h:mm tt").Replace("\r\n", string.Empty),
           elemento.FechaModificacion.ToString("dd-MM-yyyy h:mm tt").Replace("\r\n", string.Empty)
           ));

                }
                Response.Write(sw.ToString());
                Response.End();

            }
            catch (Exception ex)
            {
                throw ex;
            }



        }


        public JsonResult buscarUsuario(int Id)
        {
            object respuesta = null;

            try
            {
                List<object> lstUsuarios = new List<object>();

                var usuario = (from usu in db.usuarios
                               join per in db.Perfil on usu.IdPerfil equals per.Id
                               join cat in db.cat_TipoLinea on usu.IdLineaNegocio equals cat.Id
                               where per.Activo == true && usu.Activo == true
                               && usu.Id == Id
                               select new
                               {
                                   usu.Id,
                                   usu.IdUsuario,
                                   usu.Nombre,
                                   usu.APaterno,
                                   usu.AMaterno,
                                   IdPerfil = per.Id,
                                   NombrePerfil = per.Nombre,
                                   IdRegLinea = cat.Id,
                                   NombreLinea = cat.nombre,
                                   usu.FechaCreacion,
                                   usu.FechaModificacion,

                               });
                foreach (var item in usuario)
                {
                    lstUsuarios.Add(new
                    {
                        Id = item.Id,
                        IdUsuario = item.IdUsuario,
                        Nombres = item.Nombre,
                        ApellidoPaterno = item.APaterno,
                        ApellidoMaterno = item.AMaterno,
                        IdPerfil = item.IdPerfil,
                        NPerfil = item.NombrePerfil,
                        IdRegLinea = item.IdRegLinea,
                        NLinea = item.NombreLinea,
                        FechaCreacion = item.FechaCreacion,
                        FechaModificacion = item.FechaModificacion

                    });
                }



                respuesta = new { success = true, results = lstUsuarios[0] };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }



        public JsonResult modifica(int id, string idUsuario, string nombres, string aPaterno, string aMaterno, int idPerfil, int idLinea, int IdMenu)
        {
            object respuesta = null;
            try
            {
                usuarios oUsu = db.usuarios.Where(a => a.Id == id).SingleOrDefault();
                oUsu.IdUsuario = idUsuario;
                oUsu.Nombre = nombres;
                oUsu.APaterno = aPaterno;
                oUsu.AMaterno = aMaterno;
                oUsu.IdPerfil = idPerfil;
                oUsu.IdLineaNegocio = idLinea;
                oUsu.PaginaInicio = IdMenu;
                oUsu.FechaModificacion = DateTime.Now;
                Log log = new Log();
                log.insertaBitacoraModificacion(oUsu, "Id", oUsu.Id, "usuarios.html", Request.UserHostAddress);

                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }

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

                    string strresp_val = funGralCtrl.ValidaRelacion("usuarios", Id);

                    if (strresp_val.Length == 0)
                    {
                        usuarios oUsu = db.usuarios.Where(a => a.Id == Id).SingleOrDefault();
                        oUsu.Activo = false;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oUsu, "Eliminado", "usuarios.html", Request.UserHostAddress);

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



        public JsonResult registra(string idUsuario, string nombres, string aPaterno, string aMaterno, int idPerfil, int idLinea, int idMenu)
        {
            object respuesta = null;

            try
            {
                var nuevo = new usuarios();
                nuevo.IdUsuario = idUsuario;
                nuevo.Nombre = nombres;
                nuevo.APaterno = aPaterno;
                nuevo.AMaterno = aMaterno;
                nuevo.IdPerfil = idPerfil;
                nuevo.IdLineaNegocio = idLinea;
                nuevo.PaginaInicio = idMenu;
                nuevo.FechaCreacion = DateTime.Now;
                nuevo.FechaModificacion = DateTime.Now;
                nuevo.Activo = true;
                db.usuarios.Add(nuevo);
                db.SaveChanges();
                respuesta = new { success = true, results = "ok" };

                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "usuarios.html", Request.UserHostAddress);



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

            string strresp_val = funGralCtrl.ValidaRelacion("usuarios", Id);

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


        public JsonResult llenaLineaNegocio(int start, int limit)
        {

            object respuesta = null;
            int total;
            try
            {

                List<cat_TipoLinea> lista = new List<cat_TipoLinea>();
                var consulta = from oCat in db.cat_TipoLinea
                               select new
                               {
                                   oCat.Id,
                                   oCat.idLinea,
                                   oCat.nombre
                               };

                foreach (var item in consulta)
                {
                    lista.Add(new cat_TipoLinea
                    {
                        Id = item.Id,
                        idLinea = item.idLinea,
                        nombre = item.nombre

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



        public JsonResult obtieneMenu(int start, int limit)
        {
            object respuesta = null;
            int total;
            List<object> lista = new List<object>();
            try
            {

                var consulta = from men in db.MenuIC
                               where men.Activo == true && men.IdPadre != null
                               select new
                               {
                                   men.Id,
                                   men.Descripcion
                               };

                foreach (var item in consulta)
                {
                    lista.Add(new
                    {
                        IdMenu = item.Id,
                        paginaInicio = item.Descripcion
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



    }
}