const { defaults: tsjPreset } = require('ts-jest/presets')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    // Transform TS and JS files with babel-jest
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./__mocks__/ScanditDataCaptureCore.ts'],
}
