import { defineConfig } from './src/main/defineConfig';

export default defineConfig({
  appId: 'org.visvere',
  productName: 'Visvere',
  version: '0.1.1',
  networkSeed: 'visvere-network-0.0.5',
  macOSCodeSigning: false,
  windowsEVCodeSigning: false,
  fallbackToIndexHtml: true,
  autoUpdates: true,
  systray: true,
  passwordMode: 'no-password',
  bins: {
    holochain: {
      version: '0.4.0-dev.20',
      sha256: {
        'x86_64-unknown-linux-gnu':
          '31f4fc0a1faf6154ca17c6ea73782f7dd7c021edd88d59914d560cfbb5774cec',
        'x86_64-pc-windows-msvc.exe':
          '124ec7cf3f92ea5a7d7cd7dabdce8df322fe6a823f78afaee080bab05e224d85',
        'x86_64-apple-darwin': 'efedd1fa54f3ceefeb1876db2546691ed4d4263db71b3b4f6a7507efbd809c85',
        'aarch64-apple-darwin': '9239402eff235552234daeeb482ce3c8fc6503243ae1f46a63c891ce031a3971',
      },
    },
    lair: {
      version: '0.5.0',
      sha256: {
        'x86_64-unknown-linux-gnu':
          '0d9bf4e1172d8ad7575e8e7b063aa9a9b07d721cff91c24284f7c150a68b1781',
        'x86_64-pc-windows-msvc.exe':
          '84288c8302e181e1c8e490a9fdff6debc5db91829f959ee7b367050f11cfdd44',
        'x86_64-apple-darwin': '7908bb35df2123a168f258b67f5fd37e5a04db7ba682bbec64d095bbdc6a1cab',
        'aarch64-apple-darwin': '313ee23cdc7ca7d833f6909e5b6afb6ea4b1bcef90b319f981121b69c70efaaa',
      },
    },
  },
});
