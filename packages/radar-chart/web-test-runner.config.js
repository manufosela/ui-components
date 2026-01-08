export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8118,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
