import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { LoadSurveyById } from '../../domain/usecases'
import { forbidden, serverError } from '../helpers'
import { InvalidParamError } from '../errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.load(httpRequest.params.surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
