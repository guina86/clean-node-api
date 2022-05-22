import { LoadSurveyById, LoadSurveyResult } from '../../domain/usecases'
import { InvalidParamError } from '../errors'
import { forbidden, serverError } from '../helpers'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.load(httpRequest.params.surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      await this.loadSurveyResult.load(httpRequest.params.surveyId)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
