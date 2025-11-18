/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLParser } from "fast-xml-parser";
import { promises as fs } from "fs";

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

const toArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);

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
