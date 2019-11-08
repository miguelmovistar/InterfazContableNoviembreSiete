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
    public class BonoAceleracionController : Controller
    {
        // GET: Bono_Consumo
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();

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

            if (DateTime.Compare(FechaInicio, FechaFin) >= 0) {
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

            if (DateTime.Compare(FechaInicio, FechaFin) >= 0) {
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
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            strID = strID.TrimEnd(',');
            object respuesta;
            try {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++) {
                    if (Ids[i].Length != 0) {
                                                
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("BonoConsumo", Id);

                        if (strresp_val.Length == 0)
                        {
                            BonoConsumo oBonoConsumo = db.BonoConsumo.Where(x => x.Id == Id).SingleOrDefault();
                            oBonoConsumo.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oBonoConsumo, "Eliminado", "BonoConsumo.html", Request.UserHostAddress);
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

            } catch (Exception ex ){
                strmsg = ex.Message;
                respuesta = new { success = false, result = strmsg };
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

        public JsonResult validaModif(int Id)
        {
            string strSalto = "</br>";
            string strmsg = "";
            bool blsccs = true;

            object respuesta = null;

            string strresp_val = funGralCtrl.ValidaRelacion("BonoConsumo", Id);

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