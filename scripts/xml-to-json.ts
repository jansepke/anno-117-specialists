/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLParser } from "fast-xml-parser";
import { promises as fs } from "fs";
import { languages } from "../src/anno-config.ts";
import { toArray } from "./utils.ts";

const assetPath = "AssetList.Groups.Group";
const assetParser = new XMLParser({
  processEntities: false,
  updateTag(tagName: string, jPath: string) {
    if (jPath.startsWith(assetPath) || assetPath.startsWith(jPath)) {
      return tagName;
    }
    return false;
  },
});

const languageParser = new XMLParser();

const assetsByType: Record<string, any> = {};

async function loadAssets() {
  console.log("Loading Assets...");

  const json = await parseXMLDataFile("assets", assetParser);

  processGroups(json.AssetList.Groups.Group);

  // write cached data
  for (const [assetType, assets] of Object.entries(assetsByType)) {
    await saveToCache("assets", assetType, assets);
  }
}

async function loadTranslations(language: string) {
  console.log(`Loading ${language} Translations...`);

  const fileName = `texts_${language}`;

  const json = await parseXMLDataFile(fileName, languageParser);
  const translations: Record<string, string> = {};
  for (const item of json.TextExport.Texts.Text) {
    translations[item.LineId] = item.Text.replace
      ? item.Text.replace(/\[.*\]/g, "")
          .replace(/\s\s/g, " ")
          .replace(": .", "")
      : item.Text;
  }

  await saveToCache("texts", fileName, translations);
}

type Group = {
  Assets: {
    Asset: unknown | unknown[];
  };
} & {
  Groups: {
    Group: Group | Group[];
  };
};

function processGroups(groups: Group | Group[]) {
  const groupsArray = toArray(groups);

  for (const group of Array.from(groupsArray)) {
    if ("Assets" in group) {
      processAssets(group.Assets.Asset);
    }

    if ("Groups" in group) {
      processGroups(group.Groups.Group);
    }
  }
}

function processAssets(assets: any) {
  const assetsArray = toArray(assets);

  for (const asset of Array.from<any>(assetsArray)) {
    if (!asset.Template) {
      continue;
    }

    const assetType = (
      asset.Values.Item && asset.Values.Item.Allocation ? asset.Values.Item.Allocation + "item" : asset.Template
    ).toLowerCase();

    if (!assetsByType[assetType]) {
      assetsByType[assetType] = [];
    }

    assetsByType[assetType].push(asset);
  }
}

async function parseXMLDataFile(file: string, parser: XMLParser) {
  const xml = await fs.readFile(`./import-data/xml/${file}.xml`);

  try {
    return parser.parse(xml, true);
  } catch {
    throw new Error("Invalid XML");
  }
}

async function saveToCache(folder: string, file: string, data: unknown) {
  const fileName = `./import-data/json/${folder}/${file.replace("/", "-")}.json`;

  await fs.writeFile(fileName, JSON.stringify(data, null, 2));
}

await loadAssets();
await Promise.all(languages.map((l) => loadTranslations(l.fileName)));
