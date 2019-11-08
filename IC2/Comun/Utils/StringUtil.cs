using System;

namespace IC2.Comun
{
    public static class StringUtil
    {

        public static string SplitCamelCase(this string input)
        {
            var result = string.Empty;
            if (input != null)
                try
                {
                    result = System.Text.RegularExpressions.Regex.Replace(input, "([A-Z])", " $1", System.Text.RegularExpressions.RegexOptions.Compiled).Trim();
                }
                catch (Exception)
                {
                    throw;
                }
            return result;
        }

    }
}