export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8106,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
