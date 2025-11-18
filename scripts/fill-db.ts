/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";
import { type AnnoItem } from "../src/AnnoItem.ts";

async function generateDBForLanguage() {
  const data = await getData(["item"]);

  await fs.writeFile(`./src/db/items.json`, JSON.stringify(data, null, 2));
}

function newAnnoItem(asset: any): AnnoItem | undefined {
  return {
    id: asset.Values.Standard.GUID,
    name: asset.Values.Standard.Name,
    icon: asset.Values.Standard.IconFilename,
    rarity: asset.Values.Item.Rarity,
  };
}

export async function getData(fileNames: string[]): Promise<AnnoItem[]> {
  const assets = (await Promise.all(fileNames.map((fileName) => readFromCache("assets", fileName)))).flat();

  return assets.map((asset: any) => newAnnoItem(asset)).filter((ai) => ai !== undefined);
}

const fileCache: Record<string, Promise<any>> = {};

async function readFromCache(folder: string, file: string) {
  const fileName = `./import-data/json/${folder}/${file.replace("/", "-")}.json`;

  if (!fileCache[fileName]) {
    console.log("Loading", folder, file);

    fileCache[fileName] = new Promise((resolve) => {
      fs.readFile(fileName, "utf-8").then((data) => resolve(JSON.parse(data)));
    });
  }

  return await fileCache[fileName];
}

await generateDBForLanguage();
