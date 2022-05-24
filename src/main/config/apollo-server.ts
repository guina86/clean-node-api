import { ApolloServer } from 'apollo-server-express'
import typeDefs from '../graphql/type-defs'
import resolvers from '../graphql/resolvers'
import { Express } from 'express'

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })
  await server.start()
  server.applyMiddleware({ app })
}
