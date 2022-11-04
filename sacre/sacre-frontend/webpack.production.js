const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = async () => ({
  mode: 'production',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  entry: './src/main/application/app.tsx',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main-bundle-[fullhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'file-loader',
      options: {
        name: 'assets/images/[name].[ext]'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL)
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/presentation/common/templates/production.html',
      favicon: './src/assets/images/common/favicon.png'
    })
  ]
})
