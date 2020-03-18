const path = require('path')

const config = {
    mode: 'none',
    entry: {
        injectScript: './contentScript/inject.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'contentScript')
    },
    resolve: {
        alias: {
            'popup': path.resolve('popup/src'),
            'lib': path.resolve('lib'),
            'constants': path.resolve('constants')
        }
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                exclude: /node_modules/,
                test: /\.js$/
            }
        ]
    },
    performance: {
        hints: false
    }
}

module.exports = config