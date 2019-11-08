using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IC2.Helpers;
using System.IO;
using System.Text;

namespace IC2.Controllers
{
    public class PolizasRoamingController : Controller
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
		public JsonResult LlenarGridPolizas(int lineaNegocio, DateTime? periodoContable, int start, int limit)
		{
			
			List<object> lista = new List<object>();
			object respuesta = null;
			int total = 0;
			int Tipo = 0;
			try
			{
				if (periodoContable == null)
				{
					Tipo = 0;


				}
				else
				{
					Tipo = 1;
					//if (Session["Rechazo"] == null)
					//{
					//	GenerarPolizas.ObtenerDatosSAP();
					//}
				}


				if (Tipo == 1)
				{
					Session["periodoContable"] = periodoContable;
					string Periodo = periodoContable.ToString();
					string _PeriodoContable = DateTime.Parse(Periodo).ToString("dd/MM/yyyy");
					DateTime _dPeriodoContable = Convert.ToDateTime(_PeriodoContable);

					//Se realiza busqueda                   
					var Polizas1 = db.usp_ListadoPolizasFiltroRoaming(periodoContable.Value.Month, periodoContable.Value.Year);
					foreach (var item in Polizas1)
					{
						lista.Add(new
						{
							Id = item.ID,
							//IdPoliza = item.IdPoliza,
							Poliza = item.Poliza,
							TipoFichero = item.TipoFichero,
							Sentido = item.Sentido,
							Servicio = item.Servicio,
							SociedadSAP = item.SociedadSAP,
							Estado = item.Estado,
							Enviado = item.Enviado,
							Nombre = item.Nombre,
							FechaCreacion = item.FechaCreacion.Replace('/', '-'),
							FechaEnvio = item.FechaEnvio.Replace('/', '-'),
							TipoFactura = item.TipoFactura,
							PeriodoConsumido = item.PeriodoConsumido.Value.ToString("dd-MM-yyyy"),//item.PeriodoConsumido.Substring(8, 2) + '-' + item.PeriodoConsumido.Substring(5, 2) + '-' + item.PeriodoConsumido.Substring(0, 4),
							NumeroPoliza = item.NumeroPoliza,
							DescripcionMensaje = item.DescripcionMensaje,
							Rechazado = item.Rechazado,
							Reprocesado = item.Reprocesado,
							PolizaGenerada = item.PolizaGenerada,

						});

					}

				}
				Session["Rechazo"] = 1;

				//          if (Session["NombrePoliza"] != null )
				//          {
				//              if (Session["NombrePoliza"].ToString() != "")
				//              {
				//                  string NombrePoliza = Session["NombrePoliza"].ToString();
				//string IdDevengo = Session["IdDevengo"].ToString();
				//string ClaseDocumento =Session["ClaseDocumento"].ToString();

				//GenerarPolizas.ObtenerDatosSAP();
				//              }
				//          }
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
		public JsonResult llenaPeriodo(int start, int limit)
		{
			List<object> lista = new List<object>();

			object respuesta = null;
			int total;

			try
			{
				var datos = from periodos in db.PolizasRoaming
							//where periodos.PolizaGenerada == true
							group periodos by periodos.PeriodoConsumido into g
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
						Periodo = elemento.Periodo.Value.ToString("MM-dd-yyyy"),
						Fecha = elemento.Periodo.Value.Year + " " + meses[Convert.ToInt16(elemento.Periodo.Value.Month)]
					});
				}

				total = lista.Count();
				lista = lista.Skip(start).Take(limit).ToList();
				respuesta = new { success = true, results = lista, total = total };
			}
			catch (Exception e)
			{
				lista = null;
				respuesta = new { success = false, results = e.Message };
			}

			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}

		public JsonResult ObtenerCabeceraArchivo()
		{

			List<object> lista = new List<object>();
			object respuesta = null;
			int total = 0;
			try
			{
				lista.Add(new
				{
					Registro = "0",
					Mand = "500",
					Usuario = "MRT11412"//Session["userName"].ToString(),
				});

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
		public JsonResult ObtenerCabeceraRegistro(string Id, string ClaseDocumento, string Poliza, string Nombre, string Estado)
		{

			List<object> lista = new List<object>();
			object respuesta = null;
			int total = 0;
			int IdDevengo = 0;
			try
			{
				Session["IdDevengo"] = Id;
				Session["ClaseDocumento"] = ClaseDocumento;
				Session["Poliza"] = Poliza;
				Session["NombrePoliza"] = Nombre;
				Session["Estado"] = Estado;

				//if (ClaseDocumento == "INGRESO") { ClaseDocumento = "S1"; }
				//if (ClaseDocumento == "COSTO") { ClaseDocumento = "S3"; }
				//if (ClaseDocumento == "FLUCTUACION") { ClaseDocumento = "SA"; }
				IdDevengo = int.Parse(Id);

				// db.usp_InsertarLinea1();

				var CabeceraArchivo = from Linea1 in db.LineaArchivo1Roaming
									  where Linea1.Id_Devengo == IdDevengo && Linea1.Sentido == ClaseDocumento
									  select Linea1;

				foreach (var item in CabeceraArchivo)
				{
					lista.Add(new
					{
						IdLinea1 = item.IdLinea1,
						Id_Devengo = item.Id_Devengo,
						Reg = item.Reg,
						Trans = item.Trans,
						ClaseDocumento = item.ClaseDocumento,
						Sociedad = item.Sociedad,
						Moneda = item.Moneda,
						TipoCambio = item.TipoCambio,
						FechaDocumento = item.FechaDocumento,
						FechaContabilizacion = item.FechaContabilizacion,
						FechaReversion = item.FechaReversion,
						TextoCabecera = item.TextoCabecera,
						MotivoReversion = item.MotivoReversion,
						Libro = item.Libro,
						Referencia = item.Referencia,
						Referencia2 = item.Referencia2,
						IdCasuistica = item.IdCasuistica,
						Asiento = item.Asiento,
						Referencia22 = item.Referencia22,
						CalculoAut = item.CalculoAut,

					});
				}
				total = lista.Count();
				Session["LineaArchivo1"] = lista;
				//lista = lista.Skip(start).Take(limit).ToList();
				respuesta = new { success = true, results = lista, total };
			}
			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}
		public JsonResult ObtenerDetalleRegistro(string Id, string ClaseDocumento, string Poliza)
		{

			List<object> lista = new List<object>();

			object respuesta = null;
			int total = 0;
			int IdDevengo = 0;
			try
			{
				//Session["IdDevengo"] = Id;
				//Session["ClaseDocumento"] = ClaseDocumento;
				//Session["Poliza"] = Poliza;

				if (ClaseDocumento == "INGRESO") { ClaseDocumento = "Ingreso"; }
				if (ClaseDocumento == "COSTO") { ClaseDocumento = "Costo"; }
				if (ClaseDocumento == "FLUCTUACION") { ClaseDocumento = "Fluctuacion"; }
				IdDevengo = int.Parse(Id);

				//db.usp_InsertarArchivoLinea2();

				var LineaArchivo2 = from Linea2 in db.LineaArchivo2Roaming
									where Linea2.Id_Devengo == IdDevengo && Linea2.Sentido == ClaseDocumento
									select Linea2;

				foreach (var item in LineaArchivo2)
				{
					lista.Add(new
					{
						IdLinea2 = item.IdLinea2,
						Id_Devengo = item.Id_Devengo,
						REG = item.REG,
						ClaveContab = item.ClaveContab,
						CME = item.CME,
						ImporteMD = item.ImporteMD,
						ImporteML = item.ImporteML,
						IndicadorImpuesto = item.IndicadorImpuesto,
						CentroCosto = item.CentroCosto,
						Orden = item.Orden,
						FechaBase = item.FechaBase,
						Asignacion = item.Asignacion,
						TextoPosicion = item.TextoPosicion,
						CondPago = item.CondPago,
						BloqPago = item.BloqPago,
						ViaPago = item.ViaPago,
						BcoPropio = item.BcoPropio,
						Cuenta = item.Cuenta,
						REF1 = item.REF1,
						REF2 = item.REF2,
						lineaDeNegocio = item.lineaDeNegocio,
						Campo20 = item.Campo20,
						Campo21 = item.Campo21,
						Campo22 = item.Campo22,
						SociedadCuentasDeIngresos = item.SociedadCuentasDeIngresos,
						Subsegm = item.Subsegm,
						Servicio = item.Servicio,
						Region = item.Region,
						Licencia = item.Licencia,
						TipoDeTrafico = item.TipoDeTrafico,
						Ambito = item.Ambito,
						Producto = item.Producto,
						Geografia = item.Geografia,
						Paquetes = item.Paquetes,
						PlanRegulatorio = item.PlanRegulatorio,
						EmpresaGrupo = item.EmpresaGrupo,
						REF3 = item.REF3,
						AreaFuncional = item.AreaFuncional,
						CalculoImpuesto = item.CalculoImpuesto,
						FechaValor = item.FechaValor,
						IndicadorActividadPEl = item.IndicadorActividadPEl,
						RegionEstadoFederalLandProvinciaCondado = item.RegionEstadoFederalLandProvinciaCondado,
						ClaseDeDistribuciónIRPF = item.ClaseDeDistribuciónIRPF,
						Campo42 = item.Campo42,
						Proyecto = item.Proyecto,
						SociedadGLAsociada = item.SociedadGLAsociada,
						Campo45 = item.Campo45,
						CodMaterial = item.CodMaterial,
						CodEmplazFiscal = item.CodEmplazFiscal,
						Grafo = item.Grafo,
						Grafo2 = item.Grafo2,
						Subsegmento = item.Subsegmento,
						BundlePaquetes = item.BundlePaquetes,
						SubtipoLinea = item.SubtipoLinea,
						Canal = item.Canal,
						ServiciosPA = item.ServiciosPA,
						SegmentoPA = item.SegmentoPA,
						importebaseimpuesto = item.importebaseimpuesto,
						ASIENTO = item.ASIENTO,

					});
				}
				Session["LineaArchivo2"] = lista;
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
		public JsonResult RespuestaSAP()
		{
			object respuesta = null;

			try
			{
				GenerarPolizas.ObtenerDatosSAP(1);
				respuesta = new { success = true };
			}

			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}

		public JsonResult CancelarPoliza()
		{
			object respuesta = null;

			try
			{
				string Id = Session["IdDevengo"].ToString();
				int IdDevengo = int.Parse(Id);

				db.usp_CancelarPolizaRoaming(IdDevengo);
				respuesta = new { success = true };
			}

			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}

		public JsonResult ObtenerEditarMultiple(int[] arrayParam, string EditarSentido)
		{

			//int[] valores = new int[3] { 1, 2, 3 };
			object respuesta = null;
			List<object> lista = new List<object>();
			int total = 0;
			try
			{
				string Sentido = string.Empty;
				if (EditarSentido == "INGRESO") { Sentido = "Ingreso"; }
				if (EditarSentido == "COSTO") { Sentido = "Costo"; }
				if (EditarSentido == "FLUCTUACION") { Sentido = "Fluctuacion"; }

				//var RegEditar = db.usp_BuscarEditar(Convert.ToString(arrayParam));

				var RegEditar = from ELA2 in db.LineaArchivo2Roaming
								join EP in db.PolizasRoaming on ELA2.Id_Devengo equals EP.IdPoliza //on new { ELA2.Id_Devengo, ELA2.Sentido  } equals new { EP.IdPoliza, EP.Sentido } 
																							// on new { X1 = (int)(ELA2.Id_Devengo), X2 = ELA2.Sentido } equals new { X1 =(int)(EP.IdPoliza), X2 =  } //on ELA2.Id_Devengo equals EP.IdPoliza 
								where arrayParam.Contains((int)ELA2.Id_Devengo)
								&& ELA2.Sentido == Sentido
								&& EP.Sentido == Sentido
								orderby ELA2.Id_Devengo, ELA2.CME
								select new
								{
									EP.Poliza,
									ELA2.IdLinea2,
									ELA2.Id_Devengo,
									ELA2.ClaveContab,
									ELA2.CME,
									ELA2.IndicadorImpuesto,
									ELA2.CentroCosto,
									ELA2.Cuenta,
									ELA2.Region,
									ELA2.Licencia,
									ELA2.TipoDeTrafico,
									ELA2.Ambito,
									ELA2.Producto,
									ELA2.EmpresaGrupo,
									ELA2.AreaFuncional,
									ELA2.Subsegmento,
									ELA2.BundlePaquetes,
									ELA2.SubtipoLinea,
									ELA2.Canal,
									ELA2.ServiciosPA,
									ELA2.SegmentoPA
								};

				foreach (var item in RegEditar)
				{
					lista.Add(new
					{
						Poliza = item.Poliza,
						IdLinea2 = item.IdLinea2,
						Id_Devengo = item.Id_Devengo,
						ClaveContab = item.ClaveContab,
						CME = item.CME,
						IndicadorImpuesto = item.IndicadorImpuesto,
						CentroCosto = item.CentroCosto,
						Cuenta = item.Cuenta,
						Region = item.Region,
						Licencia = item.Licencia,
						TipoDeTrafico = item.TipoDeTrafico,
						Ambito = item.Ambito,
						Producto = item.Producto,
						EmpresaGrupo = item.EmpresaGrupo,
						AreaFuncional = item.AreaFuncional,
						Subsegmento = item.Subsegmento,
						BundlePaquetes = item.BundlePaquetes,
						SubtipoLinea = item.SubtipoLinea,
						Canal = item.Canal,
						ServiciosPA = item.ServiciosPA,
						SegmentoPA = item.SegmentoPA,

					});
				}

				total = lista.Count();
				// lista = lista.Skip(start).Take(limit).ToList();
				respuesta = new { success = true, results = lista, total = total };
			}


			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}

		public JsonResult EditarMultipleIdLinea(int IdLinea2, int Id_Devengo, string ClaveContab, string CME, string IndicadorImpues, string CentroCosto, string Cuenta, string Region, string Licencia, string TipoDeTrafico, string Ambito, string Producto, string EmpresaGrupo, string AreaFuncional, string Subsegmento, string BundlePaquetes, string SubtipoLinea, string Canal, string ServiciosPA, string SegmentoPA, string Sentido)
		{
			object respuesta = null;
			try
			{
				int res = db.usp_ActualizarMultiplePolizasRoaming(IdLinea2, Id_Devengo, ClaveContab, CME, IndicadorImpues, CentroCosto, Cuenta, Region, Licencia, TipoDeTrafico, Ambito, Producto, EmpresaGrupo, AreaFuncional, Subsegmento, BundlePaquetes, SubtipoLinea, Canal, ServiciosPA, SegmentoPA, Sentido);

				respuesta = new { success = true, results = "no" };
			}
			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}
		public JsonResult EnviarPolizas()
		{

			object respuesta = null;
			try
			{
				string Ruta = string.Empty;
				string rutaArchivos = string.Empty;
				string ClaseDocumentoS = string.Empty;
				string ClaseDocumentoN = string.Empty;
				string ClaseDocumento = string.Empty;
				string FechaCreacion = string.Empty;
				string NombreArchivo = string.Empty;
				string rutaArchivoIngreso = string.Empty;
				string rutaArchivoCostos = string.Empty;
				string rutaArchivoFluctuacion = string.Empty;
				string Poliza = string.Empty;
				int IdDevengo = 0;
				DateTime _dPeriodo = (DateTime)Session["periodoContable"];
				string _sPeriodo = _dPeriodo.ToShortDateString();

				StringBuilder sb = new StringBuilder();

				//Obtenemos rutas configurables  de base de datos
				string[] Rutas = GenerarPolizas.RutasArchivosConfigurables(1);
				rutaArchivoIngreso = Rutas[0].ToString();
				rutaArchivoCostos = Rutas[1].ToString();
				rutaArchivoFluctuacion = Rutas[2].ToString();

				ClaseDocumento = Session["ClaseDocumento"].ToString();
				Poliza = Session["Poliza"].ToString();
				string Id = Session["IdDevengo"].ToString();

				if (ClaseDocumento == "INGRESO") { ClaseDocumentoS = "S1"; ClaseDocumentoN = "ING"; rutaArchivos = rutaArchivoIngreso; }
				if (ClaseDocumento == "COSTO") { ClaseDocumentoS = "S3"; ClaseDocumentoN = "COS"; rutaArchivos = rutaArchivoCostos; }
				if (ClaseDocumento == "FLUCTUACION") { ClaseDocumentoS = "Sa"; ClaseDocumentoN = "FLU"; rutaArchivos = rutaArchivoFluctuacion; }

				//Generamos Nombre del archivo
				NombreArchivo = Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";

				Ruta = rutaArchivos + NombreArchivo;
				FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

				//Escribimos contenido dentro del archivo
				using (StreamWriter sw = new StreamWriter(Ruta))
				{
					//sb.Append("");
					//sb.AppendLine();
					//sw.WriteLine("");

					//Panel1
					string LineaBodyTipo0 = string.Format("{0},{1},{2}", "0", "500", "MRT11412");
					sw.WriteLine(LineaBodyTipo0);
					sb.Append(LineaBodyTipo0);
					sb.AppendLine();

					//Panel2

					IdDevengo = int.Parse(Id);
					var LineaArchivo1 = from Linea1 in db.LineaArchivo1Roaming
										where Linea1.Id_Devengo == IdDevengo && Linea1.ClaseDocumento == ClaseDocumentoS
										select Linea1;

					foreach (var item in LineaArchivo1)
					{
						string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.Reg, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
						sw.WriteLine(LineaBodyTipo1);
						sb.Append(LineaBodyTipo1);
						sb.AppendLine();
					}


					//Panel3
					var LineaArchivo2 = from Linea2 in db.LineaArchivo2Roaming
										where Linea2.Id_Devengo == IdDevengo && Linea2.Sentido == ClaseDocumento
										select Linea2;

					foreach (var item in LineaArchivo2)
					{
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.Paquetes,
																																																																				item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
						sb.AppendLine();



					}
					sw.Close();
				}

				int i = db.usp_InsertarDatosPolizaSAP(IdDevengo, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", Poliza, true);
				//EnviarCorreo(ClaseDocumento, _sPeriodo, true); //XCV

				respuesta = new { success = true, results = "no" };
			}
			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}

			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}

		IDictionary<int, string> meses = new Dictionary<int, string>() {
			{1, "ENERO"}, {2, "FEBRERO"},
			{3, "MARZO"}, {4, "ABRIL"},
			{5, "MAYO"}, {6, "JUNIO"},
			{7, "JULIO"}, {8, "AGOSTO"},
			{9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
			{11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
		};
	}
}