import { findOneElement, asignDocumentId } from './../lib/db-operations';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constans';
import { IContextData } from '../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.services';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';
class UsersService extends ResolversOperationsService {
    private collection = COLLECTIONS.USERS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    // Lista de usuarios
    async items() {
        const result = await this.list(this.collection, 'usuarios');
        return { status: result.status, message: result.message, users: result.items};
    }
    // Autenticarnos
    async auth() {
        let info = new JWT().verify(this.getContext().token!);
      if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
        return {
          status: false,
          message: info,
          user: null
        };
      }
      return {
        status: true,
        message: 'Usuario autenticado correctamente mediante el token',
        user: Object.values(info)[0]
      };
    }
    // Iniciar sesión
    async login() {
        try {
            const variables = this.getVariables().user;
            const user = await findOneElement(this.getDb(), this.collection, { email: variables?.email });
            if (user === null) {
              return {
                status: false,
                message: 'Usuario no existe',
                token: null,
              };
            }
            const passwordCheck = bcrypt.compareSync(
              variables?.password || '',
              user.password || ''
            );
    
            if (passwordCheck !== null) {
              delete user.password;
              delete user.birthday;
              delete user.registerDate;
            }
            return {
              status: passwordCheck,
              message:
                !passwordCheck
                  ? 'Password y usuario no son correctos, sesión no iniciada'
                  : 'Usuario cargado correctamente',
              token: 
                !passwordCheck
                  ? null
                  : new JWT().sign({ user }, EXPIRETIME.H24),
              user:
                !passwordCheck
                  ? null
                  : user,
            };
          } catch (error) {
            console.log(error);
            return {
              status: false,
              message:
                'Error al cargar el usuario. Comprueba que tienes correctamente todo.',
              token: null,
            };
          }
    }
    // Registrar un usuario
    async register( ) {
      const user = this.getVariables().user;

      // comprobar que user no es null
      if (user === null) {
        return {
          status: false,
          message: 'Usuario no definido, procura definirlo',
          user: null
        };
      }
      if (user?.password === null || 
        user?.password === undefined ||
        user?.password === '') {
          return {
            status: false,
            message: 'Usuario sin password correcto, procura definirlo',
            user: null
          };
        }
      // Comprobar que el usuario no existe
      const userCheck = await findOneElement(this.getDb(), this.collection, {email: user?.email});

      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user?.email} está registrado y no puedes registrarte con este email`,
          user: null
        };
      }

      // COmprobar el último usuario registrado para asignar ID
      user!.id = await asignDocumentId(this.getDb(), this.collection, { registerDate: -1 });
      // Asignar la fecha en formato ISO en la propiedad registerDate
      user!.registerDate = new Date().toISOString();
      // Encriptar password
      user.password = bcrypt.hashSync(user.password || '', 10);

      const result = await this.add(this.collection, user || {}, 'usuario');
      // Guardar el documento (registro) en la colección
      return {
        status: result.status,
        message: result.message,
        user: result.item
      };
    }
    // Modificar un usuario
    async modify() {
      const user = this.getVariables().user;
      // comprobar que user no es null
      if (user === null) {
        return {
          status: false,
          message: 'Usuario no definido, procura definirlo',
          user: null
        };
      }
      const filter = {id: user?.id };
      const result = await this.update(this.collection, filter, user || {}, 'usuario');
      return {
        status: result.status,
        message: result.message,
        user: result.item
      };
    }
    // Borrar el usuario seleccionado
    async delete() {
      const id = this.getVariables().id;
      if (id === undefined || id === '') {
        return {
          status: false,
          message: 'Identificador del usuario no definido, procura definirlo para eliminar el usuario',
          user: null
        };
      }
      const result = await this.del(this.collection, { id }, 'usuario');
      return {
        status: result.status,
        message: result.message
      };
    }
}

export default UsersService;