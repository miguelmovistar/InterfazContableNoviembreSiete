using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IC2.Models
{
    public class ConsultarBase
    {

        static internal IEnumerable<T> GetAll<T>(int pagSize, int pagCurrent) where T:class {
            using (ICPruebaEntities db = new ICPruebaEntities())
            {
                return db.Set<T>().ToList().Skip(pagCurrent-1).Take(pagSize);                
            }           
        }
    }
}