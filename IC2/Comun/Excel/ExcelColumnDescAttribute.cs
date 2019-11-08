using System;

namespace IC2
{

    enum TypeDataExcel {
        Texto=1,
        Entero,
        Decimal,
        Fecha,
    }
    internal class ExcelColumnDescAttribute : Attribute
    {
        public string Column { get; set; }

        public string Header { get; set; }

        public TypeDataExcel Type { get; set; }

        public ExcelColumnDescAttribute(string column, TypeDataExcel type=TypeDataExcel.Texto, string header=null)
        {
            Column = column;
            Header = header;
            Type = type;
        }
    }
}