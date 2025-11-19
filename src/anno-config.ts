export const languages = [
  { key: "de", fileName: "german" },
  { key: "en", fileName: "english" },
];

export type Language = (typeof languages)[0];

export const rarities = [
  { key: "rare", labelId: 118004, color: "#3E5495" },
  { key: "epic", labelId: 118005, color: "#A563A6" },
  { key: "quest", labelId: 118006, color: "#C76936" },
];
