using System;
using System.Data.Entity;

namespace IC2.Helpers
{
    public static class DbFiltro
    {

        [DbFunction("ICPruebaModel.Store", "fn_AplicarFiltroEf_String_Bit")]
        public static bool String(string cValor, string fValor)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }

        [DbFunction("ICPruebaModel.Store", "fn_AplicarFiltroEf_Int_Bit")]
        public static bool Int(int? cValor, string fValor)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }

        [DbFunction("ICPruebaModel.Store", "fn_AplicarFiltroEf_Numeric_Bit")]
        public static bool Numeric(decimal? cValor, string fValor)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }

        [DbFunction("ICPruebaModel.Store", "fn_AplicarFiltroEf_Decimal_Bit")]
        public static bool Decimal(decimal? cValor, string fValor)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }

        [DbFunction("ICPruebaModel.Store", "fn_AplicarFiltroEf_Date_Bit")]
        public static bool Date(DateTime? cValor, string fValor, string formato)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }

    }
}