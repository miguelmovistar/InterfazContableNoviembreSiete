using IC2.Negocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IC2.Comun
{
    public class Exportar
    {
        public delegate Task<IList<object>> ConsultaAsync(object filtro, Config config, IParams extraParam);

        public async Task<object> ExportarExcel(IParams parametros, string consulta, ConsultaAsync consultaFunc)
        {
            string filePath = string.Empty;
            string nombreArchivo = string.Empty;
            byte[] bytesfile = new byte[1];

            try
            {
                if (ConsultarPosible(parametros, consulta))
                {
                    
                    ExcelDef excelDef = new ExcelDef(consulta);
                    
                    ExcelFile excelFile = new ExcelFile(consulta, (parametros as IPeriodo)?.Periodo.ToString("ddMMyyyy"));
                    
                    Config config = new Config { ConSuma = true };
                    foreach (ExcelTab tab in excelDef.Metadato.Tabs)
                    {

                        var obj = Activator.CreateInstance(tab.Source.EntityType);
                        IParams parametrosExtra = Activator.CreateInstance(tab.Source.ExtraParamType) as IParams;
                        (parametrosExtra as IPeriodo).Periodo = (parametros as IPeriodo).Periodo;

                        config.ElementType = tab.Nombre;
                        var fila = await consultaFunc(obj, config, parametrosExtra);
                        tab.Filas = fila.ToList();
                    }

                    excelFile.GenerarArchivo(excelDef.Metadato, out filePath);
                    bytesfile = System.IO.File.ReadAllBytes(filePath);
                    nombreArchivo = excelFile.nombreArchivo;
                }
            }
            catch (Exception)
            {

            }

            return new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
        }

        virtual protected bool ConsultarPosible(IParams parametros, string consulta) {
            return true;
        }
    }
}