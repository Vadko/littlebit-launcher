// Window interface extensions for Electron APIs
interface LiquidGlassAPI {
  isSupported: () => Promise<boolean>;
  toggle: (enabled: boolean) => Promise<void>;
}

interface Window {
  liquidGlassAPI: LiquidGlassAPI;
  windowControls: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    onMaximizedChange: (callback: (isMaximized: boolean) => void) => void;
  };
}