import { ApolloServer } from 'apollo-server-express'
import typeDefs from '../type-defs'
import resolvers from '../resolvers'
import { GraphQLError } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { authDirectiveTransformer } from '../directives'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) response.http.status = 400
    else if (checkError(error, 'AuthenticationError')) response.http.status = 401
    else if (checkError(error, 'ForbiddenError')) response.http.status = 403
    else response.http.status = 500
  })
}

const checkError = (error: any, errorName: string): boolean => {
  return error.name === errorName || error.originalError?.name === errorName
}

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = async (): Promise<ApolloServer> => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
    })
  }]
})
