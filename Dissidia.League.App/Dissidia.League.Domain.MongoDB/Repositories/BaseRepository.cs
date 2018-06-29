using Dissidia.League.Domain.Entities.Interfaces;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.MongoDB.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T>
        where T : IEntity
    {

        protected string _entityName;           
        protected IMongoCollection<T> _collection;

        public BaseRepository(EntityEnum collection, IMongoDatabase db)
        {
            _entityName = collection;
            _collection = db.GetCollection<T>(collection);
        }

        public void Delete(T entity)
        {
            _collection.DeleteMany(p => p.Id == entity.Id);            
        }

        public List<T> GetAll()
        {
            var query = _collection.FindAsync(new BsonDocument());
            query.Wait();
            var result = query.Result;
            return result.ToList();
        }

        public T GetById(string id)
        {
            var query = _collection.FindAsync(p => p.Id == id);
            query.Wait();
            return query.Result.FirstOrDefault();            
        }

        public void Upsert(T entity)
        {
            var result = _collection.Find(p => p.Id== entity.Id);
            if(result.Count() > 0)
            {
                _collection.ReplaceOne(p => p.Id == entity.Id, entity);
            }
            else
            {
                _collection.InsertOne(entity);
            }
            
        }
    }
}
