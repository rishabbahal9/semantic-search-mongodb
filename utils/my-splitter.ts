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

export const splitTextChunks = async (
  data: {
    id: string;
    content: string;
  }[]
) => {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 256,
    chunkOverlap: 20,
  });

  const promises = data.map(async (item) => {
    const metadata = { id: item.id };
    const splitDocuments = await splitter.createDocuments(
      [item.content],
      [metadata]
    );
    return splitDocuments;
  });
  const finalSplitDocuments = await Promise.all(promises);
  return finalSplitDocuments.flat();
};
