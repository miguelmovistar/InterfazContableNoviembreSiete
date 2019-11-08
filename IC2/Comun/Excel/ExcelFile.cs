using OfficeOpenXml;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;

namespace IC2.Comun
{
    internal class ExcelFile
    {
        FileInfo fileInfo;
        public string nombreArchivo;
        bool esTemplate = false;

        virtual public string SubRuta { get; set; } = "Plantillas\\";
        virtual public string RutaFisicaSalida { get; set; } = "C:\\RepositoriosDocs\\";

        static public string ServerPath { get; set; }

        private void Template(string archivoNombrePrefijo, string rutaFisica, string fecha)
        {

            nombreArchivo = GetNameFile(archivoNombrePrefijo, rutaFisica, fecha);
            string templatePath = GetTemplatePath(archivoNombrePrefijo, rutaFisica, fecha);
            string filePath = GetOutputPath(archivoNombrePrefijo, rutaFisica, fecha);

            if (File.Exists(filePath))
            {
                fileInfo = new FileInfo(filePath);
            }
            else
            {
                esTemplate = true;
                fileInfo = new FileInfo(templatePath);
            }
        }

        public bool GenerarArchivo(ExcelMetadata excelMetadata, out string filePath)
        {
            try
            {
                if (File.Exists(fileInfo.FullName))
                    File.Delete(fileInfo.FullName);

                using (ExcelPackage excelPackage = new ExcelPackage(fileInfo))
                {
                    foreach (ExcelTab tab in excelMetadata.Tabs)
                    {
                        ExcelWorksheet ws = excelPackage.Workbook.Worksheets.Add(tab.Nombre);

                        if (tab.Filas != null && tab.Filas.Count > 0)
                        {
                            var properties = tab.Filas[0].GetType().GetProperties();

                            foreach (PropertyInfo property in properties)
                            {
                                ExcelColumnDescAttribute columnMeta = (ExcelColumnDescAttribute)property.GetCustomAttributes(typeof(ExcelColumnDescAttribute), true).FirstOrDefault();
                                if (columnMeta != null)
                                {
                                    var columnLetter = columnMeta.Column;
                                    var headerCell = ws.Cells[columnLetter + 1];
                                    int rowData = 2;
                                    bool ultimoRow = false;
                                    ExcelRange dataCell = null;

                                    headerCell.Value = columnMeta.Header ?? property.Name.SplitCamelCase();
                                    foreach (var row in tab.Filas)
                                    {
                                        dataCell = ws.Cells[columnLetter + rowData];
                                        if ((rowData - 1) == tab.Filas.Count)
                                        {
                                            ultimoRow = true;
                                            dataCell.Value = "";
                                            rowData++;
                                        }

                                        dataCell = ws.Cells[columnLetter + rowData];
                                        dataCell.Value = property.GetValue(row);

                                        if (ultimoRow && columnLetter == "A")
                                            dataCell.Value = "Totales";

                                        if (columnMeta.Type == TypeDataExcel.Decimal)
                                        {
                                            if (property.GetValue(row) != null)
                                                if ((decimal)property.GetValue(row) < 0)
                                                {
                                                    dataCell.Style.Font.Color.SetColor(Color.Red);
                                                }
                                            dataCell.Style.Numberformat.Format = "#,##0.00_-";
                                        }
                                        rowData++;
                                    }
                                }
                            }

                        }
                    }
                    if (!esTemplate)
                        excelPackage.Save();
                    else
                    {
                        FileInfo newFile = new FileInfo(fileInfo.FullName);
                        excelPackage.SaveAs(newFile);
                    }
                }

                filePath = fileInfo.FullName;
            }
            catch
            {
                filePath = fileInfo.FullName;
                return false;
            }

            return true;

        }

        public ExcelFile(string archivoNombrePrefijo, string fecha)
        {
            Template(archivoNombrePrefijo, ServerPath, fecha);
        }

        protected virtual string GetTemplatePath(string archivoNombrePrefijo, string rutaFisica, string fecha)
        {
            nombreArchivo = GetNameFile(archivoNombrePrefijo, rutaFisica, fecha);
            return $"{rutaFisica}\\{SubRuta}{nombreArchivo}";
        }

        protected virtual string GetNameFile(string archivoNombrePrefijo, string rutaFisica, string fecha)
        {
            return $"{archivoNombrePrefijo} {fecha}.xlsx";
        }

        protected virtual string GetOutputPath(string archivoNombrePrefijo, string rutaFisica, string fecha)
        {
            nombreArchivo = GetNameFile(archivoNombrePrefijo, rutaFisica, fecha);
            return $"{RutaFisicaSalida}{archivoNombrePrefijo}\\{nombreArchivo}";
        }

    }
}