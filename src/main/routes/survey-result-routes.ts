import { adaptRoute } from '../adapters'
import { makeSaveSurveyResultController } from '../factories'
import { auth } from '../middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
