using IC2.Comun;
using IC2.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IC2.Models.DataAccess
{
    public class RoamingCancelacionCostoRepository: Repository
    {
        public override async Task<IList<object>> ConsultarAsync(Config config, object parametro, IParams extraParam)
        {
            switch (config.ElementType)
            {
                case "RoamingCancelacionCosto":
                    return ObtenerElementosRoamingCancelacionCosto();
                case "TabDos":
                    return ObtenerElementosTabDos();
                default:
                    return null;
            }
        }

        private IList<object> ObtenerElementosRoamingCancelacionCosto()
        {
            IList<object> elementos = new List<object>();

            try
            {
                using (ICPruebaEntities db = new ICPruebaEntities())
                {
                    var JoinQuery =
                        from C in db.RoamingCancelacionCosto
                        join D in db.RoamingDocumentoCosto on C.FolioDocumento equals D.FolioDocumento
                        orderby C.FolioDocumento ascending
                        select new
                        {
                            C.BanderaConcepto,
                            C.NumeroProvision,
                            C.CuentaContable,
                            C.Indat,
                            C.Concepto,
                            C.Grupo,
                            C.Acreedor,
                            C.MontoProvision,
                            C.Moneda,
                            C.Periodo,
                            C.Tipo,
                            C.NumeroDocumentoSap,
                            C.FolioDocumento,
                            C.TipoCambioProvision,
                            C.ImporteMxn,
                            C.ImporteFactura,
                            C.DiferenciaProvisionFactura,
                            C.TipoCambioFactura,
                            C.ExcesoProvisionMxn,
                            C.InsuficienciaProvisionMxn,
                            D.FechaConsumo,
                            D.TipoCambio,
                            D.MontoFacturado
                        };

                    string MontoFacturado = "", FechaConsumo = "", TipoCambio = "";


                    foreach (var elemento in JoinQuery)
                    {
                        if (elemento.ImporteFactura == "")
                        {
                            MontoFacturado = elemento.MontoFacturado;
                            FechaConsumo = elemento.FechaConsumo;
                            TipoCambio = elemento.TipoCambio;
                        }

                        elementos.Add(new RoamingCancelacionCostoView
                        {
                            BanderaConcepto = elemento.BanderaConcepto,
                            NumeroProvision = elemento.NumeroProvision,
                            CuentaContable = elemento.CuentaContable,
                            Indat = elemento.Indat,
                            Concepto = elemento.Concepto,
                            Grupo = elemento.Grupo,
                            Acreedor = elemento.Acreedor,
                            MontoProvision = elemento.MontoProvision,
                            Moneda = elemento.Moneda,
                            Periodo = elemento.Periodo,
                            Tipo = elemento.Tipo,
                            NumeroDocumentoSap = elemento.NumeroDocumentoSap,
                            FolioDocumento = elemento.FolioDocumento,
                            TipoCambioProvision = elemento.TipoCambioProvision,
                            ImporteMxn = elemento.ImporteMxn,
                            ImporteFactura = elemento.ImporteFactura,
                            DiferenciaProvisionFactura = elemento.DiferenciaProvisionFactura,
                            TipoCambioFactura = elemento.TipoCambioFactura,
                            ExcesoProvisionMxn = elemento.ExcesoProvisionMxn,
                            InsuficienciaProvisionMxn = elemento.InsuficienciaProvisionMxn,
                            FechaConsumo = elemento.FechaConsumo,
                            TipoCambio = elemento.TipoCambio,
                            MontoFacturado = elemento.MontoFacturado
                        });
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

            return elementos;

        }

        private IList<object> ObtenerElementosTabDos()
        {
            IList<object> elementos = null;

            try
            {
                using (ICPruebaEntities db = new ICPruebaEntities())
                {
                    var JoinQuery =
                        from C in db.RoamingCancelacionCosto
                        join D in db.RoamingDocumentoCosto on C.FolioDocumento equals D.FolioDocumento
                        orderby C.FolioDocumento ascending
                        select new
                        {
                            C.BanderaConcepto,
                            C.NumeroProvision,
                            C.CuentaContable,
                            C.Indat,
                            C.Concepto,
                            C.Grupo,
                            C.Acreedor,
                            C.MontoProvision,
                            C.Moneda,
                            C.Periodo,
                            C.Tipo,
                            C.NumeroDocumentoSap,
                            C.FolioDocumento,
                            C.TipoCambioProvision,
                            C.ImporteMxn,
                            C.ImporteFactura,
                            C.DiferenciaProvisionFactura,
                            C.TipoCambioFactura,
                            C.ExcesoProvisionMxn,
                            C.InsuficienciaProvisionMxn,
                            D.FechaConsumo,
                            D.TipoCambio,
                            D.MontoFacturado
                        };

                    string MontoFacturado = "", FechaConsumo = "", TipoCambio = "";

                    foreach (var elemento in JoinQuery)
                    {
                        if (elemento.ImporteFactura == "")
                        {
                            MontoFacturado = elemento.MontoFacturado;
                            FechaConsumo = elemento.FechaConsumo;
                            TipoCambio = elemento.TipoCambio;
                        }

                        elementos.Add(new
                        {
                            elemento.BanderaConcepto,
                            elemento.NumeroProvision,
                            elemento.CuentaContable,
                            elemento.Indat,
                            elemento.Concepto,
                            elemento.Grupo,
                            elemento.Acreedor,
                            elemento.MontoProvision,
                            elemento.Moneda,
                            elemento.Periodo,
                            elemento.Tipo,
                            elemento.NumeroDocumentoSap,
                            elemento.FolioDocumento,
                            elemento.TipoCambioProvision,
                            elemento.ImporteMxn,
                            elemento.ImporteFactura,
                            elemento.DiferenciaProvisionFactura,
                            elemento.TipoCambioFactura,
                            elemento.ExcesoProvisionMxn,
                            elemento.InsuficienciaProvisionMxn,
                            FechaConsumo,
                            TipoCambio,
                            MontoFacturado
                        });
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

            return elementos;

        }

    }
}