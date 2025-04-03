import { MongoClient } from "mongodb";
import { getEmbedding } from "./get-embeddings.js";
import { splitText, splitTextChunks } from "./my-splitter.js";
import { extractDataFromJson } from "./extract-data-from-json.js";
// import { text } from "./data.js"; // #1
const textChunks = extractDataFromJson(); // #2

const ATLAS_CONNECTION_STRING = process.env.ATLAS_CONNECTION_STRING || "";
const DATABASE_NAME = process.env.DATABASE_NAME || "awesome";
const COLLECTION_NAME = process.env.COLLECTION_NAME || "awesome-embeddings";

async function run() {
  const client = new MongoClient(ATLAS_CONNECTION_STRING);

  try {
    // const docs = await splitText(text);  // #1
    const docs = await splitTextChunks(textChunks); // #2

    // Connect to your Atlas cluster
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("Generating embeddings and inserting documents...");
    const insertDocuments: any[] = [];
    const BATCH_SIZE = 20; // Adjust concurrency as needed

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const batch = docs.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (doc) => {
          // Generate embeddings using the function that you defined
          const embedding = await getEmbedding(doc.pageContent);
          // Add the document with the embedding to array of documents for bulk insert
          insertDocuments.push({
            document: doc,
            embedding: embedding,
          });
        })
      );
      // Log batch progress
      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(docs.length / BATCH_SIZE)}`);
    }

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
