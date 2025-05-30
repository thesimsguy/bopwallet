export const appIds = [
  "finder",
  "soundboard",
  "internet-explorer",
  "chats",
  "textedit",
  "paint",
  "github",
  "twitter",
  "photo-booth",
  "minesweeper",
  "videos",
  "ipod",
  "synth",
  "pc",
  "terminal",
  "discord",
  "wallet",
  "control-panels",
] as const;

export type AppId = typeof appIds[number]; 