export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8117,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
};
