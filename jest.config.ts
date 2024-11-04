module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest",
  // },
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testMatch: ['**/tests/*.test.*'],
};