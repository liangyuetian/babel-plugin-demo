const {LogWebpackPlugin} = require('./plugin-webpack')

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,//排除掉node_module目录
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new LogWebpackPlugin()
    ]
}