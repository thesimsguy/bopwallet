import { BaseApp } from "@/apps/base/types";
import { AppManagerState } from "@/apps/base/types";
import { AppId } from "@/config/appRegistry";
import { useState, useEffect, useRef } from "react";
import { FileIcon } from "@/apps/finder/components/FileIcon";
import { getAppIconPath } from "@/config/appRegistry";
import { useWallpaper } from "@/hooks/useWallpaper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface DesktopStyles {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  transition?: string;
}

interface DesktopProps {
  apps: BaseApp[];
  appStates: AppManagerState;
  toggleApp: (appId: AppId, initialData?: any) => void;
  onClick?: () => void;
  desktopStyles?: DesktopStyles;
  wallpaperPath: string;
}

export function Desktop({
  apps,
  toggleApp,
  onClick,
  desktopStyles,
  wallpaperPath,
}: DesktopProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const {
    currentWallpaper,
    wallpaperSource,
    isVideoWallpaper,
    INDEXEDDB_PREFIX,
    getWallpaperData,
  } = useWallpaper();
  const [displaySource, setDisplaySource] = useState<string>("");
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [walletSuccessDialog, setIsWalletSuccessDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const walletKeyPairs = [
    {
      wallet: "B7L7fessHGt6VJp6WzEG5fxEg7QsEdZKDnLcarZPQ9wx",
      key: "4maY1sSxBGmGndunAJ4hDYkE6FnmjBRt2oYsGnTRBEhxF7N62ttNmHv8Tt7VMAMVYKEa1Yxhm7T8yX8WJajqpMPg",
    },
    {
      wallet: "SM8GSMJQUK9Ni6Gmr5dAU7v2WQjmj2PjxW9XrPPmViD",
      key: "3bBRrME4BNhL1VEn5EcLUYzG18TDWaCufgY2yexqxts7kV2tK9NyNNmFZSKU8ki5E4fEydcefbdnXLa3iotNtHYR",
    },
    {
      wallet: "J6b5CaxGcc7dhTULSRJ9ufV3X8Q7sRTLXgr1NjFavTxB",
      key: "4on9mmsnUMhQK2XqrmWDp9c3rypvg6uZ4ZtRqb32rp9Ra767QJ7pSXvN58uQNW8fnYS8nCx8YZGGnh1mF6T5Xpvs",
    },
  ];

  const handleGenerate = () => {
    setIsWalletDialogOpen(false);
    const randomPair =
      walletKeyPairs[Math.floor(Math.random() * walletKeyPairs.length)];
    setSelectedWallet(randomPair.wallet);
    setSelectedKey(randomPair.key);
    setIsWalletSuccessDialog(true);
  };

  // Keep displaySource in sync with wallpaperSource and currentWallpaper
  useEffect(() => {
    setDisplaySource(wallpaperSource);
  }, [wallpaperSource, currentWallpaper]);

  // Initialize wallpaperPath from props
  useEffect(() => {
    if (wallpaperPath && wallpaperPath !== currentWallpaper) {
      setDisplaySource(wallpaperPath);
    }
  }, [wallpaperPath, currentWallpaper]);

  // Listen for wallpaper changes
  useEffect(() => {
    const handleWallpaperChange = async (e: CustomEvent<string>) => {
      const newWallpaper = e.detail;

      if (newWallpaper.startsWith(INDEXEDDB_PREFIX)) {
        const data = await getWallpaperData(newWallpaper);
        if (data) {
          setDisplaySource(data);
        } else {
          setDisplaySource(newWallpaper);
        }
      } else {
        setDisplaySource(newWallpaper);
      }
    };

    window.addEventListener(
      "wallpaperChange",
      handleWallpaperChange as unknown as EventListener
    );
    return () =>
      window.removeEventListener(
        "wallpaperChange",
        handleWallpaperChange as unknown as EventListener
      );
  }, [INDEXEDDB_PREFIX, getWallpaperData]);

  // Add visibility change and focus handlers to resume video playback
  useEffect(() => {
    if (!isVideoWallpaper || !videoRef.current) return;

    const resumeVideoPlayback = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        // If video has ended, reset it to the beginning
        if (video.ended) {
          video.currentTime = 0;
        }

        // Only attempt to play if the video is ready
        if (video.readyState >= 3) {
          // HAVE_FUTURE_DATA or better
          await video.play();
        } else {
          // If video isn't ready, wait for it to be ready
          const handleCanPlay = () => {
            video.play().catch((err) => {
              console.warn("Could not resume video playback:", err);
            });
            video.removeEventListener("canplay", handleCanPlay);
          };
          video.addEventListener("canplay", handleCanPlay);
        }
      } catch (err) {
        console.warn("Could not resume video playback:", err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resumeVideoPlayback();
      }
    };

    const handleFocus = () => {
      resumeVideoPlayback();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isVideoWallpaper]);

  // Add video ready state handling
  useEffect(() => {
    if (!isVideoWallpaper || !videoRef.current) return;

    const video = videoRef.current;
    const handleCanPlayThrough = () => {
      if (video.paused) {
        video.play().catch((err) => {
          console.warn("Could not start video playback:", err);
        });
      }
    };

    video.addEventListener("canplaythrough", handleCanPlayThrough);
    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [isVideoWallpaper]);

  const getWallpaperStyles = (path: string): DesktopStyles => {
    if (!path) return {};

    if (
      path.endsWith(".mp4") ||
      path.includes("video/") ||
      (path.startsWith("https://") && /\.(mp4|webm|ogg)($|\?)/.test(path))
    ) {
      return {};
    }

    const isTiled = path.includes("/wallpapers/tiles/");
    return {
      backgroundImage: `url(${path})`,
      backgroundSize: isTiled ? "64px 64px" : "cover",
      backgroundRepeat: isTiled ? "repeat" : "no-repeat",
      backgroundPosition: "center",
      transition: "background-image 0.3s ease-in-out",
    };
  };

  const finalStyles = {
    ...getWallpaperStyles(displaySource),
    ...desktopStyles,
  };

  const handleIconClick = (
    appId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    setSelectedAppId(appId);
  };

  return (
    <div
      className="absolute inset-0 min-h-screen h-full z-[-1] desktop-background"
      onClick={onClick}
      style={finalStyles}
    >
      <Dialog
        open={walletSuccessDialog}
        onOpenChange={setIsWalletSuccessDialog}
      >
        <DialogContent
          className="bg-system7-window-bg gap-0 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] max-w-xs"
          onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="font-normal text-[16px]">
              Wallet Generated
            </DialogTitle>
            <DialogDescription className="sr-only">
              Please save your wallet credentials given below
            </DialogDescription>
          </DialogHeader>
          <div className="p-5 w-full">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="wallet">Wallet</Label>
              <Input
                value={selectedWallet}
                placeholder="Wallet"
                name="wallet"
                readOnly
                className="shadow-none h-8 text-sm w-full"
              />
            </div>
            <div className="grid mt-4 w-full items-center gap-1.5">
              <Label htmlFor="key">Private Key</Label>
              <Input
                value={selectedKey}
                placeholder="Private Key"
                readOnly
                className="shadow-none h-8 text-sm w-full"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent
          className="bg-system7-window-bg gap-0 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] max-w-xs"
          onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="font-normal text-[16px]">
              Generate Wallet
            </DialogTitle>
            <DialogDescription className="sr-only">
              Generate Wallet
            </DialogDescription>
          </DialogHeader>
          <div className="p-5 w-full">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Twitter Handle</Label>
              <Input
                value={twitterHandle}
                placeholder="Twitter Handle"
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="shadow-none h-8 text-sm w-full"
              />
            </div>
            <DialogFooter className="mt-4 flex justify-end gap-1">
              <Button
                disabled={!twitterHandle}
                onClick={handleGenerate}
                variant="retro"
                className="w-full"
              >
                Generate
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <img
        src="/background.png"
        className="absolute inset-0 w-full h-full object-fill z-[-10]"
      />
      <div className="pt-8 p-4 flex flex-col items-end h-[calc(100%-2rem)] relative z-[1]">
        <div className="flex flex-col flex-wrap-reverse justify-start gap-1 content-start h-full">
          {apps
            .filter((app) => app.id !== "finder" && app.id !== "control-panels")
            .map((app) => (
              <FileIcon
                key={app.id}
                name={app.name}
                isDirectory={false}
                icon={getAppIconPath(app.id)}
                onClick={(e) => handleIconClick(app.id, e)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (app.id === "wallet") {
                    setIsWalletDialogOpen(true);
                  }
                  if (app.id === "twitter") {
                    window.open("https://x.com/bopwallet");
                  } else if (app.id === "github") {
                    window.open("https://github.com/thesimsguy/simsOS");
                  } else if (app.id === "discord") {
                    window.open("https://discord.gg/KeDJmT4s");
                  }
                  toggleApp(app.id);
                  setSelectedAppId(null);
                }}
                isSelected={selectedAppId === app.id}
                size="large"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
