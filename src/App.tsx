import type React from "react";
import items from "./db/items.json" with { type: "json" };

export const App: React.FC = () => {
  return items.map((item) => (
    <div key={item.id}>
      {item.name} ({item.rarity})
    </div>
  ));
};
