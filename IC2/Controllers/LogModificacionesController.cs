using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using IC2.Helpers;
using IC2.Models;
using System.Data.Entity.Infrastructure;

namespace IC2.Controllers
{
    public class LogModificacionesController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();

        // GET: LogModificaciones
        public ActionResult Index()
        {
            Session["consulta"] = null;
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            ViewBag.Lista = oHome.obtenerSubMenu((int)Session["IdPerfil"]);
            ViewBag.ListaMenu = oHome.obtenerMenuPrincipal2((int)Session["IdPerfil"]);
            return View(ViewBag);


        }

        public JsonResult llenaGrid(int lineaNegocio, int start, int limit, string NombrePantalla, string ColumnaModificada, string Valor_Nuevo, string Valor_Anterior,
    string Fecha, string Direccion_IP, string Accion, string Usuario)
        {
            List<object> listaParametros = new List<object>();
            object respuesta = null;
            int total;
            Consultas aux = new Consultas();
            StringBuilder consulta = new StringBuilder();
            Dictionary<string, string> auxFechas = new Dictionary<string, string>();


            try
            {
                StringBuilder consultaAnterior = new StringBuilder();
                consultaAnterior = (StringBuilder)Session["consulta"];
                LogActualizaciones tmp = new LogActualizaciones();
                tmp.NombrePantalla = NombrePantalla;
                tmp.ColumnaModificada = ColumnaModificada;
                tmp.Valor_Nuevo = Valor_Nuevo;
                tmp.Valor_Anterior = Valor_Anterior;
                tmp.Direccion_IP = Direccion_IP;
                tmp.Accion = Accion;
                tmp.Usuario = Usuario;
                auxFechas.Add("Fecha", Fecha);
                string consultaInicial = string.Empty;
                consulta = aux.consultaFinal(tmp, "WHERE Activo=@p0", auxFechas, out consultaInicial);

                if (consultaAnterior == null) // primera consulta
                    Session["consulta"] = consulta;
                else if (start != 0 && consultaAnterior.Equals(consulta)) // cuando se le da al paginar 
                    consulta = consultaAnterior;
                else if (!consulta.Equals(consultaAnterior) && !consultaInicial.Equals(consulta.ToString()) && start == 0)
                    Session["consulta"] = consulta;
                else if (consulta.Length > consultaAnterior.Length)
                    Session["consulta"] = consulta;
                else if (!consulta.Equals(consultaAnterior) && !consulta.ToString().Equals(consultaInicial))
                    Session["consulta"] = consulta;
                else if (consulta.ToString().Equals(consultaInicial) && NombrePantalla != null)
                {
                    Session["consulta"] = consulta;
                }
                else
                {
                    consulta = consultaAnterior;
                    Session["consulta"] = consulta;
                }

                DbSqlQuery<LogActualizaciones> catParametros = db.LogActualizaciones.SqlQuery(consulta.ToString(), 1);

                string lDia = string.Empty;
                string lMes = string.Empty;
                string lHora = string.Empty;
                string lMinuto = string.Empty;
                string lSegundo = string.Empty;

                foreach (var elemento in catParametros)
                {
                    int dia = Convert.ToDateTime(elemento.Fecha).Day;
                    int mes = Convert.ToDateTime(elemento.Fecha).Month;
                    int hora = Convert.ToDateTime(elemento.Fecha).Hour;
                    int minuto = Convert.ToDateTime(elemento.Fecha).Minute;
                    int segundo = Convert.ToDateTime(elemento.Fecha).Second;

                    lDia = (dia >= 0 && dia < 9) ? ("0" + dia).ToString() : dia.ToString();
                    lMes = (mes >= 0 && mes < 9) ? ("0" + mes).ToString() : mes.ToString();
                    lHora = (hora >= 0 && hora < 9) ? ("0" + hora).ToString() : hora.ToString();
                    lMinuto = (minuto >= 0 && minuto < 9) ? ("0" + minuto).ToString() : minuto.ToString();
                    lSegundo = (segundo >= 0 && segundo < 9) ? ("0" + segundo).ToString() : segundo.ToString();

                    listaParametros.Add(new
                    {
                        Id = elemento.Id,
                        NombrePantalla = elemento.NombrePantalla,
                        ColumnaModificada = elemento.ColumnaModificada,
                        Valor_Nuevo = elemento.Valor_Nuevo,
                        Valor_Anterior = elemento.Valor_Anterior,
                        Fecha = lDia + "-" + lMes + "-" + Convert.ToDateTime(elemento.Fecha).Year + " " + lHora + ":" + lMinuto + ":" + lSegundo,
                        Direccion_IP = elemento.Direccion_IP,
                        Accion = elemento.Accion,
                        Usuario = elemento.Usuario,
                        Activo = elemento.Activo
                    });


                }
                total = listaParametros.Count();
                listaParametros = listaParametros.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = listaParametros, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message.ToString() };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }



    }
}