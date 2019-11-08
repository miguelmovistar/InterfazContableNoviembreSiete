using System;

namespace IC2.Funciones
{
    public class Cadenas
    {
       public string fixCadena(string cadena)
        {
            string nuevaLinea,  reemplazar = "";
            try
            {

                var inicio = cadena.IndexOf('"') + 1;
                var fin = cadena.LastIndexOf('"');
                var subcadena = cadena.Substring(inicio, (fin - inicio)).Replace(",", "");
                reemplazar = cadena.Substring(inicio-1, fin - (inicio-2));
                nuevaLinea=cadena.Replace(reemplazar, subcadena);
               
            }
            catch (Exception )
            {
                nuevaLinea = "Error";   
            }
            return nuevaLinea;
        }

    }
}