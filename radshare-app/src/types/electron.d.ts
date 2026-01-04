export interface ElectronAPI {
    copyToClipboard: (text: string) => Promise<boolean>;
    onOpenAbout: (callback: () => void) => void;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}
