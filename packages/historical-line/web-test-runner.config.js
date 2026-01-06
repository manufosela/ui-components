export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    reportDir: 'coverage',
    threshold: {
      statements: 70,
      branches: 60,
      functions: 35,
      lines: 70,
    },
  },
};
