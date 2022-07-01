import { noContent, ok, serverError } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'
import { LoadSurveys } from '@domain/usecases'

export type LoadSurveysControllerRequest = {
  accountId: string
}

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: LoadSurveysControllerRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
