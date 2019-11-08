using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;


namespace IC2.Controllers
{
    public class OperadorController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        //
        // GET: /Operador/
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Id_Operador,
                                                                            string Nombre,
                                                                            string Razon_Social,
                                                                            string DescripcionGrupo,
                                                                            string Acreedor,
                                                                            string Deudor,
                                                                            string RFC,
                                                                            string NombreSociedad,
                                                                            string Sociedad_GL,
                                                                            string Tipo_Operador)
        {
            List<object> listaOperador = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var operador = from elemento in db.Operador
                               join grupo in db.Grupo
                               .Where(x=>x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio)
                               on elemento.Id_Grupo  equals grupo.Id into lGrupo
                               from leftGrupo in  lGrupo.DefaultIfEmpty()
                               join deudor in db.Deudor
                                 .Where(x => x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio)
                               on elemento.Id_Deudor equals deudor.Id into lDeudor
                               from leftDeudor in lDeudor.DefaultIfEmpty()
                               join acreedor in db.Acreedor
                                 .Where(x => x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio)
                               on elemento.Id_Acreedor equals acreedor.Id into lAcreedor
                               from leftAcreedor in lAcreedor.DefaultIfEmpty()
                               join sociedad in db.Sociedad 
                               on elemento.Id_Sociedad equals sociedad.Id
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                               && DbFiltro.String(elemento.Id_Operador, Id_Operador)
                               && DbFiltro.String(elemento.Nombre, Nombre)
                               && DbFiltro.String(elemento.Razon_Social, Razon_Social)
                               && DbFiltro.String(leftGrupo.DescripcionGrupo, DescripcionGrupo)
                               && DbFiltro.String(leftAcreedor.Acreedor1, Acreedor)
                               && DbFiltro.String(leftDeudor.Deudor1, Deudor)
                               && DbFiltro.String(elemento.RFC, RFC)
                               && DbFiltro.String(sociedad.NombreSociedad, NombreSociedad)
                               && DbFiltro.String(elemento.Sociedad_GL, Sociedad_GL)
                               && DbFiltro.String(elemento.Tipo_Operador, Tipo_Operador)

                               select new
                               {
                                   elemento.Id,
                                   elemento.Id_Operador,
                                   elemento.Nombre,
                                   elemento.Razon_Social,
                                   elemento.Id_Grupo,
                                   elemento.Id_Deudor,
                                   elemento.Id_Acreedor,
                                   elemento.Id_Sociedad,
                                   leftGrupo.Grupo1,
                                   leftGrupo.DescripcionGrupo,
                                   leftDeudor.Deudor1,
                                   leftDeudor.NombreDeudor,
                                   leftAcreedor.Acreedor1,
                                   leftAcreedor.NombreAcreedor,
                                   sociedad.NombreSociedad,
                                   elemento.RFC,
                                   elemento.Sociedad_GL,
                                   elemento.Tipo_Operador

                               };

                foreach (var elemento in operador)
                {
                    listaOperador.Add(new
                    {
                        Id_Operador = elemento.Id_Operador,
                        Id = elemento.Id,
                        Nombre = elemento.Nombre,
                        Razon_Social = elemento.Razon_Social,
                        Id_Grupo =(elemento.Grupo1!=null && elemento.Grupo1!="")? elemento.Id_Grupo:null,
                        Grupo = elemento.Grupo1,
                        Deudor = elemento.Deudor1,
                        NombreDeudor = elemento.NombreDeudor,
                        NombreAcreedor = elemento.NombreAcreedor,
                        Id_Deudor =(elemento.Deudor1!=null && elemento.Deudor1!="")? elemento.Id_Deudor:null,
                        Acreedor = elemento.Acreedor1,
                        Id_Acreedor =(elemento.Acreedor1!=null && elemento.Acreedor1!="")? elemento.Id_Acreedor:null,
                        Id_Sociedad = elemento.Id_Sociedad,
                        RFC = elemento.RFC,
                        Sociedad_GL = elemento.Sociedad_GL,
                        Tipo_Operador = elemento.Tipo_Operador,
                        DescripcionGrupo = elemento.DescripcionGrupo,
                        NombreSociedad = elemento.NombreSociedad
                    });
                }
                total = listaOperador.Count();
                listaOperador = listaOperador.Skip(start).Take(limit).ToList();
                respuesta = new { success = true,
                                  results = listaOperador.Skip(start).Take(limit).ToList(),
                                  total = listaOperador.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarOperador(string Nombre, string Razon_Social, int? Id_Grupo, int? Id_Acreedor, int ? Id_Deudor, string RFC, int Id_Sociedad, string  Sociedad_GL, string Tipo_Operador, string Id_Operador, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                string noEncontrados = "";
               // int? idtrafico;
                var nuevo = new Operador();
                Operador operador = db.Operador.Where(x => x.Id_Operador == Id_Operador && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                
                if (operador != null)
                    noEncontrados = noEncontrados + "Operador: " + Id_Operador;
             
                  
                if (operador ==null)
                {
                    nuevo.Nombre = Nombre;
                    nuevo.Razon_Social = Razon_Social;
                    nuevo.Id_Grupo = Id_Grupo;
                    nuevo.Id_Acreedor = Id_Acreedor;
                    nuevo.Id_Deudor = Id_Deudor;
                    if (RFC != null && RFC != "")
                        nuevo.RFC = RFC;
                    else
                        nuevo.RFC = "XAXX010101000";
                    nuevo.Id_Sociedad = Id_Sociedad;
                    nuevo.Sociedad_GL = Sociedad_GL;
                    nuevo.Tipo_Operador =(Sociedad_GL==null || Sociedad_GL=="" || Sociedad_GL=="9999")?"TERCERO": "INTERCO";
                    nuevo.Id_Operador = Id_Operador;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.Operador.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Operador.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                    respuesta = new { success = true, results = "no", dato = noEncontrados.TrimEnd(',') };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult buscarOperador(string Id_Operador)
        {
            object respuesta = null;

            try
            {

                var operador = db.Operador.Where(x => x.Id_Operador == Id_Operador);
                List<object> lista = new List<object>();

                foreach (var elemento in operador)
                {
                    lista.Add(new
                    {
                        Nombre = elemento.Nombre,
                        Razon_Social = elemento.Razon_Social,
                        Id_Grupo = elemento.Id_Grupo,
                        RFC = elemento.RFC,
                        Sociedad_GL = elemento.Sociedad_GL,
                        Tipo_Operador = elemento.Tipo_Operador,
                        Id_Operador = elemento.Id_Operador

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

        public JsonResult modificarOperador(string Id_Operador, string Nombre, string Razon_Social, int? Id_Grupo, int? Id_Acreedor,int? Id_Deudor, string RFC, int Id_Sociedad, string Sociedad_GL,  int lineaNegocio)
        {
            object respuesta = null;

            try
            {

                Operador oOperador = db.Operador.Where(a => a.Id_Operador == Id_Operador).SingleOrDefault();

                oOperador.Nombre = Nombre;
                oOperador.Razon_Social = Razon_Social;
                oOperador.Id_Grupo = Id_Grupo;
                oOperador.Id_Acreedor = Id_Acreedor;
                oOperador.Id_Deudor = Id_Deudor;
                if (RFC != null && RFC != "")
                    oOperador.RFC = RFC;
                else
                    oOperador.RFC = "XAXX010101000";
                oOperador.Id_Sociedad = Id_Sociedad;
                oOperador.Sociedad_GL = Sociedad_GL;
                oOperador.Tipo_Operador = (Sociedad_GL == null || Sociedad_GL == "" || Sociedad_GL == "9999") ? "TERCERO" : "INTERCO";
                //oOperador.Tipo_Operador = Tipo_Operador;
                Log log = new Log();
                log.insertaBitacoraModificacion(oOperador, "Id", oOperador.Id, "Operador.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarOperador(string strID)
        {
            object respuesta = null;
            int Id = 0;
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            strID = strID.TrimEnd(',');
            try
            {
                string[] ids = strID.Split(',');
                for (int i = 0; i < ids.Length; i++)
                {
                    if (ids[i].Length != 0)
                    {
                        Id = int.Parse(ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Operador", Id);

                        if (strresp_val.Length == 0)
                        {
                            Operador oOperador = db.Operador.Where(a => a.Id == Id).SingleOrDefault();
                            oOperador.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oOperador, "Eliminado", "Operador.html", Request.UserHostAddress);

                            db.SaveChanges();
                        }
                        else
                        {
                            strmsg = "El(Los) " + ids.Length.ToString() + " registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) " + strSalto;
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

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Operador", Id);

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
        public JsonResult llenaGrupo(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<Grupo> lista = new List<Grupo>();
                var grupo = from oGrupo in db.Grupo
                            where oGrupo.Activo == 1 && oGrupo.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oGrupo.Grupo1,
                                oGrupo.Id,
                                oGrupo.DescripcionGrupo
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new Grupo
                    {
                        Id = elemento.Id,
                        Grupo1 = elemento.Grupo1,
                        DescripcionGrupo = elemento.DescripcionGrupo
                    });
                }
                total = lista.Count();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaAcreedor(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var acreedor = from oAcreedor in db.Acreedor
                              where oAcreedor.Activo == 1 && oAcreedor.Id_LineaNegocio == lineaNegocio
                              select new
                              {
                                  oAcreedor.Id,
                                  oAcreedor.Acreedor1,
                                  oAcreedor.NombreAcreedor
                              };
                foreach (var elemento in acreedor)
                {
                    lista.Add(new 
                    {
                        Id = elemento.Id,
                        Acreedor = elemento.Acreedor1,
                        NombreAcreedor = elemento.NombreAcreedor
                    });
                }
                total = lista.Count();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaDeudor(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var deudor = from oDeudor in db.Deudor
                               where oDeudor.Activo == 1 && oDeudor.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oDeudor.Id,
                                   oDeudor.Deudor1,
                                   oDeudor.NombreDeudor
                               };
                foreach (var elemento in deudor)
                {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Deudor = elemento.Deudor1,
                        NombreDeudor = elemento.NombreDeudor
                    });
                }
                total = lista.Count();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaSociedad(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<Sociedad> lista = new List<Sociedad>();
                var sociedad = from oSociedad in db.Sociedad
                               where oSociedad.Activo == 1 && oSociedad.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oSociedad.Id,
                                   oSociedad.Id_Sociedad,
                                   oSociedad.NombreSociedad
                               };
                foreach (var elemento in sociedad)
                {
                    lista.Add(new Sociedad
                    {
                        Id = elemento.Id,
                        Id_Sociedad = elemento.Id_Sociedad,
                        NombreSociedad = elemento.NombreSociedad
                    });
                }
                total = lista.Count();
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