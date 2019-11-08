using IC2.Comun;
using IC2.Helpers;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Reflection;

namespace IC2.Servicios
{
    internal class Excel
    {
        string[] letrasCol = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ", "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FX", "FY", "FZ", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "GK", "GL", "GM", "GN", "GO", "GP", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ", "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "HK", "HL", "HM", "HN", "HO", "HP", "HQ", "HR", "HS", "HT", "HU", "HV", "HW", "HX", "HY", "HZ", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "II", "IJ", "IK", "IL", "IM", "IN", "IO", "IP", "IQ", "IR", "IS", "IT", "IU", "IV", "IW", "IX", "IY", "IZ", "JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JI", "JJ", "JK", "JL", "JM", "JN", "JO", "JP", "JQ", "JR", "JS", "JT", "JU", "JV", "JW", "JX", "JY", "JZ", "KA", "KB", "KC", "KD", "KE", "KF", "KG", "KH", "KI", "KJ", "KK", "KL", "KM", "KN", "KO", "KP", "KQ", "KR", "KS", "KT", "KU", "KV", "KW", "KX", "KY", "KZ", "LA", "LB", "LC", "LD", "LE", "LF", "LG", "LH", "LI", "LJ", "LK", "LL", "LM", "LN", "LO", "LP", "LQ", "LR", "LS", "LT", "LU", "LV", "LW", "LX", "LY", "LZ", "MA", "MB", "MC", "MD", "ME", "MF", "MG", "MH", "MI", "MJ", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NB", "NC", "ND", "NE", "NF", "NG", "NH", "NI", "NJ", "NK", "NL", "NM", "NN", "NO", "NP", "NQ", "NR", "NS", "NT", "NU", "NV", "NW", "NX", "NY", "NZ", "OA", "OB", "OC", "OD", "OE", "OF", "OG", "OH", "OI", "OJ", "OK", "OL", "OM", "ON", "OO", "OP", "OQ", "OR", "OS", "OT", "OU", "OV", "OW", "OX", "OY", "OZ" };

        public byte[] GenerarArchivo(Dictionary<string, List<object>> listas)
        {
            byte[] bytesfile = new byte[0];
            try
            {
                using (ExcelPackage excelPackage = new ExcelPackage())
                {
                    foreach (KeyValuePair<string, List<object>> lista in listas)
                    {
                        ExcelWorksheet ws = excelPackage.Workbook.Worksheets.Add(lista.Key);
                        var row = 2;
                        foreach (var reg in lista.Value)
                        {   
                            // Obtencion de columnas
                            IList<PropertyInfo> columnas = new List<PropertyInfo>(reg.GetType().GetProperties());
                            var i = 0;
                            // Generacion de renglones
                            foreach (PropertyInfo col in columnas)
                            {
                                if (row == 2)
                                {   // Renglon unico de encabezados
                                    ExcelRange headerCell = ws.Cells[letrasCol[i] + (row - 1)];
                                    headerCell.Value = StringUtil.SplitCamelCase(col.Name);
                                    headerCell = ObtenerEstiloCeldaEncabezado(headerCell);
                                }
                                // Renglon de datos
                                ExcelRange dataCell = ws.Cells[letrasCol[i] + row];
                                dataCell = ObtenerCeldaDato(dataCell, col, reg);
                                i++;
                            }
                            row++;
                        }
                        ws.View.FreezePanes(2, 1);
                        ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    }
                    bytesfile = excelPackage.GetAsByteArray();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return bytesfile;
        }

        private ExcelRange ObtenerEstiloCeldaEncabezado(ExcelRange headerCell)
        {
            try
            {
                headerCell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                headerCell.Style.Font.Bold = true;
                headerCell.Style.Fill.BackgroundColor.SetColor(Color.Black);
                headerCell.Style.Font.Color.SetColor(Color.LightGray);
                headerCell.Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.White);
            }
            catch (Exception)
            {
                throw;
            }

            return headerCell;
        }

        private ExcelRange ObtenerCeldaDato(ExcelRange dataCell, PropertyInfo col, object reg)
        {
            var propType = col.PropertyType.FullName;
            var propValue = col.GetValue(reg, null);
            try
            {
                if (propValue != null)
                {
                    if (propType.Contains("DateTime"))
                    {
                        dataCell.Value = (DateTime)propValue;
                        dataCell.Style.Numberformat.Format = "dd-MM-yyyy";
                    }
                    else if (propType.Contains("Decimal"))
                    {
                        dataCell.Value = (decimal)propValue;
                        dataCell.Style.Numberformat.Format = "#,##0.000000_-";
                        if ((decimal)propValue < 0)
                        {
                            dataCell.Style.Font.Color.SetColor(Color.Red);
                        }
                    }
                    else if (propType.Contains("Int32") || propType.Contains("Int64"))
                    {
                        if (propType.Contains("Int32"))
                        {
                            dataCell.Value = (Int32)propValue;
                            if ((Int32)propValue < 0)
                                dataCell.Style.Font.Color.SetColor(Color.Red);
                        }
                        else if (propType.Contains("Int64"))
                        {
                            dataCell.Value = (Int64)propValue;
                            if ((Int64)propValue < 0)
                                dataCell.Style.Font.Color.SetColor(Color.Red);
                        }
                    }
                    else
                    {
                        dataCell.Value = propValue.ToString();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

            return dataCell;
        }

    }
}