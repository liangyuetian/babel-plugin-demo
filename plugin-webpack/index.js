class LogWebpackPlugin {
    // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
    apply(compiler) {
        const pluginName = LogWebpackPlugin.name
        const { webpack } = compiler;

        // Compilation 对象提供了对一些有用常量的访问。
        const { Compilation } = webpack;

        // RawSource 是其中一种 “源码”("sources") 类型，
        // 用来在 compilation 中表示资源的源码
        const { RawSource } = webpack.sources;

        // 绑定到 “thisCompilation” 钩子，
        // 以便进一步绑定到 compilation 过程更早期的阶段
        compiler.hooks.thisCompilation.tap(pluginName, compilation => {
            console.log('更早的执行')
        })

        // 指定一个挂载到 webpack 自身的事件钩子。
        compiler.hooks.emit.tapAsync(
            pluginName,
            (compilation, callback) => {
                console.log('插件名称：', pluginName)
                // console.log('这是一个示例插件！');
                // console.log(
                //     '这里表示了资源的单次构建的 `compilation` 对象：',
                //     // compilation
                // );
                // // 用 webpack 提供的插件 API 处理构建过程
                // compilation.addModule(/* ... */);
                callback();
            }
        );
    }
}
module.exports.LogWebpackPlugin = LogWebpackPlugin