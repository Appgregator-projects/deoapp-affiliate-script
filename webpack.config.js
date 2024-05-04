const path = require('path');

module.exports = {
  entry: './affiliateid.js',
  output: {
    filename: 'affiliateid.js',
    path: path.resolve(__dirname, 'dist'),
  },
};