const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loading...');
contextBridge.exposeInMainWorld('electronAPI', {
    copyToClipboard: (text: string) => {
        console.log('IPC: copy-to-clipboard invoked with:', text);
        return ipcRenderer.invoke('copy-to-clipboard', text);
    },
    onOpenAbout: (callback: () => void) => {
        ipcRenderer.on('open-about', () => callback());
    },
    openExternal: (url: string) => {
        return ipcRenderer.invoke('open-external', url);
    }
});
console.log('Preload script exposed electronAPI');
