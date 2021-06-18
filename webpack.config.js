const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/index.ts',
    ui: './src/ui/index.ts',
    examples: './src/examples/index.ts'
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.m?ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/index.html',
          to: '.',
        },
        {
          from: 'src/examples/index.html',
          to: 'examples.html',
        },
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
  ],
  performance: {
    maxEntrypointSize: 2000000, // 2MB
    maxAssetSize: 4000000, // 4MB
  },
  devServer: {
    contentBase: './dist',
    // compress: true,
    // disableHostCheck: true,
    // hot: false,
    // inline: false,
    port: 3000,
    host: '0.0.0.0',
    // https: true,
  },
};
