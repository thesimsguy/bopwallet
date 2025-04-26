import { BaseApp } from "../base/types";
import { DiscordAppComponent } from "./components/DiscordAppComponent";

export const DiscordApp: BaseApp = {
  id: "discord",
  name: "Discord",
  icon: {
    type: "image",
    src: "/icons/question.png",
  },
  description: "Your discord",
  component: DiscordAppComponent,
  helpItems: [
    {
      icon: "💻",
      title: "Basic Commands",
      description:
        "Use commands like ls, cd, cat, pwd, clear, and touch to navigate and manage files.",
    },
    {
      icon: "🧭",
      title: "Navigation",
      description:
        "Browse the same virtual file system as Finder with familiar Unix commands.",
    },
    {
      icon: "⌨️",
      title: "Command History",
      description:
        "Press ↑ / ↓ arrows to cycle through previous commands and re-run them quickly.",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description:
        'Type "ryo &lt;prompt&gt;" to chat with Ryo AI directly inside the terminal.',
    },
    {
      icon: "📝",
      title: "File Editing",
      description:
        "Open documents in TextEdit (edit) or Vim-style editor (vim) right from the prompt.",
    },
    {
      icon: "🔊",
      title: "Terminal Sounds",
      description:
        "Distinct sounds for output, errors & AI replies. Toggle in View ▸ Sounds.",
    },
  ],
  metadata: {
    name: "Terminal",
    version: "1.0",
    creator: {
      name: "ryOS Developer",
      url: "https://github.com/ryokun6/ryos",
    },
    github: "https://github.com/ryokun6/ryos",
    icon: "/icons/terminal.png",
  },
};

export const appMetadata = DiscordApp.metadata;
export const helpItems = DiscordApp.helpItems;
