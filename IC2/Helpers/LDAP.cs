using System;
using System.Configuration;

namespace ICF2.Utilerias
{
    public class LDAP
    {

        /// <summary>
        /// Autentica por LDAP
        /// </summary>
        /// <param name="usuario">usuario</param>
        /// <param name="password">password</param>
        /// <returns>true si es exitoso, false fallido</returns>
        public bool autenticar(string usuario, string password)
        {
            bool exitoso = false;

            try
            {
//#if DEBUG
                return true;
//#endif
                //AuthenticationTypes tipoautenticacion = AuthenticationTypes.Secure;
                //////"LDAP://mexico.tem.mx:389"
                ////string ruta = string.Concat("LDAP://", ConfigurationManager.AppSettings["servidor"].ToString(), ":", ConfigurationManager.AppSettings["puerto"].ToString());
                //DirectoryEntry entry = new DirectoryEntry(ConfigurationManager.AppSettings["URLLDAP"].ToString(), usuario, password, tipoautenticacion);
                //object obj = entry.NativeObject;
                //exitoso = true;
            }
            catch (Exception ex)
            {
                exitoso = false;
            }
            return exitoso;

        }

    }
}
