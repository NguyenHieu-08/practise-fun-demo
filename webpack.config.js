const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Tải cấu hình từ file .env dựa trên NODE_ENV
const dotenvConfig = require('dotenv').config({ path: `.env` });
process.env = {
    ...process.env,
    ...dotenvConfig.parsed
}
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

    mode: process.env.NODE_ENV,
    devtool: process.env.DEV_TOOL,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        ...(isProduction
            ? {
                filename: '[name].[contenthash].js',
                chunkFilename: '[name].[contenthash].js',
            }
            : { filename: '[name].js' }
        ),
        publicPath: `${process.env.HOST_NAME}:${process.env.PORT}/`,
        clean: true,
    },
    optimization: {
        splitChunks: false,
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                    },
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: !isProduction,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern',
                            sourceMap: !isProduction,
                            sassOptions: {
                                indentedSyntax: false,
                            },
                        },
                    },
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, // Delay in milliseconds before rebuilding
        poll: 1000, // Check for changes every second
    },
    devServer: {
        port: process.env.PORT,
        historyApiFallback: true,
        hot: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        ...(isProduction
            ? [
                new MiniCssExtractPlugin({
                    filename: '[name].[contenthash].css',
                    chunkFilename: '[name].[contenthash].css',
                }),
            ]
            : []
        ),
        new ModuleFederationPlugin({
            name: 'productManagement',
            filename: 'productManagement.js',
            exposes: {
                './App': './src/App',
            },
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: false,
                    eager: true,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: false,
                    eager: true,
                },
            },
        }),
    ],

    // Stats
    stats: {
        children: true,
        errorDetails: true,
    },
};