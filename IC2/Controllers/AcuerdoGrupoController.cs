/* Nombre: AcuerdoGrupoController.cs
*Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
*Fecha: 06/ene/2018 
*Descripcion: Catalogo de Acuerdos Grupo
*Ultima Fecha de modificación: -
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class AcuerdoGrupoController : Controller
    {
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

        public JsonResult llenaGrid(int lineaNegocio,int start, int limit, string Id_Acuerdo,
                                                                           string Nombre,
                                                                           string Grupo)
        {
            List<object> listaAcuerdoGrupo = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var acuerdoGrupo = from oacuerdoGrupo in db.Acuerdo_Grupo
                                 join grupo in db.Grupo
                                 on oacuerdoGrupo.Id_Grupo equals grupo.Id
                                 join acuerdoTarifa in db.AcuerdoTarifa
                                 on oacuerdoGrupo.Id_Acuerdo equals acuerdoTarifa.IdAcuerdo
                                 join operador in db.Operador
                                 on oacuerdoGrupo.Id_Operador equals operador.Id
                                 where oacuerdoGrupo.Activo == 1 && oacuerdoGrupo.Id_LineaNegocio == lineaNegocio
                                 && acuerdoTarifa.Activo == 1 && acuerdoTarifa.Id_LineaNegocio == lineaNegocio
                                 && grupo.Activo == 1 && grupo.Id_LineaNegocio == lineaNegocio
                                 && operador.Activo ==1 && operador.Id_LineaNegocio == lineaNegocio

                                 && DbFiltro.String(acuerdoTarifa.Id_Acuerdo, Id_Acuerdo)
                                 && DbFiltro.String(operador.Nombre, Nombre)
                                 && DbFiltro.String(grupo.Grupo1, Grupo)

                                   select new
                                 {
                                     oacuerdoGrupo.Id,
                                     acuerdoTarifa.IdAcuerdo,
                                     acuerdoTarifa.Id_Acuerdo,
                                     operador.Nombre,
                                     grupo.Grupo1,
                                     grupo.DescripcionGrupo,
                                     oacuerdoGrupo.Id_Operador,
                                     oacuerdoGrupo.Id_Grupo
                                 };

                foreach (var elemento in acuerdoGrupo)
                {
                    listaAcuerdoGrupo.Add(new
                    {
                        Id = elemento.Id,
                        Id_Acuerdo = elemento.Id_Acuerdo,
                        IdAcuerdo=elemento.IdAcuerdo,
                        Id_Operador = elemento.Id_Operador,
                        Nombre = elemento.Nombre,
                        Grupo = elemento.DescripcionGrupo,
                        Id_Grupo = elemento.Id_Grupo
                    });
                }
                total = listaAcuerdoGrupo.Count();
                listaAcuerdoGrupo = listaAcuerdoGrupo.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = listaAcuerdoGrupo, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult agregarAcuerdoGrupo(int Id_Acuerdo,  int Id_Grupo, int lineaNegocio, int Id_Operador)
        {
            Acuerdo_Grupo acuedroGrupo = db.Acuerdo_Grupo.Where( x => x.Id_Acuerdo == Id_Acuerdo && x.Id_Grupo == Id_Grupo && x.Id_LineaNegocio == lineaNegocio && x.Activo ==1).SingleOrDefault(); ;
            object respuesta = null;

            if (acuedroGrupo == null) {
                try {
                    var nuevo = new Acuerdo_Grupo();
                    nuevo.Id_Acuerdo = Id_Acuerdo;
                    nuevo.Id_Grupo = Id_Grupo;
                    nuevo.Id_Operador = Id_Operador;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    nuevo.Activo = 1;

                    db.Acuerdo_Grupo.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Acuerdo_Grupo.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ex) {
                    respuesta = new { success = false, results = ex.Message, mensaje = "Hubo un error al momento de procesar la petición actual." };
                }
            } else {
                respuesta = new { success = false, results = "no", mensaje = "No se permite múltiples Acuerdo Grupo para esta línea de negocio." };
            }
            
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }
        public JsonResult buscarAcuerdoGrupo(int Id)
        {
            object respuesta = null;

            try
            {

                var acuerdoGrupo = db.Acuerdo_Grupo.Where(x => x.Id == Id);
                List<object> lista = new List<object>();

                foreach (var elemento in acuerdoGrupo)
                {
                    lista.Add(new
                    {                        
                        Id_Acuerdo = elemento.Id_Acuerdo,
                        //Id_Operador = elemento.Id_Operador,
                        Grupo = elemento.Id_Grupo
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

        public JsonResult modificarAcuerdoGrupo(int Id, int Id_Acuerdo, int Id_Grupo, int Id_Operador, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                if (validaNoRepetido(Id_Acuerdo, Id_Grupo, lineaNegocio)) {
                    Acuerdo_Grupo oAcuerdo_Grupo = db.Acuerdo_Grupo.Where(a => a.Id == Id).SingleOrDefault();
                    oAcuerdo_Grupo.Id_Acuerdo = Id_Acuerdo;
                    oAcuerdo_Grupo.Id_Operador = Id_Operador;
                    oAcuerdo_Grupo.Id_Grupo = Id_Grupo;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oAcuerdo_Grupo, "Id", oAcuerdo_Grupo.Id, "Acuerdo_Grupo.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } else {
                    respuesta = new { success = false, results = "no", mensaje = "No se permite múltiples Acuerdo Grupo para esta línea de negocio." };
                }
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message, mensaje = "Hubo un error al momento de procesar la petición." };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarAcuerdoGrupo(string strId)
        {
            int Id = 0;
            string strmsg = "ok";
            strId = strId.TrimEnd(',');
            object respuesta;
            try
            {
                string[] Ids = strId.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("Acuerdo_Grupo", Id);

                        if (strresp_val.Length == 0)
                        {
                            Acuerdo_Grupo oAcuerdo_Grupo = db.Acuerdo_Grupo.Where(x => x.Id == Id).SingleOrDefault();
                            oAcuerdo_Grupo.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oAcuerdo_Grupo, "Eliminado", "Acuerdo_Grupo.html", Request.UserHostAddress);
                            db.SaveChanges();
                        }
                        else
                        {
                            strmsg = "El(Los) " + Ids.Length.ToString() + " registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) " + Environment.NewLine;
                            strmsg = strmsg + strresp_val;
                            break;
                        }
                    }
                }
                respuesta = new { success = true, results = strmsg };
            }
            catch (Exception ex)
            {
                strmsg = ex.Message;
                respuesta = new { success = false, results = strmsg };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #region Combos
        /// <summary>
        /// 
        /// </summary>
        /// <param name="lineaNegocio"></param>
        /// <param name="start"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
     
        public JsonResult LlenaGrupo(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var grupo = from oGrupo in db.Grupo
                               where oGrupo.Activo == 1 && oGrupo.Id_LineaNegocio == lineaNegocio
                               select new
                               {                                   
                                   oGrupo.Grupo1,
                                   oGrupo.Id
                               };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Id_Grupo = elemento.Id,
                        Grupo = elemento.Grupo1
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
        public JsonResult LlenaAcuerdoTarifa(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<object> lista = new List<object>();
                var acuerdoTarifa = from oATarifa in db.AcuerdoTarifa
                            where oATarifa.Activo == 1 && oATarifa.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oATarifa.Id_Acuerdo,
                                oATarifa.IdAcuerdo
                            };
                foreach (var elemento in acuerdoTarifa)
                {
                    lista.Add(new
                    {
                        Id= elemento.IdAcuerdo,
                        Id_Acuerdo = elemento.Id_Acuerdo
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

        public JsonResult LlenaOperador(int lineaNegocio, int start, int limit)
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
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #endregion

        public bool validaNoRepetido(int Acuerdo, int Grupo, int lineaNegocio)
        {
            Acuerdo_Grupo oAcuerdo_Grupo = db.Acuerdo_Grupo.Where(a => a.Id_Acuerdo == Acuerdo && a.Id_Grupo == Grupo && a.Id_LineaNegocio == lineaNegocio && a.Activo == 1).SingleOrDefault();
            if (oAcuerdo_Grupo == null)
                return true;
            return false;
        }

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Acuerdo_Grupo", Id);

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
    }
}