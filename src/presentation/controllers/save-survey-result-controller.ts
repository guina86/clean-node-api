import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { LoadSurveyById, SaveSurveyResult } from '../../domain/usecases'
import { forbidden, ok, serverError } from '../helpers'
import { InvalidParamError } from '../errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, body: { answer }, accountId } = httpRequest
      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const answers = survey.answers.map(item => item.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
