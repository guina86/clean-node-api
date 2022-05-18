import { LoadSurveysRepository } from '../protocols'
import { SurveyModel } from '../../domain/models'
import { LoadSurveys } from '../../domain/usecases'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = this.loadSurveysRepository.loadAll()
    return surveys
  }
}
