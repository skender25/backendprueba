import { findOneElement, findElements } from './../../lib/db-operations';
import { EXPIRETIME, MESSAGES } from './../../config/constans';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from './../../config/constans';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import UsersService from '../../services/users.services';
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, { page, itemsPage}, context) {
      return new UsersService(_, {
        pagination: { page, itemsPage}
    }, context).items();
    },

    async login(_, { email, password }, context) {
      return new UsersService(_, { user: { email, password}}, context).login();
    },
    me(_, __, { token }) {
      return new UsersService(_, __, {token}).auth();
    }
  },
};

export default resolversUserQuery;