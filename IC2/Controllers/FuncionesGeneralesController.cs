using System;
using System.Collections.Generic;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class FuncionesGeneralesController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        public ActionResult Index()
        {
            return View();
        }

        public string ValidaRelacion(string strNomTabla, int intId)
        {
            List<object> lstValidaData = new List<object>();
            string strSalto = "</br>";
            string strMsge = "";

            try
            {
                var ValData = db.sp_ValidaRelaciones(strNomTabla, intId);

                foreach (var elemento in ValData)
                {
                    if (elemento.NOREG > 0)
                    {
                        strMsge = strMsge + elemento.TABLA + " Contiene " + elemento.NOREG + " Registro(s) Activo(s) " + strSalto;
                    }
                  }                  
            }
            catch (Exception ex)
            {
                List<object> lstValiData = new List<object>();
                strMsge = ex.Message;
            }
            return strMsge;
        }


        public DateTime ConvierteFecha(string strFecha, char chrSepara, string strFormat)
        {
            string strDia = "";
            string strMes = "";
            string strAnio = "";
            DateTime dtData = DateTime.Parse("2000-01-01");

            string[] arrStrFeha = strFecha.Split(chrSepara);

            if (arrStrFeha != null)
            {
                if (strFormat == "DMY")
                {
                    strDia = arrStrFeha[0];
                    strMes = arrStrFeha[1];
                    strAnio = arrStrFeha[2];
                }
                else if (strFormat == "YMD")
                {
                    strDia = arrStrFeha[2];
                    strMes = arrStrFeha[1];
                    strAnio = arrStrFeha[0];
                }
                else if (strFormat == "MYD")
                {
                    strDia = arrStrFeha[0];
                    strMes = arrStrFeha[2];
                    strAnio = arrStrFeha[1];
                }

                if (strMes.Length <= 2)
                {
                    bool blesNumero = int.TryParse(strMes, out int n);

                    if (blesNumero == true)
                    {
                        if (strMes.Length == 1)
                        {
                            strMes = '0' + strMes;
                        }
                    }
                }
                else
                {
                    switch (strMes.ToUpper())
                    {
                        case "ENE":
                        case "ENERO":
                        case "JAN":
                        case "JANUARY":
                            strMes = "01";
                            break;

                        case "FEB":
                        case "FEBRERO":
                        case "FEBRUARY":
                            strMes = "02";
                            break;

                        case "MAR":
                        case "MARZO":
                        case "MARCH":
                            strMes = "03";
                            break;

                        case "ABR":
                        case "ABRIL":
                        case "APR":
                        case "APRIL":
                            strMes = "04";
                            break;

                        case "MAY":
                        case "MAYO":
                            strMes = "05";
                            break;

                        case "JUN":
                        case "JUNIO":
                        case "JUNE":
                            strMes = "06";
                            break;

                        case "JUL":
                        case "JULIO":
                        case "JULY":
                            strMes = "07";
                            break;

                        case "AGO":
                        case "AGOSTO":
                        case "AUG":
                        case "AUGUST":
                            strMes = "08";
                            break;

                        case "SEP":
                        case "SEPTIEMBRE":
                        case "SEPTEMBER":
                            strMes = "09";
                            break;

                        case "OCT":
                        case "OCTUBRE":
                        case "OCTOBER":
                            strMes = "10";
                            break;

                        case "NOV":
                        case "NOVIEMBRE":
                        case "NOVEMBER":
                            strMes = "11";
                            break;

                        case "DIC":
                        case "DICIEMBRE":
                        case "DEC":
                        case "DECEMBER":
                            strMes = "12";
                            break;
                        default:
                            strMes = "01";
                            strAnio = "01";
                            break;
                    }
                }

                if (strAnio.Length == 2)
                {
                    strAnio = "20" + strAnio;
                }
                strFecha = strAnio + "-" + strMes + "-" + strDia;
                dtData = DateTime.Parse(strFecha);
            }

            return dtData;
        }

    }
}