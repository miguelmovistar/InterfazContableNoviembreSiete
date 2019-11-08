// Nombre: TCCierreController.cs
// Creado por: Jaíme Alfredo Ladrón de Guevara Herrero
// Fecha: 15/dic/2018 
// Descripcion: Catalogo de TCCierre
// Ultima Fecha de modificación: 

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;
using IC2.Models;
using System.Data.Entity.SqlServer;

namespace IC2.Controllers
{
    public class TCCierreController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult LlenaGrid(int lineaNegocio, int start, int limit, string Mes_ConsumoFormato,
                                                                            string Moneda_Origen,
                                                                            string TC_MXN,
                                                                            string TC_USD,
                                                                            string TC_CORPORATIVO)
        {
            List<object> listaTCCierre = new List<object>();
            object respuesta = null;
            try {

                var tccierre = from elemento in db.TC_Cierre
                               join moneda in db.Moneda
                               on elemento.Id_Moneda equals moneda.Id
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                               && moneda.Activo == 1 && moneda.Id_LineaNegocio == lineaNegocio

                               && DbFiltro.Date(elemento.Mes_Consumo, Mes_ConsumoFormato, "am")
                               && DbFiltro.String(moneda.Moneda1, Moneda_Origen)
                               && DbFiltro.Decimal(elemento.TC_MXN, TC_MXN)
                               && DbFiltro.Decimal(elemento.TC_USD, TC_USD)
                               && DbFiltro.Decimal(elemento.TC_CORPORATIVO, TC_CORPORATIVO)

                               select new
                               {
                                   elemento.Id,
                                   elemento.Mes_Consumo,
                                   moneda.Moneda1,
                                   elemento.TC_MXN,
                                   elemento.TC_USD,
                                   elemento.TC_CORPORATIVO,
                                   elemento.Sentido
                               };

                foreach (var elemento in tccierre) {
                    listaTCCierre.Add(new
                    {
                        elemento.Id,
                        elemento.Mes_Consumo,
                        Mes_ConsumoFormato = elemento.Mes_Consumo.ToString("yyyy MMMM", new CultureInfo("es-ES")).ToUpper(),
                        Moneda_Origen = elemento.Moneda1,
                        elemento.TC_MXN,
                        elemento.TC_USD,
                        elemento.TC_CORPORATIVO,
                        elemento.Sentido

                    });
                }
                respuesta = new { success = true,
                                  results = listaTCCierre.Skip(start).Take(limit).ToList(),
                                  total = listaTCCierre.Count
                };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AgregarTCCierre(DateTime Mes_Consumo, int Moneda_Origen, decimal TC_MXN, decimal TC_USD, decimal? TC_CORPORATIVO,string Sentido, int lineaNegocio)
        {

            object respuesta = null;

            try {
                TC_Cierre tccierre = null;
                switch (lineaNegocio)
                {
                    case 1:
                        tccierre = db.TC_Cierre.Where(x => x.Mes_Consumo.Month == Mes_Consumo.Month && x.Mes_Consumo.Year == Mes_Consumo.Year && x.Id_Moneda == Moneda_Origen && x.Sentido == Sentido && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                        break;
                    case 2:
                        tccierre = db.TC_Cierre.Where(x => x.Mes_Consumo.Month == Mes_Consumo.Month && x.Mes_Consumo.Year == Mes_Consumo.Year && x.Id_Moneda == Moneda_Origen  && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                        break;
                }
                var nuevo = new TC_Cierre();
                if (tccierre == null) {
                    nuevo.Mes_Consumo = Mes_Consumo;
                    nuevo.Id_Moneda = Moneda_Origen;
                    nuevo.TC_MXN = TC_MXN;
                    nuevo.TC_USD = TC_USD;
                    nuevo.TC_CORPORATIVO = TC_CORPORATIVO;
                    nuevo.Activo = 1 ;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    nuevo.Sentido = Sentido;
                    db.TC_Cierre.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "TC_Cierre.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } else {
                    respuesta = new { success = false, results = "El TC ya existe" };
                }
            } catch (Exception ex) {
                var error = ex.Message;
                respuesta = new { success = false, results = "Ocurrió un error durante la operación." };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);

        }

        public JsonResult BuscarTCCierre(int Id)
        {
            object respuesta = null;

            try {
                TC_Cierre oTC_Cierre = db.TC_Cierre.Where(x => x.Id == Id && x.Activo == 1).SingleOrDefault();


                respuesta = new { success = true, results = oTC_Cierre };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult BorrarTCCierre(string strId)
        {
            int Id = 0;
            strId = strId.TrimEnd(',');
            object respuesta;
            try {
                string[] Ids = strId.Split(',');

                for (int i = 0; i < Ids.Length; i++) {
                    if (Ids[i].Length != 0) {
                        Id = int.Parse(Ids[i]);

                        TC_Cierre oTC_Cierre = db.TC_Cierre.Where(x => x.Id == Id).SingleOrDefault();
                        oTC_Cierre.Activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oTC_Cierre, "Eliminado", "TC_Cierre.html", Request.UserHostAddress);

                        db.SaveChanges();
                    }
                }
                respuesta = new { success = true, results = "ok" };
            } catch {
                respuesta = new { success = false, results = "no" };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ModificarTCCierre(DateTime Mes_Consumo, string Moneda_Origen, decimal TC_MXN, decimal TC_USD, decimal? TC_CORPORATIVO, int Id,string Sentido, int lineaNegocio)
        {
            object respuesta = null;
            
            try {
                Moneda oMoneda = db.Moneda.Where(x => x.Moneda1 == Moneda_Origen && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                TC_Cierre exist = null;
                switch (lineaNegocio)
                {
                    case 1:
                        exist = db.TC_Cierre.Where(x => x.Mes_Consumo.Month == Mes_Consumo.Month && x.Mes_Consumo.Year == Mes_Consumo.Year && x.Id_Moneda == oMoneda.Id && x.Sentido == Sentido && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                        break;
                    case 2:
                        exist = db.TC_Cierre.Where(x => x.Mes_Consumo.Month == Mes_Consumo.Month && x.Mes_Consumo.Year == Mes_Consumo.Year && x.Id_Moneda == oMoneda.Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                        break;
                }
                if (exist == null || exist.Id == Id) {
                    TC_Cierre oTC_Cierre = db.TC_Cierre.Where(a => a.Id == Id).SingleOrDefault();
                    oTC_Cierre.Mes_Consumo = Mes_Consumo;
                    oTC_Cierre.Id_Moneda = oMoneda.Id;
                    oTC_Cierre.TC_MXN = TC_MXN;
                    oTC_Cierre.TC_USD = TC_USD;
                    oTC_Cierre.TC_CORPORATIVO = TC_CORPORATIVO;
                    oTC_Cierre.Sentido = Sentido;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oTC_Cierre, "Id", oTC_Cierre.Id, "TC_Cierre.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } else {
                    respuesta = new { success = false, results = "No se permite múltiples TC para esta linea de negocio." };
                }
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaMoneda(int lineaNegocio)
        {
            List<object> listaMoneda = new List<object>();
            object respuesta = null;
            try {
                var moneda = from elemento in db.Moneda
                             where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                             select new
                             {
                                 elemento.Id,
                                 elemento.Moneda1,
                                 elemento.Descripcion
                             };

                foreach (var elemento in moneda) {
                    listaMoneda.Add(new
                    {
                        elemento.Id,
                        Moneda = elemento.Moneda1,
                        elemento.Descripcion
                    });
                }
                respuesta = new { success = true, results = listaMoneda };


            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenaSentido(int lineaNegocio)
        {
            object respuesta = null;
            var list = new List<object>();
            try
            {
                var sentido = db.TC_Cierre.Where(tc => tc.Activo == 1).Select(tc => tc.Sentido).Distinct().ToList();
                int Id = 1;
                sentido.ForEach(tc => 
                {
                    list.Add(new
                    {
                        Id = Id,
                        Sentido = tc
                    });
                    Id++;
                });
                respuesta = new { success = true, results = list };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
    }
}