export default function rollupPluginTest () {
    return {
        name: 'rollupPluginTest', // this name will show up in warnings and errors
        options() {
            console.log('options')
        },
        buildStart(...arg) {
            console.log('buildStart', arg)
        },
        resolveId ( source ) { // 导入地址
            console.log('resolveId', source)
            if (source === 'virtual-module') {
                return source; // this signals that rollup should not ask other plugins or check the file system to find this id
            }
            return null; // other ids should be handled as usually
        },
        load ( fileResolvePath ) { // 文件绝对路径
            console.log('load', fileResolvePath)
            if (fileResolvePath === 'virtual-module') {
                return 'export default "This is virtual!"'; // the source code for "virtual-module"
            }
            return null; // other ids should be handled as usually
        },
        transform(code, fileResolvePath) {
            // code 源码 fileResolvePath 绝对路径
            console.log('transform', fileResolvePath)
        },
        banner(...arg) {
            console.log('banner', arg)
        },

    };
}