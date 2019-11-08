using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class TarifaRoamingController : Controller
    {
        // GET: TarifaRoaming
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
        public JsonResult llenaGrid(int lineaNegocio, string TipoCatalogo, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try {
                var tarifa = from elemento in db.TarifaRoaming
                             join grupo in db.Grupo 
                             on elemento.Code equals grupo.Id into gp
                             join operador in db.Operador
                             on elemento.Id_Operador equals operador.Id into op
                             from subgrupo in gp.DefaultIfEmpty()
                             from suboperador in op.DefaultIfEmpty()
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                             select new
                             {
                                 elemento.Id,
                                 elemento.Sentido,
                                 elemento.Direccion,
                                 elemento.Code,
                                 Grupo1 = subgrupo.Grupo1 ?? String.Empty,
                                 DescripcionGrupo = subgrupo.DescripcionGrupo ?? String.Empty,
                                 Nombre = suboperador.Nombre ?? String.Empty,
                                 Id_Operador = suboperador.Id_Operador ?? String.Empty,
                                 elemento.FechaInicio,
                                 elemento.FechaFin,
                                 elemento.ToData,
                                 elemento.ToSMSMo,
                                 elemento.ToVoiceMo,
                                 elemento.ToVoiceMt,
                                 elemento.iva,
                                 elemento.TfData,
                                 elemento.TfSMSMo,
                                 elemento.TfVoiceMo,
                                 elemento.TfVoiceMt,
                                 elemento.Tipo
                             };

                if (TipoCatalogo != null && TipoCatalogo != "TODOS") {
                    tarifa = tarifa.Where(x => x.Tipo.ToUpper() == TipoCatalogo.ToUpper() );
                }

                foreach (var elemento in tarifa) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Sentido = elemento.Sentido,
                        Direccion = elemento.Direccion,
                        Code = elemento.Code,
                        Grupo = elemento.Grupo1,
                        Descripcion = elemento.DescripcionGrupo,
                        Id_Operador = elemento.Id_Operador,
                        Nombre = elemento.Nombre,
                        FechaInicio = elemento.FechaInicio.Value.ToString("dd-MM-yyyy"),
                        FechaFin = elemento.FechaFin.Value.ToString("dd-MM-yyyy"),
                        ToData = elemento.ToData,
                        ToSMSMo = elemento.ToSMSMo,
                        ToVoiceMo = elemento.ToVoiceMo,
                        ToVoiceMt = elemento.ToVoiceMt,
                        Iva = elemento.iva,
                        TfData = elemento.TfData,
                        TfSMSMo = elemento.TfSMSMo,
                        TfVoiceMo = elemento.TfVoiceMo,
                        TfVoiceMt = elemento.TfVoiceMt

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
        public JsonResult agregar(string Sentido, string Direccion, int Grupo, int Operador, DateTime FechaInicio, DateTime FechaFin, decimal TODATA, decimal TOSMSMO, decimal TOVoiceMO, decimal TOVoiceMT, decimal TFDATA, decimal TFSMSMO, decimal TFVoiceMO, decimal TFVoiceMT, int lineaNegocio)
        {
            object respuesta = null;
            try {
                if (FechaInicio < FechaFin) {
                    var nuevo = new TarifaRoaming();
                    nuevo.Sentido = Sentido;
                    nuevo.Direccion = Direccion;
                    nuevo.Code = Grupo;
                    nuevo.Id_Operador = Operador;
                    nuevo.FechaInicio = FechaInicio;
                    nuevo.FechaFin = FechaFin;
                    nuevo.ToData = TODATA;
                    nuevo.ToSMSMo = TOSMSMO;
                    nuevo.ToVoiceMo = TOVoiceMO;
                    nuevo.ToVoiceMt = TOVoiceMT;
                    nuevo.TfData = TFDATA;
                    nuevo.TfSMSMo = TFSMSMO;
                    nuevo.TfVoiceMo = TFVoiceMO;
                    nuevo.TfVoiceMt = TFVoiceMT;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.TarifaRoaming.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "TarifaRoaming.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } else
                    respuesta = new { success = true, results = "no" };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult buscar(int Id)
        {
            object respuesta = null;
            try {
                TarifaRoaming tarifa = db.TarifaRoaming.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();
                respuesta = new { success = true, results = tarifa };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };

            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult modificar(int Id, string Sentido, string Direccion, string Grupo, string Operador, DateTime FechaInicio, DateTime FechaFin, decimal TODATA, decimal TOSMSMO, decimal TOVoiceMO, decimal TOVoiceMT, decimal TFDATA, decimal TFSMSMO, decimal TFVoiceMO, decimal TFVoiceMT, int lineaNegocio)
        {
            object respuesta = null;
            try {
                TarifaRoaming oTarifa = db.TarifaRoaming.Where(x => x.Id == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Grupo oGrupo = db.Grupo.Where(x => x.Grupo1 == Grupo && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                Operador oOperador = db.Operador.Where(x => x.Id_Operador == Operador && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                if (FechaInicio < FechaFin) {

                    oTarifa.Sentido = Sentido;
                    oTarifa.Direccion = Direccion;
                    oTarifa.Code = oGrupo.Id;
                    oTarifa.Id_Operador = oOperador.Id;
                    oTarifa.FechaInicio = FechaInicio;
                    oTarifa.FechaFin = FechaFin;
                    oTarifa.ToData = TODATA;
                    oTarifa.ToSMSMo = TOSMSMO;
                    oTarifa.ToVoiceMo = TOVoiceMO;
                    oTarifa.ToVoiceMt = TOVoiceMT;
                    oTarifa.TfData = TFDATA;
                    oTarifa.TfSMSMo = TFSMSMO;
                    oTarifa.TfVoiceMo = TFVoiceMO;
                    oTarifa.TfVoiceMt = TFVoiceMT;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oTarifa, "Id", oTarifa.Id, "TarifaRoaming.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } else
                    respuesta = new { success = true, results = "no" };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
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

                        string strresp_val = funGralCtrl.ValidaRelacion("TarifaRoaming", Id);

                        if (strresp_val.Length == 0) {
                            TarifaRoaming oTarifa = db.TarifaRoaming.Where(x => x.Id == Id).SingleOrDefault();
                            oTarifa.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oTarifa, "Eliminado", "TarifaRoaming.html", Request.UserHostAddress);

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

        #region Combos
        public JsonResult llenaGrupo(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            try {
                List<Grupo> lista = new List<Grupo>();
                var grupo = from oGrupo in db.Grupo
                            where oGrupo.Activo == 1 && oGrupo.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                oGrupo.Id,
                                oGrupo.Grupo1,
                                oGrupo.DescripcionGrupo
                            };
                foreach (var elemento in grupo) {
                    lista.Add(new Grupo
                    {
                        Id = elemento.Id,
                        Grupo1 = elemento.Grupo1,
                        DescripcionGrupo = elemento.DescripcionGrupo
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaOperador(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            try {
                List<Operador> lista = new List<Operador>();
                var operador = from oOperador in db.Operador
                               where oOperador.Activo == 1 && oOperador.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oOperador.Id,
                                   oOperador.Id_Operador,
                                   oOperador.Nombre
                               };
                foreach (var elemento in operador) {
                    lista.Add(new Operador
                    {
                        Id = elemento.Id,
                        Id_Operador = elemento.Id_Operador,
                        Nombre = elemento.Nombre
                    });
                }
                //total = lista.Count();
                //lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista/*, total = total*/ };
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

            string strresp_val = funGralCtrl.ValidaRelacion("TarifaRoaming", Id);

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