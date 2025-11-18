import type React from "react";
import items from "./db/en/item.json" with { type: "json" };
import assetpools from "./db/en/assetpoolnamed.json" with { type: "json" };

export const App: React.FC = () => {
  return items.map((item) => (
    <div key={item.id}>
      {item.name} ({item.rarity}) on {assetpools.find((pool) => pool.id === item.target)?.name}
    </div>
  ));
};
