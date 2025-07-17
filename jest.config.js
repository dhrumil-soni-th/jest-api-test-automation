const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testTimeout: 10000, // 10 seconds timeout for all tests
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./test-results" }],
    [
      "jest-html-reporters",
      { publicPath: "./test-results", filename: "report.html" },
    ],
  ],
};
