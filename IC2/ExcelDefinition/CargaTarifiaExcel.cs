using IC2.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace IC2.Comun.Excel
{
    internal class CargaTarifiaExcel : ExcelReader {

        readonly int posIni = 1;
        readonly bool esRecalculo = false;
        readonly IEnumerable<Operador> operadores;

        public CargaTarifiaExcel(bool esRecalculo, bool encabezado):base(encabezado)
        {
            this.esRecalculo = esRecalculo;
            operadores = GetOperadores();
        }

        IEnumerable<Operador> GetOperadores() {

            Repository repository = new Repository();
            var task =  Task.Run(async()=> await repository.GetFilterAsync<Operador>(a => a.Activo == 1 && a.Id_LineaNegocio == 1));
            task.Wait();            
            return task.Result;
        }

        protected override bool ValidaLinea(string[] arreglo, out string msg)
        {
            bool esOk = arreglo != null && arreglo.Length > 0 && arreglo.FirstOrDefault(a => a == null || a == "") == null;
            msg =  esOk? "": "Número de campos insuficiente.";
            return esOk;
        }

        protected override T LeerRenglon<T>(string[] arreglo, int filaActual)
        {
            int? operadorId = operadores.FirstOrDefault(a => arreglo.Count() > 0 && arreglo[posIni + 1] == a.Id_Operador)?.Id;
            if (operadorId == null) {
                ListaErrores.Add($"Línea {filaActual}: Operador {arreglo[posIni + 1]} no encontrado");
            }

            TarifaRoaming obj = new TarifaRoaming
            {
                Sentido = arreglo[posIni] == "IB" ? "INGRESO" : "COSTO",
                Direccion = arreglo[posIni],
                Code = operadorId,
                Id_Operador = operadorId,
                FechaInicio = DateTime.ParseExact(arreglo[posIni + 3], "dd/MM/yyyy", CultureInfo.InvariantCulture),
                FechaFin = DateTime.ParseExact(arreglo[posIni + 4], "dd/MM/yyyy", CultureInfo.InvariantCulture),
                ToData = (arreglo[posIni + 5] != "Gross") ? ConvertToDecimal(arreglo[posIni + 5]) : -1,
                ToSMSMo = (arreglo[posIni + 6] != "Gross") ? ConvertToDecimal(arreglo[posIni + 6]) : -1,
                ToVoiceMo = (arreglo[posIni + 7] != "Gross") ? ConvertToDecimal(arreglo[posIni + 7]) : -1,
                ToVoiceMt = (arreglo[posIni + 8] != "Gross") ? ConvertToDecimal(arreglo[posIni + 8]) : -1,
                iva = ConvertToDecimal(arreglo[posIni + 9]),
                Tipo = esRecalculo?"RECALCULO":"ORIGEN",
                Id_LineaNegocio = 1,
                Activo = 1
            };

            obj.TfData = (obj.ToData != -1) ? obj.ToData - (obj.ToData * obj.iva) : -1;
            obj.TfVoiceMo = (obj.ToVoiceMo != -1) ? obj.ToVoiceMo - (obj.ToVoiceMo * obj.iva) : -1;
            obj.TfVoiceMt = (obj.ToVoiceMt != -1) ? obj.ToVoiceMt - (obj.ToVoiceMt * obj.iva) : -1;
            obj.TfSMSMo = (obj.ToSMSMo != -1) ? obj.ToSMSMo - (obj.ToSMSMo * obj.iva) : -1;

            return obj as T;
        }

        protected override void OperacionPostLectura<T>(IList<T> lista)
        {
            //var plmns = lista.GroupBy(a => (a as TarifaRoaming).Code, b => (b as TarifaRoaming).Code);

            //Repository repository = new Repository();

            //var operadores = repository.GetAll<Operador>(0, 0);

            //var listaTarifa = lista.Cast<TarifaRoaming>();
            //var grupos = repository.GetAll<Grupo>(0, 0);
            //foreach (var item in lista.Cast<TarifaRoaming>())
            //{
            //    item.Id_Operador = operadores.FirstOrDefault(a=> a.Activo == 1 && a.Id_LineaNegocio == 1).Id;
            ////   // item.g = grupos.FirstOrDefault(a => a.Activo == 1 && a.Id_LineaNegocio == 1).Id;
            //}
        }

    }
}