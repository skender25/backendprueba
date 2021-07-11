import { asigDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS } from './../../config/constans';
import { IResolvers } from 'graphql-tools';
import bcrypt  from 'bcrypt';



const resolversUserMutation: IResolvers ={
    Mutation: {
       async register(_ , { user } , { db } , info ){
           ///comprobar usuario no existe
           const userCheck = await findOneElement(db , COLLECTIONS.USERS , {email: user.email});
           if (userCheck !== null){
                 return {
                     status: false ,
                     message: `El email ${user.email} ya ha sido registrado`,
                    user: null
                 };
           }
          ///comprobar ultimo usuario asignar id
            user.id = await asigDocumentId(db , COLLECTIONS.USERS , {registerDate: -1});  


          //asignar fecha formato iso
            user.registerDate = new Date().toISOString();

            ///encriptar password 
            user.password = bcrypt.hashSync(user.password , 10);
 
          //guardar el documento
            return await insertOneElement(db , COLLECTIONS.USERS, user).then(
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

export default resolversUserMutation;