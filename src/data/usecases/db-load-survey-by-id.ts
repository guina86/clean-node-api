import { LoadSurveyByIdRepository } from '../protocols'
import { SurveyModel } from '../../domain/models'
import { LoadSurveyById } from '../../domain/usecases'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async load (id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
