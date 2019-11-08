// Nombre: Tarifa_FeeController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 16/dic/2018 
// Descripcion: Catalogo de Tarifa Fee
// Ultima Fecha de modificación: 

using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class Tarifa_FeeController : Controller
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Descripcion,
                                                                            string DescripcionGrupo,
                                                                            string Fecha_Fin,
                                                                            string Fecha_Inicio,
                                                                            string Fee,
                                                                            string NombreSociedad,
                                                                            string Porcentaje,
                                                                            string Tarifa)
        {
            List<object> listaTarifa_Fee = new List<object>();
            object respuesta = null;
            try
            {

                var tarifa_fee = from elemento in db.Tarifa_Fee
                                 join oSociedad in db.Sociedad
                                 on elemento.Id_Sociedad equals oSociedad.Id
                                 join oGrupo in db.Grupo
                                 on elemento.Id_Grupo equals oGrupo.Id
                                 join oTrafico in db.Trafico
                                 on elemento.Id_Trafico equals oTrafico.Id
                                 where elemento.Activo == 1 && elemento.Id_LineaNegocio==lineaNegocio
                                 && oSociedad.Activo == 1 && oGrupo.Activo == 1 && oTrafico.Activo == 1 
                                 && oSociedad.Id_LineaNegocio == lineaNegocio && oGrupo.Id_LineaNegocio == lineaNegocio
                                 && oTrafico.Id_LineaNegocio == lineaNegocio

                                 && DbFiltro.Date(elemento.Fecha_Fin, Fecha_Fin, "dma")
                                 && DbFiltro.Date(elemento.Fecha_Inicio, Fecha_Inicio, "dma")
                                 && DbFiltro.String(oTrafico.Descripcion, Descripcion)
                                 && DbFiltro.String(oGrupo.DescripcionGrupo, DescripcionGrupo)
                                 && DbFiltro.String(elemento.Fee, Fee)
                                 && DbFiltro.String(oSociedad.NombreSociedad, NombreSociedad)
                                 && DbFiltro.Decimal(elemento.Porcentaje, Porcentaje)
                                 && DbFiltro.Decimal(elemento.Tarifa, Tarifa)

                                 select new
                                 {
                                     elemento.Id,
                                     elemento.Id_Sociedad,
                                     oGrupo.Grupo1,
                                     oTrafico.Id_TraficoTR,
                                     elemento.Fee,
                                     elemento.Fecha_Inicio,
                                     elemento.Fecha_Fin,
                                     elemento.Tarifa,
                                     elemento.Porcentaje,
                                     oGrupo.DescripcionGrupo,
                                     oSociedad.NombreSociedad,
                                     oTrafico.Descripcion,
                                     elemento.Id_Trafico,
                                     elemento.Id_Grupo
                                    // oSociedad.Id_Sociedad as idSociedad
                                 };

                foreach (var elemento in tarifa_fee)
                {
                    listaTarifa_Fee.Add(new
                    {
                        Id = elemento.Id,
                        Sociedad = elemento.Id_Sociedad,
                        Grupo = elemento.Grupo1,
                        Trafico = elemento.Id_Trafico,
                        Fee = elemento.Fee,
                        Fecha_Inicio = elemento.Fecha_Inicio.Value.ToString("dd-MM-yyyy") ,
                        Fecha_Fin = elemento.Fecha_Fin.Value.ToString("dd-MM-yyyy"),
                        Tarifa = elemento.Tarifa,
                        Porcentaje = elemento.Porcentaje,
                        DescripcionGrupo = elemento.DescripcionGrupo,
                        NombreSociedad = elemento.NombreSociedad,
                        Descripcion = elemento.Descripcion,
                        Id_Grupo = elemento.Id_Grupo
                    });
                }

                respuesta = new
                {
                    success = true,
                    results = listaTarifa_Fee.Skip(start).Take(limit).ToList(),
                    total = listaTarifa_Fee.Count
                };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregarTarifa_Fee(int Sociedad, int Grupo, int Trafico, string Fee, DateTime Fecha_Inicio, DateTime Fecha_Fin,decimal Tarifa, decimal Porcentaje, int lineaNegocio)
        {
            object respuesta = null;
            try
            {
                var nuevo = new Tarifa_Fee();
              
                    nuevo.Id_Sociedad = Sociedad;
                    nuevo.Id_Grupo = Grupo;
                    nuevo.Id_Trafico = Trafico;
                    nuevo.Fee = Fee;
                    nuevo.Fecha_Inicio = Fecha_Inicio;
                    nuevo.Fecha_Fin = Fecha_Fin;
                    nuevo.Tarifa = Tarifa;
                    nuevo.Porcentaje = Porcentaje;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;

                    db.Tarifa_Fee.Add(nuevo);

                Log log = new Log();
                log.insertaNuevoOEliminado(nuevo, "Nuevo", "Tarifa_Fee.html", Request.UserHostAddress);

                db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
            //}
            //    else
            //    {
            //    respuesta = new { success = true, results = "no", mensaje = noEncontrados.TrimEnd(',') };
            //}

        }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message.ToString() };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult buscarTarifa_Fee(int Id)
        {
            object respuesta = null;

            try
            {
                Tarifa_Fee oTarifa_Fee = db.Tarifa_Fee.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();


                respuesta = new { success = true, results = oTarifa_Fee };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrarTarifa_Fee(string strID)
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

                    string strresp_val = funGralCtrl.ValidaRelacion("Tarifa_Fee", Id);

                    if (strresp_val.Length == 0)
                    {
                        Tarifa_Fee oTarifa_Fee = db.Tarifa_Fee.Where(a => a.Id == Id).SingleOrDefault();
                        oTarifa_Fee.Activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oTarifa_Fee, "Eliminado", "Tarifa_Fee.html", Request.UserHostAddress);

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

        public JsonResult modificarTarifa_Fee(int Sociedad, int Grupo, int Trafico, string Fee, DateTime Fecha_Inicio, DateTime Fecha_Fin, decimal Tarifa, decimal Porcentaje, int Id, int lineaNegocio)
        {
            object respuesta = null;

            try
            {
                Tarifa_Fee oTarifa_Fee = db.Tarifa_Fee.Where(a => a.Id == Id && a.Id_LineaNegocio == lineaNegocio && a.Activo == 1).SingleOrDefault();

                    oTarifa_Fee.Id_Sociedad = Sociedad;
                    oTarifa_Fee.Id_Grupo = Grupo;
                    oTarifa_Fee.Id_Trafico = Trafico;
                    oTarifa_Fee.Fee = Fee;
                    oTarifa_Fee.Fecha_Inicio = Fecha_Inicio;
                    oTarifa_Fee.Fecha_Fin = Fecha_Fin;
                    oTarifa_Fee.Tarifa = Tarifa;
                    oTarifa_Fee.Porcentaje = Porcentaje;
                Log log = new Log();
                log.insertaBitacoraModificacion(oTarifa_Fee, "Id", oTarifa_Fee.Id, "Tarifa_Fee.html", Request.UserHostAddress);

                db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };           
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #region
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
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion,
                                  oTrafico.Id
                              };
                foreach (var elemento in trafico)
                {
                    lista.Add(new Trafico
                    {
                        Id = elemento.Id,
                        Descripcion = elemento.Descripcion,
                        Id_TraficoTR = elemento.Id_TraficoTR
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

            string strresp_val = funGralCtrl.ValidaRelacion("Tarifa_Fee", Id);

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

        #endregion

    }
}