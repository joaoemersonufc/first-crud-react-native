const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = async () => ({
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    writeToDisk: true,
    historyApiFallback: true
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
    new Dotenv(),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    }),
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL)
    }),
    new HtmlWebpackPlugin({
      template: './src/presentation/common/templates/development.html',
      favicon: './src/assets/images/common/favicon.png'
    })
  ]
})
