import { adaptResolver } from '../../adapters'
import { makeLoginController } from '../../factories'

export default {
  Query: {
    login: async (parent: any, args: any) => await adaptResolver(makeLoginController(), args)
  }
}
