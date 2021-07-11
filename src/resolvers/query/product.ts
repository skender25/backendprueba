import  jwt  from 'jsonwebtoken';
import { COLLECTIONS, MESSAGES } from './../../config/constans';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';


const resolversProductQuery: IResolvers ={
    Query: {
      
        products(){
            return false;
        }
    }
};

export default resolversProductQuery;