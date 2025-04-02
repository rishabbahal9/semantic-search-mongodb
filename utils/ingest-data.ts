import { MongoClient } from "mongodb";
import { getEmbedding } from "./get-embeddings.js";
import { splitText } from "./my-splitter.js";
import { text } from "./data.js";

const ATLAS_CONNECTION_STRING = process.env.ATLAS_CONNECTION_STRING || "";
const DATABASE_NAME = process.env.DATABASE_NAME || "awesome";
const COLLECTION_NAME =
  process.env.COLLECTION_NAME || "awesome-embeddings";

async function run() {
  const client = new MongoClient(ATLAS_CONNECTION_STRING);

  try {
    const docs = await splitText(text);

    // Connect to your Atlas cluster
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("Generating embeddings and inserting documents...");
    const insertDocuments: any[] = [];
    await Promise.all(
      docs.map(async (doc) => {
        // Generate embeddings using the function that you defined
        const embedding = await getEmbedding(doc.pageContent);

        // Add the document with the embedding to array of documents for bulk insert
        insertDocuments.push({
          document: doc,
          embedding: embedding,
        });
      })
    );

    // Continue processing documents if an error occurs during an operation
    const options = { ordered: false };

    // Insert documents with embeddings into Atlas
    const result = await collection.insertMany(insertDocuments, options);
    console.log("Count of documents inserted: " + result.insertedCount);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
