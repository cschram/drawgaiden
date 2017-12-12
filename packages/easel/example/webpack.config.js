const webpack = require('webpack');
const path = require('path');

module.exports = {
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        contentBase: './src',
        port: 8000
    },
    entry: path.resolve(__dirname, 'src/main.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                // include: path.resolve(__dirname, 'src'),
                loader: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.scss$/,
                // include: path.resolve(__dirname, 'src'),
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
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};