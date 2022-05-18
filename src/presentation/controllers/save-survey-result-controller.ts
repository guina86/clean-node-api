import { LoadSurveyById } from '../../domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.load(httpRequest.params.surveyId)
    return null
  }
}
