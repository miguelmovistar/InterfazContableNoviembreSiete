using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Reflection;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using IC2.Models;

namespace IC2.Helpers
{
    public class Log
    {

        /// <summary>
        /// Inserta en bitacora la modificacion que se ha realizado
        /// </summary>
        /// <param name="objeto">Objeto entity que se modifica</param>
        /// <param name="campoID">Campo id de la tabla que se modifica</param>
        /// <param name="id">Id del registro que se modifica</param>
        /// <param name="pantalla">Pantalla que se modifica</param>
        public void insertaBitacoraModificacion(object objeto, string campoID, int id, string pantalla, string ip)
        {
            Type tipe = objeto.GetType();
            string campo = string.Empty;
            string valor = string.Empty;
            PropertyInfo[] listaProperties = objeto.GetType().GetProperties();
            string valorActual = string.Empty;
            bool existeCambio = false;
            StringBuilder valorModificado = new StringBuilder();
            StringBuilder valorAnterior = new StringBuilder();
            string camposModificados = string.Empty;
            string nombreTabla = (tipe.BaseType.Name == "Object" ? tipe.Name : tipe.BaseType.Name);
            string consulta = string.Concat("SELECT * FROM ", nombreTabla, " WHERE " + campoID + "=", id.ToString());
            string usuario = string.Empty;
            HttpContext context = HttpContext.Current;
            if (context.Session["userName"] != null)
                usuario = context.Session["userName"].ToString();
            bool nollave = (tipe.BaseType.Name == "Object" ? true : false);

            using (SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["sqlServer"].ToString()))
            {
                try {
                    con.Open();
                    SqlCommand comand = new SqlCommand(consulta, con);
                    SqlDataReader reader = comand.ExecuteReader();
                    while (reader.Read()) {

                        foreach (PropertyInfo pro in listaProperties) {
                            if (pro.DeclaringType.Name == nombreTabla) {
                                string Nombrecampo = string.Empty;
                                if (pro.Name == "Servicio1")
                                    Nombrecampo = "Servicio";
                                else if (pro.Name == "Tarifa1")
                                    Nombrecampo = "Tarifa";
                                else if (pro.Name == "Acreedor1")
                                    Nombrecampo = "Acreedor";
                                else if (pro.Name == "Usuario1")
                                    Nombrecampo = "Usuario";
                                else if (pro.Name == "Concepto1")
                                    Nombrecampo = "Concepto";
                                else if (pro.Name == "Grupo1")
                                    Nombrecampo = "Grupo";
                                else if (pro.Name == "Moneda1")
                                    Nombrecampo = "Moneda";
                                else
                                    Nombrecampo = pro.Name;

                                valorActual = (reader[Nombrecampo] != null ? reader[Nombrecampo].ToString() : string.Empty);
                                //valor = pro.GetValue(objeto).ToString();
                                if (!valorActual.Equals((pro.GetValue(objeto) != null ? pro.GetValue(objeto).ToString() : string.Empty))) {
                                    if (camposModificados.Equals(string.Empty)) {
                                        camposModificados = pro.Name;
                                        valorAnterior.Append(valorActual);
                                        valorModificado.Append(pro.GetValue(objeto) != null ? pro.GetValue(objeto).ToString() : string.Empty);
                                    } else {
                                        camposModificados += "|" + pro.Name;
                                        valorAnterior.Append("|" + valorActual);
                                        valorModificado.Append("|" + (pro.GetValue(objeto) != null ? pro.GetValue(objeto).ToString() : string.Empty));
                                    }

                                    existeCambio = true;
                                }
                            }
                        }


                    }
                } 
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (existeCambio)
            {
                try
                {
                    using (ICPruebaEntities db = new ICPruebaEntities())
                    {
                        LogActualizaciones reg = new LogActualizaciones();
                        reg.NombrePantalla = pantalla;
                        reg.ColumnaModificada = camposModificados;
                        reg.Valor_Nuevo = valorModificado.ToString();
                        reg.Valor_Anterior = valorAnterior.ToString();
                        reg.Fecha = DateTime.Now;
                        reg.Direccion_IP = ip;
                        reg.Accion = "Modificacion";
                        reg.Activo = 1;
                        reg.Usuario = usuario;
                        db.LogActualizaciones.Add(reg);
                        db.SaveChanges();
                    }
                } catch (Exception ex)
                {
                    throw ex;
                }
            }



        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="objeto"></param>
        /// <param name="accion"></param>
        /// <param name="pantalla"></param>
        public void insertaNuevoOEliminado(object objeto, string accion, string pantalla, string ip)
        {

            StringBuilder valores = new StringBuilder();
            string campos = string.Empty;
            string usuario = string.Empty;
            HttpContext context = HttpContext.Current;
            if (context.Session["userName"] != null)
                usuario = context.Session["userName"].ToString();

            PropertyInfo[] listaProperties = objeto.GetType().GetProperties();

            foreach (PropertyInfo item in listaProperties)
            {
                if (campos == string.Empty)
                {
                    campos = item.Name;
                    valores.Append((item.GetValue(objeto) != null ? item.GetValue(objeto).ToString() : string.Empty));
                }
                else
                {
                    campos += string.Concat("|", item.Name);
                    valores.Append(string.Concat("|", (item.GetValue(objeto) != null ? item.GetValue(objeto).ToString() : string.Empty)));
                }
            }

            try
            {
                using (ICPruebaEntities db = new ICPruebaEntities())
                {
                    LogActualizaciones reg = new LogActualizaciones();
                    reg.NombrePantalla = pantalla;
                    reg.ColumnaModificada = campos;
                    reg.Valor_Nuevo = valores.ToString();
                    reg.Valor_Anterior = string.Empty;
                    reg.Fecha = DateTime.Now;
                    reg.Direccion_IP = ip;
                    reg.Accion = accion;
                    reg.Activo = 1;
                    reg.Usuario = usuario;
                    db.LogActualizaciones.Add(reg);
                    db.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        private string GetDireccionIp(System.Web.HttpRequest request)

        {

            // Recuperamos la IP de la máquina del cliente

            // Primero comprobamos si se accede desde un proxy

            string ipAddress1 = request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            // Acceso desde una máquina particular

            string ipAddress2 = request.ServerVariables["REMOTE_ADDR"];

            string ipAddress = string.IsNullOrEmpty(ipAddress1) ? ipAddress2 : ipAddress1;



            // Devolvemos la ip

            return ipAddress;

        }
    }
}