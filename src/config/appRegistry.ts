import { GithubApp } from "@/apps/github";
import { appIds } from "./appIds";
import { TwitterApp } from "@/apps/twitter";
import { WalletApp } from "@/apps/wallet";
import { DiscordApp } from "@/apps/discord";

export type AppId = (typeof appIds)[number];

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowConstraints {
  minSize?: WindowSize;
  maxSize?: WindowSize;
  defaultSize: WindowSize;
  mobileDefaultSize?: WindowSize;
}

// Default window constraints for any app not specified
const defaultWindowConstraints: WindowConstraints = {
  defaultSize: { width: 730, height: 475 },
  minSize: { width: 300, height: 200 },
};

// Registry of all available apps with their window configurations
export const appRegistry = {
  [GithubApp.id]: {
    ...GithubApp,
    windowConfig: {
      defaultSize: { width: 730, height: 600 },
      minSize: { width: 400, height: 300 },
    } as WindowConstraints,
  },
  [TwitterApp.id]: {
    ...TwitterApp,
    windowConfig: {
      defaultSize: { width: 730, height: 600 },
      minSize: { width: 400, height: 300 },
    } as WindowConstraints,
  },
  [DiscordApp.id]: {
    ...DiscordApp,
    windowConfig: {
      defaultSize: { width: 730, height: 600 },
      minSize: { width: 400, height: 300 },
    } as WindowConstraints,
  },
  [WalletApp.id]: {
    ...WalletApp,
    windowConfig: {
      defaultSize: { width: 730, height: 600 },
      minSize: { width: 400, height: 300 },
    } as WindowConstraints,
  },
} as const;

// Helper function to get app icon path
export const getAppIconPath = (appId: AppId): string => {
  const app = appRegistry[appId];
  if (typeof app.icon === "string") {
    return app.icon;
  }
  return app.icon.src;
};

// Helper function to get all apps except Finder
export const getNonFinderApps = (): Array<{
  name: string;
  icon: string;
  id: AppId;
}> => {
  return Object.entries(appRegistry)
    .filter(([id]) => id !== "finder")
    .map(([id, app]) => ({
      name: app.name,
      icon: getAppIconPath(id as AppId),
      id: id as AppId,
    }));
};

// Helper function to get app metadata
export const getAppMetadata = (appId: AppId) => {
  return appRegistry[appId].metadata;
};

// Helper function to get app component
export const getAppComponent = (appId: AppId) => {
  return appRegistry[appId].component;
};

// Helper function to get window configuration
export const getWindowConfig = (appId: AppId): WindowConstraints => {
  return appRegistry[appId].windowConfig || defaultWindowConstraints;
};

// Helper function to get mobile window size
export const getMobileWindowSize = (appId: AppId): WindowSize => {
  const config = getWindowConfig(appId);
  if (config.mobileDefaultSize) {
    return config.mobileDefaultSize;
  }
  return {
    width: window.innerWidth,
    height: config.defaultSize.height,
  };
};
