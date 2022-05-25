import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client?.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db('clean-node-api').collection(name)
  },

  map (data: any): any {
    const { _id, ...rest } = data
    return { id: _id.toHexString(), ...rest }
  },

  mapArray (data: any[]): any[] {
    return data.map(item => MongoHelper.map(item))
  },

  to_id (id: string): ObjectId {
    return new ObjectId(id)
  }

}
