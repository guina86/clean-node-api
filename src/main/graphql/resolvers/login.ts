import { adaptResolver } from '../../adapters'
import { makeLoginController, makeSignUpController } from '../../factories'

export default {
  Query: {
    login: async (parent: any, args: any) => await adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => await adaptResolver(makeSignUpController(), args)
  }

}
