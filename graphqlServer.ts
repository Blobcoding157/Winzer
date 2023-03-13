import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
type User {
    id: ID!
    username: String!
    firstName: String
    lastName: String
    password_hash: String
    }

    type Query {
    users: [User]
    }
    `;
const users = {
  id: 1,
  username: 'test_username',
  firstName: 'test-firstName',
  lastName: 'test_lastName',
  password_hash: 'test_hash',
};

const resolvers = {
  Query: {
    users: () => users,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  // console.log(`server is running on port ${url}`);
}

startApolloServer().catch((err) => {
  console.error(err);
});
