// Read json file clean-videos.json
import fs from "fs";
import path from "path";

const readJsonFile = () => {
  // Read the json file
  const jsonFilePath = path.join(__dirname, "../../data/clean-videos.json");
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  // Parse the json data
  const parsedData = JSON.parse(jsonData);
  return parsedData;
};

const jsonToText = (data: any[]): { id: string; content: string }[] => {
  const transformedData: { id: string; content: string }[] = [];
  data.forEach((item) => {
    const tags = Array.isArray(item.tags) ? item.tags.join(" ") : item.tags;
    const starring = Array.isArray(item.starring)
      ? item.starring.join(" ")
      : item.starring;
    transformedData.push({
      id: item._id.$oid,
      content: `${item.title} ${starring} ${tags}`,
    });
  });
  return transformedData;
};

export const extractDataFromJson = () => {
  const parsedData = readJsonFile();
  const result = jsonToText(parsedData);
  return result;
};
