using IC2.Funciones;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace IC2.Comun.Excel
{
    internal class ExcelReader
    {
        protected string[] separatorsLines = new string[] { "\r\n", "\r", "\n" };
        protected string[] separatorColumns = new string[] { "|" };
        protected bool encabezado = false;

        public int TotalProcesados { get; internal set; }
        public List<object> ListaErrores { get; internal set; } = new List<object>();

        public ExcelReader(bool encabezado) {
            this.encabezado = encabezado;
        }
        virtual public IEnumerable<T> LeerElements<T>(Stream source) where T : class, new()
        {

            IEnumerable<string> lineas = GetLines(source);

            IEnumerable<T> elementos = ObtenerRenglones<T>(lineas);

            OperacionPostLectura(elementos.ToList());

            return elementos;
        }

        protected IEnumerable<string> GetLines(Stream stream) {
            byte[] content = new byte[stream.Length];
            stream.Read(content, 0, (int)stream.Length);
            string contentStr = Encoding.UTF8.GetString(content);
            return contentStr.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None).ToList();
        }
        protected decimal ConvertToDecimal(string val)
        {

            if (decimal.TryParse(val, out decimal num))
                return num;
            else
                return 0;
        }
 
        virtual protected void OperacionPostLectura<T>(IList<T> lista) where T:class, new ()
        {
           
        }
        virtual protected bool ValidaLinea(string[] arreglo, out string msg) { msg = ""; return true; }
        virtual protected T LeerRenglon<T>(string[] linea, int filaActual) where T : class, new()
        {

            return new T();

        }
        virtual protected string[] DividirLinea(string linea) {

            Cadenas cadena = new Cadenas();

            if (linea.Length == 0)
                return null;

            string lineaFixed = linea;
            if (lineaFixed.Contains('"'))
                lineaFixed = cadena.fixCadena(linea);

            string[] lineaDiv = lineaFixed.Split(separatorColumns, StringSplitOptions.RemoveEmptyEntries);
            return lineaDiv;
        }

        private IEnumerable<T> ObtenerRenglones<T>(IEnumerable<string> lineas) where T : class, new()
        {
            int filaActual = 0;
            List<T> elementos = new List<T>();

            if (encabezado)
                lineas = lineas.Skip(1);

            foreach (string linea in lineas)
            {
                string[]lineaDiv = DividirLinea(linea);

                filaActual++;

                if (lineaDiv == null)
                    continue;

                if (ValidaLinea(lineaDiv, out string msg))
                {
                    try
                    {
                        elementos.Add(LeerRenglon<T>(lineaDiv, filaActual));
                    }
                    catch(Exception ex)
                    {
                        ListaErrores.Add($"Línea {filaActual}: {ex.Message}");
                    }
                }
                else
                    ListaErrores.Add($"Línea {filaActual}: {msg}");

            }
            return elementos;
        }
    }
}