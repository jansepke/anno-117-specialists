export interface AnnoItem {
  id: number;
  name: string;
  icon: string;
  rarity: string;
  target?: string;
}

export interface AnnoAssetPool {
  id: number;
  name: string;
  assets: number[];
}
