const path = require('path')

// Slim test compile: only app/javascript is babel-transpiled so webpack
// does not walk the huge public/lib tree that yarn uses as node_modules.
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../app/javascript/packs/application.js'),
  output: {
    path: path.resolve(__dirname, '../public/packs-test/js'),
    filename: 'application.js',
    publicPath: '/packs-test/js/'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../app/javascript'),
      path.resolve(__dirname, '../public/lib'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../app/javascript'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
}
