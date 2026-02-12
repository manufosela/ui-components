export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8151,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
