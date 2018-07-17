using Dissidia.League.Domain.Entities.Interfaces;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Repositories.Interfaces
{
    public interface IBaseRepository<T> where T : IEntity
    {        
        void Upsert(T entity);
        List<T> GetAll();
        void Delete(T entity);
        void Delete(string id);
        T GetById(string id);
    }
}
