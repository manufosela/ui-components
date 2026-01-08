export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8112,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
