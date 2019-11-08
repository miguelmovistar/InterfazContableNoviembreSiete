using IC2.Comun;
using IC2.Models.ViewModel;
using System.Collections.Generic;

namespace IC2.Models.DataAccess
{
    internal class PxQIngresosRomRecalculoRepository : Repository
    {
        protected override IReadOnlyDictionary<string, Metadata> Entidades => DTOMetadata.PxQIngresosRomRecalculoMetadato;

        protected override void GetExtraParams(Config typeId, Dictionary<string, object> extraParamsOut, object obj, IParams extraParam)
        {
            RecalculoParm parametros = extraParam as RecalculoParm;
            extraParamsOut.Add("Periodo", parametros.Periodo);
            extraParamsOut.Add("Tipo", parametros.Tipo);

        }

    }
}