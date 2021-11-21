const ast = require('./babel_parser')
const {default: traverse} = require('@babel/traverse')

traverse(ast, {
    Program(path) {
        console.log("Visiting: " + path.node.name);
        path.traverse({
            Identifier(path) {
                console.log("Visiting: " + path.node.name);
            }
        })
    }
})