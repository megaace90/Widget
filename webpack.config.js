const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: isDev ? 'development' : 'production',
    
    devServer: isDev ? {
      port: 8080,
      hot: true,
      open: true,
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    } : undefined,

    entry: path.resolve(__dirname, 'src/App/main.ts'),

    output: {
      filename: isDev ? 'weather-widget.js' : 'weather-widget.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      library: 'WeatherWidgetLib',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
    },

    resolve: {
      extensions: ['.ts', '.js', '.cjs', '.mjs', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    module: {
      rules: [
        { test: /\.vue$/, loader: 'vue-loader' },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { 
            appendTsSuffixTo: [/\.vue$/], 
            transpileOnly: true 
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        { 
          test: /\.css$/i, 
          use: ['style-loader', 'css-loader'] 
        },
        {
          test: /\.svg$/,
          loader: 'raw-loader'
        }
      ],
    },

    plugins: [
      new VueLoaderPlugin(),
      ...(isDev ? [
        new HtmlWebpackPlugin({
          template: './public/index.html',
          inject: true,
          filename: 'index.html'
        })
      ] : [])
    ],
    optimization: isDev ? {} : {
      minimize: true,
      splitChunks: false
    },
  };
};
