import { Db } from 'mongodb';

export const asigDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort({ registerDate: -1 })
    .toArray();
  if ( lastElement.length === 0) {
    return 1;
  }
  return lastElement[0].id + 1;
};

export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();
  if (lastElement.length === 0) {
    return '1';
  }
  return String(+lastElement[0].id + 1);
};


export const findOneElement = async (
   database: Db,
   collection: string ,
   filter: object
)=> {
    return database
            .collection(collection)
            .findOne(filter);

};

export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject });
};

export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).deleteOne(filter);
};

export const insertOneElement = async (
    database: Db,
    collection: string ,
    documento: object
 )=> {
     return await database
             .collection(collection)
             .insertOne(documento );
             
 };

 export const insertManyElements = async (
    database: Db,
    collection: string ,
    documentos: Array<object>
 )=> {
     return await database
             .collection(collection)
             .insertMany(documentos );
             
 };

 export const findElements = async (
    database: Db,
    collection: string ,
    filters: object = {}
 )=> {
     return await database
             .collection(collection)
             .find(filters )
             .toArray();
             
 };
 