/* eslint-disable @typescript-eslint/no-var-requires */
const { notarize } = require('@electron/notarize');
const path = require('path');
const fs = require('fs');

exports.default = async function notarizing(context) {
  // Only notarize on Mac
  if (process.platform !== 'darwin') return;

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

  let timeoutId;

  try {
    // Create a timeout controller
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Notarization timed out after 20 minutes'));
      }, 1200000); // 20 minutes in milliseconds
    });

    // Create the notarization promise
    const notarizePromise = notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID_EMAIL,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });

    // Race the two promises - whichever completes/rejects first wins
    await Promise.race([timeoutPromise, notarizePromise]);

    console.log(`Successfully notarized ${appId}`);
  } catch (error) {
    console.error('Notarization failed:', error);

    // Explicitly throw error to ensure workflow fails
    process.exitCode = 1;
    throw error;
  } finally {
    // Always clear the timeout to prevent memory leaks
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};
