export interface Effect {
  name: string;
  value: string;
}

export interface AnnoItem {
  id: number;
  name: string;
  icon: string;
  rarity: string;
  target?: string;
  effect?: Effect[];
}

export interface AnnoAssetPool {
  id: number;
  name: string;
  assets: number[];
}
