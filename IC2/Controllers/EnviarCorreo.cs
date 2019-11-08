using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;
using IC2.Helpers;

namespace IC2.Models
{
	public class EnviarCorreo
	{

		public static void EnviarCorreoLDI(string Sentido, string Periodo)
		{
			ICPruebaEntities db = new ICPruebaEntities();

			string rutaArchivoIngreso = string.Empty;
			string rutaArchivoCostos = string.Empty;
			string rutaArchivoFluctuacion = string.Empty;
			string sHost = ConfigurationManager.AppSettings["HostCorreo"];
			string sPort = ConfigurationManager.AppSettings["PuertoCorreo"];

			
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
			//string Nombre = "";//Session["NombrePoliza"].ToString();

				//Obtenemos rutas configurables  de base de datos
				string[] Rutas = GenerarPolizas.RutasArchivosConfigurables(2);
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
	}
}