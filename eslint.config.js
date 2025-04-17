const { defineConfig } = require("eslint/config");

module.exports = defineConfig({
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "standard",
  parserOptions: {
    ecmaVersion: 12,
  },
});
