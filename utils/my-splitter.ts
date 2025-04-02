import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitText = async (text: string) => {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 256,
    chunkOverlap: 20,
  });
  const metadata = {};
  const splitDocuments = await splitter.createDocuments([text], [metadata]);
  return splitDocuments;
};
