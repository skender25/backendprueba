import { COLLECTIONS } from '../config/constans';
import { IResolvers } from 'graphql-tools';
import bcrypt  from 'bcrypt';


const resolversMutation: IResolvers ={
    Mutation: {
       async regis(_ , { user } , { db } , info ){
           ///comprobar usuario no existe
           const userCheck = await db.collection(COLLECTIONS.USERS).findOne({email: user.email});
           if (userCheck !== null){
                 return {
                     status: false ,
                     message: `El email ${user.email} ya ha sido registrado`,
                    user: null
                 };
           }
          ///comprobar ultimo usuario asignar id
            const lastUser = await db.collection(COLLECTIONS.USERS).
                    find().
                    limit(1).
                    sort({ registerDate: -1  }).toArray();
            if (lastUser.length === 0){
                user.id = 1;
            }else{
                user.id = lastUser[0].id + 1 ;
            }        
            console.log(user);
          //asignar fecha formato iso
            user.registerDate = new Date().toISOString();

            ///encriptar password 
            user.password = bcrypt.hashSync(user.password , 10);
 
          //guardar el documento
            return await db.
                 collection(COLLECTIONS.USERS).
                 insertOne(user).then(
                     async() => {
                        return {
                            status: true ,
                            message: `El usuario con el email ${user.email} ha sido registrado`,
                           user
                        };
                     }
                 ).catch((err: Error) => {
                     console.log(err.message);
                     return {
                        status: false ,
                        message: `Error inesperado intenta de nuevo`,
                       user: null
                    };
                 });

        }
    }
};

export default resolversMutation;