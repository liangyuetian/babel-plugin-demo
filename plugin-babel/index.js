module.exports = function(babel, options, rootSrc) {
    return {
        pre(state) {
            console.log('babel-plugin start')
            this.cache = new Map();
        },
        visitor: {
            Identifier(path, state) {
                let name = path.node.name;
                // console.log(options, rootSrc)
                path.node.name = name
                    .split("")
                    .reverse()
                    .join("");
            },
        },
        post(state) {
            console.log('babel-plugin end')
        }
    };
}