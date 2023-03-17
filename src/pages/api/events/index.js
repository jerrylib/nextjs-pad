import { MongoClient } from 'mongodb'
const url = process.env.MONGO_DB_URL
const client = new MongoClient(url)

const handler = async (req, res) => {
  if (req.method === 'GET') {
    await client.connect()
    const db = client.db()
    const list = await db.collection('events').find({}).toArray()
    client.close()
    res.status(200).json(list)
    return
  }

  if (req.method === 'POST') {
    await client.connect()
    const db = client.db()
    await db.collection('events').insertOne({ emails: 'js_binbin@173.com' })
    client.close()
    res.status(200).json({})
    return
  }
}

export default handler
