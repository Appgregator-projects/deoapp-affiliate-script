const path = require('path');

module.exports = {
  entry: './affiliateid.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};