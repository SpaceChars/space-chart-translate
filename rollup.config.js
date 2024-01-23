import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";

import { terser } from "rollup-plugin-terser";

const name = "translate";

export default {
    input: "./index.ts",
    output: [
        {
            file: "./index.js",
            format: "umd",
            name,
            exports: "default",
            plugins: [terser()]
        }
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        nodePolyfills({ include: ["http*"] })
    ]
};
