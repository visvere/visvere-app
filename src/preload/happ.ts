// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { CallZomeRequestUnsigned } from '@holochain/client';

contextBridge.exposeInMainWorld('__HC_ZOME_CALL_SIGNER__', {
  signZomeCall: (zomeCall: CallZomeRequestUnsigned) =>
    ipcRenderer.invoke('sign-zome-call', zomeCall),
});

contextBridge.exposeInMainWorld('kangaroo', {
  getVersion: async () => await ipcRenderer.invoke('get-version'),
});
