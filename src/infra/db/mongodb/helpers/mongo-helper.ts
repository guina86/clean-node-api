import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL as string)
  },

  async disconnect () {
    await this.client?.close()
  }

}
