const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Tell Metro to look for source files in src/
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Support path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};

module.exports = config;
