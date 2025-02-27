/* eslint-disable @typescript-eslint/no-var-requires */
const { notarize } = require('@electron/notarize');
const path = require('path');
const fs = require('fs');

exports.default = async function notarizing(context) {
  // Only notarize on Mac
  if (process.platform !== 'darwin') return;

  const kangarooConfig = require(path.join(process.cwd(), 'kangaroo.config.ts')).default;

  if (kangarooConfig.macOSNotarization === false || kangarooConfig.macOSNotarization == undefined) {
    console.log('Skipping notarization: notarization is disabled in kangaroo.config.ts');
  }

  // Skip if not supposed to notarize
  const credsExist =
    process.env.APPLE_ID_EMAIL && process.env.APPLE_ID_PASSWORD && process.env.APPLE_TEAM_ID;

  if (!credsExist) {
    console.log('Skipping notarization: credentials not found');
    return;
  }

  console.log('Notarizing macOS application...');

  const appId = context.packager.appInfo.id;
  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);

  if (!fs.existsSync(appPath)) {
    console.log(`Skipping notarization: application at path ${appPath} does not exist`);
    return;
  }

  try {
    await notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID_EMAIL,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    console.log(`Successfully notarized ${appId}`);
  } catch (error) {
    console.error('Notarization failed:', error);
    throw error;
  }
};
