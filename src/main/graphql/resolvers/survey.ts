import { adaptResolver } from '../../adapters'
import { makeLoadSurveysController } from '../../factories'

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) => await adaptResolver(makeLoadSurveysController(), args, context)
  }
}
