import { findElements } from './../../lib/db-operations';
import  jwt  from 'jsonwebtoken';
import { COLLECTIONS, MESSAGES } from './../../config/constans';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import ProductsService from '../../services/products.service';


const resolversProductQuery: IResolvers ={
    Query: {
      
        async products(_ , __ , { db }  ){
            return new ProductsService(_,__,{ db } ).items();
        },
        async product(_, { id }, { db }) {
            return new ProductsService(_, { id }, { db }).details();
        }
    }
};

export default resolversProductQuery;