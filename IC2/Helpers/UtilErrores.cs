using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ICF2.Utilerias
{
    public class UtilErrores
    {

        public static int OK { get { return 0; } }


        /// <summary>
        /// Error en las credenciales ingresadas
        /// </summary>
        public static int ErrorCredenciales { get { return 3; } }

        /// <summary>
        /// Codigo que hace referencia a que el usuario no tiene registro en el sistema
        /// </summary>
        public static int UsuarioNoRegistrado { get { return 4; } }

    }
}
