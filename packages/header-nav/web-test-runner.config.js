export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8108,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
