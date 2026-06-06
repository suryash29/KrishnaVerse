module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated 4 (SDK 54) moved its Babel plugin into react-native-worklets.
    // This MUST be the last plugin in the list.
    plugins: ['react-native-worklets/plugin'],
  };
};
