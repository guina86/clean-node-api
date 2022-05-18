import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log('Sever running'))
  }).catch(console.error)
