import GMR from 'graphql-merge-resolvers';
import resolversProductMutation from './product';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversProductMutation
]);

export default mutationResolvers;