import { schemaComposer } from 'graphql-compose';

import { UserQueries, UserMutations } from './user.type';

schemaComposer.Query.addFields({
  ...UserQueries,
});

schemaComposer.Mutation.addFields({
  ...UserMutations,
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
