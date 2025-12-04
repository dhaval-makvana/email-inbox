/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.tsx"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: ["**/?(*.)+(test|spec).[tj]s?(x)"],

  // 👇 modern ts-jest configuration (no warnings)
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
};
