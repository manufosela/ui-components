export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8124,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    threshold: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  }
};
