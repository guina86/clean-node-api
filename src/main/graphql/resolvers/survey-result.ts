import { adaptResolver } from '../../adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '../../factories'

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => await adaptResolver(makeLoadSurveyResultController(), args, context)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => await adaptResolver(makeSaveSurveyResultController(), args, context)
  }
}
