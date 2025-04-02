import { MongoClient } from "mongodb";

const ATLAS_CONNECTION_STRING = process.env.ATLAS_CONNECTION_STRING || "";
const DATABASE_NAME = process.env.DATABASE_NAME || "awesome";
const COLLECTION_NAME =
  process.env.COLLECTION_NAME || "awesome-embeddings";

// Connect to your Atlas cluster
const client = new MongoClient(ATLAS_CONNECTION_STRING);

async function run() {
  try {
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    // Define your Atlas Vector Search index
    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            numDimensions: 768,
            path: "embedding",
            similarity: "cosine",
          },
        ],
      },
    };

    // Call the method to create the index
    const result = await collection.createSearchIndex(index);
    console.log(result);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
