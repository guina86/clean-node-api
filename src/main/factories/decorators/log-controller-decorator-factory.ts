import { LogControllerDecorator } from '../../decorators'
import { LogMongoRepository } from '../../../infra/db/mongodb'
import { Controller } from '../../../presentation/protocols'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
