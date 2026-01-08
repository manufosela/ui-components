export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  port: 8111,
  coverageConfig: { include: ['src/**/*.js'], exclude: ['**/node_modules/**'] },
};
