export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8114,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
