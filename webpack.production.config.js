const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
    devtool: 'cheap-source-map',
    entry: [
        path.resolve(__dirname, 'src/client/main.tsx')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: './bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts[x]?$/,
                include: path.resolve(__dirname, 'src/client'),
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                
                include: path.resolve(__dirname, 'src/client'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                        loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new ExtractTextPlugin('bundle.css'),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CopyWebpackPlugin([
            { from: './src/client/index.html', to: './dist/index.html' }
        ])
    ]
};