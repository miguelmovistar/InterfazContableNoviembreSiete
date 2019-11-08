using IC2.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PolizasController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        // GET: Polizas
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
			//GenerarPolizas.GeneraPolizasLDI("2019-01-01", "MRN14015");
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
                    var Polizas1 = db.usp_ListadoPolizasFiltro(periodoContable.Value.Month, periodoContable.Value.Year);
					//var Polizas1 = db.usp_MostrarPolizasAgrupdo(periodoContable.Value.Month, periodoContable.Value.Year);
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
                            FechaCreacion = item.FechaCreacion.Replace('/','-'),
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
        public JsonResult ObtenerCabeceraRegistro(string Id, string ClaseDocumento, string Poliza, string Nombre,string Estado, string Servicio)
        {
            
            List<object> lista = new List<object>();
            object respuesta = null;
            int total = 0;
            int IdDevengo = 0;
			DateTime Periodo = (DateTime)Session["periodoContable"];
            try
            {
                Session["IdDevengo"] = Id;
                Session["ClaseDocumento"] = ClaseDocumento;
                Session["Poliza"] = Poliza;
                Session["NombrePoliza"] = Nombre;
                Session["Estado"] = Estado;
				Session["Servicio"] = Servicio;

				if (ClaseDocumento == "FLUCTUACIONINGRESO") { Servicio = "Fluctuacion T.C."; }
				if (ClaseDocumento == "FLUCTUACIONCOSTO") { Servicio = "Fluctuacion T.C."; }

				if (Id == "") Id = "0";
				IdDevengo = int.Parse(Id);

				var CabeceraArchivo = db.usp_MostrarLineaArchivo1Agrupado(Servicio, ClaseDocumento,Periodo);

				foreach (var item in CabeceraArchivo)
				{

					lista.Add(new
					{
						//IdLinea1 = item.IdLinea1,
						//Id_Devengo = item.Id_Devengo,
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
						Asiento = 1,
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
        public JsonResult ObtenerDetalleRegistro(string Id, string ClaseDocumento, string Poliza, string Servicio)
        {

            List<object> lista = new List<object>();
            
            object respuesta = null;
            int total = 0;
            int IdDevengo = 0;
            try
            {
				DateTime Periodo = (DateTime)Session["periodoContable"];
				if (Id == "") Id = "0";
				IdDevengo = int.Parse(Id);
				//Session["IdDevengo"] = Id;
				//Session["ClaseDocumento"] = ClaseDocumento;
				//Session["Poliza"] = Poliza;

				//if (ClaseDocumento == "INGRESO") { ClaseDocumento = "Ingreso"; }
				//if (ClaseDocumento == "COSTO") { ClaseDocumento = "Costo"; }
				//if (ClaseDocumento == "FLUCTUACION") { ClaseDocumento = "Fluctuacion"; }
				if (ClaseDocumento == "FLUCTUACIONINGRESO" || ClaseDocumento == "FLUCTUACIONCOSTO")
				{ Servicio = ""; }
					var LineaArchivo2 = db.usp_MostrarLineaArchivo2Agrupado(Servicio, ClaseDocumento, Periodo);

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
				string Servicio = string.Empty;
                string Poliza = string.Empty;
                int IdDevengo = 0;
                DateTime _dPeriodo = (DateTime)Session["periodoContable"];
                string _sPeriodo = _dPeriodo.ToShortDateString();
               
                StringBuilder sb = new StringBuilder();

				//Obtenemos rutas configurables  de base de datos
				string[] Rutas = GenerarPolizas.RutasArchivosConfigurables(2);
                rutaArchivoIngreso = Rutas[0].ToString();
                rutaArchivoCostos = Rutas[1].ToString();
                rutaArchivoFluctuacion = Rutas[2].ToString();

                ClaseDocumento = Session["ClaseDocumento"].ToString();
				Servicio = Session["Servicio"].ToString();
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
                EnviarCorreo(ClaseDocumento, _sPeriodo, true); //XCV

                respuesta = new { success = true, results = "no" };
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
                var datos = from periodos in db.PolizasAgrupadoLDI where periodos.PolizaGenerada == true
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
                        Fecha = elemento.Periodo.Value.Year  + " " + meses[Convert.ToInt16(elemento.Periodo.Value.Month)]
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

        public JsonResult modificarPolizas(int Id, string ClaveContab, string CME, string IndicadorImpuesto, string CentoCosto, string Cuenta, string Region, string Licencia, string TipoTrafico, string Ambito, string Producto, string EmpresaGrup, string AreaFuncional, string Subsegmento, string Bundle, string TipoLinea, string Canal, string ServicioPA, string SegmentoPA)
        {
            object respuesta = null;
            
            try
            {
                LineaArchivo2 linea2 = db.LineaArchivo2.Where(x => x.IdLinea2 == Id).SingleOrDefault();
                linea2.ClaveContab = ClaveContab;
                linea2.CME = CME;
                linea2.IndicadorImpuesto = IndicadorImpuesto;
                linea2.CentroCosto = CentoCosto;
                linea2.Cuenta = Cuenta;
                linea2.Region = Region;
                linea2.Licencia = Licencia;
                linea2.TipoDeTrafico = TipoTrafico;
                linea2.Ambito = Ambito;
                linea2.Producto = Producto;
                linea2.EmpresaGrupo = EmpresaGrup;
                linea2.AreaFuncional = AreaFuncional;
                linea2.Subsegmento = Subsegmento;
                linea2.BundlePaquetes = Bundle;
                linea2.SubtipoLinea = TipoLinea;
                linea2.Canal = Canal;
                linea2.ServiciosPA = ServicioPA;
                linea2.SegmentoPA = SegmentoPA;

                Log log = new Log();
                log.insertaBitacoraModificacion(linea2, "IdLinea2", linea2.IdLinea2, "LineaArchivo2.html", Request.UserHostAddress);

                db.SaveChanges();

                respuesta = new { success = true, results = "ok" };
            }
            catch (Exception)
            {
                respuesta = new { succes = true, results = "" };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult validarModif(int id)
        {
            string strSalto = "</br>";
            string strMsg = "";
            
            bool blsccs = true;

            object respuesta = null;

            string strResp_Val = funGralCtrl.ValidaRelacion("Polizas", id);

            if (strResp_Val.Length != 0)
            {
                strMsg = "El registro que quieres modificar se está usando en el(los) cátalogo(s)" + strSalto;
                strMsg = strMsg + strResp_Val + strSalto;
                strMsg = strMsg + "¿Estas seguro de hacer la modificación?";

                blsccs = false;
            }

            respuesta = new { success = blsccs, results = strMsg };
            return Json(respuesta, JsonRequestBehavior.AllowGet);
            {

            }
        }
        public JsonResult BuscarPoliza(int id)
        {
            object respuesta = null;
            
            try
            {
                LineaArchivo2 linea2 = db.LineaArchivo2.Where(x => x.IdLinea2 == id).SingleOrDefault();

                respuesta = new { success = true, results = linea2 };
            }
            catch (Exception)
            {
                respuesta = new { success = false, results = "" };
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
                db.usp_CancelarPoliza(IdDevengo);
                respuesta = new { success = true };
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
				GenerarPolizas.ObtenerDatosSAP(2);
				respuesta = new { success = true };
			}

			catch (Exception ex)
			{
				respuesta = new { success = false, results = ex.Message };
			}
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}


		//Edicion Multiple
		public JsonResult ObtenerEditarMultiple(int[] arrayParam, string EditarSentido)
        {
			
            //int[] valores = new int[3] { 1, 2, 3 };
            object respuesta = null;
            List<object> lista = new List<object>();
			string Servicio = string.Empty;
			string ClaseDocumento = string.Empty;
			int total = 0;
			try
			{
				string Sentido = string.Empty;
				DateTime Periodo = (DateTime)Session["periodoContable"];

				ClaseDocumento = Session["ClaseDocumento"].ToString();
				Servicio = Session["Servicio"].ToString();

				if (EditarSentido == "INGRESO") { Sentido = "Ingreso"; }
				if (EditarSentido == "COSTO") { Sentido = "Costo"; }
				if (EditarSentido == "FLUCTUACION") { Sentido = "Fluctuacion"; }

				//var RegEditar = db.usp_BuscarEditar(Convert.ToString(arrayParam));
				var RegEditar = db.usp_MostrarLineaArchivo2Agrupado(Servicio, ClaseDocumento, Periodo);
				//var RegEditar = from ELA2 in db.LineaArchivo2
				//				join EP in db.Polizas on ELA2.Id_Devengo equals EP.IdPoliza //on new { ELA2.Id_Devengo, ELA2.Sentido  } equals new { EP.IdPoliza, EP.Sentido } 
				//																			// on new { X1 = (int)(ELA2.Id_Devengo), X2 = ELA2.Sentido } equals new { X1 =(int)(EP.IdPoliza), X2 =  } //on ELA2.Id_Devengo equals EP.IdPoliza 
				//				where arrayParam.Contains((int)ELA2.Id_Devengo)
				//				&& ELA2.Sentido == Sentido
				//				&& EP.Sentido == Sentido
				//				orderby ELA2.Id_Devengo, ELA2.CME
				//				select new
				//				{
				//					EP.Poliza,
				//					ELA2.IdLinea2,
				//					ELA2.Id_Devengo,
				//					ELA2.ClaveContab,
				//					ELA2.CME,
				//					ELA2.IndicadorImpuesto,
				//					ELA2.CentroCosto,
				//					ELA2.Cuenta,
				//					ELA2.Region,
				//					ELA2.Licencia,
				//					ELA2.TipoDeTrafico,
				//					ELA2.Ambito,
				//					ELA2.Producto,
				//					ELA2.EmpresaGrupo,
				//					ELA2.AreaFuncional,
				//					ELA2.Subsegmento,
				//					ELA2.BundlePaquetes,
				//					ELA2.SubtipoLinea,
				//					ELA2.Canal,
				//					ELA2.ServiciosPA,
				//					ELA2.SegmentoPA
				//				};

                foreach (var item in RegEditar)
                {
                    lista.Add(new
                    {
						//Poliza = item.Poliza,
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
		public JsonResult EditarMultipleIdLinea (int IdLinea2,int Id_Devengo, string ClaveContab,string CME,string IndicadorImpues,string	CentroCosto,string Cuenta,string Region	,string Licencia,string TipoDeTrafico,string Ambito	,string Producto,string EmpresaGrupo,string AreaFuncional,string Subsegmento ,string BundlePaquetes ,string SubtipoLinea,string Canal,string ServiciosPA ,string SegmentoPA,string Sentido)
		{
			object respuesta = null;
			try
			{
				int res= db.usp_ActualizarMultiplePolizas(IdLinea2, Id_Devengo, ClaveContab, CME, IndicadorImpues, CentroCosto, Cuenta, Region, Licencia, TipoDeTrafico,Ambito,Producto,EmpresaGrupo,AreaFuncional,Subsegmento,BundlePaquetes,SubtipoLinea,Canal,ServiciosPA,SegmentoPA, Sentido);

				respuesta = new { success = true, results = "no" };
			}
			catch (Exception ex)
			{
                respuesta = new { success = false, results = ex.Message };
            }
			return Json(respuesta, JsonRequestBehavior.AllowGet);
		}

        #region Metodos
        //private void GeneraPolizas(string Periodo)
        //{
        //    string Ruta = string.Empty;
        //    string rutaArchivoIngreso = string.Empty;
        //    string rutaArchivoCostos = string.Empty;
        //    string rutaArchivoFluctuacion = string.Empty;
        //    string ClaseDocumentoS = string.Empty;
        //    string ClaseDocumentoN = string.Empty;
        //    string ClaseDocumento = string.Empty;
        //    string NombreArchivo = string.Empty;
        //    string Poliza = string.Empty;
        //    StringBuilder sb = new StringBuilder();

        //    //Obtenemos rutas configurables  de base de datos
        //    string[] Rutas = RutasArchivosCOnfigurables();
        //    rutaArchivoIngreso = Rutas[0].ToString();
        //    rutaArchivoCostos = Rutas[1].ToString();
        //    rutaArchivoFluctuacion = Rutas[2].ToString();

        //    //ClaseDocumento = Session["ClaseDocumento"].ToString();
        //    //Poliza = Session["Poliza"].ToString();
        //    //string Id = Session["IdDevengo"].ToString();



        //    //Generacion Polizas Ingresos
        //    var polizasIngresos = from ListadoPoliza in db.Polizas
        //                          where ListadoPoliza.Sentido == "INGRESO" && ListadoPoliza.PeriodoConsumido == Periodo
        //                          select ListadoPoliza;
        //    foreach (var itemPolizas in polizasIngresos)
        //    {

        //        ClaseDocumento = "INGRESO"; ClaseDocumentoS = "S1"; ClaseDocumentoN = "ING";

        //        //Generamos Nombre del archivo
        //        NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        //        Ruta = rutaArchivoIngreso + NombreArchivo;

        //        //FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

        //        //Escribimos contenido dentro del archivo
        //        using (StreamWriter sw = new StreamWriter(Ruta))
        //        {
        //            //sb.Append("");
        //            //sb.AppendLine();
        //            //sw.WriteLine("");

        //            //Panel1
        //            string LineaBodyTipo0 = string.Format("{0},{1},{2}", "0", "500", Session["userName"].ToString());
        //            sw.WriteLine(LineaBodyTipo0);
        //            sb.Append(LineaBodyTipo0);
        //            sb.AppendLine();

        //            //Panel2

        //            // IdDevengo = int.Parse(Id);
        //            var LineaArchivo1 = from Linea1 in db.LineaArchivo1
        //                                where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumentoS
        //                                select Linea1;

        //            foreach (var item in LineaArchivo1)
        //            {
        //                string LineaBodyTipo1 = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.Reg, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, item.Asiento, item.Referencia22, item.CalculoAut);
        //                sw.WriteLine(LineaBodyTipo1);
        //                sb.Append(LineaBodyTipo1);
        //                sb.AppendLine();
        //            }


        //            //Panel3
        //            //Se generan todas por primera vez

        //            var LineaArchivo2 = from Linea2 in db.LineaArchivo2
        //                                where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
        //                                select Linea2;

        //            foreach (var item in LineaArchivo2)
        //            {
        //                string LineaBodyTipo2 = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21},{22},{23},{24},{25},{26},{27},{28},{29},{30},{31},{22},{33},{34},{35},{36},{37},{38},{39},{40},{41},{42},{43},{44},{45},{46},{47},{48},{49},{50},{51},{52},{53},{54}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
        //                                                                                                                                                                                                                                                                        item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
        //                                                                                                                                                                                                                                                                        item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
        //                                                                                                                                                                                                                                                                        item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.Paquetes,
        //                                                                                                                                                                                                                                                                        item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
        //                sw.WriteLine(LineaBodyTipo2);
        //                sb.Append(LineaBodyTipo2);
        //                sb.AppendLine();



        //            }
        //            sw.Close();
        //        }
        //        int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.IdPoliza, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);


        //    }

        //    EnviarCorreo("INGRESO", Periodo, false);

        //    //**************************************************************

        //    //Generacion Polizas Costos
        //    var polizasCostos = from ListadoPoliza in db.Polizas
        //                        where ListadoPoliza.Sentido == "COSTO" && ListadoPoliza.PeriodoConsumido == Periodo
        //                        select ListadoPoliza;
        //    foreach (var itemPolizas in polizasCostos)
        //    {

        //        ClaseDocumento = "COSTO"; ClaseDocumentoS = "S3"; ClaseDocumentoN = "COS";

        //        //Generamos Nombre del archivo
        //        NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        //        Ruta = rutaArchivoCostos + NombreArchivo;

        //        //FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

        //        //Escribimos contenido dentro del archivo
        //        using (StreamWriter sw = new StreamWriter(Ruta))
        //        {
        //            //sb.Append("");
        //            //sb.AppendLine();
        //            //sw.WriteLine("");

        //            //Panel1
        //            string LineaBodyTipo0 = string.Format("{0},{1},{2}", "0", "500", Session["userName"].ToString());
        //            sw.WriteLine(LineaBodyTipo0);
        //            sb.Append(LineaBodyTipo0);
        //            sb.AppendLine();

        //            //Panel2

        //            // IdDevengo = int.Parse(Id);
        //            var LineaArchivo1 = from Linea1 in db.LineaArchivo1
        //                                where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumentoS
        //                                select Linea1;

        //            foreach (var item in LineaArchivo1)
        //            {
        //                string LineaBodyTipo1 = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.Reg, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, item.Asiento, item.Referencia22, item.CalculoAut);
        //                sw.WriteLine(LineaBodyTipo1);
        //                sb.Append(LineaBodyTipo1);
        //                sb.AppendLine();
        //            }


        //            //Panel3
        //            //Se generan todas por primera vez

        //            var LineaArchivo2 = from Linea2 in db.LineaArchivo2
        //                                where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
        //                                select Linea2;

        //            foreach (var item in LineaArchivo2)
        //            {
        //                string LineaBodyTipo2 = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21},{22},{23},{24},{25},{26},{27},{28},{29},{30},{31},{22},{33},{34},{35},{36},{37},{38},{39},{40},{41},{42},{43},{44},{45},{46},{47},{48},{49},{50},{51},{52},{53},{54}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
        //                                                                                                                                                                                                                                                                        item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
        //                                                                                                                                                                                                                                                                        item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
        //                                                                                                                                                                                                                                                                        item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.Paquetes,
        //                                                                                                                                                                                                                                                                        item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
        //                sw.WriteLine(LineaBodyTipo2);
        //                sb.Append(LineaBodyTipo2);
        //                sb.AppendLine();

        //            }


        //            sw.Close();
        //        }
        //        int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.IdPoliza, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
        //    }
        //    EnviarCorreo("COSTO", Periodo, false);
        //    //**************************************************************

        //    //Generacion Polizas Fluctuacion
        //    var polizasFluctuacion = from ListadoPoliza in db.Polizas
        //                             where ListadoPoliza.Sentido == "FLUCTUACION" && ListadoPoliza.PeriodoConsumido == Periodo
        //                             select ListadoPoliza;
        //    foreach (var itemPolizas in polizasFluctuacion)
        //    {

        //        ClaseDocumento = "FLUCTUACION"; ClaseDocumentoS = "SA"; ClaseDocumentoN = "FLU";
        //        //Generamos Nombre del archivo
        //        NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        //        Ruta = rutaArchivoFluctuacion + NombreArchivo;

        //        //FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

        //        //Escribimos contenido dentro del archivo
        //        using (StreamWriter sw = new StreamWriter(Ruta))
        //        {
        //            //sb.Append("");
        //            //sb.AppendLine();
        //            //sw.WriteLine("");

        //            //Panel1
        //            string LineaBodyTipo0 = string.Format("{0},{1},{2}", "0", "500", Session["userName"].ToString());
        //            sw.WriteLine(LineaBodyTipo0);
        //            sb.Append(LineaBodyTipo0);
        //            sb.AppendLine();

        //            //Panel2

        //            // IdDevengo = int.Parse(Id);
        //            var LineaArchivo1 = from Linea1 in db.LineaArchivo1
        //                                where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumentoS
        //                                select Linea1;

        //            foreach (var item in LineaArchivo1)
        //            {
        //                string LineaBodyTipo1 = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.Reg, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, item.Asiento, item.Referencia22, item.CalculoAut);
        //                sw.WriteLine(LineaBodyTipo1);
        //                sb.Append(LineaBodyTipo1);
        //                sb.AppendLine();
        //            }


        //            //Panel3
        //            //Se generan todas por primera vez

        //            var LineaArchivo2 = from Linea2 in db.LineaArchivo2
        //                                where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
        //                                select Linea2;

        //            foreach (var item in LineaArchivo2)
        //            {
        //                string LineaBodyTipo2 = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21},{22},{23},{24},{25},{26},{27},{28},{29},{30},{31},{22},{33},{34},{35},{36},{37},{38},{39},{40},{41},{42},{43},{44},{45},{46},{47},{48},{49},{50},{51},{52},{53},{54}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
        //                                                                                                                                                                                                                                                                        item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
        //                                                                                                                                                                                                                                                                        item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
        //                                                                                                                                                                                                                                                                        item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.Paquetes,
        //                                                                                                                                                                                                                                                                        item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
        //                sw.WriteLine(LineaBodyTipo2);
        //                sb.Append(LineaBodyTipo2);
        //                sb.AppendLine();

        //            }


        //            sw.Close();
        //        }

        //        int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.IdPoliza, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
        //    }

        //    EnviarCorreo("FLUCTUACION", Periodo, false);
        //    //ConectarSFTP(Ruta);

        //    //string NombrePoliza = Session["NombrePoliza"].ToString();
        //    //string Estado = string.Empty;
        //    //if (Session["Estado"] != null) Estado = Session["Estado"].ToString(); else Estado = "";
        //    //int i = db.usp_InsertarDatosPolizaSAP(IdDevengo, ClaseDocumento, Estado, NombreArchivo, "", "", "", "", Poliza);           
        //}
        private void EnviarCorreo(string Sentido, string Periodo, bool Envio)
        {
            string rutaArchivoIngreso = string.Empty;
            string rutaArchivoCostos = string.Empty;
            string rutaArchivoFluctuacion = string.Empty;
            string sHost = ConfigurationManager.AppSettings["HostCorreo"];
            string sPort = ConfigurationManager.AppSettings["PuertoCorreo"];

            try
            {
                //string filename = @"C:\Users\Paul\Documents\test.txt";
                //Attachment data = new Attachment(filename, MediaTypeNames.Application.Octet);
                MailMessage email = new MailMessage();
                StringBuilder sbBody = new StringBuilder();
                string rutaArchivos = string.Empty;
                string ListaCorreos = string.Empty;
                string[] _aPeriodo = Periodo.Split('/');
                string Mes = _aPeriodo[1];
                string Ano = _aPeriodo[2];
                string Subject = string.Empty;
                string Nombre = Session["NombrePoliza"].ToString();

                //Obtenemos rutas configurables  de base de datos
                string[] Rutas = RutasArchivosCOnfigurables();
                rutaArchivoIngreso = Rutas[0].ToString();
                rutaArchivoCostos = Rutas[1].ToString();
                rutaArchivoFluctuacion = Rutas[2].ToString();

                //Obtenemos Lista de correos
                var correos = from datos in db.parametrosCargaDocumento
                              where datos.idDocumento == "CORREO"
                              select new
                              {
                                  datos.pathURL
                              };
                foreach (var item in correos)
                {
                    ListaCorreos = item.pathURL;
                }


                if (Sentido == "INGRESO")
                {
                    string[] Archivos;
                    //Creamos Body                    
                    sbBody.Append("IC Infroma: Genero Polizas INGRESOS automatica para SAP del periodo   " + Mes + " " + Ano + "Con los archivos adjuntos:");
                    sbBody.AppendFormat("<br/>");

                    //Obtenemos los archivos csv de la carpeta  y  los Adjuntamos
                    if (Envio)
                    {
                        //Validcion si se envia de nuevo                        
                        string Ruta = rutaArchivoIngreso + Nombre;
                        email.Attachments.Add(new Attachment(Ruta));
                        sbBody.AppendFormat("<br/>{0}", Nombre);
                    }
                    else
                    {
                        Archivos = Directory.GetFiles(rutaArchivoIngreso, "*.csv");
                        //string NombreArchivo = Path.GetFileName(rutaArchivos);
                        foreach (string archivo in Archivos)
                        {
                            email.Attachments.Add(new Attachment(archivo));
                        }
                        foreach (string archivo in Archivos)
                        {
                            sbBody.AppendFormat("<br/>{0}", Path.GetFileName(archivo));
                        }
                    }

                    //Creamos Subject
                    Subject = "[External]IC Archivos Generados S1 INGRESOS ( " + DateTime.Now.ToString("dd / MMM / yyy hh:mm:ss") + " ) " + "Periodo " + Mes + " " + Ano;                   

                    //foreach (string archivo in Archivos)
                    //{
                    //    sbBody.AppendFormat("<br/>{0}", Path.GetFileName(archivo));
                    //}
                }

                if (Sentido == "COSTO")
                {
                    string[] Archivos;
                    //Creamos Body
                    sbBody.Append("IC Infroma: Genero Polizas COSTOS automatica para SAP del periodo   " + Mes + " " + Ano + "Con los archivos adjuntos:");
                    sbBody.AppendFormat("<br/>");

                    //Obtenemos los archivos csv de la carpeta  y  los Adjuntamos
                    if (Envio)
                    {
                        //Validcion si se envia de nuevo
                       string Ruta = rutaArchivoCostos + Nombre;
                       email.Attachments.Add(new Attachment(Ruta));
                       sbBody.AppendFormat("<br/>{0}", Nombre);

                    }
                    else
                    {
                        Archivos = Directory.GetFiles(rutaArchivoCostos, "*.csv");
                        //string NombreArchivo = Path.GetFileName(rutaArchivos);

                        foreach (string archivo in Archivos)
                        {
                            email.Attachments.Add(new Attachment(archivo));
                        }
                        foreach (string archivo in Archivos)
                        {
                            sbBody.AppendFormat("<br/>{0}", Path.GetFileName(archivo));
                        }
                    }
                    //Creamos Subject
                    Subject = "[External]IC Archivos Generados S3 COSTOS(" + DateTime.Now.ToString("dd / MMM / yyy hh: mm:ss") + ") " + "Periodo " + Mes + " " + Ano;

                }
                if (Sentido == "FLUCTUACION")
                {
                    string[] Archivos;
                    //Creamos Body
                    sbBody.Append("IC Infroma: Genero Polizas FLUCTUACION automatica para SAP del periodo   " + Mes + " " + Ano + "Con los archivos adjuntos:");
                    sbBody.AppendFormat("<br/>");

                    //Obtenemos los archivos csv de la carpeta  y  los Adjuntamos
                    if (Envio)
                    {
                        //Validcion si se envia de nuevo                        
                        string Ruta = rutaArchivoIngreso + Nombre;
                        email.Attachments.Add(new Attachment(Ruta));
                        sbBody.AppendFormat("<br/>{0}", Nombre);
                    }
                    else
                    {
                        Archivos = Directory.GetFiles(rutaArchivoFluctuacion, "*.csv");
                        //string NombreArchivo = Path.GetFileName(rutaArchivos);

                        foreach (string archivo in Archivos)
                        {
                            email.Attachments.Add(new Attachment(archivo));
                        }
                        foreach (string archivo in Archivos)
                        {
                            sbBody.AppendFormat("<br/>{0}", Path.GetFileName(archivo));
                        }
                    }

                    //Creamos Subject
                    Subject = "[External]IC Archivos Generados SA FLUCTUACION ( " + DateTime.Now.ToString("dd / MMM / yyy hh:mm:ss") + " ) " + "Periodo " + Mes + " " + Ano;


                }


                //De quen se envia 
                email.From = new MailAddress("app.interfazContable.mx@telefonica.com");
                //A quien se le envia correo
                //email.To.Add(new MailAddress("j.zuniga.hernandez@accenture.com, g.ramirez.garcia@accenture.com, e.benitez.flores@accenture.com, jaime.ladrondeguevara@xideral.co"));
                email.To.Add(new MailAddress(ListaCorreos));
                email.Subject = Subject;
                email.Body = sbBody.ToString();
                email.IsBodyHtml = true;
                email.Priority = MailPriority.High;

                SmtpClient smtp = new SmtpClient();
                smtp.Host = sHost;
                smtp.Port = int.Parse(sPort);
                smtp.EnableSsl = false;
                smtp.UseDefaultCredentials = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

                //Se envia Correo
                smtp.Send(email);
                email.Dispose();

            }
            catch (Exception)
            {
            }
            
        }
        private string[] RutasArchivosCOnfigurables()
        {
            string rutaArchivoIngreso = string.Empty;
            string rutaArchivoCostos = string.Empty;
            string rutaArchivoFluctuacion = string.Empty;
            //Obtenemos ruta configurable Ingresos  de base de datos
            var rutaIngresos = from datos in db.parametrosCargaDocumento
                               where datos.idDocumento == "POLIZAING"
                               select new
                               {
                                   datos.pathURL
                               };

            foreach (var item in rutaIngresos)
            {
                rutaArchivoIngreso = item.pathURL;
            }
            //Validamos que existe la ruta
            if (Directory.Exists(rutaArchivoIngreso) == false)
            {
                Directory.CreateDirectory(rutaArchivoIngreso);
            }
            //Obtenemos ruta configurable Costos  de base de datos
            var rutaCostos = from datos in db.parametrosCargaDocumento
                             where datos.idDocumento == "POLIZACOS"
                             select new
                             {
                                 datos.pathURL
                             };

            foreach (var item in rutaCostos)
            {
                rutaArchivoCostos = item.pathURL;
            }
            //Validamos que existe la ruta
            if (Directory.Exists(rutaArchivoCostos) == false)
            {
                Directory.CreateDirectory(rutaArchivoCostos);
            }
            //Obtenemos ruta configurable Fluctuacion  de base de datos
            var rutaFluctuacion = from datos in db.parametrosCargaDocumento
                                  where datos.idDocumento == "POLIZAFLUC"
                                  select new
                                  {
                                      datos.pathURL
                                  };

            foreach (var item in rutaFluctuacion)
            {
                rutaArchivoFluctuacion = item.pathURL;
            }
            //Validamos que existe la ruta
            if (Directory.Exists(rutaArchivoFluctuacion) == false)
            {
                Directory.CreateDirectory(rutaArchivoFluctuacion);
            }

            string[] Rutas = { rutaArchivoIngreso, rutaArchivoCostos, rutaArchivoFluctuacion };
            return Rutas;
        }
        private int ObtenerMes(string MesTexto)
        {
            int Mes = 0;
            switch (MesTexto)
            {
                case "Enero":
                case "ENERO":
                    Mes = 01;
                    break;
                case "Febrero":
                case "FEBRERO":
                    Mes = 02;
                    break;
                case "Marzo":
                case "MARZO":
                    Mes = 03;
                    break;
                case "Abril":
                case "ABRIL":
                    Mes = 04;
                    break;
                case "Mayo":
                case "MAYO":
                    Mes = 05;
                    break;
                case "Junio":
                case "JUNIO":
                    Mes = 06;
                    break;
                case "Julio":
                case "JULIO":
                    Mes = 07;
                    break;
                case "Agosto":
                case "AGOSTO":
                    Mes = 08;
                    break;
                case "Septiembre":
                case "SEPTIEMBRE":
                    Mes = 09;
                    break;
                case "Octubre":
                case "OCTUBRE":
                    Mes = 10;
                    break;
                case "Noviembre":
                case "NOVIEMBRE":
                    Mes = 11;
                    break;
                case "Diciembre":
                case "DICIEMBRE":
                    Mes = 12;

                    break;
            }

            return Mes;
        }
        private string[] ObtenerNombreArchivo(string Poliza)
        {
            string rutaPolizacsv = string.Empty;
            string RutaArchivo = string.Empty;
            string NombreArchivoPoliza = string.Empty;
            string NumeroPoliza = string.Empty;
            string[] Datos = new string[2];

            //Obtenemos ruta configurable de base de datos
            var ruta = from datos in db.parametrosCargaDocumento
                       where datos.Id == 8
                       select new
                       {
                           datos.pathURL
                       };
            foreach (var item in ruta)
            {
                rutaPolizacsv = item.pathURL;
            }

            string[] Archivos = Directory.GetFiles(rutaPolizacsv, "*.csv");
            
            //Recorremos uno por uno, para obtener nombre del archivo y el contenido              
            foreach (var file in Archivos)
            {
                RutaArchivo = file;
                
                //Obtenemos el numero de poliza
                if (RutaArchivo.Contains("_S1") || RutaArchivo.Contains("_S3") || RutaArchivo.Contains("_SA"))
                {
                    NombreArchivoPoliza = Path.GetFileName(RutaArchivo);
                    string[] LetrasPoliza = NombreArchivoPoliza.Split('_');
                    NumeroPoliza = LetrasPoliza[0].ToString();
                    if (Poliza == NumeroPoliza)
                    {
                        Datos[0] = NombreArchivoPoliza;
                        Datos[1] = NumeroPoliza;
                    }
                }
            }
            return Datos;
        }
        private List<object> ObtenerDatosSAP(string NombreArchivoPoliza)
        {
            List<object> listaSAP = new List<object>();
            //DatosPolizasSAP objDatosPoliza = new DatosPolizasSAP();
            string rutaSAP = string.Empty;
            string RutaArchivo = string.Empty;
            string DescripcionMensaje = string.Empty;
            string NumeroPoliza = string.Empty;
            string NombreArchivo = string.Empty;
            string SentidoPoliza = string.Empty;
            string SentidoSAP = string.Empty;
            string descripcion = string.Empty;
            string[] DatosArchivoPoliza;
            string[] Letras;
            string Poliza1 = string.Empty;
            string Estado = string.Empty;
            string Enviado = string.Empty;
            string Rechazado = string.Empty;
            string Reprocesado = string.Empty;
            int TotalArchivos = 0;
            string FechaCreacion = string.Empty;

            string IdDevengo = Session["IdDevengo"].ToString();
            string ClaseDocumento = Session["ClaseDocumento"].ToString();

            //Obtenemos ruta configurable de base de datos
            var ruta = from datos in db.parametrosCargaDocumento
                       where datos.idDocumento == "SAP"
                       select new
                       {
                           datos.pathURL
                       };
            foreach (var item in ruta)
            {
                rutaSAP = item.pathURL;
            }

            //Validamos que existe la ruta
            if (Directory.Exists(rutaSAP) == false)
            {
                Directory.CreateDirectory(rutaSAP);
            }
            else
            {
                //Buscamos dentro de la carpeta los Archivos
                string[] Archivos = Directory.GetFiles(rutaSAP, "*.csv");
                TotalArchivos = Archivos.Length;

                //Validamos que si alla archivos    
                if (TotalArchivos != 0)
                {
                    DatosArchivoPoliza = NombreArchivoPoliza.Split('_');
                    Poliza1 = DatosArchivoPoliza[0].ToString();
                    SentidoPoliza = DatosArchivoPoliza[1].ToString();

                    //Recorremos uno por uno, para obtener nombre del archivo y el contenido              
                    foreach (var file in Archivos)
                    {
                        //Obtenemos ruta del archivo
                        RutaArchivo = file;
                        //Obtenemos nombre del archivo
                        NombreArchivo = Path.GetFileName(RutaArchivo);
                        FechaCreacion = System.IO.File.GetCreationTime(RutaArchivo).ToString("yyyy/MM/dd");

                        //Sacamos informacion del nombre del archivo
                        Letras = NombreArchivo.Split('_');
                        NumeroPoliza = Letras[0].ToString();
                        SentidoSAP = Letras[2].ToString();
                        //Validamos
                        if (Poliza1 == NumeroPoliza && SentidoPoliza == SentidoSAP)
                        {
                            //Se buscan archivos respuesta de SAP 
                            if (RutaArchivo.Contains(Poliza1 + "_EXITO_" + SentidoPoliza) || RutaArchivo.Contains(Poliza1 + "_ERROR_" + SentidoPoliza))
                            {
                                //Validamosn estatus  Estado                          
                                if (Letras[1].ToString() == "EXITO") { Estado = "Exitoso"; Enviado = "True"; }

                                if (Letras[1].ToString() == "ERROR") { Estado = "Rechazado"; Enviado = "False"; }

                                //Validamos Rechazado 
                                //Erro = Rechazado
                                //Exito  = Exitoso
                                if (Letras[1].ToString() == "Exito") Rechazado = "False"; else Rechazado = "True";
                                Reprocesado = "False";

                                //Obtenemos contenido del archivo
                                GC.Collect();
                                StreamReader sr = new StreamReader(RutaArchivo);
                                DescripcionMensaje = sr.ReadToEnd();
                                string[] des = DescripcionMensaje.Split('\n');
                                foreach (var item in des)
                                {
                                    if (item != "")
                                    {
                                        string[] campo = item.Split(',', '\t');
                                        descripcion += campo[4].ToString() + " ";
                                    }
                                }
                                sr.Close();

                                db.usp_InsertarDatosPolizaSAP(int.Parse(IdDevengo), ClaseDocumento, Estado, true,NombreArchivoPoliza, NumeroPoliza, descripcion, Rechazado, Reprocesado, Poliza1,true);

                            }

                        }
                    }
                }
            }

            return listaSAP;
        }        
        
        private void ConectarSFTP(string RutaArchivo)
        {
            string RutaFTP = string.Empty;
            //Obtenemos ruta configurable de base de datos
            var ruta = from datos in db.parametrosCargaDocumento
                       where datos.idDocumento == "FTP"
                       select new
                       {
                           datos.pathURL
                       };
            foreach (var item in ruta)
            {
                RutaFTP = item.pathURL;
            }
            string sUri = RutaFTP;
            string sUser = ConfigurationManager.AppSettings["UserFTP"];
            string sPass = ConfigurationManager.AppSettings["PassFTP"];

            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create((sUri));
            ServicePointManager.ServerCertificateValidationCallback = (object s, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;
            request.Credentials = new NetworkCredential(sUser, sPass);
            request.KeepAlive = true;
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.UseBinary = true;
            //request.Proxy = null;
            request.UsePassive = true;
            //request.EnableSsl = true;

            //archivo que se va a subir
            StreamReader sourceStream = new StreamReader(RutaArchivo);
            byte[] fileContents = Encoding.UTF8.GetBytes(sourceStream.ReadToEnd());
            sourceStream.Close();
            request.ContentLength = fileContents.Length;

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(fileContents, 0, fileContents.Length);
            requestStream.Close();

            FtpWebResponse response = (FtpWebResponse)request.GetResponse();

            response.Close();
        }
        private string obtieneMes(int? mes)
        {
            var diccionario = new Dictionary<int?, string>
            {
               {1,"ENERO"},
               {2,"FEBRERO"},
               {3,"MARZO"},
               {4,"ABRIL"},
               {5,"MAYO"},
               {6,"JUNIO"},
               {7,"JULIO"},
               {8,"AGOSTO"},
               {9,"SEPTIEMBRE"},
               {10,"OCTUBRE"},
               {11,"NOVIEMBRE"},
               {12,"DICIEMBRE"}
            };

            return diccionario[mes];
        }

        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        //private string DatosCorreo(string[] Archivos)
        //{
            
        //}
       
        #endregion
    }
}