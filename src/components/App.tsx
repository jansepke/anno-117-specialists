import type React from "react";
import { useTranslation } from "react-i18next";
import itemsDE from "../db/de/item.json" with { type: "json" };
import itemsEN from "../db/en/item.json" with { type: "json" };
import type { AnnoItem } from "../types";
import { ItemList } from "./ItemList";
import { TopBar } from "./TopBar";

export const App: React.FC = () => {
  const { i18n } = useTranslation();

  const items = i18n.language === "de" ? itemsDE : itemsEN;

  return (
    <>
      <TopBar />
      <ItemList items={items as AnnoItem[]} />
    </>
  );
};
