import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { LoadSurveyById } from '../../domain/usecases'
import { forbidden } from '../helpers'
import { InvalidParamError } from '../errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.load(httpRequest.params.surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return null
  }
}
