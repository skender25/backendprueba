import { findOneElement, findElements } from './../../lib/db-operations';
import  jwt  from 'jsonwebtoken';
import { COLLECTIONS, MESSAGES } from './../../config/constans';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';


const resolversUserQuery: IResolvers ={
    Query: {
       async  users(_ , __ , { db }  ){
           try {
               return {
                   status: true,
                   message: 'Lista de mensajes cargada correctamente',
                   users: await findElements(db,COLLECTIONS.USERS)
               };
           } catch (error) {
               console.log(error);
               return{
                status: false,
                message: 'Lista de mensajes no fue cargada correctamente',
                users:[]
               };

           }
           
        },
        async login(_,{ email,password },{ db }){
            try {
                const user =await findOneElement(db,COLLECTIONS.USERS,{ email });



                if(user === null){
                    return {
                        status: false,
                        message: 'usuario no existe',
                        token: null
                    };
                }
                
                const passCheck = bcrypt.compareSync(password, user.password);

                if(passCheck !== null){
                    delete user.password ;
                    delete user.registerDate ;
                    delete user.birthday ;
                }
                return {
                    status: true,
                    message:  
                            !passCheck
                            ? 'password o usuario incorrecto' 
                            : 'Usuario correcto',
                    token: 
                            !passCheck 
                            ?null
                            :new JWT().sign({ user }),
                };
            } catch (error) {
                console.log(error);
                return{
                 status: false,
                 message: 'Error al cargar usuario',
                 token: null,
                };
 
            }
        },
        me(_ ,__ ,{ token }){
            console.log(token);
            let info = new JWT().verify(token);
            if( info ===MESSAGES.TOKEN_VERIFICATION_FAILED ){
                return {
                    status: false,
                    message: info,
                    user: null
                };

            }

            return{
                status: true,
                message: 'Usuario autenticado correctamente',
                user: Object.values(info)[0] 
            };
        }
        
    }
};

export default resolversUserQuery;