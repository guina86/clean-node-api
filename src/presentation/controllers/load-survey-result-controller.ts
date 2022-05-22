import { LoadSurveyById } from '../../domain/usecases'
import { InvalidParamError } from '../errors'
import { forbidden } from '../helpers'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.load(httpRequest.params.surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return null
  }
}
