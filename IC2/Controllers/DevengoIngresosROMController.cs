using IC2.Models;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class DevengoIngresosROMController : Controller
    {
        readonly IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };
        ICPruebaEntities db = new ICPruebaEntities();
        // GET: DevengoIngresosROM
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }
        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                var datos = (from tcCierre in db.TC_Cierre
                             where tcCierre.Id_LineaNegocio == lineaNegocio
                             group tcCierre by tcCierre.Mes_Consumo into g
                             select new
                             {
                                 Id = g.Key,
                                 Periodo = g.Key
                             });
                var MaxPeriodo = datos.Max(m => m.Periodo);
                var IdMax = datos.Where(w => w.Periodo == MaxPeriodo).Select(s => s.Id);
                lista.Add(new
                {
                    IdMax,
                    Periodo = MaxPeriodo.Year + "-" + MaxPeriodo.Month + "-" + MaxPeriodo.Day,
                    Fecha = MaxPeriodo.Year + " " + meses[MaxPeriodo.Month]
                });

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenaGridDevengoIngreso(string periodo, string PPTOI, string PPTOC, decimal tipoCambio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                var list = resumenDevengoROMs(periodo, tipoCambio);
                var pptc = (decimal.Parse(PPTOC) * -1);
                var pptIMxn = (decimal.Parse(PPTOI) * tipoCambio);
                var pptCMxn = ((decimal.Parse(PPTOC) * tipoCambio) * -1);
                list.ForEach(e =>
                {
                    lista.Add(new
                    {
                        Moneda = e.Moneda,
                        Sentido = e.Sentido,
                        Fecha = periodo,
                        PPTO = e.Moneda.ToUpper() == "MXN" ? (e.Sentido.ToUpper() == "INGRESO" ? pptIMxn.ToString() : pptCMxn.ToString()) : (e.Sentido.ToUpper() == "INGRESO" ? PPTOI : pptc.ToString()),
                        DevengoTrafico = e.Devengo_Trafico,
                        CostosRecurrentes = e.Costos_Recurrentes,
                        DevengoTotal = e.Devengo_Total,
                        ProvisionTarifa = e.Provision_Tarifa,
                        AjusteRealDevengoFac = e.Ajuste_Real_Devengo_Fac,
                        AjusteRealDevengoTarifa = e.Ajuste_Real_Devengo_Tarifa,
                        AjustesExtraordinarios = e.Ajustes_Extraordinarios,
                        ImporteNeto = e.Importe_Neto,
                        DevengoPPTO = e.Sentido.ToUpper() == "INGRESO" ?
                                            (e.Importe_Neto - decimal.Parse(PPTOI)) :
                                                (e.Importe_Neto - decimal.Parse(PPTOC))
                    });
                });

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public List<ResumenDevengoROM> resumenDevengoROMs(string periodo, decimal tipoCambio)
        {
            var list = new List<ResumenDevengoROM>();
            try
            {
                var auxperiodo = DateTime.Parse(periodo).ToString("MMyyyy");
                list = db.ResumenDevengoROM.Where(R => R.Periodo == auxperiodo).ToList();
                if (list.Count == 0)
                {
                    var spExecute = db.usp_ResumenDevengo_INS(DateTime.Parse(periodo), tipoCambio);
                 
                    list = db.ResumenDevengoROM.Where(R => R.Periodo == auxperiodo).ToList();
                }
            }
            catch(Exception)
            {

            }
            return list;
        }
        public JsonResult TipoCambio(string periodo)
        {
            object respuesta = null;
            try
            {
                var mes = DateTime.Parse(periodo);
                decimal tipocambio = 0;
                var cambio = db.TC_Cierre.Where(s => s.Id_LineaNegocio == 1 &&
                                                    s.Mes_Consumo == mes &&
                                                       s.Sentido.ToUpper() == "INGRESO").Select(s => s.TC_MXN).ToList();
                cambio.Sort();
                cambio.ForEach(c => 
                {
                    tipocambio = c == 0 ? tipocambio : c;
                });
                respuesta = new { Success = true, results = tipocambio };
            }
            catch (Exception e)
            {
                respuesta = new { Success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenarGridFluctuacion(string periodo,int start, int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                var auxperiodo = DateTime.Parse(periodo).ToString("MMyyyy");
                var lista = db.DevengoFluctuacionROM.ToList();
                if (lista.Count == 0)
                {
                    var spExecuteFlut = db.usp_DevengoFluctuacionROM_INS(DateTime.Parse(periodo));
                    lista = db.DevengoFluctuacionROM.Where(F => F.Periodo == auxperiodo).ToList();
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch(Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LlenarGridAjustes(string periodo,int start,int limit)
        {
            object respuesta = null;
            int total;
            try
            {
                var auxperiodo = DateTime.Parse(periodo);
                var lista = db.DevengoAjustesROM.Where(w => w.Periodo == auxperiodo).ToList();
                if (lista.Count == 0)
                {
                    var spExecuteFlut = db.usp_DevengoAjustesROM(DateTime.Parse(periodo));
                    lista = db.DevengoAjustesROM.Where(w => w.Periodo == auxperiodo).ToList();
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ExportExcel(string periodo, string PPTOI, string PPTOC, decimal tipoCambio)
        {
            object respuesta = null;
            var r = new Random();
            var nameFile = $"ResumenDevengoROM{periodo}{r.Next(1, 1000)}.xlsx";
            var template = Server.MapPath("~/Plantillas/ResumenDevengoROM.xlsx");
            FileInfo datafile = new FileInfo(template);
            try
            {
                using (ExcelPackage excelPackage = new ExcelPackage(datafile))
                {
                    try
                    {
                        ExcelWorksheet worksheetDevengo = excelPackage.Workbook.Worksheets["Devengo"];
                        sheetDevengo(ref worksheetDevengo,periodo, PPTOI,PPTOC,tipoCambio);
                        ExcelWorksheet worksheetAjuste = excelPackage.Workbook.Worksheets["Ajustes"];
                        sheetAjustes(ref worksheetAjuste,periodo);
                        ExcelWorksheet worksheetFluctuaciones = excelPackage.Workbook.Worksheets["Fluctuacion"];
                        sheetFluctuacion(ref worksheetFluctuaciones);
                        byte[] bytesfile = excelPackage.GetAsByteArray();
                        respuesta = new { responseText = nameFile, Success = true, bytes = bytesfile };
                    }
                    catch (Exception err)
                    {
                        respuesta = new { results = err.Message, success = false };
                    }
                    return Json(respuesta, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public void sheetDevengo(ref ExcelWorksheet worksheetDevengo, string periodo, string PPTOI, string PPTOC, decimal tipoCambio)
        {
            try
            {
                var lista = new List<DevengoRom>();
                var list = resumenDevengoROMs(periodo, tipoCambio);
                var pptc = (decimal.Parse(PPTOC));
                var pptIMxn = (decimal.Parse(PPTOI) * tipoCambio);
                var pptCMxn = ((decimal.Parse(PPTOC) * tipoCambio));
                list.ForEach(e =>
                {
                    lista.Add(new DevengoRom
                    {
                        Sentido = e.Sentido,
                        Moneda = e.Moneda,
                        PPTO = e.Moneda.ToUpper() == "MXN" ? (e.Sentido.ToUpper() == "INGRESO" ? pptIMxn : pptCMxn) : (e.Sentido.ToUpper() == "INGRESO" ? decimal.Parse(PPTOI) : pptc),
                        DevengoTrafico = e.Devengo_Trafico == null ? 0 : decimal.Parse(e.Devengo_Trafico.ToString()),
                        CostosRecurrentes = e.Costos_Recurrentes == null ? 0 : decimal.Parse(e.Costos_Recurrentes.ToString()),
                        DevengoTotal = e.Devengo_Total == null ? 0 : decimal.Parse(e.Devengo_Total.ToString()),
                        ProvisionTarifa = e.Provision_Tarifa == null ? 0 : decimal.Parse(e.Provision_Tarifa.ToString()),
                        AjusteRealDevengoFac = e.Ajuste_Real_Devengo_Fac == null ? 0 : decimal.Parse(e.Ajuste_Real_Devengo_Fac.ToString()),
                        AjusteRealDevengoTarifa = e.Ajuste_Real_Devengo_Tarifa == null ? 0 : decimal.Parse(e.Ajuste_Real_Devengo_Tarifa.ToString()),
                        AjustesExtraordinarios = e.Ajustes_Extraordinarios == null ? 0 : decimal.Parse(e.Ajustes_Extraordinarios.ToString()),
                        ImporteNeto = e.Importe_Neto == null ? 0 : decimal.Parse(e.Importe_Neto.ToString()),
                        DevengoPPTO = e.Sentido.ToUpper() == "INGRESO" ?
                                            (e.Importe_Neto == null ? 0 : decimal.Parse(e.Importe_Neto.ToString()) - decimal.Parse(PPTOI)) :
                                                (e.Importe_Neto == null ? 0 : decimal.Parse(e.Importe_Neto.ToString()) - decimal.Parse(PPTOC))
                    });
                });
                //lista = lista.OrderByDescending(x=> x.Sentido).ToList();
                lista = (from item in lista orderby item.Moneda, item.Sentido descending select item).ToList();
                lista = lista.OrderByDescending(x => x.Moneda).ToList();
                var idFila = 4;
                worksheetDevengo.Cells[($"E1")].Value = DateTime.Parse(periodo).ToString("yyyy/MM/dd");
                worksheetDevengo.Cells[($"E2")].Value = tipoCambio;
                foreach (DevengoRom item in lista)
                {
                    worksheetDevengo.Cells[($"B{idFila}")].Value = item.PPTO;
                    worksheetDevengo.Cells[($"C{idFila}")].Value = item.DevengoTrafico;
                    worksheetDevengo.Cells[($"D{idFila}")].Value = item.CostosRecurrentes;
                    worksheetDevengo.Cells[($"F{idFila}")].Value = item.DevengoTotal;
                    worksheetDevengo.Cells[($"G{idFila}")].Value = item.ProvisionTarifa;
                    worksheetDevengo.Cells[($"H{idFila}")].Value = item.AjusteRealDevengoFac;
                    worksheetDevengo.Cells[($"I{idFila}")].Value = item.AjustesExtraordinarios;
                    worksheetDevengo.Cells[($"J{idFila}")].Value = item.ImporteNeto;
                    worksheetDevengo.Cells[($"K{idFila}")].Value = item.DevengoPPTO;
                    //worksheetDevengo.Cells[($"L{idFila}")].Value = item.DevengoTrafico;
                    //worksheetDevengo.Cells[($"M{idFila}")].Value = item.PPTO;
                    //worksheetDevengo.Cells[($"N{idFila}")].Value = item.DevengoTrafico;
                    //worksheetDevengo.Cells[($"O{idFila}")].Value = item.DevengoTrafico;
                    idFila++;
                }

            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public void sheetAjustes(ref ExcelWorksheet worksheetAjustes,string periodo)
        {
            try
            {
                var Periodo = new DateTime();
                Periodo = DateTime.Parse(periodo);
                var lista = db.DevengoAjustesROM.Where(w => w.Periodo == Periodo).ToList();
                var idFila = 2;
                foreach (DevengoAjustesROM item in lista)
                {
                    worksheetAjustes.Cells[($"A{idFila}")].Value = item.Sentido;
                    worksheetAjustes.Cells[($"B{idFila}")].Value = item.ImporteDevengoCierreMD;
                    worksheetAjustes.Cells[($"C{idFila}")].Value = item.TCCierre;
                    worksheetAjustes.Cells[($"D{idFila}")].Value = item.ImporteDevengoCierreMXN;
                    worksheetAjustes.Cells[($"E{idFila}")].Value = item.RealFactUSD;
                    worksheetAjustes.Cells[($"F{idFila}")].Value = item.TCSAP;
                    worksheetAjustes.Cells[($"G{idFila}")].Value = item.RealFactMXN;
                    worksheetAjustes.Cells[($"H{idFila}")].Value = item.AjusteUSD;
                    worksheetAjustes.Cells[($"I{idFila}")].Value = item.AjusteMXN;
                    idFila++;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public void sheetFluctuacion(ref ExcelWorksheet worksheetFluctuaciones)
        {
            try
            {
                var lista = db.DevengoFluctuacionROM.ToList();
                var idFila = 2;
                foreach (DevengoFluctuacionROM item in lista)
                {
                    worksheetFluctuaciones.Cells[($"A{idFila}")].Value = item.Cuenta_Contable == null ? string.Empty : item.Cuenta_Contable;
                    worksheetFluctuaciones.Cells[($"B{idFila}")].Value = item.Deudor_SAP == null ? string.Empty : item.Deudor_SAP;
                    worksheetFluctuaciones.Cells[($"C{idFila}")].Value = item.PLMN == null ? string.Empty : item.PLMN;
                    worksheetFluctuaciones.Cells[($"D{idFila}")].Value = item.Periodo;
                    worksheetFluctuaciones.Cells[($"E{idFila}")].Value = item.Tipo_Registro;
                    worksheetFluctuaciones.Cells[($"F{idFila}")].Value = item.Moneda;
                    worksheetFluctuaciones.Cells[($"G{idFila}")].Value = item.TC_Provision;
                    worksheetFluctuaciones.Cells[($"H{idFila}")].Value = item.Provision;
                    worksheetFluctuaciones.Cells[($"I{idFila}")].Value = item.Importe_MXN;
                    worksheetFluctuaciones.Cells[($"J{idFila}")].Value = item.TC_Facturado;
                    worksheetFluctuaciones.Cells[($"K{idFila}")].Value = item.Importe_Facturado;
                    worksheetFluctuaciones.Cells[($"L{idFila}")].Value = item.Importe_Facturado_MXN;
                    worksheetFluctuaciones.Cells[($"M{idFila}")].Value = item.Variacion_Real_Provicion;
                    worksheetFluctuaciones.Cells[($"N{idFila}")].Value = item.Variacion_MXN;
                    worksheetFluctuaciones.Cells[($"O{idFila}")].Value = item.Efecto_Negocio;
                    worksheetFluctuaciones.Cells[($"P{idFila}")].Value = item.Provicion_Soportada;
                    worksheetFluctuaciones.Cells[($"Q{idFila}")].Value = item.Efecto_Opertivo_Finanzas;
                    worksheetFluctuaciones.Cells[($"R{idFila}")].Value = item.Fluctuacion_Cambiaria;
                    worksheetFluctuaciones.Cells[($"S{idFila}")].Value = item.Efecto_Negocio_Neto;
                    idFila++;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public static DataTable ToDataTable<T>(IList<T> data)
        {
            PropertyDescriptorCollection props =
                TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prop = props[i];
                table.Columns.Add(prop.Name, prop.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }
    }
    public class DevengoRom
    {
        public string Sentido { get; set; }
        public string Moneda { get; set; }
        public decimal PPTO { get; set; }
        public decimal DevengoTrafico { get; set; }
        public decimal CostosRecurrentes { get; set; }
        public decimal DevengoTotal { get; set; }
        public decimal ProvisionTarifa { get; set; }
        public decimal AjusteRealDevengoFac { get; set; }
        public decimal AjusteRealDevengoTarifa { get; set; }
        public decimal AjustesExtraordinarios { get; set; }
        public decimal ImporteNeto { get; set; }
        public decimal DevengoPPTO { get; set; }
    }
}