export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8101,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    threshold: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};
