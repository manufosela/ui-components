export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8116,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
