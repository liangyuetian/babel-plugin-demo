import json from '@rollup/plugin-json'
import {getBabelOutputPlugin} from '@rollup/plugin-babel'
import meRollupPlugin from './plugin-rollup/index'

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
        }),
        meRollupPlugin()
    ]
}