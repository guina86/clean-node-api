import { Controller, HttpResponse } from '@presentation/protocols'
import { LoadSurveyById, SaveSurveyResult } from '@domain/usecases'
import { forbidden, ok, serverError } from '@presentation/helpers'
import { InvalidParamError } from '@presentation/errors'

export type SaveSurveyResultControllerRequest = {
  surveyId: string
  answer: string
  accountId: string
}

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultControllerRequest): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
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
