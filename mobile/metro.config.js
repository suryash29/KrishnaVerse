// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ─────────────────────────────────────────────────────────────────────────
// Firebase JS SDK + Expo SDK 53/54 fix
// Expo SDK 53+ turns on Metro's package.json "exports" resolution by default
// (resolver.unstable_enablePackageExports = true). Firebase ships CommonJS
// (.cjs) builds for React Native, and under the new exports resolution Metro
// picks a build where the native auth component is never registered, throwing:
//   "Component auth has not been registered yet"
// Disabling package exports + teaching Metro about .cjs files restores the
// resolution path Firebase expects. Run `npx expo start -c` after changing.
// ─────────────────────────────────────────────────────────────────────────
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
