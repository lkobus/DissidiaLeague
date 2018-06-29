using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.Tools.Enums
{
    public class BaseEnum<T, Y> : IBaseEnum<Y> where T : BaseEnum<T, Y>
    {
        public int Codigo { get; protected set; }
        public Y Valor { get; protected set; }

        protected BaseEnum(int codigo, Y valor)
        {
            Codigo = codigo;
            Valor = valor;
        }

        public static IList<T> ToList()
        {
            var result = new List<T>();
            var fields = typeof(T).GetFields(BindingFlags.Public | BindingFlags.Static);
            fields.ToList().ForEach(f => result.Add((T)f.GetValue(null)));
            return result;
        }

        public static implicit operator int(BaseEnum<T, Y> @enum) => @enum?.Codigo ?? 0;

        public static implicit operator Y(BaseEnum<T, Y> @enum) => @enum == null ? default(Y) : @enum.Valor;

        public static explicit operator BaseEnum<T, Y>(int codigo)
        {
            return ToList().FirstOrDefault(e => e.Codigo == codigo);
        }

        public static explicit operator BaseEnum<T, Y>(Y valor)
        {
            return ToList().FirstOrDefault(e => e.Valor.Equals(valor));
        }
    }
}
