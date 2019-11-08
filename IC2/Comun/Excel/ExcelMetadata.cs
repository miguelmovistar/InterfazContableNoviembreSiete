using IC2.Models;
using System.Collections.Generic;

namespace IC2.Comun
{
    internal class ExcelMetadata{

        public List<ExcelTab> Tabs { get; } = new List<ExcelTab>();

        public void AgregarTab(string nombre, List<object> datos)
        {
            Tabs.Add(new ExcelTab { Nombre = nombre, Filas = datos });
        } 

        public void AgregarTab(string nombre, Metadata source)
        {
            Tabs.Add(new ExcelTab { Nombre = nombre, Source = source });
        }

        public void AgregarTabs(IReadOnlyDictionary<string,Metadata> entitiesMetadata)
        {
            foreach (var item in entitiesMetadata)
            {
                Tabs.Add(new ExcelTab { Nombre = item.Value.Name?? item.Key, Source = item.Value });
            }
            
        }

    }
}