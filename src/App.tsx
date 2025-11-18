import type React from "react";
import itemsEN from "./db/en/item.json" with { type: "json" };
import assetpoolsEN from "./db/en/assetpoolnamed.json" with { type: "json" };
import itemsDE from "./db/de/item.json" with { type: "json" };
import assetpoolsDE from "./db/de/assetpoolnamed.json" with { type: "json" };
import { useTranslation } from "react-i18next";

export const App: React.FC = () => {
  const { i18n } = useTranslation();

  const items = i18n.language === "de" ? itemsDE : itemsEN;
  const assetpools = i18n.language === "de" ? assetpoolsDE : assetpoolsEN;

  return (
    <>
      <button onClick={() => i18n.changeLanguage("en")}>en</button>
      <button onClick={() => i18n.changeLanguage("de")}>de</button>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} ({item.rarity}) on {assetpools.find((pool) => pool.id === item.target)?.name}
        </div>
      ))}
    </>
  );
};
