module.exports = {

    module: {
        rules: [
            {
                test:/\.js$/,
                exclude:/(node_modules|bower_components)/,//排除掉node_module目录
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }
}