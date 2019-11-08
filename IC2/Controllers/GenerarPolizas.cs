using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using IC2.Helpers;

namespace IC2.Models
{
    public class GenerarPolizas
    {
		//*******************LDI**********************************//

		public static void GeneraPolizasLDI(DateTime Periodo, string Usuario)
        {
            ICPruebaEntities db = new ICPruebaEntities();

            string Ruta = string.Empty;
            string rutaArchivoIngreso = string.Empty;
            string rutaArchivoCostos = string.Empty;
            string rutaArchivoFluctuacion = string.Empty;
            string ClaseDocumentoS = string.Empty;
            string ClaseDocumentoN = string.Empty;
            string ClaseDocumento = string.Empty;
            string NombreArchivo = string.Empty;
            string Poliza = string.Empty;
            StringBuilder sb = new StringBuilder();
            string PeriodoContable = Periodo.ToString("dd/MM/yyyy");

            db.usp_InsertarLinea1();
            db.usp_InsertarArchivoLinea2();

            //Obtenemos rutas configurables  de base de datos
            string[] Rutas = GenerarPolizas.RutasArchivosConfigurables(2);
            rutaArchivoIngreso = Rutas[0].ToString();
            rutaArchivoCostos = Rutas[1].ToString();
            rutaArchivoFluctuacion = Rutas[2].ToString();

			//ClaseDocumento = Session["ClaseDocumento"].ToString();
			//Poliza = Session["Poliza"].ToString();
			//string Id = Session["IdDevengo"].ToString();



			//Generacion Polizas Ingresos
			var polizasIngresos = db.usp_MostrarPolizasAgrupdoCSV("Ingreso",Periodo);

			foreach (var itemPolizas in polizasIngresos) {

                ClaseDocumento = "INGRESO"; ClaseDocumentoS = "S1"; ClaseDocumentoN = "ING";

                //Generamos Nombre del archivo
                NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
                Ruta = rutaArchivoIngreso + NombreArchivo;

                //FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

                //Escribimos contenido dentro del archivo
                using (StreamWriter sw = new StreamWriter(Ruta)) {

                    //Panel1
                    string LineaBodyTipo0 = string.Format("{0} \t{1} \t{2}", "0", "500", "MRT11412");
                    sw.WriteLine(LineaBodyTipo0);
                    sb.Append(LineaBodyTipo0);
                    sb.AppendLine();

                    //Panel2
                    var LineaArchivo1 = db.usp_MostrarLineaArchivo1Agrupado(itemPolizas.Servicio, ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo1) {
                        string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio,  item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
                        sw.WriteLine(LineaBodyTipo1);
                        sb.Append(LineaBodyTipo1);
                        sb.AppendLine();
                    }


                    //Panel3
                    var LineaArchivo2 = db.usp_MostrarLineaArchivo2Agrupado(itemPolizas.Servicio, ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo2) {
                        string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
                                                                                                                                                                                                                                                                                item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
                                                                                                                                                                                                                                                                                item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
                                                                                                                                                                                                                                                                                item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45,item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.BundlePaquetes,
                                                                                                                                                                                                                                                                                item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
                        sw.WriteLine(LineaBodyTipo2);
                        sb.Append(LineaBodyTipo2);
                        sb.AppendLine();



                    }
                    sw.Close();
                }
               int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);


            }

			EnviarCorreo.EnviarCorreoLDI("INGRESO", PeriodoContable); //XCV

			//**************************************************************

			//Generacion Polizas Costos
			//    var polizasCostos = from ListadoPoliza in db.Polizas
			//                        where ListadoPoliza.Sentido == "COSTO" && ListadoPoliza.PeriodoConsumido == Periodo
			//select ListadoPoliza;
			var polizasCostos = db.usp_MostrarPolizasAgrupdoCSV("Costo", Periodo);
			foreach (var itemPolizas in polizasCostos) {

                ClaseDocumento = "COSTO"; ClaseDocumentoS = "S3"; ClaseDocumentoN = "EGR";

                //Generamos Nombre del archivo
                NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
                Ruta = rutaArchivoCostos + NombreArchivo;

                //FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

                //Escribimos contenido dentro del archivo
                using (StreamWriter sw = new StreamWriter(Ruta)) {
                    //sb.Append("");
                    //sb.AppendLine();
                    //sw.WriteLine("");

                    //Panel1
                    string LineaBodyTipo0 = string.Format("{0} \t{1} \t{2}", "0", "500", "MRT11412");
                    sw.WriteLine(LineaBodyTipo0);
                    sb.Append(LineaBodyTipo0);
                    sb.AppendLine();

					//Panel2
					var LineaArchivo1 = db.usp_MostrarLineaArchivo1Agrupado(itemPolizas.Servicio, ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo1) {
                        string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
                        sw.WriteLine(LineaBodyTipo1);
                        sb.Append(LineaBodyTipo1);
                        sb.AppendLine();
                    }

					//Panel3
					var LineaArchivo2 = db.usp_MostrarLineaArchivo2Agrupado(itemPolizas.Servicio, ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo2) {
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				 item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				 item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				 item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.BundlePaquetes,
																																																																				 item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
                        sb.AppendLine();

                    }


                    sw.Close();
                }
                int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
            }
            EnviarCorreo.EnviarCorreoLDI("COSTO", PeriodoContable); //XCV

            //**************************************************************

            //Generacion Polizas FluctuacionIngresos
            var polizasFluctuacionI = db.usp_MostrarPolizasAgrupdoCSV("FLUCTUACIONINGRESO", Periodo);

			foreach (var itemPolizas in polizasFluctuacionI) {

                ClaseDocumento = "FLUCTUACIONINGRESO"; ClaseDocumentoS = "SA"; ClaseDocumentoN = "FLUINGRESO";
                //Generamos Nombre del archivo
                NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
                Ruta = rutaArchivoFluctuacion + NombreArchivo;

                //FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

                //Escribimos contenido dentro del archivo
                using (StreamWriter sw = new StreamWriter(Ruta)) {                 

                    //Panel1
                    string LineaBodyTipo0 = string.Format("{0} \t{1} \t{2}", "0", "500", "MRT11412");
                    sw.WriteLine(LineaBodyTipo0);
                    sb.Append(LineaBodyTipo0);
                    sb.AppendLine();

					//Panel2
					var LineaArchivo1 = db.usp_MostrarLineaArchivo1Agrupado("Fluctuacion T.C.", ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo1) {
                        string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
                        sw.WriteLine(LineaBodyTipo1);
                        sb.Append(LineaBodyTipo1);
                        sb.AppendLine();
                    }


					//Panel3
					var LineaArchivo2 = db.usp_MostrarLineaArchivo2Agrupado("", ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo2) {
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																			   item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																			   item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																			   item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.BundlePaquetes,
																																																																			   item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
                        sb.AppendLine();

                    }


                    sw.Close();
                }

                int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
            }

			//**************************************************************

			//Generacion Polizas FluctuacionCosto
			var polizasFluctuacionC = db.usp_MostrarPolizasAgrupdoCSV("FLUCTUACIONCOSTO", Periodo);

			foreach (var itemPolizas in polizasFluctuacionC)
			{

				ClaseDocumento = "FLUCTUACIONCOSTO"; ClaseDocumentoS = "SA"; ClaseDocumentoN = "FLUCOSTO";
				//Generamos Nombre del archivo
				NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
				Ruta = rutaArchivoFluctuacion + NombreArchivo;

				//FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

				//Escribimos contenido dentro del archivo
				using (StreamWriter sw = new StreamWriter(Ruta))
				{
					//sb.Append("");
					//sb.AppendLine();
					//sw.WriteLine("");

					//Panel1
					string LineaBodyTipo0 = string.Format("{0}\t{1}\t{2}", "0", "500", "MRT11412");
					sw.WriteLine(LineaBodyTipo0);
					sb.Append(LineaBodyTipo0);
					sb.AppendLine();

					//Panel2
					var LineaArchivo1 = db.usp_MostrarLineaArchivo1Agrupado("Fluctuacion T.C.", ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo1)
					{
						string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
						sw.WriteLine(LineaBodyTipo1);
						sb.Append(LineaBodyTipo1);
						sb.AppendLine();
					}


					//Panel3
					var LineaArchivo2 = db.usp_MostrarLineaArchivo2Agrupado("", ClaseDocumento, Periodo);

					foreach (var item in LineaArchivo2)
					{
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				   item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				   item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				   item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.BundlePaquetes,
																																																																				   item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
						sb.AppendLine();

					}


					sw.Close();
				}

				int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
			}



			EnviarCorreo.EnviarCorreoLDI("FLUCTUACION", PeriodoContable); //XCV
			//ConectarSFTP(Ruta);

			//string NombrePoliza = Session["NombrePoliza"].ToString();
			//string Estado = string.Empty;
			//if (Session["Estado"] != null) Estado = Session["Estado"].ToString(); else Estado = "";
			//int i = db.usp_InsertarDatosPolizaSAP(IdDevengo, ClaseDocumento, Estado, NombreArchivo, "", "", "", "", Poliza);           
		}      
        public static void ReporteRechazoSAP()
        {
            ICPruebaEntities db = new ICPruebaEntities();
            StringBuilder sb = new StringBuilder();
            //List<string> lista = new List<string>();
            List<object> lista = new List<object>();
            string Ruta = string.Empty;
            string rutaArchivoIngreso = string.Empty;

            var ruta = from datos in db.parametrosCargaDocumento
                       where datos.idDocumento == "RRECHAZO"
					   select new
                       {
                           datos.pathURL
                       };
            foreach (var item in ruta) {
                rutaArchivoIngreso = item.pathURL;
            }

            //Validamos que existe la ruta
            if (Directory.Exists(rutaArchivoIngreso) == false) {
                Directory.CreateDirectory(rutaArchivoIngreso);
            }

            string NombreArchivo = "LogRechazoPolizas.csv";

            var Rechazo = from P in db.PolizasAgrupadoLDI
                          where P.Estado == "Rechazado"
                          select new { P.Poliza, P.Sentido, P.Estado, P.Nombre, P.DescripcionMensaje };

            Ruta = rutaArchivoIngreso + NombreArchivo;

			//Creamos archivo LOG CVS
            using (StreamWriter sw = new StreamWriter(Ruta)) {

                sw.WriteLine("{0},{1},{2},{3},{4}", "Poliza", "Sociedad", "Estatus", "Nombre Archivo", "Descripcion Mensaje");

                foreach (var item in Rechazo) {
                    sb.AppendLine();
                    sw.WriteLine("");

                    string LineaRechazo = string.Format("{0},{1},{2},{3},{4}", item.Poliza, item.Sentido, item.Estado, item.Nombre, item.DescripcionMensaje);
                    sw.WriteLine(LineaRechazo);
                    sb.Append(LineaRechazo);
                    sb.AppendLine();
                }
                sw.Close();
            }
        }		
       

		//*******************ROAMING**********************************//

		public static void GeneraPolizasRoamig(DateTime Periodo, string Usuario)
		{
			ICPruebaEntities db = new ICPruebaEntities();

			string Ruta = string.Empty;
			string rutaArchivoIngreso = string.Empty;
			string rutaArchivoCostos = string.Empty;
			string rutaArchivoFluctuacion = string.Empty;
			string ClaseDocumentoS = string.Empty;
			string ClaseDocumentoN = string.Empty;
			string ClaseDocumento = string.Empty;
			string NombreArchivo = string.Empty;
			string Poliza = string.Empty;
			StringBuilder sb = new StringBuilder();
			string PeriodoContable = Periodo.ToString("dd/MM/yyyy");

			db.usp_InsertarLinea1Roaming();
			db.usp_InsertarArchivoLinea2Roaming();

			//Obtenemos rutas configurables  de base de datos
			string[] Rutas = GenerarPolizas.RutasArchivosConfigurables(1);
			rutaArchivoIngreso = Rutas[0].ToString();
			rutaArchivoCostos = Rutas[1].ToString();
			rutaArchivoFluctuacion = Rutas[2].ToString();

			//ClaseDocumento = Session["ClaseDocumento"].ToString();
			//Poliza = Session["Poliza"].ToString();
			//string Id = Session["IdDevengo"].ToString();



			//Generacion Polizas Ingresos
			var polizasIngresos = from ListadoPoliza in db.PolizasRoaming
								  where ListadoPoliza.Sentido == "INGRESO" && ListadoPoliza.PeriodoConsumido == Periodo
								  select ListadoPoliza;
			foreach (var itemPolizas in polizasIngresos)
			{

				ClaseDocumento = "INGRESO"; ClaseDocumentoS = "S1"; ClaseDocumentoN = "ING";

				//Generamos Nombre del archivo
				NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
				Ruta = rutaArchivoIngreso + NombreArchivo;

				//FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

				//Escribimos contenido dentro del archivo
				using (StreamWriter sw = new StreamWriter(Ruta))
				{

					//Panel1
					string LineaBodyTipo0 = string.Format("{0} \t{1} \t{2}", "0", "500", "MRT11412");
					sw.WriteLine(LineaBodyTipo0);
					sb.Append(LineaBodyTipo0);
					sb.AppendLine();

					//Panel2
					var LineaArchivo1 = from Linea1 in db.LineaArchivo1Roaming
										where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumentoS
										select Linea1;

					foreach (var item in LineaArchivo1)
					{
						string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
						sw.WriteLine(LineaBodyTipo1);
						sb.Append(LineaBodyTipo1);
						sb.AppendLine();
					}

					//Panel3
					var LineaArchivo2 = from Linea2 in db.LineaArchivo2Roaming
										where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
										select Linea2;

					foreach (var item in LineaArchivo2)
					{
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.BundlePaquetes,
																																																																				item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
						sb.AppendLine();



					}
					sw.Close();
				}
				//int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);


			}

			EnviarCorreo.EnviarCorreoLDI("INGRESO", PeriodoContable); //XCV

			//**************************************************************

			//Generacion Polizas Costos
			var polizasCostos = from ListadoPoliza in db.PolizasRoaming
								where ListadoPoliza.Sentido == "COSTO" && ListadoPoliza.PeriodoConsumido == Periodo
								select ListadoPoliza;
			foreach (var itemPolizas in polizasCostos)
			{

				ClaseDocumento = "COSTO"; ClaseDocumentoS = "S3"; ClaseDocumentoN = "EGR";

				//Generamos Nombre del archivo
				NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
				Ruta = rutaArchivoCostos + NombreArchivo;

				//FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

				//Escribimos contenido dentro del archivo
				using (StreamWriter sw = new StreamWriter(Ruta))
				{
					//sb.Append("");
					//sb.AppendLine();
					//sw.WriteLine("");

					//Panel1
					string LineaBodyTipo0 = string.Format("{0} \t{1} \t{2}", "0", "500", "MRT11412");
					sw.WriteLine(LineaBodyTipo0);
					sb.Append(LineaBodyTipo0);
					sb.AppendLine();

					//Panel2
					var LineaArchivo1 = from Linea1 in db.LineaArchivo1Roaming
										where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumentoS
										select Linea1;

					foreach (var item in LineaArchivo1)
					{
						string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
						sw.WriteLine(LineaBodyTipo1);
						sb.Append(LineaBodyTipo1);
						sb.AppendLine();
					}

					//Panel3
					var LineaArchivo2 = from Linea2 in db.LineaArchivo2Roaming
										where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
										select Linea2;
					foreach (var item in LineaArchivo2)
					{
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.BundlePaquetes,
																																																																				item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
						sb.AppendLine();

					}


					sw.Close();
				}
				//int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
			}
			EnviarCorreo.EnviarCorreoLDI("COSTO", PeriodoContable); //XCV

			//**************************************************************

			//Generacion Polizas FluctuacionIngresos
			var polizasFluctuacion = from ListadoPoliza in db.PolizasRoaming
									 where ListadoPoliza.Sentido == "FLUCTUACIONINGRESO" && ListadoPoliza.PeriodoConsumido == Periodo
									 select ListadoPoliza;
			
			foreach (var itemPolizas in polizasFluctuacion)
			{

				ClaseDocumento = "FLUCTUACIONINGRESO"; ClaseDocumentoS = "SA"; ClaseDocumentoN = "FLUINGRESO";
				//Generamos Nombre del archivo
				NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
				Ruta = rutaArchivoFluctuacion + NombreArchivo;

				//FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

				//Escribimos contenido dentro del archivo
				using (StreamWriter sw = new StreamWriter(Ruta))
				{

					//Panel1
					string LineaBodyTipo0 = string.Format("{0} \t{1} \t{2}", "0", "500", "MRT11412");
					sw.WriteLine(LineaBodyTipo0);
					sb.Append(LineaBodyTipo0);
					sb.AppendLine();

					//Panel2
					var LineaArchivo1 = from Linea1 in db.LineaArchivo1Roaming
										where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumento
										select Linea1;
					
					foreach (var item in LineaArchivo1)
					{
						string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
						sw.WriteLine(LineaBodyTipo1);
						sb.Append(LineaBodyTipo1);
						sb.AppendLine();
					}


					//Panel3
					var LineaArchivo2 = from Linea2 in db.LineaArchivo2Roaming
										where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
										select Linea2;
					foreach (var item in LineaArchivo2)
					{
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.Paquetes,
																																																																				item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
						sb.AppendLine();

					}


					sw.Close();
				}

				//int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
			}

			//**************************************************************

			//Generacion Polizas FluctuacionCosto
			var polizasFluctuacionC = from ListadoPoliza in db.PolizasRoaming
									 where ListadoPoliza.Sentido == "FLUCTUACIONCOSTO" && ListadoPoliza.PeriodoConsumido == Periodo
									 select ListadoPoliza;
			foreach (var itemPolizas in polizasFluctuacionC)
			{

				ClaseDocumento = "FLUCTUACIONCOSTO"; ClaseDocumentoS = "SA"; ClaseDocumentoN = "FLUCOSTO";
				//Generamos Nombre del archivo
				NombreArchivo = itemPolizas.Poliza + "_" + ClaseDocumentoS + "_" + ClaseDocumentoN + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
				Ruta = rutaArchivoFluctuacion + NombreArchivo;

				//FechaCreacion = System.IO.File.GetCreationTime(Ruta).ToString("yyyy/MM/dd");

				//Escribimos contenido dentro del archivo
				using (StreamWriter sw = new StreamWriter(Ruta))
				{
					//sb.Append("");
					//sb.AppendLine();
					//sw.WriteLine("");

					//Panel1
					string LineaBodyTipo0 = string.Format("{0}\t{1}\t{2}", "0", "500", "MRT11412");
					sw.WriteLine(LineaBodyTipo0);
					sb.Append(LineaBodyTipo0);
					sb.AppendLine();

					//Panel2
					var LineaArchivo1 = from Linea1 in db.LineaArchivo1Roaming
										where Linea1.Id_Devengo == itemPolizas.IdPoliza && Linea1.ClaseDocumento == ClaseDocumento
										select Linea1;
					foreach (var item in LineaArchivo1)
					{
						string LineaBodyTipo1 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}", item.Reg, item.Trans, item.ClaseDocumento, item.Sociedad, item.Moneda, item.TipoCambio, item.FechaDocumento, item.FechaContabilizacion, item.FechaReversion, item.TextoCabecera, item.MotivoReversion, item.Libro, item.Referencia, item.Referencia2, item.IdCasuistica, "1", item.Referencia22, item.CalculoAut);
						sw.WriteLine(LineaBodyTipo1);
						sb.Append(LineaBodyTipo1);
						sb.AppendLine();
					}


					//Panel3
					var LineaArchivo2 = from Linea2 in db.LineaArchivo2Roaming
										where Linea2.Id_Devengo == itemPolizas.IdPoliza && Linea2.Sentido == ClaseDocumento
										select Linea2;

						foreach (var item in LineaArchivo2)
					{
						string LineaBodyTipo2 = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}\t{14}\t{15}\t{16}\t{17}\t{18}\t{19}\t{20}\t{21}\t{22}\t{23}\t{24}\t{25}\t{26}\t{27}\t{28}\t{29}\t{30}\t{31}\t{32}\t{33}\t{34}\t{35}\t{36}\t{37}\t{38}\t{39}\t{40}\t{41}\t{42}\t{43}\t{44}\t{45}\t{46}\t{47}\t{48}\t{49}\t{50}\t{51}\t{52}\t{53}\t{54}\t{55}\t{56}", item.REG, item.ClaveContab, item.CME, item.ImporteMD, item.ImporteML, item.IndicadorImpuesto, item.CentroCosto, item.Orden, item.FechaBase, item.Asignacion, item.TextoPosicion, item.CondPago, item.BloqPago, item.ViaPago,
																																																																				item.BcoPropio, item.Cuenta, item.REF1, item.REF2, item.lineaDeNegocio, item.Campo20, item.Campo21, item.Campo22, item.SociedadCuentasDeIngresos, item.Subsegm, item.Servicio, item.Region, item.Licencia,
																																																																				item.TipoDeTrafico, item.Ambito, item.Producto, item.Geografia, item.Paquetes, item.PlanRegulatorio, item.EmpresaGrupo, item.REF3, item.AreaFuncional, item.CalculoImpuesto, item.FechaValor, item.IndicadorActividadPEl,
																																																																				item.RegionEstadoFederalLandProvinciaCondado, item.ClaseDeDistribuciónIRPF, item.Campo42, item.Proyecto, item.SociedadGLAsociada, item.Campo45, item.CodMaterial, item.CodEmplazFiscal, item.Grafo, item.Grafo2, item.Subsegmento, item.Paquetes,
																																																																				item.SubtipoLinea, item.Canal, item.ServiciosPA, item.SegmentoPA, item.importebaseimpuesto, item.ASIENTO);
						sw.WriteLine(LineaBodyTipo2);
						sb.Append(LineaBodyTipo2);
						sb.AppendLine();

					}


					sw.Close();
				}

				//int i = db.usp_InsertarDatosPolizaSAP(itemPolizas.ID, ClaseDocumento, "EnviadoSAP", true, NombreArchivo, "", "", "", "", itemPolizas.Poliza, true);
			}
     
		}



		public static string[] RutasArchivosConfigurables(int LineaNegocio)
		{
			ICPruebaEntities db = new ICPruebaEntities();
			string rutaArchivoIngreso = string.Empty;
			string rutaArchivoCostos = string.Empty;
			string rutaArchivoFluctuacion = string.Empty;

			if (LineaNegocio == 2)
			{
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
			}
			if (LineaNegocio == 1)
			{
				//Obtenemos ruta configurable Ingresos  de base de datos
				var rutaIngresos = from datos in db.parametrosCargaDocumento
								   where datos.idDocumento == "POLIZAINGR"
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
								 where datos.idDocumento == "POLIZACOSR"
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
									  where datos.idDocumento == "POLIZAFLUR"
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
			}

			string[] Rutas = { rutaArchivoIngreso, rutaArchivoCostos, rutaArchivoFluctuacion };
			return Rutas;
		}
		public static List<object> ObtenerDatosSAP(int LineaNegocio)
		{
			ICPruebaEntities db = new ICPruebaEntities();
			List<object> listaSAP = new List<object>();
			//DatosPolizasSAP objDatosPoliza = new DatosPolizasSAP();
			string rutaSAP = string.Empty;
			string moverRutaSAP = string.Empty;
			string RutaArchivo = string.Empty;
			string MoverRutaArchivo = string.Empty;
			string DescripcionMensaje = string.Empty;
			string NumeroPoliza = string.Empty;
			string NombreArchivo = string.Empty;
			string Sentido = string.Empty;
			string SentidoSAP = string.Empty;
			string descripcion = string.Empty;
			//string[] DatosArchivoPoliza;
			string[] Letras;
			string Poliza1 = string.Empty;
			string Estado = string.Empty;
			string Enviado = string.Empty;
			string Rechazado = string.Empty;
			string Reprocesado = string.Empty;
			int TotalArchivos = 0;
			string FechaCreacion = string.Empty;
			string NombrePoliza = string.Empty;

			//string IdDevengo = "";// Session["IdDevengo"].ToString();
			//string ClaseDocumento = ""; //Session["ClaseDocumento"].ToString();

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

			//Obtenemos ruta configurable para mover lso archivos
			var moverRuta = from datos in db.parametrosCargaDocumento
					   where datos.idDocumento == "MOVERSAP"
							select new
					   {
						   datos.pathURL
					   };
			foreach (var item in moverRuta)
			{
				moverRutaSAP = item.pathURL;
			}

			//Validamos que existe la ruta
			if (Directory.Exists(rutaSAP) == false)
			{
				Directory.CreateDirectory(rutaSAP);
			}
			//Validamos que existe la ruta
			if (Directory.Exists(moverRutaSAP) == false)
			{
				Directory.CreateDirectory(moverRutaSAP);
			}
			else
			{
				//Buscamos dentro de la carpeta los Archivos
				string[] Archivos = Directory.GetFiles(rutaSAP, "*.csv");
				TotalArchivos = Archivos.Length;

				//Validamos que si alla archivos    
				if (TotalArchivos != 0)
				{
					//DatosArchivoPoliza = NombreArchivoPoliza.Split('_');
					//Poliza1 = DatosArchivoPoliza[0].ToString();
					//SentidoPoliza = DatosArchivoPoliza[1].ToString();

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
						if (SentidoSAP == "S1") Sentido = "INGRESO";
						if (SentidoSAP == "S3") Sentido = "COSTO";
						if (SentidoSAP == "SA") Sentido = "FLUCTUACION";
						//Validamos

						//Se buscan archivos respuesta de SAP 
						if (RutaArchivo.Contains(NumeroPoliza + "_EXITO_" + SentidoSAP) || RutaArchivo.Contains(NumeroPoliza + "_ERROR_" + SentidoSAP))
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

							var Nombre = from P in db.PolizasAgrupadoLDI
										 where P.Sentido == Sentido
										 && P.Poliza == NumeroPoliza
										 select new { P.Poliza, P.Sentido, P.Estado, P.Nombre, P.DescripcionMensaje };
							foreach (var item in Nombre)
							{
								NombrePoliza = item.Nombre;
							}


							//Movemos el archivo a otra ruta/carpeta
							//si existe el archivo en la otra carpeta lo borramos
							MoverRutaArchivo = moverRutaSAP + NombreArchivo;
							if (File.Exists(MoverRutaArchivo))
								File.Delete(MoverRutaArchivo);

							//movemos el archivo ala otra carpeta
							File.Move(RutaArchivo, MoverRutaArchivo);


							//Atualizamos datos Respuesta SAP
							if (LineaNegocio == 2)
							{
								int a = db.usp_ActualizarDatosPolizaSAP(0, Sentido, Estado, true, NombrePoliza, NumeroPoliza, descripcion, Rechazado, Reprocesado, NumeroPoliza, true);
							}
							if(LineaNegocio ==1)
							{
								int a = db.usp_ActualizarDatosPolizaSAPRoaming(0, Sentido, Estado, true, NombrePoliza, NumeroPoliza, descripcion, Rechazado, Reprocesado, NumeroPoliza, true);
							}
							descripcion = "";
						}


					}
					//Si esta rechazado enviamos SMS
					var Rechazo = (from P in db.PolizasAgrupadoLDI
								   where P.Estado == "Rechazado"
								   select P).Count();
					if (Rechazo > 0)
					{
						//Se genera Archivo LOG
						ReporteRechazoSAP();

						//GenerarPolizas.EnviarSMS("5517628128", "Mensaje Polizas Rechazadas", @"C:\RepositoriosDocs\SMS\envia_sms.bat");
						GenerarPolizas.EnviarSMS("", "Mensaje Polizas Rechazadas", "");//XCV
					}
				}
			}

			return listaSAP;
		}
		public static void EnviarSMS(string numero, string mensaje, string rutaSMS)
		{
			ICPruebaEntities db = new ICPruebaEntities();
			string numeroTelefono = string.Empty;
			string RutaSMS = string.Empty;
			string[] numerosTelefonos;

			try
			{
				var Ruta = from datos in db.parametrosCargaDocumento
						   where datos.idDocumento == "RUTASMS"
						   select new
						   {
							   datos.pathURL
						   };
				foreach (var item in Ruta)
				{
					RutaSMS = item.pathURL;
				}

				var Telefono = from datos in db.parametrosCargaDocumento
							   where datos.idDocumento == "TELSMS"
							   select new
							   {
								   datos.pathURL
							   };
				foreach (var item in Telefono)
				{
					numeroTelefono = item.pathURL;
				}
				numerosTelefonos = numeroTelefono.Split(',');

				foreach (var item in numerosTelefonos)
				{
					System.Diagnostics.Process proceso = new System.Diagnostics.Process();
					proceso.StartInfo.FileName = RutaSMS;
					proceso.StartInfo.Arguments = string.Concat(item.Replace(" ", ""), " ", "\"", mensaje, "\"");
					proceso.StartInfo.UseShellExecute = true;
					proceso.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
					proceso.Start();
				}
			}
			catch (Exception ex)
			{
				throw ex;
			}

		}

	}
}