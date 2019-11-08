using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ICF2.Utilerias;
using IC2.Models;


namespace IC2.Helpers
{
    public class Autenticacion
    {
        ICPruebaEntities db = new ICPruebaEntities();


        public int autenticar(string usuario, string password, string ip, out int idLinea, out string controlador, out string pagina, out int idPerfil)
        {
            int resultado = UtilErrores.OK;
            idLinea = -1;
            controlador = string.Empty;
            pagina = string.Empty;
            idPerfil = -1;
            LDAP ldap = new LDAP();
            try
            {
                if (ldap.autenticar(usuario, password))
                {

                    var consulta = (from usu in db.usuarios
                                    join men in db.MenuIC on usu.PaginaInicio equals men.Id
                                    join cat in db.cat_TipoLinea on usu.IdLineaNegocio equals cat.Id
                                    where usu.IdUsuario.ToUpper() == usuario.ToUpper()
                                    select new
                                    {
                                        cat.idLinea,
                                        usu.IdPerfil,
                                        men.Controlador,
                                        men.pagina
                                    }).SingleOrDefault();

                    if (consulta != null)
                    {
                        idLinea = consulta.idLinea;
                        controlador = consulta.Controlador;
                        pagina = consulta.pagina;
                        idPerfil = consulta.IdPerfil;
                        historialAccesos nuevo = new historialAccesos();
                        nuevo.IdUsuario = usuario;
                        nuevo.IdPerfil = consulta.IdPerfil;
                        nuevo.IP_Login = ip;
                        nuevo.Fecha = DateTime.Now;
                        db.historialAccesos.Add(nuevo);
                        db.SaveChanges();

                        resultado = UtilErrores.OK;

                    }
                    else
                    {
                        resultado = UtilErrores.UsuarioNoRegistrado;
                    }

                }
                else
                {
                    resultado = UtilErrores.ErrorCredenciales;
                }


            }
            catch (Exception ex)
            {
                throw ex;
            }
            return resultado;

        }


        public int permisos(string usuario)
        {
            int resultado = UtilErrores.OK;

            int idLinea = -1;
            CPermisos oPermisos = new CPermisos();
            List<CPermisos> menuPadre = new List<CPermisos>();
            List<CPermisos> menuHijo = new List<CPermisos>();


            idLinea = obtieneLineaNegocio(usuario);

            var permisos = from usu in db.usuarios
                           join per in db.Perfil on usu.IdPerfil equals per.Id
                           join perm in db.permisos on usu.IdPerfil equals perm.ID_Perfil
                           join men in db.MenuIC on perm.IDMenu equals men.Id
                           where usu.IdUsuario == usuario && usu.Activo == true && per.Activo == true && men.Activo == true
                           select new
                           {
                               men.Id,
                               men.IdPadre,
                               men.Etiqueta,
                               men.Controlador,
                               men.pagina,
                               perm.IDMenu,
                               perm.CanRead,
                               perm.CanNew,
                               perm.CanEdit,
                               perm.CanDelete,
                               perm.WriteLog
                           };

            foreach (var item in permisos)
            {
                CPermisos aux = new CPermisos();
                aux.IdPermiso = item.Id;
                aux.IdPadre = item.IdPadre;
                aux.Etiqueta = item.Etiqueta;
                aux.Controlador = item.Controlador;
                aux.Pagina = item.pagina;
                aux.IdMenu = item.IDMenu;
                aux.CanRead = item.CanRead;
                aux.CanNew = item.CanNew;
                aux.CanEdit = item.CanEdit;
                aux.CanDelete = item.CanDelete;
                aux.WritLog = item.WriteLog;
                if (item.IdPadre == null)
                    menuPadre.Add(aux);
                else
                    menuHijo.Add(aux);


            }



            return resultado;

        }

        public int obtieneLineaNegocio(string usuario)
        {
            try
            {
                var oLinea = from usu in db.usuarios
                             join cat in db.cat_TipoLinea on usu.IdLineaNegocio equals cat.Id
                             where usu.IdUsuario == usuario
                             select new
                             {
                                 cat.idLinea
                             };

                return oLinea.First().idLinea;

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }
    }
}