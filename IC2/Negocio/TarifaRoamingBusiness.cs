using IC2.Comun.Excel;
using IC2.Models;
using IC2.Models.DataAccess;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace IC2.Negocio
{
    internal class TarifaRoamingBusiness
    {
        public IEnumerable<string> ListaErrores { get; protected set; }
        public int TotalProcesados { get; protected set; }

        public void CargarElementos(Stream stream, bool esRecalculo) {

            ExcelReader reader = new CargaTarifiaExcel(esRecalculo, true);

            var elementos = reader.LeerElements<TarifaRoaming>(stream);

            ListaErrores = reader.ListaErrores.Cast<string>();
            
            InsertaLotes(elementos);

            TotalProcesados = elementos.Count();
        }

        public IList<object> ObtenerOpciones() {
            TarifaRoamingRepository repos = new TarifaRoamingRepository();
            return repos.ObtenerOpciones();
        }

        private void InsertaLotes(IEnumerable<TarifaRoaming> lista)
        {
            try
            {
                TarifaRoamingRepository repos = new TarifaRoamingRepository();
                repos.GuardarElementos(lista);
            }
            catch (Exception e)
            {
                var er = e.ToString();
            }

        }


    }
}