import { adaptResolver } from '../../adapters'
import { makeLoadSurveysController } from '../../factories'

export default {
  Query: {
    surveys: async () => await adaptResolver(makeLoadSurveysController())
  }
}
