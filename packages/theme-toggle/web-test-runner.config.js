export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8125,
  coverageConfig: { include: ['src/**/*.js'], exclude: ['**/node_modules/**'] },
};
