using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.IO;
using System.Transactions;
using OfficeOpenXml;
using System.Text;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PXQIngresosROMController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        // GET: PXQIngresos
        public ActionResult Index()
        {
            //LeerArchivo();
            //CalcularPXQIngresos(new DateTime(2018, 09, 01));

            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);
        }

        /// <summary>
        /// Copia el layout de un archivo Excel Existe de nombre master_layout.xlsx
        /// </summary>  
        public bool CrearLayoutExcel(string nombre, string directorio)
        {
            // Crea el directorio del 
            if (!System.IO.Directory.Exists(directorio))
            {
                System.IO.Directory.CreateDirectory(directorio);
            }

            // Ubicacion del layout maestro
            string sourceFile = System.IO.Path.Combine(@"C:\RepositoriosDocs", "layout_master.xlsx");
            string destFile = System.IO.Path.Combine(directorio, nombre);

            // Copia el archivo con el layout, sobreescribe si ya existe
            try
            {
                System.IO.File.Copy(sourceFile, destFile, true);
            }
            catch (Exception)
            {
                return false;
            }


            if (System.IO.File.Exists(destFile))
                return true;
            return false;
        }

        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                ICPruebaEntities db = new ICPruebaEntities();

                var datos = from oPXQ in db.PXQIngresosROM
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
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception)
            {
                lista = null;
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGrid(DateTime periodo, int start, int limit)
        {
            DateTime d = periodo.AddMonths(-1);
            object respuesta = null;
            List<object> lista = new List<object>();
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
            decimal total_ingresoTraficoUSD = 0;
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
            decimal total_PROV_NC_M2M_USD = 0;
            decimal total_PROVRealTarifaMesAnteriorUSD = 0;
            decimal total_ajustePROV_M2M_USD_MesAnterior = 0;
            decimal total_PROV_TAR_MesAnteriorUSD = 0;
            decimal total_ajusteRal_VS_DevengoTarifaMesAnterior = 0;
            decimal total_total_USD_PROV_Tarifa = 0;
            decimal total_facturacion_REALTraficoMesAnterior = 0;
            decimal total_PROVTraficoMesAnteriorUSD = 0;
            decimal total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD = 0;
            decimal total_ajusteTraficoMesAnterior = 0;
            decimal total_ajusteTarifaMesAnterior = 0;
            decimal total_complementoTarifaMesAnterior = 0;
            decimal total_ajusteMesesAnterioresUSD = 0;
            decimal total_totalUSDTrafico = 0;
            decimal total_totalNetoUSD = 0;
            int total = 0;
            ICPruebaEntities db = new ICPruebaEntities();
            try
            {
                var query = from ingresos in db.PXQIngresosROM
                            orderby ingresos.PLMN_PROV_TAR
                            where ingresos.fecha.Month == d.Month &&
                            ingresos.fecha.Year == d.Year &&
                            ingresos.lineaNegocio == 1
                            select new
                            {
                                ingresos.Id,
                                ingresos.fecha,
                                ingresos.PLMN_PROV_TAR,
                                ingresos.PLMN_V,
                                ingresos.PLMN_GPO,
                                ingresos.pais,
                                ingresos.deudor,
                                ingresos.MIN_MOC_REDONDEADO,
                                ingresos.MIN_MOC_REAL,
                                ingresos.SDR_MOC,
                                ingresos.MIN_MTC_REDONDEADO,
                                ingresos.MIN_MTC_REAL,
                                ingresos.SDR_MTC,
                                ingresos.SMS_MO,
                                ingresos.SDR_SMS,
                                ingresos.GPRS,
                                ingresos.SDR_GPRS,
                                ingresos.USD_MOC,
                                ingresos.USD_MTC,
                                ingresos.USD_SMS_MO,
                                ingresos.USD_GPRS,
                                ingresos.ingresoTraficoUSD,
                                ingresos.tarifa_MOC,
                                ingresos.tarifa_MTC,
                                ingresos.tarifa_SMS_MO,
                                ingresos.tarifa_GPRS,
                                ingresos.IOT_TAR_MOC,
                                ingresos.IOT_TAR_MTC,
                                ingresos.IOT_TAR_SMS_MO,
                                ingresos.IOT_TAR_GPRS,
                                ingresos.USD_MOC_IOTFacturado,
                                ingresos.USD_MTC_IOTFacturado,
                                ingresos.USD_SMS_MO_IOTFacturado,
                                ingresos.USD_GPRS_IOTFacturado,
                                ingresos.USD_MOC_IOT_REAL,
                                ingresos.USD_MTC_IOT_REAL,
                                ingresos.USD_MOC_IOT_DESC,
                                ingresos.USD_MTC_IOT_DESC,
                                ingresos.USD_SMS_MO_IOT_DESC,
                                ingresos.USD_GPRS_IOT_DESC,
                                ingresos.USD_SUMA_PROV_TARIFA,
                                ingresos.PROV_NC_M2M_USD,
                                ingresos.PROVRealTarifaMesAnteriorUSD,
                                ingresos.ajustePROV_M2M_USD_MesAnterior,
                                ingresos.PROV_TAR_MesAnteriorUSD,
                                ingresos.ajusteRal_VS_DevengoTarifaMesAnterior,
                                ingresos.total_USD_PROV_Tarifa,
                                ingresos.facturacion_REALTraficoMesAnterior,
                                ingresos.PROVTraficoMesAnteriorUSD,
                                ingresos.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                ingresos.ajusteTraficoMesAnterior,
                                ingresos.ajusteTarifaMesAnterior,
                                ingresos.complementoTarifaMesAnterior,
                                ingresos.ajusteMesesAnterioresUSD,
                                ingresos.totalUSDTrafico,
                                ingresos.totalNetoUSD,
                                ingresos.lineaNegocio
                            };
                foreach (var elemento in query)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        fecha = elemento.fecha.Day + "-" + elemento.fecha.Month + "-" + elemento.fecha.Year,
                        elemento.PLMN_PROV_TAR,
                        elemento.PLMN_V,
                        elemento.PLMN_GPO,
                        elemento.pais,
                        elemento.deudor,
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
                        elemento.ingresoTraficoUSD,
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
                        elemento.PROV_NC_M2M_USD,
                        elemento.PROVRealTarifaMesAnteriorUSD,
                        elemento.ajustePROV_M2M_USD_MesAnterior,
                        elemento.PROV_TAR_MesAnteriorUSD,
                        elemento.ajusteRal_VS_DevengoTarifaMesAnterior,
                        elemento.total_USD_PROV_Tarifa,
                        elemento.facturacion_REALTraficoMesAnterior,
                        elemento.PROVTraficoMesAnteriorUSD,
                        elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                        elemento.ajusteTraficoMesAnterior,
                        elemento.ajusteTarifaMesAnterior,
                        elemento.complementoTarifaMesAnterior,
                        elemento.ajusteMesesAnterioresUSD,
                        elemento.totalUSDTrafico,
                        elemento.totalNetoUSD,
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
                    total_ingresoTraficoUSD += Convert.ToDecimal(elemento.ingresoTraficoUSD);
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
                    total_PROV_NC_M2M_USD += Convert.ToDecimal(elemento.PROV_NC_M2M_USD);
                    total_PROVRealTarifaMesAnteriorUSD += Convert.ToDecimal(elemento.PROVRealTarifaMesAnteriorUSD);
                    total_ajustePROV_M2M_USD_MesAnterior += Convert.ToDecimal(elemento.ajustePROV_M2M_USD_MesAnterior);
                    total_PROV_TAR_MesAnteriorUSD += Convert.ToDecimal(elemento.PROV_TAR_MesAnteriorUSD);
                    total_ajusteRal_VS_DevengoTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteRal_VS_DevengoTarifaMesAnterior);
                    total_total_USD_PROV_Tarifa += Convert.ToDecimal(elemento.total_USD_PROV_Tarifa);
                    total_facturacion_REALTraficoMesAnterior += Convert.ToDecimal(elemento.facturacion_REALTraficoMesAnterior);
                    total_PROVTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTraficoMesAnteriorUSD);
                    total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                    total_ajusteTraficoMesAnterior += Convert.ToDecimal(elemento.ajusteTraficoMesAnterior);
                    total_ajusteTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteTarifaMesAnterior);
                    total_complementoTarifaMesAnterior += Convert.ToDecimal(elemento.complementoTarifaMesAnterior);
                    total_ajusteMesesAnterioresUSD += Convert.ToDecimal(elemento.ajusteMesesAnterioresUSD);
                    total_totalUSDTrafico += Convert.ToDecimal(elemento.totalUSDTrafico);
                    total_totalNetoUSD += Convert.ToDecimal(elemento.totalNetoUSD);
                }

                total = lista.Count();

                var ajusteTrafico = ((from pi in db.PeriodosAnterioresIngresoROM
                                     where pi.PeriodoCarga.Month == periodo.Month &&
                                     pi.PeriodoCarga.Year == periodo.Year &&
                                     pi.BanderaConcepto == "TRAFICO"
                                     select pi.Importe).Sum()) ?? 0;

                var ajusteTarifa = ((from pi in db.PeriodosAnterioresIngresoROM
                                    where pi.PeriodoCarga.Month == periodo.Month &&
                                    pi.PeriodoCarga.Year == periodo.Year &&
                                    pi.BanderaConcepto == "TARIFA"
                                    select pi.Importe).Sum()) ?? 0;

                lista.Add(new
                {
                    PLMN_PROV_TAR = "TRAFICO",
                    ajusteTraficoMesAnterior = ajusteTrafico                    
                });

                lista.Add(new
                {
                    PLMN_PROV_TAR = "TARIFA",
                    ajusteTarifaMesAnterior = ajusteTarifa
                });

                lista = lista.Skip(start).Take(limit).ToList();

                lista.Add(new
                {
                    deudor = "SUMAS TOTALES",
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
                    ingresoTraficoUSD = total_ingresoTraficoUSD,
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
                    PROV_NC_M2M_USD = total_PROV_NC_M2M_USD,
                    PROVRealTarifaMesAnteriorUSD = total_PROVRealTarifaMesAnteriorUSD,
                    ajustePROV_M2M_USD_MesAnterior = total_ajustePROV_M2M_USD_MesAnterior,
                    PROV_TAR_MesAnteriorUSD = total_PROV_TAR_MesAnteriorUSD,
                    ajusteRal_VS_DevengoTarifaMesAnterior = total_ajusteRal_VS_DevengoTarifaMesAnterior,
                    total_USD_PROV_Tarifa = total_total_USD_PROV_Tarifa,
                    facturacion_REALTraficoMesAnterior = total_facturacion_REALTraficoMesAnterior,
                    PROVTraficoMesAnteriorUSD = total_PROVTraficoMesAnteriorUSD,
                    ajusteReal_VS_DevengoTraficoMesAnteriorUSD = total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                    ajusteTraficoMesAnterior = total_ajusteTraficoMesAnterior + ajusteTrafico,
                    ajusteTarifaMesAnterior = total_ajusteTarifaMesAnterior + ajusteTarifa,
                    complementoTarifaMesAnterior = total_complementoTarifaMesAnterior,
                    ajusteMesesAnterioresUSD = total_ajusteMesesAnterioresUSD + ajusteTrafico + ajusteTarifa,
                    totalUSDTrafico = total_totalUSDTrafico,
                    totalNetoUSD = total_totalNetoUSD,
                });

                respuesta = new { results = lista, start, limit, total, succes = true };

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
            decimal total_ingresoTraficoUSD = 0;
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
            decimal total_PROV_NC_M2M_USD = 0;
            decimal total_PROVRealTarifaMesAnteriorUSD = 0;
            decimal total_ajustePROV_M2M_USD_MesAnterior = 0;
            decimal total_PROV_TAR_MesAnteriorUSD = 0;
            decimal total_ajusteRal_VS_DevengoTarifaMesAnterior = 0;
            decimal total_total_USD_PROV_Tarifa = 0;
            decimal total_facturacion_REALTraficoMesAnterior = 0;
            decimal total_PROVTraficoMesAnteriorUSD = 0;
            decimal total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD = 0;
            decimal total_ajusteTraficoMesAnterior = 0;
            decimal total_ajusteTarifaMesAnterior = 0;
            decimal total_complementoTarifaMesAnterior = 0;
            decimal total_ajusteMesesAnterioresUSD = 0;
            decimal total_totalUSDTrafico = 0;
            decimal total_totalNetoUSD = 0;

            string nombreArchivo = "PxQ ROM " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/PxQ_ROM.xlsx");
            object respuesta = null;
            int fila = 2;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile))
            {
                ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["PxQ Ingresos ROM"];

                try
                {
                    DateTime d = periodo.AddMonths(-1);
                    List<PXQIngresosROM> lista = new List<PXQIngresosROM>();
                    var query = from PxQI in db.PXQIngresosROM
                                where PxQI.fecha.Month == d.Month &&
                                        PxQI.fecha.Year == d.Year
                                select new
                                {
                                    PxQI.fecha,
                                    PxQI.PLMN_PROV_TAR,
                                    PxQI.PLMN_V,
                                    PxQI.PLMN_GPO,
                                    PxQI.pais,
                                    PxQI.deudor,
                                    PxQI.MIN_MOC_REDONDEADO,
                                    PxQI.MIN_MOC_REAL,
                                    PxQI.SDR_MOC,
                                    PxQI.MIN_MTC_REDONDEADO,
                                    PxQI.MIN_MTC_REAL,
                                    PxQI.SDR_MTC,
                                    PxQI.SMS_MO,
                                    PxQI.SDR_SMS,
                                    PxQI.GPRS,
                                    PxQI.SDR_GPRS,
                                    PxQI.USD_MOC,
                                    PxQI.USD_MTC,
                                    PxQI.USD_SMS_MO,
                                    PxQI.USD_GPRS,
                                    PxQI.ingresoTraficoUSD,
                                    PxQI.tarifa_MOC,
                                    PxQI.tarifa_MTC,
                                    PxQI.tarifa_SMS_MO,
                                    PxQI.tarifa_GPRS,
                                    PxQI.IOT_TAR_MOC,
                                    PxQI.IOT_TAR_MTC,
                                    PxQI.IOT_TAR_SMS_MO,
                                    PxQI.IOT_TAR_GPRS,
                                    PxQI.USD_MOC_IOTFacturado,
                                    PxQI.USD_MTC_IOTFacturado,
                                    PxQI.USD_SMS_MO_IOTFacturado,
                                    PxQI.USD_GPRS_IOTFacturado,
                                    PxQI.USD_MOC_IOT_REAL,
                                    PxQI.USD_MTC_IOT_REAL,
                                    PxQI.USD_MOC_IOT_DESC,
                                    PxQI.USD_MTC_IOT_DESC,
                                    PxQI.USD_SMS_MO_IOT_DESC,
                                    PxQI.USD_GPRS_IOT_DESC,
                                    PxQI.USD_SUMA_PROV_TARIFA,
                                    PxQI.PROV_NC_M2M_USD,
                                    PxQI.PROVRealTarifaMesAnteriorUSD,
                                    PxQI.ajustePROV_M2M_USD_MesAnterior,
                                    PxQI.PROV_TAR_MesAnteriorUSD,
                                    PxQI.ajusteRal_VS_DevengoTarifaMesAnterior,
                                    PxQI.total_USD_PROV_Tarifa,
                                    PxQI.facturacion_REALTraficoMesAnterior,
                                    PxQI.PROVTraficoMesAnteriorUSD,
                                    PxQI.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                    PxQI.ajusteTraficoMesAnterior,
                                    PxQI.ajusteTarifaMesAnterior,
                                    PxQI.complementoTarifaMesAnterior,
                                    PxQI.ajusteMesesAnterioresUSD,
                                    PxQI.totalUSDTrafico,
                                    PxQI.totalNetoUSD
                                };
                    foreach (var elemento in query)
                    {
                        lista.Add(new PXQIngresosROM
                        {
                            fecha = elemento.fecha,
                            PLMN_PROV_TAR = elemento.PLMN_PROV_TAR,
                            PLMN_V = elemento.PLMN_V,
                            PLMN_GPO = elemento.PLMN_GPO,
                            pais = elemento.pais,
                            deudor = elemento.deudor,
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
                            ingresoTraficoUSD = elemento.ingresoTraficoUSD,
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
                            PROV_NC_M2M_USD = elemento.PROV_NC_M2M_USD,
                            PROVRealTarifaMesAnteriorUSD = elemento.PROVRealTarifaMesAnteriorUSD,
                            ajustePROV_M2M_USD_MesAnterior = elemento.ajustePROV_M2M_USD_MesAnterior,
                            PROV_TAR_MesAnteriorUSD = elemento.PROV_TAR_MesAnteriorUSD,
                            ajusteRal_VS_DevengoTarifaMesAnterior = elemento.ajusteRal_VS_DevengoTarifaMesAnterior,
                            total_USD_PROV_Tarifa = elemento.total_USD_PROV_Tarifa,
                            facturacion_REALTraficoMesAnterior = elemento.facturacion_REALTraficoMesAnterior,
                            PROVTraficoMesAnteriorUSD = elemento.PROVTraficoMesAnteriorUSD,
                            ajusteReal_VS_DevengoTraficoMesAnteriorUSD = elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                            ajusteTraficoMesAnterior = elemento.ajusteTraficoMesAnterior,
                            ajusteTarifaMesAnterior = elemento.ajusteTarifaMesAnterior,
                            complementoTarifaMesAnterior = elemento.complementoTarifaMesAnterior,
                            ajusteMesesAnterioresUSD = elemento.ajusteMesesAnterioresUSD,
                            totalUSDTrafico = elemento.totalUSDTrafico,
                            totalNetoUSD = elemento.totalNetoUSD
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
                        total_ingresoTraficoUSD += Convert.ToDecimal(elemento.ingresoTraficoUSD);
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
                        total_PROV_NC_M2M_USD += Convert.ToDecimal(elemento.PROV_NC_M2M_USD);
                        total_PROVRealTarifaMesAnteriorUSD += Convert.ToDecimal(elemento.PROVRealTarifaMesAnteriorUSD);
                        total_ajustePROV_M2M_USD_MesAnterior += Convert.ToDecimal(elemento.ajustePROV_M2M_USD_MesAnterior);
                        total_PROV_TAR_MesAnteriorUSD += Convert.ToDecimal(elemento.PROV_TAR_MesAnteriorUSD);
                        total_ajusteRal_VS_DevengoTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteRal_VS_DevengoTarifaMesAnterior);
                        total_total_USD_PROV_Tarifa += Convert.ToDecimal(elemento.total_USD_PROV_Tarifa);
                        total_facturacion_REALTraficoMesAnterior += Convert.ToDecimal(elemento.facturacion_REALTraficoMesAnterior);
                        total_PROVTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTraficoMesAnteriorUSD);
                        total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                        total_ajusteTraficoMesAnterior += Convert.ToDecimal(elemento.ajusteTraficoMesAnterior);
                        total_ajusteTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteTarifaMesAnterior);
                        total_complementoTarifaMesAnterior += Convert.ToDecimal(elemento.complementoTarifaMesAnterior);
                        total_ajusteMesesAnterioresUSD += Convert.ToDecimal(elemento.ajusteMesesAnterioresUSD);
                        total_totalUSDTrafico += Convert.ToDecimal(elemento.totalUSDTrafico);
                        total_totalNetoUSD += Convert.ToDecimal(elemento.totalNetoUSD);
                    }
                    foreach (PXQIngresosROM row in lista)
                    {
                        worksheet.Cells[("A" + fila)].Value = meses[row.fecha.Month] + " " + row.fecha.Year;
                        worksheet.Cells[("B" + fila)].Value = row.PLMN_PROV_TAR;
                        worksheet.Cells[("C" + fila)].Value = row.PLMN_V;
                        worksheet.Cells[("D" + fila)].Value = row.PLMN_GPO;
                        worksheet.Cells[("E" + fila)].Value = row.pais;
                        worksheet.Cells[("F" + fila)].Value = row.deudor;
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
                        worksheet.Cells[("U" + fila)].Value = row.ingresoTraficoUSD;
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
                        worksheet.Cells[("AO" + fila)].Value = row.PROV_NC_M2M_USD;
                        worksheet.Cells[("AO" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AP" + fila)].Value = row.PROVRealTarifaMesAnteriorUSD;
                        worksheet.Cells[("AP" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AQ" + fila)].Value = row.ajustePROV_M2M_USD_MesAnterior;
                        worksheet.Cells[("AQ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AR" + fila)].Value = row.PROV_TAR_MesAnteriorUSD;
                        worksheet.Cells[("AR" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AS" + fila)].Value = row.ajusteRal_VS_DevengoTarifaMesAnterior;
                        worksheet.Cells[("AS" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AT" + fila)].Value = row.total_USD_PROV_Tarifa;
                        worksheet.Cells[("AT" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AU" + fila)].Value = row.facturacion_REALTraficoMesAnterior;
                        worksheet.Cells[("AU" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AV" + fila)].Value = row.PROVTraficoMesAnteriorUSD;
                        worksheet.Cells[("AV" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AW" + fila)].Value = row.ajusteReal_VS_DevengoTraficoMesAnteriorUSD;
                        worksheet.Cells[("AW" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AX" + fila)].Value = row.ajusteTraficoMesAnterior;
                        worksheet.Cells[("AX" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AY" + fila)].Value = row.ajusteTarifaMesAnterior;
                        worksheet.Cells[("AY" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AZ" + fila)].Value = row.complementoTarifaMesAnterior;
                        worksheet.Cells[("AZ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BA" + fila)].Value = row.ajusteMesesAnterioresUSD;
                        worksheet.Cells[("BA" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BB" + fila)].Value = row.totalUSDTrafico;
                        worksheet.Cells[("BB" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BC" + fila)].Value = row.totalNetoUSD;
                        worksheet.Cells[("BC" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        ++fila;
                    }

                    var ajusteTraficosum = (from pc in db.PeriodosAnterioresIngresoROM
                                            where pc.BanderaConcepto == "TRAFICO" && periodo.Month == pc.PeriodoCarga.Month && periodo.Year == pc.PeriodoCarga.Year
                                            select pc.Importe).Sum();

                    var ajusteTarifasum = (from pc in db.PeriodosAnterioresIngresoROM
                                           where pc.BanderaConcepto == "TARIFA" && periodo.Month == pc.PeriodoCarga.Month && periodo.Year == pc.PeriodoCarga.Year
                                           select pc.Importe).Sum();

                    worksheet.Cells[("B" + (fila))].Value = "TARIFA";
                    worksheet.Cells[("C" + (fila))].Value = "AJUSTE TARIFA MESES ANTERIORES";
                    worksheet.Cells[("AY" + (fila))].Value = ajusteTarifasum;

                    worksheet.Cells[("B" + (fila + 1))].Value = "TRAFICO";
                    worksheet.Cells[("C" + (fila + 1))].Value = "AJUSTE TRAFICO MESES ANTERIORES";
                    worksheet.Cells[("AX" + (fila + 1))].Value = ajusteTraficosum;

                    worksheet.Cells[("C" + (fila + 4))].Value = "SUMAS TOTALES";
                    worksheet.Cells[("G" + (fila + 4))].Value = total_MIN_MOC_REDONDEADO;
                    worksheet.Cells[("G" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("H" + (fila + 4))].Value = total_MIN_MOC_REAL;
                    worksheet.Cells[("H" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("I" + (fila + 4))].Value = total_SDR_MOC;
                    worksheet.Cells[("I" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("J" + (fila + 4))].Value = total_MIN_MTC_REDONDEADO;
                    worksheet.Cells[("J" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("K" + (fila + 4))].Value = total_MIN_MTC_REAL;
                    worksheet.Cells[("K" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("L" + (fila + 4))].Value = total_SDR_MTC;
                    worksheet.Cells[("L" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("M" + (fila + 4))].Value = total_SMS_MO;
                    worksheet.Cells[("M" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("N" + (fila + 4))].Value = total_SDR_SMS;
                    worksheet.Cells[("N" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("O" + (fila + 4))].Value = total_GPRS;
                    worksheet.Cells[("O" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("P" + (fila + 4))].Value = total_SDR_GPRS;
                    worksheet.Cells[("P" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("Q" + (fila + 4))].Value = total_USD_MOC;
                    worksheet.Cells[("Q" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("R" + (fila + 4))].Value = total_USD_MTC;
                    worksheet.Cells[("R" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("S" + (fila + 4))].Value = total_USD_SMS_MO;
                    worksheet.Cells[("S" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("T" + (fila + 4))].Value = total_USD_GPRS;
                    worksheet.Cells[("T" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("U" + (fila + 4))].Value = total_ingresoTraficoUSD;
                    worksheet.Cells[("U" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("v" + (fila + 4))].Value = total_tarifa_MOC;
                    worksheet.Cells[("v" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("W" + (fila + 4))].Value = total_tarifa_MTC;
                    worksheet.Cells[("W" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("X" + (fila + 4))].Value = total_tarifa_SMS_MO;
                    worksheet.Cells[("X" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("Y" + (fila + 4))].Value = total_tarifa_GPRS;
                    worksheet.Cells[("Y" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("Z" + (fila + 4))].Value = total_IOT_TAR_MOC;
                    worksheet.Cells[("Z" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("AA" + (fila + 4))].Value = total_IOT_TAR_MTC;
                    worksheet.Cells[("AA" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("AB" + (fila + 4))].Value = total_IOT_TAR_SMS_MO;
                    worksheet.Cells[("AB" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("AC" + (fila + 4))].Value = total_IOT_TAR_GPRS;
                    worksheet.Cells[("AC" + (fila + 4))].Style.Numberformat.Format = "#,##0.000000_-";
                    worksheet.Cells[("AD" + (fila + 4))].Value = total_USD_MOC_IOTFacturado;
                    worksheet.Cells[("AD" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AE" + (fila + 4))].Value = total_USD_MTC_IOTFacturado;
                    worksheet.Cells[("AE" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AF" + (fila + 4))].Value = total_USD_SMS_MO_IOTFacturado;
                    worksheet.Cells[("AF" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AG" + (fila + 4))].Value = total_USD_GPRS_IOTFacturado;
                    worksheet.Cells[("AG" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AH" + (fila + 4))].Value = total_USD_MOC_IOT_REAL;
                    worksheet.Cells[("AH" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AI" + (fila + 4))].Value = total_USD_MTC_IOT_REAL;
                    worksheet.Cells[("AI" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AJ" + (fila + 4))].Value = total_USD_MOC_IOT_DESC;
                    worksheet.Cells[("AJ" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AK" + (fila + 4))].Value = total_USD_MTC_IOT_DESC;
                    worksheet.Cells[("AK" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AL" + (fila + 4))].Value = total_USD_SMS_MO_IOT_DESC;
                    worksheet.Cells[("AL" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AM" + (fila + 4))].Value = total_USD_GPRS_IOT_DESC;
                    worksheet.Cells[("AM" + (fila + 4))].Style.Numberformat.Format = "#,##0.0000_-";
                    worksheet.Cells[("AN" + (fila + 4))].Value = total_USD_SUMA_PROV_TARIFA;
                    worksheet.Cells[("AN" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AO" + (fila + 4))].Value = total_PROV_NC_M2M_USD;
                    worksheet.Cells[("AO" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AP" + (fila + 4))].Value = total_PROVRealTarifaMesAnteriorUSD;
                    worksheet.Cells[("AP" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AQ" + (fila + 4))].Value = total_ajustePROV_M2M_USD_MesAnterior;
                    worksheet.Cells[("AQ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AR" + (fila + 4))].Value = total_PROV_TAR_MesAnteriorUSD;
                    worksheet.Cells[("AR" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AS" + (fila + 4))].Value = total_ajusteRal_VS_DevengoTarifaMesAnterior;
                    worksheet.Cells[("AS" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AT" + (fila + 4))].Value = total_total_USD_PROV_Tarifa;
                    worksheet.Cells[("AT" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AU" + (fila + 4))].Value = total_facturacion_REALTraficoMesAnterior;
                    worksheet.Cells[("AU" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AV" + (fila + 4))].Value = total_PROVTraficoMesAnteriorUSD;
                    worksheet.Cells[("AV" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AW" + (fila + 4))].Value = total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD;
                    worksheet.Cells[("AW" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AX" + (fila + 4))].Value = ajusteTraficosum;
                    worksheet.Cells[("AX" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AY" + (fila + 4))].Value = ajusteTarifasum;
                    worksheet.Cells[("AY" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("AZ" + (fila + 4))].Value = total_complementoTarifaMesAnterior;
                    worksheet.Cells[("AZ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("BA" + (fila + 4))].Value = total_ajusteMesesAnterioresUSD + ajusteTraficosum + ajusteTarifasum;
                    worksheet.Cells[("BA" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("BB" + (fila + 4))].Value = total_totalUSDTrafico;
                    worksheet.Cells[("BB" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    worksheet.Cells[("BC" + (fila + 4))].Value = total_totalNetoUSD;
                    worksheet.Cells[("BC" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";

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
