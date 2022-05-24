import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { setupApp } = (await import('./config/app'))
    const app = await setupApp()
    app.listen(env.port, () => console.log('Sever running'))
  }).catch(console.error)
