import { AddSurvey } from '../../../domain/usecases/add-survey'
import { badRequest, noContent, serverError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      await this.addSurvey.add({ ...httpRequest.body, date: new Date() })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
