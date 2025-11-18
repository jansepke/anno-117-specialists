/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";
import { languages, type Language } from "../src/anno-config.ts";
import { type AnnoAssetPool, type AnnoItem, type Effect } from "../src/types.ts";
import { toArray } from "./utils.ts";

const toAnnoItem =
  (buildingbuff: any) =>
  (translations: Record<string, string>, asset: any): AnnoItem | undefined => {
    const getEffect = (effectId: string) => {
      const effects: Effect[] = [];
      const buff = buildingbuff.find((bb: any) => bb.Values.Standard.GUID === effectId);
      if (!buff) {
        return effects;
      }

      const values = buff.Values;

      if (values.MaintenanceUpgrade?.MaintenanceFactorUpgrade?.Value) {
        const postfix = values.MaintenanceUpgrade.MaintenanceFactorUpgrade.Percental ? "%" : "";
        effects.push({
          name: "MaintenanceFactorUpgrade",
          value: `${values.MaintenanceUpgrade.MaintenanceFactorUpgrade.Value}${postfix}`,
        });
      }

      if (values.MaintenanceUpgrade?.WorkforceMaintenanceFactorUpgrade?.Value) {
        const postfix = values.MaintenanceUpgrade.WorkforceMaintenanceFactorUpgrade.Percental ? "%" : "";
        effects.push({
          name: "WorkforceMaintenanceFactorUpgrade",
          value: `${values.MaintenanceUpgrade.WorkforceMaintenanceFactorUpgrade.Value}${postfix}`,
        });
      }

      return effects;
    };

    try {
      return {
        id: asset.Values.Standard.GUID,
        name: translations[asset.Values.Text.OasisId],
        icon: asset.Values.Standard.IconFilename,
        rarity: asset.Values.Item.Rarity,
        target: asset.Values.Effect.Targets?.Item?.GUID,
        effect: getEffect(asset.Values.Effect.Buffs.Item.GUID),
      };
    } catch (error) {
      console.error("error converting item", asset, error);
      return undefined;
    }
  };

function toAssetPool(translations: Record<string, string>, asset: any): AnnoAssetPool | undefined {
  if (!asset.Values.AssetPool) {
    return undefined;
  }

  return {
    id: asset.Values.Standard.GUID,
    name: translations[asset.Values.Text.OasisId],
    assets: toArray<number>(asset.Values.AssetPool.AssetList.Item)
      .filter((item: any) => item.Asset)
      .map((item: any) => item.Asset),
  };
}

async function loadTranslations(language: string) {
  return await readFromCache("texts", `texts_${language}`);
}

export async function convertData(
  language: Language,
  folder: string,
  fileName: string,
  mapFn: (translations: Record<string, string>, asset: any) => unknown,
) {
  const translations = await loadTranslations(language.fileName);
  const assets = await readFromCache(folder, fileName);
  const data = assets.map((asset: any) => mapFn(translations, asset)).filter((a: unknown) => a !== undefined);
  await fs.mkdir(`./src/db/${language.key}`, { recursive: true });
  await fs.writeFile(`./src/db/${language.key}/${fileName}.json`, JSON.stringify(data, null, 2));
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

const buildingbuff = await readFromCache("assets", "buildingbuff");

async function generateDBForLanguage(language: Language) {
  await convertData(language, "assets", "item", toAnnoItem(buildingbuff));
  await convertData(language, "assets", "assetpoolnamed", toAssetPool);
}

for (const language of languages) {
  await generateDBForLanguage(language);
}
