# Retrieval-Augmented Generation (RAG) with Atlas Vector Search
https://www.mongodb.com/docs/atlas/atlas-vector-search/rag/

## Env requirements
Node v22.14.0

## How to run the code
1. Add env variables from `.env.example`.
2. Install dependencies
    ```bash
    npm install
    ```
3. Change text in data.ts in utils directory if required.
4. Compile code
    ```bash
    npx tsc
    ```
    directory **dist** will be formed.
5. Ingest data in mongodb db as collection
    ```bash
    node dist/utils/ingest-data.js
    ```
    You can check in your mongodb database the name of the collection should be there.
6. Create Vector Search Index
    ```bash
    node dist/utils/create-vector-search-index.js
    ```
    This will create vector search index. You can find it in `Atlas Search` tab on MongoDB.
7. Try retrieving relevant documents from database.
    ```bash
    node dist/app
    ```