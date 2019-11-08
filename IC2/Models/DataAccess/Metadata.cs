using System;
using System.Data;
using IC2.Comun;

namespace IC2.Models
{
    public class Metadata {
        public string Name { get; set; }
        public Type EntityType { get; set; }
        public string InsertSentence { get; set; }
        public string SelectSentence { get; set; }
        public string DbType { get; set; }
        public DataTable TableCustom { get; set; }
        public Type ExtraParamType { get; set; }
    }
}