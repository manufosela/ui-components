export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8119,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
