using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class AcuerdoTarifaController : Controller
    {
        // GET: AcuerdoTarifa
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string Costo,
                                                                            string DescripcionEntrada,
                                                                            string DescripcionSalida,
                                                                            string EntInferior,
                                                                            string EntSuperior,
                                                                            string FechaFin,
                                                                            string FechaInicio,
                                                                            string Ingreso,
                                                                            string Nombre,
                                                                            string Ratio,
                                                                            string SalInferior,
                                                                            string SalSuperior,
                                                                            string TarifaEnt,
                                                                            string TarifaSal)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {
                var acuerdo = from elemento in db.AcuerdoTarifa

                              join operador in db.Operador
                                on elemento.Id_Operador equals operador.Id into gjop
                              join traficoEnt in db.Trafico
                                 on elemento.Id_TraficoEntrada equals traficoEnt.Id into gjte
                              join traficoSal in db.Trafico
                                 on elemento.Id_TraficoSalida equals traficoSal.Id into gjts
                              from suboperador in gjop.DefaultIfEmpty()
                              from subtraficoEnt in gjte.DefaultIfEmpty()
                              from subtraficoSal in gjts.DefaultIfEmpty()
                              where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio

                              && DbFiltro.Decimal(elemento.Costo, Costo)
                              && DbFiltro.String(subtraficoEnt.Descripcion, DescripcionEntrada)
                              && DbFiltro.String(subtraficoSal.Descripcion, DescripcionSalida)
                              && DbFiltro.Decimal(elemento.EntInferior, EntInferior)
                              && DbFiltro.Decimal(elemento.EntSuperior, EntSuperior)
                              && DbFiltro.Date(elemento.FechaFin, FechaFin, "dma")
                              && DbFiltro.Date(elemento.FechaInicio, FechaInicio, "dma")
                              && DbFiltro.Decimal(elemento.Ingreso, Ingreso)
                              && DbFiltro.String(suboperador.Nombre, Nombre)
                              && DbFiltro.Decimal(elemento.Ratio, Ratio)
                              && DbFiltro.Decimal(elemento.SalInferior, SalInferior)
                              && DbFiltro.Decimal(elemento.SalSuperior, SalSuperior)
                              && DbFiltro.Decimal(elemento.TarifaEnt, TarifaEnt)
                              && DbFiltro.Decimal(elemento.TarifaSal, TarifaSal)

                              select new
                              {
                                  elemento.IdAcuerdo,
                                  elemento.Id_Acuerdo,
                                  elemento.Id_Operador,
                                  Nombre = suboperador.Nombre ?? String.Empty,
                                  EntInferior= elemento.EntInferior,
                                  EntSuperior = elemento.EntSuperior,
                                  TarifaEnt = elemento.TarifaEnt,
                                  Ingreso = elemento.Ingreso,
                                  SalInferior = elemento.SalInferior,
                                  SalSuperior = elemento.SalSuperior,
                                  TarifaSal = elemento.TarifaSal,
                                  Costo = elemento.Costo,
                                  Ratio = elemento.Ratio,
                                  elemento.FechaInicio,
                                  elemento.FechaFin,
                                  Id_TraficoEntrada = elemento.Id_TraficoEntrada,
                                  Id_TraficoSalida = elemento.Id_TraficoSalida,
                                  descripcionEnt = subtraficoEnt.Descripcion ?? String.Empty,
                                  descripcionSal = subtraficoSal.Descripcion ?? String.Empty
                              };
                             
                foreach (var elemento in acuerdo)
                {
                    lista.Add(new
                    {
                        Id = elemento.IdAcuerdo,
                        Id_Acuerdo = elemento.Id_Acuerdo,
                        Id_Operador = elemento.Id_Operador,
                        Nombre=elemento.Nombre,
                        EntInferior = elemento.EntInferior,
                        EntSuperior = elemento.EntSuperior,
                        TarifaEnt=elemento.TarifaEnt,
                        Ingreso=elemento.Ingreso,
                        SalInferior=elemento.SalInferior,
                        SalSuperior=elemento.SalSuperior,
                        TarifaSal=elemento.TarifaSal,
                        Costo=elemento.Costo,
                        Ratio=elemento.Ratio,
                        FechaInicio = elemento.FechaInicio.Value.ToString("dd-MM-yyyy"),
                        FechaFin = elemento.FechaFin.Value.ToString("dd-MM-yyyy"),
                        Id_TraficoEntrada=elemento.Id_TraficoEntrada,
                        Id_TraficoSalida=elemento.Id_TraficoSalida,
                        DescripcionEntrada = elemento.descripcionEnt,
                        DescripcionSalida = elemento.descripcionSal
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

        public JsonResult agregar(string Id_Acuerdo, int Operador, int TraficoEnt, decimal EntInferior, decimal EntSuperior, decimal TarifaEnt, decimal Ingreso, int TraficoSal, decimal SalInferior, decimal SalSuperior, decimal TarifaSal, decimal Costo, decimal Ratio, DateTime FechaInicio, DateTime FechaFin, int lineaNegocio)
        {
            object respuesta = null;
            bool rango = true, trafico = true;
            if (FechaInicio > FechaFin)
                rango = false;
            if (TraficoEnt == TraficoSal)
                trafico = false;
                
            try
            {
                if (rango == true && trafico == true )
                {
                    var nuevo = new AcuerdoTarifa();
                    nuevo.Id_Acuerdo = Id_Acuerdo;
                    nuevo.Id_Operador = Operador;
                    nuevo.Id_TraficoEntrada = TraficoEnt;
                    nuevo.EntInferior = EntInferior;
                    nuevo.EntSuperior = EntSuperior;
                    nuevo.TarifaEnt = TarifaEnt;
                    nuevo.Ingreso = Ingreso;
                    nuevo.Id_TraficoSalida = TraficoSal;
                    nuevo.SalInferior = SalInferior;
                    nuevo.SalSuperior = SalSuperior;
                    nuevo.TarifaSal = TarifaSal;
                    nuevo.Costo = Costo;
                    nuevo.Ratio = Ratio;
                    nuevo.FechaInicio = FechaInicio;
                    nuevo.FechaFin = FechaFin;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = lineaNegocio;
                    db.AcuerdoTarifa.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "AcuerdoTarifa.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                    respuesta = new { success = true, results = "no", rango=rango, trafico = trafico};

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar(int Id, int Operador, int TraficoEnt, decimal EntInferior, decimal EntSuperior, decimal TarifaEnt, decimal Ingreso, int TraficoSal, decimal SalInferior, decimal SalSuperior, decimal TarifaSal, decimal Costo, decimal Ratio, DateTime FechaInicio, DateTime FechaFin, int lineaNegocio)
        {
            object respuesta = null;
            AcuerdoTarifa oAcuerdo = db.AcuerdoTarifa.Where(x => x.IdAcuerdo == Id && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
            DateTime fecha_modificacion = DateTime.Now;
            bool rango = true, trafico = true;
            if (FechaInicio > FechaFin)
                rango = false;
            if (TraficoEnt == TraficoSal)
                trafico = false;

            try
            {
                if (rango == true && trafico == true)
                {

                    oAcuerdo.Id_Operador = Operador;
                    oAcuerdo.Id_TraficoEntrada = TraficoEnt;
                    oAcuerdo.EntInferior = EntInferior;
                    oAcuerdo.EntSuperior = EntSuperior;
                    oAcuerdo.TarifaEnt = TarifaEnt;
                    oAcuerdo.Ingreso = Ingreso;
                    oAcuerdo.Id_TraficoSalida = TraficoSal;
                    oAcuerdo.SalInferior = SalInferior;
                    oAcuerdo.SalSuperior = SalSuperior;
                    oAcuerdo.TarifaSal = TarifaSal;
                    oAcuerdo.Costo = Costo;
                    oAcuerdo.Ratio = Ratio;
                    oAcuerdo.FechaInicio = FechaInicio;
                    oAcuerdo.FechaFin = FechaFin;
                    oAcuerdo.fecha_modificacion = fecha_modificacion;
                    Log log = new Log();
                    log.insertaBitacoraModificacion(oAcuerdo, "IdAcuerdo", oAcuerdo.IdAcuerdo, "AcuerdoTarifa.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };
                }
                else
                    respuesta = new { success = true, results = "no", rango, trafico };

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
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            strID = strID.TrimEnd(',');
            object respuesta;
            try
            {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);
                        string strresp_val = funGralCtrl.ValidaRelacion("AcuerdoTarifa", Id);

                        if (strresp_val.Length == 0)
                        {
                            AcuerdoTarifa oAcuerdo = db.AcuerdoTarifa.Where(x => x.IdAcuerdo == Id).SingleOrDefault();
                            oAcuerdo.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(oAcuerdo, "Eliminado", "AcuerdoTarifa.html", Request.UserHostAddress);
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

            string strresp_val = funGralCtrl.ValidaRelacion("AcuerdoTarifa", Id);

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
                //lista = lista.Skip(start).Take(limit).ToList();
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
                //lista = lista.Skip(start).Take(limit).ToList();
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