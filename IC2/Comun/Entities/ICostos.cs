namespace IC2.Comun
{
    public interface ICostos : IPeriodo, IConvertirMxn
    {
        bool EsCostoRecurrente { get; set; }
    }

}