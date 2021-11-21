
const code = require('fs').readFileSync('./code.js', {encoding: 'utf-8'})
const ast = require("@babel/parser").parse(code, {
    sourceType: "module",
    plugins: [
        // "jsx",
        // "typescript"
    ]
});

module.exports = ast
