using System;

namespace IC2.Comun
{
    public class ExportarGridRoaming : Exportar
    {
        protected override bool ConsultarPosible(IParams parametros, string consulta)
        {
            IPeriodo periodoObj = (parametros as IPeriodo);
            return periodoObj != null && periodoObj.Periodo != default(DateTime);
        }
    }
}