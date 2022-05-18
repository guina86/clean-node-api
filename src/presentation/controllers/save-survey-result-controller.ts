import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { LoadSurveyById } from '../../domain/usecases'
import { forbidden, serverError } from '../helpers'
import { InvalidParamError } from '../errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, body: { answer } } = httpRequest
      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      if (!survey.answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
