// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import client from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    await client.connect(); // `await client.connect()` will use the default database passed in the MONGODB_URI
    const database = client.db("sample_mflix")
    const collection = database.collection("movies")

    const searchQuery = req.query.search || "awesome";

    const pipeline = [
        {
          "$search": {
            index: "default",
            text: {
              query: searchQuery,
              path: {
                wildcard: "*"
              }
            }
          }
        },
      {
        $limit: 100
      },
      {
        $project: {
          _id: 0,
          title: 1,
          description: 1,
          poster: 1,
          fullplot: 1,
          score: { $meta: "searchScore" }
        }
      }
    ]

    const results = await collection.aggregate(pipeline).toArray()

    console.log(results)

    res.json(results)
  } catch (e) {
    res.json('nothing');
  }
}
