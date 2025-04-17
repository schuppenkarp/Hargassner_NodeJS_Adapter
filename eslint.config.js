const { defineConfig } = require("eslint/config");

module.exports = defineConfig({
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
  },
});
