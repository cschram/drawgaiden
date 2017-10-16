const webpack = require('webpack');
const path = require('path');

module.exports = {
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        contentBase: './src',
        port: 8000,
        proxy: {
            '/socket.io': {
                target: 'ws://localhost:9000',
                ws: true
            }
        }
    },
    entry: path.resolve(__dirname, 'src/main.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts[x]?$/,
                loader: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.[s]?css$/,
                loader: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png)$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};