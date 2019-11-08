/* Nombre: ConceptoController.cs  
* Creado por: Jaime ALfredo Ladrón de Guevara Herrero
* Fecha de Creación: 22/ene/2018
* Descripcion: Catalogo de Conceptos
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
    public class ConceptoController : Controller
    {
        // GET: AcuerdoTarifa
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Nombre,
                                                                            string TraficoDescripcion,
                                                                            string Concepto1)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try {

                var concepto = from elemento in db.Concepto
                               join operador in db.Operador
                               on elemento.Operador_Id equals operador.Id
                               join trafico in db.Trafico
                               on elemento.Trafico_Id equals trafico.Id
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                                && DbFiltro.String(operador.Nombre, Nombre)
                                && DbFiltro.String(elemento.TraficoDescripcion, TraficoDescripcion)
                                && DbFiltro.String(elemento.Concepto1, Concepto1)

                               select new
                               {
                                   elemento.Id,
                                   elemento.Operador_Id,
                                   operador.Nombre,
                                   //operador.Id_Operador,
                                   elemento.Trafico_Id,
                                   trafico.Descripcion,
                                   elemento.Concepto1,
                               };

                foreach (var elemento in concepto) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Operador_Id = elemento.Operador_Id,
                        Nombre = elemento.Nombre,
                        Trafico_Id = elemento.Trafico_Id,
                        TraficoDescripcion = elemento.Descripcion,
                        //TraficoDescripcion = db.Trafico.Where(x => x.Id == elemento.Trafico_Id).SingleOrDefault().Descripcion,
                        Concepto1 = elemento.Concepto1
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
        #region Metodos
        public JsonResult agregar(int? Operador, int Trafico, string TraficoDescripcion, string Concepto1, int lineaNegocio)
        {
            Concepto concepto = db.Concepto.Where(x => x.Operador_Id == Operador && x.Trafico_Id == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            object respuesta = null;
            if (concepto == null) {
                try {
                    var nuevo = new Concepto();
                    nuevo.Operador_Id = Operador;
                    nuevo.Trafico_Id = Trafico;
                    nuevo.TraficoDescripcion = TraficoDescripcion;
                    nuevo.Concepto1 = Concepto1;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.Concepto.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "Concepto.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ex) {
                    respuesta = new { success = false, results = ex.Message };
                }
            } else {
                respuesta = new
                {
                    success = false,
                    results = "El Operador y Tráfico actual ya están dados de alta"
                };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult modificar(int Id, int? Operador, int Trafico, string TraficoDescripcion, string Concepto1, int lineaNegocio)
        {
            object respuesta = null;
            Concepto concepto = db.Concepto.Where(x => x.Operador_Id == Operador && x.Trafico_Id == Trafico && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();

            if (concepto == null || concepto.Id == Id) {
                try {
                    Concepto oConcepto = db.Concepto.Where(x => x.Id == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
                    oConcepto.Operador_Id = Operador;
                    oConcepto.Trafico_Id = Trafico;
                    oConcepto.TraficoDescripcion = TraficoDescripcion;
                    oConcepto.Concepto1 = Concepto1;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oConcepto, "Id", oConcepto.Id, "Concepto.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                } catch (Exception ex) {
                    respuesta = new
                    {
                        success = false,
                        results = "Un error ocurrió mientras se realizaba la petición.\n Error: " + ex.Message.ToString()
                    };
                }
            } else {
                respuesta = new
                {
                    success = false,
                    results = "El Operador y Tráfico actual ya están dados de alta"
                };
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

                        string strresp_val = funGralCtrl.ValidaRelacion("Concepto", Id);
                        if (strresp_val.Length == 0)
                        {
                            Concepto oConcepto = db.Concepto.Where(x => x.Id == Id).SingleOrDefault();
                        oConcepto.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oConcepto, "Eliminado", "Concepto.html", Request.UserHostAddress);

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
                respuesta = new { success = blsucc, results = strmsg };
            } catch (Exception ex) {
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
        public JsonResult llenaTrafico(int lineaNegocio, int start, int limit)
        {
            object respuesta = null;
            int total;
            try {
                List<Trafico> lista = new List<Trafico>();
                var trafico = from oTrafico in db.Trafico
                              where oTrafico.Activo == 1 && oTrafico.Id_LineaNegocio == lineaNegocio
                              select new
                              {
                                  oTrafico.Id,
                                  oTrafico.Id_TraficoTR,
                                  oTrafico.Descripcion
                              };
                foreach (var elemento in trafico) {
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

            string strresp_val = funGralCtrl.ValidaRelacion("Concepto", Id);

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