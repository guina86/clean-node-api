import { badRequest, noContent, serverError } from '@presentation/helpers'
import { Controller, HttpResponse, Validation } from '@presentation/protocols'
import { AddSurvey } from '@domain/usecases'

export type AddSurveyControllerRequest = {
  question: string
  answers: Answer[]
}

type Answer = {
  image?: string
  answer: string
}

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      await this.addSurvey.add({ ...request, date: new Date() })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
