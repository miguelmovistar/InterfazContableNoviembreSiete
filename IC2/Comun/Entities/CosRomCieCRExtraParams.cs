namespace IC2.Comun
{

    public class CosRomCieCRExtraParams : PeriodoParam, ICostos, IParams
    {
        public bool EsCostoRecurrente { get; set; }
        public bool EsMxn { get; set; }
    }

}