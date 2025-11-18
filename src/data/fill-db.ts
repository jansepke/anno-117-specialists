/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";
import { type AnnoItem } from "./AnnoItem.ts";

async function main() {
  await generateDBForLanguage();
}

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
  // const translations = await loadTranslations(language);
  // const rewardPoolById = await loadRewardPools();
  // const effectTargetPoolById = await loadEffectTargetPools();
  const assets = (await Promise.all(fileNames.map((fileName) => readFromCache("assets", fileName)))).flat();

  // const factory = new AnnoItemFactory(translations, effectTargetPoolById, rewardPoolById);

  return assets.map((asset: any) => newAnnoItem(asset)).filter((ai) => ai !== undefined);
}

async function loadTranslations(language: string) {
  return await readFromCache("texts", `texts_${language}`);
}

async function loadRewardPools() {
  const rewardPools = await readFromCache("assets", "rewardpool");

  const rewardPoolById: Record<number, any> = {};

  for (const rewardPool of rewardPools) {
    rewardPoolById[rewardPool.Values.Standard.GUID] = rewardPool;
  }

  return rewardPoolById;
}

async function loadEffectTargetPools() {
  const effectTargetPools = await readFromCache("assets", "itemeffecttargetpool");

  const effectTargetPoolById: Record<number, any> = {};

  for (const effectPool of effectTargetPools) {
    effectTargetPoolById[effectPool.Values.Standard.GUID] = effectPool;
  }

  return effectTargetPoolById;
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

main();
