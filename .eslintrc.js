module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugin: ["prettier"],
  extends: [
    "airbnb-base",
    "plugin:node/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  ignorePatterns: ["node_modules/"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};
