using IC2.Models.ViewModel;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace IC2.Models.DataAccess
{
    internal class TarifaRoamingRepository : Repository
    {

        public TarifaRoamingRepository()
        {
        }

        public IList<object> Elementos { get; internal set; }

        protected override IReadOnlyDictionary<string, Metadata> Entidades => 
            DTOMetadata.PxQIngresosRomRecalculoMetadato;

        public void GuardarElementos<T>(IEnumerable<T> lista) where T:class {
            using (ICPruebaEntities db = new ICPruebaEntities())
            {
                using (DbContextTransaction trans = db.Database.BeginTransaction())
                {
                    db.Configuration.AutoDetectChangesEnabled = false;

                    foreach (var el in lista)
                    {
                        db.Set<T>().Add(el);
                    }

                    db.SaveChanges();
                    trans.Commit();
                }
            }
        }


        public IList<object> ObtenerOpciones() {


            try
            {
                using (ICPruebaEntities db = new ICPruebaEntities())
                {

                    List<object> lista = new List<object>();
                    var submenu = from elementos in db.Submenu
                                  join acceso in db.Acceso
                                  on elementos.Id equals acceso.Id_Submenu
                                  where acceso.Id_LineaNegocio == 1
                                  && elementos.Activo == 1
                                  && elementos.Id_Menu == 1
                                  && elementos.carga == 1
                                  select new
                                  {
                                      elementos.Nombre,
                                      elementos.Id
                                  };
                    foreach (var elemento in submenu)
                    {
                        lista.Add(new
                        {
                            elemento.Id,
                            elemento.Nombre
                        });
                    }
                    return lista;
                }
            }
            catch
            {
                return null;
            }
        }
 
    }
}