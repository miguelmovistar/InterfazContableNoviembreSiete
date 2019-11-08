using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class TarifaController : Controller
    {
        // GET: Tarifa
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var tarifa = from elemento in db.Tarifa
                            
                             join operador in db.Operador
                             on elemento.Id_OperadorTarifa equals operador.Id
                             join trafico in db.Trafico
                             on elemento.Id_TraficoSal equals trafico.Id
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                             && operador.Activo==1 && operador.Id_LineaNegocio==lineaNegocio
                             && trafico.Activo==1 && trafico.Id_LineaNegocio==lineaNegocio
                               select new
                               {
                                   elemento.Id,
                                   elemento.SentidoTrafico,
                                   elemento.Id_OperadorTarifa,
                                   operador.Id_Operador,
                                   operador.Nombre,
                                   elemento.Id_TraficoSal,
                                   trafico.Descripcion,
                                   trafico.Id_TraficoTR,
                                   elemento.VolMinimo,
                                   elemento.VolMaximo,
                                   elemento.Tarifa1,
                                   elemento.VigInicio,
                                   elemento.VigFin
                               };

                foreach (var elemento in tarifa)
                {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Sentido = elemento.SentidoTrafico,
                        Id_Operador = elemento.Id_OperadorTarifa,
                        IdOperador = elemento.Id_Operador,
                        Operador = elemento.Nombre,
                        Id_Trafico = elemento.Id_TraficoSal,
                        Trafico = elemento.Descripcion,
                        NombreTrafico = elemento.Id_TraficoTR+" - "+elemento.Descripcion,
                        IdTrafico = elemento.Id_TraficoTR,
                        VolMinimo = elemento.VolMinimo,
                        VolMaximo = elemento.VolMaximo,
                        Tarifa = elemento.Tarifa1,
                        VigInicio = elemento.VigInicio.Value.ToString("dd-MM-yyyy"),
                        VigFin = elemento.VigFin.Value.ToString("dd-MM-yyyy")
                       
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult agregar(int? Operador ,string Sentido,int? Trafico,decimal Volminimo, decimal Volmaximo, decimal Tarifa,DateTime Viginicio, DateTime Vigfin,  int lineaNegocio)
        {
            object respuesta = null;
            bool rangoValido = true;
            try
            {
                
                if (Viginicio > Vigfin)
                {
                    rangoValido = false;
                }
                if (rangoValido == true)
                {
                    var nuevo = new Tarifa();
                    
                    nuevo.Id_OperadorTarifa = Operador;
                    nuevo.SentidoTrafico = Sentido;
                    nuevo.Id_TraficoSal = Trafico;
                    nuevo.VolMinimo = Volminimo;
                    nuevo.VolMaximo = Volmaximo;
                    nuevo.Tarifa1 = Tarifa;
                    nuevo.VigInicio = Viginicio;
                    nuevo.VigFin = Vigfin;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.Tarifa.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Tarifa.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", rango = rangoValido };
                }

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult modificar(int Id, int Operador, string Sentido, int Trafico,decimal Volminimo, decimal Volmaximo, decimal Tarifa,  DateTime Viginicio, DateTime Vigfin,  int lineaNegocio)
        {
            object respuesta = null;
            Tarifa oTarifa = db.Tarifa.Where(x => x.Id == Id).SingleOrDefault();
            bool rangoValido = true;
            try
            {
                if (Viginicio > Vigfin)
                {
                    rangoValido = false;
                }
                if (rangoValido == true)
                {
                    oTarifa.Id_OperadorTarifa= Operador;
                    oTarifa.SentidoTrafico = Sentido;
                    oTarifa.Id_TraficoSal = Trafico;
                    oTarifa.VolMinimo = Volminimo;
                    oTarifa.VolMaximo = Volmaximo;
                    oTarifa.Tarifa1 = Tarifa;
                    oTarifa.VigInicio = Viginicio;
                    oTarifa.VigFin = Vigfin;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oTarifa, "Id", oTarifa.Id, "Tarifa.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                {
                    respuesta = new { success = true, results = "no", rango = rangoValido };
                }
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrar(string strID)
        {
            object respuesta = null;
            int Id = 0;
            strID = strID.TrimEnd(',');
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;

            try
            {
                string[] Ids = strID.Split(',');
                for (int i = 0; i < Ids.Length; i++)
                {
                    Id = int.Parse(Ids[i]);

                    string strresp_val = funGralCtrl.ValidaRelacion("Tarifa", Id);

                    if (strresp_val.Length == 0)
                    {
                        Tarifa oTarifa = db.Tarifa.Where(x => x.Id == Id).SingleOrDefault();
                        oTarifa.Activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oTarifa, "Eliminado", "Tarifa.html", Request.UserHostAddress);

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

        #region combos
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
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaOperador(int lineaNegocio, int start, int limit)
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
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult llenaTrafico(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                List<Trafico> lista = new List<Trafico>();
                var trafico = from oTrafico in db.Trafico
                               where oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   oTrafico.Id,
                                   oTrafico.Id_TraficoTR,
                                   oTrafico.Descripcion
                               };
                foreach (var elemento in trafico)
                {
                    lista.Add(new Trafico
                    {
                        Id = elemento.Id,
                        Id_TraficoTR = elemento.Id_TraficoTR,
                        Descripcion = elemento.Descripcion
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

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("Tarifa", Id);

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
        #endregion
    }
}