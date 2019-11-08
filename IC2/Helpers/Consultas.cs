using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Reflection;

namespace IC2.Helpers
{
    public class Consultas
    {

        public StringBuilder construyeCondiciones(object obj)
        {
            StringBuilder resultado = new StringBuilder();
            string valor = string.Empty;
            string nombreCampo = string.Empty;
            Type tipe = obj.GetType();
            string nombreTabla = (tipe.BaseType.Name == "Object" ? tipe.Name : tipe.BaseType.Name);

            try
            {
                PropertyInfo[] propiedades = obj.GetType().GetProperties();
                foreach (PropertyInfo item in propiedades)
                {
                    if (item.DeclaringType.Name == nombreTabla)
                    {
                        if (item.Name == "Servicio1")
                            nombreCampo = "Servicio";
                        else if (item.Name == "Tarifa1")
                            nombreCampo = "Tarifa";
                        else if (item.Name == "Acreedor1")
                            nombreCampo = "Acreedor";
                        else if (item.Name == "Usuario1")
                            nombreCampo = "Usuario";
                        else if (item.Name == "Concepto1")
                            nombreCampo = "Concepto";
                        else if (item.Name == "Grupo1")
                            nombreCampo = "Grupo";
                        else if (item.Name == "Moneda1")
                            nombreCampo = "Moneda";
                        else
                            nombreCampo = item.Name;

                        valor = item.GetValue(obj) != null ? item.GetValue(obj).ToString() : string.Empty;
                        if (!valor.Equals(string.Empty) && !valor.Equals("0") && !valor.ToUpper().Contains("0001 12:00:00 AM") && !valor.ToUpper().Contains("0001 12:00:00 A. M."))
                        {

                            resultado.Append(string.Concat(" AND UPPER(", nombreCampo, ") LIKE '%", valor.ToUpper(), "%'"));

                        }
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }



            return resultado;

        }

        public string armaconsultaFechas(Dictionary<string, string> fechas)
        {
            string resultado = string.Empty;
            string textoAux = string.Empty;
            foreach (KeyValuePair<string, string> item in fechas)
            {
                if (item.Value != null)
                {
                    if (!item.Value.Equals(string.Empty))
                    {

                        resultado = string.Concat(" AND (CONVERT(VARCHAR(10),", item.Key, ", 105) + ' ' + CONVERT(VARCHAR(8),", item.Key, ", 108)) LIKE '%", item.Value.ToUpper(), "%'");
                    }
                }
            }

            return resultado;

        }

        public StringBuilder consultaInicial(object obj)
        {
            StringBuilder resultado = new StringBuilder();
            Type tipe = obj.GetType();
            string nombreCampo = string.Empty;
            string nombreTabla = (tipe.BaseType.Name == "Object" ? tipe.Name : tipe.BaseType.Name);
            int iteracciones = 0;
            try
            {
                PropertyInfo[] propiedades = obj.GetType().GetProperties();
                foreach (PropertyInfo item in propiedades)
                {
                    if (item.DeclaringType.Name == nombreTabla)
                    {
                        if (item.Name == "Servicio1")
                            nombreCampo = "Servicio";
                        else if (item.Name == "Tarifa1")
                            nombreCampo = "Tarifa";
                        else if (item.Name == "Acreedor1")
                            nombreCampo = "Acreedor";
                        else if (item.Name == "Usuario1")
                            nombreCampo = "Usuario";
                        else if (item.Name == "Concepto1")
                            nombreCampo = "Concepto";
                        else if (item.Name == "Grupo1")
                            nombreCampo = "Grupo";
                        else if (item.Name == "Moneda1")
                            nombreCampo = "Moneda";
                        else
                            nombreCampo = item.Name;

                        if (iteracciones == 0)
                        {
                            resultado.Append(string.Concat("SELECT ", nombreCampo));
                            iteracciones = 1;
                        }
                        else
                            resultado.Append(string.Concat(",", nombreCampo));

                    }
                }
                resultado.Append(string.Concat(" FROM ", nombreTabla, " "));
            }
            catch (Exception ex)
            {

                throw ex;
            }


            return resultado;
        }

        public StringBuilder consultaFinal(object obj, string textoInicialWhere, Dictionary<string, string> fechas, out string sb)
        {
            sb = string.Empty;
            string textoTemp = string.Empty;
            StringBuilder result = new StringBuilder();
            textoTemp = consultaInicial(obj).ToString();
            result.Append(textoTemp);
            result.Append(textoInicialWhere);
            sb = result.ToString();
            result.Append(construyeCondiciones(obj).ToString());
            result.Append(armaconsultaFechas(fechas));

            return result;
        }


    }
}