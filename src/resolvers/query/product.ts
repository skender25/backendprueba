
import { COLLECTIONS, MESSAGES } from './../../config/constans';
import { IResolvers } from 'graphql-tools';

import ProductsService from '../../services/products.service';



const resolversProductQuery: IResolvers ={
    Query: {
      
        async products(_ , variables, { db }  ){
           
        
            return new ProductsService(_, {
                pagination: variables
            }, { db }).items();
        },
        async product(_, { id }, { db }) {
            return new ProductsService(_, { id }, { db }).details();
        }
    }
};

export default resolversProductQuery;