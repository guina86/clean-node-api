import { adaptRoute } from '../adapters'
import { makeAddSurveyController, makeLoadSurveysController } from '../factories'
import { auth, adminAuth } from '../middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
