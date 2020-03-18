const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const VENDOR_LISTS = require('./vendorLibs.json')
const TerserPlugin = require('terser-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const entry = {
    polyfill: 'babel-polyfill',
    bundle: './popup/src/index.js',
    vendor: VENDOR_LISTS,
    background: './background/index.js',
    contentScript: './contentScript/index.js'
}

const resolve = {
    alias: {
        'popup': path.resolve('popup/src'),
        'lib': path.resolve('lib'),
        'constants': path.resolve('constants'),
        'modules': path.resolve('modules'),
    }
}

const resolveLoader = {
    modules: ['node_modules']
}

const webpackModule = {
    rules: [
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
            exclude: [/node_modules/, /modules/],
            test: /\.css$/,
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            }),
            exclude: [/node_modules/, /modules/],
        },
        {
            use: 'file-loader',
            exclude: [/node_modules/, /modules/],
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|svg)$/,
        }
    ]
}

const plugins = [
    new webpack.IgnorePlugin(/^usb$/),
    new webpack.ProvidePlugin({
        $: "jquery",
        jquery: "jQuery",
        "window.jQuery": "jquery"
    }),
    new ExtractTextPlugin('bundle.styles.css'),
]

const optimization = {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/](react|react-dom|jquery|boostrap)[\\/]/,
                name: 'vendor',
                chunks: 'all',
            }
        }
    },
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_fnames: true,
                safari10: true,
            },
        }),
    ]
}

const performance = {
    hints: false
}

const stats = {
    warnings: false
}

const development = {
    mode: 'development',
    entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dev')
    },
    resolve,
    resolveLoader,
    module: webpackModule,
    plugins: plugins.concat([
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
        })
    ]),
    optimization,
    performance,
    stats
}

const production = {
    mode: 'production',
    entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    resolve,
    resolveLoader,
    module: webpackModule,
    plugins: plugins.concat([
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: './extension/popup.html',
            chunks: ['polyfill', 'vendor', 'bundle']
        }),
        new HtmlWebpackPlugin({
            filename: 'background.html',
            template: './extension/background.html',
            chunks: ['background']
        })
    ]),
    optimization,
    performance,
    stats
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        production.entry.injectScript = './contentScript/inject.js'
        return development
    }

    if (argv.mode === 'production') {
        return production
    }
};