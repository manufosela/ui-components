export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8107,
  coverageConfig: {
    include: ['src/**/*.js'],
    exclude: ['**/node_modules/**'],
  },
};
