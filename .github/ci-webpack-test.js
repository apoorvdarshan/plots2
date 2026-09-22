const path = require('path')
const fs = require('fs')

// Yarn installs into public/lib (see .yarnrc modules-folder), not ./node_modules.
// Webpack 4's CLI then cannot find webpack-cli and prompts interactively in CI.
const libPath = path.resolve(__dirname, '../public/lib')
module.paths.unshift(libPath)

function resolveFromLib(id) {
  return require.resolve(id, { paths: [libPath] })
}

const config = {
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry: path.resolve(__dirname, '../app/javascript/packs/application.js'),
  output: {
    path: path.resolve(__dirname, '../public/packs-test/js'),
    filename: 'application.js',
    publicPath: '/packs-test/js/'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../app/javascript'),
      libPath,
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    modules: [libPath, 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../app/javascript'),
        use: {
          loader: resolveFromLib('babel-loader'),
          options: {
            presets: [
              resolveFromLib('@babel/preset-env'),
              resolveFromLib('@babel/preset-react')
            ]
          }
        }
      }
    ]
  }
}

function compile() {
  let webpack
  try {
    webpack = require(resolveFromLib('webpack'))
  } catch (error) {
    console.error('Cannot load webpack from', libPath)
    console.error(error)
    process.exit(1)
  }

  webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) console.error(err.details)
      process.exit(1)
    }

    console.log(stats.toString({ colors: false, modules: false, chunks: false }))
    if (stats.hasErrors()) process.exit(1)

    const out = path.join(config.output.path, config.output.filename)
    if (!fs.existsSync(out) || fs.statSync(out).size === 0) {
      console.error('webpack produced no output at', out)
      process.exit(1)
    }
    console.log('Wrote', out, fs.statSync(out).size, 'bytes')
  })
}

if (require.main === module) {
  compile()
}

module.exports = config
