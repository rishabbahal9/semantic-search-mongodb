import { getQueryResults } from "./utils/retrieve-document";
async function run() {
  try {
    const query = "AI Technology";
    const documents = await getQueryResults(query);
    if (!documents || documents.length === 0) {
      console.log("No documents found.");
      return;
    }
    documents.forEach((doc) => {
      console.log(doc);
    });
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);
