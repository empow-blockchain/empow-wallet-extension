const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VENDOR_LISTS = require('./vendorLibs.json')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

const config = {
    entry: {
        polyfill: 'babel-polyfill',
        bundle: './popup/src/index.js',
        vendor: VENDOR_LISTS,
        background: './background/index.js',
        contentScript: './contentScript/index.js',
        injectScript: './contentScript/inject.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dev')
    },
    resolve: {
        alias: {
            'popup': path.resolve('popup/src'),
            'lib' : path.resolve('lib'),
            'constants': path.resolve('constants'),
            'modules': path.resolve('modules'),
        }
    },
    resolveLoader: {
        modules: ['node_modules'],
    },
    module: {
        rules : [
            {
                use: 'babel-loader',
                exclude: [/node_modules/, /modules/],
                test: /\.js$/
            },
            {
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
                exclude:  [/node_modules/, /modules/],
                test: /\.css$/,
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                }),
                exclude:  [/node_modules/, /modules/]
            },
            {
                use: 'file-loader',
                exclude:  [/node_modules/, /modules/],
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|svg)$/,
            }
        ]
    },
    plugins : [
        new webpack.IgnorePlugin(/^usb$/),
        new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jQuery",
            "window.jQuery": "jquery"
        }),
        new ChromeExtensionReloader({
            port: 8080, // Which port use to create the server
            reloadPage: true, // Force the reload of the page also
            entries: { // The entries used for the content/background scripts
                contentScript: 'contentScript', // Use the entry names, not the file name or the path
                background: 'background' // *REQUIRED
            }
        }),
        new HtmlWebpackPlugin({
            template: './extension/index.dev.html'
        }),
        new ExtractTextPlugin('bundle.styles.css'),
        
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|jquery|boostrap)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                }
            }
        }
    }
}
module.exports = config;