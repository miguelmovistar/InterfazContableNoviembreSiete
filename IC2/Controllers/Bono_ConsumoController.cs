/* Nombre: Bono_ConsumoController.cs  
* Creado por: Jaime ALfredo Ladrón de Guevara Herrero
* Fecha de Creación: 16/ene/2018
* Descripcion: Catalogo de Bonos por Consumo
* Modificado por: 
* Ultima Fecha de modificación:   
*/
using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class Bono_ConsumoController : Controller
    {
        // GET: Bono_Consumo
        ICPruebaEntities db = new ICPruebaEntities();
        #region Vista
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        #endregion
        #region Metodos
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try {

                var consumo = from elemento in db.BonoConsumo
                              join operador in db.Operador
                              on elemento.Id_Operador equals operador.Id
                              where
                              elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                              select new
                              {
                                  elemento.Id,
                                  operador.Id_Operador,
                                  OperadorId = operador.Id,
                                  operador.Nombre,
                                  elemento.FactMin,
                                  elemento.FactMax,
                                  elemento.BonoComPor,
                                  elemento.FechaInicio,
                                  elemento.FechaFin
                              };

                foreach (var elemento in consumo) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Id_Operador = elemento.Id_Operador,
                        OperadorId = elemento.OperadorId,
                        Nombre = elemento.Nombre,
                        FactMin = elemento.FactMin,
                        FactMax = elemento.FactMax,
                        BonoComPor = elemento.BonoComPor,
                        FechaInicio = elemento.FechaInicio.Value.ToString("dd-MM-yyyy"),
                        FechaFin = elemento.FechaFin.Value.ToString("dd-MM-yyyy")
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            } catch (Exception ex) {
                respuesta = new { success = true, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult agregar(int? Operador, decimal FactMin, decimal FactMax, decimal BonoComPor, DateTime FechaInicio, DateTime FechaFin, int lineaNegocio)
        {
            object respuesta = null;
            bool valid = true;
            var mensaje = "";

            if (DateTime.Compare(FechaInicio, FechaFin) <= 0) {
                valid = false;
                mensaje = "Vigencia Inicio debe ser MENOR que Vigencia Fin";
            }

            if (FactMax <= FactMin) {
                valid = false;
                if (mensaje != "")
                    mensaje = mensaje + " y " + "Fact. Mínimo debe ser MENOR que Fact. Máximo";
                else
                    mensaje = "Fact. Mínimo debe ser MENOR que Fact. Máximo";
            }

            if (valid) {
                try {
                    var nuevo = new BonoConsumo();
                    nuevo.Id_Operador = Operador;
                    nuevo.FactMin = FactMin;
                    nuevo.FactMax = FactMax;
                    nuevo.BonoComPor = BonoComPor;
                    nuevo.FechaInicio = FechaInicio;
                    nuevo.FechaFin = FechaFin;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.BonoConsumo.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "BonoConsumo.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ) {
                    respuesta = new { success = false, results = "Hubo un error mientras se procesaba la petición" };
                }
            } else {
                respuesta = new { success = false, results = mensaje };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult modificar(int id, string Id_Operador, int? Operador, decimal FactMin, decimal FactMax, decimal BonoComPor, DateTime FechaInicio, DateTime FechaFin, int lineaNegocio)
        {
            object respuesta = null;
            Operador operador = db.Operador.Where(x => x.Id_Operador == Id_Operador && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            BonoConsumo oBonoConsumo = db.BonoConsumo.Where(x => x.Id == id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            bool valid = true;
            var mensaje = "";

            if (DateTime.Compare(FechaInicio, FechaFin) <= 0) {
                valid = false;
                mensaje = "Vigencia Inicio debe ser MENOR que Vigencia Fin";
            }

            if (FactMax <= FactMin) {
                valid = false;
                if (mensaje != "")
                    mensaje = mensaje + " y " + "Fact. Mínimo debe ser MENOR que Fact. Máximo";
                else
                    mensaje = "Fact. Mínimo debe ser MENOR que Fact. Máximo";
            }

            if (valid) {
                try {
                    oBonoConsumo.Id_Operador = operador.Id;
                    oBonoConsumo.FactMin = FactMin;
                    oBonoConsumo.FactMax = FactMax;
                    oBonoConsumo.BonoComPor = BonoComPor;
                    oBonoConsumo.FechaInicio = FechaInicio;
                    oBonoConsumo.FechaFin = FechaFin;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oBonoConsumo, "Id", oBonoConsumo.Id, "BonoConsumo.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ) {
                    respuesta = new { success = false, results = "Hubo un error mientras se procesaba la petición" };
                }
            } else {
                respuesta = new { success = false, results = mensaje };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult borrar(string strID)
        {
            int Id = 0;
            strID = strID.TrimEnd(',');
            object respuesta;
            try {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++) {
                    if (Ids[i].Length != 0) {
                        Id = int.Parse(Ids[i]);

                        BonoConsumo oBonoConsumo = db.BonoConsumo.Where(x => x.Id == Id).SingleOrDefault();
                        oBonoConsumo.Activo = 0;
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oBonoConsumo, "Eliminado", "BonoConsumo.html", Request.UserHostAddress);
                        db.SaveChanges();
                    }
                }
                respuesta = new { success = true, results = "ok" };
            } catch {
                respuesta = new { success = false, result = "no" };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Relaciones
        public JsonResult llenaOperador(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
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
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            } catch (Exception ex) {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}