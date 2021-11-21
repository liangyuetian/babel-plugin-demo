# Babel

## 介绍

Babel 是一个通用的多功能的 JavaScript 编译器。此外它还拥有众多模块可用于不同形式的静态分析。

> 静态分析是在不需要执行代码的前提下对代码进行分析的处理过程 （执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于语法检查，编译，代码高亮，代码转换，优化，压缩等等场景。

你可以使用 Babel 创建多种类型的工具来帮助你更有效率并且写出更好的程序。

## Babel 的基本内容

Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。

### 解析

解析步骤接收代码并输出 AST。 这个步骤分为两个阶段：**词法分析（Lexical Analysis） **和 语法分析（Syntactic Analysis）。.

#### 词法分析
词法分析阶段把字符串形式的代码转换为 令牌（tokens） 流。.

你可以把令牌看作是一个扁平的语法片段数组：

```js
n * n;
```
```js
[
    { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
    { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
    { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
]
```

每一个 type 有一组属性来描述该令牌：

```js
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
}
```

#### 语法分析
语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作。

### 转换

[https://en.wikipedia.org/wiki/Program_transformation](https://en.wikipedia.org/wiki/Program_transformation)

[转换](https://en.wikipedia.org/wiki/Program_transformation)步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分

### 生成

代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）。.

代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

> 写插件其实主要就是进行转换和生成

### 遍历

[https://en.wikipedia.org/wiki/Tree_traversal](https://en.wikipedia.org/wiki/Tree_traversal)

想要转换 AST 你需要进行递归的[树形遍历](https://en.wikipedia.org/wiki/Tree_traversal)

一个例子，
假设我们有一个 FunctionDeclaration 类型，它有几个属性：id，params，和 body，每一个都有一些内嵌节点。
```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```
1. 我们从 FunctionDeclaration 开始并且我们知道它的内部属性（即：id，params，body），所以我们依次访问每一个属性及它们的子节点。
2. 接着我们来到 id，它是一个 Identifier。Identifier 没有任何子节点属性，所以我们继续。
3. 之后是 params，由于它是一个数组节点所以我们访问其中的每一个，它们都是 Identifier 类型的单一节点，然后我们继续。
4. 此时我们来到了 body，这是一个 BlockStatement 并且也有一个 body节点，而且也是一个数组节点，我们继续访问其中的每一个。
   1. 这里唯一的一个属性是 ReturnStatement 节点，它有一个 argument，我们访问 argument 就找到了 BinaryExpression。
   2. BinaryExpression 有一个 operator，一个 left，和一个 right。 Operator 不是一个节点，它只是一个值因此我们不用继续向内遍历，我们只需要访问 left 和 right。

Babel 的转换步骤全都是这样的遍历过程。

### Visitors（访问者）

[https://en.wikipedia.org/wiki/Visitor_pattern](https://en.wikipedia.org/wiki/Visitor_pattern)

当我们谈及“进入”一个节点，实际上是说我们在访问它们， 之所以使用这样的术语是因为有一个访问者模式（visitor）的概念。.

访问者是一个用于 AST 遍历的跨语言的模式。 简单的说它们就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。 

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

const MyVisitor = {
    Identifier: {
        enter() {
            console.log("Entered!");
        },
        exit() {
            console.log("Exited!");
        }
    }
};
```
> 注意： Identifier() { ... } 是 Identifier: { enter() { ... } } 的简写形式。.

这是一个简单的访问者，把它用于遍历中时，每当在树中遇见一个 Identifier 的时候会调用 Identifier() 方法。

假设我们有一个树状结构：

```
- FunctionDeclaration
  - Identifier (id)
  - Identifier (params[0])
  - BlockStatement (body)
    - ReturnStatement (body)
      - BinaryExpression (argument)
        - Identifier (left)
        - Identifier (right)
```

当我们向下遍历这颗树的每一个分支时我们最终会走到尽头，于是我们需要往上遍历回去从而获取到下一个节点。 向下遍历这棵树我们进入每个节点，向上遍历回去时我们退出每个节点。

* 进入 FunctionDeclaration
  * 进入 Identifier (id)
  * 走到尽头
  * 退出 Identifier (id)
  * 进入 Identifier (params[0])
  * 走到尽头
  * 退出 Identifier (params[0])
  * 进入 BlockStatement (body)
  * 进入 ReturnStatement (body)
    * 进入 BinaryExpression (argument)
    * 进入 Identifier (left)
      * 走到尽头
    * 退出 Identifier (left)
    * 进入 Identifier (right)
      * 走到尽头
    * 退出 Identifier (right)
    * 退出 BinaryExpression (argument)
  * 退出 ReturnStatement (body)
  * 退出 BlockStatement (body)
* 退出 FunctionDeclaration

如有必要，你还可以把方法名用|分割成<code>Idenfifier |MemberExpression</code>形式的字符串，把同一个函数应用到多种访问节点。

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

也可以在访问者中使用别名(如定义).
[https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)

[https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2014-L2714](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2014-L2714)

比如有时候你需要对多个节点做同样的处理，可以使用 | 来分割类型，可以使用 别名 来简化
```js
const MyVisitor = {
  "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ObjectMethod|ClassMethod"(path) {}
};
```
===
```js
const MyVisitor = {
  Function(path) {}
};
```

### Paths（路径）

AST 通常会有许多节点，那么节点直接如何相互关联呢？ 我们可以使用一个可操作和访问的巨大可变对象表示节点之间的关联关系，或者也可以用Paths（路径）来简化这件事情。

Path 是表示两个节点之间连接的对象。

例如：一个函数节点
```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  ...
}
```
将子节点 Identifier 表示为一个路径（Path）的话，看起来是这样的：
```js
{
  "parent": {
    "type": "FunctionDeclaration",
    "id": {...},
    ....
  },
  "node": {
    "type": "Identifier",
    "name": "square"
  }
}
```
同时它还包含关于该路径的其他元数据：

```js
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```
当然路径对象还包含添加、更新、移动和删除节点有关的其他很多方法，稍后我们再来看这些方法。

在某种意义上，路径是一个节点在树中的位置以及关于该节点各种信息的响应式 Reactive 表示。 当你调用一个修改树的方法后，路径信息也会被更新。 Babel 帮你管理这一切，从而使得节点操作简单，尽可能做到无状态。

Paths in Visitors（存在于访问者中的路径）

当你有一个 Identifier() 成员方法的访问者时，你实际上是在访问路径而非节点。 通过这种方式，你操作的就是节点的 *响应式表示*（即路径）而非节点本身。

### Scopes（作用域）

接下来让我们介绍作用域（scope）的概念。 JavaScript 支持词法作用域，在树状嵌套结构中代码块创建出新的作用域。

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```
```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```
```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```
当编写一个转换时，必须小心作用域。我们得确保在改变代码的各个部分时不会破坏已经存在的代码。

我们在添加一个新的引用时需要确保新增加的引用名字和已有的所有引用不冲突。 或者我们仅仅想找出使用一个变量的所有引用， 我们只想在给定的作用域（Scope）中找出这些引用。

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

所有引用属于特定的作用域，引用和作用域的这种关系被称作：绑定（binding）。.
```js
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```

## 常用编译器的插件的开发

### babel plugin

```js
module.exports = function (babel) {
  return {
    pre() {},
    visitor: {
          
    },
    post(state) {}
  }
}
```
### webpack plugin

[自定义插件](https://webpack.docschina.org/contribute/writing-a-plugin/)
[一个用来展示webpack内置插件调用关系（钩子）的小工具](https://github.com/alienzhou/webpack-internal-plugin-relation)

webpack 可以使用 babel-loader 来处理js，这样我们写的 babel plugin 也能排上用场

```js
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
  }
}
```

插件形式：
```js
module.exports = class LogWebpackPlugin {
    apply(compiler) {
        
    }
}
```

### rollup plugin

[rollup plugin-development](https://www.rollupjs.com/guide/plugin-development)
[@rollup/plugin-babel](https://www.npmjs.com/package/@rollup/plugin-babel)

rollup 同样可以使用 babel 来处理js

rollup.config.js
```js
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

export default {
  input: 'src/rollup-code.js',
  output: {
    file: 'dist-rollup/bundle.js',
    exports: 'auto'
    // format: 'cjs'
  },
  plugins: [
    json(),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env']
    })
  ]
}
```
插件形式
```js
export default function rollupPluginTest () {
  return {
    name: 'pluginName',
    buildStart() {
        
    },
    load() {
          
    },
    tranform() {
          return {
              code: '',
              map: null // 如果可行将提供 source map
          }
    },
    buildEnd() {
        
    }
  }
}
```

### vite？

vite 是构建在 rollup 之上，所以 rollup 插件也能在 vite 中使用
(官方的原话是：为了提供更流畅的体验，Vite 选择了与单个打包器（Rollup）进行更深入的集成)

[https://www.vitejs.net/guide/api-plugin.html](https://www.vitejs.net/guide/api-plugin.html)

如果插件不使用 Vite 特有的钩子，可以实现为 兼容的 Rollup 插件，推荐使用 Rollup 插件名称约定。


## Babel 实用工具

#### [@babel/parser](https://github.com/babel/babel/tree/master/packages/babel-parser)
Babylon 是 Babel 的解析器。最初是 从Acorn项目fork出来的。Acorn非常快，易于使用，并且针对非标准特性(以及那些未来的标准特性) 设计了一个基于插件的架构。
现在 babylon 迁移到了 @babel/parser

#### [@babel/traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)
Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。

#### [@babel/types](https://github.com/babel/babel/tree/master/packages/babel-types)
Babel Types模块是一个用于 AST 节点的 Lodash 式工具库（译注：Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用。

#### [@babel/generator](https://github.com/babel/babel/tree/master/packages/babel-generator)
Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射（sourcemaps）。

#### [@babel/template](https://github.com/babel/babel/tree/master/packages/babel-template)
babel-template 是另一个虽然很小但却非常有用的模块。 它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成的大规模 AST的时候。 在计算机科学中，这种能力被称为准引用（quasiquotes）。











