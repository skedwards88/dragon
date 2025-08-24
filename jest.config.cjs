module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@skedwards88/shared-components/)",
  ],
};
