using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using IC2.Models;

namespace IC2.Negocio
{
    /// <summary>
    /// Llenar periodos anteriores
    /// </summary>
    /// <remarks>
    /// Uso: using (var periodo = new PeriodosAnteriores()) periodo.CrearPeriodosAnteriores();
    /// </remarks>
    public class PeriodosAnteriores : IDisposable
    {
        #region Construicción

        readonly Lazy<ICPruebaEntities> db;

        ICPruebaEntities ICPrueba
        { get { return db.Value; } }

        public PeriodosAnteriores()
        {
            db = new Lazy<ICPruebaEntities>(true);
        }

        #endregion

        #region Métodos Públicas

        public bool CrearPeriodosAnteriores(ICPruebaEntities iCPrueba)
        {
            try
            {
                iCPrueba.usp_LimpiarCargas();

                foreach (var periodo in PeriodosFaltantesCosto())
                    iCPrueba.usp_PeriodosAnterioresCostoROM(periodo.Month, periodo.Year);

                foreach (var periodo in PeriodosFaltantesIngreso())
                    iCPrueba.usp_PeriodosAnterioresIngresoROM(periodo.Month, periodo.Year);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> CrearPeriodosAnterioresAsync()
        {
            try
            {
                ICPrueba.usp_LimpiarCargas();

                foreach (var periodo in PeriodosFaltantesCosto())
                    await Task.Factory.StartNew(() => ICPrueba.usp_PeriodosAnterioresCostoROM(periodo.Month, periodo.Year));

                foreach (var periodo in PeriodosFaltantesIngreso())
                    await Task.Factory.StartNew(() => ICPrueba.usp_PeriodosAnterioresIngresoROM(periodo.Month, periodo.Year));

                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion

        #region Métodos Privados

        List<DateTime> PeriodosFaltantesCosto()
        {
            var existentesCosto = (from p in ICPrueba.uvw_PeriodosAnterioresCostoROM
                                   select p.PeriodoCarga).Distinct().ToList();
            return (from n in ICPrueba.uvw_PeriodosAnterioresPeriodoCosto
                    where n.Periodo.HasValue && !existentesCosto.Contains(n.Periodo.Value)
                    select n.Periodo.Value).Distinct().ToList();
        }

        List<DateTime> PeriodosFaltantesIngreso()
        {
            var existentesIngreso = (from p in ICPrueba.uvw_PeriodosAnterioresIngresoROM
                                     select p.PeriodoCarga).Distinct().ToList();
            return (from n in ICPrueba.uvw_PeriodosAnterioresPeriodoIngreso
                    where n.Periodo.HasValue && !existentesIngreso.Contains(n.Periodo.Value)
                    select n.Periodo.Value).Distinct().ToList();
        }

        #endregion

        #region IDisposable

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    if (db.IsValueCreated)
                        ICPrueba.Dispose();
                }
                disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion
    }
}