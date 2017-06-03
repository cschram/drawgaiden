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
    entry: path.resolve(__dirname, 'src/main.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts[x]?$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
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
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};