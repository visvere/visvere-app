/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');
const jimp = require('jimp');

generateIcons();

async function generateIcons() {
  const uiDir = path.join('resources', 'ui');
  const buildDir = 'build';
  const iconsDir = path.join('build', 'icons'); // Changed to build/icons

  const pngPath = path.join(uiDir, 'icon.png');
  const icoPath = path.join(uiDir, 'icon.ico');
  const icnsPath = path.join(uiDir, 'icon.icns');

  const pngOutPath = path.join(buildDir, 'icon.png');
  const icoOutPath = path.join(buildDir, 'icon.ico');
  const icnsOutPath = path.join(buildDir, 'icon.icns');

  if (!fs.existsSync(pngPath)) {
    console.warn(
      "WARNING: No icon.png found. If you're using the systray option, an icon.png (256x256 pixel) is required to be provided at the root level of your webhapp's UI assets."
    );
    return;
  }

  // Ensure build directory exists
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  fs.cpSync(pngPath, pngOutPath);

  const pngBuffer = fs.readFileSync(pngPath);

  if (!fs.existsSync(icoPath)) {
    console.log('Generating icon.ico');
    const icoIcon = png2icons.createICO(pngBuffer, png2icons.BICUBIC2, 0, false, true);
    fs.writeFileSync(icoOutPath, icoIcon);
  } else {
    fs.cpSync(icoPath, icoOutPath);
  }

  if (!fs.existsSync(icnsPath)) {
    console.log('Generating icon.icns');
    const icnsIcon = png2icons.createICNS(pngBuffer, png2icons.BILINEAR, 0);
    fs.writeFileSync(icnsOutPath, icnsIcon);
  } else {
    fs.cpSync(icnsPath, icnsOutPath);
  }

  // Generate the systray icon
  console.log('Generating systray icon');
  const systrayIcon = await jimp.Jimp.fromBuffer(pngBuffer);

  if (process.platform === 'darwin') {
    // For macOS
    const macIcon = systrayIcon.clone();
    await macIcon.resize({ w: 16, h: 16 });
    await macIcon.write(path.join(iconsDir, 'trayIconTemplate.png'));

    const macIconX2 = systrayIcon.clone();
    await macIconX2.resize({ w: 32, h: 32 });
    await macIconX2.write(path.join(iconsDir, 'trayIconTemplate@2x.png'));
  } else {
    // For Windows
    await systrayIcon.resize({ w: 32, h: 32 }); // Changed size to match filename
    await systrayIcon.write(path.join(iconsDir, '32x32@2.png'));
  }

  // Generate the icon for OS notifications
  console.log('Generating notifications icon');
  const icon128x128 = await jimp.Jimp.fromBuffer(pngBuffer);
  await icon128x128.resize({ w: 128, h: 128 });
  await icon128x128.write(path.join(iconsDir, '128x128.png'));
}
