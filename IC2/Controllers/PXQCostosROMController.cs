using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web.Mvc;
using IC2.Models;
using System.Transactions;
using OfficeOpenXml;
using System.Globalization;

namespace IC2.Controllers
{
    public class PXQCostosROMController : Controller
    {
        // GET: 
        ICPruebaEntities db = new ICPruebaEntities();
        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"}, {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"}, {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"}, {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        public ActionResult Index()
        {
            //CalcularPXQCostos(new DateTime(2018, 09, 01));
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
            //db.sp_InsertarPXQCostosROM();
            try
            {
                var datos = from oPXQ in db.PXQCostosROM
                            where oPXQ.lineaNegocio == lineaNegocio
                            group oPXQ by oPXQ.periodo_carga into g
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };

                foreach (var elemento in datos)
                {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message, total = 0 };
                lista = null;
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGrid(DateTime periodo, int start, int limit)
        {
            DateTime d = periodo.AddMonths(-1);
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;

            string dia = string.Empty;
            decimal total_MIN_MOC_REDONDEADO = 0;
            decimal total_MIN_MOC_REAL = 0;
            decimal total_SDR_MOC = 0;
            decimal total_MIN_MTC_REDONDEADO = 0;
            decimal total_MIN_MTC_REAL = 0;
            decimal total_SDR_MTC = 0;
            decimal total_SMS_MO = 0;
            decimal total_SDR_SMS = 0;
            decimal total_GPRS = 0;
            decimal total_SDR_GPRS = 0;
            decimal total_USD_MOC = 0;
            decimal total_USD_MTC = 0;
            decimal total_USD_SMS_MO = 0;
            decimal total_USD_GPRS = 0;
            decimal total_COSTO_TRAFICO_USD = 0;
            //decimal total_total_USD = 0;
            decimal total_tarifa_MOC = 0;
            decimal total_tarifa_MTC = 0;
            decimal total_tarifa_SMS_MO = 0;
            decimal total_tarifa_GPRS = 0;
            decimal total_IOT_TAR_MOC = 0;
            decimal total_IOT_TAR_MTC = 0;
            decimal total_IOT_TAR_SMS_MO = 0;
            decimal total_IOT_TAR_GPRS = 0;
            decimal total_USD_MOC_IOTFacturado = 0;
            decimal total_USD_MTC_IOTFacturado = 0;
            decimal total_USD_SMS_MO_IOTFacturado = 0;
            decimal total_USD_GPRS_IOTFacturado = 0;
            decimal total_USD_MOC_IOT_REAL = 0;
            decimal total_USD_MTC_IOT_REAL = 0;
            decimal total_USD_MOC_IOT_DESC = 0;
            decimal total_USD_MTC_IOT_DESC = 0;
            decimal total_USD_SMS_MO_IOT_DESC = 0;
            decimal total_USD_GPRS_IOT_DESC = 0;
            decimal total_USD_SUMA_PROV_TARIFA = 0;
            decimal total_costosFijosRecurrentes = 0;
            decimal total_PROVRealTarifaMesAnteriorUSD = 0;
            decimal total_PROVTarMesAnteriorUSD = 0;
            decimal total_ajuste_Real_VS_DevengoTarifaMesAnteriroUSD = 0;
            decimal total_total_USD_PROV_Tarifa = 0;
            decimal total_facturacionRealMesAnteriorUSD = 0;
            decimal total_PROVTraficoMesAnteriorUSD = 0;
            decimal total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD = 0;
            decimal total_ajusteSaldoMesAnterior = 0;
            decimal total_totalUSDTrafico = 0;
            decimal total_ajusteTraficoMesAnterior = 0;
            decimal total_ajusteTarifaMesAnterior = 0;
            decimal total_ajusteCostosRecurresntesMesesAnteriores = 0;
            decimal total_complementoTarifaMesAnterior = 0;
            decimal total_ajusteMesesAnterioresUSD = 0;
            decimal total_totalNeto = 0;

            try
            {
                var query = from pc in db.PXQCostosROM
                            where pc.periodo_carga.Month == periodo.Month &&
                            pc.periodo_carga.Year == periodo.Year &&
                            pc.lineaNegocio == 1
                            orderby pc.PLMN_V
                            select new
                            {
                                pc.Id,
                                pc.fecha,
                                pc.PLMNPROVTAR,
                                pc.PLMN_V,
                                pc.PLMN_GPO,
                                pc.pais,
                                pc.acreedor,
                                pc.MIN_MOC_REDONDEADO,
                                pc.MIN_MOC_REAL,
                                pc.SDR_MOC,
                                pc.MIN_MTC_REDONDEADO,
                                pc.MIN_MTC_REAL,
                                pc.SDR_MTC,
                                pc.SMS_MO,
                                pc.SDR_SMS,
                                pc.GPRS,
                                pc.SDR_GPRS,
                                pc.USD_MOC,
                                pc.USD_MTC,
                                pc.USD_SMS_MO,
                                pc.USD_GPRS,
                                pc.COSTO_TRAFICO_USD,
                                pc.tarifa_MOC,
                                pc.tarifa_MTC,
                                pc.tarifa_SMS_MO,
                                pc.tarifa_GPRS,
                                pc.IOT_TAR_MOC,
                                pc.IOT_TAR_MTC,
                                pc.IOT_TAR_SMS_MO,
                                pc.IOT_TAR_GPRS,
                                pc.USD_MOC_IOTFacturado,
                                pc.USD_MTC_IOTFacturado,
                                pc.USD_SMS_MO_IOTFacturado,
                                pc.USD_GPRS_IOTFacturado,
                                pc.USD_MOC_IOT_REAL,
                                pc.USD_MTC_IOT_REAL,
                                pc.USD_MOC_IOT_DESC,
                                pc.USD_MTC_IOT_DESC,
                                pc.USD_SMS_MO_IOT_DESC,
                                pc.USD_GPRS_IOT_DESC,
                                pc.USD_SUMA_PROV_TARIFA,
                                pc.costosFijosRecurrentes,
                                pc.PROVRealTarifaMesAnteriorUSD,
                                pc.PROVTarMesAnteriorUSD,
                                pc.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                                pc.total_USD_PROV_Tarifa,
                                pc.facturacionRealMesAnteriorUSD,
                                pc.PROVTraficoMesAnteriorUSD,
                                pc.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                pc.ajusteSaldoMesAnterior,
                                pc.totalUSDTrafico,
                                pc.ajusteTraficoMesAnterior,
                                pc.ajusteTarifaMesAnterior,
                                pc.ajusteCostosRecurresntesMesesAnteriores,
                                pc.complementoTarifaMesAnterior,
                                pc.ajusteMesesAnterioresUSD,
                                pc.totalNeto,
                                pc.lineaNegocio
                            };
                foreach (var elemento in query)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        fecha = elemento.fecha.Day + "/" + elemento.fecha.Month + "/" + elemento.fecha.Year,
                        elemento.PLMNPROVTAR,
                        elemento.PLMN_V,
                        elemento.PLMN_GPO,
                        elemento.pais,
                        elemento.acreedor,
                        elemento.MIN_MOC_REDONDEADO,
                        elemento.MIN_MOC_REAL,
                        elemento.SDR_MOC,
                        elemento.MIN_MTC_REDONDEADO,
                        elemento.MIN_MTC_REAL,
                        elemento.SDR_MTC,
                        elemento.SMS_MO,
                        elemento.SDR_SMS,
                        elemento.GPRS,
                        elemento.SDR_GPRS,
                        elemento.USD_MOC,
                        elemento.USD_MTC,
                        elemento.USD_SMS_MO,
                        elemento.USD_GPRS,
                        elemento.COSTO_TRAFICO_USD,
                        elemento.tarifa_MOC,
                        elemento.tarifa_MTC,
                        elemento.tarifa_SMS_MO,
                        elemento.tarifa_GPRS,
                        elemento.IOT_TAR_MOC,
                        elemento.IOT_TAR_MTC,
                        elemento.IOT_TAR_SMS_MO,
                        elemento.IOT_TAR_GPRS,
                        elemento.USD_MOC_IOTFacturado,
                        elemento.USD_MTC_IOTFacturado,
                        elemento.USD_SMS_MO_IOTFacturado,
                        elemento.USD_GPRS_IOTFacturado,
                        elemento.USD_MOC_IOT_REAL,
                        elemento.USD_MTC_IOT_REAL,
                        elemento.USD_MOC_IOT_DESC,
                        elemento.USD_MTC_IOT_DESC,
                        elemento.USD_SMS_MO_IOT_DESC,
                        elemento.USD_GPRS_IOT_DESC,
                        elemento.USD_SUMA_PROV_TARIFA,
                        elemento.costosFijosRecurrentes,
                        elemento.PROVRealTarifaMesAnteriorUSD,
                        elemento.PROVTarMesAnteriorUSD,
                        elemento.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                        elemento.total_USD_PROV_Tarifa,
                        elemento.facturacionRealMesAnteriorUSD,
                        elemento.PROVTraficoMesAnteriorUSD,
                        elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                        elemento.ajusteSaldoMesAnterior,
                        elemento.totalUSDTrafico,
                        elemento.ajusteTraficoMesAnterior,
                        elemento.ajusteTarifaMesAnterior,
                        elemento.ajusteCostosRecurresntesMesesAnteriores,
                        elemento.complementoTarifaMesAnterior,
                        elemento.ajusteMesesAnterioresUSD,
                        elemento.totalNeto,
                        elemento.lineaNegocio
                    });

                    dia = elemento.fecha.Day + "-" + elemento.fecha.Month + "-" + elemento.fecha.Year;
                    total_MIN_MOC_REDONDEADO += Convert.ToDecimal(elemento.MIN_MOC_REDONDEADO);
                    total_MIN_MOC_REAL += Convert.ToDecimal(elemento.MIN_MOC_REAL);
                    total_SDR_MOC += Convert.ToDecimal(elemento.SDR_MOC);
                    total_MIN_MTC_REDONDEADO += Convert.ToDecimal(elemento.MIN_MTC_REDONDEADO);
                    total_MIN_MTC_REAL += Convert.ToDecimal(elemento.MIN_MTC_REAL);
                    total_SDR_MTC += Convert.ToDecimal(elemento.SDR_MTC);
                    total_SMS_MO += Convert.ToDecimal(elemento.SMS_MO);
                    total_SDR_SMS += Convert.ToDecimal(elemento.SDR_SMS);
                    total_GPRS += Convert.ToDecimal(elemento.GPRS);
                    total_SDR_GPRS += Convert.ToDecimal(elemento.SDR_GPRS);
                    total_USD_MOC += Convert.ToDecimal(elemento.USD_MOC);
                    total_USD_MTC += Convert.ToDecimal(elemento.USD_MTC);
                    total_USD_SMS_MO += Convert.ToDecimal(elemento.USD_SMS_MO);
                    total_USD_GPRS += Convert.ToDecimal(elemento.USD_GPRS);
                    total_COSTO_TRAFICO_USD += Convert.ToDecimal(elemento.COSTO_TRAFICO_USD);
                    total_tarifa_MOC += Convert.ToDecimal(elemento.tarifa_MOC);
                    total_tarifa_MTC += Convert.ToDecimal(elemento.tarifa_MTC);
                    total_tarifa_SMS_MO += Convert.ToDecimal(elemento.tarifa_SMS_MO);
                    total_tarifa_GPRS += Convert.ToDecimal(elemento.tarifa_GPRS);
                    total_IOT_TAR_MOC += Convert.ToDecimal(elemento.IOT_TAR_MOC);
                    total_IOT_TAR_MTC += Convert.ToDecimal(elemento.IOT_TAR_MTC);
                    total_IOT_TAR_SMS_MO += Convert.ToDecimal(elemento.IOT_TAR_GPRS);
                    total_IOT_TAR_GPRS += Convert.ToDecimal(elemento.IOT_TAR_GPRS);
                    total_USD_MOC_IOTFacturado += Convert.ToDecimal(elemento.USD_MOC_IOTFacturado);
                    total_USD_MTC_IOTFacturado += Convert.ToDecimal(elemento.USD_MTC_IOTFacturado);
                    total_USD_SMS_MO_IOTFacturado += Convert.ToDecimal(elemento.USD_SMS_MO_IOTFacturado);
                    total_USD_GPRS_IOTFacturado += Convert.ToDecimal(elemento.USD_GPRS_IOTFacturado);
                    total_USD_MOC_IOT_REAL += Convert.ToDecimal(elemento.USD_MOC_IOT_REAL);
                    total_USD_MTC_IOT_REAL += Convert.ToDecimal(elemento.USD_MTC_IOT_REAL);
                    total_USD_MOC_IOT_DESC += Convert.ToDecimal(elemento.USD_MOC_IOT_DESC);
                    total_USD_MTC_IOT_DESC += Convert.ToDecimal(elemento.USD_MTC_IOT_DESC);
                    total_USD_SMS_MO_IOT_DESC += Convert.ToDecimal(elemento.USD_SMS_MO_IOT_DESC);
                    total_USD_GPRS_IOT_DESC += Convert.ToDecimal(elemento.USD_GPRS_IOT_DESC);
                    total_USD_SUMA_PROV_TARIFA += Convert.ToDecimal(elemento.USD_SUMA_PROV_TARIFA);
                    
                    total_PROVRealTarifaMesAnteriorUSD += Convert.ToDecimal(elemento.PROVRealTarifaMesAnteriorUSD);
                    total_PROVTarMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTarMesAnteriorUSD);
                    total_ajuste_Real_VS_DevengoTarifaMesAnteriroUSD += Convert.ToDecimal(elemento.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD);
                    total_ajusteSaldoMesAnterior += Convert.ToDecimal(elemento.ajusteSaldoMesAnterior);
                    total_total_USD_PROV_Tarifa += Convert.ToDecimal(elemento.total_USD_PROV_Tarifa);
                    total_facturacionRealMesAnteriorUSD += Convert.ToDecimal(elemento.facturacionRealMesAnteriorUSD);
                    total_PROVTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTraficoMesAnteriorUSD);
                    total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                    total_ajusteTraficoMesAnterior += Convert.ToDecimal(elemento.ajusteTraficoMesAnterior);
                    total_ajusteTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteTarifaMesAnterior);
                    total_ajusteCostosRecurresntesMesesAnteriores += Convert.ToDecimal(elemento.ajusteCostosRecurresntesMesesAnteriores);
                    total_complementoTarifaMesAnterior += Convert.ToDecimal(elemento.complementoTarifaMesAnterior);
                    total_ajusteMesesAnterioresUSD += Convert.ToDecimal(elemento.ajusteMesesAnterioresUSD);
                    total_totalUSDTrafico += Convert.ToDecimal(elemento.totalUSDTrafico);
                    total_totalNeto += Convert.ToDecimal(elemento.totalNeto);
                }

                total = lista.Count();


              
                var ajusteTraficosum = (from pc in db.PeriodosAnterioresCostoROM
                                      where pc.BanderaConcepto == "TRAFICO"
                                      select pc.Importe).Sum();

                var ajusteTarifasum = (from pc in db.PeriodosAnterioresCostoROM
                                    where pc.BanderaConcepto == "TARIFA"
                                    select pc.Importe).Sum();

                var costofr = from costoFR in db.CostoFR
                              where (periodo >= costoFR.Fecha_Inicio && periodo <= costoFR.Fecha_Fin) && costoFR.Id_LineaNegocio == 1
                                    && costoFR.Activo == 1
                              select new
                              {
                                  costoFR.Operador,
                                  costoFR.Importe
                              };

                foreach (var elemento in costofr)
                {
                    lista.Add(new
                    {
                        PLMNPROVTAR = "COSTOS RECURRENTES",
                        PLMN_V = elemento.Operador,
                        costosFijosRecurrentes = elemento.Importe
                       
                    });
                    
                    total_costosFijosRecurrentes += Convert.ToDecimal(elemento.Importe);
                }

                lista.Add(new
                {
                    PLMNPROVTAR = "TARIFA",
                    PLMN_V = "AJUSTE TARIFA MESES ANTERIORES",
                    ajusteTarifaMesAnterior = ajusteTarifasum
                });

                lista.Add(new
                {
                    PLMNPROVTAR = "TRAFICO",
                    PLMN_V = "Ajustes trafico meses anteriores",
                    ajusteTraficoMesAnterior = ajusteTraficosum
                });
                

                lista = lista.Skip(start).Take(limit).ToList();

                lista.Add(new
                {
                    acreedor = "SUMAS TOTALES",
                    MIN_MOC_REDONDEADO = total_MIN_MOC_REDONDEADO,
                    MIN_MOC_REAL = total_MIN_MOC_REAL,
                    SDR_MOC = total_SDR_MOC,
                    MIN_MTC_REDONDEADO = total_MIN_MTC_REDONDEADO,
                    MIN_MTC_REAL = total_MIN_MTC_REAL,
                    SDR_MTC = total_SDR_MTC,
                    SMS_MO = total_SMS_MO,
                    SDR_SMS = total_SDR_SMS,
                    GPRS = total_GPRS,
                    SDR_GPRS = total_SDR_GPRS,
                    USD_MOC = total_USD_MOC,
                    USD_MTC = total_USD_MTC,
                    USD_SMS_MO = total_USD_SMS_MO,
                    USD_GPRS = total_USD_GPRS,
                    COSTO_TRAFICO_USD = total_COSTO_TRAFICO_USD,
                    tarifa_MOC = total_tarifa_MOC,
                    tarifa_MTC = total_tarifa_MTC,
                    tarifa_SMS_MO = total_tarifa_SMS_MO,
                    tarifa_GPRS = total_tarifa_GPRS,
                    IOT_TAR_MOC = total_IOT_TAR_MOC,
                    IOT_TAR_MTC = total_IOT_TAR_MTC,
                    IOT_TAR_SMS_MO = total_IOT_TAR_SMS_MO,
                    IOT_TAR_GPRS = total_IOT_TAR_GPRS,
                    USD_MOC_IOTFacturado = total_USD_MOC_IOTFacturado,
                    USD_MTC_IOTFacturado = total_USD_MTC_IOTFacturado,
                    USD_SMS_MO_IOTFacturado = total_USD_SMS_MO_IOTFacturado,
                    USD_GPRS_IOTFacturado = total_USD_GPRS_IOTFacturado,
                    USD_MOC_IOT_REAL = total_USD_MOC_IOT_REAL,
                    USD_MTC_IOT_REAL = total_USD_MTC_IOT_REAL,
                    USD_MOC_IOT_DESC = total_USD_MOC_IOT_DESC,
                    USD_MTC_IOT_DESC = total_USD_MTC_IOT_DESC,
                    USD_SMS_MO_IOT_DESC = total_USD_SMS_MO_IOT_DESC,
                    USD_GPRS_IOT_DESC = total_USD_GPRS_IOT_DESC,
                    USD_SUMA_PROV_TARIFA = total_USD_SUMA_PROV_TARIFA,
                    costosFijosRecurrentes = total_costosFijosRecurrentes,
                    PROVRealTarifaMesAnteriorUSD = total_PROVRealTarifaMesAnteriorUSD,
                    PROVTarMesAnteriorUSD = total_PROVTarMesAnteriorUSD,
                    ajuste_Real_VS_DevengoTarifaMesAnteriroUSD = total_ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                    total_USD_PROV_Tarifa = total_total_USD_PROV_Tarifa,
                    facturacionRealMesAnteriorUSD = total_facturacionRealMesAnteriorUSD,
                    PROVTraficoMesAnteriorUSD = total_PROVTraficoMesAnteriorUSD,
                    ajusteReal_VS_DevengoTraficoMesAnteriorUSD = total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                    ajusteSaldoMesAnterior = total_ajusteSaldoMesAnterior,
                    totalUSDTrafico = total_totalUSDTrafico,
                    ajusteTraficoMesAnterior = total_ajusteTraficoMesAnterior + ajusteTraficosum,
                    ajusteTarifaMesAnterior = total_ajusteTarifaMesAnterior + ajusteTarifasum,
                    ajusteCostosRecurresntesMesesAnteriores = total_ajusteCostosRecurresntesMesesAnteriores,
                    complementoTarifaMesAnterior = total_complementoTarifaMesAnterior,
                    ajusteMesesAnterioresUSD = total_ajusteMesesAnterioresUSD + ajusteTraficosum + ajusteTarifasum,
                    totalNeto = total_totalNeto
                });
                respuesta = new { results = lista, start = start, limit = limit, total = total, succes = true };

            }
            catch (Exception e)
            {
                respuesta = new { results = e, success = false };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult ExportarReporte(DateTime periodo)
        {
            decimal total_MIN_MOC_REDONDEADO = 0;
            decimal total_MIN_MOC_REAL = 0;
            decimal total_SDR_MOC = 0;
            decimal total_MIN_MTC_REDONDEADO = 0;
            decimal total_MIN_MTC_REAL = 0;
            decimal total_SDR_MTC = 0;
            decimal total_SMS_MO = 0;
            decimal total_SDR_SMS = 0;
            decimal total_GPRS = 0;
            decimal total_SDR_GPRS = 0;
            decimal total_USD_MOC = 0;
            decimal total_USD_MTC = 0;
            decimal total_USD_SMS_MO = 0;
            decimal total_USD_GPRS = 0;
            decimal total_COSTO_TRAFICO_USD = 0;
            decimal total_tarifa_MOC = 0;
            decimal total_tarifa_MTC = 0;
            decimal total_tarifa_SMS_MO = 0;
            decimal total_tarifa_GPRS = 0;
            decimal total_IOT_TAR_MOC = 0;
            decimal total_IOT_TAR_MTC = 0;
            decimal total_IOT_TAR_SMS_MO = 0;
            decimal total_IOT_TAR_GPRS = 0;
            decimal total_USD_MOC_IOTFacturado = 0;
            decimal total_USD_MTC_IOTFacturado = 0;
            decimal total_USD_SMS_MO_IOTFacturado = 0;
            decimal total_USD_GPRS_IOTFacturado = 0;
            decimal total_USD_MOC_IOT_REAL = 0;
            decimal total_USD_MTC_IOT_REAL = 0;
            decimal total_USD_MOC_IOT_DESC = 0;
            decimal total_USD_MTC_IOT_DESC = 0;
            decimal total_USD_SMS_MO_IOT_DESC = 0;
            decimal total_USD_GPRS_IOT_DESC = 0;
            decimal total_USD_SUMA_PROV_TARIFA = 0;
            decimal total_costosFijosRecurrentes = 0;
            decimal total_PROVRealTarifaMesAnteriorUSD = 0;
            decimal total_PROVTarMesAnteriorUSD = 0;
            decimal total_ajuste_Real_VS_DevengoTarifaMesAnteriroUSD = 0;
            decimal total_total_USD_PROV_Tarifa = 0;
            decimal total_facturacionRealMesAnteriorUSD = 0;
            decimal total_PROVTraficoMesAnteriorUSD = 0;
            decimal total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD = 0;
            decimal total_ajusteSaldoMesAnterior = 0;
            decimal total_totalUSDTrafico = 0;
            decimal total_ajusteTraficoMesAnterior = 0;
            decimal total_ajusteTarifaMesAnterior = 0;
            decimal total_ajusteCostosRecurresntesMesesAnteriores = 0;
            decimal total_complementoTarifaMesAnterior = 0;
            decimal total_ajusteMesesAnterioresUSD = 0;
            decimal total_totalNeto = 0;

            CultureInfo info = new CultureInfo("es-ES", false);
            DateTime d = periodo.AddMonths(-1);
            string nombreArchivo = "PxQ ROM " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/PxQ_ROM.xlsx");
            object respuesta = null;
            int fila = 2;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile))
            {
                ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["PxQ Costos ROM"];

                try
                {
                    List<PXQCostosROM> lista = new List<PXQCostosROM>();
                    List<CostoFR> listaCF = new List<CostoFR>();
                    var query = from PxQC in db.PXQCostosROM
                                where PxQC.fecha.Month == d.Month &&
                                        PxQC.fecha.Year == d.Year
                                orderby PxQC.PLMN_V
                                select new
                                {
                                    PxQC.Id,
                                    PxQC.fecha,
                                    PxQC.PLMNPROVTAR,
                                    PxQC.PLMN_V,
                                    PxQC.PLMN_GPO,
                                    PxQC.pais,
                                    PxQC.acreedor,
                                    PxQC.MIN_MOC_REDONDEADO,
                                    PxQC.MIN_MOC_REAL,
                                    PxQC.SDR_MOC,
                                    PxQC.MIN_MTC_REDONDEADO,
                                    PxQC.MIN_MTC_REAL,
                                    PxQC.SDR_MTC,
                                    PxQC.SMS_MO,
                                    PxQC.SDR_SMS,
                                    PxQC.GPRS,
                                    PxQC.SDR_GPRS,
                                    PxQC.USD_MOC,
                                    PxQC.USD_MTC,
                                    PxQC.USD_SMS_MO,
                                    PxQC.USD_GPRS,
                                    PxQC.COSTO_TRAFICO_USD,
                                    PxQC.tarifa_MOC,
                                    PxQC.tarifa_MTC,
                                    PxQC.tarifa_SMS_MO,
                                    PxQC.tarifa_GPRS,
                                    PxQC.IOT_TAR_MOC,
                                    PxQC.IOT_TAR_MTC,
                                    PxQC.IOT_TAR_SMS_MO,
                                    PxQC.IOT_TAR_GPRS,
                                    PxQC.USD_MOC_IOTFacturado,
                                    PxQC.USD_MTC_IOTFacturado,
                                    PxQC.USD_SMS_MO_IOTFacturado,
                                    PxQC.USD_GPRS_IOTFacturado,
                                    PxQC.USD_MOC_IOT_REAL,
                                    PxQC.USD_MTC_IOT_REAL,
                                    PxQC.USD_MOC_IOT_DESC,
                                    PxQC.USD_MTC_IOT_DESC,
                                    PxQC.USD_SMS_MO_IOT_DESC,
                                    PxQC.USD_GPRS_IOT_DESC,
                                    PxQC.USD_SUMA_PROV_TARIFA,
                                    PxQC.costosFijosRecurrentes,
                                    PxQC.PROVRealTarifaMesAnteriorUSD,
                                    PxQC.PROVTarMesAnteriorUSD,
                                    PxQC.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                                    PxQC.total_USD_PROV_Tarifa,
                                    PxQC.facturacionRealMesAnteriorUSD,
                                    PxQC.PROVTraficoMesAnteriorUSD,
                                    PxQC.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                    PxQC.ajusteSaldoMesAnterior,
                                    PxQC.totalUSDTrafico,
                                    PxQC.ajusteTraficoMesAnterior,
                                    PxQC.ajusteTarifaMesAnterior,
                                    PxQC.ajusteCostosRecurresntesMesesAnteriores,
                                    PxQC.complementoTarifaMesAnterior,
                                    PxQC.ajusteMesesAnterioresUSD,
                                    PxQC.totalNeto,
                                };
                    foreach (var elemento in query)
                    {
                        lista.Add(new PXQCostosROM
                        {
                            fecha = elemento.fecha,
                            PLMNPROVTAR = elemento.PLMNPROVTAR,
                            PLMN_V = elemento.PLMN_V,
                            PLMN_GPO = elemento.PLMN_GPO,
                            pais = elemento.pais,
                            acreedor = elemento.acreedor,
                            MIN_MOC_REDONDEADO = elemento.MIN_MOC_REDONDEADO,
                            MIN_MOC_REAL = elemento.MIN_MOC_REAL,
                            SDR_MOC = elemento.SDR_MOC,
                            MIN_MTC_REDONDEADO = elemento.MIN_MTC_REDONDEADO,
                            MIN_MTC_REAL = elemento.MIN_MTC_REAL,
                            SDR_MTC = elemento.SDR_MTC,
                            SMS_MO = elemento.SMS_MO,
                            SDR_SMS = elemento.SDR_SMS,
                            GPRS = elemento.GPRS,
                            SDR_GPRS = elemento.SDR_GPRS,
                            USD_MOC = elemento.USD_MOC,
                            USD_MTC = elemento.USD_MTC,
                            USD_SMS_MO = elemento.USD_SMS_MO,
                            USD_GPRS = elemento.USD_GPRS,
                            COSTO_TRAFICO_USD = elemento.COSTO_TRAFICO_USD,
                            tarifa_MOC = elemento.tarifa_MOC,
                            tarifa_MTC = elemento.tarifa_MTC,
                            tarifa_SMS_MO = elemento.tarifa_SMS_MO,
                            tarifa_GPRS = elemento.tarifa_GPRS,
                            IOT_TAR_MOC = elemento.IOT_TAR_MOC,
                            IOT_TAR_MTC = elemento.IOT_TAR_MTC,
                            IOT_TAR_SMS_MO = elemento.IOT_TAR_SMS_MO,
                            IOT_TAR_GPRS = elemento.IOT_TAR_GPRS,
                            USD_MOC_IOTFacturado = elemento.USD_MOC_IOTFacturado,
                            USD_MTC_IOTFacturado = elemento.USD_MTC_IOTFacturado,
                            USD_SMS_MO_IOTFacturado = elemento.USD_SMS_MO_IOTFacturado,
                            USD_GPRS_IOTFacturado = elemento.USD_GPRS_IOTFacturado,
                            USD_MOC_IOT_REAL = elemento.USD_MOC_IOT_REAL,
                            USD_MTC_IOT_REAL = elemento.USD_MTC_IOT_REAL,
                            USD_MOC_IOT_DESC = elemento.USD_MOC_IOT_DESC,
                            USD_MTC_IOT_DESC = elemento.USD_MTC_IOT_DESC,
                            USD_SMS_MO_IOT_DESC = elemento.USD_SMS_MO_IOT_DESC,
                            USD_GPRS_IOT_DESC = elemento.USD_GPRS_IOT_DESC,
                            USD_SUMA_PROV_TARIFA = elemento.USD_SUMA_PROV_TARIFA,
                            costosFijosRecurrentes = elemento.costosFijosRecurrentes,
                            PROVRealTarifaMesAnteriorUSD = elemento.PROVRealTarifaMesAnteriorUSD,
                            PROVTarMesAnteriorUSD = elemento.PROVTarMesAnteriorUSD,
                            ajuste_Real_VS_DevengoTarifaMesAnteriroUSD = elemento.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                            total_USD_PROV_Tarifa = elemento.total_USD_PROV_Tarifa,
                            facturacionRealMesAnteriorUSD = elemento.facturacionRealMesAnteriorUSD,
                            PROVTraficoMesAnteriorUSD = elemento.PROVTraficoMesAnteriorUSD,
                            ajusteReal_VS_DevengoTraficoMesAnteriorUSD = elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                            ajusteSaldoMesAnterior = elemento.ajusteSaldoMesAnterior,
                            totalUSDTrafico = elemento.totalUSDTrafico,
                            ajusteTraficoMesAnterior = elemento.ajusteTraficoMesAnterior,
                            ajusteTarifaMesAnterior = elemento.ajusteTarifaMesAnterior,
                            ajusteCostosRecurresntesMesesAnteriores = elemento.ajusteCostosRecurresntesMesesAnteriores,
                            complementoTarifaMesAnterior = elemento.complementoTarifaMesAnterior,
                            ajusteMesesAnterioresUSD = elemento.ajusteMesesAnterioresUSD,
                            totalNeto = elemento.totalNeto,

                        });
                        total_MIN_MOC_REDONDEADO += Convert.ToDecimal(elemento.MIN_MOC_REDONDEADO);
                        total_MIN_MOC_REAL += Convert.ToDecimal(elemento.MIN_MOC_REAL);
                        total_SDR_MOC += Convert.ToDecimal(elemento.SDR_MOC);
                        total_MIN_MTC_REDONDEADO += Convert.ToDecimal(elemento.MIN_MTC_REDONDEADO);
                        total_MIN_MTC_REAL += Convert.ToDecimal(elemento.MIN_MTC_REAL);
                        total_SDR_MTC += Convert.ToDecimal(elemento.SDR_MTC);
                        total_SMS_MO += Convert.ToDecimal(elemento.SMS_MO);
                        total_SDR_SMS += Convert.ToDecimal(elemento.SDR_SMS);
                        total_GPRS += Convert.ToDecimal(elemento.GPRS);
                        total_SDR_GPRS += Convert.ToDecimal(elemento.SDR_GPRS);
                        total_USD_MOC += Convert.ToDecimal(elemento.USD_MOC);
                        total_USD_MTC += Convert.ToDecimal(elemento.USD_MTC);
                        total_USD_SMS_MO += Convert.ToDecimal(elemento.USD_SMS_MO);
                        total_USD_GPRS += Convert.ToDecimal(elemento.USD_GPRS);
                        total_COSTO_TRAFICO_USD += Convert.ToDecimal(elemento.COSTO_TRAFICO_USD);
                        total_tarifa_MOC += Convert.ToDecimal(elemento.tarifa_MOC);
                        total_tarifa_MTC += Convert.ToDecimal(elemento.tarifa_MTC);
                        total_tarifa_SMS_MO += Convert.ToDecimal(elemento.tarifa_SMS_MO);
                        total_tarifa_GPRS += Convert.ToDecimal(elemento.tarifa_GPRS);
                        total_IOT_TAR_MOC += Convert.ToDecimal(elemento.IOT_TAR_MOC);
                        total_IOT_TAR_MTC += Convert.ToDecimal(elemento.IOT_TAR_MTC);
                        total_IOT_TAR_SMS_MO += Convert.ToDecimal(elemento.IOT_TAR_SMS_MO);
                        total_IOT_TAR_GPRS += Convert.ToDecimal(elemento.IOT_TAR_GPRS);
                        total_USD_MOC_IOTFacturado += Convert.ToDecimal(elemento.USD_MOC_IOTFacturado);
                        total_USD_MTC_IOTFacturado += Convert.ToDecimal(elemento.USD_MTC_IOTFacturado);
                        total_USD_SMS_MO_IOTFacturado += Convert.ToDecimal(elemento.USD_SMS_MO_IOTFacturado);
                        total_USD_GPRS_IOTFacturado += Convert.ToDecimal(elemento.USD_GPRS_IOTFacturado);
                        total_USD_MOC_IOT_REAL += Convert.ToDecimal(elemento.USD_MOC_IOT_REAL);
                        total_USD_MTC_IOT_REAL += Convert.ToDecimal(elemento.USD_MTC_IOT_REAL);
                        total_USD_MOC_IOT_DESC += Convert.ToDecimal(elemento.USD_MOC_IOT_DESC);
                        total_USD_MTC_IOT_DESC += Convert.ToDecimal(elemento.USD_MTC_IOT_DESC);
                        total_USD_SMS_MO_IOT_DESC += Convert.ToDecimal(elemento.USD_SMS_MO_IOT_DESC);
                        total_USD_GPRS_IOT_DESC += Convert.ToDecimal(elemento.USD_GPRS_IOT_DESC);
                        total_USD_SUMA_PROV_TARIFA += Convert.ToDecimal(elemento.USD_SUMA_PROV_TARIFA);
                        total_costosFijosRecurrentes += Convert.ToDecimal(elemento.costosFijosRecurrentes);
                        total_PROVRealTarifaMesAnteriorUSD += Convert.ToDecimal(elemento.PROVRealTarifaMesAnteriorUSD);
                        total_PROVTarMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTarMesAnteriorUSD);
                        total_ajuste_Real_VS_DevengoTarifaMesAnteriroUSD += Convert.ToDecimal(elemento.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD);
                        total_total_USD_PROV_Tarifa += Convert.ToDecimal(elemento.total_USD_PROV_Tarifa);
                        total_facturacionRealMesAnteriorUSD += Convert.ToDecimal(elemento.facturacionRealMesAnteriorUSD);
                        total_PROVTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTraficoMesAnteriorUSD);
                        total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                        total_ajusteSaldoMesAnterior += Convert.ToDecimal(elemento.ajusteSaldoMesAnterior);
                        total_totalUSDTrafico += Convert.ToDecimal(elemento.totalUSDTrafico);
                        total_ajusteTraficoMesAnterior += Convert.ToDecimal(elemento.ajusteTraficoMesAnterior);
                        total_ajusteTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteTarifaMesAnterior);
                        total_ajusteCostosRecurresntesMesesAnteriores += Convert.ToDecimal(elemento.ajusteCostosRecurresntesMesesAnteriores);
                        total_complementoTarifaMesAnterior += Convert.ToDecimal(elemento.complementoTarifaMesAnterior);
                        total_ajusteMesesAnterioresUSD += Convert.ToDecimal(elemento.ajusteMesesAnterioresUSD);
                        total_totalNeto += Convert.ToDecimal(elemento.totalNeto);

                    }
                    foreach (PXQCostosROM row in lista)
                    {
                        worksheet.Cells[("A" + fila)].Value = row.fecha.Day.ToString("00") + '/' + row.fecha.Month.ToString("00") + '/' + row.fecha.Year;
                        worksheet.Cells[("B" + fila)].Value = row.PLMNPROVTAR;
                        worksheet.Cells[("C" + fila)].Value = row.PLMN_V;
                        worksheet.Cells[("D" + fila)].Value = row.PLMN_GPO;
                        worksheet.Cells[("E" + fila)].Value = row.pais;
                        worksheet.Cells[("F" + fila)].Value = row.acreedor;
                        worksheet.Cells[("G" + fila)].Value = row.MIN_MOC_REDONDEADO;
                        worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("H" + fila)].Value = row.MIN_MOC_REAL;
                        worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("I" + fila)].Value = row.SDR_MOC;
                        worksheet.Cells[("I" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("J" + fila)].Value = row.MIN_MTC_REDONDEADO;
                        worksheet.Cells[("J" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("K" + fila)].Value = row.MIN_MTC_REAL;
                        worksheet.Cells[("K" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("L" + fila)].Value = row.SDR_MTC;
                        worksheet.Cells[("L" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("M" + fila)].Value = row.SMS_MO;
                        worksheet.Cells[("M" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("N" + fila)].Value = row.SDR_SMS;
                        worksheet.Cells[("N" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("O" + fila)].Value = row.GPRS;
                        worksheet.Cells[("O" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("P" + fila)].Value = row.SDR_GPRS;
                        worksheet.Cells[("P" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("Q" + fila)].Value = row.USD_MOC;
                        worksheet.Cells[("Q" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("R" + fila)].Value = row.USD_MTC;
                        worksheet.Cells[("R" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("S" + fila)].Value = row.USD_SMS_MO;
                        worksheet.Cells[("S" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("T" + fila)].Value = row.USD_GPRS;
                        worksheet.Cells[("T" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("U" + fila)].Value = row.COSTO_TRAFICO_USD;
                        worksheet.Cells[("U" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("V" + fila)].Value = row.tarifa_MOC;
                        worksheet.Cells[("V" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("W" + fila)].Value = row.tarifa_MTC;
                        worksheet.Cells[("W" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("X" + fila)].Value = row.tarifa_SMS_MO;
                        worksheet.Cells[("X" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("Y" + fila)].Value = row.tarifa_GPRS;
                        worksheet.Cells[("Y" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("Z" + fila)].Value = row.IOT_TAR_MOC;
                        worksheet.Cells[("Z" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("AA" + fila)].Value = row.IOT_TAR_MTC;
                        worksheet.Cells[("AA" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("AB" + fila)].Value = row.IOT_TAR_SMS_MO;
                        worksheet.Cells[("AB" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("AC" + fila)].Value = row.IOT_TAR_GPRS;
                        worksheet.Cells[("AC" + fila)].Style.Numberformat.Format = "#,##0.000000_-";
                        worksheet.Cells[("AD" + fila)].Value = row.USD_MOC_IOTFacturado;
                        worksheet.Cells[("AD" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AE" + fila)].Value = row.USD_MTC_IOTFacturado;
                        worksheet.Cells[("AE" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AF" + fila)].Value = row.USD_SMS_MO_IOTFacturado;
                        worksheet.Cells[("AF" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AG" + fila)].Value = row.USD_GPRS_IOTFacturado;
                        worksheet.Cells[("AG" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AH" + fila)].Value = row.USD_MOC_IOT_REAL;
                        worksheet.Cells[("AH" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AI" + fila)].Value = row.USD_MTC_IOT_REAL;
                        worksheet.Cells[("AI" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AJ" + fila)].Value = row.USD_MOC_IOT_DESC;
                        worksheet.Cells[("AJ" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AK" + fila)].Value = row.USD_MTC_IOT_DESC;
                        worksheet.Cells[("AK" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AL" + fila)].Value = row.USD_SMS_MO_IOT_DESC;
                        worksheet.Cells[("AL" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AM" + fila)].Value = row.USD_GPRS_IOT_DESC;
                        worksheet.Cells[("AM" + fila)].Style.Numberformat.Format = "#,##0.0000_-";
                        worksheet.Cells[("AN" + fila)].Value = row.USD_SUMA_PROV_TARIFA;
                        worksheet.Cells[("AN" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AO" + fila)].Value = row.costosFijosRecurrentes;
                        worksheet.Cells[("AO" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AP" + fila)].Value = row.PROVRealTarifaMesAnteriorUSD;
                        worksheet.Cells[("AP" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AQ" + fila)].Value = row.PROVTarMesAnteriorUSD;
                        worksheet.Cells[("AQ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AR" + fila)].Value = row.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD;
                        worksheet.Cells[("AR" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AS" + fila)].Value = row.total_USD_PROV_Tarifa;
                        worksheet.Cells[("AS" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AT" + fila)].Value = row.facturacionRealMesAnteriorUSD;
                        worksheet.Cells[("AT" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AU" + fila)].Value = row.PROVTraficoMesAnteriorUSD;
                        worksheet.Cells[("AU" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AV" + fila)].Value = row.ajusteReal_VS_DevengoTraficoMesAnteriorUSD;
                        worksheet.Cells[("AV" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AW" + fila)].Value = row.ajusteSaldoMesAnterior;
                        worksheet.Cells[("AW" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AX" + fila)].Value = row.totalUSDTrafico;
                        worksheet.Cells[("AX" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AY" + fila)].Value = row.ajusteTraficoMesAnterior;
                        worksheet.Cells[("AY" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AZ" + fila)].Value = row.ajusteTarifaMesAnterior;
                        worksheet.Cells[("AZ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BA" + fila)].Value = row.ajusteCostosRecurresntesMesesAnteriores;
                        worksheet.Cells[("BA" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BB" + fila)].Value = row.complementoTarifaMesAnterior;
                        worksheet.Cells[("BB" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BC" + fila)].Value = row.ajusteMesesAnterioresUSD;
                        worksheet.Cells[("BC" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BD" + fila)].Value = row.totalNeto;
                        worksheet.Cells[("BD" + fila)].Style.Numberformat.Format = "#,##0.00_-";

                        ++fila;
                    }

                    DateTime fecha = DateTime.Parse(d.ToShortDateString(), info);
                    var CF = from costosFR in db.CostoFR
                             where (periodo >= costosFR.Fecha_Inicio && periodo <= costosFR.Fecha_Fin)
                             select new
                             {
                                 costosFR.Operador,
                                 costosFR.Importe
                             };

                    foreach (var elemento in CF)
                    {
                        listaCF.Add(new CostoFR
                        {
                            Operador = elemento.Operador,
                            Importe = elemento.Importe,
                        });
                    }

                    fila = fila + 2;

                    foreach (CostoFR row in listaCF)
                    {
                        worksheet.Cells[("B" + (fila))].Value = "COSTOS RECURRENTES";
                        worksheet.Cells[("C" + (fila))].Value = row.Operador;
                        worksheet.Cells[("AO" + (fila))].Value = row.Importe;
                        worksheet.Cells[("AO" + (fila))].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BD" + (fila))].Value = row.Importe;
                        worksheet.Cells[("BD" + (fila))].Style.Numberformat.Format = "#,##0.00_-";

                        fila++;
                    }

                    var ajusteTraficosum = (from pc in db.PeriodosAnterioresCostoROM
                                            where pc.BanderaConcepto == "TRAFICO" && periodo.Month == pc.PeriodoCarga.Month && periodo.Year == pc.PeriodoCarga.Year
                                            select pc.Importe).Sum();

                    var ajusteTarifasum = (from pc in db.PeriodosAnterioresCostoROM
                                           where pc.BanderaConcepto == "TARIFA" && periodo.Month == pc.PeriodoCarga.Month && periodo.Year == pc.PeriodoCarga.Year
                                           select pc.Importe).Sum();

                    var ajusteCostoR = (from pc in db.PeriodosAnterioresCostoROM
                                        where pc.BanderaConcepto == "COSTO RECURRENTE" && periodo.Month == pc.PeriodoCarga.Month && periodo.Year == pc.PeriodoCarga.Year
                                        select pc.Importe).Sum();

                    worksheet.Cells[("B" + (fila))].Value = "TARIFA";
                    worksheet.Cells[("C" + (fila))].Value = "AJUSTE TARIFA MESES ANTERIORES";
                    worksheet.Cells[("AZ" + (fila))].Value = ajusteTarifasum;
                    worksheet.Cells[("AZ" + (fila))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BD" + (fila))].Value = ajusteTarifasum;
                    worksheet.Cells[("BD" + (fila))].Style.Numberformat.Format = "#,##0.00";

                    worksheet.Cells[("B" + (fila + 1))].Value = "TRAFICO";
                    worksheet.Cells[("C" + (fila + 1))].Value = "AJUSTE TRAFICO MESES ANTERIORES";
                    worksheet.Cells[("AY" + (fila + 1))].Value = ajusteTraficosum;
                    worksheet.Cells[("AY" + (fila + 1))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BD" + (fila + 1))].Value = ajusteTraficosum;
                    worksheet.Cells[("BD" + (fila + 1))].Style.Numberformat.Format = "#,##0.00";

                    worksheet.Cells[("B" + (fila + 2))].Value = "COSTO RECURRENTE";
                    worksheet.Cells[("C" + (fila + 2))].Value = "COSTOS RECURRENTES ANTERIOROES";
                    worksheet.Cells[("AO" + (fila + 2))].Value = ajusteCostoR;
                    worksheet.Cells[("AO" + (fila + 2))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BA" + (fila + 2))].Value = ajusteCostoR;
                    worksheet.Cells[("BA" + (fila + 2))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BD" + (fila + 2))].Value = ajusteCostoR;
                    worksheet.Cells[("BD" + (fila + 2))].Style.Numberformat.Format = "#,##0.00";

                    worksheet.Cells[("C" + (fila + 4))].Value = "SUMAS TOTALES";
                    worksheet.Cells[("G" + (fila + 4))].Value = total_MIN_MOC_REDONDEADO;
                    worksheet.Cells[("G" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("H" + (fila + 4))].Value = total_MIN_MOC_REAL;
                    worksheet.Cells[("H" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("I" + (fila + 4))].Value = total_SDR_MOC;
                    worksheet.Cells[("I" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("J" + (fila + 4))].Value = total_MIN_MTC_REDONDEADO;
                    worksheet.Cells[("J" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("K" + (fila + 4))].Value = total_MIN_MTC_REAL;
                    worksheet.Cells[("K" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("L" + (fila + 4))].Value = total_SDR_MTC;
                    worksheet.Cells[("L" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("M" + (fila + 4))].Value = total_SMS_MO;
                    worksheet.Cells[("M" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("N" + (fila + 4))].Value = total_SDR_SMS;
                    worksheet.Cells[("N" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("O" + (fila + 4))].Value = total_GPRS;
                    worksheet.Cells[("O" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("P" + (fila + 4))].Value = total_SDR_GPRS;
                    worksheet.Cells[("P" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("Q" + (fila + 4))].Value = total_USD_MOC;
                    worksheet.Cells[("Q" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("R" + (fila + 4))].Value = total_USD_MTC;
                    worksheet.Cells[("R" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("S" + (fila + 4))].Value = total_USD_SMS_MO;
                    worksheet.Cells[("S" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("T" + (fila + 4))].Value = total_USD_GPRS;
                    worksheet.Cells[("T" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("U" + (fila + 4))].Value = total_COSTO_TRAFICO_USD;
                    worksheet.Cells[("U" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("V" + (fila + 4))].Value = total_tarifa_MOC;
                    worksheet.Cells[("V" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("W" + (fila + 4))].Value = total_tarifa_MTC;
                    worksheet.Cells[("W" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("X" + (fila + 4))].Value = total_tarifa_SMS_MO;
                    worksheet.Cells[("X" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("Y" + (fila + 4))].Value = total_tarifa_GPRS;
                    worksheet.Cells[("Y" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("Z" + (fila + 4))].Value = total_IOT_TAR_MOC;
                    worksheet.Cells[("Z" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("AA" + (fila + 4))].Value = total_IOT_TAR_MTC;
                    worksheet.Cells[("AA" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("AB" + (fila + 4))].Value = total_IOT_TAR_SMS_MO;
                    worksheet.Cells[("AB" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("AC" + (fila + 4))].Value = total_IOT_TAR_GPRS;
                    worksheet.Cells[("AC" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000";
                    worksheet.Cells[("AD" + (fila + 4))].Value = total_USD_MOC_IOTFacturado;
                    worksheet.Cells[("AD" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AE" + (fila + 4))].Value = total_USD_MTC_IOTFacturado;
                    worksheet.Cells[("AE" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AF" + (fila + 4))].Value = total_USD_SMS_MO_IOTFacturado;
                    worksheet.Cells[("AF" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AG" + (fila + 4))].Value = total_USD_GPRS_IOTFacturado;
                    worksheet.Cells[("AG" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AH" + (fila + 4))].Value = total_USD_MOC_IOT_REAL;
                    worksheet.Cells[("AH" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AI" + (fila + 4))].Value = total_USD_MTC_IOT_REAL;
                    worksheet.Cells[("AI" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AJ" + (fila + 4))].Value = total_USD_MOC_IOT_DESC;
                    worksheet.Cells[("AJ" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AK" + (fila + 4))].Value = total_USD_MTC_IOT_DESC;
                    worksheet.Cells[("AK" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AL" + (fila + 4))].Value = total_USD_SMS_MO_IOT_DESC;
                    worksheet.Cells[("AL" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AM" + (fila + 4))].Value = total_USD_GPRS_IOT_DESC;
                    worksheet.Cells[("AM" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000";
                    worksheet.Cells[("AN" + (fila + 4))].Value = total_USD_SUMA_PROV_TARIFA;
                    worksheet.Cells[("AN" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AO" + (fila + 4))].Value = total_costosFijosRecurrentes + CF.Sum(x => x.Importe)  + ajusteCostoR ?? 0;
                    worksheet.Cells[("AO" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AP" + (fila + 4))].Value = total_PROVRealTarifaMesAnteriorUSD;
                    worksheet.Cells[("AP" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AQ" + (fila + 4))].Value = total_PROVTarMesAnteriorUSD;
                    worksheet.Cells[("AQ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AR" + (fila + 4))].Value = total_ajuste_Real_VS_DevengoTarifaMesAnteriroUSD;
                    worksheet.Cells[("AR" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AS" + (fila + 4))].Value = total_total_USD_PROV_Tarifa;
                    worksheet.Cells[("AS" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AT" + (fila + 4))].Value = total_facturacionRealMesAnteriorUSD;
                    worksheet.Cells[("AT" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AU" + (fila + 4))].Value = total_PROVTraficoMesAnteriorUSD;
                    worksheet.Cells[("AU" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AV" + (fila + 4))].Value = total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD;
                    worksheet.Cells[("AV" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AW" + (fila + 4))].Value = total_ajusteSaldoMesAnterior;
                    worksheet.Cells[("AW" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AX" + (fila + 4))].Value = total_totalUSDTrafico;
                    worksheet.Cells[("AX" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AY" + (fila + 4))].Value = total_ajusteTraficoMesAnterior + ajusteTraficosum;
                    worksheet.Cells[("AY" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("AZ" + (fila + 4))].Value = total_ajusteTarifaMesAnterior + ajusteTarifasum;
                    worksheet.Cells[("AZ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BA" + (fila + 4))].Value = total_ajusteCostosRecurresntesMesesAnteriores + ajusteCostoR;
                    worksheet.Cells[("BA" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BB" + (fila + 4))].Value = total_complementoTarifaMesAnterior;
                    worksheet.Cells[("BB" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BC" + (fila + 4))].Value = ajusteTraficosum + ajusteTarifasum + ajusteCostoR;
                    worksheet.Cells[("BC" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";
                    worksheet.Cells[("BD" + (fila + 4))].Value = total_totalNeto + CF.Sum(x => x.Importe) + ajusteCostoR + ajusteTarifasum + ajusteTraficosum;
                    worksheet.Cells[("BD" + (fila + 4))].Style.Numberformat.Format = "#,##0.00";


                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                }
                catch (Exception err)
                {
                    respuesta = new { success = false, results = err.Message };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }



    }
}