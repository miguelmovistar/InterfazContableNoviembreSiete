using System;
using System.Data.Entity;

namespace IC2.Models
{
    public class UnitOfWork:IDisposable{
        readonly ICPruebaEntities _db = new ICPruebaEntities();
        DbContextTransaction transation;

        public ICPruebaEntities DB => _db;

        public static UnitOfWork Create() {
            var uow = new UnitOfWork();
            return uow;
        }

        protected UnitOfWork() {
            _db.Configuration.AutoDetectChangesEnabled = false;
            transation = _db.Database.BeginTransaction();
        }

        public void Commit() {
            transation.Commit();
            transation.Dispose();
            transation = null;
        }

        public void Dispose()
        {
            if (transation != null)
                transation.Rollback();
            if (_db != null)
                _db.Dispose();
        }
    }
}